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
        <article data-nat-dex=${pokemonData.id} class="pokemon ${pokemonData.types[0]}">
          <img class='pokemon__ball' src='/static/pokemon/images/pokeball2.svg'>
          <header class="pokemon__header">
            <h2 class="pokemon__name">${capitalize(pokemonData.name)}</h2>
            <p class="pokemon__id">#${formatId(pokemonData.id)}</p>
          </header>
          <div class="pokemon__content-wrapper">
            <ul class="pokemon__types">
                ${
                    pokemonData.types.reduce((listItemStr, type) => 
                        listItemStr += 
                            `<li class='${type}'>
                                <span>${capitalize(type)}</span>
                            <li>`
                        , ''
                    )
                }
            </ul>
            <img class="pokemon__sprite" src="${pokemonData.imageUrl}"> 
          </div>
        </article>`;

    return htmlToRender;
}

export function loadAndRenderPokemon(pokemonData) {
    const placeholderCard = getPokemonResultsContainer().querySelector(`#pokemon-placeholder-${pokemonData.id}`)    

    if (placeholderCard) {
        placeholderCard.outerHTML = createPokemonCardElement(pokemonData);
    }
}

export function renderSearchError() {
    clearPokemonResults();
    getPokemonResultsContainer().innerHTML = `
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
        <div data-nat-dex=${natDexId} id='pokemon-placeholder-${natDexId}' class="pokemon loading">
          <div class="indicator__wrapper">
            <span class="indicator"></span>
          </div>
        </div>
    `;
}

export function renderLoadingCardElement(natDexId) {
    getPokemonResultsContainer()
        ?.insertAdjacentHTML('beforeend', createLoadingCardElement(natDexId));
}

export function renderPokemons(pokemons) {
    for (const pokemon of pokemons) {
        renderLoadingCardElement(pokemon.id);
        loadAndRenderPokemon(pokemon);
    }   
}

export function clearPokemonResults() {
    getPokemonResultsContainer().innerHTML = '';
}

export function getPokemonResultsContainer() {
    return document.getElementById('results-container');
}