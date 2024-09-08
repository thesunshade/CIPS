import read from "./read.js";

export default function createRawIndexArray(file) {
  let lines = read(file).split("\n");
  let rawIndexArray = [];

  for (let i = 0; i < lines.length; i++) {
    rawIndexArray[i] = lines[i].split("\t");
  }

  return rawIndexArray;
}
