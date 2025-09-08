import { calculateWeaknesses } from './api.js';
import { capitalize } from './helpers.js'

document.addEventListener('DOMContentLoaded', () => {
    const typesDataElement = document.getElementById('typesOfPokemon');
    const typesJsonString = typesDataElement.textContent;
    const pokemonTypes = JSON.parse(typesJsonString);

    const container = document.getElementById('weaknesses')
    const weaknesses = calculateWeaknesses(pokemonTypes);

    for (const weakness of Object.keys(weaknesses)) {
        container.insertAdjacentHTML('beforeend', 
            `<span class="pokemon-card__type pokemon-card__type--${weakness}">
                ${capitalize(weakness)}
            </span>`
        )
    }
});