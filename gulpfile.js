/* ---------- SETUP AND PLUGINS ------------- */

    let warningMessage = '';
    let projectSettings;
    let defaultFileContent;

    // Gulp + plugins
        let gulp             = require('gulp');
        let plugins          = require('gulp-load-plugins')();
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


    // Setup & bugfix if any found
    function startupCheck(){
        defaultFileContent = require('./gulp-config.default.json');

        // Check if config file exists, otherwise close settings from default one and create one
        if (!plugins.fs.existsSync('./gulp-config.json')) {
            plugins.fs.writeFileSync('./gulp-config.json', defaultFileContent);

            warningMessage += 'PROJECT SETTINGS MISSING:\n"gulp-config.json" not found, one was created from "gulp-config.default.json".\nPlease update it to your needs.\n\n';
        }

        // Get Project settings
        projectSettings = require('./gulp-config.json');

        // Check if user settings are alright
        let rewriteConfig = false;


            // Check "name"
            if (projectSettings.name === undefined) {
                rewriteConfig = true;
                projectSettings.name = defaultFileContent.name;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "name" property, one with a key "'+projectSettings.name+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsGeneration"
            if (projectSettings.settingsGeneration === undefined) {
                rewriteConfig = true;
                projectSettings.settingsGeneration = defaultFileContent.settingsGeneration;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
            }else{

                // Sub-object settingsGeneration

                    // Check "settingsGeneration.autogenBuildFile"
                    if (projectSettings.settingsGeneration.autogenBuildFile === undefined) {
                        rewriteConfig = true;
                        projectSettings.settingsGeneration.autogenBuildFile = defaultFileContent.settingsGeneration.autogenBuildFile;
                        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.autogenBuildFile" property, one with a key "'+projectSettings.settingsGeneration.autogenBuildFile+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                    }

                    // Check "settingsGeneration.compileOnLoad"
                    if (projectSettings.settingsGeneration.compileOnLoad === undefined) {
                        rewriteConfig = true;
                        projectSettings.settingsGeneration.compileOnLoad = defaultFileContent.settingsGeneration.autogenBuildFile;
                        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.compileOnLoad" property, one with a key "'+projectSettings.settingsGeneration.compileOnLoad+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                    }

                    // Check "settingsGeneration.allowAdditionalSass"
                    if (projectSettings.settingsGeneration.allowAdditionalSass === undefined) {
                        rewriteConfig = true;
                        projectSettings.settingsGeneration.allowAdditionalSass = defaultFileContent.settingsGeneration.allowAdditionalSass;
                        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.allowAdditionalSass" property, one with a key "'+projectSettings.settingsGeneration.allowAdditionalSass+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                    }
            }

            // Check "settingsFileNames"
            if (projectSettings.settingsFileNames === undefined) {
                rewriteConfig = true;
                projectSettings.settingsFileNames = defaultFileContent.settingsFileNames;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
            }else{

                // Sub-object settingsFileNames

                // Check "settingsFileNames.srcFileSass"
                if (projectSettings.settingsFileNames.srcFileSass === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsFileNames.srcFileSass = defaultFileContent.settingsFileNames.srcFileSass;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.srcFileSass" property, one with a key "'+projectSettings.settingsFileNames.srcFileSass+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }

                // Check "settingsFileNames.distFileCss"
                if (projectSettings.settingsFileNames.distFileCss === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsFileNames.distFileCss = defaultFileContent.settingsFileNames.distFileCss;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.distFileCss" property, one with a key "'+projectSettings.settingsFileNames.distFileCss+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }

                // Check "settingsFileNames.distFileJs"
                if (projectSettings.settingsFileNames.distFileJs === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsFileNames.distFileJs = defaultFileContent.settingsFileNames.distFileJs;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.distFileJs" property, one with a key "'+projectSettings.settingsFileNames.distFileJs+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }
            }

            // Check "settingsPaths"
            if (projectSettings.settingsPaths === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths = defaultFileContent.settingsPaths;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
            }else{

                // Sub-object settingsPaths

                // Check "settingsPaths.distFolderPath"
                if (projectSettings.settingsPaths.distFolderPath === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsPaths.distFolderPath = defaultFileContent.settingsPaths.distFolderPath;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.distFolderPath" property, one with a key "'+projectSettings.settingsPaths.distFolderPath+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }

                // Check "settingsPaths.srcFolderPath"
                if (projectSettings.settingsPaths.srcFolderPath === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsPaths.srcFolderPath = defaultFileContent.settingsPaths.srcFolderPath;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.srcFolderPath" property, one with a key "'+projectSettings.settingsPaths.srcFolderPath+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }

                // Check "settingsPaths.specialInputPathJS"
                if (projectSettings.settingsPaths.specialInputPathJS === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsPaths.specialInputPathJS = defaultFileContent.settingsPaths.specialInputPathJS;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.specialInputPathJS" property, one with a key "'+projectSettings.settingsPaths.specialInputPathJS+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }

                // Check "settingsPaths.gulptasks"
                if (projectSettings.settingsPaths.gulptasks === undefined) {
                    rewriteConfig = true;
                    projectSettings.settingsPaths.gulptasks = defaultFileContent.settingsPaths.gulptasks;
                    warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.gulptasks" property, one with a key "'+projectSettings.settingsPaths.gulptasks+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
                }
            }




        // Rewrite config file if needed
            if (rewriteConfig === true) {
                let configString = JSON.stringify(projectSettings,null,4);
                plugins.fs.writeFileSync('./gulp-config.json', configString);
            }


        // Check if dist directory exists, if not, let user know that dist is being created for him... and make it
        if (!plugins.fs.existsSync('./'+projectSettings.settingsPaths.distFolderPath)){

            plugins.fs.mkdirSync('./'+projectSettings.settingsPaths.distFolderPath);
            warningMessage += 'DISTRIBUTION DIRECTORY MISSING:\nA new directory "'+projectSettings.settingsPaths.distFolderPath+'" has been created for you.\n\n';

        }
    }

    //Run Startup check
    startupCheck();

    //console.log(plugins);


/* ---------- COMPILERS ------------- */

    // SASS development (non-minified)
    gulp.task('compiler-sassDevelopment',
        require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-sassDevelopment.js')
        (gulp, plugins, projectSettings)
    );

        // Additional SASS development (non-minified)
        gulp.task('compiler-additionalSassDevelopment',
            require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-additionalSassDevelopment.js')
            (gulp, plugins, projectSettings)
        );

    // SASS distribution (minified)
    gulp.task('compiler-sassCompressed',
        require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-sassCompressed.js')
        (gulp, plugins, projectSettings)
    );

        // Additional SASS distribution (minified)
        gulp.task('compiler-additionalSassCompressed',
            require('./'+projectSettings.settingsPaths.gulptasks+'/compilers/compiler-additionalSassCompressed.js')
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

    gulp.task('watcher-additionalSass',
        require('./'+projectSettings.settingsPaths.gulptasks+'/watchers/watcher-additionalSass.js')
        (gulp, plugins, projectSettings, ['compiler-additionalSassCompressed', 'compiler-additionalSassDevelopment'])
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

// Run different bundles
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
    gulp.task('finalReport', function(done) {

         setTimeout(function(){
            if (warningMessage.length > 0) {
                 console.warn(warningMessage);
            }else{
                    warningMessage = "Innitial run succesfull.\nEverything works as intended.\nHappy coding!";
                  console.log(warningMessage);
            }

        }, 1000);

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