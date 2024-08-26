import { allSuttasPaliNameDictionary } from "../data/allSuttasPaliNameDictionary.js";

export default function getSuttaTitle(citation) {
  const strippedCitation = citation.replace(/:.*/, "");
  let title = allSuttasPaliNameDictionary[strippedCitation] ? allSuttasPaliNameDictionary[strippedCitation] : "";
  return title.replace(/ \[.+?\]/g, ""); // this strips out extra titles in brackets
}
