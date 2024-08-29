export default function normalizeDiacriticString(string) {
  return string
    .normalize("NFD") /*separates diacritics from letter */
    .replace(/[\u0300-\u036f]/g, ""); /*removes diacritic characters */
}
