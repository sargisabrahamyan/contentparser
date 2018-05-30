const fetch = require("node-fetch");
var URL = require('url');

const { JSDOM } = require("jsdom");
const Readability = require("readability");

const OPTIONS = {features: {
    FetchExternalResources: false,
    ProcessExternalResources: false
}};

// Note: innerText is subtly different than textContent

module.exports.run = async function(url) {

  // Fetch the original HTML
  console.log("Fetching ", url);
  var text, html,readable_html,readable_text
  try {
  const res = await fetch(url); // TODO: catch errors
  html = await res.text();
  //console.log('html:', html);

  // Create the DOM and get the text content
  console.log('Getting original text');
  const dom = new JSDOM(html, OPTIONS);
  text = _text(dom);

  // Make the page readable
  //console.log('Applying Readability');
  readable_html = _readable(url, dom);
  // Create the new DOM and get the new text content
  console.log('Getting the new readable text');
  const readable_dom = new JSDOM(readable_html, OPTIONS);
  readable_text = _text(readable_dom);
  } catch(err) {
    html = ""
    text = ""
    readable_html = ""
    readable_text = ""
  }
  //console.log('readable text:', readable_text);

  return {
      original: {
        html: html,
        text: text
      },
      readable: {
        html: readable_html,
        text: readable_text
      }
  };
}

function _readable(url, dom) {
  Node = dom.window.Node; // Otherwise there is a bug
  const reader = new Readability(url, dom.window.document);
  const result = reader.parse();
  if (!result || !result.content) {
    console.error("Failed to parse");
    throw Error("Failed to parse");
  }
  return result.content; // html
  // There is also result.title etc.
}

const SECTION_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'FIGCAPTION', 'OL', 'UL', 'DL', 'QUOTE'];
// Note: DIV is not included, we will miss text that is inside a DIV but not inside P
// Note: We should do something about the case where the there is an OL inside a P.

function _text(dom) {

  const sections = [];

  const doc = dom.window.document;
  for (let section of doc.querySelectorAll(SECTION_TAGS.join(', '))) {
    sections.push(section.textContent);
  }
  return sections.join('\n');
}
