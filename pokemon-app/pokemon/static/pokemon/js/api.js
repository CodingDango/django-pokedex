import POKEMON_LIST from '../data/pokemon_list.json' with { type: 'json' };
import ABILITY_LIST from '../data/abilities.json' with { type: 'json' };

const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/`;
const localPokemonList = POKEMON_LIST;

export function fetchPokemonDetails(pokemonNameOrId) {
    const endpoint = pokeApiUrl + pokemonNameOrId;

    return fetch(endpoint).then(response => {
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }

        return response.json();
    });
}

export function getListOfPokemonsLocal({amount = POKEMON_LIST.length, offset = 0, filterCallback = (pokemon) => true}) {
    let natIdx = 1 + offset;
    const pokemonsToReturn = [];

    while ((pokemonsToReturn.length < amount) && (natIdx <= POKEMON_LIST.length)) {
        const currPokemon = localPokemonList[(natIdx++) - 1];

        if (filterCallback(currPokemon)) {
            pokemonsToReturn.push(currPokemon);
        }
    }

    return pokemonsToReturn;
}

export function getPokemonFromLocal(nameOrId) {
    const id = Number(nameOrId);
    const isString = Number.isNaN(id);

    if (isString) {
        const loweredName = nameOrId.toLowerCase();
        return localPokemonList.find(pokemon => pokemon.name === loweredName);
    } else if (id > 0 && id <= localPokemonList.length) {
        return localPokemonList[id - 1];
    }

    return undefined;
}   

export function getAllAbilityNames() {
    return {
        [Symbol.iterator]: function() {
            return {
                currentIdx : 0,

                next() {
                    if (this.currentIdx < ABILITY_LIST.length) {
                        return {value: ABILITY_LIST[this.currentIdx++].name, done: false};
                    } else {
                        return {done: true};
                    }
                }
            }
        }    
    }
}