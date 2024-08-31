import fs from "fs";
import { exec } from "child_process";

export function tidyHtml(htmlFile) {
  // const htmlFile = "public/index.html";
  const tidyReportFile = `src/data/tidyReport-${htmlFile}.txt`;

  exec(`tidy -q -e ${htmlFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`⚠️ Tidy Error for ${htmlFile}: ${error.message}`);
      return;
    }
    if (error && error.code !== 0) {
      console.error(`⚠️ Tidy Command for ${htmlFile} failed with exit code ${error.code}`);
    }
    if (stderr) {
      const singleLineStderr = stderr.replace(/\r?\n/g, " ").trim();
      console.error(`⚠️ Tidy ran with warnings for ${htmlFile}; Stderr: ${singleLineStderr}`);
    }
    if (stdout) {
      try {
        fs.writeFileSync(tidyReportFile, stdout);
        console.info(`📄 Tidy report for ${htmlFile} saved to ${tidyReportFile}`);
      } catch (writeError) {
        console.error(`⚠️ Failed to write tidy errors for ${htmlFile} to ${tidyReportFile}: ${writeError.message}`);
      }
    } else {
      console.info(`🧹 No output from HTMLTidy for ${htmlFile}`);
    }
  });
}
