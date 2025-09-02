import requests
import json
import concurrent.futures
from tqdm import tqdm
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --- SETUP FOR ROBUST SESSIONS ---
# This is the new part. We are creating a "session" with rules.
session = requests.Session()

# These are the rules for retrying.
retry_strategy = Retry(
    total=5,  # Try a total of 5 times
    status_forcelist=[429, 500, 502, 503, 504],  # Retry on these server error codes
    backoff_factor=1  # Wait 1s, 2s, 4s, 8s between retries
)

# Create an adapter with our retry rules
adapter = HTTPAdapter(max_retries=retry_strategy)

# Tell our session to use these rules for all http and https requests
session.mount("http://", adapter)
session.mount("https://", adapter)

# --- YOUR HELPER FUNCTIONS ---
# We just change this one function to use our new 'session' object

def fetchJson(url):
    try:
        # Instead of requests.get(), we use session.get()
        response = session.get(url, timeout=10) # Added a 10-second timeout
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        # This will now only print if all 5 retries fail
        print(f"\nAn error occurred for URL {url} after multiple retries: {e}")
        return None

# --- ALL YOUR OTHER FUNCTIONS ARE PERFECT ---
def getPokemonImageUrl(pokemonJson):
    # ... no change ...
    return pokemonJson['sprites']['other']['official-artwork']['front_default']

def getPokemonTypes(pokemonJson):
    # ... no change ...
    return [type_slot['type']['name'] for type_slot in pokemonJson['types']]

def fetch_and_process_pokemon(pokemon_info):
    # ... no change ...
    pokemon_json = fetchJson(pokemon_info['url'])
    if pokemon_json is None:
        return None
    processed_pokemon = {
        'id': pokemon_json['id'],
        'name': pokemon_info['name'].split('-')[0],
        'imageUrl': getPokemonImageUrl(pokemon_json),
        'types': getPokemonTypes(pokemon_json)
    }
    return processed_pokemon

def filterDuplicatePokemonNames(processed_pokemons):
    seenPokemonNames = set()
    filteredPokemons = []
    detectedAsDuplicate = []
    
    for pokemon in processed_pokemons:
        if not pokemon:
            continue
        
        if not pokemon['name'] in seenPokemonNames:
            seenPokemonNames.add(pokemon['name'])
            filteredPokemons.append(pokemon)
        else:
            detectedAsDuplicate.append(pokemon)    
        

    with open('missing_pokemons_true.json', 'w') as f:
        f.write(json.dumps(detectedAsDuplicate, indent=2))
    
    return filteredPokemons
    
# --- MAIN EXECUTION BLOCK (NO CHANGE NEEDED) ---
if __name__ == "__main__":
    # ... this whole section is perfect as is ...
    print("Fetching the main Pokémon list...")
    initial_list_url = 'https://pokeapi.co/api/v2/pokemon?limit=1025' 
    initial_data = fetchJson(initial_list_url)
    all_pokemons_info = initial_data['results']
    
    print(f"Fetching details for {len(all_pokemons_info)} Pokémon concurrently...")
    
    
        
    # with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    #     results = list(tqdm(executor.map(fetch_and_process_pokemon, all_pokemons_info), total=len(all_pokemons_info)))



    print(f"\nSaving {len(processed_pokemons)} Pokémon to pokemon_list.json...")
    with open('pokemon_list.json', 'w') as f:
        json.dump(processed_pokemons, f, indent=2)

    print("Done!")
    
    
    