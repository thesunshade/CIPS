import { IGNORE_WORDS } from "../data/ignoreWords.js";

export default function sortedKeys(object) {
  function stripIgnoreWords(str, ignoreWords = IGNORE_WORDS) {
    let result = str.trim();
    let changed = true;
    while (changed) {
      changed = false;
      for (const word of ignoreWords) {
        const regex = new RegExp(`^${word}\\b\\s*`, "i");
        if (regex.test(result)) {
          result = result.replace(regex, "");
          changed = true;
        }
      }
    }
    return result.trim();
  }

  return Object.keys(object).sort((a, b) => {
    // Remove “ and ignore words
    const aStripped = stripIgnoreWords(a.replace("“", ""));
    const bStripped = stripIgnoreWords(b.replace("“", ""));
    return aStripped.localeCompare(bStripped, undefined, { sensitivity: "base" });
  });
}
