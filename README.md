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
