import fs from "fs";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";
import { settingsBar } from "./htmlParts/settingsBar-vanilla.js";
import { infoArea } from "./htmlParts/infoArea.js";
import sortedKeys from "../functionsBuilding/sortedKeys.js";
import getSuttaBlurb from "../functionsBuilding/getSuttaBlurb.js";
import getSuttaTitle from "../functionsBuilding/getSuttaTitle.js";
import justBook from "../functionsBuilding/justBook.js";
import convertVatthus from "../functionsBuilding/convertVatthus.js";
import { tidyHtml } from "../functionsBuilding/tidyHtml.js";

export default function createSuttaIndexHtmlVanilla(indexObject) {
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

  function constructHeadWordArea(headwordId, headwordWithCounter, headword) {
    return `            <div class="head-word-area">
                <a class="headword-link" href="${"#" + headwordId}">
                    <span class="head-word">
                    ${headwordWithCounter}
                    </span>
                </a>
          </div>`;
  }

  function constructLocatorListHtml(locatorListObject) {
    const locatorListHtml = locatorListObject.locators
      .map((locator, index) => {
        return constructLocatorHtml(locatorListObject, locator, index);
      })
      .join("");
    return locatorListHtml;
  }

  function constructLocatorHtml(locatorListObject, locator, index) {
    const url = makeUrl(locator);
    // const linkClass = makeLinkClass(locator) + " locator";
    const linkText = makeLinkText(locator);
    const title = getSuttaTitle(locator);
    // to add title:
    /// ${title ? ` ${title}` : ""}
    const blurb = getSuttaBlurb(locator);
    const connector = index + 1 === locatorListObject.locators.length ? "" : ", ";
    return ` <a href="${url}" target="_blank" rel="noreferrer" >${linkText}</a>${connector}`;
  }

  function constructXrefHtml(locatorListObject, rawXref, index) {
    const xref = rawXref.replace("xref ", "");
    const xrefId = makeNormalizedId(xref);
    const numberOfXrefs = locatorListObject.xrefs.length;
    return `<a href="#${xrefId}" class="xref-link"> 
                  ${xref}</a>${index + 1 === numberOfXrefs ? "" : "; <br>"} `;
  }

  function constructSublessLocatorList(locatorListObject, subhead) {
    if (subhead === "") {
      const locatorListHtml = locatorListObject.locators
        .map((locator, index) => {
          return constructLocatorHtml(locatorListObject, locator, index);
        })
        .join("");
      return `<div class="sub-word">${locatorListHtml}</div>`;
    } else return "";
  }

  let alphabet = Object.keys(indexObject);

  // this builds the html for the index
  const index = alphabet
    .map(letter => {
      const headwordsObject = indexObject[letter];
      const headwordsArray = Object.keys(headwordsObject);
      return `<div class="alphabet-anchor" id="${letter}">— ${letter} —</div>
        ${headwordsArray
          .map(headword => {
            let sortedSubWords = sortedKeys(headwordsObject[headword]);
            let headwordId = makeNormalizedId(headword);
            let headwordWithCounter = injectCounterNumber(headword, headwordsObject[headword].counter_value);
            sortedSubWords = sortedSubWords.filter(item => item !== "counter_value");
            return `<div id="${headwordId}">${constructHeadWordArea(headwordId, headwordWithCounter, headword)}${sortedSubWords
              .map(subhead => {
                const locatorListObject = headwordsObject[headword][subhead];
                return `${constructSublessLocatorList(locatorListObject, subhead)}<div class="sub-word">${subhead === "" && locatorListObject.xrefs.length > 0 ? (sortedSubWords.length === 1 ? "see " : "see also ") : subhead}${locatorListObject.xrefs
                  .map((rawXref, index) => {
                    return constructXrefHtml(locatorListObject, rawXref, index);
                  })
                  .join("")}
              ${subhead === "" ? "" : constructLocatorListHtml(locatorListObject)}</div>`;
              })
              .join("")}</div>`;
          })
          .join("")}`;
    })
    .join("");

  // asemble all the parts
  const endingHtml = fs.readFileSync(new URL("./htmlParts/endingHtml-vanilla.txt", import.meta.url), "utf8");
  const openingHtml = fs.readFileSync(new URL("./htmlParts/openingHtml-vanilla.txt", import.meta.url), "utf8");

  let suttaIndexHtml = `${openingHtml}
  ${settingsBar(indexObject)}
    <div id="sutta-index" class="sutta-index">
    ${index}
    <hr>
    <div id="info">
    <h1>Information</h1>
    ${infoArea}
    </div>
    ${endingHtml}`;

  // Save the finished html file
  try {
    fs.writeFileSync("public/simple/index.html", suttaIndexHtml);
    console.info("🌐 simple/index.html written");
    tidyHtml("public/simple/index.html");
  } catch (err) {
    console.error("❌There was an error writing simple/index.html");
    console.error(err);
  }
}
