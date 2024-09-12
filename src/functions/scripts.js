import { headwordsArray } from "../data/headwords-array.js";
import { allSuttasPaliNameArray } from "../../public/allSuttasPaliNameArray.js";
import "./copyButtonVisibility.js";
import "./themeScripts.js";
import "./copyScripts.js";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";

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
    .replace(/[\s,;.“”'"’/()-]/g, "") // Remove spaces and punctuation
    .toLowerCase()
    .replace(/kh/gi, "k")
    .replace(/gh/gi, "g")
    .replace(/ch/gi, "c")
    .replace(/jh/gi, "j")
    .replace(/th/gi, "t")
    .replace(/dh/gi, "d")
    .replace(/ph/gi, "p")
    .replace(/bh/gi, "b")
    .replace(/kk/gi, "k")
    .replace(/gg/gi, "g")
    .replace(/cc/gi, "c")
    .replace(/jj/gi, "j")
    .replace(/tt/gi, "t")
    .replace(/dd/gi, "d")
    .replace(/pp/gi, "p")
    .replace(/bb/gi, "b")
    .replace(/mm/gi, "m")
    .replace(/yy/gi, "y")
    .replace(/rr/gi, "r")
    .replace(/ll/gi, "l")
    .replace(/vv/gi, "v")
    .replace(/ss/gi, "s");
}

function renderResults({ query, firstOnly }) {
  hideInfo();
  resultsContainer.innerHTML = "";
  if (!query) return;

  const startsWith = [];
  const contains = [];
  const suttaMatches = [];

  const normalizedQuery = normalizeString(query);

  headwordsArray.forEach(item => {
    const normalizedItem = normalizeString(item);
    if (normalizedItem.startsWith(normalizedQuery)) {
      startsWith.push(item);
    } else if (normalizedItem.includes(normalizedQuery) && !firstOnly) {
      contains.push(item);
    }
  });

  if (window.allSuttasPaliNameArray) {
    // The data is available, you can now use it
    const allSuttasPaliNameArray = window.allSuttasPaliNameArray;

    // Check matches in allSuttasPaliNameArray
    if (query.length >= 3) {
      allSuttasPaliNameArray.forEach(item => {
        const normalizedItem = normalizeString(item);
        if (normalizedItem.includes(normalizedQuery)) {
          suttaMatches.push(item);
        }
      });
    }
  } else {
    console.log("Sutta data not yet loaded.");
  }

  startsWith.forEach(item => createResultItem(item, query, firstOnly));
  if (startsWith.length && contains.length) {
    const separator = document.createElement("div");
    separator.className = "separator";
    resultsContainer.appendChild(separator);
  }
  contains.forEach(item => createResultItem(item, query, firstOnly));

  if (suttaMatches.length) {
    const suttaSeparator = document.createElement("div");
    suttaSeparator.className = "separator sutta-separator";
    suttaSeparator.textContent = "Open on SuttaCentral.net: ";
    resultsContainer.appendChild(suttaSeparator);
  }

  suttaMatches.forEach(item => createResultSuttaName(item, query, firstOnly));

  if (startsWith.length === 0 && contains.length === 0 && suttaMatches.length === 0) {
    const noResultsMessage = document.createElement("div");
    noResultsMessage.className = "no-results";

    let message = "No results found.";

    if (/Windows|Linux/.test(navigator.userAgent)) {
      message += " Try <kbd>Ctrl+F</kbd> to search within the page.";
    } else if (/Mac/i.test(navigator.userAgent)) {
      message += " Try Command+F to search within the page.";
    } else if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      message += " Try using the browser's find feature.";
    }

    noResultsMessage.innerHTML = message;
    resultsContainer.appendChild(noResultsMessage);
  }

  resultsContainer.scrollTop = 0;
}

function createResultItem(item, query, firstOnly) {
  const resultItem = document.createElement("div");
  resultItem.className = "menu-item search-result";

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
    document.getElementById("search-box").blur();
    window.history.pushState(null, null, "#" + anchorId);
    document.title = `${item} | ${SITENAME}`;
  });

  resultsContainer.appendChild(resultItem);
}

function createResultSuttaName(item, query, firstOnly) {
  const resultItem = document.createElement("div");
  resultItem.className = "menu-item search-result";

  // Use a regular expression to find matches
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp("(" + escapedQuery + ")", "gi");

  let highlightedItem;

  if (firstOnly) {
    highlightedItem = item;
  } else {
    highlightedItem = item.replace(regex, "<strong>$1</strong>");
  }

  // Extract the ID from the item
  const id = item.split("|")[1].trim().toLowerCase();

  highlightedItem = highlightedItem.replace(" |", "");

  // Create the link element
  const link = document.createElement("a");
  link.href = `https://suttacentral.net/${id}/en/sujato`;
  link.target = "_blank"; // Open in a new tab
  link.rel = "noopener noreferrer"; // Security best practice
  link.classList = "off-site";
  link.innerHTML = highlightedItem;

  // Append the link to the result item
  resultItem.appendChild(link);

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
      const activeItem = items[activeIndex];
      const link = activeItem.querySelector("a");
      if (link) {
        link.click(); // Trigger the link click if available
      } else {
        activeItem.click(); // Fallback to the default click behavior
      }
    } else if (items.length > 0) {
      const firstItem = items[0];
      const link = firstItem.querySelector("a");
      if (link) {
        link.click(); // Trigger the link click if available
      } else {
        firstItem.click(); // Fallback to the default click behavior
      }
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
    // document.getElementById("search-box").blur();
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
document.querySelectorAll(".menu-letter").forEach(button => {
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
