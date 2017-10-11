# webTemplate project

- Version 1.1.8

A template project for a new webpage/webapp that aims to provide out of the box support with minimal installation while offering simple config options to customize the project to one's needs.

## README Content
1. [Support & Features](#support--features)
2. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    2. [Install guide](#install-guide)
    3. [Setting gulp-config.json](#setting-gulp-configjson)
    4. [How the automated object literal builder works](#how-the-automated-object-literal-builder-works)
3. [Manual Tasks](#manual-tasks)
    1. [forceCompile](#forcecompile)
    2. [splitObject](#splitobject)
4. [Version history](#version-history)

## Support & Features
* Configurable structure of the directories along with file names
* Automatically generated settings file for easy start
* Supports both manual and automated modes for bundling JS files
* Automatically added wrappers for new .js/.coffee/.jsx/.ts files for bundling
* Automatic checking and fixing of old/partial config files
* Custom gulp reporting via OS native notification and console logs (WIP)
* Deconstruction of any big input object into individual files ready to be bungled again 
    
* Gulp task runner
    * Fully automated, just needs to be started once
    * Support both for manual and automated tasks (can be configured) 
    * Custom error/smooth run reports (WIP) 
 
* SASS preprocessor autobuild & watcher
    * LibSass 3.5 and node-sass
    * Minified & dev version of the style file along with sourcemaps
    * Support for additional .sass/.scss files outside of the main bundle if needed (along with minified version generated)
    * Supports glob sass importing for easier usage
    
* Rollup JS autobuild tool & watcher
    * Supports compiling from JSX, ES6, Coffeescript and Typescript
        * Input can be mixed in any way as long each is it a separate file
    * Support for additional JS files outside of the main bundle if needed (along with minified versions generated)
    * Automatic custom processing of directories and files
        * Supported modes: Object literal (more WIP)
        * Support infinite recursive subdirectories/files and comes up with a custom ID build system
        * Custom files/libraries/script batches can be imported separately without being added to default output
    * Minified & dev version of the js output files

## Getting Started


### Prerequisites


```
node.js 6.11.3 (or higher)
    yarn 1.1.0
    
    Global nodeJS packages
        "babel-cli": "^6.26.0",
        "babel-preset-react": "^6.5.0",
        "rollup": "^0.49.3",
        "coffeescript": "^2.0.0-beta5",
        "react": "^15.6.1",
        "gulp": "^3.9.1"        
        
    Local nodeJS dev dependencies
        "autoprefixer": "^7.1.4",
        "babel-core": "^6.26.0",
        "babel-plugin-external-helpers": "^6.22.0",
        "babel-preset-latest": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "colors": "^1.1.2",
        "console-sync": "0.0.1",
        "directory-tree": "^2.0.0",
        "gulp": "^3.9.1",
        "gulp-beautify": "^2.0.1",
        "gulp-better-rollup": "^1.1.1",
        "gulp-concat": "^2.6.1",
        "gulp-load-plugins": "^1.5.0",
        "gulp-parameterized": "^0.1.1",
        "gulp-plumber": "^1.1.0",
        "gulp-plumber-notifier": "0.0.3",
        "gulp-postcss": "^7.0.0",
        "gulp-rename": "^1.2.2",
        "gulp-sass": "^3.1.0",
        "gulp-sourcemaps": "^2.6.1",
        "gulp-tap": "^1.0.1",
        "gulp-uglify": "^3.0.0",
        "gulp-watch": "^4.3.11",
        "node-notifier": "^5.1.2",
        "node-sass": "^4.5.3",
        "node-sass-glob-importer": "^5.0.0-alpha.13",
        "object-assign": "^4.1.1",
        "require-dir": "^0.3.2",
        "rollup-plugin-babel": "^3.0.2",
        "rollup-plugin-coffee-react": "^1.0.1",
        "run-sequence": "^2.2.0",
        "traverse": "^0.6.6",
        "rollup-plugin-typescript2": "^0.7.0",
        "typescript": "^2.5.3"
```

### Install guide
1. Download and install your appropriate version of node.js 
    * [node.js download page](https://nodejs.org/en/download/)
2. Download and install Yarn
    * [yarn download page](https://yarnpkg.com/en/)
3. Now install the actual webTemplate
    * Option one: Clone this repository from github - https://github.com/Elvanos/webTemplate.git
    * Option two: Download it and unpack it    
    [webTemplate github page](https://github.com/Elvanos/webTemplate)
4. Install the global nodeJS packages by following commands
    ```
    yarn global add babel-cli
    yarn global add babel-preset-react
    yarn global add rollup
    yarn global add coffeescript
    yarn global add react
    yarn global add gulp    
    ``` 
5. Open your favorite terminal/cmd interface, navigate to your work folder
    * Type "npm install" and wait and wait the template finishes installing
        ```
        yarn install
        ```        
        * If you are updating from older version, it is suggested to use this command instead         
            ```
                yarn install --force
            ```     
    * Type "gulp" 
        ```
        gulp
        ```
        * You should get a message saying that a new "gulp-config.json" file has been created unless you had one before
6. Set your gulp-config.json to your needs (can be found in "gulpFiles" directory, if you do not have one, go to next step and then look for it again)
7. Done! Just make sure you run "gulp" command from your directory every time you start working on your project again (and feel free to explore all the option and manual commands)

### Setting gulp-config.json
The webTemplate ships with a built in gulp-config.default.json file with default settings for the project. Gulp checks at start if gulp-config.json exists. If it doesnt, it copies settings from gulp-config.default.json and created a new one.

gulp-config.json will NEVER update automatically through github update (or any other, unless manually overwritten) since it is not a part of the default setup and is solely meant for setup of the particular project webTemplate is being used for.

gulp-config.json can be found in <PROJECT PATH>/gulpFiles directory.

#### gulp-config.default.json options
```json
{
  "name": "webApp",
  "settingsGeneration": {
    "autogenBuildFile": "true",
    "compileOnLoad": "false",
    "allowAdditionalSass": "false",
    "allowAdditionalJS": "false"
  },
  "settingsPaths": {
    "distFolderPath": "example/dist",
    "srcFolderPath": "example/src",
    "splitObjectDir": "splitObjects",
    "specialInputPathJS": "_additionalFiles",
    "specialInputPathSass": "_additionalFiles"
  },
  "settingsFileNames": {
    "srcFileSass": "layout",
    "distFileCss": "layout",
    "distFileJs": "layout"
  },
  "settingsNotification":{
    "javascriptCompiler": "both",
    "javascriptCompilerAdditional": "console",
    "javascriptCompilerCompressed": "none",
    "sassCompilerDevelopment": "both",
    "sassCompilerCompressed": "none",
    "sassCompilerDevelopmentAdditional": "both",
    "sassCompilerCompressedAdditional": "none"
  }
}

```
* name - name of your app, will be used to generate the main javascript object by rollup

* settingsGeneration
    * autogenBuildFile - (true/false) - determines if the output file should be generated automatically via the automated object literal builder or if you wish to use a manual file that will never be automatically overwritten, both can exist simultaneously
    * allowAdditionalSass - (true/false) - support for standalone additional sass/scss files in "sass/additionalFiles" subdirectory. Each of these files will generate one one-to-one css file (along with a minified version). Directory also contains an "ignore" directory for extra files that will be completely ignored by the compiler(for partials/libraries/mixins/etc.)
    * allowAdditionalJS - (true/false) - support for extra files that should not be bunched in the big batch generated by Rollup. This can include libraries or other files that cant handle such treatment (final results will be a single concatenated file)
    * compileOnLoad - (true/false) - Determines if the compilers should run once on load ever time you start "gulp" command. Otherwise, they can be called via singular gulp commands
    
* settingsPaths
    * distFolderPath - folder for all the automatically generated files
    * srcFolderPath - folder for all the source files
    * specialInputPathJS - folder for all separate JS files you wish to add (script that dont fit in the main js object or libraries)
    * specialInputPathSass - folder for all separate JS files you dont wish to clump up with the main Rollup object output
    * splitObjectDir - folder where "splitObject" task dumps all generated files and directories
    
* settingsFileNames
    * srcFileSass - the name of the main source sass file
    * distFileCss - the name of the desired output css file
    * distFileJs - the name of the desired js file
    
*  settingsNotification
    * All below share same possible settings
        * "none" - dont show console logs nor notifications
        * "both" - show console logs and notifications
        * "console" - show only console logs
        * "notification" - show only notification
    * javascriptCompiler - Normal .js/.coffee/.jsx/.ts compiler
    * javascriptCompilerAdditional - Additional files JS bundler
    * javascriptCompilerCompressed - Final step is JS processing (uglify)
    * sassCompilerDevelopment - Normal SASS development compiler
    * sassCompilerCompressed - Normal SASS compressed compiler
    * sassCompilerDevelopmentAdditional - Additional files SASS development compiler
    * sassCompilerCompressedAdditional - Additional files SASS compressed compiler
        
#### How the automated object literal builder works
The webTemplate comes with a custom coded system to build an [object literal](http://www.dyn-web.com/tutorials/object-literal/) out of your scattered .js, .jsx .coffee and .ts files. No need to worry about duplicate file names in the structure, each file gets assigned a custom ID during generation (does not affect the final bundle naming of properties/methods/sub-objects).

This is accoplished by recursively scanning the directory structure of your <sourceDiretory>/js/scripts/ directory and automatically creating an importsBundle.js file for Rollup, before rollup is run.

importsBundle.js is regenerated every time the builder is run, so no need to update it manually.

This feature can be turned off in case you wish to create the file manually instead. Both manual and automated files are exclusive, dont override each other and can co-exist next to each other (only one gets generated at a time based on the settings tho).

If you chose to use the "splitObject" function, then the generated file and folder structure will be immediately useable for bundling. You just need to copy the files where you need them manually.

* Example file structure
```
/example
    /src/
        /js/
            .babelrc
            importsBundle.js
            /components/
                exampleComponent.jsx
            /modules/
                exampleModule.js
                exampleModule2.coffee
                /test/
                    exampleModule1.js            
            /specialInput/
                test.js
```
* Example importsBundle.js code automatically generated from previous structure (numbers at the end of imports are just generated IDs to evade overlapping for submodules with same names. These are not part of the final compiled file)
```javascript
    import exampleComponent_1 from './components/exampleComponent.jsx';
    import exampleModule_2 from './modules/exampleModule.js';
    import exampleModule2_3 from './modules/exampleModule2.coffee';
    import exampleModule3_4 from './modules/test/exampleModule1.js';
    var exportObject = {
        components: {
            exampleComponent: exampleComponent_1,
        },
        modules: {
            exampleModule: exampleModule_2,
            exampleModule2: exampleModule2_3,
            test: {
                exampleModule3: exampleModule3_4,
            },
        },
    };
    export default exportObject;
```

## Manual tasks
webApp comes with a bunch of pre-built manual tasks that you can use at any point through the cli interface. All of these commands share the following structure (assuming you are already in the working directory gulpfile.js)
```
gulp <task name> <parameters, if task has any>
```
#### forceCompile
Manually runs all compilers you have enabled and regenerates all generated files on demand
* parameters: none
* example:
```
gulp forceCompile
```
#### splitObject 
Splits a java script object into smaller parts and created an adequate file and folder structure that can be later used by the automatic or manual file builder 
* parameters:
    * fileName - name of the file you wish to take apart (can also include a path to it)
* example:
```
gulp splitObject --fileName bigJsObject.js
```

## Version history

1.1.8 (Oct. 11. 2017 / 11. 10. 2017)
```
Added features
    Added support for Typescript
    Dropped plans for better gul watcher for now
    
Changes
     Added "rollup-plugin-typescript2"
     Added "typescript"
     Removed "gulp-watch" (glitchy with current setup, will redo at some point)
```




1.1.7.1 (Oct. 11. 2017 / 11. 10. 2017)
```
Bugfixes
    Fixed double logging of output and put file with extra JS files
```

1.1.7 (Oct. 10. 2017 / 10. 10. 2017)
```
Added features
    Smoothed out & unified error/success reporting
    Added support for better OS native notifications
    Added options to turn the notifications/consoles logs on/off/both
    Added automatic module wrapup for .js/.coffee/.jsx/.ts files... so you people dont have to retype it in each new file manually
    Pruned unnecesry plugins
    Added sourcemap generation for more SASS tasks and some JS tasks
    
Bugfixes
    Fixed a lot of bugs in task sequences, individiual tasks and file watchers       
    
Changes
    Switched from NPM to Yarn, big readme edits
    Added "gulp-watch" (for future plans to increase efficiency of the file watchers)
    Added "gulp-tap" (utility to check what is in the gulp pipes)
    Added "colors" (for a console log that stands out more)    
    Removed "babel-loader" (was for webpack, not sure how it got to the build to begin with)
    Removed "rollup-plugin-coffee-script" (had two coffee script compilers, this one was obsolete)
   
```

1.1.6 (Oct. 9. 2017 / 9. 10. 2017)
```
Added features
    Added support for handling Gulp error in order to not crash the watcher/compiler tasks
    Addec notification popups for taks and custom function
    Added gulp task name getter function
Changes
    Added notify and error popups to all needed tasks
    Added "gulp-plumber"
    Added "gulp-plumber-notifier"   
    Added "gulp-notify"
    Added "node-notifier"
```

1.1.5 (Oct. 7. 2017 / 7. 10. 2017)
```
Added features
    Object splitting into webApp supported file/folder format
    Support for parameters in gulp tasks from cli interface
Changes
    Removed a few dev forgotten console logs from testing before
    Added "traverse" npm plugin for object management
    Added "gulp-parameterized" for parameters in tasks
```

1.1.4 (Oct. 6. 2017 / 6. 10. 2017)
```
Added features
    Better generation of rollup bundles (better readability)
Changes
    A few bugfixes
    Added cleaanup function for JS non-minifed files
    Plugin pruning (rollup revolve, commonjs and async)
```

1.1.3 (Oct. 5. 2017 / 5. 10. 2017)
```
Added features 
    Settings for allowing/disallowing additional files on JS compilers
    Added sync console logging (no more random logs)
    Added version details to README file
    Added support for manual tasks
        Added manual compile task (forceCompile)
    
Removed features
    Settings for gulpTasks directory in the config file    
    
Changes
    Redone directory structure
    Added quick-variables inside modules and tasks
    Main file split into more modules/tasks
    Updated multiple functions
    Fixed and updated file watchers for allowing/disallowing of additionalFiles in both JS and SASS
    Various bug fixes
    Added debug console logs for development

Dev/WIP features
    Testing "sharp" for mass image processing
```
