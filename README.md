# npm-assets

[![NPM](https://nodei.co/npm/npm-assets.png?compact=true)](https://nodei.co/npm/npm-assets/)

[![Build Status](https://drone.io/github.com/conradz/npm-assets/status.png)](https://drone.io/github.com/conradz/npm-assets/latest)
[![Dependency Status](https://david-dm.org/conradz/npm-assets.png)](https://david-dm.org/conradz/npm-assets)

Use static files from NPM packages.

This is a tool for copying static files (fonts, CSS, images, etc.) declared and
packaged in NPM modules into a folder. To define static files in a package, add
a `assets` field to the `package.json` containing an array of files to include.
These files will be copied (preserving the same directory structure) when this
tools is ran. It will recursively search for modules in the `node_modules`
folder.`

## How ?

Lets say you have a dependency - `mysite-css` - which has a couple of CSS files
and an image that you'd like to use in your project. `mysite-css` has a
`package.json` that looks like this:

```json
{
  "name": "mysite-css",
  "assets": [
    "bootstrap.css",
    "index.css",
    "logo.png"
  ]
}
```

If you run `npm-assets public/` - npm assets will look inside
`node_modules/mysite-css/package.json` and see the 3 listed assets. After npm-assets has run, you should see `public/` contains those 3 assets!

```bash
$ ls public
bootsrap.css  index.css  logo.png
```

## JS Example

```js
var assets = require('npm-assets');
assets(
    process.cwd(), // root directory
    'assets',      // destination directory
    done);         // callback
```

## npm-assets(1)

Also included is the `npm-assets` executable. Simply run `npm-assets <dest>` to
search for all assets from modules in the current folder and copy them to the
`dest` folder.

```sh
# Copy all assets to the `assets` folder
npm-assets assets
```

## PFAQ (Potentially Frequently Asked Questions)

### What if I have two dependencies that both have a file with the same name?

If you have two dependencies, and both have an identically named file (for
example both have a `logo.png` asset). `npm-assets` will copy only the first of
those, when listed alphabetically. So if `a-module/logo.png` and
`b-module/logo.png` are both listed as assets, `a-module/logo.png` will be copied
over, and `b-module/logo.png` will be ignored.
