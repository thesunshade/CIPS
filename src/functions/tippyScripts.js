import tippy from "tippy.js";

// Setup tippy.js tooltips

tippy(".locator", { allowHTML: true, delay: [300, null], touch: ["hold", 500], interactive: true });
tippy(".info", { theme: "info", touch: ["hold", 500], delay: [500, null] });

tippy(".copy-headword", { content: "Copy headword text to the clipboard", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".copy-link", { content: "Copy a link to this entry to the clipboard", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-text", { content: "Copy plain text of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-html", { content: "Copy html version of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-markdown", { content: "Copy Markdown version of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
