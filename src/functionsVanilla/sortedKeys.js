export default function sortedKeys(object) {
  return Object.keys(object).sort((a, b) => {
    a = a.replace("“", "");
    b = b.replace("“", "");
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });
}
