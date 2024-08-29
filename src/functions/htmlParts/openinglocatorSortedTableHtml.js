export const openinglocatorSortedTableHtml = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-table.png">
  <title>Locators sorted by sutta</title>
  <style>

 @import url('https://fonts.googleapis.com/css2?family=Fira+Sans+Extra+Condensed:wght@400;700&display=swap');

  :root {
  --indent: 3.5rem;
  --mobile-indent: .5rem;
  --primary: rgb(238, 111, 32);
  --dark-primary: #6b1617;
  --offwhite: #fff9f1;
  --dark-offwhite: #d1d1d1;
  --offblack: #150d01;
  --dark-link: #729cff;
  --dark-visited: #b472ff;
  --dn: #d1eddf;
  --mn: #F5DEB3;
  --sn: #ADD8E6;
  --an: #E6E6FA;
  --kp: #FFD485;
  --dhp: #B7E0D2;
  --ud: #e9e296;
  --iti: #FFE4E1;
  --snp: #FAF0E6;
  --vv: #FAFAD2;
  --pv: #D3D3D3;
  --thag: #DDF0FF;
  --thig: #DCE3C7;
  accent-color: black;
}

.book-selector {
  background: var(--primary);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 40rem;
  min-width: 0;
  top: 0rem;
  position: sticky;
  height:2rem;
  border-bottom: .1rem solid black;
}

.book-button {
  color: black;
  font-family: "Fira Sans Extra Condensed";
  padding: 4px 4px 3px 3px;
  text-decoration: none !important;
  font-weight:bold;
}

.book-button:visited {
  color: black;
}

.dark .book-button:visited {
  color: var(--offwhite);
}

.locator-sorted-table {
  font-family: "Fira Sans Extra Condensed";
  border-collapse: collapse;
  width: 40rem;
  table-layout: fixed;
  border: 1px solid
}

.table-header-row {
  top: 2.1rem;
  position: sticky;
  border: solid 1px;
  background: var(--primary);

}

.book-header-row {
  background: var(--primary) !important;
}

.dark .table-header-row,
.dark .book-header-row {
  background: var(--dark-primary) !important
}



td,
th {
  border: 1px solid #a8a8a8;
  text-align: left;
  padding: 2px;
}

.dark td,
.dark th {
  border: 1px solid #716363;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.dark tr:nth-child(even) {
  background-color: #2b201f;
}

td a {
text-decoration:none
}
  </style>
  </head>
  <body>
      <div id="book-selector" class="book-selector">
      <a href="#DN" class="book-button">
        DN
      </a>
      <a href="#MN" class="book-button">
        MN
      </a>
      <a href="#SN" class="book-button">
        SN
      </a>
      <a href="#SN" class="book-button">
        SN
      </a>
      <a href="#AN" class="book-button">
        AN
      </a>
      <a href="#Kp" class="book-button">
        Kp
      </a>
      <a href="#Dhp" class="book-button">
        Dhp
      </a>
      <a href="#Ud" class="book-button">
        Ud
      </a>
      <a href="#Iti" class="book-button">
        Iti
      </a>
      <a href="#Snp" class="book-button">
        Snp
      </a>
      <a href="#Vv" class="book-button">
        Vv
      </a>
      <a href="#Pv" class="book-button">
        Pv
      </a>
      <a href="#Thag" class="book-button">
        Thag
      </a>
      <a href="#Thig" class="book-button">
        Thig
      </a>
    </div>
  <table class="locator-sorted-table">
      <thead class="table-header-row">
        <tr>
          <th class="first-column">Citation</th>
          <th class="second-column">Keyword</th>
          <th class="third-column">SubHead</th>
        </tr>
      </thead>
      <tbody>`;
