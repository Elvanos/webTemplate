var webTemplate = (function () {
'use strict';

var gConsoleDebug;

gConsoleDebug = function(debugSwitch) {
  if (debugSwitch === true) {
    return ['log', 'warn'].forEach(function(method) {
      var old;
      old = console[method];
      console[method] = function() {
        var args, stack;
        stack = (new Error).stack.split(/\n/);
        if (stack[0].indexOf('Error') === 0) {
          stack = stack.slice(1);
        }
        args = [].slice.apply(arguments).concat([stack[1].trim()]);
        return old.apply(console, args);
      };
    });
  }
};

var gConsoleDebug_1 = gConsoleDebug;

var gSetValueByPath;

gSetValueByPath = function(obj, path, value) {
  var i, o, parts;
  // @param [object] obj - input object you need to add values to
  // @param [array] path - an array of "object levels" that lead to the final value AKA where it needs to be added
  // @param [anything] value - the value that should be added, can be anything except for undefined
  parts = path;
  o = obj;
  if (parts.length > 1) {
    i = 0;
    while (i < parts.length - 1) {
      if (!o[parts[i]]) {
        o[parts[i]] = {};
      }
      o = o[parts[i]];
      i++;
    }
  }
  o[parts[parts.length - 1]] = value;
};

var gSetValueByPath_2 = gSetValueByPath;

var globals;

globals = {
  dependencies: {},
  config: {},
  moduleList: {
    compilers: {
      javaScript: false,
      coffeeScript: false,
      typeScript: false,
      jsx: false,
      babel: false,
      rubySass: false,
      nodeSass: false,
      less: false,
      stylus: false
    },
    utilities: {
      minify: false,
      concat: false,
      sourceMaps: false,
      autoPrefixCSS: false,
      globNodeSass: false
    },
    custom: {
      fixNewFilesJS: false,
      autoObjectLiteralJS: false,
      autoImportListJS: false
    }
  }
};

var globals_3 = globals;

var javaScript;

javaScript = function(app, appModule, moduleData) {
  var dep, distFileNameMain, distPathMain, gulpBabelConfig, ifAdditionalFiles, ifAdditionalFilesOverride, ifMainFiles, ifMinify, ifMinifyAdditional, ifSourceMaps, rollupConfig, rollupFormat, rollupPlugins, srcPath, srcPathAdditional, srcPathMain, taskName;

  // Set task name
  taskName = 'javaScript';

  // Get dependencies
  dep = app.globals.dependencies;

  // Clear TS cache, because it is buggy as hell
  if (dep.fs.existsSync('./.rpt2_cache')) {
    dep.fs.removeSync('./.rpt2_cache');
  }

  // SRC path
  srcPath = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'javaScript/';

  // SRC path additional files
  srcPathAdditional = srcPath + 'scripts/' + moduleData.module.additionalFiles.srcFolder + '/*.js';

  // IF Auto Build is on, use auto bundle, otherwise use the manual one
  if (moduleData.module.buildHelper.support === true && moduleData.module.buildHelper.autoBuild.support === true) {

    // Check files for proper formatting

    // Run importsBundle builder
    appModule._javaScript.buildImportsBundle(app, appModule, moduleData, srcPath);

    // Set SRC Path
    srcPathMain = srcPath + 'importsBundle.js';
  } else {

    // Set SRC Path
    srcPathMain = srcPath + 'manualBundle.js';
  }

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/js';

  // IF dist to root
  if (moduleData.module.outputToRoot) {
    distPathMain = moduleData.path;
  }

  // DIST file name
  distFileNameMain = moduleData.module.distName;

  // Rollup config
  rollupConfig = {};
  rollupFormat = 'iife';

  // Rollup plugins
  rollupPlugins = [];
  rollupPlugins.push(dep.rollupBabel());
  // If Coffee Script support
  if (moduleData.module.modules.coffeeScript.support === true) {
    rollupPlugins.push(dep.rollupCoffeeScript());
  }

  // If Type Script support
  if (moduleData.module.modules.typeScript.support === true) {
    rollupPlugins.push(dep.rollupTypeScript());
  }

  // If additional files
  ifAdditionalFiles = false;
  if (moduleData.module.additionalFiles.support === true) {
    ifAdditionalFiles = true;

    // If additional files override main
    ifAdditionalFilesOverride = '.concat';
    if (moduleData.module.additionalFiles.overWriteOriginal === true) {
      ifAdditionalFilesOverride = '';
    }
  }

  // If NOT main
  ifMainFiles = true;
  if (moduleData.module.additionalFiles.support === true && moduleData.module.additionalFiles.onlyAdditional === true) {
    ifMainFiles = false;
  }

  //gulpBabelConfig
  gulpBabelConfig = {
    "presets": [
      [
        "latest",
        {
          "es2015": {
            "modules": false
          }
        }
      ],
      ["react"]
    ],
    "plugins": ["external-helpers"]
  };

  //Get IF values

  // If minify
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.allowMain === true) {
    ifMinify = true;
  }

  // If minify Additional
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.separateFiles === true) {
    ifMinifyAdditional = true;
  }
  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load Main files
    return stream = dep.gulp.src('nonExistingFile').pipe(dep.gulpCond(ifMainFiles === true, function() {
      return dep.gulpAdd(srcPathMain);

    // Load possible error reports
    // Load sourcemaps if supported
    })).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });
    })).pipe(dep.rollup({
      moduleName: moduleData.config.projectName.replace(/[- ]/g, ''),
      cache: true,
      onwarn: function(warning) {

        // Skip glitchy warnings
        if (warning.code === 'THIS_IS_UNDEFINED') {

        } else {
          return console.warn(warning.message);
        }
      },
      plugins: rollupPlugins

    // Rename output file to config value
    // Write sourcemap if supported
    }, rollupFormat)).pipe(dep.gulpRename(distFileNameMain + ".js")).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Compile output to supported browser JS with babel

    // Output files

    // Output also the minified files IF minify is allowed
    })).pipe(dep.gulpBabel(gulpBabelConfig)).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpJSminify();
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName + 'Additional',
            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName + 'Additional'));
          return console.log(dep.colors.green(distFileNameMain + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    // Load concat files if Additional files
    })).pipe(dep.gulpCond(ifAdditionalFiles === true, function() {
      return dep.gulpAdd.append(srcPathAdditional);

    // Concat files if Additional files
    })).pipe(dep.gulpCond(ifAdditionalFiles === true, function() {
      return dep.gulpConcat(distFileNameMain + ifAdditionalFilesOverride + '.js');

    // Compile with Babel if Additional files
    }))
       /* .pipe(dep.gulpCond(ifAdditionalFiles === true, function() {
            return dep.gulpBabel(gulpBabelConfig);
        }))*/

    // Output file if additional files
   .pipe(dep.gulpCond(ifAdditionalFiles === true, function() {
      return dep.gulp.dest(distPathMain);
    // Output also the minified files IF minify is allowed
    })).pipe(dep.gulpCond(ifAdditionalFiles === true && ifMinifyAdditional === true, function() {
      return dep.gulpJSminify();
    })).pipe(dep.gulpCond(ifAdditionalFiles === true && ifMinifyAdditional === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifAdditionalFiles === true && ifMinifyAdditional === true, function() {
      return dep.gulp.dest(distPathMain);
    // Report positive result in console and notification if supported
    })).pipe(dep.gulpCond(ifAdditionalFiles === true, function() {
      return dep.gulpTap(function(file) {
        var fileExtension;
        fileExtension = dep.path.extname(file.path).substr(1);

        // Do not log for map and min files
        if (fileExtension !== 'map' && fileExtension !== 'min') {

          // Check notification settings
          if (moduleData.module.reporting.notification === true) {
            dep.notify.notify({
              title: moduleData.config.projectName + ' - ' + taskName,
              message: distFileNameMain + '.concat.' + fileExtension + ' file successfully compiled!',
              sound: false
            });
          }

          // Check console settings
          if (moduleData.module.reporting.console === true) {
            console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
            return console.log(dep.colors.green(distFileNameMain + ifAdditionalFilesOverride + fileExtension + ' file successfully compiled!'));
          }
        }
      });
    }));
  });

  // Start the task
  dep.gulp.start(taskName);
};

var javaScript_4 = javaScript;

var less;

less = function(app, appModule, moduleData) {
  var cssMinifyLevel, dep, distFileNameMain, distPathMain, ifAutoPrefixer, ifMinify, ifSourceMaps, lessConfig, srcPathMain, taskName;

  // Set task name
  taskName = 'less';

  // Get dependencies
  dep = app.globals.dependencies;

  // SRC path
  srcPathMain = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'less/layout.less';

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // DIST file name
  distFileNameMain = moduleData.module.distName;

  // Less config
  lessConfig = {};

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.allowMain === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports
    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });
    // Load Less with config

    // Load autoprefixer if supported
    })).pipe(dep.less(lessConfig)).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Rename output file to config value
    // Write sourcemap if supported
    })).pipe(dep.gulpRename(distFileNameMain + ".css")).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(distFileNameMain + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + distFileNameMain + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var less_5 = less;

var lessAdditional;

lessAdditional = function(app, appModule, moduleData, path) {
  var cssMinifyLevel, dep, distPathMain, fileName, ifAutoPrefixer, ifMinify, ifSourceMaps, lessConfig, srcPathMain, taskName;

  // Set task name
  taskName = 'lessAdditional';

  // Get dependencies
  dep = app.globals.dependencies;

  // Get current file name
  fileName = dep.path.basename(path);
  fileName = fileName.replace(dep.path.extname(path), "");

  // SRC path
  srcPathMain = path;

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // Less config
  lessConfig = {};

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.separateFiles === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports

    // Load Less with config

    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.less(lessConfig)).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load autoprefixer if supported
    })).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Write sourcemap if supported
    })).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.additionalFiles.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: fileName + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.additionalFiles.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(fileName + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + fileName + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var lessAdditional_6 = lessAdditional;

var nodeSass;

nodeSass = function(app, appModule, moduleData) {
  var cssMinifyLevel, dep, distFileNameMain, distPathMain, ifAutoPrefixer, ifMinify, ifSourceMaps, sassConfig, srcPathMain, taskName;

  // Set task name
  taskName = 'nodeSassMain';

  // Get dependencies
  dep = app.globals.dependencies;

  // SRC path
  srcPathMain = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'nodeSass/layout.sass';

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // DIST file name
  distFileNameMain = moduleData.module.distName;

  // Sass config
  sassConfig = {};
  sassConfig.outputStyle = 'nested';

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.allowMain === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports
    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load Sass with config

    // Load autoprefixer if supported
    })).pipe(dep.nodeSass(sassConfig)).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Rename output file to config value
    // Write sourcemap if supported
    })).pipe(dep.gulpRename(distFileNameMain + ".css")).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(distFileNameMain + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + distFileNameMain + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var nodeSass_7 = nodeSass;

var nodeSassAdditional;

nodeSassAdditional = function(app, appModule, moduleData, path) {
  var cssMinifyLevel, dep, distPathMain, fileName, ifAutoPrefixer, ifMinify, ifSourceMaps, sassConfig, srcPathMain, taskName;

  // Set task name
  taskName = 'nodeSassAdditional';

  // Get dependencies
  dep = app.globals.dependencies;

  // Get current file name
  fileName = dep.path.basename(path);
  fileName = fileName.replace(dep.path.extname(path), "");

  // SRC path
  srcPathMain = path;

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // Sass config
  sassConfig = {};
  sassConfig.outputStyle = 'nested';

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.separateFiles === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports
    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load Sass with config

    // Load autoprefixer if supported
    })).pipe(dep.nodeSass(sassConfig)).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Write sourcemap if supported
    })).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.additionalFiles.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: fileName + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.additionalFiles.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(fileName + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + fileName + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var nodeSassAdditional_8 = nodeSassAdditional;

var rubySass;

rubySass = function(app, appModule, moduleData) {
  var cssMinifyLevel, dep, distFileNameMain, distPathMain, ifAutoPrefixer, ifMinify, ifSourceMaps, sassConfig, srcPathMain, taskName;

  // Set task name
  taskName = 'rubySassMain';

  // Get dependencies
  dep = app.globals.dependencies;

  // SRC path
  srcPathMain = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'rubySass/layout.sass';

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // DIST file name
  distFileNameMain = moduleData.module.distName;

  // Sass config
  sassConfig = {};
  sassConfig.outputStyle = 'nested';

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.allowMain === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;
    stream = dep.rubySass(srcPathMain, {
      style: "nested"

    // Load possible error reports

    // Load sourcemaps if supported
    }).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load autoprefixer if supported
    })).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Rename output file to config value
    // Write sourcemap if supported
    })).pipe(dep.gulpRename(distFileNameMain + ".css")).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(distFileNameMain + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + distFileNameMain + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var rubySass_9 = rubySass;

var rubySassAdditional;

rubySassAdditional = function(app, appModule, moduleData, path) {
  var cssMinifyLevel, dep, distPathMain, fileName, ifAutoPrefixer, ifMinify, ifSourceMaps, srcPathMain, taskName;

  // Set task name
  taskName = 'rubySassAdditional';

  // Get dependencies
  dep = app.globals.dependencies;

  // Get current file name
  fileName = dep.path.basename(path);
  fileName = fileName.replace(dep.path.extname(path), "");

  // SRC path
  srcPathMain = path;

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.separateFiles === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;
    stream = dep.rubySass(srcPathMain, {
      style: "nested"

    // Load possible error reports

    // Load sourcemaps if supported
    }).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load autoprefixer if supported
    })).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Write sourcemap if supported
    })).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.additionalFiles.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: fileName + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.additionalFiles.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(fileName + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + fileName + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var rubySassAdditional_10 = rubySassAdditional;

var stylus;

stylus = function(app, appModule, moduleData) {
  var cssMinifyLevel, dep, distFileNameMain, distPathMain, ifAutoPrefixer, ifMinify, ifSourceMaps, srcPathMain, stylusConfig, taskName;

  // Set task name
  taskName = 'stylus';

  // Get dependencies
  dep = app.globals.dependencies;

  // SRC path
  srcPathMain = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'stylus/layout.styl';

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // DIST file name
  distFileNameMain = moduleData.module.distName;

  // Stylus config
  stylusConfig = {};

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.allowMain === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports
    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });
    // Load Stylus with config

    // Load autoprefixer if supported
    })).pipe(dep.stylus(stylusConfig)).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Rename output file to config value
    // Write sourcemap if supported
    })).pipe(dep.gulpRename(distFileNameMain + ".css")).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(distFileNameMain + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + distFileNameMain + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var stylus_11 = stylus;

var stylusAdditional;

stylusAdditional = function(app, appModule, moduleData, path) {
  var cssMinifyLevel, dep, distPathMain, fileName, ifAutoPrefixer, ifMinify, ifSourceMaps, srcPathMain, stylusConfig, taskName;

  // Set task name
  taskName = 'stylusAdditional';

  // Get dependencies
  dep = app.globals.dependencies;

  // Get current file name
  fileName = dep.path.basename(path);
  fileName = fileName.replace(dep.path.extname(path), "");

  // SRC path
  srcPathMain = path;

  // DIST path
  distPathMain = moduleData.path + '/' + moduleData.config.paths.distFolder + '/css';

  // Stylus config
  stylusConfig = {};

  //Get IF values

  // If Source Maps
  ifSourceMaps = moduleData.module.sourceMaps;

  // If AutoPrefixer
  ifAutoPrefixer = moduleData.module.modules.autoPrefix;

  // If minify CSS
  if (moduleData.module.allowMinify.support === true && moduleData.module.allowMinify.separateFiles === true) {
    ifMinify = true;
    cssMinifyLevel = moduleData.module.allowMinify.level;
  }

  // Set up gulp task
  dep.gulp.task(taskName, function(done) {
    var stream;

    // Load files

    // Load possible error reports

    // Load Stylus with config

    // Load sourcemaps if supported
    stream = dep.gulp.src(srcPathMain).pipe(dep.gulpPlumberNofifier()).pipe(dep.stylus(stylusConfig)).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.init({
        largeFile: true
      });

    // Load autoprefixer if supported
    })).pipe(dep.gulpCond(ifAutoPrefixer === true, function() {
      return dep.gulpPostCss([dep.autoPrefixer()]);

    // Write sourcemap if supported
    })).pipe(dep.gulpCond(ifSourceMaps === true, function() {
      return dep.gulpSourceMaps.write('', {
        includeContent: false,
        sourceRoot: srcPathMain
      });

    // Output files

    // Load minify if supported
    })).pipe(dep.gulp.dest(distPathMain)).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpCSSminify({
        level: cssMinifyLevel
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulpRename({
        suffix: '.min'
      });
    })).pipe(dep.gulpCond(ifMinify === true, function() {
      return dep.gulp.dest(distPathMain);

    // Report positive result in console and notification if supported
    })).pipe(dep.gulpTap(function(file) {
      var fileExtension;
      fileExtension = dep.path.extname(file.path).substr(1);

      // Do not log for map and min files
      if (fileExtension !== 'map' && fileExtension !== 'min') {

        // Check notification settings
        if (moduleData.module.additionalFiles.reporting.notification === true) {
          dep.notify.notify({
            title: moduleData.config.projectName + ' - ' + taskName,
            message: fileName + '.' + fileExtension + ' file successfully compiled!',
            sound: false
          });
        }

        // Check console settings
        if (moduleData.module.additionalFiles.reporting.console === true) {
          console.log(dep.colors.blue(moduleData.config.projectName + ' - ' + taskName));
          return console.log(dep.colors.green(fileName + '.' + fileExtension + ' file successfully compiled!'));
        }
      }
    }));

    // Cleanup after the task
    return stream.on('finish', function() {
      var extraMapFileExists, extramapFilePath;

      // Clean extra map files
      extramapFilePath = distPathMain + '/' + fileName + '.css.min.map';
      extraMapFileExists = dep.fs.existsSync(extramapFilePath);
      if (extraMapFileExists === true) {
        return dep.fs.unlinkSync(extramapFilePath);
      }
    });
  });

  // Start the task
  dep.gulp.start(taskName);
};

var stylusAdditional_12 = stylusAdditional;

var buildImportsBundle;

buildImportsBundle = function(app, appModule, moduleData, srcPath) {
  var additionalFilesPath, buildMainJS, dep, fileContent, importPathFix, srcFolderPath;
  // Get dependencies
  dep = app.globals.dependencies;

  // Set vars
  srcFolderPath = srcPath + '/scripts';
  additionalFilesPath = moduleData.module.additionalFiles.srcFolder;
  importPathFix = moduleData.path + '/' + moduleData.config.paths.srcFolder + '/javaScript/scripts/';
  // Set the function that returns a file content for the auto import bundle
  buildMainJS = function() {
    var fileTree, importsString, objectBody, objectFooter, objectHeader, treeSearch, uniqueId;

    // Get all files for import
    fileTree = dep.dirTree(srcFolderPath);

    // Set default string for opening and closing of the object
    objectHeader = 'var exportObject = {';
    objectFooter = '}; export default exportObject;';
    objectBody = '';

    // Prepare variables for generating imports
    importsString = '';
    uniqueId = 0;

    // Generate imports and prepare them as string
    treeSearch = function(treeLevel) {
      var fileContents, fileName, i, importPath, len, prefix, suffix;
      treeLevel = treeLevel.children;
      i = 0;
      len = treeLevel.length;
      while (i < len) {

        // Excluded
        if (treeLevel[i].name === '.babelrc' || treeLevel[i].name === additionalFilesPath || treeLevel[i].name === 'importsBundle.js' || treeLevel[i].name === 'manualBundle.js') {
          i++;
          continue;
        }
        // If directory
        if (treeLevel[i].type === 'directory') {
          // Build object
          objectBody += treeLevel[i].name + ' :{';
          treeSearch(treeLevel[i]);
          objectBody += '},';
        }
        // If file
        if (treeLevel[i].type === 'file') {
          uniqueId++;

          // Build object
          fileName = treeLevel[i].name;
          fileName = fileName.replace(treeLevel[i].extension, '');
          objectBody += fileName + ' :' + fileName + '_' + uniqueId + ',';

          // Build import list
          importPath = treeLevel[i].path;

          // Check if all files are formatted properly, if not, wrap them properly so we dont end up generating errors
          // fileContents = dep.fs.readFileSync(importPath, 'utf8');
          // if (fileContents.indexOf('export default') === -1) {
          //   prefix = '';
          //   suffix = '';
          //
          //   // React to different file types
          //   if (treeLevel[i].extension === '.js' || treeLevel[i].extension === '.jsx' || treeLevel[i].extension === '.ts') {
          //     prefix = 'let ' + fileName + ' = function () {\n\n';
          //     suffix = '};\nexport default ' + fileName + ';';
          //   }
          //   if (treeLevel[i].extension === '.coffee') {
          //     prefix = fileName + ' = () ->\n\n';
          //     suffix = 'export default ' + fileName;
          //   }
          //   fileContents = prefix + fileContents + suffix;
          //   dep.fs.writeFileSync(importPath, fileContents, 'utf8');
          // }

          // Fix backslashes
          importPath = importPath.replace(/\\/g, '/');

          // Fix pathing for imports
          importPath = importPath.replace(importPathFix, '');

          // Add file to import string
          importsString += 'import ' + fileName + '_' + uniqueId + ' from \'./scripts/' + importPath + '\';';
        }
        i++;
      }
    };
    treeSearch(fileTree);
    importsString = importsString.replace(/~/g, '')
    return importsString + objectHeader + objectBody + objectFooter;
  };
  fileContent = buildMainJS();
  return dep.fs.writeFileSync(srcPath + '/importsBundle.js', fileContent);
};

var buildImportsBundle_13 = buildImportsBundle;

var _manager;

_manager = function(app, config, command, path) {
  var appModule, srcPath;
  appModule = app.gulpCompilers;
  switch (command) {

    //#####################
    /*  JS COMPILERS  */
    //#####################

    // Run JS Compiler
    case 'javaScript':
      return appModule.javaScript(app, appModule, config);

    // Refrssh imports bundle on added files
    case 'javaScriptRefresh':
      srcPath = config.path + '/' + config.config.paths.srcFolder + '/' + 'javaScript/';
      return appModule._javaScript.buildImportsBundle(app, appModule, config, srcPath);

    //######################
    /*  CSS COMPILERS  */
    //######################

    // Run nodeSass compiler
    case 'nodeSass':
      return appModule.nodeSass(app, appModule, config);
    // Run nodeSassAdditional compiler
    case 'nodeSassAdditional':
      return appModule.nodeSassAdditional(app, appModule, config, path);
    // Run rubySass compiler
    case 'rubySass':
      return appModule.rubySass(app, appModule, config);
    // Run rubySassAdditional compiler
    case 'rubySassAdditional':
      return appModule.rubySassAdditional(app, appModule, config, path);
    // Run less compiler
    case 'less':
      return appModule.less(app, appModule, config);
    // Run lessAdditional compiler
    case 'lessAdditional':
      return appModule.lessAdditional(app, appModule, config, path);
    // Run stylus compiler
    case 'stylus':
      return appModule.stylus(app, appModule, config);
    // Run stylusAdditional compiler
    case 'stylusAdditional':
      return appModule.stylusAdditional(app, appModule, config, path);
  }
};

var _manager_14 = _manager;

var moduleLoader;

moduleLoader = function(app, projectList) {
  var config, i, len, moduleList, project;
  // Get module list
  moduleList = app.globals.moduleList;
  // Check which modules to load
  for (i = 0, len = projectList.length; i < len; i++) {
    project = projectList[i];
    // Set compilers vars for easier readability
    config = project.config.modules.compilers;

    //######################
    /* Check compilers */
    //######################

    // If Java Script support
    if (config.javaScript.support === true) {
      moduleList.compilers.javaScript = true;

      // If Coffee Script support
      if (config.javaScript.modules.coffeeScript.support === true) {
        moduleList.compilers.coffeeScript = true;
      }

      // If Type Script support
      if (config.javaScript.modules.typeScript.support === true) {
        moduleList.compilers.typeScript = true;
      }
      // If JSX support
      if (config.javaScript.modules.jsx.support === true) {
        moduleList.compilers.jsx = true;
      }

      // If Babel support
      if (config.javaScript.modules.babel.support === true) {
        moduleList.compilers.babel = true;
      }
    }

    // If CSS compiler support
    if (config.cssPreprocessors.support === true) {
      // If Node Sass support
      if (config.cssPreprocessors.modules.nodeSass.support === true) {
        moduleList.compilers.nodeSass = true;
      }

      // If Ruby Sass support
      if (config.cssPreprocessors.modules.rubySass.support === true) {
        moduleList.compilers.rubySass = true;
      }

      // If Less support
      if (config.cssPreprocessors.modules.less.support === true) {
        moduleList.compilers.less = true;
      }

      // If Stylus support
      if (config.cssPreprocessors.modules.stylus.support === true) {
        moduleList.compilers.stylus = true;
      }
    }

    //######################
    /* Check Utilities */
    //######################

    // If Java Script support
    if (config.javaScript.support === true) {
      // If Source Map support
      if (config.javaScript.sourceMaps === true) {
        moduleList.utilities.sourceMaps = true;
      }

      // If Minify support
      if (config.javaScript.allowMinify.support === true) {
        moduleList.utilities.minify = true;
      }

      // If Concat support
      if (config.javaScript.additionalFiles.support === true) {
        moduleList.utilities.concat = true;
      }
    }

    // If CSS compiler support
    if (config.cssPreprocessors.support === true) {
      // If Node Sass support
      if (config.cssPreprocessors.modules.nodeSass.support === true) {
        moduleList.compilers.nodeSass = true;

        // If Source Map support
        if (config.cssPreprocessors.modules.nodeSass.sourceMaps === true) {
          moduleList.utilities.sourceMaps = true;
        }

        // If Glob Sass support
        if (config.cssPreprocessors.modules.nodeSass.modules.globSass === true) {
          moduleList.utilities.globNodeSass = true;
        }

        // If Auto Prefix support
        if (config.cssPreprocessors.modules.nodeSass.modules.autoPrefix === true) {
          moduleList.utilities.autoPrefixCSS = true;
        }

        // If Minify support
        if (config.cssPreprocessors.modules.nodeSass.allowMinify.support === true) {
          moduleList.utilities.minify = true;
        }
      }

      // If Ruby Sass support
      if (config.cssPreprocessors.modules.rubySass.support === true) {
        moduleList.compilers.rubySass = true;

        // If Source Map support
        if (config.cssPreprocessors.modules.rubySass.sourceMaps === true) {
          moduleList.utilities.sourceMaps = true;
        }

        // If Auto Prefix support
        if (config.cssPreprocessors.modules.rubySass.modules.autoPrefix === true) {
          moduleList.utilities.autoPrefixCSS = true;
        }

        // If Minify support
        if (config.cssPreprocessors.modules.rubySass.allowMinify.support === true) {
          moduleList.utilities.minify = true;
        }
      }

      // If Less support
      if (config.cssPreprocessors.modules.less.support === true) {
        moduleList.compilers.less = true;

        // If Source Map support
        if (config.cssPreprocessors.modules.less.sourceMaps === true) {
          moduleList.utilities.sourceMaps = true;
        }

        // If Auto Prefix support
        if (config.cssPreprocessors.modules.less.modules.autoPrefix === true) {
          moduleList.utilities.autoPrefixCSS = true;
        }

        // If Minify support
        if (config.cssPreprocessors.modules.less.allowMinify.support === true) {
          moduleList.utilities.minify = true;
        }
      }

      // If Stylus support
      if (config.cssPreprocessors.modules.stylus.support === true) {
        moduleList.compilers.stylus = true;

        // If Source Map support
        if (config.cssPreprocessors.modules.stylus.sourceMaps === true) {
          moduleList.utilities.sourceMaps = true;
        }

        // If Auto Prefix support
        if (config.cssPreprocessors.modules.stylus.modules.autoPrefix === true) {
          moduleList.utilities.autoPrefixCSS = true;
        }

        // If Minify support
        if (config.cssPreprocessors.modules.stylus.allowMinify.support === true) {
          moduleList.utilities.minify = true;
        }
      }
    }

    //######################
    /* Check Custom    */
    //######################

    // If Java Script support
    if (config.javaScript.support === true) {
      // If Build helper support
      if (config.javaScript.buildHelper.support === true) {

        // If Build helper - Auto Fix
        if (config.javaScript.buildHelper.autoFix.support === true) {

          // If Build helper - Auto Fix - Fix new files
          if (config.javaScript.buildHelper.autoFix.modules.fixNewFiles === true) {
            moduleList.custom.fixNewFilesJS = true;
          }
        }

        // If Build helper - Auto Build
        if (config.javaScript.buildHelper.autoBuild.support === true) {
          moduleList.custom.autoBuild = true;
        }
      }
    }
  }
};

var moduleChecker_15 = moduleLoader;

var projectCycler;

projectCycler = function(app, appModule, projectList) {
  var config, curProjectCheck, curProjectDirName, dep, i, len, moduleData, path, project, results, watcher;
  dep = app.globals.dependencies;

  // Warn user that we are running in only current project mode
  if (app.globals.config.allowOnlyOnCurrent === true) {
    console.log(dep.colors.yellow('The application is running in "current project" mode. Only project from whose directory gulp was called will be processed.'));
  }

  // Load watcher function
  watcher = appModule.watcherSwitch;
  results = [];
  for (i = 0, len = projectList.length; i < len; i++) {
    project = projectList[i];

    // Check if project is current
    curProjectDirName = project.path.split("/").pop();
    curProjectCheck = process.env.INIT_CWD;
    curProjectCheck = curProjectCheck.split("\\").pop();
    curProjectCheck = project.name === curProjectCheck || curProjectDirName === curProjectCheck;

    // Check if we are running the app for only current project or for all that went through the load filter
    if (app.globals.config.allowOnlyOnCurrent === false || curProjectCheck > 0) {

      //Load project config
      config = project.config;

      // Set var for easier access to project path
      path = project.path;

      console.log(path);

      // Run watcher for JS
      if (config.modules.compilers.javaScript.support === true) {
        moduleData = {
          module: config.modules.compilers.javaScript,
          name: 'javaScript',
          path: path,
          config: config
        };
        watcher(app, moduleData);
      }

      // Run watches for CSS
      if (config.modules.compilers.cssPreprocessors.support === true) {

        // Run watcher for Ruby Sass
        if (config.modules.compilers.cssPreprocessors.modules.rubySass.support === true) {
          moduleData = {
            module: config.modules.compilers.cssPreprocessors.modules.rubySass,
            name: 'rubySass',
            path: path,
            config: config
          };
          watcher(app, moduleData);
        }

        // Run watcher for Node Sass
        if (config.modules.compilers.cssPreprocessors.modules.nodeSass.support === true) {
          moduleData = {
            module: config.modules.compilers.cssPreprocessors.modules.nodeSass,
            name: 'nodeSass',
            path: path,
            config: config
          };
          watcher(app, moduleData);
        }

        // Run watcher for Less
        if (config.modules.compilers.cssPreprocessors.modules.less.support === true) {
          moduleData = {
            module: config.modules.compilers.cssPreprocessors.modules.less,
            name: 'less',
            path: path,
            config: config
          };
          watcher(app, moduleData);
        }

        // Run watcher for Stylus
        if (config.modules.compilers.cssPreprocessors.modules.stylus.support === true) {
          moduleData = {
            module: config.modules.compilers.cssPreprocessors.modules.stylus,
            name: 'stylus',
            path: path,
            config: config
          };
          results.push(watcher(app, moduleData));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;
};

var projectCycler_16 = projectCycler;

var requireCompilerDependencies;

requireCompilerDependencies = function(app) {
  var dep, list;

  // Load dependencies depending on what we will need based on the list of globally supported modules loaded from the modules

  // Set reference for easier readability/edits
  dep = app.globals.dependencies;
  list = app.globals.moduleList;

  //###############################
  /* Java Script dependencies */
  //###############################
  if (list.compilers.javaScript === true) {
    dep.rollup = require('gulp-better-rollup');
    dep.gulpBabel = require('gulp-babel');

    // Coffee script dependencies
    if (list.compilers.coffeeScript === true) {
      dep.rollupCoffeeScript = require('rollup-plugin-coffee-script');
    }
    // Babel dependencies
    if (list.compilers.babel === true || list.compilers.jsx === true) {
      dep.rollupBabel = require('rollup-plugin-babel');
    }

    // JSX dependencies (none special)

    // Type script dependencies
    if (list.compilers.typeScript === true) {
      dep.rollupTypeScript = require('rollup-plugin-typescript2');
    }
  }

  //###############################
  /*     CSS dependencies     */
  //###############################

  // Node Sass dependencies
  if (list.compilers.nodeSass === true) {
    dep.nodeSass = require('gulp-sass');
  }
  // Ruby Sass dependencies
  if (list.compilers.rubySass === true) {
    dep.rubySass = require('gulp-ruby-sass');
  }

  // Less dependencies
  if (list.compilers.less === true) {
    dep.less = require('gulp-less');
  }

  // Stylus dependencies
  if (list.compilers.stylus === true) {
    dep.stylus = require('gulp-stylus');
  }
  //###############################
  /*   Utility dependencies   */
  //###############################

  // Minify dependencies
  if (list.utilities.minify === true) {
    dep.gulpJSminify = require('gulp-uglify');
    dep.gulpCSSminify = require('gulp-clean-css');
  }

  // Concat dependencies
  if (list.utilities.concat === true) {
    dep.gulpConcat = require('gulp-concat');
  }
  // Source maps dependencies
  if (list.utilities.sourceMaps === true) {
    dep.gulpSourceMaps = require('gulp-sourcemaps');
  }
  // Auto prefix dependencies
  if (list.utilities.autoPrefixCSS === true) {
    dep.autoPrefixer = require('autoprefixer');
    return dep.gulpPostCss = require('gulp-postcss');
  }
};

var requireCompilerDependencies_17 = requireCompilerDependencies;

var watcherSwitch;

watcherSwitch = function(app, moduleData) {
  var compilerModule, watcherModule, watcherPath;

  // Get Chokidar dependency
  watcherModule = app.globals.dependencies.watcher;

  // Get compiler module
  compilerModule = app.gulpCompilers;

  // React to different inputs
  switch (moduleData.name) {
    //#####################
    /*  JS COMPILERS  */
    //#####################

    // Java script watcher
    case 'javaScript':
      // Set watcher path array
      watcherPath = [];

      // Add core path
      watcherPath.push(moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'javaScript/scripts');

      // Additional path
      watcherPath.push(watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder);

      // IF NOT supporting additional files
      if (moduleData.module.additionalFiles.support === false) {

        // Add watcher for javaScript module
        watcherModule.watch([watcherPath[0], '!' + watcherPath[1]], {
          ignoreInitial: true
        }).on('change', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScript');
        }).on('add', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('unlink', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('addDir', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('unlinkDir', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        });
      }

      // IF supporting additional files AND main ones
      if (moduleData.module.additionalFiles.support === true && moduleData.module.additionalFiles.onlyAdditional === false) {

        // Add watcher for javaScript AND javaScriptAdditional module
        watcherModule.watch(watcherPath[0], {
          ignoreInitial: true
        }).on('change', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScript');
        }).on('add', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('unlink', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('addDir', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        }).on('unlinkDir', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScriptRefresh');
        });
      }

      // IF supporting ONLY additional files
      if (moduleData.module.additionalFiles.support === true && moduleData.module.additionalFiles.onlyAdditional === true) {

        // Add watcher for javaScript AND javaScriptAdditional module
        return watcherModule.watch(watcherPath[1], {}).on('change', function(path, event) {
          return compilerModule._manager(app, moduleData, 'javaScript');
        });
      }
      break;
    //######################
    /*  CSS COMPILERS  */
    //######################

    // Ruby Sass watcher
    case 'rubySass':
      // Set watcher path array
      watcherPath = [];

      // Add core path
      watcherPath.push(moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'rubySass');

      // Additional path
      watcherPath.push(watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder);

      // Add watcher for rubySass module
      watcherModule.watch([watcherPath[0], '!' + watcherPath[1]], {}).on(['change'], function(path, event) {
        return compilerModule._manager(app, moduleData, 'rubySass');
      });

      // IF supporting additional files
      if (moduleData.module.additionalFiles.support === true) {
        // Additional ignore path
        watcherPath.push('!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder);

        // Add watcher for rubySass module - additional files
        return watcherModule.watch([watcherPath[1], watcherPath[2]], {}).on(['change'], function(path, event) {
          return compilerModule._manager(app, moduleData, 'rubySassAdditional', path);
        });
      }
      break;

    // Node Sass watcher
    case 'nodeSass':

      // Set watcher path array
      watcherPath = [];

      // Add core path
      watcherPath.push(moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'nodeSass');
      // Additional path
      watcherPath.push(watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder);

      // Add watcher for nodeSass module
      watcherModule.watch([watcherPath[0], '!' + watcherPath[1]], {}).on(['change'], function(path, event) {
        return compilerModule._manager(app, moduleData, 'nodeSass');
      });

      // IF supporting additional files
      if (moduleData.module.additionalFiles.support === true) {

        // Additional ignore path
        watcherPath.push('!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder);

        // Add watcher for nodeSass module - additional files
        return watcherModule.watch([watcherPath[1], watcherPath[2]], {}).on(['change'], function(path, event) {
          return compilerModule._manager(app, moduleData, 'nodeSassAdditional', path);
        });
      }
      break;

    // Less watcher
    case 'less':
      // Set watcher path array
      watcherPath = [];

      // Add core path
      watcherPath.push(moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'less');

      // Additional path
      watcherPath.push(watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder);

      // Add watcher for Less module
      watcherModule.watch([watcherPath[0], '!' + watcherPath[1]], {}).on(['change'], function(path, event) {
        return compilerModule._manager(app, moduleData, 'less');
      });

      // IF supporting additional files
      if (moduleData.module.additionalFiles.support === true) {
        // Additional ignore path
        watcherPath.push('!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder);

        // Add watcher for Less module - additional files
        return watcherModule.watch([watcherPath[1], watcherPath[2]], {}).on(['change'], function(path, event) {
          return compilerModule._manager(app, moduleData, 'lessAdditional', path);
        });
      }
      break;

    // Stylus watcher
    case 'stylus':
      // Set watcher path array
      watcherPath = [];

      // Add core path
      watcherPath.push(moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'stylus');

      // Additional path
      watcherPath.push(watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder);

      // Add watcher for Stylus module
      watcherModule.watch([watcherPath[0], '!' + watcherPath[1]], {}).on(['change'], function(path, event) {
        return compilerModule._manager(app, moduleData, 'stylus');
      });

      // IF supporting additional files
      if (moduleData.module.additionalFiles.support === true) {
        // Additional ignore path
        watcherPath.push('!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder);

        // Add watcher for Stylus module - additional files
        return watcherModule.watch([watcherPath[1], watcherPath[2]], {}).on(['change'], function(path, event) {
          return compilerModule._manager(app, moduleData, 'stylusAdditional', path);
        });
      }
  }
};

var watcherSwitch_18 = watcherSwitch;

var _manager$1;

_manager$1 = function(app, appModule, projectList) {
  // Check all supported modules and prepare them for loading (sets a global variable)
  appModule.moduleChecker(app, projectList);

  // Loads all needed dependencies depending on what we need
  appModule.requireCompilerDependencies(app);

  // Engage file watchers for each active project
  return appModule.projectCycler(app, appModule, projectList);
};

var _manager_19 = _manager$1;

var configCheck;

configCheck = function(app) {
  var buildCurrentConfig, config, configList, configString, configUpdated, defaults, setByPath, warningMessage;
  // Global for final notification
  configUpdated = false;
  warningMessage = '';
  // Get file content
  defaults = JSON.parse(app.globals.dependencies.fs.readFileSync('./webTemplateFiles/webTemplateConfig.default.json', 'utf-8'));
  config = JSON.parse(app.globals.dependencies.fs.readFileSync('./webTemplateConfig.json'));
  // Dynamically adds values to objects of multilevel depth
  setByPath = app.globalFunctions.gSetValueByPath;
  // Load current live config
  buildCurrentConfig = function() {
    var configList;
    configList = [];
    app.globals.dependencies.traverse(config).forEach(function(value) {
      var key;
      key = this.key;
      if (!key === !'undefined') {
        configList.push(key);
      }
    });
    return configList;
  };
  configList = buildCurrentConfig();
  // Compare life config with default config
  app.globals.dependencies.traverse(defaults).forEach(function(value) {
    var key, path, position;
    key = this.key;
    if (!key === !'undefined') {
      position = configList.indexOf(key);
      // Check if key of the JSON pair exists in the array made before
      if (position < 0) {
        configUpdated = true;
        //If it isn't in the array, add it to the object, then reload the array from the updated object
        path = this.path;
        setByPath(config, path, value);
        configList = buildCurrentConfig();
      }
    }
  });
  // Rewrite the config file at the end in case something was missing and print out the notification and console log
  if (configUpdated === true) {
    configString = JSON.stringify(config, null, 4);
    app.globals.dependencies.fs.writeFileSync('./webTemplateConfig.json', configString);
    warningMessage = 'Your main config file "webTemplateConfig.json" was missing some of the default keys and has been updated accordingly. Please modify it to your needs.\n';
  }
  // Set config as global so other parts of app can access it easily
  app.globals.config = config;
  return {
    warningMessage: warningMessage
  };
};

var configCheck_20 = configCheck;

var finalReport;

finalReport = function(warningMessage, freshUpdated) {
  if (warningMessage.length > 0) {
    console.log('    '.bgRed);
    console.log(warningMessage.red);
    console.log('    '.bgRed);
    console.log('');
  } else {
    console.log('    '.bgGreen);
    console.log('Start-up check complete. Found no errors. \nHappy coding!'.green);
    console.log('    '.bgGreen);
    console.log('');
  }
  if (freshUpdated.length > 0) {
    console.log('');
    console.log(freshUpdated.blue);
    return console.log('');
  }
};

var finalReport_21 = finalReport;

var installCheck;

installCheck = function(app) {
  var configExists, defaultFile, warningMessage;
  warningMessage = '';
  configExists = app.globals.dependencies.fs.existsSync('./webTemplateConfig.json');
  if (!configExists) {
    defaultFile = app.globals.dependencies.fs.readFileSync('./webTemplateFiles/webTemplateConfig.default.json', 'utf-8');
    app.globals.dependencies.fs.writeFileSync('./webTemplateConfig.json', defaultFile, 'utf-8');
    warningMessage = '"webTemplate.json" config file not found, loading defaults and creating a copy.\n';
  }
  return warningMessage;
};

var installCheck_22 = installCheck;

var projectsCheck;

projectsCheck = function(app, appModule) {
  var allStatuses, compareStatuses, config, countAllProject, countFilteredProjects, curProjectCheck, curProjectDirName, currentMessage, defaultConfig, freshUpdated, i, includedStatues, index, iterateThroughProjectLevel, len, project, projectArray, projectDir, warningMessage;
  config = app.globals.config;

  // Global string mesages
  warningMessage = '';
  freshUpdated = '';
  // Global vars to count all project and shown projects
  countAllProject = 0;
  countFilteredProjects = 0;
  //Load default config file in case we will need it later
  defaultConfig = app.globals.dependencies.fs.readFileSync('./webTemplateFiles/defaultProject/projectConfig.json', 'utf-8');
  defaultConfig = JSON.parse(defaultConfig);
  //Set array of project data for later use
  projectArray = [];
  // Set base level of projects
  projectDir = config.projectDirectory;
  // Set array of allowed project to process
  allStatuses = ['active', 'onhold', 'finished', 'canceled', 'fresh'];
  includedStatues = [];
  if (config.includeStatus.active === true) {
    includedStatues.push('active');
  }
  if (config.includeStatus.onhold === true) {
    includedStatues.push('onhold');
  }
  if (config.includeStatus.finished === true) {
    includedStatues.push('finished');
  }
  if (config.includeStatus.canceled === true) {
    includedStatues.push('canceled');
  }
  if (config.includeStatus.fresh === true) {
    includedStatues.push('fresh');
  }
  // Function to run through a project directory level
  iterateThroughProjectLevel = function(directoryPath) {
    var configExists, configPath, defaultString, i, index, len, project, projectConfig, projectObject, projects, removeFresh, results, returnBundle;
    //Get a list of projects
    projects = app.globals.dependencies.dirTree(directoryPath).children;
    results = [];
    // Check all project for the config file
    for (index = i = 0, len = projects.length; i < len; index = ++i) {
      project = projects[index];
      // Skip files, do only directories
      if (project.type === "directory") {

        //Remove the fresh status from a project at the end of a cycle unless it was just created
        removeFresh = true;
        // Fix derpy dirTree path formatting ( \\ instead of / )
        configPath = project.path.replace(/\\/g, "/");
        // Check if config file exists
        configExists = app.globals.dependencies.fs.existsSync(configPath + '/projectConfig.json');
        // If project config doesn't exists, build config file from default
        if (!configExists) {
          removeFresh = false;
          defaultString = JSON.stringify(defaultConfig, null, 4);
          app.globals.dependencies.fs.writeFileSync(configPath + '/projectConfig.json', defaultString, 'utf-8');
        }
        // Get the config file
        projectConfig = app.globals.dependencies.fs.readFileSync(configPath + '/projectConfig.json', 'utf-8');
        projectConfig = JSON.parse(projectConfig);
        // Check if the config file contains all data as default, if not, fix it
        returnBundle = appModule._projectCheck.projectConfigCheck(app, projectConfig, defaultConfig, configPath, removeFresh);
        warningMessage += returnBundle.warningMessage;
        freshUpdated += returnBundle.freshUpdated;
        // Reload config file with fixed content
        projectConfig = app.globals.dependencies.fs.readFileSync(configPath + '/projectConfig.json', 'utf-8');
        projectConfig = JSON.parse(projectConfig);
        // Check if the directory is a project or category
        if (projectConfig.isCategory === true) {
          // Run a sub-iteration of this function for the sub-level of directories
          results.push(iterateThroughProjectLevel(configPath));
        } else {
          // Add project to total project count
          countAllProject++;
          // Check if project applies for the status filter, if so, let it through
          if ((includedStatues.includes(projectConfig.status)) || !(allStatuses.includes(projectConfig.status))) {
            // Build a project array instance
            projectObject = {
              name: projectConfig.projectName,
              path: configPath,
              configPath: configPath + '/projectConfig.json',
              status: projectConfig.status,
              config: projectConfig
            };
            // Push it in the array
            projectArray.push(projectObject);
            // Add project to filtered project count
            results.push(countFilteredProjects++);
          } else {
            results.push(void 0);
          }
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  // Build the project list
  iterateThroughProjectLevel(projectDir);
  // Sort the list based on statuses
  compareStatuses = function(a, b) {
    var statusA, statusB, statusValue;
    // Set values for different statuses
    statusValue = function(status) {
      var value;
      value = 0;
      switch (status) {
        case 'fresh':
          return value = 5;
        case 'active':
          return value = 4;
        case 'onhold':
          return value = 2;
        case 'finished':
          return value = 1;
        case 'canceled':
          return value = 0;
        default:
          return value = 3;
      }
    };
    // Add values to statues and set global
    statusA = statusValue(a.status);
    statusB = statusValue(b.status);
    //Compare status values
    if (statusA > statusB) {
      return -1;
    }
    if (statusA < statusB) {
      return 1;
    }
  };
  projectArray.sort(compareStatuses);
  // Add empty line before the output
  console.log('');
  // Final log
  for (index = i = 0, len = projectArray.length; i < len; index = ++i) {
    project = projectArray[index];
    // Check if gulp was launched from a project level and if so, inform user from which one
    currentMessage = '';
    curProjectDirName = project.path.split("/").pop();
    curProjectCheck = process.env.INIT_CWD;
    curProjectCheck = curProjectCheck.split("\\").pop();
    curProjectCheck = project.name === curProjectCheck || curProjectDirName === curProjectCheck;
    if (curProjectCheck > 0) {
      currentMessage = app.globals.dependencies.colors.white(' - ') + app.globals.dependencies.colors.blue('current');
    }
    switch (project.status) {
      case 'fresh':
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.blue(project.status + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path))))));
        break;
      case 'active':
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.green(project.status + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path))))));
        break;
      case 'onhold':
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.yellow(project.status + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path))))));
        break;
      case 'canceled':
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.red(project.status + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path))))));
        break;
      case 'finished':
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.magenta(project.status + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path))))));
        break;
      default:
        console.log(app.globals.dependencies.colors.cyan(project.name + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.bgRed.black(project.status) + currentMessage + app.globals.dependencies.colors.white(' - ' + app.globals.dependencies.colors.white(project.path)))));
    }
  }
  // Add empty line After the output
  console.log('');
  // Print out the number of project total and shown + current filters
  console.log(app.globals.dependencies.colors.magenta('Showing ' + countFilteredProjects + ' filtered projects out of ' + countAllProject + ' total projects.'));
  console.log(app.globals.dependencies.colors.magenta('Allowed statuses for filtering*: ' + includedStatues.join(', ')));
  console.log('* also shows all non-standard statuses');
  // Add empty line After the output
  console.log('');
  return {
    projectArray: projectArray,
    warningMessage: warningMessage,
    freshUpdated: freshUpdated
  };
};

var projectsCheck_23 = projectsCheck;

var requireCoreDependencies;

requireCoreDependencies = function(app) {
  var dep;

  // Set reference for easier readability/edits
  dep = app.globals.dependencies;

  // Core
  dep.gulp = require('gulp');
  dep.fs = require('fs-extra');
  dep.path = require('path');
  dep.colors = require('colors');
  dep.traverse = require('traverse');
  dep.notify = require('node-notifier');
  dep.dirTree = require('directory-tree');
  dep.watcher = require('chokidar');
  // Gulp plugins
  dep.gulpCond = require('gulp-if-else');
  dep.gulpAdd = require('gulp-add-src');
  dep.gulpClean = require('gulp-clean-dest');
  dep.gulpParams = require('gulp-parameterized');
  dep.gulpPlumber = require('gulp-plumber');
  dep.gulpPlumberNofifier = require('gulp-plumber-notifier');
  dep.gulpRename = require('gulp-rename');
  dep.gulpTap = require('gulp-tap');
  dep.gulpBeautify = require('gulp-beautify');
};

var requireCoreDependencies_24 = requireCoreDependencies;

var _manager$2;

_manager$2 = function(app, appModule) {
  var freshUpdated, projectLogArray, returnBundle, warningMessage;
  warningMessage = '';
  appModule.requireCoreDependencies(app);
  // Check if the config file exists
  warningMessage += appModule.installCheck(app);
  // Check if the config file isn't missing any setting when compared to the default one
  returnBundle = appModule.configCheck(app);
  warningMessage += returnBundle.warningMessage;
  // Checks all project folders, loads needed dependencies and informs the user of project status and undefined projects
  returnBundle = appModule.projectsCheck(app, appModule);
  projectLogArray = returnBundle.projectArray;
  warningMessage += returnBundle.warningMessage;
  freshUpdated = returnBundle.freshUpdated;
  // Console summary report of all found bugs or problems
  appModule.finalReport(warningMessage, freshUpdated);
  // Set an array list of all registered projects as global
  app.globals.projectList = projectLogArray;
};

var _manager_25 = _manager$2;

var projectConfigCheck;

projectConfigCheck = function(app, projectConfig, defaultConfig, projectPath, removeFresh) {
  var buildCurrentConfig, config, configList, configPath, configString, configUpdated, defaults, freshUpdated, projectFolderName, setByPath, warningMessage;
  // Global string mesages
  warningMessage = '';
  freshUpdated = '';
  // Generate placeholder name for project if it doesn't have one
  projectFolderName = projectPath.split("/").pop();
  // Global for final notification
  configUpdated = false;
  // Get file content
  defaults = defaultConfig;
  config = projectConfig;
  // Dynamically adds values to objects of multilevel depth
  setByPath = app.globalFunctions.gSetValueByPath;
  // Load current live config
  buildCurrentConfig = function() {
    var configList;
    configList = [];
    app.globals.dependencies.traverse(config).forEach(function(value) {
      var key;
      // Fix for overlapping name entries
      key = this.path;
      key = key.join('.');
      if (!key === !'undefined') {
        configList.push(key);
      }
    });
    return configList;
  };
  configList = buildCurrentConfig();
  // Compare life config with default config
  app.globals.dependencies.traverse(defaults).forEach(function(value) {
    var key, path, position;
    key = this.path;
    key = key.join('.');
    if (!key === !'undefined') {
      position = configList.indexOf(key);
      // Check if key of the JSON pair exists in the array made before
      if (position < 0) {
        configUpdated = true;
        //If it isn't in the array, add it to the object, then reload the array from the updated object
        path = this.path;
        setByPath(config, path, value);
        configList = buildCurrentConfig();
      }
    }
  });
  // Check if default name is equal to current name
  if (config.projectName === defaults.projectName) {
    configUpdated = true;
    config.projectName = projectFolderName;
  }
  // Rewrite fresh status unless the project was just created
  if (removeFresh === true && config.status === 'fresh') {
    configUpdated = true;
    config.status = 'active';
    freshUpdated = 'Your fresh project "' + config.projectName + '" had it\'s status changes to "active".';
  }
  // Rewrite the config file at the end in case something was missing and print out the notification and console log
  if (configUpdated === true) {
    configPath = projectPath + '/projectConfig.json';
    configString = JSON.stringify(config, null, 4);
    app.globals.dependencies.fs.writeFileSync(configPath, configString);
    if (!config.status === !'fresh' && freshUpdated.length === 0) {
      warningMessage = '\nPROJECT: ' + config.projectName + '\n' + 'Your project config file was missing or had incomplete/corrupted data. Some of the keys and values has been updated accordingly. Please modify it to your needs. \n';
    }
  }
  return {warningMessage, freshUpdated};
};

var projectConfigCheck_26 = projectConfigCheck;

var _manager$3;

_manager$3 = function(command) {
  var app;

  //Self-reference to the parent app
  app = webTemplate;

  // React to diffent commands for the app
  switch (command) {

    // gulpStart module - Returns an array of objects (projects)
    case 'startUp':
      app.startUp._manager(app, app.startUp);
      break;

    // Process the project list
    case 'processProjects':
      app.projectProcessor._manager(app, app.projectProcessor, app.globals.projectList);
  }
};

var _manager_27 = _manager$3;

var exportObject = {
    globalFunctions: {
        gConsoleDebug: gConsoleDebug_1,
        gSetValueByPath: gSetValueByPath_2
    },
    globals: globals_3,
    gulpCompilers: {
        javaScript: javaScript_4,
        less: less_5,
        lessAdditional: lessAdditional_6,
        nodeSass: nodeSass_7,
        nodeSassAdditional: nodeSassAdditional_8,
        rubySass: rubySass_9,
        rubySassAdditional: rubySassAdditional_10,
        stylus: stylus_11,
        stylusAdditional: stylusAdditional_12,
        _javaScript: {
            buildImportsBundle: buildImportsBundle_13
        },
        _manager: _manager_14
    },
    projectProcessor: {
        moduleChecker: moduleChecker_15,
        projectCycler: projectCycler_16,
        requireCompilerDependencies: requireCompilerDependencies_17,
        watcherSwitch: watcherSwitch_18,
        _manager: _manager_19
    },
    startUp: {
        configCheck: configCheck_20,
        finalReport: finalReport_21,
        installCheck: installCheck_22,
        projectsCheck: projectsCheck_23,
        requireCoreDependencies: requireCoreDependencies_24,
        _manager: _manager_25,
        _projectCheck: {
            projectConfigCheck: projectConfigCheck_26
        }
    },
    _manager: _manager_27
};

return exportObject;

}());

// Set global var for the app in case we need to rena
let app = webTemplate;

// Set stuff up
app._manager('startUp');

// Turn on dev/debug mode
let debugSwitch = false;
app.globalFunctions.gConsoleDebug(debugSwitch);



// Run default after setup
app.globals.dependencies.gulp.task('default', function () {

   app._manager('processProjects');

});

//# sourceMappingURL=gulpfile.js.map
