
(function(){

    /**
     * Module dependencies.
     */

    var Builder = require('component-builder'),
        stylus = require('./stylus'),
        coffee = require('./coffee'),
        fs = require('fs'),
        write = fs.writeFileSync,
        mkdir = fs.mkdir;

    /**
     * Component builder.
     */

    var builder = new Builder('.');
    mkdir('build');
    builder.copyAssetsTo('build');
    builder.use(stylus);
    builder.use(coffee);
    builder.build(function(err, res){
        if (err) return err;
        if (res.js.replace(/\s+/, ""))  write('build/build.js', res.require + res.js);
        if (res.css.replace(/\s+/, "")) write('build/build.css', res.css);
        return;
    });

}).call(this);
