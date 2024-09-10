export function settingsBar(indexObject) {
  let alphabet = Object.keys(indexObject);

  return `<div class="settings-bar">
      <div class="alphabet">
        ${alphabet
          .map(letter => {
            return `<a class="letter" href="#${letter}">
                  ${letter}
                </a>`;
          })
          .join("")}
        <a href="#info" class="letter">ⓘ</a></div>
        </div>`;
}
