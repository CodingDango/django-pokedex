import POKEMON_LIST from '../data/pokemon_list.json' with { type: 'json' };
import ABILITY_LIST from '../data/abilities.json' with { type: 'json' };
import TYPE_LIST from '../data/types.json' with { type: 'json' };

const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/`;
const localPokemonList = POKEMON_LIST;
const pokemonTypes = TYPE_LIST.sort();

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

export function getWeightCategories() {
    return ['light', 'medium', 'heavy'];
}

export function getHeightCategories() {
    return ['small', 'medium', 'large'];
}

export function getHeightCategoryOfPokemon(pokemon) {
    const categories = getHeightCategories();
    const smallHeightMeters = 1;
    const averageHeightMeters = 3;

    if (pokemon.height < smallHeightMeters) {
        return categories[0];
    } else if (pokemon.height < averageHeightMeters) {
        return categories[1];
    } else {
        return categories[2];
    }
}

export function getWeightCategoryOfPokemon(pokemon) {
    const categories = getWeightCategories();
    const lightMaxKg = 13;  // in kg
    const mediumMaxKg = 50; // kg

    if (pokemon.weight < lightMaxKg) {
        return categories[0];
    } else if (pokemon.weight < mediumMaxKg) {
        return categories[1];
    } else {
        return categories[2];
    }
}

export function getAllPokemonTypes() {
    return pokemonTypes;
}

export function getTypeChart() {
    return {
        weaknesses: { 
        normal: ["fighting"], fire: ["water", "ground", "rock"], water: ["electric", "grass"], grass: ["fire", "ice", "poison", "flying", "bug"], electric: ["ground"], ice: ["fire", "fighting", "rock", "steel"], fighting: ["flying", "psychic", "fairy"], poison: ["ground", "psychic"], ground: ["water", "grass", "ice"], flying: ["electric", "ice", "rock"], psychic: ["bug", "ghost", "dark"], bug: ["fire", "flying", "rock"], rock: ["water", "grass", "fighting", "ground", "steel"], ghost: ["ghost", "dark"], dragon: ["ice", "dragon", "fairy"], dark: ["fighting", "bug", "fairy"], steel: ["fire", "fighting", "ground"], fairy: ["poison", "steel"] },
        resistances: { normal: [], fire: ["fire", "grass", "ice", "bug", "steel", "fairy"], water: ["fire", "water", "ice", "steel"], grass: ["water", "grass", "electric", "ground"], electric: ["electric", "flying", "steel"], ice: ["ice"], fighting: ["bug", "rock", "dark"], poison: ["grass", "fighting", "poison", "bug", "fairy"], ground: ["poison", "rock"], flying: ["grass", "fighting", "bug"], psychic: ["fighting", "psychic"], bug: ["grass", "fighting", "ground"], rock: ["normal", "fire", "poison", "flying"], ghost: ["poison", "bug"], dragon: ["fire", "water", "grass", "electric"], dark: ["ghost", "dark"], steel: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], fairy: ["fighting", "bug", "dark"] },
        immunities: { normal: ["ghost"], fire: [], water: [], grass: [], electric: [], ice: [], fighting: [], poison: [], ground: ["electric"], flying: ["ground"], psychic: [], bug: [], rock: [], ghost: ["normal", "fighting"], dragon: [], dark: ["psychic"], steel: ["poison"], fairy: ["dragon"] }
    };
}

export function calculateWeaknesses(pokemonTypes) {
  const finalWeaknesses = {};
  const typeChart = getTypeChart();

  // Loop through all 18 possible attack types
  for (const attackType of getAllPokemonTypes()) {
    let multiplier = 1;

    // Apply the multiplier for each of the Pokémon's types
    for (const defendingType of pokemonTypes) {
      if (typeChart.immunities[defendingType]?.includes(attackType)) {
        multiplier *= 0; // Immunity Trump Card
      } else if (typeChart.resistances[defendingType]?.includes(attackType)) {
        multiplier *= 0.5; // Resistance
      } else if (typeChart.weaknesses[defendingType]?.includes(attackType)) {
        multiplier *= 2; // Weakness
      }
    }

    // If the final multiplier is greater than 1, it's a weakness.
    if (multiplier > 1) {
      finalWeaknesses[attackType] = multiplier;
    }
  }

  return finalWeaknesses;
}