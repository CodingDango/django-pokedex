function formatDigits(number, amountOfDigits) {

    const strInt = number.toString();

    if (strInt.length >= amountOfDigits) return strInt;

    const zeroesToPrepend = (amountOfDigits - strInt.length);

    let zeroesStr = '';

    for (let i = 0; i < zeroesToPrepend; i++) { zeroesStr += '0' };

    return zeroesStr + strInt;
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function formatId(id) {
    const totalDigits = 4;
    return formatDigits(id, totalDigits);
}

function clearPokemonResults() {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
}

function getPokemonCardHtml(pokemonData) {
    const prominentType = pokemonData.types[0].type.name;

    const htmlToRender = `
        <article class="pokemon ${prominentType}">
          <header class="pokemon__header">
            <h2 class="pokemon__name">${capitalize(pokemonData.name)}</h2>
            <p class="pokemon__id">#${formatId(pokemonData.id)}</p>
          </header>
          <div class="pokemon__content-wrapper">
            <ul class="pokemon__types">
                ${pokemonData.types.reduce(
                    (accumulator, slot) => 
                        accumulator + `<li class='pokemon__type ${slot.type.name}'>${capitalize(slot.type.name)}</li>`,
                    ''
                    )
                }
            </ul>
            <img class="pokemon__sprite" src="${pokemonData.sprites.other['official-artwork'].front_default}"> 
          </div>
        </article>`;

    return htmlToRender;
}

function renderPokemon(pokemonData) {
    const resultsContainer = document.getElementById('results-container');
    const htmlToRender = getPokemonCardHtml(pokemonData);
    resultsContainer.insertAdjacentHTML('beforeend', htmlToRender);
}

function renderFetchError() {
    const resultsContainer = clearAndGetResultsContainer();
    resultsContainer.innerHTML = `
        <div class='results__grid__not_found'>
            <span>Pokemon not found...</span>
            <img class='results__grid__not_found__image' src='/static/pokemon/images/sadpika.png'>
        </div>
    `;
}

function fetchPokemon(pokemonNameOrId) {
    const pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`

    return fetch(pokemonApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokemon not found');
            }

            return response.json();
            }
        );
}

function addEventToSearchInput() {
    const searchInput = document.getElementById('search-input');

    searchInput?.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const pokemonName = searchInput.value.trim().toLowerCase();

            if (!pokemonName) {
                renderStartingPokemons();
            } else {
                fetchPokemon(pokemonName)
                    .then(pokemonData => {
                        clearPokemonResults();
                        renderPokemon(pokemonData);
                    })
                    .catch(error => renderFetchError());
            }
        }
    });
}

function renderStartingPokemons(totalPokemonsToRender = 10) {
    clearPokemonResults();

    for (let id = 1; id <= totalPokemonsToRender; id++) {
        fetchPokemon(id)
            .then(pokemonData => renderPokemon(pokemonData))
            .catch(error => console.log(error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    addEventToSearchInput();
    renderStartingPokemons();
});