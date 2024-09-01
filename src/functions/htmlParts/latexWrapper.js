export function latexWrapper(contents) {
  return `\\pdfminorversion=4
\\documentclass[]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,latexsym,amsmath}
\\usepackage[a4paper,top=3cm,bottom=2cm,left=3cm,right=3cm,marginparwidth=1.75cm]{geometry}
\\usepackage{graphicx}
\\usepackage[colorlinks=true, allcolors=blue]{hyperref}

\\makeatletter
\\renewcommand\\subitem{\\par\\hangindent 1em \\hspace*{1em}}
\\makeatother


\\begin{document}

\\begin{theindex}
${contents}
\\end{theindex}

\\end{document}`;
}
