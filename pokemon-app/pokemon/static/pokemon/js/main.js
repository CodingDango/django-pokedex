import { handleSearchSubmit, getPokemonCardsContainer, renderPokemons, loadHomepageView, setLoadMoreBtnVisiblity} from "./ui.js";
import { getListOfPokemonsLocal, getAllAbilityNames, getHeightCategories, getWeightCategories} from "./api.js" ;
import { capitalize } from "./helpers.js";

const filterState = {
    'sort' : 'ascending',
    'types' : [], // empty means all. while ['fire'] means only types fire types.
    'weaknesses' : [],
    'ability' : null
}

function updateFilterState(property, value) {
    filterState[property] = value;
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultPokemonAmountOnLoad = 15;

    loadHomepageView(defaultPokemonAmountOnLoad); 
    setupSearchListeners(defaultPokemonAmountOnLoad);
    addEventToLoadBtn(defaultPokemonAmountOnLoad);
    handleKeyboardInputs();
    handleClickEvents();
    loadFilterOptions();

    // at the start, reset all filter states
    resetFilterComponents();

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
        delegateClickAndReplaceText(event);
        handleFilterClicksStateUpdate(event);
        handleClickToResetFilters(event);
    });
}

function handleKeyboardInputs() {
    document.addEventListener('input', (event) => {
        setupNumberInputsValidation(event);
        handleFilterInputStateUpdate(event);
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

function handleFilterClicksStateUpdate(event) {
    const container = event.target.closest('.filter-state-container');

    if (!container) {
        return;
    }
    
    const modifierFuncs = {
        'filter-state-container--select' : handleFilterStateSelect,
        'filter-state-container--checkboxes' : handleFilterStateCheckboxes,
    };

   for (const [containerClassName, func] of Object.entries(modifierFuncs)) {
        if (container.classList.contains(containerClassName)) {
            func(event, container);
            break;
        }
   }
}

function handleFilterInputStateUpdate(event) {
    const container = event.target.closest('.filter-state-container');

    if (!container) {
        return;
    }

    const modifierFuncs = {
        'filter-state-container--inputs' : handleFilterStateInputs
    };

   for (const [containerClassName, func] of Object.entries(modifierFuncs)) {
        if (container.classList.contains(containerClassName)) {
            func(event, container);
            break;
        }
   }
}

function handleFilterStateSelect(event, container) {
    const selectedFilter = event.target.closest('.filter-state-select');

    if (!selectedFilter) {
        return;
    }

    const filterValue = selectedFilter.getAttribute('data-filter');
    const filterProperty = container.getAttribute('data-filter-property');

    updateFilterState(filterProperty, filterValue);
}

function handleFilterStateCheckboxes(event, container) {
    // Key will be filter property.
    // value will be values to add to the filter property.
    const tracker = new Map();
    const filterKeys = new Set();
    const toggledCheckboxes = container.querySelectorAll('input:checked');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');

    // prepopulate filterKeys
    for (const checkbox of checkboxes) {
        filterKeys.add(checkbox.dataset.filter);
    }

    // Clear all the filterKeys inside contiainer
    for (const filterKey of filterKeys) {
        updateFilterState(filterKey, []);
    }

    for (const checkbox of toggledCheckboxes) {
        const filterKey = checkbox.dataset.filter;
        const filterValue = checkbox.dataset.value;

        if (tracker.has(filterKey)) {
            tracker.get(filterKey).push(filterValue);
        } else {
            tracker.set(filterKey, [filterValue]);
        }
    }

    Array.from(tracker.keys()).forEach(key => 
        updateFilterState(key, tracker.get(key))
    );
}

function handleFilterStateInputs(event, container) {
    const inputs = container.querySelectorAll('input[type="number"], input[type="text"]');

    for (const input of inputs) {
        updateFilterState(input.dataset.filter, input.value)   
    }
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
                    <input class="toggle__input" data-filter='types' data-value="${type}" type="checkbox"/>
                    <span class="toggle__ui toggle__ui--type"></span>
                </label>
                <label class="toggle">
                    <input class="toggle__input" data-filter='weaknesses' data-value="${type}" type="checkbox"/>
                    <span class="toggle__ui toggle__ui--weakness"></span>
                </label>
            </span>
        </div>`;
}

function createSelectItemHTML(text, dataValue, ...extraClasses) {
    return `<button data-filter='${dataValue}' class='select__item ${extraClasses.join(' ')}'>${capitalize(text)}</button>`
}

function addAllOptionToDropdowns() {
    const dropdownTargets = document.querySelectorAll('.dropdown__target.add-all');

    for (const dropdown of dropdownTargets) {
        const optionHTML = createSelectItemHTML('all', 'all', 'click-and-replace-text__toggle', 'filter-state-select');
        dropdown.insertAdjacentHTML('afterbegin', optionHTML);

        const newlyAddedOption = dropdown.firstElementChild;

        if (newlyAddedOption) {
            newlyAddedOption.dataset.default = true;
        }
    }
}

function loadAbilityOptions() {
    const abilityNames = getAllAbilityNames();
    const container = document.getElementById('filter-ability-options');

    if (!container) return;

    for (const name of abilityNames) {
        const itemHTML = createSelectItemHTML(name, name, 'click-and-replace-text__toggle', 'filter-state-select')
        container.insertAdjacentHTML('beforeend', itemHTML);
    }
}

function loadFilterOptions() {
    addAllOptionToDropdowns();   
    loadFilterTypeOptions();
    loadAbilityOptions();
    addCategoriesToHeight();
    addCategoriesToWeight();
}

function handleClickToResetFilters(event) {
    const resetBtn = event.target.closest('#reset-filters');

    if (!resetBtn) return;

    resetFilterComponents();
}

function resetFilterComponents() {
    resetDropdownFilters();   
    resetCheckboxFilters();
    resetInputFilters();
}

function resetDropdownFilters() {
    const filtersContainer = document.getElementById('filters');
    const dropdownsToReset = filtersContainer.querySelectorAll('.dropdown');

    for (const dropdown of dropdownsToReset) {
        const defaultOption = dropdown.querySelector('[data-default=true]');
        const dropdownTarget = dropdown.querySelector('.dropdown__target')

        const defaultFilter = defaultOption.dataset.filter;
        const filterProperty = dropdownTarget.getAttribute('data-filter-property');

        updateFilterState(filterProperty, defaultFilter);

        const textToUpdate = dropdown.querySelector('.click-and-replace-text__text');

        if (textToUpdate) {
            textToUpdate.innerText = capitalize(defaultFilter);
        }
    }
}

function resetCheckboxFilters() {
    const filtersContainer = document.getElementById('filters');
    const allCheckboxes = filtersContainer.querySelectorAll('input[type="checkbox"]');
    
    const map = new Map();

    for (const checkbox of allCheckboxes) {
        const filterProperty = checkbox.dataset.filter;
        const filterValue = checkbox.dataset.value;

        if (!map.has(filterProperty)) {
            map.set(filterProperty, []);
        }

        if (checkbox.dataset.default && map.has(filterProperty)) {
            map.get(filterProperty).push(filterValue);
        } else {
            checkbox.checked = false;
        }
    }

    for (const [property, defaultValues] of map.entries()) {
        updateFilterState(property, defaultValues);
    }
}   

function resetInputFilters() {
    const filtersContainer = document.getElementById('filters');
    const allInputs = filtersContainer.querySelectorAll('input[type="number"], input[type="text"]');

    for (const input of allInputs) {
        updateFilterState(input.dataset.filter, input.dataset.default);
        input.value = input.dataset.default;
    }
}

function setupNumberInputsValidation(event) {
    const input = event.target;

    if (!input || !input.classList.contains('validate__number-input')) return;

    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const value = parseFloat(input.value);

    const clampedValue = Math.min(Math.max(value, min), max);
    input.value = clampedValue;
}

function addCategoriesToWeight() {
    const weightCategoriesContainer = document.getElementById('weight-categories');

    getWeightCategories().forEach(category => {
        const optionHTML = createSelectItemHTML(capitalize(category), category, 'click-and-replace-text__toggle', 'filter-state-select');
        weightCategoriesContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
}

function addCategoriesToHeight() {
    const weightCategoriesContainer = document.getElementById('height-categories');

    getHeightCategories().forEach(category => {
        const optionHTML = createSelectItemHTML(capitalize(category), category, 'click-and-replace-text__toggle', 'filter-state-select');
        weightCategoriesContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
}