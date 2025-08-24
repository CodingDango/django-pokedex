function setLoadMoreBtnVisiblity(show) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (show) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }
}

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

function getPokemonResultsContainer() {
    return document.getElementById('results-container');
}

function clearPokemonResults() {
    getPokemonResultsContainer().innerHTML = '';
}

function getPokemonCardHtml(pokemonData) {
    const prominentType = pokemonData.types[0].type.name;

    const htmlToRender = `
        <article data-nat-dex=${pokemonData.id} class="pokemon ${prominentType}">
          <img class='pokemon__ball' src='/static/pokemon/images/pokeball2.svg'>
          <header class="pokemon__header">
            <h2 class="pokemon__name">${capitalize(pokemonData.name)}</h2>
            <p class="pokemon__id">#${formatId(pokemonData.id)}</p>
          </header>
          <div class="pokemon__content-wrapper">
            <ul class="pokemon__types">
                ${pokemonData.types.reduce(
                    (accumulator, slot) => 
                        accumulator + 
                        `<li class='pokemon__type ${slot.type.name}'>
                            <span>${capitalize(slot.type.name)}</span>
                        </li>`,
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
    const placeholderCard = getPokemonResultsContainer().querySelector(`#pokemon-placeholder-${pokemonData.id}`)    

    if (placeholderCard) {
        placeholderCard.outerHTML = getPokemonCardHtml(pokemonData);
    }
}

function renderFetchError() {
    clearPokemonResults();
    getPokemonResultsContainer().innerHTML = `
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

function searchCallback(defAmtToRender) {
    let pokemonName = document.getElementById('search-input')?.value.trim().toLowerCase();

    if (!pokemonName) {
        renderHomePokemons(defAmtToRender);
        return;
    }
    
    fetchPokemon(pokemonName)
        .then(pokemonData => {
            renderSearchedPokemon(pokemonData);
        })
        .catch(error => renderFetchError());
    }

function renderHomePokemons(defAmtToRender) {
    setLoadMoreBtnVisiblity(true);
    clearPokemonResults();
    renderPokemons(defAmtToRender);
}

function renderSearchedPokemon(pokemonData) {
    setLoadMoreBtnVisiblity(false);
    clearPokemonResults();
    renderLoadingCard(pokemonData.id);
    renderPokemon(pokemonData);
}

function addEventsToSearchComponents(defAmtToRender) {
    addEventToSearchBtn(defAmtToRender);
    addEventToSearchInput(defAmtToRender);
}

function addEventToSearchBtn(defAmtToRender) {
    const searchBtn = document.getElementById('search-btn');
        searchBtn?.addEventListener('click', () => searchCallback(defAmtToRender))
}

function addEventToSearchInput(defAmtToRender) {
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') searchCallback(defAmtToRender) 
    });
}

function getLoadingCardHtml(natDexId) {
    return `
        <div data-nat-dex=${natDexId} id='pokemon-placeholder-${natDexId}' class="pokemon loading">
          <div class="indicator__wrapper">
            <span class="indicator"></span>
          </div>
        </div>
    `;
}

function renderLoadingCard(natDexId) {
    getPokemonResultsContainer()
        ?.insertAdjacentHTML('beforeend', getLoadingCardHtml(natDexId));
}

function renderPokemons(totalPokemonsToRender = 10, startingNatDexId=1) {
    // Get the results container, and count the total pokemons being loaded.
    const end = (startingNatDexId + totalPokemonsToRender) - 1;

    for (let natId = startingNatDexId; natId <= end; natId++) {
        renderLoadingCard(natId);
        fetchPokemon(natId)
            .then(pokemonData => renderPokemon(pokemonData))
            .catch(error => console.log(error));
    }   
}

function addEventToLoadBtn(pokemonToLoad) {
    // get the id of the last element..?
    document.getElementById('load-more-btn').addEventListener('click', () => {
        const lastId = +getPokemonResultsContainer().lastElementChild.getAttribute('data-nat-dex');
        const startingId = lastId + 1;
        renderPokemons(pokemonToLoad, startingId);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultPokemonAmountOnLoad = 30;

    addEventsToSearchComponents(defaultPokemonAmountOnLoad);
    renderPokemons(defaultPokemonAmountOnLoad); 
    addEventToLoadBtn(defaultPokemonAmountOnLoad);
});