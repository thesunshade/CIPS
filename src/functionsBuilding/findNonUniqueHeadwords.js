import makeNormalizedId from "./makeNormalizedId.js";

export default function findNonUniqueHeadwords(headwords) {
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

  if (nonUniqueHeadwords.size > 0) {
    console.warn("💀 Non-unique headwords:", nonUniqueHeadwords);
    console.warn("They are non-unique because once they are normalized they are identical.");
  }
}
