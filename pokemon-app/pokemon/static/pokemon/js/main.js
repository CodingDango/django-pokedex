import { handleSearchSubmit, getPokemonCardsContainer, renderPokemons, loadHomepageView, setLoadMoreBtnVisiblity} from "./ui.js";
import { getListOfPokemonsLocal, getAllAbilityNames } from "./api.js" ;
import { capitalize } from "./helpers.js";

const filterState = {
    'sort' : 'ascending',
    'types' : [], // empty means all. while ['fire'] means only types fire types.
    'weaknesses' : [],
    'abilities' : []
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
        // handleSortByClicks(event);
        delegateClickAndReplaceText(event);
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

function handleFilterClicksStateUpdate() {
    // idk, update the state? check the uh. clicked elements and stuff. and
}

function delegateClickAndReplaceText(event) {
    const componentContainer = event.target.closest('.click-and-replace-text');

    if (!componentContainer) {
        return;
    }

    const clickedElement = event.target.closest('.click-and-replace-text__toggle') ;

    if (!clickedElement) {
        return;
    }

    const elementToReplaceText = componentContainer.querySelector('.click-and-replace-text__text');

    if (!elementToReplaceText) {
        return;
    }

    elementToReplaceText.innerText = capitalize(clickedElement.innerText);
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
    
    if (!typesContainer) return;

    allPokemonTypes.forEach(pokemonType => {
        const optionHTML =  createFilterTypeOptionHTML(pokemonType)
        typesContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
}

function createFilterTypeOptionHTML(type) {
    return `
        <div class="u-flex u-gap-16">
            <span class="pokemon-card__type pokemon-card__type--${type}">${capitalize(type)}</span>
            <span class='u-flex u-gap-8'>
                <label class="toggle">
                    <input class="toggle__input" data-filter='type' value="${type}" type="checkbox"/>
                    <span class="toggle__ui toggle__ui--type"></span>
                </label>
                <label class="toggle">
                    <input class="toggle__input" data-filter='weakness' value="${type}" type="checkbox"/>
                    <span class="toggle__ui toggle__ui--weakness"></span>
                </label>
            </span>
        </div>`;
}

function createSelectItemHTML(text, dataValue, ...extraClasses) {
    return `<button data-value='${dataValue}' class='select__item ${extraClasses.join(' ')}'>${capitalize(text)}</button>`
}

function loadAllFilterOptionToDropdowns() {
    const dropdownTargets = document.querySelectorAll('.dropdown__target.add-all');

    for (const dropdown of dropdownTargets) {
        dropdown.insertAdjacentHTML('afterbegin', createSelectItemHTML('all', 'all', 'click-and-replace-text__toggle'));
    }
}

function loadAbilityOptions() {
    const abilityNames = getAllAbilityNames();
    const container = document.getElementById('filter-ability-options');

    if (!container) return;

    for (const name of abilityNames) {
        const itemHTML = createSelectItemHTML(name, name, 'click-and-replace-text__toggle')
        container.insertAdjacentHTML('beforeend', itemHTML);
    }
}

function loadFilterOptions() {
    loadAllFilterOptionToDropdowns();   
    loadFilterTypeOptions();
    loadAbilityOptions();
}