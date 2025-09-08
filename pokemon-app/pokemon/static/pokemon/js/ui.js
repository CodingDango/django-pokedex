import { capitalize, formatId, areElementsInArray} from './helpers.js';
import { 
    getListOfPokemonsLocal, 
    getWeightCategoryOfPokemon, 
    getHeightCategoryOfPokemon,
    calculateWeaknesses
} from './api.js';

import { setFilteredPokemons, shiftFilteredPokemons, filteredPokemons } from './state.js';


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
          <a href='/${pokemonData.id}' class='pokemon-card__link'></a>
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

export function handleSearchSubmit(defaultAmt, filterState) {
    let pokemonName = document.getElementById('search-input')?.value.trim().toLowerCase();
    let pokemons;

    if (!pokemonName) {
        pokemons = getListOfPokemonsLocal({});
    } else {
        pokemons = getListOfPokemonsLocal(
            {filterCallback: (pokemon) => pokemon.name.includes(pokemonName)}
        );
    }

    // filter by types?   
    if (filterState.types.length > 0) {
        pokemons = pokemons.filter(pokemon => areElementsInArray(filterState.types, pokemon.types));
    }

    // i havent decided on weaknesses yet... how do weaknesses work?
    if (filterState.weaknesses.length > 0) {
        pokemons = pokemons.filter(pokemon => {
            const weaknesses = Object.keys(calculateWeaknesses(pokemon.types));
            return areElementsInArray(filterState.weaknesses, weaknesses);
        });
    }

    // filter by abilities if they have it?
    if (filterState.ability !== 'all') {
        pokemons = pokemons.filter(pokemon => (pokemon.ability === filterState.ability));
    }

    // filter by weight?

    if (filterState.weight !== 'all') {
        pokemons = pokemons.filter(pokemon => (getWeightCategoryOfPokemon(pokemon) === filterState.weight));
    }

    // filter by height?
    if (filterState.height !== 'all') {
        pokemons = pokemons.filter(pokemon => (getHeightCategoryOfPokemon(pokemon) === filterState.height));
    }

    // now filter by id range if they are in the range?
    pokemons = pokemons.filter(pokemon => (filterState.fromId <= pokemon.id && pokemon.id <= filterState.toId));

    // now sort by ascending or descending ids?
    pokemons = pokemons.sort((pokemonA, pokemonB) => 
        (filterState.sort === 'ascending') 
        ? pokemonA.id - pokemonB.id
        : pokemonB.id - pokemonA.id
    );

    setFilteredPokemons(pokemons);

    let i = 0;
    let pokemonsToDisplay = [];

    while ((i++ < defaultAmt) && filteredPokemons.length > 0) {
        pokemonsToDisplay.push(shiftFilteredPokemons());
    }

    loadQueriedPokemonsView(pokemonsToDisplay);
}

export function loadQueriedPokemonsView(pokemons) {
    clearPokemonResults();

    if (pokemons.length === 1) {
        setLoadMoreBtnVisiblity(false);
    } else {
        setLoadMoreBtnVisiblity(true);
    }

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