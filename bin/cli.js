#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

const path = require('path');

const fs = require('fs-promise');
const once = require('lodash/once');

const args = require('minimist')(process.argv.slice(2));

const openIssue = require('..');

if (args._.length === 0) {
  console.warn('No positional arguments were specified, doing nothing.');
  process.exit(0);
}

const getConfig = once(() => (
  fs.readFile(path.join(process.env.HOME, '.git-issue', 'config.json'))
    .then(content => JSON.parse(content.toString()))
    .catch(err => {
      if (err.code === 'ENOENT') {
        return null;
      }

      throw err;
    })
));

const getRepo = once(() => { // eslint-disable-line arrow-body-style
  return (() => {
    const repoFromArgs = args.repo || args.r;

    if (repoFromArgs) {
      return Promise.resolve(repoFromArgs);
    }

    return getConfig().then(config => {
      if (config === null) {
        throw new Error('A repo was not specified and there is no config file');
      }

      if (config.defaultRepo) {
        return config.defaultRepo;
      }

      throw new Error('A repo was not specified and a default is not configured');
    });
  })().then(rawRepo => {
    if (!/^https?/.test(rawRepo)) {
      return `https://github.com/${rawRepo}`;
    }

    return rawRepo;
  });
});

Promise
  .all(args._.map(fname =>
    getRepo().then(repo => openIssue(repo, fname))
  ))
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
;
