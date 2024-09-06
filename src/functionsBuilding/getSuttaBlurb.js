import { filteredBlurbs } from "../data/filteredBlurbs.js";

export default function getSuttaBlurb(citation) {
  let blurb = filteredBlurbs[citation.toLowerCase()] ? `${filteredBlurbs[citation.toLowerCase()]}` : "";

  blurb = blurb.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (!blurb) return "";

  return blurb;
}
