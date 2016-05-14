'use strict';

const test = require('tape');

const issueToUrl = require('./issueToUrl.js');

test('uses filename for title when first line isn\'t a heading', t => {
  t.plan(1);

  t.equal(
    issueToUrl(
      'https://github.com/joe/blog',
      'do-stuff.md',
      [
        '- [ ] task 1',
        '- [ ] task 2',
      ].join('\n')
    ),
    (
      'https://github.com/joe/blog/issues/new?' +
        'title=Do%20Stuff&' +
        'body=-%20%5B%20%5D%20task%201%0A-%20%5B%20%5D%20task%202'
    )
  );
});

test('uses heading for title when available', t => {
  t.plan(1);

  t.equal(
    issueToUrl(
      'https://github.com/joe/blog',
      'ignore-the-filename.md',
      [
        '# Do Stuff',
        '',
        '- [ ] task 1',
        '- [ ] task 2',
      ].join('\n')
    ),
    (
      'https://github.com/joe/blog/issues/new?' +
        'title=Do%20Stuff&' +
        'body=-%20%5B%20%5D%20task%201%0A-%20%5B%20%5D%20task%202'
    )
  );
});

test('escapes +', t => {
  t.plan(1);

  t.equal(
    issueToUrl(
      'https://github.com/joe/blog',
      'foo.md',
      [
        '- [ ] Do 3+ things',
      ].join('\n')
    ),
    (
      'https://github.com/joe/blog/issues/new?' +
        'title=Foo&' +
        'body=-%20%5B%20%5D%20Do%203%2b%20things'
    )
  );
});
