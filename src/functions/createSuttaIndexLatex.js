import fs from "fs";
import { exec } from "child_process";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";
import { latexWrapper } from "./htmlParts/latexWrapper.js";
import sortedKeys from "../functionsBuilding/sortedKeys.js";
import getSuttaBlurb from "../functionsBuilding/getSuttaBlurb.js";
import getSuttaTitle from "../functionsBuilding/getSuttaTitle.js";
import justBook from "../functionsBuilding/justBook.js";
import convertVatthus from "../functionsBuilding/convertVatthus.js";
import { tidyHtml } from "../functionsBuilding/tidyHtml.js";
// import { indexObject } from "../data/index-object.js";

export default function createSuttaIndexLatex(indexObject) {
  function makeLinkText(locator) {
    if (/^CUSTOM:/.test(locator)) {
      const components = locator.split(":");
      return components[2];
    } else {
      return locator;
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
        headwordWithCount = `${rootHeadword[0]}^${counterNumber}`;
        return headwordWithCount;
      } else {
        headwordWithCount = `${rootHeadword[0]}^${counterNumber} (${rootHeadword[1]}`;
        return headwordWithCount;
      }
    } else return headword;
  }

  function constructHeadWordArea(headwordId, headwordWithCounter, headword) {
    return `\n \\item ${headwordWithCounter}`;
  }

  function constructLocatorListHtml(locatorListObject) {
    const locatorListHtml = locatorListObject.locators
      .map((locator, index) => {
        return constructLocatorHtml(locatorListObject, locator, index);
      })
      .join("");
    return " " + locatorListHtml;
  }

  function constructLocatorHtml(locatorListObject, locator, index) {
    const linkText = makeLinkText(locator);
    const connector = index + 1 === locatorListObject.locators.length ? "" : ", ";
    return `${linkText}${connector}`;
  }

  function constructXrefHtml(locatorListObject, rawXref, index) {
    const xref = rawXref.replace("xref ", "");
    const xrefId = makeNormalizedId(xref);
    const numberOfXrefs = locatorListObject.xrefs.length;
    return `   \\subsubitem \\textit{${xref}}${index + 1 === numberOfXrefs ? "" : ";\n"}`;
  }

  function constructSublessLocatorList(locatorListObject, subhead) {
    if (subhead === "") {
      const locatorListHtml = locatorListObject.locators
        .map((locator, index) => {
          return constructLocatorHtml(locatorListObject, locator, index);
        })
        .join("");
      return locatorListHtml ? `  \\subitem ${locatorListHtml}` : "";
    } else return "";
  }

  let alphabet = Object.keys(indexObject);

  // this builds the html for the index
  const index = alphabet
    .map(letter => {
      const headwordsObject = indexObject[letter];
      const headwordsArray = Object.keys(headwordsObject);
      return ` \\item ${letter}
      ${headwordsArray
        .map(headword => {
          let sortedSubWords = sortedKeys(headwordsObject[headword]);
          let headwordId = makeNormalizedId(headword);
          let headwordWithCounter = injectCounterNumber(headword, headwordsObject[headword].counter_value);
          sortedSubWords = sortedSubWords.filter(item => item !== "counter_value");
          return `${constructHeadWordArea(headwordId, headwordWithCounter, headword)}${sortedSubWords
            .map(subhead => {
              const locatorListObject = headwordsObject[headword][subhead];
              return `${constructSublessLocatorList(locatorListObject, subhead)}
  \\subitem ${subhead === "" && locatorListObject.xrefs.length > 0 ? (sortedSubWords.length === 1 ? "\\textit{see} \n" : "\\textit{see also} \n") : subhead}${locatorListObject.xrefs
                .map((rawXref, index) => {
                  return constructXrefHtml(locatorListObject, rawXref, index);
                })
                .join("")}${subhead === "" ? "" : constructLocatorListHtml(locatorListObject)}`;
            })
            .join("")}`;
        })
        .join("")}`;
    })
    .join("");

  // asemble all the parts
  let suttaIndexLatex = latexWrapper(index);

  // Save the finished html file
  try {
    fs.writeFileSync("public/latex/index.tex", suttaIndexLatex);
    console.info("🌐 index.tex written");
  } catch (err) {
    console.error("❌There was an error writing index.tex");
    console.error(err);
  }
}
