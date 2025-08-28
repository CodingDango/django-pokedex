import json

with open('missing_pokemons_true.json', 'r') as jsonFile:    
    missingPokemons = json.load(jsonFile)
        
with open('pokemon_list.json', 'r+') as jsonFile:
    pokemons = json.load(jsonFile) 
        
    for pokemon in missingPokemons:
        pokemons.insert(pokemon['id'] - 1, pokemon)
    
with open('pokemon_list_final.json', 'w') as f:
    json.dump(pokemons, f, indent=2)

