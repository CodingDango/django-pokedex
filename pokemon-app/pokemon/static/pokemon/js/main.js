import { handleSearchSubmit, getPokemonResultsContainer, renderPokemons, loadHomepageView, setLoadMoreBtnVisiblity} from "./ui.js";
import { getListOfPokemonsLocal } from "./api.js" ;

document.addEventListener('DOMContentLoaded', () => {
    const defaultPokemonAmountOnLoad = 30;

    loadHomepageView(defaultPokemonAmountOnLoad); 
    setupSearchListeners(defaultPokemonAmountOnLoad);
    addEventToLoadBtn(defaultPokemonAmountOnLoad);
});

function setupSearchListeners(defAmtToLoad) {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') handleSearchSubmit(defAmtToLoad);
    });
    searchBtn.addEventListener('click', () => handleSearchSubmit(defAmtToLoad));


}

function addEventToLoadBtn(defPokemonToLoad) {
    // get the id of the last element..?
    document.getElementById('load-more').addEventListener('click', () => {
        const lastNatIdx = Number(getPokemonResultsContainer().lastElementChild.getAttribute('data-nat-dex'));
        const pokemonsToLoad = getListOfPokemonsLocal(
            {amount: defPokemonToLoad, offset: lastNatIdx}
        );

        if (pokemonsToLoad.length === 0) {
            setLoadMoreBtnVisiblity(false);
            return;
        }

        renderPokemons(pokemonsToLoad);
    });
}

