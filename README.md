# Project MVP

- [x] A home view containing a search bar and card grid below.
- [x] Pressing enter in the search bar fetches a pokemon from the pokemon api.
- [x] If no pokemon is found, render a sad pokemon emoji above the grid as header text.
- [x] If there are pokemon found, loop through each one and render their front sprite, if there is no front sprite, settle for a placeholder null image, and render their name and types.
- [x] make fetchPokemon() return data rather than doing 3 jobs, which are get the data, render the data, or render the error.
- [x] inside renderPokemon function, when there is more than one type, there is a ',' character in between the list items fix this.
- [x] improve the BEM style names in style.css ask AI for some help.
- [x] While data is fetching, take the results section and slap in a loading screen.
- [x] Redesign the whole page. my CSS is rusty and everything looks bad. im unsure if i should use basic CSS and learn SCSS or SASS? (im not sure what these are) or stick with tailwindcss. okay on second thought we'll keep CSS. i need to relearn my fundamentals.
- [x] in homepage, render the first 25 pokemons by ID.
- [x] pressing enter while search is empty should go back to displaying pokemons in ascending ids. so 0 - 25.

## Design

- [x] Let each pokemon type indicator only take 
- [ ] Add the pokeball symbol to each card as a background, similar to the figma design
- [ ] Add the pokeball symbol to the background also, find a way to set the maximum width of the relative container.
- [ ] Refactor the scss file..?
- [ ] Create a design for the detailed pokemon view. i dont know yet. im very bad at making these 'todos' i dont evn think they help. just makes things overwhelming.


## Functionality
- [ ] Find a way to order the uh.. pokemon loading? right now its based on receiving the data or promise.
- [x] When searching, and pokemon doesn't exist, show a sad pikachu emoji.
- [ ] then, when pressing a Load More button, render then next 25. and so on so forth. 
- [ ] When clicking on pokemon card, redirect user to its info page.

## Features (Too complex and difficult. will probably take weeks to finish)
- [ ] Uh, do we add a user system? but i dont know how to implement a user. and loging in and signing up in django.
- [ ] With this user system, idk, allow the user to `favorite` a pokemon?

---

# Project MVP

[x] A home view containing a search bar and card grid below.
[x] Pressing enter in the search bar fetches a pokemon from the pokemon api.
[x] If no pokemon is found, render a sad pokemon emoji above the grid as header text.
[x] If there are pokemon found, loop through each one and render their front sprite, if there is no front sprite, settle for a placeholder null image, and render their name and types.
[x] make fetchPokemon() return data rather than doing 3 jobs, which are get the data, render the data, or render the error.
[x] inside renderPokemon function, when there is more than one type, there is a ',' character in between the list items fix this.
[x] improve the BEM style names in style.css ask AI for some help.
[x] While data is fetching, take the results section and slap in a loading screen.
[x] Redesign the whole page. my CSS is rusty and everything looks bad. im unsure if i should use basic CSS and learn SCSS or SASS? (im not sure what these are) or stick with tailwindcss. okay on second thought we'll keep CSS. i need to relearn my fundamentals.
[x] in homepage, render the first 25 pokemons by ID.
[x] pressing enter while search is empty should go back to displaying pokemons in ascending ids. so 0 25.

## Design

[x] Let each pokemon type indicator only take 
[ ] Add the pokeball symbol to each card as a background, similar to the figma design
[ ] Add the pokeball symbol to the background also, find a way to set the maximum width of the relative container.
[ ] Refactor the scss file..?
[ ] Create a design for the detailed pokemon view. i dont know yet. im very bad at making these 'todos' i dont evn think they help. just makes things overwhelming.


## Functionality
[ ] Find a way to order the uh.. pokemon loading? right now its based on receiving the data or promise.
[x] When searching, and pokemon doesn't exist, show a sad pikachu emoji.
[ ] then, when pressing a Load More button, render then next 25. and so on so forth. 
[ ] When clicking on pokemon card, redirect user to its info page.

## Features (Too complex and difficult. will probably take weeks to finish)
[ ] Uh, do we add a user system? but i dont know how to implement a user. and loging in and signing up in django.
[ ] With this user system, idk, allow the user to `favorite` a pokemon?