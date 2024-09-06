import tippy from "tippy.js";
import getBlurb from "./getBlurbs";

document.addEventListener("mouseover", function (event) {
  // Find the closest element that has the 'data-id' attribute
  const element = event.target.closest("[data-id]");
  if (!element) return;
  if (element._tippy) return;
  if (element) {
    const citation = element.getAttribute("data-id");
    const blurb = getBlurb(citation);
    tippy(element, { content: blurb, delay: [500, null] });
    // Only show the tippy after the delay and if the cursor is still over the element
    setTimeout(function () {
      if (element.matches(":hover")) {
        element._tippy.show();
      }
    }, 500);
  }
});

// Add touchstart event for long press detection
document.addEventListener("touchstart", function (event) {
  const element = event.target.closest("[data-id]");
  if (!element) return;
  if (element._tippy) return;

  let touchTimer;

  if (element) {
    const citation = element.getAttribute("data-id");
    const blurb = getBlurb(citation);
    tippy(element, {
      content: blurb,
      delay: [500, null],
    });

    touchTimer = setTimeout(function () {
      element._tippy.show();
    }, 500);

    // Clear the timer if the touch ends or moves
    const cancelTouch = function () {
      clearTimeout(touchTimer);
    };

    element.addEventListener("touchend", cancelTouch, { once: true });
    element.addEventListener("touchmove", cancelTouch, { once: true });
  }
});
