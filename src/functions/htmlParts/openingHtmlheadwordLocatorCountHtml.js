export const openingHtmlheadwordLocatorCountHtml = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-table.png">
  <title>Headwords sorted by number of locators</title>
  <style>
  .table{
    display:flex;
    flex-direction:column;
    max-width:20rem;
    border-top:solid 1px black;
    font-family:Arial, Helvetica, sans-serif
  }
  .row{
    display:flex;
    flex-direction:row;
    border-bottom:solid 1px black;
    justify-content: space-between;
    padding:.2rem .5rem;
    border-left:solid 1px black;
    border-right:solid 1px black;
  }
  .row:nth-child(even) {background: #ee7121}
  .row:nth-child(odd) {background: #fff9f1}
  </style>
  </head>
  
  <body>
  <div>The following is the number of unique locators (i.e. citations) that each headword has (across all subheads). Headwords without actual locators are not included.</div>`;
