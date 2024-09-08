export default function errorCheckHeadSub(head, sub) {
  if (head === "") {
    console.error(`⚠️  @${i + 1} there is a blank headword! Sub: ${sub}, Locator: ${locator}`);
  }
  if (/xref/.test(head)) {
    console.warn(`⚠️ The headword  @${i + 1} "${head}" contains 'xref'`);
  }
  if (/["']/.test(sub + head)) {
    console.warn(`⚠️ The sub/headword @${i + 1} ${head}/${sub} contains straight quotes
        This may indicate that the csv file format was incorrect`);
  }
}
