/*
 * grunt-node-modules-cachebuster
 * https://github.com/matzeeable/grunt-node-modules-cachebuster
 *
 * Copyright (c) 2017 Matthias Günter
 * Licensed under the MIT license.
 * Inspired by https://github.com/felthy/grunt-cachebuster
 */

'use strict';

module.exports = function(grunt) {

    var path = require('path'), formatters = {
            json: function(versions, banner) {
                return banner + JSON.stringify(versions);
            },
            php: function(versions, banner) {
                var output = '<?php\n' + banner + '\nreturn ', last = Object.keys(versions).pop();
                
                function writeArray(object, depth) {
                    output += 'array(\n';
                    var indent = new Array(depth + 1).join('\t');
                    for (var key in object) {
                        output += indent + "\t'" + key + "' => ";
                        output += "'" + object[key] + "'" + (last === key ? '' : ',') + "\n";
                    }
                    output += indent + ')';
                }
                writeArray(versions, 0);
                output += ';\n';
                return output;
            }
        };

    grunt.registerMultiTask('node_modules_cachebuster', 'Generates a file containing file versions for node_modules.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            format: 'json',
            banner: '',
            altNodeModules: 'node_modules'
        }), pkg = grunt.file.readJSON('package.json'), dependencies = Object.keys(pkg.devDependencies||[]).concat(Object.keys(pkg.dependencies||[])), versions = {}, basename, modulePkg, altModulePkg;
        options.formatter = options.formatter || formatters[options.format];
    
        // Iterate over all specified file groups.
        var self = this;
        this.files.forEach(function(f) {
            grunt.log.write('Generating node modules cachebuster file "' + f.dest + '"...');
        
            // Concat specified folders.
            f.src.forEach(function(folder) {
                if (grunt.file.isDir(folder) && (basename = folder.split('/').reverse()[0]) && dependencies.indexOf(basename) > -1) {
                    modulePkg = path.join('node_modules', basename, 'package.json');
                    altModulePkg = path.join(options.altNodeModules, basename, 'package.json');
                    if (grunt.file.isFile(modulePkg) || (grunt.file.isFile(altModulePkg) && (modulePkg = altModulePkg))) {
                        modulePkg = grunt.file.readJSON(modulePkg);
                        if (modulePkg.version) {
                            versions[basename] = modulePkg.version;
                        }else{
                            grunt.log.warn(modulePkg + " package version not defined or empty...");
                        }
                    }else{
                        grunt.log.warn(modulePkg + " package not found, skip module...");
                    }
                }
            });
            
            if (typeof options.complete === 'function') {
                versions = options.complete.call(self, versions);
            }
            
            if (f.dest && versions) {
                // Write the destination file.
                grunt.file.write(f.dest, options.formatter.call(self, versions, options.banner));
            } else {
                grunt.verbose.writeln('Not writing output file.');
            }
            
            grunt.log.ok();
        });
    });
};