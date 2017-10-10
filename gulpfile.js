/* ---------- SETUP AND PLUGINS ------------- */

    // DEBUG
    let debugSwitch = false;

    if (debugSwitch === true) {

        // Copnsole log source
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
            plugins.traverse               = require('traverse');
            plugins.notifier               = require('node-notifier');
            plugins.colors                 = require('colors');

        // Rollup + plugins
            plugins.rollup                 = require('gulp-better-rollup');
            plugins.babel                  = require('rollup-plugin-babel');
            plugins.coffeeReact            = require('rollup-plugin-coffee-react');


        // Setup & bugfix if any found
            let setupOutput                = require('./gulpFiles/customFunctions/startupCheck')(plugins);
            let projectSettings            = setupOutput[0];
            let warningMessage             = setupOutput[1];



        //console.log(plugins);

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
        (gulp, plugins, projectSettings, ['bundle-compilers-sass'])
    );

    gulp.task('watcher-additionalSass',
        require('./gulpFiles/gulpTasks/watchers/watcher-additionalSass.js')
        (gulp, plugins, projectSettings, ['bundle-compilers-sass'])
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

    gulp.task('forceCompile',function(callback){

        plugins.runSequence(
            [
                'bundle-compilers-js',
                'bundle-compilers-sass'
            ],
            callback);

        }
    );

    // Split object
    gulp.task('splitObject',
        plugins.parameterized(
            function (cb, params) {

                if (params.fileName === undefined) {
                    console.warn('Missing an argument "fileName". Please retry with the argument filled in to your desired file.');
                    return cb();
                }

                // Set basic path/name vars
                    let splitObjectsDir = projectSettings.settingsPaths.splitObjectDir;

                    // Check if the folder even exists, if not, make one
                    if (!plugins.fs.existsSync(splitObjectsDir)){
                        plugins.fs.mkdirSync(splitObjectsDir);
                    }

                // Get input object from file and file name
                    let fileName = params.fileName;
                    let fileContent = plugins.fs.readFileSync('./' + fileName)

                    // Check if object has right formatting
                    if (fileContent.indexOf('module.exports') === -1) {
                        console.warn('Your input file is missing the "module.exports" wrapper, please fix it.' +
                        '\n\nYour file should look like this: ' +
                        '\n  module.exports = function () {' +
                        '\n     return {<content of your object>}'+
                        '\n  };');

                        return cb();
                    }

                    // If the input is properly formatted, load it properly
                    fileContent = require('./' + fileName);
                    fileContent = fileContent();

                // Run through the object and generate file structure accordingly
                    let baseObjDir = './'+splitObjectsDir+'/'+fileName;

                    // Set directories
                    plugins.traverse(fileContent).forEach(function (x) {

                        // Set default directory based on input file name
                        if(this.key === undefined){
                            if (!plugins.fs.existsSync(baseObjDir)){
                                plugins.fs.mkdirSync(baseObjDir);
                            }
                        }

                        // If directory
                        if (!this.isLeaf) {
                            let objpath =  baseObjDir+'/'+this.path.join('/');

                            if (!plugins.fs.existsSync(objpath)){
                                plugins.fs.mkdirSync(objpath);
                            }
                        }

                    });

                    // Set files
                    plugins.traverse(fileContent).forEach(function (x) {
                        // If file
                        if (this.isLeaf) {
                            let objpath = baseObjDir+'/'+this.path.join('/')+'.js';

                            // Turn the function into a node module
                            let output = 'var '+this.key+' = '+x+'; export default '+this.key+';';
                            plugins.fs.writeFileSync(objpath, output);
                        }

                    });
                return cb();
            }
        )

    );



    /* ---------- FINAL REPORT ------------- */

    // Compiler bundle JS
    gulp.task('finalReport', function(callback) {

            let taskName = 'finalReport';

            if (warningMessage.length > 0) {

                plugins.notifier.notify(
                    {
                        title: projectSettings.name + ' - ' + taskName,
                        message: warningMessage,
                        sound: false
                    });

                console.log(
                    (
                        'Task: ' + taskName + '\n' +
                        'Message: ' + warningMessage + '\n'
                    )
                        .red
                );

                callback();
            }else{
                warningMessage = "Innitial run succesfull.\nEverything works as intended.\nHappy coding!";

                plugins.notifier.notify(
                    {
                        title: projectSettings.name + ' - ' + taskName,
                        message: warningMessage,
                        sound: false
                    });

                console.log(
                    (
                        'Task: ' + taskName + '\n' +
                        'Message: ' + warningMessage + '\n'
                    )
                        .green
                );
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