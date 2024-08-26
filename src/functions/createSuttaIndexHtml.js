import fs from "fs";
import makeNormalizedId from "./makeNormalizedId.js";
import { infoAreaHtml } from "./infoAreaHtml.js";
import sortedKeys from "./sortedKeys.js";
import getSuttaBlurb from "./getSuttaBlurb.js";
import getSuttaTitle from "./getSuttaTitle.js";
import justBook from "./justBook.js";
import convertVatthus from "./convertVatthus.js";
import { exec } from "child_process";

export default function createSuttaIndexHtml(indexObject) {
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

  let alphabet = Object.keys(indexObject);

  let suttaIndexHtml = `<!DOCTYPE html>
      <html lang="en">
      <head>

      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="images/favicon.png" />
      <meta property="og:title" content="Comprehensive Index of Pali Suttas | ReadingFaithfully" />
      <meta property="og:description" content="Get the teachings you need." />
      <meta property="og:url" content="https://index.readingfaithfully.org/" />
      <meta property="og:site_name" content="Index.ReadingFaithfully.org" />
      <meta property="og:image" itemprop="image" content="images/featuredImage-index.png" />




      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-html.png">
      <title>Comprehensive Index of Pāli Suttas</title>
      <link rel="stylesheet" href="index.css">
      <script src="https://unpkg.com/@popperjs/core@2"></script>
      <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="app" class="app hide-snack-bar">
      <div class="snack-bar">Copied!</div>
      
      <div id="settings-bar" class="settings-bar">
        <div class="top-row">
          <div class="search-area">
          <input type="text" id="search-box" placeholder="Search headwords..." spellcheck="false">
          </div>
          <div id="info-button" class="settings-button info" data-tippy-content="Settings and information.">
            <img class="icon" width="17px"  src="images/info-dot.png" />
          </div>
        </div>
        <div class="alphabet">
        ${alphabet
          .map(letter => {
            return `<span class="letter" id=${letter}>
                  ${letter}
                </span>`;
          })
          .join("")}
        </div>
        <div id="results" class="search-results"></div>
        <div id="info-area" class="info-area hidden">${infoAreaHtml}</div>
      </div>
      <div id="sutta-index" class="sutta-index">`;

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

  suttaIndexHtml +=
    index +
    `</div>
    <script type="module" src="index.js"></script>
    <script>
        tippy('.locator',{allowHTML: true, delay: [300, null], touch: ['hold', 500],})
        tippy('.info', {theme: 'info', touch: ['hold', 500], delay: [500, null],});
    </script>
  </body>
  </html>`;

  try {
    fs.writeFileSync("../public/index.html", suttaIndexHtml);
    console.log("🌐 index.html written");
  } catch (err) {
    console.log("❌There was an error writing index.html");
    console.error(err);
  }

  // let headwordsArraryText = "const headwordsArray =" + JSON.stringify(headwordsArray, null, 2);

  // const script = headwordsArraryText + "\n\n" + scriptsText + copyScriptsText + themeScriptsText;

  // try {
  //   fs.writeFileSync("../public/scripts.js", script);
  //   console.log("🛠️ scripts.js written");
  // } catch (err) {
  //   console.log("❌There was an error writing scripts.js");
  //   console.error(err);
  // }

  exec("npx esbuild ../src/functions/scripts.js --bundle --minify --outfile=../public/index.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
}
