import fs from "fs";
import getSuttaTitle from "./getSuttaTitle.js";
import getSuttaBlurb from "./getSuttaBlurb.js";
import { openinglocatorSortedTableHtml } from "../functions/htmlParts/openinglocatorSortedTableHtml.js";

export default function createLocatorSortedTableHtml(locatorBookObject) {
  let locatorSortedTableHtml = openinglocatorSortedTableHtml;

  function citationOnly(locator) {
    if (locator.includes(":")) {
      return locator.split(":")[0].toLowerCase();
    }
    return locator;
  }

  function segmentOnly(locator) {
    if (locator.includes(":")) {
      return "#" + locator.toLowerCase();
    }
    return "";
  }

  const table = Object.keys(locatorBookObject)
    .map(book =>
      locatorBookObject[book]
        .map(
          (data, index) =>
            `${
              index === 0
                ? `<tr id=${book} class="book-header-row">
              <td colSpan="3">
                <h2>${book}</h2>
              </td>
            </tr>`
                : ""
            }
          <tr>
            <td>
              <a href="${`https://suttacentral.net/${citationOnly(data[0])}/en/sujato${segmentOnly(data[0])}`}" title="${getSuttaBlurb(data[0])}" target="_blank" rel="noreferrer"> 
                ${data[0]} <small>${getSuttaTitle(data[0])}</small>
              </a>
            </td>
            <td>${data[1]}</td>
            <td>${data[2]}</td>
          </tr>`
        )
        .join("")
    )
    .join("");

  locatorSortedTableHtml += table + `</tbody>\n</table>\n</body>\n</html>`;

  try {
    fs.writeFileSync("public/locatorSortedTable.html", locatorSortedTableHtml);
    console.info("🌐 locatorSortedTableHtml written");
  } catch (err) {
    console.error("❌There was an error writing locatorSortedTableHtml");
    console.error(err);
  }
}
