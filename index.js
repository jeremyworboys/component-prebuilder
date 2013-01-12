
/**
 * Module dependencies.
 */

var Builder = require('component-builder'),
    templates = require('./templates'),
    stylus = require('./stylus'),
    fs = require('fs'),
    write = fs.writeFileSync;

/**
 * Component builder middleware.
 */
var builder = new Builder('.');
builder.copyAssetsTo('build');
builder.use(stylus);
builder.use(templates);
builder.build(function(err, res){
    console.log(err);
    if (err) return err;
    write('build/build.js', res.require + res.js);
    write('build/build.css', res.css);
    return;
});
