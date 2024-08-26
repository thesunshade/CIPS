import { blurbs } from "../data/blurbs.js";

export default function getSuttaBlurb(citation) {

  let blurb = blurbs[citation.toLowerCase()] ? `${blurbs[citation.toLowerCase()]}` : "";

  if (!blurb) return "";

  return  blurb ;
}
