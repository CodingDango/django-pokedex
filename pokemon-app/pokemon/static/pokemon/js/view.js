import { calculateWeaknesses, fetchPokemonDetails, getPokemonFromLocal } from './api.js';
import { capitalize, formatId } from './helpers.js'

document.addEventListener('DOMContentLoaded', () => {
    loadTypeWeaknesses();
    loadPrevAndNextNav();
    formatPokemonIdElement();
    delegateFormatIds()
});

function loadDocumentDataElementJson(selector) {
    const dataElement = document.querySelector(selector);

    if (!dataElement) {
        console.log(`"${selector}" data element could not be found`);
        return;
    }

    const dataString = dataElement.textContent;
    const dataJson = JSON.parse(dataString);

    return dataJson;
}

function loadTypeWeaknesses() {
    const pokemonTypes = loadDocumentDataElementJson('#typesOfPokemon');
    const container = document.getElementById('weaknesses')
    const weaknesses = calculateWeaknesses(pokemonTypes);

    for (const weakness of Object.keys(weaknesses)) {
        container.insertAdjacentHTML('beforeend', 
            `<span class="pokemon-card__type pokemon-card__type--${weakness}">
                ${capitalize(weakness)}
            </span>`
        )
    }
}

function loadPrevAndNextNav() {
    const maxPokemonId = 1025;
    const minPokemonId = 1;

    const id = loadDocumentDataElementJson('#pokemonId');
    const previousId = ((id - 1) < minPokemonId) ? maxPokemonId : id - 1;
    const nextId = ((id + 1) > maxPokemonId) ? minPokemonId : id + 1;

    const prevPokemonIdElement = document.getElementById('prev-pokemon-id');
    prevPokemonIdElement.textContent = `#${formatId(previousId)}`;

    const nextPokemonIdElement = document.getElementById('next-pokemon-id');
    nextPokemonIdElement.textContent = `#${formatId(nextId)}`;

    document.getElementById('prev-pokemon-name').textContent = capitalize(getPokemonFromLocal(previousId).name);
    document.getElementById('next-pokemon-name').textContent = capitalize(getPokemonFromLocal(nextId).name);

    prevPokemonIdElement.closest('a').href = `/${previousId}`;
    nextPokemonIdElement.closest('a').href = `/${nextId}`;
}

function formatPokemonIdElement() {
    const pokemonIdElement = document.getElementById('pokemon-id-element')
    
    if (!pokemonIdElement) return;

    const formattedIdStr = `#${formatId(parseInt(pokemonIdElement.textContent))}`
    pokemonIdElement.textContent = formattedIdStr;
}

function delegateFormatIds() {
    const elements = document.querySelectorAll('.format-id');

    for (const element of elements) {
        const formattedIdStr = `#${formatId(parseInt(element.textContent))}`;
        element.textContent = formattedIdStr;
    }
}