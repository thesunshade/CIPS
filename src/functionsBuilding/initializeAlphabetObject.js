export default function initializeAlphabetObject() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return alphabet.reduce((obj, letter) => {
    obj[letter] = {};
    return obj;
  }, {});
}
