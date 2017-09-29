/* ---------- SETUP AND PLUGINS ------------- */

    var warningMessage = '';

    // Gulp + plugins
        var gulp             = require('gulp');
        var plugins          = require('gulp-load-plugins')();
        plugins.autoprefixer = require('autoprefixer');
        plugins.runSequence  = require('run-sequence');
        plugins.globImporter = require('node-sass-glob-importer');

    // Node plugins
        plugins.fs           = require('fs');
        plugins.dirTree      = require('directory-tree');

    // Rollup + plugins
        plugins.rollup       = require('gulp-better-rollup');
        plugins.resolve      = require('rollup-plugin-node-resolve');
        plugins.async        = require('rollup-plugin-async');
        plugins.babel        = require('rollup-plugin-babel');
        plugins.commmonjs    = require('rollup-plugin-commonjs');
        plugins.coffeeReact  = require('rollup-plugin-coffee-react');


    // Settings


        // Check if file exists, otherwise close settings from default one and create one
        if (!plugins.fs.existsSync('./gulp-config.json')) {

           var defaultFileContent = plugins.fs.readFileSync('./gulp-config.default.json');
           plugins.fs.writeFileSync('./gulp-config.json', defaultFileContent);

            warningMessage += 'PROJECT SETTINGS MISSING:\n"gulp-config.json" not found, one was created from "gulp-config.default.json".\nPlease update it to your needs.';
        }
        ;

        var projectSettings = require('./gulp-config.json');

    //console.log(plugins);


/* ---------- COMPILERS ------------- */

    // SASS development (non-minified)
    gulp.task('compiler-sassDevelopment',
        require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-sassDevelopment.js')
        (gulp, plugins, projectSettings)
    );


    // SASS distribution (minified)
    gulp.task('compiler-sassCompressed',
        require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-sassCompressed.js')
        (gulp, plugins, projectSettings)
    );


    // Rollup (minified + development)
    gulp.task('compiler-rollup',function(callback) {
        plugins.runSequence(
            'buildImportsBundle',
            'beautifyImportsBundle',
            'rollupSettings',
            callback);
    });

        // Rollup subtasks

            // Build importsBundle.js.
            gulp.task('buildImportsBundle',
                require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-rollup/buildImportsBundle.js')
                (gulp, plugins, projectSettings)
            );

            // Beautify importsBundle.js.
            gulp.task('beautifyImportsBundle',
                require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-rollup/beautifyImportsBundleJS.js')
                (gulp, plugins, projectSettings)
            );

            // Run rollup with settings
            gulp.task('rollupSettings',
                require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-rollup/rollupSettings.js')
                (gulp, plugins, projectSettings)
            );


    // Special input JS files (global non-objects)
    gulp.task('compiler-specialInputJS',
        require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-specialInputJS.js')
        (gulp, plugins, projectSettings)
    );


/* ---------- WATCHERS ------------- */

    // Java script (watches js, coffee, jsf and es6 files)
    gulp.task('watcher-javaScript',
        require('./'+projectSettings.settingsPaths.gulptasks+'/watchers/watcher-javaScript.js')
        (gulp, plugins, projectSettings, ['bundle-compilers-js'])
    );

    // SASS

    gulp.task('watcher-sass',
        require('./'+projectSettings.settingsPaths.gulptasks+'/watchers/watcher-sass.js')
        (gulp, plugins, projectSettings, ['compiler-sassCompressed', 'compiler-sassDevelopment'])
    );

/* ---------- UTILITIES ------------- */
    // Uglify JS file
    gulp.task('utility-uglify',
        require('./'+projectSettings.settingsPaths.gulptasks+'/utilities/utility-uglify.js')
        (gulp, plugins, projectSettings)
    );



/* ---------- TASK BUNDLES ------------- */

    // Compiler bundle JS
    gulp.task('bundle-compilers-js', function(callback) {
        plugins.runSequence(
              'compiler-rollup',
              'compiler-specialInputJS',
              'utility-uglify',
            callback);
    });

    // Compiler bundle SASS
    gulp.task('bundle-compilers-sass', function(callback) {
        plugins.runSequence(
            [
                'compiler-sassCompressed',
                'compiler-sassDevelopment'
            ],
            callback);
    });

    // Watcher bundle
    gulp.task('bundle-watchers',[
        'watcher-javaScript',
        'watcher-sass'
    ]);

/* ---------- FINAL REPORT ------------- */

    // Compiler bundle JS
    gulp.task('finalReport', function(done) {

        if (warningMessage.length > 0) {
            console.warn(warningMessage);
        }else{
            warningMessage = "Innitial run succesfull.\nEverything works as intended.\nHappy coding!"
            console.log(warningMessage);
        }
        done();

    });

/* ---------- DEFAULT TASK ------------- */

    // Run different bundles
    gulp.task('default', function(callback) {
        plugins.runSequence(
                [
                    'bundle-compilers-js',
                    'bundle-compilers-sass'
                ],
                'bundle-watchers',
                'finalReport',
                callback);

        });