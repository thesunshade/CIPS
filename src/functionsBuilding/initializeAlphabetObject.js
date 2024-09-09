export default function initializeAlphabetObject() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWYZ".split("");
  return alphabet.reduce((obj, letter) => {
    obj[letter] = {};
    return obj;
  }, {});
}
