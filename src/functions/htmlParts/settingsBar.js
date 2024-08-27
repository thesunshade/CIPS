import { infoAreaHtml } from "../infoAreaHtml.js";

export function settingsBar(indexObject) {
  let alphabet = Object.keys(indexObject);

  return `<div id="settings-bar" class="settings-bar">
  <div class="snack-bar">Copied!</div>
        <div class="top-row">
        <img src="images/favicon-index-thicker64.png" width="22" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });">
          <div class="search-area">
          <input type="text" id="search-box" placeholder="Search headwords..." spellcheck="false">
          </div>
          <div id="info-button" class="settings-button info" data-tippy-content="Settings and information.">
            <img class="icon" width="17"  src="images/info-dot.png" alt="Info icon"/>
          </div>
        </div>
        <div class="alphabet">
        ${alphabet
          .map(letter => {
            return `<span class="letter" id="${letter}">
                  ${letter}
                </span>`;
          })
          .join("")}
        </div>
        <div id="results" class="search-results"></div>
        <div id="info-area" class="info-area hidden">${infoAreaHtml}</div>
      </div>`;
}
