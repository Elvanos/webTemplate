javaScript = (app,appModule,moduleData) ->
    
    # Set task name
    taskName = 'javaScript'
    
    # Get dependencies
    dep = app.globals.dependencies
    
    # Clear TS cache, because it is buggy as hell
    if dep.fs.existsSync './.rpt2_cache'
        dep.fs.removeSync './.rpt2_cache'
    
    # SRC path
    srcPath =  moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'javaScript/'
    
    # SRC path additional files
    srcPathAdditional = srcPath + 'scripts/' + moduleData.module.additionalFiles.srcFolder + '/*.js'
    
    # IF Auto Build is on, use auto bundle, otherwise use the manual one
    if moduleData.module.buildHelper.support is true and moduleData.module.buildHelper.autoBuild.support is true
        
        # Check files for proper formatting
        
        
        # Run importsBundle builder
        appModule._javaScript.buildImportsBundle app, appModule, moduleData, srcPath
    
        # Set SRC Path
        srcPathMain = srcPath + 'importsBundle.js'
        
    else
        
        # Set SRC Path
        srcPathMain = srcPath + 'manualBundle.js'
        
    # DIST path
    distPathMain =  moduleData.path + '/' + moduleData.config.paths.distFolder + '/js'
    
    # IF dist to root
    if moduleData.module.outputToRoot
        distPathMain = moduleData.path
    
    # DIST file name
    distFileNameMain = moduleData.module.distName
    
    # Rollup config
    rollupConfig = {}
    rollupFormat = 'iife'
    
    # Rollup plugins
    rollupPlugins = []
    rollupPlugins.push dep.rollupBabel()

    # If Coffee Script support
    if moduleData.module.modules.coffeeScript.support is true
        rollupPlugins.push dep.rollupCoffeeScript()
    
    # If Type Script support
    if moduleData.module.modules.typeScript.support is true
        rollupPlugins.push dep.rollupTypeScript()
    
    # If additional files
    ifAdditionalFiles = false
    if moduleData.module.additionalFiles.support is true
        ifAdditionalFiles = true
    
        # If additional files override main
        ifAdditionalFilesOverride = '.concat'
        if moduleData.module.additionalFiles.overWriteOriginal is true
            ifAdditionalFilesOverride = ''
        
    # If NOT main
    ifMainFiles = true
    if moduleData.module.additionalFiles.support is true and moduleData.module.additionalFiles.onlyAdditional is true
        ifMainFiles = false
    
    #gulpBabelConfig
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
            [
                "react"
            ]
        ],
        "plugins": [
            "external-helpers"
        ]
    }
    
    #Get IF values
    
    # If minify
    if moduleData.module.allowMinify.support is true and moduleData.module.allowMinify.allowMain is true
        ifMinify = true
        
    # If minify Additional
    if moduleData.module.allowMinify.support is true and moduleData.module.allowMinify.separateFiles is true
        ifMinifyAdditional = true

    # If Source Maps
    ifSourceMaps = moduleData.module.sourceMaps
    
    # Set up gulp task
    dep.gulp.task taskName, (done) ->
        
        stream = dep.gulp.src('nonExistingFile')
        
            # Load Main files
            .pipe dep.gulpCond ifMainFiles is true, () ->
                return dep.gulpAdd srcPathMain
        
            # Load possible error reports
            .pipe dep.gulpPlumberNofifier()

            # Load sourcemaps if supported
            .pipe dep.gulpCond ifSourceMaps is true, () ->
                return dep.gulpSourceMaps.init {
                    largeFile: true
                }
    
            .pipe dep.rollup {
                moduleName: moduleData.config.projectName.replace(/[- ]/g, '')
                cache: true
                onwarn: (warning) ->
                    
                    # Skip glitchy warnings
                    if warning.code is 'THIS_IS_UNDEFINED'
                        return
                    else
                        console.warn warning.message
                        
                plugins: rollupPlugins
                }, rollupFormat

            
            # Rename output file to config value
            .pipe dep.gulpRename distFileNameMain + ".js"

            # Write sourcemap if supported
            .pipe dep.gulpCond ifSourceMaps is true, () ->
                return dep.gulpSourceMaps.write '',{
                    includeContent: false
                    sourceRoot: srcPathMain
                }
                
            # Compile output to supported browser JS with babel
            .pipe dep.gulpBabel gulpBabelConfig
            
            # Output files
            .pipe dep.gulp.dest distPathMain
            
            # Output also the minified files IF minify is allowed
            .pipe dep.gulpCond ifMinify is true, () ->
                return dep.gulpJSminify()
            .pipe dep.gulpCond ifMinify is true, () ->
                return dep.gulpRename {suffix: '.min'}
            .pipe dep.gulpCond ifMinify is true, () ->
                return dep.gulp.dest distPathMain
           
            # Report positive result in console and notification if supported
            .pipe dep.gulpTap (file) ->
                fileExtension = dep.path.extname(file.path).substr(1)
                
                # Do not log for map and min files
                if fileExtension isnt 'map' and fileExtension isnt 'min'
                   
                    # Check notification settings
                    if moduleData.module.reporting.notification is true
                        dep.notify.notify
                            title: moduleData.config.projectName + ' - '+ taskName + 'Additional',
                            message: distFileNameMain + '.' + fileExtension + ' file successfully compiled!',
                            sound: false
                    
                    # Check console settings
                    if moduleData.module.reporting.console is true
                        console.log dep.colors.blue moduleData.config.projectName + ' - '+ taskName + 'Additional'
                        console.log dep.colors.green distFileNameMain + '.' + fileExtension + ' file successfully compiled!'


            # Load concat files if Additional files
            .pipe dep.gulpCond ifAdditionalFiles is true, () ->
                return dep.gulpAdd.append srcPathAdditional
            
            # Concat files if Additional files
            .pipe dep.gulpCond ifAdditionalFiles is true, () ->
                return dep.gulpConcat distFileNameMain + ifAdditionalFilesOverride + '.js'
            
            # Compile with Babel if Additional files
            .pipe dep.gulpCond ifAdditionalFiles is true, () ->
                return dep.gulpBabel gulpBabelConfig
            
            # Output file if additional files
            .pipe dep.gulpCond ifAdditionalFiles is true, () ->
                return dep.gulp.dest distPathMain

            # Output also the minified files IF minify is allowed
            .pipe dep.gulpCond ifAdditionalFiles is true and ifMinifyAdditional is true, () ->
                return dep.gulpJSminify()
            .pipe dep.gulpCond ifAdditionalFiles is true and ifMinifyAdditional is true, () ->
                return dep.gulpRename {suffix: '.min'}
            .pipe dep.gulpCond ifAdditionalFiles is true and ifMinifyAdditional is true, () ->
                return dep.gulp.dest distPathMain

            # Report positive result in console and notification if supported
            .pipe dep.gulpCond ifAdditionalFiles is true, () ->
                return dep.gulpTap (file) ->
                    fileExtension = dep.path.extname(file.path).substr(1)
    
                    # Do not log for map and min files
                    if fileExtension isnt 'map' and fileExtension isnt 'min'
        
                    # Check notification settings
                        if moduleData.module.reporting.notification is true
                            dep.notify.notify
                                title: moduleData.config.projectName + ' - '+ taskName,
                                message: distFileNameMain + '.concat.' + fileExtension + ' file successfully compiled!',
                                sound: false
                
                        # Check console settings
                        if moduleData.module.reporting.console is true
                            console.log dep.colors.blue moduleData.config.projectName + ' - '+ taskName
                            console.log dep.colors.green distFileNameMain + ifAdditionalFilesOverride + fileExtension + ' file successfully compiled!'
           
    
    # Start the task
    dep.gulp.start taskName
    
    
    return
    
export default javaScript