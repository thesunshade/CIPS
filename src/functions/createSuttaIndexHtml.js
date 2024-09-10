import fs from "fs";
import { exec } from "child_process";
import { minify } from "html-minifier-terser";
import makeNormalizedId from "../functionsBuilding/makeNormalizedId.js";
import { settingsBar } from "./htmlParts/settingsBar.js";
import sortedKeys from "../functionsBuilding/sortedKeys.js";
import getSuttaTitle from "../functionsBuilding/getSuttaTitle.js";
import justBook from "../functionsBuilding/justBook.js";
import convertVatthus from "../functionsBuilding/convertVatthus.js";
import { tidyHtml } from "../functionsBuilding/tidyHtml.js";

const endingHtml = fs.readFileSync(new URL("./htmlParts/endingHtml.txt", import.meta.url), "utf8");
const openingHtml = fs.readFileSync(new URL("./htmlParts/openingHtml.txt", import.meta.url), "utf8");
const prefaceHtml = fs.readFileSync(new URL("./htmlParts/prefaceHtml.txt", import.meta.url), "utf8");

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

  function constructHeadWordArea(headwordId, headwordWithCounter, headword) {
    return `\n        <head-word-area>
          <a class="headword-link" href="${"#" + headwordId}">
            <head-word>
              ${headwordWithCounter}
              <img src="images/copy-head.png" alt="copy icon" class="icon copy-icon click-to-copy copy-headword" height="16" data-clipbt="${headword}">
              <img src="images/link.png" alt="link copy icon" class="icon link-icon click-to-copy copy-link" height="16" data-clipbt="index.readingfaithfully.org/#${headwordId}">
              <img src="images/copy-txt.png" alt="text copy icon" class="icon text-icon copy-icon entry-text" height="16" data-head="${headword}">
              <img src="images/copy-html.png" alt="text copy icon" class="icon html-icon copy-icon entry-html" height="16" data-head="${headword}">
              <img src="images/copy-md.png" alt="text copy icon" class="icon markdown-icon copy-icon entry-markdown" height="16" data-head="${headword}">
            </head-word>
          </a>
        </head-word-area>`;
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
    const linkClass = makeLinkClass(locator) + " locator";
    const linkText = makeLinkText(locator);
    const title = getSuttaTitle(locator);
    const connector = index + 1 === locatorListObject.locators.length ? "" : ", ";
    return `\n            <a href="${url}" target="_blank" rel="noreferrer" class="${linkClass}"  data-id="${locator.toLowerCase()}">${linkText}  ${title ? ` <sutta-name>${title}</sutta-name>` : ""}</a>${connector}`;
  }

  function constructXrefHtml(locatorListObject, rawXref, index) {
    const xref = rawXref.replace("xref ", "");
    const xrefId = makeNormalizedId(xref);
    const numberOfXrefs = locatorListObject.xrefs.length;
    return `\n            <a href="#${xrefId}" class="xref-link">${xref}</a>${index + 1 === numberOfXrefs ? "" : "; <br>"}`;
  }

  function constructSublessLocatorList(locatorListObject, subhead) {
    if (subhead === "") {
      const locatorListHtml = locatorListObject.locators
        .map((locator, index) => {
          return constructLocatorHtml(locatorListObject, locator, index);
        })
        .join("");
      return locatorListHtml ? `<sub-w>${locatorListHtml}</sub-w>` : "";
    } else return "";
  }

  let alphabet = Object.keys(indexObject);

  // this builds the html for the index
  const index = alphabet
    .map(letter => {
      const headwordsObject = indexObject[letter];
      const headwordsArray = Object.keys(headwordsObject);
      return `<alphabet-anchor>${letter}</alphabet-anchor>${headwordsArray
        .map(headword => {
          let sortedSubWords = sortedKeys(headwordsObject[headword]);
          let headwordId = makeNormalizedId(headword);
          let headwordWithCounter = injectCounterNumber(headword, headwordsObject[headword].counter_value);
          sortedSubWords = sortedSubWords.filter(item => item !== "counter_value");
          return `\n      <headword-section id="${headwordId}">${constructHeadWordArea(headwordId, headwordWithCounter, headword)}${sortedSubWords
            .map(subhead => {
              const locatorListObject = headwordsObject[headword][subhead];
              return `${constructSublessLocatorList(locatorListObject, subhead)}
        <sub-w>${subhead === "" && locatorListObject.xrefs.length > 0 ? (sortedSubWords.length === 1 ? "see " : "see also ") : subhead}          ${locatorListObject.xrefs
                .map((rawXref, index) => {
                  return constructXrefHtml(locatorListObject, rawXref, index);
                })
                .join("")}${subhead === "" ? "" : constructLocatorListHtml(locatorListObject)}
        </sub-w>`;
            })
            .join("")}
      </headword-section>`;
        })
        .join("")}`;
    })
    .join("");

  // asemble all the parts
  let suttaIndexHtml = `${openingHtml}
    ${settingsBar(indexObject)}
    <div id="sutta-index" class="sutta-index">
    ${prefaceHtml}
    ${index}
    ${endingHtml}`;

  async function createSuttaIndexHtml() {
    // Minify the HTML content
    suttaIndexHtml = await minify(suttaIndexHtml, {
      collapseWhitespace: false,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      // ignoreCustomFragments: [/<a[\s\S]*?<\/a>/], // This regex matches content within <a> tags
    });

    try {
      fs.writeFileSync("public/index.html", suttaIndexHtml);
      console.info("🌐 index.html written");
      tidyHtml("public/index.html");
    } catch (err) {
      console.error("❌There was an error writing index.html");
      console.error(err);
    }
  }
  createSuttaIndexHtml();

  // bundle the scripts
  const rawJsFile = "src/functions/scripts.js";
  const bundledJsFile = "public/index.js";
  const rawCssFile = "public/rawStyles.css";
  const bundledCssFile = "public/index.css";
  // const mini = "";
  const mini = "--minify";
  // const bundleJs = "";
  const bundleJs = "--bundle";
  const external = "--external:getBlurbs.js";
  // const external = "";
  //
  exec(`npx esbuild ${rawJsFile} ${bundleJs} ${mini} --charset=utf8 ${external} --outfile=${bundledJsFile}`, (error, stdout, stderr) => {
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
    console.info(`Stdout: ${stdout}`);
  });

  const rawJsFileTooltips = "src/functions/jitTippy.js";
  const bundledJsFileTooltips = "public/tooltips.js";

  exec(`npx esbuild ${rawJsFileTooltips} --bundle --minify --charset=utf8 --outfile=${bundledJsFileTooltips}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error tooltips: ${error.message}`);
      return;
    }
    if (error && error.code !== 0) {
      console.error(`Command failed with exit code for tooltips${error.code}`);
    }
    if (stderr) {
      const singleLineStderr = stderr.replace(/\r?\n/g, " ").trim();
      console.error(`🛠️  blurbs Script bundled; Stderr: ${singleLineStderr}`);
      return;
    }
    console.info(`Stdout: ${stdout}`);
  });

  // Bundle and minify CSS
  exec(`npx esbuild ${rawCssFile} --bundle --minify --outfile=${bundledCssFile}  --external:*.woff --external:*.woff2`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (error && error.code !== 0) {
      console.error(`Command failed with exit code ${error.code}`);
    }
    if (stderr) {
      const singleLineStderr = stderr.replace(/\r?\n/g, " ").trim();
      console.error(`🖍️  CSS bundled; Stderr: ${singleLineStderr}`);
      return;
    }
    console.info(`Stdout: ${stdout}`);
  });
}
