import { blurbs } from "../data/blurbs";

export default function getBlurb(citation) {
  const blurb = blurbs[citation.toLowerCase()];
  return blurb ? blurb : "";
}
