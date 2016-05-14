'use strict';

const afs = require('abstract-fs');

const open = require('open');

const issueToUrl = require('./issueToUrl.js');

module.exports = (repo, fname) => (
  afs.System.File(fname).read().then(issueStr => {
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
