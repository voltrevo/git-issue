'use strict';

const path = require('path');

const titleCase = require('titlecase');

const escapeExtra = (str) => escape(str).replace(/\+/g, '%2b');

const makeUrl = (repo, title, body) => (
  `${repo}/issues/new?title=${escapeExtra(title)}&body=${escapeExtra(body)}`
);

const fnameToTitleCase = (fname) => {
  const name = path.parse(fname).name;
  const nameWithSpaces = name.replace(/[-_]/g, ' ');

  return titleCase(nameWithSpaces);
};

module.exports = (repo, fname, issueStr) => {
  const lines = issueStr.split('\n');
  let title = fnameToTitleCase(fname);
  let firstBodyLine = 0;

  if (lines[0][0] === '#') {
    title = lines[0].substring(1).trim();
    firstBodyLine++;

    while (firstBodyLine < lines.length && lines[firstBodyLine].trim() === '') {
      firstBodyLine++;
    }
  }

  const body = lines.slice(firstBodyLine).join('\n');

  return makeUrl(repo, title, body);
};
