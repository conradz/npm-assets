var fs = require('fs'),
    path = require('path'),
    findModules = require('find-modules'),
    async = require('async'),
    mkdirp = require('mkdirp');

module.exports = copyAssets;
copyAssets.find = findAssets;

function copyAssets(root, dest, callback) {
    var assets;
    findAssets(root, found);

    function found(err, a) {
        if (err) {
            return callback(err);
        }

        assets = a;
        assets.forEach(function(asset) {
            asset.dest = path.join(dest, asset.name);
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
        .map(function(a) { return path.dirname(a.dest); })
        .filter(function (value, i, total) { return total.indexOf(value) === i; });

    async.forEach(dirs, mkdirp, callback);
}

function copyFiles(assets, callback) {
    async.forEach(assets, copy, callback);
}

function copy(asset, callback) {
    var isDone = false,
        input = fs.createReadStream(asset.path),
        output = fs.createWriteStream(asset.dest);
    input.pipe(output);
    input.on('error', done);
    output.on('error', done);
    output.on('finish', done);

    function done(err) {
        if (!isDone) {
            isDone = true;
            callback(err);
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

        assets = assets.reduce(
            function(all, a) { return all.concat(a); }, []);
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
        } catch (e) {
            return callback(new Error('Error parsing "' + pkg + '"'));
        }

        var assets = contents.assets;
        if (!Array.isArray(assets)) {
            return callback(null, []);
        }

        assets = assets.map(function(name) {
            return {
                name: name,
                path: path.join(dir, name)
            };
        });

        callback(null, assets);
    }
}
