import tippy from "tippy.js";
import { blurbs } from "../data/blurbs";

document.addEventListener("DOMContentLoaded", () => {
  tippy(".locator", {
    allowHTML: true,
    delay: [300, null],
    touch: ["hold", 500],
    interactive: true,
    content: reference => {
      const locator = reference.getAttribute("data-loc");
      return blurbs[locator] ? blurbs[locator] : "";
    },
  });
});
