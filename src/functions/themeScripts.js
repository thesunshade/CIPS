// Initialize the theme on page load
document.addEventListener("DOMContentLoaded", applyTheme);

// Add event listener to the theme button
document.getElementById("theme-button").addEventListener("click", toggleTheme);

// Initialize the color on page load
document.addEventListener("DOMContentLoaded", applyColor);

// Add event listener to the color button
document.getElementById("color-button").addEventListener("click", toggleColor);

// Initialize the names on page load
document.addEventListener("DOMContentLoaded", applyNames);

// Add event listener to the names button
document.getElementById("names-button").addEventListener("click", toggleNames);

// Function to apply the theme based on localStorage
function applyTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
}

// Function to toggle the theme
function toggleTheme() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

// Function to apply the citation colors based on localStorage
function applyColor() {
  const color = localStorage.getItem("color");
  if (color === "true") {
    document.body.classList.add("colored-locators");
  } else {
    document.body.classList.remove("colored-locators");
  }
}

// Function to toggle the color
function toggleColor() {
  if (document.body.classList.contains("colored-locators")) {
    document.body.classList.remove("colored-locators");
    localStorage.setItem("color", "false");
  } else {
    document.body.classList.add("colored-locators");
    localStorage.setItem("color", "true");
  }
}

// Function to apply the names visibility based on localStorage
function applyNames() {
  const names = localStorage.getItem("names");
  if (names === "false") {
    document.body.classList.add("hide-names");
  } else {
    document.body.classList.remove("hide-names");
  }
}

// Function to toggle the names
function toggleNames() {
  if (document.body.classList.contains("hide-names")) {
    document.body.classList.remove("hide-names");
    localStorage.setItem("names", "true");
  } else {
    document.body.classList.add("hide-names");
    localStorage.setItem("names", "false");
  }
}
