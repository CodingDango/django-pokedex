import { capitalize, formatId } from './helpers.js';
import { fetchPokemonDetails, getListOfPokemonsLocal, getPokemonFromLocal } from './api.js';

export function setLoadMoreBtnVisiblity(show) {
    const loadMoreBtn = document.getElementById('load-more');
    
    if (show) {
        loadMoreBtn.classList.remove('button--hidden');
    } else {
        loadMoreBtn.classList.add('button--hidden');
    }
}

export function createPokemonCardElement(pokemonData) {
    const htmlToRender = `
        <article data-nat-dex=${pokemonData.id} class="pokemon-card pokemon-card--${pokemonData.types[0]}">
          <img class='pokemon-card__ball' src='/static/pokemon/images/pokeball2.svg'>
          <header class="pokemon-card__header">
            <h2 class="pokemon-card__name">${capitalize(pokemonData.name)}</h2>
            <p class="pokemon-card__id">#${formatId(pokemonData.id)}</p>
          </header>
          <div class="pokemon-card__content-wrapper">
            <ul class="pokemon-card__types">
                ${
                    pokemonData.types.reduce((listItemStr, type) => 
                        listItemStr += 
                            `<li><span class='pokemon-card__type pokemon-card__type--${type}'>${capitalize(type)}</span><li>`
                        , ''
                    )
                }
            </ul>
            <img class="pokemon-card__sprite" src="${pokemonData.imageUrl}"> 
          </div>
        </article>`;

    return htmlToRender;
}

export function loadAndRenderPokemon(pokemonData) {
    const placeholderCard = getPokemonCardsContainer()
        .querySelector(`[data-nat-dex="${pokemonData.id}"]`)    

    if (placeholderCard) {
        placeholderCard.outerHTML = createPokemonCardElement(pokemonData);
    }
}

export function renderSearchError() {
    clearPokemonResults();
    getPokemonCardsContainer().innerHTML = `
        <div class='results__grid__not_found'>
            <span>Pokemon not found...</span>
            <img class='results__grid__not_found__image' src='/static/pokemon/images/sadpika.png'>
        </div>
    `;
}

export function handleSearchSubmit(defAmtToRender) {
    let pokemonName = document.getElementById('search-input')?.value.trim().toLowerCase();

    if (!pokemonName) {
        loadHomepageView(defAmtToRender);
        return;
    }

    const results = getListOfPokemonsLocal(
        {filterCallback: (pokemon) => pokemon.name.includes(pokemonName), amount: defAmtToRender}
    )

    loadQueriedPokemonsView(results);
}

export function loadHomepageView(defAmtToRender) {
    setLoadMoreBtnVisiblity(true);
    clearPokemonResults();
    renderPokemons(getListOfPokemonsLocal({amount: defAmtToRender}));
}

export function loadQueriedPokemonsView(pokemons) {
    clearPokemonResults();

    if (!pokemons || pokemons.length == 0) {
        renderSearchError();
    } else {
        renderPokemons(pokemons);
    }
}

export function createLoadingCardElement(natDexId) {
    return `
        <div data-nat-dex=${natDexId} class="pokemon-card pokemon-card--loading">
          <div class="pokemon-card__loader-wrapper">
            <span class="pokemon-card__loader"></span>
          </div>
        </div>
    `;
}

export function renderLoadingCardElement(natDexId) {
    getPokemonCardsContainer()
        ?.insertAdjacentHTML('beforeend', createLoadingCardElement(natDexId));
}

export function renderPokemons(pokemons) {
    for (const pokemon of pokemons) {
        renderLoadingCardElement(pokemon.id);
        loadAndRenderPokemon(pokemon);
    }   
}

export function clearPokemonResults() {
    getPokemonCardsContainer().innerHTML = '';
}

export function getPokemonCardsContainer() {
    return document.getElementById('pokemon-cards-container');
}