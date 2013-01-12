
/**
 * Module dependencies.
 */

var Builder = require('component-builder'),
    stylus = require('./lib/stylus'),
    fs = require('fs'),
    write = fs.writeFileSync,
    mkdir = fs.mkdir;

/**
 * Component builder middleware.
 */
var builder = new Builder('.');
builder.ignore("jeremyworboys-builder", "files");
builder.copyAssetsTo('build');
mkdir('build');
builder.use(stylus);
builder.build(function(err, res){
    if (err) return err;
    write('build/build.js', res.require + res.js);
    write('build/build.css', res.css);
    return;
});
