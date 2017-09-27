/* ---------- SETUP AND PLUGINS ------------- */

    // Gulp + plugins
    var gulp             = require('gulp');
    var plugins          = require('gulp-load-plugins')();
    plugins.autoprefixer = require('autoprefixer');
    plugins.runSequence  = require('run-sequence');

    // Rollup + plugins
    plugins.rollup       = require('gulp-better-rollup');
    plugins.resolve      = require('rollup-plugin-node-resolve');
    plugins.async        = require('rollup-plugin-async');
    plugins.babel        = require('rollup-plugin-babel');
    plugins.minify       = require('rollup-plugin-minify');
    plugins.commmonjs    = require('rollup-plugin-commonjs');
    plugins.coffeeReact  = require('rollup-plugin-coffee-react');

    // Settings
    var projectSettings  = require('./package.json');
    projectSettings      = projectSettings.projectSettings;


    //console.log(plugins);


/* ---------- COMPILERS ------------- */

    // SASS development (non-minified)
    gulp.task('compiler-sassDevelopment',
        require('./'+projectSettings.gulpTasksFolderPath+'/compilers/compiler-sassDevelopment.js')
        (gulp, plugins, projectSettings)
    );

    // SASS distribution (minified)
    gulp.task('compiler-sassCompressed',
        require('./'+projectSettings.gulpTasksFolderPath+'/compilers/compiler-sassCompressed.js')
        (gulp, plugins, projectSettings)
    );

    // Rollup (minified + development)
    gulp.task('compiler-rollup',
        require('./'+projectSettings.gulpTasksFolderPath+'/compilers/compiler-rollup.js')
        (gulp, plugins, projectSettings)
    );

    // Special input JS files (global non-objects)
    gulp.task('compiler-specialInputJS',
        require('./'+projectSettings.gulpTasksFolderPath+'/compilers/compiler-specialInputJS.js')
        (gulp, plugins, projectSettings)
    );


/* ---------- WATCHERS ------------- */

    // Java script (watches js, coffee, jsf and es6 files)
    gulp.task('watcher-javaScript',
        require('./'+projectSettings.gulpTasksFolderPath+'/watchers/watcher-javaScript.js')
        (gulp, plugins, projectSettings, ['bundle-compilers-js'])
    );

    // SASS
    gulp.task('watcher-sass',
        require('./'+projectSettings.gulpTasksFolderPath+'/watchers/watcher-sass.js')
        (gulp, plugins, projectSettings, ['compiler-sassCompressed', 'compiler-sassDevelopment'])
    );




/* ---------- UTILITIES ------------- */
    // Uglify JS file
    gulp.task('utility-uglify',
        require('./'+projectSettings.gulpTasksFolderPath+'/utilities/utility-uglify.js')
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



/* ---------- DEFAULT TASK ------------- */

    // Run different bundles
    gulp.task('default', function(callback) {
        plugins.runSequence(
                [
                    'bundle-compilers-js',
                    'bundle-compilers-sass'

                ],
                'bundle-watchers',
                callback);
        });