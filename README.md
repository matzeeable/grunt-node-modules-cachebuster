# Grunt Node Modules Cachebuster
This tasks reads a folder of node package names subfolders and creates a file (`json`or `php`) with **key** (package name) **value** (version) pairs. An example use case is a project where you copy `js` and `css` files to a `library` folder from the `node_modules` folder. The webapp clients should then always load the latest version of the package files whenever they change (`npm update`). The plugin requires  [**grunt**](https://gruntjs.com/).

## Getting started
Simply install via:
```sh
$ npm install grunt-node-modules-cachebuster --save-dev
```

## Example task
Imagine the `public/lib` folder contains this subfolders (copied from `node_modules` via [`grunt-contrib-copy`](https://github.com/gruntjs/grunt-contrib-copy)): `react`, `react-dom`. Your `Gruntfile.js` can define a task like the below:

```js
node_modules_cachebuster: {
    'publiclib': {
        options: {
            banner: '/* This file was automatically generated (' + new Date().toString() + '). */',
            format: 'php'
        },
        src: ['public/lib/*'],
        dest: 'inc/others/cachebuster-lib.php'
    }
}
```
The task above can result in (`cachebuster-lib.php`):
```php
<?php
/* This file was automatically generated (Tue Nov 07 2017 21:52:14 GMT+0000 (UTC)). */
return array(
	'react' => '16.0.0',
	'react-dom' => '16.0.0'
);
```

## API
* `options.format` (_string_): `php` or `json` format. This format will be the output for the `dest` file.
* `options.banner` (_string_): This text will be prepended to the output.
* `options.altNodeModules` (_string_): Relative path to another `node_modules` folder, for example to work with hoisting (lerna, yarn workspaces)

## License
This grunt task is MIT licensed. The project is inspired by this project: [grunt-cachebuster](https://github.com/felthy/grunt-cachebuster).