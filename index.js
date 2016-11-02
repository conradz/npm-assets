'use strict';
var fs = require('graceful-fs');
var path = require('path');
var findModules = require('find-modules');
var async = require('async');
var mkdirp = require('mkdirp');
module.exports = copyAssets;
copyAssets.find = findAssets;
function copyAssets(root, dest, callback) {
  var assets = null;
  findAssets(root, found);

  function found(err, foundAssets) {
    if (err) {
      return callback(err);
    }

    assets = foundAssets;
    assets.forEach(function addDestToAssetObject(asset) {
      asset.dest = path.join(dest, asset.name);
    });
    assets = assets.filter(function uniqueDests(asset, i, total) {
      for (var n = 0; n < total.length; n += 1) {
        if (total[n].dest === asset.dest) {
          return n === i;
        }
      }
    });
    createDirs(assets, created);
  }

  function created(err) {
    if (err) {
      return callback(err);
    }

    copyFiles(assets, callback);
  }
}

function createDirs(assets, callback) {
  var dirs = assets
    .map(function getDestinationDir(asset) {
      return path.dirname(asset.dest);
    })
    .filter(function uniqueDests(value, i, total) {
      return total.indexOf(value) === i;
    });
  async.forEach(dirs, mkdirp, callback);
}

function copyFiles(assets, callback) {
  async.forEach(assets, copy, callback);
}

function copy(asset, callback) {
  var isDone = false;
  var input = fs.createReadStream(asset.path);
  var output = fs.createWriteStream(asset.dest);
  input.pipe(output);
  input.on('error', done);
  output.on('error', done);
  output.on('finish', done);

  function done(err) {
    if (!isDone) {
      isDone = true;
      return callback(err);
    }
  }
}

function findAssets(dir, callback) {
  findModules(dir, foundModules);

  function foundModules(err, modules) {
    if (err) {
      return callback(err);
    }

    modules.push(dir);
    async.map(modules, getAssets, done);
  }

  function done(err, assets) {
    if (err) {
      return callback(err);
    }

    assets = assets.reduce(function reduceAssets(all, currentSet) {
      return all.concat(currentSet);
    }, []);
    callback(null, assets);
  }
}

function getAssets(dir, callback) {
  var pkg = path.join(dir, 'package.json');
  fs.exists(pkg, checked);

  function checked(exists) {
    if (!exists) {
      return callback(null, []);
    }

    fs.readFile(pkg, 'utf8', read);
  }

  function read(err, contents) {
    if (err) {
      return callback(err);
    }

    try {
      contents = JSON.parse(contents);
    } catch (error) {
      return callback(new Error('Error parsing "' + pkg + '"'));
    }

    var assets = contents.assets;
    if (!Array.isArray(assets)) {
      return callback(null, []);
    }

    assets = assets.map(function mapAssetDescription(name) {
      return {
        name: name,
        path: path.join(dir, name),
      };
    });

    callback(null, assets);
  }
}
