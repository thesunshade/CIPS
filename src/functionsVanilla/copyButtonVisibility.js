// Function to apply visible copy buttons based on localStorage
function applyCopyButtonsVisibility() {
  const copyButtonsVisibility = localStorage.getItem("copyButtonsVisibility");
  if (copyButtonsVisibility === "true") {
    document.body.classList.add("copy-buttons-visible");
  } else {
    document.body.classList.remove("copy-buttons-visible");
  }
}

// Function to toggle the copy button visibility
function toggleCopyButtonsVisibility() {
  if (document.body.classList.contains("copy-buttons-visible")) {
    document.body.classList.remove("copy-buttons-visible");
    localStorage.setItem("copyButtonsVisibility", "false");
  } else {
    document.body.classList.add("copy-buttons-visible");
    localStorage.setItem("copyButtonsVisibility", "true");
  }
}

// Initialize the copy button visibility on page load
document.addEventListener("DOMContentLoaded", applyCopyButtonsVisibility);

// Add event listener to the copy visibility button
document.getElementById("eye-button").addEventListener("click", toggleCopyButtonsVisibility);
