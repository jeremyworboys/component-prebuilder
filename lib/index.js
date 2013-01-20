
(function(){

    /**
     * Module dependencies.
     */

    var program = require('commander'),
        Builder = require('component-builder'),
        stylus = require('./stylus'),
        coffee = require('./coffee'),
        path = require('path'),
        fs = require('fs'),
        write = fs.writeFileSync,
        mkdir = require('mkdirp');

    // options

    program
        .option('-d, --dev', 'build development dependencies')
        .option('-s, --standalone <name>', 'build a stand-alone version of the component')
        .option('-o, --out <dir>', 'output directory defaulting to ./build', 'build')
        .option('-n, --name <file>', 'base name for build files defaulting to build', 'build')
        .option('-v, --verbose', 'output verbose build information')
        .option('-p, --prefix <str>', 'prefix css asset urls with <str>');

    // parse argv

    program.parse(process.argv);

    // load json

    var conf = require(path.resolve('component.json'));

    // standalone

    var standalone = program.standalone;

    // output paths

    var jsPath = path.join(program.out, program.name + '.js');
    var cssPath = path.join(program.out, program.name + '.css');

    /**
     * Component builder.
     */

    var builder = new Builder(process.cwd());
    mkdir.sync(program.out);
    builder.copyAssetsTo(program.out);
    if (program.dev) builder.prefixUrls('./');
    if (program.prefix) builder.prefixUrls(program.prefix);

    var pb_conf = conf.prebuilder || {};
    builder.use(stylus(pb_conf.stylus || {}));
    builder.use(coffee(pb_conf.coffee || {}));

    if (conf.paths) builder.addLookup(conf.paths);

    var start = new Date();

    if (program.dev) {
        builder.development();
        builder.addSourceURLs();
    }

    builder.build(function(err, res){
        if (err) return console.log(err);
        var js = '';
        var css = res.css.trim();

        var name = 'string' == typeof standalone ? standalone : conf.name;

        if (standalone) js += ';(function(){\n';
        js += res.require;
        js += res.js;

        if (standalone) {
            var umd = [
                'if (typeof exports == "object") {',
                '  module.exports = require("' + conf.name + '");',
                '} else if (typeof define == "function" && define.amd) {',
                '  define(require("' + conf.name + '"));',
                '} else {',
                '  window["' + name + '"] = require("' + conf.name + '");',
                '}'
            ];

            js += umd.join('\n');
            js += '})();';
        }

        // update aliases to point to built dependencies
        js = js.replace(/^require\.alias\("(.+?)\.coffee", "(.+?)\.coffee"\);$/gim, "require.alias(\"$1.js\", \"$2.js\");");

        // css
        if (css) write(cssPath, css);

        // js
        if (res.js.trim()) write(jsPath, js);

        if (!program.verbose) return;
        var duration = new Date() - start;
        console.log('write', jsPath);
        console.log('write', cssPath);
        console.log('js', (js.length / 1024 | 0) + 'kb');
        if (css) console.log('css', (css.length / 1024 | 0) + 'kb');
        console.log('duration', duration + 'ms');
    });

}).call(this);
