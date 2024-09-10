import { filteredBlurbs } from "../data/filteredBlurbs.js";

export default function getSuttaBlurb(citation) {
  let id = citation.toLowerCase().split(":")[0];
  let blurb = filteredBlurbs[id] ? `${filteredBlurbs[id]}` : "";

  if (!blurb) return "";

  return blurb;
}
