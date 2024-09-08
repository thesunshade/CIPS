import { blurbs } from "../data/blurbs.js";

export default function getBlurb(citation) {
  const blurb = blurbs[citation];
  return blurb ? blurb : "";
}
