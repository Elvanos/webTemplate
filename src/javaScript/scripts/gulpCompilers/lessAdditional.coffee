lessAdditional = (app,appModule,moduleData, path) ->
    
    # Set task name
    taskName = 'lessAdditional'
    
    # Get dependencies
    dep = app.globals.dependencies
    
    # Get current file name
    fileName = dep.path.basename path
    fileName = fileName.replace(dep.path.extname(path), "")
    
    # SRC path
    srcPathMain = path
    
    # DIST path
    distPathMain =  moduleData.path + '/' + moduleData.config.paths.distFolder + '/css'
    
    # Less config
    lessConfig = {}
    
    #Get IF values
        
    # If Source Maps
    ifSourceMaps = moduleData.module.sourceMaps
    
    # If AutoPrefixer
    ifAutoPrefixer = moduleData.module.modules.autoPrefix
    
    # If minify CSS
    if moduleData.module.allowMinify.support is true and moduleData.module.allowMinify.separateFiles is true
        ifMinify = true
        cssMinifyLevel = moduleData.module.allowMinify.level
    
    # Set up gulp task
    dep.gulp.task taskName, (done) ->
        
        stream = dep.gulp
        
            # Load files
            .src srcPathMain
        
            # Load possible error reports
            .pipe dep.gulpPlumberNofifier()
          
            # Load Less with config
            .pipe dep.less lessConfig
        
            # Load sourcemaps if supported
            .pipe dep.gulpCond ifSourceMaps is true, () ->
                return dep.gulpSourceMaps.init {
                    largeFile: true
                }
                
            # Load autoprefixer if supported
            .pipe dep.gulpCond ifAutoPrefixer is true, () ->
                return dep.gulpPostCss [dep.autoPrefixer()]
          
            # Write sourcemap if supported
            .pipe dep.gulpCond ifSourceMaps is true, () ->
                return dep.gulpSourceMaps.write '',{
                    includeContent: false
                    sourceRoot: srcPathMain
                }
            
            # Output files
            .pipe dep.gulp.dest distPathMain
    
            # Load minify if supported
            .pipe dep.gulpCond ifMinify is true, () ->
                return dep.gulpCSSminify {level: cssMinifyLevel}
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
                    if moduleData.module.additionalFiles.reporting.notification is true
                        dep.notify.notify
                            title: moduleData.config.projectName + ' - '+ taskName,
                            message: fileName + '.' + fileExtension + ' file successfully compiled!',
                            sound: false
                    
                    # Check console settings
                    if moduleData.module.additionalFiles.reporting.console is true
                        console.log dep.colors.blue moduleData.config.projectName + ' - '+ taskName
                        console.log dep.colors.green fileName + '.' + fileExtension + ' file successfully compiled!'
                        
        # Cleanup after the task
        stream.on 'finish', () ->
            
            # Clean extra map files
            extramapFilePath = distPathMain + '/' + fileName + '.css.min.map'
            extraMapFileExists = dep.fs.existsSync extramapFilePath
            if extraMapFileExists is true
                dep.fs.unlinkSync extramapFilePath
    
    # Start the task
    dep.gulp.start taskName
    
    
    return
    
export default lessAdditional