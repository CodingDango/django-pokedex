# Project MVP

[x] A home view containing a search bar and card grid below.
[x] Pressing enter in the search bar fetches a pokemon from the pokemon api.
[x] If no pokemon is found, render a sad pokemon emoji above the grid as header text.
[x] If there are pokemon found, loop through each one and render their front sprite, if there is no front sprite, settle for a placeholder null image, and render their name and types.
[x] make fetchPokemon() return data rather than doing 3 jobs, which are get the data, render the data, or render the error.
[x] inside renderPokemon function, when there is more than one type, there is a ',' character in between the <li>. fix this.
[x] improve the BEM style names in style.css ask AI for some help.
[x] While data is fetching, take the results section and slap in a loading screen.
[x] Redesign the whole page. my CSS is rusty and everything looks bad. im unsure if i should use basic CSS and learn SCSS or SASS? (im not sure what these are) or stick with tailwindcss. okay on second thought we'll keep CSS. i need to relearn my fundamentals.
[x] in homepage, render the first 25 pokemons by ID.
[x] pressing enter while search is empty should go back to displaying pokemons in ascending ids. so 0 - 25.
[ ] Add the pokeball symbol to each card as a background.
[ ] Add the pokeball symbol to the background also, find a way to set the maximum width of the relative container.
[ ] then, when pressing a Load More button, render then next 25. and so on so forth.