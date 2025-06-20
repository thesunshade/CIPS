export const IGNORE_WORDS = ["in", "of", "with", "from", "to", "for", "on", "the", "as", "a", "an", "vs.", "and"];

export function escapeForRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
