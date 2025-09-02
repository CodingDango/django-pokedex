import json
import asyncio
import aiohttp

# --- Configuration ---
INPUT_FILE = 'pokemon_list.json'
OUTPUT_FILE = 'abilities.json'
MAX_CONCURRENT_REQUESTS = 50 # Limit to 50 requests at a time to be kind to the API
MAX_RETRIES = 3 # Try a failing request up to 3 times

# --- Main Logic ---

async def fetch_pokemon_data(session, pokemon_id):
    """
    Asynchronously fetches data for a single Pokémon with retries.
    Returns the JSON data or None if it fails after all retries.
    """
    url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_id}'
    for attempt in range(MAX_RETRIES):
        try:
            async with session.get(url, timeout=10) as response:
                response.raise_for_status()  # Raises an exception for 4xx/5xx errors
                return await response.json()
        except aiohttp.ClientError as e:
            print(f"Request failed for Pokémon ID {pokemon_id} (Attempt {attempt + 1}/{MAX_RETRIES}). Error: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(2 ** attempt) # Exponential backoff: 1, 2, 4 seconds...
            else:
                print(f"Giving up on Pokémon ID {pokemon_id} after {MAX_RETRIES} failed attempts.")
    return None

async def process_pokemon(session, semaphore, pokemon):
    """
    A wrapper task for processing a single Pokémon dictionary.
    This fetches, processes, and updates the dictionary.
    """
    # --- This makes the script RESUMABLE! ---
    # If the 'ability' key already exists and is not None, skip the network request.
    if 'ability' in pokemon and pokemon.get('ability'):
        print(f"Skipping Pokémon ID {pokemon['id']} (already has data).")
        return pokemon

    async with semaphore: # This will wait if all 50 "slots" are full
        fetched_data = await fetch_pokemon_data(session, pokemon['id'])
        
        if not fetched_data:
            pokemon['ability'] = None # Mark as failed
            pokemon['error'] = 'Failed to fetch data'
            return pokemon

        # Find the first visible ability
        visible_ability = next((a for a in fetched_data['abilities'] if not a['is_hidden']), None)
        
        pokemon['ability'] = visible_ability['ability'] if visible_ability else None
        print(f"Processed Pokémon ID: {pokemon['id']}, Ability: {pokemon['ability']['name'] if pokemon['ability'] else 'None'}")
        
    return pokemon

async def main():
    """The main function to orchestrate the whole process."""
    # A semaphore limits how many requests can be running at the same time.
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    
    # Use a single session for all requests for better performance
    async with aiohttp.ClientSession() as session:
        # 1. Load the list of Pokémon
        try:
            with open(INPUT_FILE, 'r') as f:
                pokemons = json.load(f)
        except FileNotFoundError:
            print(f"Error: Input file '{INPUT_FILE}' not found.")
            return

        # 2. Create a list of tasks to run concurrently
        tasks = [process_pokemon(session, semaphore, p) for p in pokemons]
        
        # 3. Run all tasks and gather the results
        # The 'return_exceptions=False' means it will stop if a task has an unhandled crash,
        # but our process_pokemon function is designed to handle all errors gracefully.
        processed_pokemons = await asyncio.gather(*tasks)

        # 4. Save the updated list to a new file
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(processed_pokemons, f, indent=2)
            
        print(f"\nProcessing complete! Results saved to '{OUTPUT_FILE}'.")

# --- Run the script ---
if __name__ == "__main__":
    # This is how you run an async main function in Python
    asyncio.run(main())