# webTemplate project

A template project for a new webpage/webapp that aims to provide out of the box support with minimal installation while offering simple config options to customize the project to one's needs.

## Support & Features
* Configurable structure of the directories along with file names
    * Automatically generated settings file for easy start   
    
* Gulp task runner
    * Fully automated, just needs to be started once
    * Custom error/smooth run reports (WIP) 
 
* SASS preprocessor autobuild & watcher
    * LibSass 3.5 and node-sass
    * Minified & dev version of the style file
    * Supports glob sass importing for easier usage
    
* Rollup JS autobuild tool & watcher
    * Supports compiling from JSX, ES6 and Coffeescript
        * Input can be mixed in any way as long each is it a separate file
    * Automatic custom processing of directories and files
        * Supported modes: Object literal (more WIP)
        * Custom files/libraries/script batches can be imported separately without being added to default output
    * Minified & dev version of the js output files

## Getting Started


### Prerequisites


```
node.js 6.11.3 (or higher)
    npm 5.4.1 (or higher)
    
    Global NPM packages (install manually)
       "babel-cli": "^6.26.0",
       "babel-preset-react": "^6.5.0",
       "rollup": "^0.49.3",
       "coffeescript": "^2.0.0-beta5",
       "react": "^15.6.1"
        
    Local NPM dev dependencies (install via "npm install")
        "autoprefixer": "^7.1.4",
        "babel-core": "^6.26.0",
        "babel-loader": "^7.1.2",
        "babel-plugin-external-helpers": "^6.22.0",
        "babel-preset-latest": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "directory-tree": "^2.0.0",
        "gulp": "^3.9.1",
        "gulp-beautify": "^2.0.1",
        "gulp-better-rollup": "^1.1.1",
        "gulp-concat": "^2.6.1",
        "gulp-load-plugins": "^1.5.0",
        "gulp-postcss": "^7.0.0",
        "gulp-rename": "^1.2.2",
        "gulp-sass": "^3.1.0",
        "gulp-sourcemaps": "^2.6.1",
        "gulp-uglify": "^3.0.0",
        "node-sass": "^4.5.3",
        "node-sass-glob-importer": "^5.0.0-alpha.13",
        "object-assign": "^4.1.1",
        "require-dir": "^0.3.2",
        "rollup-plugin-async": "^1.2.0",
        "rollup-plugin-babel": "^3.0.2",
        "rollup-plugin-coffee-react": "^1.0.1",
        "rollup-plugin-coffee-script": "^1.1.0",
        "rollup-plugin-commonjs": "^8.2.1",
        "rollup-plugin-node-resolve": "^3.0.0",
        "run-sequence": "^2.2.0"
```

### Install guide
1. Download and install your appropriate version of node.js 
    * [node.js download page](https://nodejs.org/en/download/) - this also automaticaly installs npm    
2. Now install the actual webTemplate
    * Option one: Clone this repository from github - https://github.com/Elvanos/webTemplate.git
    * Option two: Download it and unpack it    
    [webTemplate github page](https://github.com/Elvanos/webTemplate)
3. Install the global NPM packages by following commands
    ```
    npm install -G babel-cli
    npm install -G babel-preset-react
    npm install -G rollup
    npm install -G coffeescript
    npm install -G react    
    ``` 
4. Open your favorite terminal/cmd interface, navigate to your work folder
    * Type "npm install" and wait and wait the template finishes installing
        ```
        npm install   
        ```
    * Type "gulp" 
        ```
        gulp
        ```
        * You should get a message saying that a new "gulp-config.json" file has been created unless you had one before
5. Set you gulp-config.json to your needs
6. Done! Just make sure you run "gulp" command from your directory every time you start working on your project again 

### Setting gulp-config.json
The webTemplate ships with a built in gulp-config.default.json file with default settings for the project. Gulp checks at start if gulp-config.json exists. If it doesnt, it copies settings from gulp-config.default.json and created a new one.

gulp-config.json will NEVER update automatically through github (or any other) update since it is not a part of the default setup and is solely meant for setup of the particular project webTemplate is being used for.

#### gulp-config.json options
* name - name of your app, will be used to generate the main javascript object by rollup

* settingsPaths
    * distFolderPath - folder for all the automatically generated files
    * srcFolderPath - folder for all the source files
    * specialInputPathJS - folder for all separate JS files you wish to add (script that dont fit in the main js object or libraries)
    * gulptasks - folder for particular gulp tasks
    
* settingsFileNames
    * srcFileSass - the name of the main source sass file
    * distFileCss - the name of the desired output css file
    * distFileJs - the name of the desired js file
    
#### How the automated object literal builder works
The webTemplate comes with a custom coded system to build an [object literal](http://www.dyn-web.com/tutorials/object-literal/) out of your scattered .js, .jsx and .coffee files.

This is accoplished by recursively scanning the directory structure of your <sourceDiretory>/js/ directory and automatically creating an importsBundle.js file for Rollup, before rollup is run.

importsBundle.js is regenerated every time the builder is run, so no need to update it manually.

* Example file structure
```
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
                exampleModule3.js            
        /specialInput/
            test.js
```
* Example importsBundle.js code automatically generated from previous structure
```javascript
    import exampleComponent from './components/exampleComponent.jsx';
    import exampleModule from './modules/exampleModule.js';
    import exampleModule2 from './modules/exampleModule2.coffee';
    import exampleModule3 from './modules/test/exampleModule3.js';
    var exportObject = {
        components: {
            exampleComponent: exampleComponent,
        },
        modules: {
            exampleModule: exampleModule,
            exampleModule2: exampleModule2,
            test: {
                exampleModule3: exampleModule3,
            },
        },
    };
    export default exportObject;
```
