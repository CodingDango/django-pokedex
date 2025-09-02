import { handleSearchSubmit, getPokemonCardsContainer, renderPokemons, loadHomepageView, setLoadMoreBtnVisiblity} from "./ui.js";
import { getListOfPokemonsLocal, getAllAbilityNames } from "./api.js" ;
import { capitalize } from "./helpers.js";

const filterState = {
    'sort' : 'ascending',
    'types' : [] // empty means all. while ['fire'] means only types fire types.
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultPokemonAmountOnLoad = 12;

    loadHomepageView(defaultPokemonAmountOnLoad); 
    setupSearchListeners(defaultPokemonAmountOnLoad);
    addEventToLoadBtn(defaultPokemonAmountOnLoad);
    handleClickEvents();
    loadFilterOptions();
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
        const lastNatIdx = Number(getPokemonCardsContainer().lastElementChild.getAttribute('data-nat-dex'));
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

function handleClickEvents() {
    document.addEventListener('click', (event) => {
        delegateDropdowns(event);
        delegateToggleVisiblity(event);
        handleSortByClicks(event);
    });

}

function delegateDropdowns(event) {
    const isElementInsideDropdown = event.target.closest('.dropdown__target');
    const toggleBtn = event.target.closest('.dropdown__toggle');
    
    if (!toggleBtn && !isElementInsideDropdown) {
        disableAllDropdowns();
        return;
    } 

    if (toggleBtn) {
        const dropdownParent = event.target.closest('.dropdown');
        const dropdownTarget = dropdownParent.querySelector('.dropdown__target');
        const wasDropdownTargetOpen = dropdownTarget.classList.contains('dropdown__target--open');

        disableAllDropdowns();

        if (!wasDropdownTargetOpen) {
            dropdownTarget.classList.add('dropdown__target--open');
            
            const icon = toggleBtn.querySelector('.fa-chevron-down');

            if (icon) {
                icon.classList.add('.fa-chevron-up')
                icon.classList.remove('.fa-chevron-down');
            }
        }
    }
}

function disableAllDropdowns() {
    const allDropdownToggles = document.querySelectorAll('.dropdown__toggle');
    const allDropdowns = document.querySelectorAll('.dropdown__target');

    Array.from(allDropdowns).forEach(dropdown => dropdown.classList.remove('dropdown__target--open'));
    Array.from(allDropdownToggles).forEach(toggle => {
        const chevronElement = toggle.querySelector('fa-chevron-up');

        if (chevronElement) {
            chevronElement.classList.remove('fa-chevron-up');
            chevronElement.classList.add('fa-chevron-down');
        }
    });
}

function delegateToggleVisiblity(event) {
    const toggleBtn = event.target.closest('.visiblity__toggle');

    if (!toggleBtn) {
        return;
    }

    const targetSelector = toggleBtn.getAttribute('data-target');
    const targetToToggleVisiblity = document.querySelector(targetSelector);

    if (!targetToToggleVisiblity) {
        return;
    }
    
    targetToToggleVisiblity.classList.toggle('visiblity__target');
}

function handleSortByClicks(event) {
    const sortingOptions = event.target.closest('#sorting-options');

    if (!sortingOptions) return;

    const clickedOption = event.target.closest('button');

    if (!clickedOption) return;

    const chosenSort = clickedOption.getAttribute('data-value')?.toLowerCase();

    document.getElementById('active-sort-text').innerText = capitalize(chosenSort);
    filterState.sort = chosenSort;
}

function loadFilterTypeOptions() {
    const allPokemonTypes = [
        "normal",
        'fighting',
        "grass",
        "fire",
        "water",
        "electric",
        "flying",
        "bug",
        "poison",
        "ground",
        "rock",
        "ice",
        "dragon",
        'steel',
        'ghost',
        'dark',
        'psychic',
        'fairy'
    ].sort(); // sort alphabetically.

    const typesContainer = document.getElementById('filter-type-options');
    const weaknessContainer = document.getElementById('filter-weakness-options');
    
    if (!typesContainer || !weaknessContainer) return;

    allPokemonTypes.forEach(pokemonType => {
        const optionHTML =  createFilterTypeOptionHTML(pokemonType)
        typesContainer.insertAdjacentHTML('beforeend', optionHTML);
        weaknessContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
}

function createFilterTypeOptionHTML(type) {
    return `
        <label class="u-flex u-gap-16">
            <span class="pokemon-card__type pokemon-card__type--${type}">${capitalize(type)}</span>
            <span class="toggle">
                <input class="toggle__input" value="${type}" type="checkbox"/>
                <span class="toggle__ui"></span>
            </span>
        </label>`;
}

function loadAbilityOptions() {
    const abilityNames = getAllAbilityNames();
    const container = document.getElementById('filter-ability-options');

    if (!container) return;

    for (const name of abilityNames) {
        const itemHTML = `
            <button data-value="${name}" class="select__item">
              <span>${capitalize(name)}</span>
            </button>`;
        container.insertAdjacentHTML('beforeend', itemHTML);
    }
}

function loadFilterOptions() {
    loadFilterTypeOptions();
    loadAbilityOptions();
}