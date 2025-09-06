export const filterState = {
    'sort' : 'ascending',
    'types' : [], // empty means all. while ['fire'] means only types fire types.
    'weaknesses' : [],
    'ability' : null
}

export let filteredPokemons = [];

export function updateFilterState(property, value) {
    filterState[property] = value;
}

export function getFilterState() {
    return filterState;
}

export function setFilteredPokemons(pokemons) {
    filteredPokemons = pokemons;
}

export function shiftFilteredPokemons() {
    return filteredPokemons.shift();
}

export function clearFilteredPokemons() {
    filteredPokemons = []
}