document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyColor();
  applyNames();
});

function toggleFeature(className, storageKey, trueValue, falseValue) {
  if (document.body.classList.contains(className)) {
    document.body.classList.remove(className);
    localStorage.setItem(storageKey, falseValue);
  } else {
    document.body.classList.add(className);
    localStorage.setItem(storageKey, trueValue);
  }
}

function applyFeature(className, storageKey, expectedValue) {
  const value = localStorage.getItem(storageKey);
  if (value === expectedValue) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}

function toggleTheme() {
  toggleFeature("dark", "theme", "dark", "light");
}

function toggleColor() {
  toggleFeature("colored-locators", "color", "true", "false");
}

function toggleNames() {
  toggleFeature("hide-names", "names", "false", "true");
}

function applyTheme() {
  applyFeature("dark", "theme", "dark");
}

function applyColor() {
  applyFeature("colored-locators", "color", "true");
}

function applyNames() {
  applyFeature("hide-names", "names", "false");
}

document.getElementById("theme-button").addEventListener("click", toggleTheme);
document.getElementById("color-button").addEventListener("click", toggleColor);
document.getElementById("names-button").addEventListener("click", toggleNames);
