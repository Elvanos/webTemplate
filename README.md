# webTemplate project

- Version 2.0.0

A project manager system for a new or existing webpages/webapps that aim to provide a heavily customizable settings, but easy to understand and use while automating a lot of mundane tasks web developers tend to struggle with. 

## README Content
1. [Support & Features](#support--features)
2. [Getting Started](#getting-started)  
    1. [Install guide](#install-guide)
    2. [Setting webTemplateConfig.json and projectConfig.json](#setting-webtemplateconfigjson)
    3. [How the automated object literal builder works](#how-the-automated-object-literal-builder-works)
4. [Version history](#version-history)

## Support & Features
* Automatically generated settings file for easy start
* Support for CSS preprocessors Sass (both Node AND Ruby version), Less and Stylus
* Support for JS Rollup bundles with build in Coffeescript, JSX, Typescript and Babel compilation
* Support for source maps
* Support for minification of both CSS and JS
* Fully automated watchers for both JS and all CSS preprocessors
* Optimized performance - webTemplate only loads extensions and modules that are actually used by your projects
* Project management system - set your project statuses, add them to categories, adjust the file structure to your needs!
* Configurable structure of the directories along with file names

* Gulp task runner
    * Fully automated, just needs to be started once
    * Custom error/smooth run reports (no random crashes with webTemplate just because compile hiccups once)

* CSS preprocessors
    * Support the whole "big 3" bundle - Sass, Less and Stylus
    * Automatic source maps, minification and auto-prefixer for all of them
    * Support for both big bundles files and singular files if needed
   
* Rollup JS autobuild tool & watcher
    * Supports compiling from JSX, ES6, Coffeescript and Typescript
        * Input can be mixed in any way as long each is it a separate files
    * Support for additional JS files outside of the main bundle if needed (along with minified versions generated)
    * Automatic custom processing of directories and files
        * Supported modes: Object literal (more WIP)
        * Support infinite recursive subdirectories/files and comes up with a custom ID build system   
    * Minified & dev version of the js output files
    * Source maps currently WIP as Rollup is a little buggy with them atm 

## Getting Started

### Install guide
1. Download and install your appropriate version of node.js 
    * [node.js download page](https://nodejs.org/en/download/)
2. Download and install Yarn
    * [yarn download page](https://yarnpkg.com/en/docs/install)
3. Now install the actual webTemplate
    * Option one: Clone this repository from github - https://github.com/Elvanos/webTemplate.git
    * Option two: Download it and unpack it    
    [webTemplate github page](https://github.com/Elvanos/webTemplate)
4. Install the global nodeJS package by following commands
    ``` 
    yarn global add gulp
    ``` 
5. Open your favorite terminal/cmd interface, navigate to your "webTemplate" folder
    * Type "yarn install" and wait and wait the template finishes installing
        ```
        yarn install
        ```        
        * If you are updating from older version, it is suggested to use this command instead         
            ```
                yarn install --force
            ```             
6. Set your "webTemplateConfig.json" to your needs and proceed to create a new folder in the "projects" directory for your project (or just copy in an older one)
7. Run   ``` gulp ``` from either your "webTemplate" directory or from your project folder
    * If your project directory contains another "gulpfile" then you will need to run gulp from "webTemplate" directory
8. Edit the newly created "projectConfig.json" to your needs and restart gulp
7. Done! Just make sure you run "gulp" command every time you start working on your projects again (and feel free to explore all the option)

### Setting webTemplateConfig.json
The webTemplate ships with a built in webTemplateConfig.default.json file with default settings for the project. Gulp checks at start if webTemplateConfig.json exists. If it doesn't, it copies settings from webTemplateConfig.default.json and created a new one.

webTemplateConfig.json will NEVER update automatically through github update (or any other, unless manually overwritten) since it is not a part of the default setup and is solely meant for setup of the particular install of the webTemplate.
It will however add new keys and values if they will be added to newer webTemplate in the future - you will be clearly informed of this at the start of the program.

webTemplate.json can be found in the "webTemplate" directory.

* Same applies to projectConfig.json files, except for the fact that mew files are generated from default project directory.

* Detailt can be found here: HIGHLY SUGGESTED YOU READ THIS!!!
    * [Config file details](docs/configDetails.md)

#### How the automated object literal builder works
The webTemplate comes with a custom coded system to build an [object literal](http://www.dyn-web.com/tutorials/object-literal/) out of your scattered .js, .jsx .coffee and .ts files. No need to worry about duplicate file names in the structure, each file gets assigned a custom ID during generation (does not affect the final bundle naming of properties/methods/sub-objects).

This is accomplished by recursively scanning the directory structure of your <sourceDiretory>/javaScript/scripts/ directory and automatically creating an importsBundle.js file for Rollup, before rollup is run.

importsBundle.js is regenerated every time the builder is run, so no need to update it manually.

This feature can be turned off in case you wish to create the file manually instead. Both manual and automated files are exclusive, dont override each other and can co-exist next to each other (only one gets generated at a time based on the settings tho).


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


## Version history

2.0.0 (Oct. 24. 10. 2017 / 24. 10. 2017)

```
Complete rewrite in Coffeescript
Complete change to structure, project management, modules and everything else
```

1.1.8.2 (Oct. 11. 2017 / 11. 10. 2017)
```

Removed
    Removed Prerequisities from Readme

Changes
     Updated Readme (removed Prerequisities as they were... well useless since they get installed with installation)
```
1.1.8.1 (Oct. 11. 2017 / 11. 10. 2017)
```
Changes
     Fixed typo in Readme (thanks S3B4S)
```

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
