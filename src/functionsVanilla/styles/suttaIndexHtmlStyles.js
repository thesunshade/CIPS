export const suttaIndexHtmlStyles = `
<style>

@font-face {
    font-family: "Fira Sans";
    src: url("fonts/firasans-regular-webfont.woff") format('woff'),
      url("fonts/firasans-regular-webfont.woff2") format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Fira Sans";
    src: url("fonts/firasans-medium-webfont.woff") format('woff'),
      url("fonts/firasans-medium-webfont.woff2") format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Fira Sans";
    src: url("fonts/firasans-italic-webfont.woff") format('woff'),
      url("fonts/firasans-italic-webfont.woff2") format('woff2');
    font-weight: normal;
    font-style: italic;
  }
  
  @font-face {
    font-family: "Fira Sans Extra Condensed";
    src: url("fonts/firasansextracondensed-regular-webfont.woff") format('woff'),
      url("fonts/firasansextracondensed-regular-webfont.woff2") format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Fira Sans Extra Condensed";
    src: url("fonts/firasansextracondensed-medium-webfont.woff") format('woff'),
      url("fonts/firasansextracondensed-medium-webfont.woff2") format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Fira Sans Extra Condensed";
    src: url("fonts/firasansextracondensed-italic-webfont.woff") format('woff'),
      url("fonts/firasansextracondensed-italic-webfont.woff2") format('woff2');
    font-weight: normal;
    font-style: italic;
  }
  
  @font-face {
    font-family: "Fira Code";
    src: url("fonts/firacode-bold-webfont.woff") format('woff'),
      url("fonts/firacode-bold-webfont.woff2") format('woff2');
    font-weight: bold;
    font-style: normal;
  }

*,
*::before,
*::after {
  box-sizing: border-box;
}

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

body {
  max-height:100vh;
  max-width: 100vw;
  font-family: "Fira Sans";
  line-height: 125%;
  background-color: var(--offwhite);
  margin: 0;
  padding: 0;
}

::selection {
  background-color: var(--primary);
}

body.dark {
  background-color: var(--offblack);
  color: var(--dark-offwhite);
}

html {
  scroll-padding-top: 4rem;
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box
}

p {
  margin: 0;
  font-family: "Fira Sans";
}

a {
  text-decoration: none;
  white-space: nowrap;
  word-spacing: -3px;
}

.settings-bar {
  background-color: var(--primary);
  position: fixed;
  top: 0;
  width: 100vw;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0 10px;
  z-index: 100;
  min-height:4.5rem;
}

.top-row {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  align-items: center;
  padding: .5rem 0;
  min-width: 360px;
}

input {
font-family: "Fira Sans";
font-size: inherit;
}

.dark .input-box {
  border-color: var(--offwhite);
  background-color: var(--dark-primary);
}

.settings-button img {
  display: flex;
  margin-top: 0.2rem;
  rotate: 0deg;
  transition: rotate ease-in-out 1s;
  cursor: pointer;
}

.settings-button img:active {
  rotate: 90deg;
}

.icon {
  filter: brightness(0);

}

.dark .icon {
  filter: brightness(1);
  filter: invert(100%);
}


.alphabet {
  font-family: "Fira Code";
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 35rem;
  min-width: 0;
}

.alphabet a,
.alphabet a:visited {
  color: black;
}

.alphabet span {
  border-radius: 8px 8px 0px 0px;
  padding: 4px 4px 3px 3px;
  cursor: pointer;
}

.alphabet span:hover {
  color: var(--primary);
  text-decoration: none;
  background-color: black;
}

.dark .alphabet span:hover {
  color: var(--dark-primary) !important;
  background-color: var(--offwhite);
}

.dark .alphabet a,
.dark .alphabet a:visited {
  color: var(--offwhite)
}


.dark .settings-bar {
  background-color: var(--dark-primary);
}

.search-results {
  overflow-y: auto;
  overflow-x: auto;
  max-width:calc(100vw - 25px);
  text-wrap: wrap;
}

.link-list, .search-results {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 50vh;
  background-color: var(--offwhite);
  margin: 0 0 1rem 0;
  overscroll-behavior: contain;
  padding: 10px;
}

.search-results:empty {
  display: none;
}

.link-list a:hover {
  background-color: var(--primary);
  color: black;
}


.link-list div {
  list-style: none;
  text-indent: -1rem;
}

.dark .link-list, .dark .search-results {

  background-color: var(--offblack);

}

.menu-item {
  padding-left: 1rem;
  text-indent: -1rem;
  display: block;
  cursor: pointer;
}

.menu-item strong{
font-weight: bold;
}

.menu-item:hover, .menu-item.active {
  background-color: var(--primary);
  color: black;
}

.link-list div {
  padding-left: 1rem;
  display: block
}

.separator {
    border-top: 1px solid #ddd;
    margin: 0.5rem 0;
}

.alphabet-anchor {
  font-size: 1.6rem;
  border-bottom: solid #3f3f3f 2px;
  margin-top: 1rem;
  margin-left: 1rem;
  color: #3f3f3f;
  padding-bottom: .5rem;
  font-weight: bold;
  font-family: "Fira Code";

}

.dark .alphabet-anchor {
  font-size: 1.6rem;
  border-bottom: solid #bfbfbf 2px;
  color: #bfbfbf;
  margin-top: 1rem;
}

.head-word-area {
  padding-top: .4rem;
  position: sticky;
  top: 4.2rem;
  background-color: var(--offwhite);
}

.dark .head-word-area {
  background-color: var(--offblack);
}

.head-word {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.counter {
  padding-bottom:.3rem;
  padding-right:.25rem;
  font-size: .83em;
  color: gray;
}

.headword-link,
.headword-link:visited {
  color: var(--offblack);
  word-spacing: inherit;
  position: relative;
  text-decoration: none !important;
  white-space: inherit;
}

.dark .headword-link,
.dark .headword-link:visited {
  color: var(--dark-offwhite)
}

/* headword icons */

.copy-icon, .link-icon {
  padding-right: .1rem;
  padding-left: .1rem;
}


.headword-link .link-icon,
.headword-link .copy-icon {
  visibility: hidden;
}

.headword-link:hover .link-icon,
.link-icon:hover,
.headword-link:hover .copy-icon,
.copy-icon:hover {
  visibility: inherit;
}


.sub-word {
  padding-left: 6.5rem;
  text-indent: -2rem;
  line-height: 1.4rem;
}

a.xref-link {
  white-space: inherit;
  word-spacing: inherit;
}

.xref-link {
  color: #007b00;
  font-style: italic;
}

.xref-link:visited {
  color: #007b00
}

.dark .xref-link {
  color: #00af00
}

.dark .xref-link:visited {
  color: #00af00
}

.locator {
text-decoration: none
}

.colored-locators .locator {
  border: solid 1px rgb(220, 220, 220);
}

.colored-locators .dn {
  background-color: var(--dn);
}

.colored-locators .mn {
  background-color: var(--mn);
}

.colored-locators .sn {
  background-color: var(--sn);
}

.colored-locators .an {
  background-color: var(--an);
}

.colored-locators .kp {
  background-color: var(--kp);
}

.colored-locators .dhp {
  background-color: var(--dhp);
}

.colored-locators .ud {
  background-color: var(--ud);
}

.colored-locators .iti {
  background-color: var(--iti);
}

.colored-locators .snp {
  background-color: var(--snp);
}

.colored-locators .vv {
  background-color: var(--vv);
}

.colored-locators .pv {
  background-color: var(--pv);
}

.colored-locators .thag {
  background-color: var(--thag);
}

.colored-locators .thig {
  background-color: var(--thig);
}

@media only screen and (max-width: 475px) {

  body {
    font-family: "Fira Sans Extra Condensed";
  }

  .sutta-index {
    line-height: 130%;
    margin: 6rem .5rem;
  }

  input {
    max-width: 16rem;
    font-family: "Fira Sans Extra Condensed";
    }

  .alphabet {

    max-width: 100% !important;
  }

  .alphabet span {
    padding: 0px;
  }

  .alphabet span:hover {
    color: rgb(109, 109, 109);
    background-color: inherit;
  }

  .dark .alphabet a:hover {
    color: var(--primary) !important;
    background-color: inherit;
  }

  .head-word-area {
    /* top: 5.2rem; */
  }

  .sub-word {
    padding-left: var(--mobile-indent);
    text-indent: initial;
  }

  .sutta-name {
    display: none;
  }

  .link-icon,
  .copy-icon {
    display:none;
  padding-right: .2rem;
  padding-left: .2rem;
}

 body.copy-buttons-visible .link-icon,
 body.copy-buttons-visible .copy-icon {
    display:inherit;
  }
}

.snack-bar {
  font-size: 1.2rem;
  position: fixed;
  top: 7rem;
  left: 50%;
  transform: translateX(-50%);
  width: 8rem;
  border-radius: 10px;
  background-color: var(--primary);
  color: var(--offblack);
  text-align: center;
  padding: 10px;
  box-shadow: 1px -1px 3px rgba(0, 0, 0, 0.2);
  opacity: 1;
  transition: opacity 0.15s ease-in-out;
  z-index: 9999;
}

.hide-snack-bar .snack-bar {
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  pointer-events: none;
}

.dark .snack-bar {
  background-color: var(--offwhite);
  color: var(--dark-primary);
  box-shadow: 1px -1px 3px rgb(0, 0, 0);
}

.info-area {
  padding: 0rem 0 1rem;
  min-width: 10rem;
  max-width: 35rem;
  max-height: 70vh;
  overflow-y: auto;
  border-top: solid 1px;
  overscroll-behavior: contain;
}

.settings-button-row {
display:flex;
flex-direction:row;
justify-content: center;
align-items: center;
column-gap: 1rem;
margin-top: .5rem;
margin-bottom: .5rem;
}

body.copy-buttons-visible .link-icon,
body.copy-buttons-visible .copy-icon {
    visibility: inherit;
  }

.hidden {
display:none
}

.info-area p {
  line-height: 130%;
  margin-bottom: .7rem;

}

.info-area a,
.info-area a:visited {
  color: rgb(0, 48, 207)
}

details summary {
  cursor: pointer;
}

details>div {
  border-left: solid 2px black;
  margin-left: .7rem;
  padding-left: .7rem;
}

.stats {
  margin-top: 1rem;
  padding: 10px 15px;
  line-height: 1.6rem;
  border: solid 2px black;
  border-radius: 5px;
  max-width: 16rem
}

.dark .stats {
  border-color: var(--offwhite);
}

.answer {
  font-weight: bold;
  display: inline;
}

.update-date {
  font-size: .7rem;
  text-align: right;
}

.tippy-box[data-theme~='info'] {
  background-color: #c9c9c9;
  color: black;
  border: 1px solid black;
}
.tippy-box[data-theme~='info'] > .tippy-arrow::before {
  border-top-color: #c9c9c9;
  border-bottom-color: #c9c9c9;
}

.tippy-content:empty {
    display: none;
}

.tippy-content:empty + .tippy-arrow {
    display: none;
}

.tippy-box{border:1px transparent}.tippy-box[data-placement^=top]>.tippy-arrow:after{border-top-color:inherit;border-width:8px 8px 0;bottom:-8px;left:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:after{border-bottom-color:inherit;border-width:0 8px 8px;top:-8px;left:0}.tippy-box[data-placement^=left]>.tippy-arrow:after{border-left-color:inherit;border-width:8px 0 8px 8px;right:-8px;top:0}.tippy-box[data-placement^=right]>.tippy-arrow:after{border-width:8px 8px 8px 0;left:-8px;top:0;border-right-color:inherit}.tippy-box[data-placement^=top]>.tippy-svg-arrow>svg:first-child:not(:last-child){top:17px}.tippy-box[data-placement^=bottom]>.tippy-svg-arrow>svg:first-child:not(:last-child){bottom:17px}.tippy-box[data-placement^=left]>.tippy-svg-arrow>svg:first-child:not(:last-child){left:12px}.tippy-box[data-placement^=right]>.tippy-svg-arrow>svg:first-child:not(:last-child){right:12px}.tippy-arrow{border-color:inherit}.tippy-arrow:after{content:"";z-index:-1;position:absolute;border-color:transparent;border-style:solid}

  </style>
`;
