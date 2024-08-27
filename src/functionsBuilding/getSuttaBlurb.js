import { blurbs } from "../data/blurbs.js";

export default function getSuttaBlurb(citation) {
  let blurb = blurbs[citation.toLowerCase()] ? `${blurbs[citation.toLowerCase()]}` : "";

  blurb = blurb.replace("<", "&lt;").replace(">", "&gt;");

  if (!blurb) return "";

  return blurb;
}
