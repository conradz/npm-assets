'use strict';
var assets = require('./');
var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
test('list test assets', function listTestAssets(assert) {
  assets.find(path.join(__dirname, 'test'), found);

  function found(err, assetList) {
    assert.error(err, 'successful');
    assert.equal(assetList.length, 3);

    assert.equal(assetList[0].name, 'foo/bar.txt');
    assert.equal(
            path.normalize(assetList[0].path),
            path.normalize(path.join(
                __dirname, 'test/node_modules/hello/foo/bar.txt')));

    assert.equal(assetList[1].name, 'foo/bar.txt');
    assert.equal(
            path.normalize(assetList[1].path),
            path.normalize(path.join(
                __dirname, 'test/node_modules/hello-again/foo/bar.txt')));

    assert.equal(assetList[2].name, 'test.txt');
    assert.equal(
            path.normalize(assetList[2].path),
            path.normalize(path.join(
                __dirname, 'test/test.txt')));

    assert.end();
  }
});

test('copy assets', function copyAssets(assert) {
  var srcDir = path.join(__dirname, 'test');
  var destDir = path.join(__dirname, 'assets');
  rimraf(destDir, removed);

  function removed(err) {
    assert.error(err, 'removed dir');

    assets(srcDir, destDir, copied);
  }

  function copied(err) {
    assert.error(err, 'copied assets');
    compare('foo/bar.txt', path.join(srcDir, 'node_modules/hello'));
    compare('test.txt', srcDir);

    function compare(file, originalSrcDir) {
      /* eslint-disable no-sync */
      var src = fs.readFileSync(path.join(originalSrcDir, file), 'utf8');
      var dest = fs.readFileSync(path.join(destDir, file), 'utf8');
      assert.equal(src, dest, 'file ' + file + ' is copied');
    }

    assert.end();
  }
});
