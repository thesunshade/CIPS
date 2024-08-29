import natsort from "./natsort.js";

export default function sortCitationsList(citations) {
  const orderedBooks = ["DN", "MN", "SN", "AN", "Kp", "Dhp", "Ud", "Iti", "Snp", "Vv", "Pv", "Thag", "Thig"];

  const citationsObject = {
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

  for (let i = 0; i < citations.length; i++) {
    for (let x = 0; x < orderedBooks.length; x++) {
      if (citations[i].match(RegExp(orderedBooks[x]))) {
        citationsObject[orderedBooks[x]].push(citations[i]);
      }
    }
  }

  let bookSubList = [];
  for (let i = 0; i < orderedBooks.length; i++) {
    const book = orderedBooks[i];
    const sortedCitations = citationsObject[book].sort(natsort());
    bookSubList.push(sortedCitations);
  }
  bookSubList = bookSubList.flat();

  if (citations.length > bookSubList.length) {
    console.warn(`❌ There is an invalid ciation: ${citations[0]}`);
  }

  return bookSubList;
}
