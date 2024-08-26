import fs from "fs";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";
import { openingHtml } from "./htmlParts/openingHtml.js";
import { settingsBar } from "./htmlParts/settingsBar.js";
import { endingHtml } from "./htmlParts/endingHtml.js";
import sortedKeys from "../functionsBuilding/sortedKeys.js";
import getSuttaBlurb from "../functionsBuilding/getSuttaBlurb.js";
import getSuttaTitle from "../functionsBuilding/getSuttaTitle.js";
import justBook from "../functionsBuilding/justBook.js";
import convertVatthus from "../functionsBuilding/convertVatthus.js";
import { exec } from "child_process";

export default function createSuttaIndexHtml(indexObject) {
  // because there is no Vv or Pv on SC, those citations go to suttafriends.org
  function makeUrl(locator) {
    if (/^CUSTOM:/.test(locator)) {
      const components = locator.split(":");
      return "https://" + components[3];
    } else if (isVatthu(locator)) {
      return `https://suttafriends.org/${convertVatthus(locator)}`;
    } else {
      return `https://suttacentral.net/${citationOnly(locator)}/en/sujato${segmentOnly(locator)}`;
    }
  }

  function makeLinkText(locator) {
    if (/^CUSTOM:/.test(locator)) {
      const components = locator.split(":");
      return components[2];
    } else {
      return locator;
    }
  }
  function makeLinkClass(locator) {
    if (/^CUSTOM:/.test(locator)) {
      const components = locator.split(":");
      return "custom " + components[1].toLowerCase();
    } else {
      return justBook(locator);
    }
  }

  function citationOnly(locator) {
    if (locator.includes(":")) {
      return locator.split(":")[0].toLowerCase();
    }
    return locator.replace(/–.+/, "").toLowerCase();
  }

  function segmentOnly(locator) {
    if (locator.includes(":")) {
      return "#" + locator.toLowerCase();
    }
    return "";
  }

  function isVatthu(locator) {
    if (justBook(locator) === "vv" || justBook(locator) === "pv") {
      return true;
    }
  }

  function injectCounterNumber(headword, counterNumber) {
    let headwordWithCount;
    if (counterNumber) {
      let rootHeadword = headword.split(" (");
      if (rootHeadword.length === 1) {
        headwordWithCount = `${rootHeadword[0]} <span class="counter">${counterNumber}</span>`;
        return headwordWithCount;
      } else {
        headwordWithCount = `${rootHeadword[0]} <span class="counter">${counterNumber}</span> (${rootHeadword[1]}`;
        return headwordWithCount;
      }
    } else return headword;
  }

  let alphabet = Object.keys(indexObject);
  const index = alphabet
    .map(letter => {
      const headwordsObject = indexObject[letter];
      const headwordsArray = Object.keys(headwordsObject);
      return `
        <div class="alphabet-anchor" id=${letter}>
          ${letter}
        </div>
        ${headwordsArray
          .map(headword => {
            let sortedSubWords = sortedKeys(headwordsObject[headword]);

            sortedSubWords = sortedSubWords.filter(item => item !== "counter_value");
            return `
            <div id="${makeNormalizedId(headword)}">
            <div class="head-word-area">
                <a class="headword-link" href=${"#" + makeNormalizedId(headword)}>
                    <span class="head-word">
                    <img src="images/copy-heading.png" alt="copy icon" class="icon copy-icon click-to-copy info" height="16" data-tippy-content="Copy headword text to the clipboard" data-clipboard-text="${headword}">
                    <img src="images/link-icon.png" alt="link copy icon" class="icon link-icon click-to-copy info" height="16" data-tippy-content="Copy a link to this entry to the clipboard" data-clipboard-text="index.readingfaithfully.org/#${makeNormalizedId(headword)}">
                    ${injectCounterNumber(headword, headwordsObject[headword].counter_value)}
                    <img src="images/copy-text-up.png" alt="text copy icon" class="icon text-icon copy-icon info" height="16 title="Copy text of entry" data-headword="${headword}" data-tippy-content="Copy plain text of this entry">
                    <img src="images/copy-html-up.png" alt="text copy icon" class="icon html-icon copy-icon info" height="16 title="Copy text of entry" data-headword="${headword}" data-tippy-content="Copy html version of this entry">
                    <img src="images/copy-markdown-up.png" alt="text copy icon" class="icon markdown-icon copy-icon info" height="16 title="Copy text of entry" data-headword="${headword}" data-tippy-content="Copy Markdown version of this entry">
                    </span>
                </a>
          </div>
          ${sortedSubWords
            .map(subhead => {
              let locatorListObject = headwordsObject[headword][subhead];
              return `<div class="sub-word">${subhead === "" ? (sortedSubWords.length === 1 ? "see " : "see also ") : subhead}
              <span class="locator-list">
              ${locatorListObject.xrefs
                .map((xref, index) => {
                  xref = xref.replace("xref ", "");
                  return `<a href="#${makeNormalizedId(xref)}" class="xref-link"> 
                  ${xref} </a>${index + 1 === locatorListObject.xrefs.length ? "" : "; <br>"} `;
                })
                .join("")}
              ${locatorListObject.locators
                .map((locator, index) => {
                  return `<a href="${makeUrl(locator)}" target="_blank" rel="noreferrer" class="${makeLinkClass(locator) + " locator"}"  ${getSuttaBlurb(locator) ? `data-tippy-content="${getSuttaBlurb(locator)}"` : ""}> 
                  ${makeLinkText(locator)} ${getSuttaTitle(locator) ? `<small class="sutta-name">${getSuttaTitle(locator)}</small>` : ""}
                </a>${index + 1 === locatorListObject.locators.length ? "" : ", "} `;
                })
                .join("")}
              </div>
              `;
            })
            .join("")}
          </span>
          </div>`;
          })
          .join("")}`;
    })
    .join("");

  // asemble all the parts
  let suttaIndexHtml = `${openingHtml}
    ${settingsBar(indexObject)}
    <div id="sutta-index" class="sutta-index">
    ${index}
    ${endingHtml}`;

  // Save the finished html file
  try {
    fs.writeFileSync("public/index.html", suttaIndexHtml);
    console.log("🌐 index.html written");
  } catch (err) {
    console.log("❌There was an error writing index.html");
    console.error(err);
  }

  // bundle the scripts
  exec("npx esbuild src/functions/scripts.js --bundle --minify --outfile=public/index.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (error && error.code !== 0) {
      console.error(`Command failed with exit code ${error.code}`);
    }
    if (stderr) {
      const singleLineStderr = stderr.replace(/\r?\n/g, " ").trim();
      console.error(`🛠️  Script bundled; Stderr: ${singleLineStderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
}
