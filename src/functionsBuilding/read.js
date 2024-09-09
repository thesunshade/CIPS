import fs from "fs";

export default function read(file) {
  try {
    const contents = fs.readFileSync(file, "utf8");
    console.info(`✅ successfully read ${file}`);
    return contents;
  } catch (err) {
    console.errror(`❌There was an error reading ${file}`);
    console.error(err);
  }
}
