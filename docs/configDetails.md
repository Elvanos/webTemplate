## README Content
1. [webTemplateConfig.json](#webTemplateConfigjson)
2. [projectConfig.json](#projectConfigjson)  


# webTemplateConfig.json

Main settings file of the whole webTemplate. Only one belongs in the whole directory structure and needs to be placed in the core "webTemplate" directory.

* Example file & explanations
```json
{
    "name": "webTemplate",
    "projectDirectory": "projects",
    "includeStatus": {
        "active": true,
        "onhold": true,
        "finished": false,
        "canceled": false,
        "fresh": true
    },
    "allowOnlyOnCurrent": false
}
```
* name (string) - name of the project manager, you can edit this, but it is suggested not to
* projectDirectory (string) - the folder to store your projects at
* includeStatus - all project status that should be watched by webTemplate, by default only fresh, active and onhold get watched
    * active (true/false)
    * onhold (true/false)
    * finished (true/false)
    * canceled (true/false)
    * fresh (true/false)
* allowOnlyOnCurrent (true/false) - if your run webTemplate from a sub-folder of a particular project, that project directory gets marked as "current" for the particular run session. If this is allowed, webTemplate will interact only with that particular directory and ignore all else. If this is allowed and NO project is marked as "current" then nothing will be processed at all in any way. 


#projectConfig.json

Main config file of each of your projects. Belongs to the core directory of each of your singular projects.
Also note that each of sub-categories needs to have one of these to determine it is a category.

* Example file & explanations
```json
{
   "projectName": "webTemplateProject",
   "status": "fresh",
   "isCategory": false,
   "paths": {
      "srcFolder": "src",
      "distFolder": "dist"
   },
   "modules": {
      "compilers": {
         "javaScript": {
            "support": true,
            "sourceMaps": false,
            "outputToRoot": false,
            "distName": "layout",
            "reporting": {
               "notification": true,
               "console": true
            },
            "allowMinify": {
               "support": true,
               "allowMain": true,
               "separateFiles": true
            },
            "buildHelper": {
               "support": true,
               "autoFix": {
                  "support": true,
                  "modules": {
                     "fixNewFiles": true
                  }
               },
               "autoBuild": {
                  "support": true
               }
            },
            "additionalFiles": {
               "support": true,
               "overWriteOriginal": false,
               "onlyAdditional": false,
               "srcFolder": "_additionalFiles",
               "reporting": {
                  "notification": true,
                  "console": true
               },
               "allowMinify": {
                  "support": true
               }
            },
            "modules": {
               "coffeeScript": {
                  "support": true
               },
               "typeScript": {
                  "support": true
               },
               "jsx": {
                  "support": true
               },
               "babel": {
                  "support": true
               }
            }
         },
         "cssPreprocessors": {
            "support": true,
            "modules": {
               "nodeSass": {
                  "support": true,
                  "distName": "layout_nodeSass",
                  "sourceMaps": true,
                  "reporting": {
                     "notification": true,
                     "console": true
                  },
                  "allowMinify": {
                     "support": true,
                     "allowMain": true,
                     "separateFiles": true,
                     "level": 2
                  },
                  "additionalFiles": {
                     "support": true,
                     "srcFolder": "_additionalFiles",
                     "ignoreFolder": "_ignore",
                     "reporting": {
                        "notification": true,
                        "console": true
                     }
                  },
                  "modules": {
                     "globSass": true,
                     "autoPrefix": true
                  }
               },
               "rubySass": {
                  "support": true,
                  "distName": "layout_rubySass",
                  "sourceMaps": true,
                  "reporting": {
                     "notification": true,
                     "console": true
                  },
                  "allowMinify": {
                     "support": true,
                     "allowMain": true,
                     "separateFiles": true,
                     "level": 2
                  },
                  "additionalFiles": {
                     "support": true,
                     "srcFolder": "_additionalFiles",
                     "ignoreFolder": "_ignore",
                     "reporting": {
                        "notification": true,
                        "console": true
                     }
                  },
                  "modules": {
                     "autoPrefix": true
                  }
               },
               "less": {
                  "support": false,
                  "distName": "layout_less",
                  "sourceMaps": true,
                  "reporting": {
                     "notification": true,
                     "console": true
                  },
                  "allowMinify": {
                     "support": true,
                     "allowMain": true,
                     "separateFiles": true,
                     "level": 2
                  },
                  "additionalFiles": {
                     "support": true,
                     "srcFolder": "_additionalFiles",
                     "ignoreFolder": "_ignore",
                     "reporting": {
                        "notification": true,
                        "console": true
                     }
                  },
                  "modules": {
                     "autoPrefix": true
                  }
               },
               "stylus": {
                  "support": false,
                  "distName": "layout_stylus",
                  "sourceMaps": true,
                  "reporting": {
                     "notification": true,
                     "console": true
                  },
                  "allowMinify": {
                     "support": true,
                     "allowMain": true,
                     "separateFiles": true,
                     "level": 2
                  },
                  "additionalFiles": {
                     "support": true,
                     "srcFolder": "_additionalFiles",
                     "ignoreFolder": "_ignore",
                     "reporting": {
                        "notification": true,
                        "console": true
                     }
                  },
                  "modules": {
                     "autoPrefix": true
                  }
               }
            }
         }
      }
   }
}
```
* projectName (string) - Name of your project
* status (string) - Status of your project
    * Allowed values - fresh, active, onhold, finished, canceled
* isCategory (true/false) - determines if the directory should be treated as category or as a single project
* paths 
    * srcFolder (string) - path to your source directory
    * distFolder  (string) - path to your distribution (output) directory
    
* modules - list of available modules for the project
    * compilers - list of available compilers for the project
        * javaScript
            * support (true/false) - if the module is on or off for the particular project
            * sourceMaps (true/false) - if source maps will be generated for the module or not
            * outputToRoot (true/false) - if you need to generate the dist files to the root project directory
            * distName (string) - name of the JS file generated out of the compilers
            * reporting - custom reporting for the compilers
                * notification (true/false) - OS native popups on successful compile
                * console (true/false) - console logging of successful compile
            * allowMinify - minification support for the JS compilers
                * support (true/false) - if the module is on or off for the particular project
                * allowMain (true/false) - if the main JS file will be minified
                * separateFiles (true/false) - if additional JS files will be minified
            * buildHelper - custom helped with JS compilation/building of files 
                * support (true/false) - if the module is on or off for the particular project
                * autoFix - automatically formats newly created files to help you code
                    * support (true/false) - if the module is on or off for the particular project
                    * modules
                        * fixNewFiles (true/false) - if the fixing is on or off
                * autoBuild - automatically build the export file so you dont have to worry about that
                    * support (true/false) - if the module is on or off for the particular project
            * additionalFiles - settings for separate files that are part of the main bundle
                * support (true/false) - if the module is on or off for the particular project
                * overWriteOriginal (true/false) - if you with for a singular output (just one JS file) without the midstep of Rollup compile and then the concatenated bundle, set this to true
                * onlyAdditional (true/false) - if true, then the module will process only the additional files, ignoring the main bundle
                * srcFolder (string) - source path for the additional files 
                * reporting - custom reporting for the compilers
                    * notification (true/false) - OS native popups on successful compile
                    * console (true/false) - console logging of successful compile
                * allowMinify - minification support for the JS compilers
                    * support (true/false) - if the module is on or off for the particular project
        * cssPreprocessors
            * support (true/false) - if the module is on or off for the particular project
            * modules - list of available modules for the project
                * nodeSass, rubySass, less, stylus
                    * support (true/false) - if the module is on or off for the particular project
                    * distName (string) - name of the CSS file generated out of the compilers
                    * sourceMaps (true/false) - if source maps will be generated for the module or not
                    * reporting - custom reporting for the compilers
                        * notification (true/false) - OS native popups on successful compile
                        * console (true/false) - console logging of successful compile
                    * allowMinify - minification support for the compiler
                        * support (true/false) - if the module is on or off for the particular project
                        * allowMain (true/false) - if the main file will be minified
                        * separateFiles (true/false) - if additional files will be minified
                        * level (0,1,2) - different Clean CSS optimization levels, read more about them in Clean CSS docs
                    * additionalFiles - settings for separate files that get compiler separately from the main bundle
                        * support (true/false) - if the module is on or off for the particular project
                        * srcFolder (string) - source path for the additional files 
                        * ignoreFolder (string) - subfolder of "srcFolder", files in this one will not be rendered and the watcher will ignore them entirely (for example css libraries or variable files)
                        * reporting - custom reporting for the compilers
                            * notification (true/false) - OS native popups on successful compile
                            * console (true/false) - console logging of successful compile
                    * modules - list of available modules for particular compiler            
                        * autoPrefix (true/false) - if post-css autoprefix should process all files or not