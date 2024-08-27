import makeNormalizedId from "./makeNormalizedId.js";

export function findNonUniqueHeadwords(headwords) {
  const idToHeadwordsMap = new Map();

  // Map normalized IDs to headwords
  for (const headword of headwords) {
    const normalizedId = makeNormalizedId(headword);

    if (!idToHeadwordsMap.has(normalizedId)) {
      idToHeadwordsMap.set(normalizedId, []);
    }
    idToHeadwordsMap.get(normalizedId).push(headword);
  }

  // Find non-unique headwords
  const nonUniqueHeadwords = new Set();
  for (const [normalizedId, headwords] of idToHeadwordsMap) {
    if (headwords.length > 1) {
      for (const headword of headwords) {
        nonUniqueHeadwords.add(headword);
      }
    }
  }

  console.log("💀 Non-unique headwords:", nonUniqueHeadwords);
}
