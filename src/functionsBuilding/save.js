import fs from "fs";

export default function save(file, information, icon) {
  try {
    fs.writeFileSync(file, information);
    console.info(`${icon} ${file} written`);
  } catch (err) {
    console.error(`❌There was an error writing ${file}`);
    console.error(err);
  }
}
