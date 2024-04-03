import getAdjectives from "./assets/adjectives";
import getColors from "./assets/colors";
import getAnimals from "./assets/animals";

const adjectives = getAdjectives();
const colors = getColors();
const animals = getAnimals();


function _getRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

/**
 * Generate a random id in the form of adjective-color-animal
 * @param {string} [delim] character to use as the delimiter
 * @returns random id
 */
function generate(delim='-') {
  const adjective = _getRandom(adjectives);
  const color = _getRandom(colors);
  const animal = _getRandom(animals);

  return [adjective,color,animal].join(delim);
}


export { adjectives, colors, animals, generate };