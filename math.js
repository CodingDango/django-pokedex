const fs = require('fs');

fs.readFile('pokemon_list.json', 'utf8', function(err, data) {
    if (err) throw err;

    const POKEMON_LIST = JSON.parse(data);

    // This correctly sorts the list in place from lightest to heaviest
    sortWeight(POKEMON_LIST);

    // This correctly finds the cutoff points and prints them
    console.log("Your calculated weight ranges are:");
    console.log(findWeightRanges(POKEMON_LIST));
});

function sortWeight(pokemonList) {
    // Perfect. This sorts the array numerically based on the weight property.
    pokemonList.sort((pokemon1, pokemon2) => pokemon1.weight - pokemon2.weight);
}

function findWeightRanges(pokemonListSorted) {
    // Correctly finds the Pokémon at the 1/3rd mark and gets its weight.
    const lightWeightMax = pokemonListSorted[Math.floor(pokemonListSorted.length * 0.333)];
    
    // Correctly finds the Pokémon at the 2/3rd mark and gets its weight.
    const mediumWeightMax = pokemonListSorted[Math.floor(pokemonListSorted.length * 0.666)];
    
    // Returns the values. A good name for these would be "cutoffs" or "splits".
    return {
        'light_medium_split': lightWeightMax,
        'medium_heavy_split': mediumWeightMax,
    };
}