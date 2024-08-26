// This function turns a headword string into somethign acceptable for use as a valid id.
// long vowels are changed to doubled vowels. Other diacritics are simply removed.
// punctuation is removed

export default function makeNormalizedId(text) {
  return text
    .trim()
    .replace("ā", "aa")
    .replace("ī", "ii")
    .replace("ū", "uu")
    .replace("Ā", "Aa")
    .replace("xref ", "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "-")
    .replace(/[,;.“”'"’/()]/g, "");
  // .replace(/\//, "")
  // .replace(/\(/, "")
  // .replace(/\)/, "");
}
