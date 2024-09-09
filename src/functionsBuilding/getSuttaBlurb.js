import { filteredBlurbs } from "../data/filteredBlurbs.js";

export default function getSuttaBlurb(citation) {
  let blurb = filteredBlurbs[citation.toLowerCase()] ? `${filteredBlurbs[citation.toLowerCase()]}` : "";

  if (!blurb) return "";

  return blurb;
}
