
/**
 * Module dependencies.
 */

var stylus = require('stylus'),
    nib = require('nib'),
    path = require('path'),
    fs = require('fs'),
    read = fs.readFileSync;

/**
 * Stylus css plugin.
 *
 * @param {Builder} builder
 * @api public
 */

module.exports = function(builder){
  builder.hook('before styles', function(pkg){
    var styles = pkg.conf.styles;
    if (!styles) return;

    styles.forEach(function(file){
      var ext = path.extname(file);
      if ('.styl' != ext) return;
      var css = compile(read(pkg.path(file), 'utf8'), function(err, css){
        if (err) css = err.Error;
        var newFile = path.basename(file, '.styl') + '.css';
        pkg.addFile('styles', newFile, css);
        pkg.removeFile('styles', file);
      });
    });
  });
};

/**
 * Compile `css`.
 */

function compile(css, cb) {
  stylus(css)
      .use(nib())
      .render(cb);
}
