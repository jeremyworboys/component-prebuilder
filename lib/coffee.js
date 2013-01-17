
/**
 * Module dependencies.
 */

var coffee = require('coffee-script'),
    path = require('path'),
    fs = require('fs'),
    read = fs.readFileSync;

module.exports = function(options){
  options = options || {};

  /**
   * Coffee js plugin.
   *
   * @param {Builder} builder
   * @api public
   */

  return function(builder){
    builder.hook('before scripts', function(pkg){
      var scripts = pkg.conf.scripts;
      if (!scripts) return;

      scripts.forEach(function(file){
        var ext = path.extname(file);
        if ('.coffee' != ext) return;
        var js = compile(read(pkg.path(file), 'utf8'));
        var newFile = path.basename(file, '.coffee') + '.js';
        pkg.addFile('scripts', newFile, js);
        pkg.removeFile('scripts', file);
      });
    });
  };

  /**
   * Compile `js`.
   */

  function compile(js) {
    return coffee.compile(js, {
      bare: true,
      header: true
    });
  }

};
