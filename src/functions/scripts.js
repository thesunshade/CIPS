import { headwordsArray } from "../data/headwords-array.js";
import "./copyButtonVisibility.js";
import "./themeScripts.js";
import "./copyScripts.js";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

window.addEventListener("load", function () {
  // Hide the snackbar once the page has fully loaded
  document.getElementById("loading-snackbar").style.display = "none";
});

const SITENAME = "Comprehensive Index of Pāli Suttas";
const searchBox = document.getElementById("search-box");
const resultsContainer = document.getElementById("results");
let activeIndex = -1;

function normalizeString(str) {
  return str
    .normalize("NFD") // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[\s,;.“”'"’/()]/g, "") // Remove spaces and punctuation
    .toLowerCase();
}

function renderResults({ query, firstOnly }) {
  hideInfo();
  resultsContainer.innerHTML = "";
  if (!query) return;

  const startsWith = [];
  const contains = [];

  const normalizedQuery = normalizeString(query);

  headwordsArray.forEach(item => {
    const normalizedItem = normalizeString(item);
    if (normalizedItem.startsWith(normalizedQuery)) {
      startsWith.push(item);
    } else if (normalizedItem.includes(normalizedQuery) && !firstOnly) {
      contains.push(item);
    }
  });

  startsWith.forEach(item => createResultItem(item, query, firstOnly));
  if (startsWith.length && contains.length) {
    const separator = document.createElement("div");
    separator.className = "separator";
    resultsContainer.appendChild(separator);
  }
  contains.forEach(item => createResultItem(item, query, firstOnly));
  resultsContainer.scrollTop = 0;
}

function createResultItem(item, query, firstOnly) {
  const resultItem = document.createElement("div");
  resultItem.className = "menu-item search-result";

  const normalizedQuery = normalizeString(query);
  const lowerItem = normalizeString(item);

  // Use a regular expression to find matches
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp("(" + escapedQuery + ")", "gi");

  let highlightedItem;

  if (firstOnly) {
    highlightedItem = item;
  } else {
    highlightedItem = item.replace(regex, "<strong>$1</strong>");
  }

  resultItem.innerHTML = highlightedItem;

  resultItem.addEventListener("click", () => {
    searchBox.value = "";
    resultsContainer.innerHTML = "";
    const anchorId = makeNormalizedId(item);
    document.getElementById(anchorId).scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, null, "#" + anchorId);
    document.title = `${item} | ${SITENAME}`;
  });

  resultsContainer.appendChild(resultItem);
}

function clearResults() {
  resultsContainer.innerHTML = "";
  activeIndex = -1;
  hideInfo();
}

function handleKeyboardNavigation(e) {
  const items = resultsContainer.querySelectorAll(".search-result");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (activeIndex > -1) {
      items[activeIndex].click();
    } else if (items.length > 0) {
      items[0].click(); // Click the first item if no item is active
    }
  } else if (e.key === "Escape") {
    searchBox.value = "";
    clearResults();
    hideInfo();
    searchBox.focus();
  }
  items.forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
  });

  if (activeIndex > -1) {
    const activeItem = items[activeIndex];
    activeItem.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

searchBox.addEventListener("input", () => renderResults({ query: searchBox.value, firstOnly: false }));
searchBox.addEventListener("keydown", handleKeyboardNavigation);

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && document.activeElement !== searchBox) {
    searchBox.value = "";
    clearResults();
    hideInfo();
    searchBox.focus();
  }
});

// Function to focus on search box and select all its content
function focusAndSelectSearchBox() {
  const searchBox = document.getElementById("search-box");
  searchBox.focus();
  searchBox.setSelectionRange(searchBox.value.length, searchBox.value.length);
  searchBox.select();
}

// Add event listener for window focus
window.addEventListener("focus", focusAndSelectSearchBox);

// Function to handle letter button clicks
function handleLetterClick(event) {
  const clickedLetter = event.target.textContent.trim();
  renderResults({ query: clickedLetter, firstOnly: true });
}

// Attach event listeners to all letter buttons
document.querySelectorAll(".letter").forEach(button => {
  button.addEventListener("click", handleLetterClick);
});

function handleBodyClick(event) {
  const settingsBar = document.getElementById("settings-bar");
  if (settingsBar.contains(event.target)) {
    // If the click is inside the settings-bar, do nothing
    return;
  }
  clearResults();
  hideInfo();
}

document.body.addEventListener("click", handleBodyClick);

// info area

// Add event listener to the info button
document.getElementById("info-button").addEventListener("click", toggleInfo);

function hideInfo() {
  const infoArea = document.getElementById("info-area");
  infoArea.classList.add("hidden");
}

function toggleInfo() {
  const infoArea = document.getElementById("info-area");

  if (infoArea.classList.contains("hidden")) {
    clearResults();
    infoArea.classList.remove("hidden");
  } else {
    infoArea.classList.add("hidden");
  }
}

const allDetails = document.querySelectorAll("details");

allDetails.forEach(details => {
  details.addEventListener("toggle", e => {
    if (details.open) {
      allDetails.forEach(details => {
        if (details !== e.target && details.open) {
          details.open = false;
        }
      });
    }
  });
});

function updatePageTitle() {
  const targetId = window.location.hash.substring(1);
  if (targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headWordElement = targetElement.querySelector("span.head-word");
      if (headWordElement) {
        const headWordText = headWordElement.textContent.trim();
        document.title = `${headWordText} | ${SITENAME}`;
        return;
      }
    }
  }
  // else
  document.title = SITENAME;
}

document.addEventListener("DOMContentLoaded", updatePageTitle);
window.addEventListener("hashchange", updatePageTitle);

// Setup tippy.js tooltips

tippy(".locator", { allowHTML: true, delay: [300, null], touch: ["hold", 500] });
tippy(".info", { theme: "info", touch: ["hold", 500], delay: [500, null] });

tippy(".copy-headword", { content: "Copy headword text to the clipboard", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".copy-link", { content: "Copy a link to this entry to the clipboard", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-text", { content: "Copy plain text of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-html", { content: "Copy html version of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
tippy(".entry-markdown", { content: "Copy Markdown version of this entry", theme: "info", touch: ["hold", 500], delay: [500, null] });
