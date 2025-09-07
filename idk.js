// The "Cheat Sheet" data for our function
const typeChart = {
  weaknesses: { normal: ["fighting"], fire: ["water", "ground", "rock"], water: ["electric", "grass"], grass: ["fire", "ice", "poison", "flying", "bug"], electric: ["ground"], ice: ["fire", "fighting", "rock", "steel"], fighting: ["flying", "psychic", "fairy"], poison: ["ground", "psychic"], ground: ["water", "grass", "ice"], flying: ["electric", "ice", "rock"], psychic: ["bug", "ghost", "dark"], bug: ["fire", "flying", "rock"], rock: ["water", "grass", "fighting", "ground", "steel"], ghost: ["ghost", "dark"], dragon: ["ice", "dragon", "fairy"], dark: ["fighting", "bug", "fairy"], steel: ["fire", "fighting", "ground"], fairy: ["poison", "steel"] },
  resistances: { normal: [], fire: ["fire", "grass", "ice", "bug", "steel", "fairy"], water: ["fire", "water", "ice", "steel"], grass: ["water", "grass", "electric", "ground"], electric: ["electric", "flying", "steel"], ice: ["ice"], fighting: ["bug", "rock", "dark"], poison: ["grass", "fighting", "poison", "bug", "fairy"], ground: ["poison", "rock"], flying: ["grass", "fighting", "bug"], psychic: ["fighting", "psychic"], bug: ["grass", "fighting", "ground"], rock: ["normal", "fire", "poison", "flying"], ghost: ["poison", "bug"], dragon: ["fire", "water", "grass", "electric"], dark: ["ghost", "dark"], steel: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], fairy: ["fighting", "bug", "dark"] },
  immunities: { normal: ["ghost"], fire: [], water: [], grass: [], electric: [], ice: [], fighting: [], poison: [], ground: ["electric"], flying: ["ground"], psychic: [], bug: [], rock: [], ghost: ["normal", "fighting"], dragon: [], dark: ["psychic"], steel: ["poison"], fairy: ["dragon"] }
};

const allTypes = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

/**
 * Calculates the weaknesses for a given Pokémon's types.
 * @param {string[]} pokemonTypes - An array with one or two Pokémon types (e.g., ['fire', 'bug']).
 * @returns {Object} - An object listing the weaknesses and their multipliers.
 */
function calculateWeaknesses(pokemonTypes) {
  const finalWeaknesses = {};

  // Loop through all 18 possible attack types
  for (const attackType of allTypes) {
    let multiplier = 1;

    // Apply the multiplier for each of the Pokémon's types
    for (const defendingType of pokemonTypes) {
      if (typeChart.immunities[defendingType]?.includes(attackType)) {
        multiplier *= 0; // Immunity Trump Card
      } else if (typeChart.resistances[defendingType]?.includes(attackType)) {
        multiplier *= 0.5; // Resistance
      } else if (typeChart.weaknesses[defendingType]?.includes(attackType)) {
        multiplier *= 2; // Weakness
      }
    }

    // If the final multiplier is greater than 1, it's a weakness.
    if (multiplier > 1) {
      finalWeaknesses[attackType] = multiplier;
    }
  }

  return finalWeaknesses;
}

// --- HOW TO USE IT ---

// Example 1: Your request for Fire/Bug
const volcaronaWeaknesses = calculateWeaknesses(['bug', 'flying']);
console.log("Bug/Flying is weak to:", volcaronaWeaknesses);
// Expected Output: Fire/Bug is weak to: { water: 2, flying: 2, rock: 4 }

// Example 2: A Pokémon with an immunity
const quagsireWeaknesses = calculateWeaknesses(['water', 'ground']);
console.log("Water/Ground is weak to:", quagsireWeaknesses);
// Expected Output: Water/Ground is weak to: { grass: 4 }
// Notice Electric is not on the list because of the Ground immunity!