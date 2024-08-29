import fs from "fs";

export default function logTsvCreationDate() {
  try {
    const tsvStatsObject = fs.statSync("src/data/general-index.csv", "utf8");
    const formattedMtime = tsvStatsObject.mtime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    const formattedMtimeDate = tsvStatsObject.mtime.toLocaleString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.info(`📅 TSV creation date: ${formattedMtimeDate} ${formattedMtime}`);
  } catch (err) {
    console.error(err);
  }
}
