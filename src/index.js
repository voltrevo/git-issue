'use strict';

const fs = require('fs-promise');

const open = require('open');

const issueToUrl = require('./issueToUrl.js');

module.exports = (repo, fname) => (
  fs.readFile(fname).then(issueStr => {
    const url = issueToUrl(repo, fname, issueStr.toString());

    return new Promise((resolve, reject) => {
      open(url, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  })
);
