import makeNormalizedId from "../functionsBuilding/makeNormalizedId";

// copy heading to clipboard
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", event => {
    if (event.target.classList.contains("click-to-copy")) {
      event.preventDefault();
      const textToCopy = event.target.getAttribute("data-clipbt");
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            toggleSnackBar();
          })
          .catch(err => {
            console.error("Failed to copy text:", err);
          });
      }
    } else if (event.target.classList.contains("text-icon")) {
      event.preventDefault();
      const headword = event.target.getAttribute("data-head");
      if (headword) {
        navigator.clipboard
          .writeText(createTxtEntry(headword))
          .then(() => {
            toggleSnackBar();
          })
          .catch(err => {
            console.error("Failed to copy text of entry id : " + headword + " ", err);
          });
      }
    } else if (event.target.classList.contains("html-icon")) {
      event.preventDefault();
      const headword = event.target.getAttribute("data-head");
      if (headword) {
        navigator.clipboard
          .writeText(createHtmlEntry(headword))
          .then(() => {
            toggleSnackBar();
          })
          .catch(err => {
            console.error("Failed to copy text of entry id : " + headword + " ", err);
          });
      }
    } else if (event.target.classList.contains("markdown-icon")) {
      event.preventDefault();
      const headword = event.target.getAttribute("data-head");
      if (headword) {
        navigator.clipboard
          .writeText(createMarkdownEntry(headword))
          .then(() => {
            toggleSnackBar();
          })
          .catch(err => {
            console.error("Failed to copy text of entry id : " + headword + " ", err);
          });
      }
    }
  });
});

function createTxtEntry(headword) {
  const entryObject = createElementObject(makeNormalizedId(headword));

  const subheadsArray = entryObject[headword].subheads;
  let text = "";
  text += headword;
  for (let i = 0; i < subheadsArray.length; i++) {
    const subtitle = subheadsArray[i].title;
    const linksArray = subheadsArray[i].links;
    if (subtitle !== "see" && subtitle !== "see also") {
      text += "\n—" + subtitle + " ";
      for (let x = 0; x < linksArray.length; x++) {
        const location = linksArray[x].location;
        let connector = ", ";
        if (x == linksArray.length - 1) connector = "";
        text += location + connector;
      }
    }
  }
  return text;
}

function createMarkdownEntry(headword) {
  const entryObject = createElementObject(makeNormalizedId(headword));
  const subheadsArray = entryObject[headword].subheads;
  let text = "";
  text += "### " + headword;
  for (let i = 0; i < subheadsArray.length; i++) {
    const subtitle = subheadsArray[i].title;
    const linksArray = subheadsArray[i].links;
    if (subtitle !== "see" && subtitle !== "see also") {
      text += "\n* " + subtitle + " ";
      for (let x = 0; x < linksArray.length; x++) {
        const location = linksArray[x].location;
        const url = linksArray[x].url;
        let connector = ", ";
        if (x == linksArray.length - 1) connector = "";
        text += "[" + location + "](" + url + ")" + connector;
      }
    }
  }
  return text;
}

function createHtmlEntry(headword) {
  const entryObject = createElementObject(makeNormalizedId(headword));
  const subheadsArray = entryObject[headword].subheads;
  let text = "";
  text += "<h1>" + headword + "</h1>\n<ul>\n";
  for (let i = 0; i < subheadsArray.length; i++) {
    const subtitle = subheadsArray[i].title;
    const linksArray = subheadsArray[i].links;
    if (subtitle !== "see" && subtitle !== "see also") {
      text += "\n\t<li>" + subtitle + " ";
      for (let x = 0; x < linksArray.length; x++) {
        const location = linksArray[x].location;
        const url = linksArray[x].url;
        let connector = ", ";
        if (x == linksArray.length - 1) connector = "";
        text += "<a href='" + url + "'>" + location + "</a>" + connector;
      }
      text += "</li>";
    }
  }
  text += "\n</ul>";
  return text;
}

function toggleSnackBar() {
  const appElement = document.getElementById("app");
  appElement.classList.remove("hide-snack-bar");
  setTimeout(() => {
    appElement.classList.add("hide-snack-bar");
  }, 900);
}

function createElementObject(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

  let elementHTML = element.outerHTML;

  let elementObject = elementHTML
    .replace(/ target="_blank" rel="noreferrer"/g, "")
    .replace(/ (title)=".+?"/g, "")
    .replace(/<img.+?>/g, "")
    .replace(/<span class="counter">.+?<\/span>/g, "")
    .replace(/<sutta-name>(.+?)<\/sutta-name>/g, "$1")
    .replace(/>\s+?</g, "><")
    .replace(/(\S)\s+?</g, "$1<")
    .replace(/>\s+?(\S.)/g, ">$1")
    .replace(/<headword-section id=".+?">(.+)<\/headword-section>/, "$1")
    .replace(/<head-word-area><a class="headword-link" href="#(.+?)"><head-word>(.+?)<\/head-word><\/a><\/head-word-area>/, '{  "$2": { "anchor": "$1", "subheads": [')
    .replace(/<sub-w>(.+?)<a/g, '{"title": "$1", "links": [<a')
    .replace(/<a href="(.+?)" class=".+?">(.+?)<\/a>,*/g, '{"url": "$1","location": "$2"},')
    .replace(/<\/sub-w>/g, "]},")
    .replace(/<\/div><sub-w>/g, "")
    .replace(/;<br>/g, "")
    .replace(/,$/, "")
    .replace(/,\]/g, "]")
    .replace(/   /g, " ")
    .replace(/  /g, " ")
    .replace(/<segment-id>/g, "")
    .replace(/<\/segment-id>/g, "")
    .replace(/<span class="ignore">(.+?)<\/span>/g, "$1 ");
  elementObject += "]}}";

  return JSON.parse(elementObject);
}
