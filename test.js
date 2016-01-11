var assets = require('./'),
    test = require('tap').test,
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf');

test('list test assets', function(t) {
    assets.find(path.join(__dirname, 'test'), found);

    function found(err, assets) {
        t.error(err, 'successful');
        t.equal(assets.length, 3);

        t.equal(assets[0].name, 'foo/bar.txt');
        t.equal(
            path.normalize(assets[0].path),
            path.normalize(path.join(
                __dirname, 'test/node_modules/hello/foo/bar.txt')));

        t.equal(assets[1].name, 'foo/bar.txt');
        t.equal(
            path.normalize(assets[1].path),
            path.normalize(path.join(
                __dirname, 'test/node_modules/hello-again/foo/bar.txt')));

        t.equal(assets[2].name, 'test.txt');
        t.equal(
            path.normalize(assets[2].path),
            path.normalize(path.join(
                __dirname, 'test/test.txt')));

        t.end();
    }
});

test('copy assets', function(t) {
    var srcDir = path.join(__dirname, 'test'),
        destDir = path.join(__dirname, 'assets'),
        files = ['test.txt', 'foo/bar.txt'];
    rimraf(destDir, removed);

    function removed(err) {
        t.error(err, 'removed dir');

        assets(srcDir, destDir, copied);
    }

    function copied(err) {
        t.error(err, 'copied assets');
        compare('foo/bar.txt', path.join(srcDir, 'node_modules/hello'));
        compare('test.txt', srcDir);

        function compare(file, srcDir) {
            var src = fs.readFileSync(path.join(srcDir, file), 'utf8'),
                dest = fs.readFileSync(path.join(destDir, file), 'utf8');
            t.equal(src, dest, 'file ' + file + ' is copied');
        }

        t.end();
    }
});
