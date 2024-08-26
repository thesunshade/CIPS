const fs = require("fs");

let data;
try {
  const tsvFileContents = fs.readFileSync("./src/data/blurbs.json", "utf8");
  data = tsvFileContents;
  console.log("successfully read");
} catch (err) {
  console.log("There was an error");
  console.error(err);
}

let object = JSON.parse(data);

const ids = Object.keys(object);

let string = "";

for (let i = 0; i < ids.length; i++) {
  string += ids[i] + "\n";
}

try {
  fs.writeFileSync("./src/private/ids.txt", string);
  console.log("new location array written");
} catch (err) {
  console.error(err);
}
