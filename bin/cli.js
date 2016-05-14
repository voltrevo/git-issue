#!/usr/bin/env node

/* eslint-disable no-console */

'use strict';

const path = require('path');

const afs = require('abstract-fs');
const once = require('lodash/once');

const args = require('minimist')(process.argv.slice(2));

const openIssue = require('..');

if (args._.length === 0) {
  console.warn('No positional arguments were specified, doing nothing.');
  process.exit(0);
}

const getConfig = once(() => (
  afs.System.File(path.join(process.env.HOME, '.git-issue', 'config.json'))
    .read()
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

const resolveTemplateName = (templateName) => {
  const pathObj = path.parse(templateName);

  const tryDir = (dir) => afs.System.Dir(dir)
    .contents()
    .then(dirContents => {
      const matches = dirContents.files.filter(dirFile => {
        if (pathObj.ext) {
          return dirFile === pathObj.base;
        }

        return path.parse(dirFile).name === pathObj.name;
      });

      if (matches.length > 1) {
        throw new Error(
          `Multiple matches found for ${templateName} in ${dir}: ${matches.join(', ')}`
        );
      }

      if (matches.length === 0) {
        return null;
      }

      return path.join(dir, matches[0]);
    })
  ;

  const lookupPaths = ['.', path.join(process.env.HOME, '.git-issue', 'templates')];

  const lookupLoop = (i) => {
    if (i >= lookupPaths.length) {
      return Promise.reject(new Error(`Template not found: ${templateName}`));
    }

    return tryDir(lookupPaths[i])
      .then(match => {
        if (match === null) {
          return lookupLoop(i + 1);
        }

        return match;
      })
    ;
  };

  return lookupLoop(0);
};

Promise
  .all(args._.map(templateName =>
    Promise.all([getRepo(), resolveTemplateName(templateName)])
      .then(res => {
        const repo = res[0];
        const fname = res[1];

        return openIssue(repo, fname);
      })
  ))
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
;
