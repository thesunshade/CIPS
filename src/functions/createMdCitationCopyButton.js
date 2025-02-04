function toggleSnackBar() {
  const appElement = document.getElementById("app");
  appElement.classList.remove("hide-snack-bar");
  setTimeout(() => {
    appElement.classList.add("hide-snack-bar");
  }, 900);
}

export default function createMdCitationCopyButton(link, name) {
  const button = document.createElement("button");
  button.style.border = "none";
  button.style.background = "none";
  button.style.cursor = "pointer";

  const img = document.createElement("img");
  img.src = "images/copy-md.png";
  img.alt = "Copy markdown link";
  img.style.height = "14px";
  img.style.position = "relative";
  img.style.top = "2px";

  button.appendChild(img);

  const textToCopy = `[${name}](${link})`;

  function handleClick() {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toggleSnackBar();
      })
      .catch(err => console.error("Copy failed:", err));
  }

  button.addEventListener("click", handleClick);

  const observer = new MutationObserver(() => {
    if (!document.contains(button)) {
      button.removeEventListener("click", handleClick);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return button;
}
