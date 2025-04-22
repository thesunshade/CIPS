import fs from "fs";
import createRawIndexArray from "./src/functionsBuilding/createRawIndexArray.js";
import save from "./src/functionsBuilding/save.js";
import initializeAlphabetObject from "./src/functionsBuilding/initializeAlphabetObject.js";
import errorCheckHeadSub from "./src/functionsBuilding/errorCheckHeadSub.js";
import natsort from "./src/functionsBuilding/natsort.js";
import createDate from "./src/functionsBuilding/createDate.js";
import normalizeDiacriticString from "./src/functionsBuilding/normalizeDiacriticString.js";
import sortCitationsList from "./src/functionsBuilding/sortCitationsList.js";
import findNonUniqueHeadwords from "./src/functionsBuilding/findNonUniqueHeadwords.js";
import logTsvCreationDate from "./src/functionsBuilding/logTsvCreationDate.js";
import createLocatorSortedTableHtml from "./src/functionsBuilding/createLocatorSortedTableHtml.js";
import { blurbs } from "./src/data/blurbs.js";

let locatorFirstArray = [];
let xrefArray = [];

const indexObject = initializeAlphabetObject();
const alphabetGroupedObject = initializeAlphabetObject();

function writeStats(stat, label) {
  const formattedDate = new Date()
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");
  const statsString = `|${formattedDate}|${label}|${stat.toLocaleString("en-US")}|\n`;

  fs.appendFile("src/data/stats.md", statsString, err => {
    if (err) throw err;
  });
}

// build the index object
function createIndexObject(indexArray) {
  let rawIndexArray = [...indexArray];

  // change blank sub-headings to —
  function transformArray(rawIndexArray) {
    return rawIndexArray.map(item => {
      const subheadHasJustWhitespace = /^\s*$/.test(item[1]);
      if (subheadHasJustWhitespace && !item[2].includes("xref")) {
        item[1] = "—";
      }
      return item;
    });
  }

  rawIndexArray = transformArray(rawIndexArray);

  for (let i = 0; i < rawIndexArray.length - 1; i++) {
    const head = rawIndexArray[i][0].trim();
    let sub = "";
    try {
      sub = rawIndexArray[i][1].trim();
    } catch (err) {
      console.error(`❌ Cannot process csv file. Try TAB delimited instead.`);
      process.exit(1); // stop the script
    }
    const locator = rawIndexArray[i][2].trim();

    const headStartingWithLetter = head.replace("“", "");
    const firstRealLetter = normalizeDiacriticString(headStartingWithLetter.charAt(0)).toUpperCase();
    errorCheckHeadSub(head, sub);
    const letterKey = alphabetGroupedObject[firstRealLetter];

    if (!letterKey.hasOwnProperty(head)) {
      // the key of the headword does not exist in the object yet, so create the key and add the locator-xref object
      letterKey[head] = { [sub]: { locators: [], xrefs: [] } };
      if (/xref/.test(locator)) {
        letterKey[head][sub].xrefs.push(locator);
      } else {
        letterKey[head][sub].locators.push(locator);
      }
    } else {
      if (!letterKey[head].hasOwnProperty(sub)) {
        // the key for the headword exists, but the sub does not exist as a key
        letterKey[head][sub] = { locators: [], xrefs: [] };

        if (/xref/.test(locator)) {
          letterKey[head][sub].xrefs.push(locator);
        } else {
          letterKey[head][sub].locators.push(locator);
        }
      } else {
        // the head and sub already exist, so the locator must be pushed into the array
        if (/xref/.test(locator)) {
          letterKey[head][sub].xrefs.push(locator);
        } else {
          if (!letterKey[head][sub].locators.includes(locator)) {
            letterKey[head][sub].locators.push(locator);
          } else {
            console.error(`Duplicate locator found: Head=${head}, Sub=${sub}, Locator=${locator}`);
          }
        }
      }
    }
  }

  // sort locators
  const alphabetArray = Object.keys(alphabetGroupedObject);
  for (let a = 0; a < alphabetArray.length; a++) {
    const headwords = Object.keys(alphabetGroupedObject[alphabetArray[a]]);
    const alphabetObject = alphabetGroupedObject[alphabetArray[a]];

    for (let i = 0; i < headwords.length; i++) {
      const subs = Object.keys(alphabetObject[headwords[i]]);
      const headWordObject = alphabetObject[headwords[i]];
      for (let x = 0; x < subs.length; x++) {
        headWordObject[subs[x]].locators = sortCitationsList(headWordObject[subs[x]].locators);
      }

      for (let x = 0; x < subs.length; x++) {
        headWordObject[subs[x]].xrefs.sort();
      }
    }
  }

  function sortedKeys(object) {
    return Object.keys(object).sort((a, b) => {
      a = a.replace("“", "");
      b = b.replace("“", "");
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }

  let alphabetKeys = Object.keys(indexObject);
  for (let i = 0; i < alphabetKeys.length; i++) {
    const unsortHeadwObj = alphabetGroupedObject[alphabetKeys[i]];
    const sortedHeadwObjArr = sortedKeys(unsortHeadwObj);
    for (let x = 0; x < sortedHeadwObjArr.length; x++) {
      indexObject[alphabetKeys[i]][sortedHeadwObjArr[x]] = alphabetGroupedObject[alphabetKeys[i]][sortedHeadwObjArr[x]];
    }
  }

  function getRootHeadword(headword) {
    return headword.replace(/ \(.+?\)/, "");
  }

  for (let i = 0; i < alphabetKeys.length; i++) {
    const letter = alphabetKeys[i];
    const headwords = Object.keys(indexObject[letter]);
    let counter = 1;
    for (let x = 0; x < headwords.length - 1; x++) {
      const currentHeadword = headwords[x];
      const currentRootHeadword = getRootHeadword(headwords[x]);
      const nextRootHeadword = getRootHeadword(headwords[x + 1]);
      if (currentRootHeadword === nextRootHeadword) {
        indexObject[letter][currentHeadword].counter_value = counter;
        counter++;
      } else if (x > 0) {
        const previousRootHeadword = getRootHeadword(headwords[x - 1]);
        if (currentRootHeadword === previousRootHeadword) {
          indexObject[letter][currentHeadword].counter_value = counter;
          counter = 1;
        }
      }
    }
  }

  // count number of unique locators per headword

  let locatorCountHeadwordsList = [];
  const alphabetList = Object.keys(indexObject);
  for (let i = 0; i < alphabetList.length; i++) {
    const letter = alphabetList[i];
    const letterObject = indexObject[letter];
    const headwordArray = Object.keys(letterObject);

    for (let x = 0; x < headwordArray.length; x++) {
      const headword = headwordArray[x];
      let allLocators = [];
      const headwordObject = letterObject[headword];
      const subheadArray = Object.keys(headwordObject);
      for (let y = 0; y < subheadArray.length; y++) {
        const subhead = subheadArray[y];
        const subheadObject = headwordObject[subhead];
        allLocators.push(subheadObject.locators);
      }
      const uniqueLocatorsLength = [...new Set(allLocators.flat())].length;
      if (uniqueLocatorsLength > 0) {
        locatorCountHeadwordsList.push([headword, uniqueLocatorsLength]);
      }
    }
  }
  locatorCountHeadwordsList.sort(function (a, b) {
    return a[1] - b[1];
  });
  locatorCountHeadwordsList.reverse();

  function headwordSubheadCounts(indexObject) {
    const result = [];

    for (const letter in indexObject) {
      const headwords = indexObject[letter];
      for (const headword in headwords) {
        const subheadCount = Object.keys(headwords[headword]).length;
        result.push([headword, subheadCount]);
      }
    }
    result.sort((a, b) => b[1] - a[1]);

    return result;
  }

  const headwordSubheadCount = `export const headwordSubheadCount =${JSON.stringify(headwordSubheadCounts(indexObject), null, 5)}`;
  save("src/data/headword-subhead-count.js", headwordSubheadCount, "💾");

  const openingHtmlHeadwordSubheadCountHtml = fs.readFileSync(new URL("./src/functions/htmlParts/openingHtmlheadwordSubheadCountHtml.txt", import.meta.url), "utf8");

  const headwordSubheadArray = headwordSubheadCounts(indexObject);

  let headwordSubheadCountHtml = openingHtmlHeadwordSubheadCountHtml;
  let headwordSubheadCounter = 0;
  headwordSubheadCountHtml += `<div class="table">`;
  for (let i = 0; i < headwordSubheadArray.length; i++) {
    headwordSubheadCounter += headwordSubheadArray[i][1];
    headwordSubheadCountHtml += `
    <div class="row">
    <div>${headwordSubheadArray[i][0]}</div>
    <div>${headwordSubheadArray[i][1]}</div>
    </div>`;
  }
  headwordSubheadCountHtml += `
  <div>
  </body>`;

  writeStats(headwordSubheadCounter, "Subheads");

  save("public/subheadCountTable.html", headwordSubheadCountHtml, "🌐");

  const object = `export const indexObject =${JSON.stringify(indexObject, null, 5)}`;
  save("src/data/index-object.js", object, "💾");

  const headwordLocatorCount = `export const headwordLocatorCount =${JSON.stringify(locatorCountHeadwordsList, null, 5)}`;

  save("src/data/headwordLocatorCount.js", headwordLocatorCount, "💾");

  const openingHtmlheadwordLocatorCountHtml = fs.readFileSync(new URL("./src/functions/htmlParts/openingHtmlheadwordLocatorCountHtml.txt", import.meta.url), "utf8");

  let headwordLocatorCountHtml = openingHtmlheadwordLocatorCountHtml;

  headwordLocatorCountHtml += `<div class="table">`;
  for (let i = 0; i < locatorCountHeadwordsList.length; i++) {
    headwordLocatorCountHtml += `
    <div class="row">
    <div>${locatorCountHeadwordsList[i][0]}</div>
    <div>${locatorCountHeadwordsList[i][1]}</div>
    </div>`;
  }
  headwordLocatorCountHtml += `
  <div>
  </body>`;

  save("public/locatorCountTable.html", headwordLocatorCountHtml, "🌐");

  // ---------- S T A T S --------------
  // count total unique locators
  const allLocatorsArray = [];
  for (let i = 0; i < rawIndexArray.length - 1; i++) {
    const locator = rawIndexArray[i][2].trim();
    if (!locator.match(/xref/)) {
      allLocatorsArray.push(locator);
    }
  }

  const alphabetLetters = Object.keys(indexObject);

  let xrefsCount = 0;
  for (let i = 0; i < alphabetLetters.length; i++) {
    const thisLetterObject = indexObject[alphabetLetters[i]];
    const thisLetterHeadKeys = Object.keys(thisLetterObject);
    for (let x = 0; x < thisLetterHeadKeys.length; x++) {
      const headWord = thisLetterHeadKeys[x];
      const headwordObject = thisLetterObject[thisLetterHeadKeys[x]];
      const subheads = Object.keys(headwordObject);
      const xrefObject = thisLetterObject[headWord][""];
      if (xrefObject) {
        const pureXrefTest = headwordObject[""].locators;
        if (subheads.length === 1 && pureXrefTest.length === 0) xrefsCount++;
      }
    }
  }

  const totalUniqueLocatorsLength = [...new Set(allLocatorsArray.flat())].length;
  console.info(`#️⃣  Total unique locators: ${totalUniqueLocatorsLength}`);

  // uniqueLocators.js needs to be fixed for React app

  save("src/data/statsData.js", `export const statsData ={ uniqueLocators: ${totalUniqueLocatorsLength}, xrefsCount: ${xrefsCount}}`, "💾");

  const filteredBlurbs = allLocatorsArray.reduce((result, key) => {
    const locator = key.toLowerCase().split(":")[0];
    if (blurbs.hasOwnProperty(locator)) {
      result[locator] = blurbs[locator];
    }
    return result;
  }, {});

  save("src/data/filteredBlurbs.js", `export const filteredBlurbs =${JSON.stringify(filteredBlurbs, null, 5)}`, "💾");

  // end of total unique locators

  (async () => {
    try {
      const module = await import("./src/functions/createSuttaIndexHtml.js");
      const createSuttaIndexHtml = module.default; // Access the default export
      createSuttaIndexHtml(indexObject);
    } catch (err) {
      console.error("Error loading module:", err);
    }
  })();

  (async () => {
    try {
      const moduleVanilla = await import("./src/functions/createSuttaIndexHtml-vanilla.js");
      const createSuttaIndexHtmlVanilla = moduleVanilla.default; // Access the default export
      createSuttaIndexHtmlVanilla(indexObject);
    } catch (err) {
      console.error("Error loading module:", err);
    }
  })();

  function flattenTopLevel(topLevelObject) {
    const flattened = {};

    // Check if input is an object
    if (typeof topLevelObject !== "object" || topLevelObject === null || Array.isArray(topLevelObject)) {
      throw new Error("Input must be an object with key/value pairs");
    }

    // Process each key in the top-level object
    Object.entries(topLevelObject).forEach(([key, value]) => {
      // Check if the value is an object
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Merge the nested object properties into the flattened result
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          // Handle potential key collisions by prefixing with the parent key
          if (flattened.hasOwnProperty(nestedKey)) {
            flattened[`${key}_${nestedKey}`] = nestedValue;
          } else {
            flattened[nestedKey] = nestedValue;
          }
        });
      } else {
        // Keep non-object values as is
        flattened[key] = value;
      }
    });

    return flattened;
  }

  function findSharedLocators(data) {
    const result = {};

    // Process each headword
    Object.entries(data).forEach(([headword, subheads]) => {
      const locatorMap = {};
      let hasSharedLocators = false;

      // Process each subhead
      Object.entries(subheads).forEach(([subhead, content]) => {
        // Skip empty subheads or those without locators
        if (!subhead || !content.locators || content.locators.length === 0) {
          return;
        }

        // Add each locator to the map
        content.locators.forEach(locator => {
          if (!locatorMap[locator]) {
            locatorMap[locator] = [];
          }
          locatorMap[locator].push(subhead);
        });
      });

      // Filter for locators with multiple subheads
      const sharedLocators = {};
      Object.entries(locatorMap).forEach(([locator, subheadList]) => {
        if (subheadList.length > 1) {
          sharedLocators[locator] = subheadList;
          hasSharedLocators = true;
        }
      });

      // Add to result if headword has any shared locators
      if (hasSharedLocators) {
        result[headword] = sharedLocators;
      }
    });

    return result;
  }

  function generateSharedLocatorsTable(sharedLocatorsData) {
    // First, build the HTML table structure
    let html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-shared.png">
  <title>Locators sharing subheads by headword</title>
  <style>
    table {
      border-collapse: collapse;
      width: 800px;
      margin-bottom: 20px;
    }
    
    th, td {
      border: 2px solid #ddd;
      padding: 6px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .headword-cell {
      position: sticky;
      top: 0;
      background-color: #f9f9f9;
      z-index: 1;
      font-weight: bold;
      width: 200px;
      border: 2px solid #ddd;
      /* Ensure borders are visible in sticky position */
      box-shadow: 0 -2px 0 #ddd, 0 2px 0 #ddd;
    }
    
    .locator-cell {
      /*min-width: 120px;*/
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
    }
    
    li {
      margin-bottom: 4px;
      list-style-type: "– ";
    }
    
    li:last-child {
      margin-bottom: 0;
    }
      /* Mobile responsiveness */
    @media screen and (max-width: 768px) {
      table {
        width: 100%;
        font-size: 14px;
      }
      
      th, td {
        padding: 8px;
      }
      
      .locator-cell {
        min-width: 80px;
      }
      
      /* Force table to not be like a table on mobile */
      table, thead, tbody, th, td, tr {
        display: block;
      }
      
      /* Hide table headers */
      thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
      
      tr {
        margin-bottom: 15px;
        border: 1px solid #ccc;
        position: relative;
      }
      
      td {
        /* Make each cell behave like a row */
        border: none;
        border-bottom: 1px solid #eee;
        padding: 8px;
      }
      
      /* Special handling for headword cells */
      .headword-cell {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: #f0f0f0;
        font-size: 16px;
        border-bottom: 2px solid #aaa;
        font-weight: bold;
        padding: 10px 8px;
      }
      
      /* Adjust list spacing on mobile */
      ul {
        padding-left: 20px;
        margin: 5px 0;
      }
    }
  </style>
  <!-- favicon by https://www.flaticon.com/authors/torskaya -->
  </head>
  <body>
  <table>
    <thead>
      <tr>
        <th>Headword</th>
        <th>Locator</th>
        <th>Subheads</th>
      </tr>
    </thead>
    <tbody>
  `;

    let sharedCounter = 0;
    // Process the data to build table rows
    Object.entries(sharedLocatorsData).forEach(([headword, locators]) => {
      const locatorEntries = Object.entries(locators);
      const rowspan = locatorEntries.length;

      locatorEntries.forEach(([locator, subheads], index) => {
        html += "<tr>";

        // Add headword cell with rowspan only on first row
        if (index === 0) {
          html += `<td class="headword-cell" rowspan="${rowspan}">${headword}</td>`;
        }

        // Add locator
        html += `<td class="locator-cell"><a href="https://suttacentral.net/${locator}/en/sujato" rel="noreferrer" target="_blank">${locator}</a></td>`;

        // Add subheads as unordered list
        html += "<td><ul>";
        sharedCounter += subheads.length;
        subheads.forEach(subhead => {
          html += `<li>${subhead}</li>`;
        });
        html += "</ul></td>";

        html += "</tr>";
      });
    });

    // Close the table and HTML structure
    html += `
    </tbody>
  </table>
  </body>
  </html>
  `;
    writeStats(sharedCounter, "Shared subheads");
    return html;
  }

  const htmlTableOfSharedLocators = generateSharedLocatorsTable(findSharedLocators(flattenTopLevel(indexObject)));

  save("public/SharedLocatorsTable.html", htmlTableOfSharedLocators, "🌐");
}

function createHeadingsArray(indexArray) {
  const rawIndexArray = [...indexArray];
  function makeArrayOfXrefs(rawIndexArray) {
    for (let i = 0; i < rawIndexArray.length; i++) {
      if (/xref/.test(rawIndexArray[i][2])) xrefArray.push(rawIndexArray[i][2].replace("xref ", "").replace("\r", ""));
    }
  }

  let listOfHeadwords = [];
  let alphabetKeys = Object.keys(indexObject);
  for (let i = 0; i < alphabetKeys.length; i++) {
    const headwords = Object.keys(indexObject[alphabetKeys[i]]);
    listOfHeadwords.push(headwords);
  }
  listOfHeadwords = listOfHeadwords.flat();

  findNonUniqueHeadwords(listOfHeadwords);

  const headwordsArray = `export const headwordsArray =${JSON.stringify(listOfHeadwords, null, 5)}`;

  writeStats(listOfHeadwords.length, "Headwords");

  save("src/data/headwords-array.js", headwordsArray, "💾");

  makeArrayOfXrefs(rawIndexArray);

  //go through xrefArray and make sure that each one appears in the list of headwords
  for (let i = 0; i < xrefArray.length; i++) {
    if (!headwordsArray.includes(xrefArray[i].trim())) {
      console.error(`❌❌❌  ${xrefArray[i]} is not a valid xref`);
    }
  }
}

function createLocatorSortedArray(indexArray) {
  const rawIndexArray = [...indexArray];
  for (let i = 0; i < rawIndexArray.length - 1; i++) {
    if (!/xref/.test(rawIndexArray[i][2]) && !/CUSTOM/.test(rawIndexArray[i][2])) {
      locatorFirstArray.push([rawIndexArray[i][2].replace(/\r/, ""), rawIndexArray[i][0], rawIndexArray[i][1]]);
    }
  }

  locatorFirstArray = locatorFirstArray.sort(natsort());

  // test for blank locator field
  for (let i = 0; i < locatorFirstArray.length; i++) {
    const locator = locatorFirstArray[i][0];
    if (locator === "") {
      console.error(`❌❌❌ Missing Locator, Head: ${locatorFirstArray[i][1]}; Sub: ${locatorFirstArray[i][2] ? locatorFirstArray[i][2] : "blank"}`);
    }
    if (!/(DN|MN|SN|AN|Kp|Dhp|Ud|Iti|Snp|Vv|Pv|Thag|Thig|xref)/.test(locator)) {
      console.error(`❌❌❌ Bad citation or xref:${locator ? locator : "blank"}; Head: ${locatorFirstArray[i][1]}; Sub: ${locatorFirstArray[i][2] ? locatorFirstArray[i][2] : "blank"}`);
    }
  }

  // test for blank subheads
  let blankSubheads = 0;
  for (let i = 0; i < locatorFirstArray.length; i++) {
    if (locatorFirstArray[i][2] === "~") blankSubheads++;
  }

  const array = `export const indexArray =${JSON.stringify(locatorFirstArray, null, 5)}`;

  save("src/data/index-array.js", array, "💾");
  console.warn(`☹️  ${blankSubheads} blank subheads`);
}

function createLocatorBookObject() {
  const locatorBookObject = {
    DN: [],
    MN: [],
    SN: [],
    AN: [],
    Kp: [],
    Dhp: [],
    Ud: [],
    Iti: [],
    Snp: [],
    Vv: [],
    Pv: [],
    Thag: [],
    Thig: [],
  };

  function findBook(citation, lineNumber) {
    const match = citation.match(/(DN|MN|SN|AN|Kp|Dhp|Ud|Iti|Snp|Vv|Pv|Thag|Thig|xref)/);

    if (!match) {
      if (citation == "") console.error("citation is empty");
      console.error(`Error: No match found for citation: ${citation} at ${lineNumber}`);
      throw new Error(`Invalid citation: ${citation}`);
    }

    return match[0];
  }

  for (let i = 0; i < locatorFirstArray.length; i++) {
    const book = findBook(locatorFirstArray[i][0], i + 1);
    locatorBookObject[book].push(locatorFirstArray[i]);
  }

  const locatorBookObjectString = `export const locatorBookObject =${JSON.stringify(locatorBookObject, null, 2)}`;

  save("src/data/locator-book-object.js", locatorBookObjectString, "💾");

  createLocatorSortedTableHtml(locatorBookObject);
}

console.info("▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼");
const rawIndexArray = createRawIndexArray("src/data/general-index.csv");
logTsvCreationDate();
createIndexObject(rawIndexArray);
createLocatorSortedArray(rawIndexArray);
createHeadingsArray(rawIndexArray);
createLocatorBookObject();
createDate();
