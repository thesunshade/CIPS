import { updateDate } from "../../data/updateDate.js";
import { statsData } from "../../data/statsData.js";
import { headwordsArray } from "../../data/headwords-array.js";
import { indexArray } from "../../data/index-array.js";

export const infoAreaHtml = `
      <p>
        This is an incomplete and unpublished draft of an index of the Sutta Piṭaka. For more information, visit the
        <a href="https://github.com/thesunshade/CIPS#readme" rel="noreferrer" target="_blank">
          ReadMe.
        </a>
      </p>

      <details>
        <summary>How to use the index</summary>
        <div>
          <p>
            First, look things up by <em>noun</em> followed by an <em>adjective</em>. If that doesn't work, then try the adjective.
          </p>
          <p>Checking cross references is essential. If you don't find what you need always check cross references. </p>
          <p>
            For the sake of simplicity, the grammar of head and sub words may not always match. For example, <i>energetic, as protector</i> might be more accurately written as <i>energetic, being as protector</i>, which more verbosely would be written as <i>energetic, being energetic serves as a protector.</i>
          </p>
          <p>In all cases, one should actually read the sutta being refrenced and not rely on the index headings or subheadings. For example, some wrong views may be indexed in a way that is not immediately apparent that they are such. So actually reading the sutta is critical for understanding the matter at hand.</p>
          <p>Diacritics are ignored for alphabetization.</p>
        </div>
      </details>
      <details>
        <summary>Pāli</summary>
        <div>
          <p>Pāli is given for some terms. The Pāli is generally in the singular, though the term in the text may be plural.</p>
          <p>Generally, headwords will be in English. For some words where the Pāli is more concise and well known (e.g. Bodhisatta, paccekabuddha) it will be listed under Pāli.</p>
          <p>In some cases, although a Pāli word may appear in parentheses in the head word, the Pāli word may not appear in the text.</p>
        </div>
      </details>
      <details>
        <summary>Sutta Summaries</summary>
        <div>
          <p>On the full version of the index, desktop users can hover over citations with the mouse to see a summary of the sutta. Mobile and touch users can try a long press to see them.</p>
        </div>
      </details>
      <details>
        <summary>More Resources</summary>
        <div>
          <p>
            While this index attempts to be more than just significant occurrences, it is by no mean a complete
            <a href="https://en.wikipedia.org/wiki/Concordance_(publishing)" rel="noreferrer" target="_blank">
              concordance
            </a>
            of all words in the Sutta Piṭaka. For that you may want to try using
            <a href="https://www.digitalpalireader.online" rel="noreferrer" target="_blank">
              the DigitalPaliReader.online
            </a>
            .
          </p>
          <p>
            The
            <a href="https://digitalpalidictionary.github.io/" rel="noreferrer" target="_blank">
              Digital Pāli Dictionary
            </a>
            is also an excellent resource.
          </p>
        </div>
      </details>
      <details>
        <summary>Coverage</summary>
        <div class="row-2">
          <div>
            Complete: <span class="answer">MN; SN 1–3, 12–56; AN; Kp; Dhp; Ud; Iti; Snp; Vv; Pv; Thag; Thig</span>
          </div>
          <div>
            Planned: <span class="answer">DN, SN</span>
          </div>
            <div class="stats">
            <div class="settings-notice">
              Stats:
            </div>
            <div class="row-1">
              <div>
                <span class="answer">${headwordsArray.length}</span> Headwords
              </div>
              <div>
                <span class="answer">${(indexArray.length - statsData.xrefsCount).toLocaleString("en-US")}</span> Locators
              </div>
              <div>
                <span class="answer">${statsData.uniqueLocators.toLocaleString("en-US")}</span> Unique Locators
              </div>
              <div>
                <span class="answer">${statsData.xrefsCount.toLocaleString("en-US")}</span> Xref headwords
              </div>
            </div>
            <p class="update-date">
              <i>Last updated</i>: ${updateDate}
            </p>
          </div>
        </div>
        <p>
          <br />
          All citation for Vimanavatthu and Petavatthu link to SuttaFriends.org as it is the only complete online resource.
        </p>
      </details>
      <details open>
        <summary>Misc.</summary>
        <div>
          <p>
            <a href="./locatorCountTable.html" rel="noreferrer" target="_blank">
              Table of headwords
            </a>
            sorted by number of unique locators.
          </p>
          <p>
            <a href="./locatorSortedTable.html" rel="noreferrer" target="_blank">
              Table of suttas
            </a>
            with headwords and sub-heads.
          </p>
          <p>Proper names may refer to multiple distinct individuals. Also note that some identical looking names may be gendered versions, e.g. Visākhā and Visākha.</p>
        </div>
      </details>
`;
