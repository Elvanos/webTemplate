/* ---------- SETUP AND PLUGINS ------------- */

    // DEBUG
    let debugSwitch = false;
    if (debugSwitch === true) {
        ['log', 'warn'].forEach(function(method) {
            let old = console[method];
            console[method] = function() {
                let stack = (new Error()).stack.split(/\n/);
                // Chrome includes a single "Error" line, FF doesn't.
                if (stack[0].indexOf('Error') === 0) {
                    stack = stack.slice(1);
                }
                let args = [].slice.apply(arguments).concat([stack[1].trim()]);
                return old.apply(console, args);
            };
        });
    }

        // Gulp + plugins
            let gulp                       = require('gulp');
            let plugins                    = require('gulp-load-plugins')();
            plugins.autoprefixer           = require('autoprefixer');
            plugins.runSequence            = require('run-sequence');
            plugins.globImporter           = require('node-sass-glob-importer');

        // Node plugins
            plugins.fs                     = require('fs');
            plugins.path                   = require('path');
            plugins.dirTree                = require('directory-tree');

        // Rollup + plugins
            plugins.rollup                 = require('gulp-better-rollup');
            plugins.babel                  = require('rollup-plugin-babel');
            plugins.coffeeReact            = require('rollup-plugin-coffee-react');


        // Setup & bugfix if any found
            let setupOutput                = require('./gulpFiles/customFunctions/startupCheck')(plugins);
            let projectSettings            = setupOutput[0];
            let warningMessage             = setupOutput[1];


        console.log(plugins);

/* ---------- COMPILERS ------------- */

    // SASS development (non-minified)
    gulp.task('compiler-sassDevelopment',
        require('./gulpFiles/gulpTasks/compilers/compiler-sassDevelopment.js')
        (gulp, plugins, projectSettings)
    );

        // Additional SASS development (non-minified)
        gulp.task('compiler-additionalSassDevelopment',
            require('./gulpFiles/gulpTasks/compilers/compiler-additionalSassDevelopment.js')
            (gulp, plugins, projectSettings)
        );

    // SASS distribution (minified)
    gulp.task('compiler-sassCompressed',
        require('./gulpFiles/gulpTasks/compilers/compiler-sassCompressed.js')
        (gulp, plugins, projectSettings)
    );

        // Additional SASS distribution (minified)
        gulp.task('compiler-additionalSassCompressed',
            require('./gulpFiles/gulpTasks/compilers/compiler-additionalSassCompressed.js')
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
                require('./gulpFiles/gulpTasks/compilers/compiler-rollup/buildImportsBundle.js')
                (gulp, plugins, projectSettings)
            );

            // Beautify importsBundle.js.
            gulp.task('beautifyImportsBundle',
                require('./gulpFiles/gulpTasks/compilers/compiler-rollup/beautifyImportsBundleJS.js')
                (gulp, plugins, projectSettings)
            );

            // Run rollup with settings
            gulp.task('rollupSettings',
                require('./gulpFiles/gulpTasks/compilers/compiler-rollup/rollupSettings.js')
                (gulp, plugins, projectSettings)
            );


        // Additional JS files (global non-objects)
        gulp.task('compiler-specialInputJS',
            require('./gulpFiles/gulpTasks/compilers/compiler-specialInputJS.js')
            (gulp, plugins, projectSettings)
        );


/* ---------- WATCHERS ------------- */

    // Java script (watches js, coffee and jsx files)
    gulp.task('watcher-javaScript',
        require('./gulpFiles/gulpTasks/watchers/watcher-javaScript.js')
        (gulp, plugins, projectSettings, ['bundle-compilers-js'])
    );

    // SASS
    gulp.task('watcher-sass',
        require('./gulpFiles/gulpTasks/watchers/watcher-sass.js')
        (gulp, plugins, projectSettings, ['compiler-sassCompressed', 'compiler-sassDevelopment'])
    );

    gulp.task('watcher-additionalSass',
        require('./gulpFiles/gulpTasks/watchers/watcher-additionalSass.js')
        (gulp, plugins, projectSettings, ['compiler-additionalSassCompressed', 'compiler-additionalSassDevelopment'])
    );


/* ---------- UTILITIES ------------- */
    // Uglify JS file
    gulp.task('utility-uglify',
        require('./gulpFiles/gulpTasks/utilities/utility-uglify.js')
        (gulp, plugins, projectSettings)
    );

    // Cleanup JS file after generation
    gulp.task('utility-cleanupJS',
        require('./gulpFiles/gulpTasks/utilities/utility-cleanupJS.js')
        (gulp, plugins, projectSettings)
    );



/* ---------- TASK BUNDLES ------------- */

    // Compiler bundle JS
    gulp.task('bundle-compilers-js', function(callback) {

        if (projectSettings.settingsGeneration.allowAdditionalJS === "true"){

            plugins.runSequence(
                'compiler-rollup',
                'compiler-specialInputJS',
                'utility-uglify',
                'utility-cleanupJS',
                callback);

        }else{
            plugins.runSequence(

                'compiler-rollup',
                'utility-uglify',
                'utility-cleanupJS',
                callback);

        }
    });

    // Compiler bundle SASS
    gulp.task('bundle-compilers-sass', function(callback) {

        if (projectSettings.settingsGeneration.allowAdditionalSass === "true"){

            plugins.runSequence(
                [
                    'compiler-sassCompressed',
                    'compiler-sassDevelopment',
                    'compiler-additionalSassCompressed',
                    'compiler-additionalSassDevelopment'
                ],
                callback);

        }else{

            plugins.runSequence(
                [
                    'compiler-sassCompressed',
                    'compiler-sassDevelopment'
                ],
                callback);

        }
    });

    // Watcher bundle
    gulp.task('bundle-watchers',function(callback){

        if (projectSettings.settingsGeneration.allowAdditionalSass === "true"){

            plugins.runSequence(
                [
                    'watcher-javaScript',
                    'watcher-sass',
                    'watcher-additionalSass'
                ],
                callback);

        }else{

            plugins.runSequence(
                [
                    'watcher-javaScript',
                    'watcher-sass'
                ],
                callback);
        }

    });


/* ---------- MANUAL TASKS ------------- */

    // Run compilers
    gulp.task('forceCompile', function(callback) {
        plugins.runSequence(
            [
                'bundle-compilers-js',
                'bundle-compilers-sass'
            ],
            callback);

    });

/* ---------- FINAL REPORT ------------- */

    // Compiler bundle JS
    gulp.task('finalReport', function(callback) {

            if (warningMessage.length > 0) {
                console.warn(warningMessage);
                callback();
            }else{
                warningMessage = "Innitial run succesfull.\nEverything works as intended.\nHappy coding!";
                console.log(warningMessage);
                callback();
            }
    });

/* ---------- DEFAULT TASK ------------- */

    // Run different bundles
    gulp.task('default', function(callback) {


            if (projectSettings.settingsGeneration.compileOnLoad === "true"){
                plugins.runSequence(
                    'forceCompile',
                    'bundle-watchers',
                    'finalReport',
                    callback);
            }else {
                plugins.runSequence(
                    'bundle-watchers',
                    'finalReport',
                    callback);
            }

        });