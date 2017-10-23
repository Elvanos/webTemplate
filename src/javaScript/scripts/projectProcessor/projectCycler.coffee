projectCycler = (app, appModule, projectList) ->
    
    dep = app.globals.dependencies
    
    # Warn user that we are running in only current project mode
    if app.globals.config.allowOnlyOnCurrent is true
        console.log dep.colors.yellow 'The application is running in "current project" mode. Only project from whose directory gulp was called will be processed.'
    
    # Load watcher function
    watcher = appModule.watcherSwitch

    for project in projectList
        
        # Check if project is current
        curProjectDirName = project.path.split("/").pop()
        curProjectCheck = process.env.INIT_CWD
        curProjectCheck = curProjectCheck.split("\\").pop()
        curProjectCheck = project.name is curProjectCheck or curProjectDirName is curProjectCheck
    
        # Check if we are running the app for only current project or for all that went through the load filter
        if app.globals.config.allowOnlyOnCurrent is false or curProjectCheck > 0
            
            #Load project config
            config = project.config
            
            # Set var for easier access to project path
            path = project.path
            
            
            # Run watcher for JS
            if config.modules.compilers.javaScript.support is true
                
                moduleData =
                    module: config.modules.compilers.javaScript
                    name: 'javaScript'
                    path: path
                    config: config
                
                watcher app, moduleData
            
                
            # Run watches for CSS
            if config.modules.compilers.cssPreprocessors.support is true
            
                # Run watcher for Ruby Sass
                if config.modules.compilers.cssPreprocessors.modules.rubySass.support is true
        
                    moduleData =
                        module: config.modules.compilers.cssPreprocessors.modules.rubySass
                        name: 'rubySass'
                        path: path
                        config: config
    
                    watcher app, moduleData
                    
                
                # Run watcher for Node Sass
                if config.modules.compilers.cssPreprocessors.modules.nodeSass.support is true
    
                    moduleData =
                        module: config.modules.compilers.cssPreprocessors.modules.nodeSass
                        name: 'nodeSass'
                        path: path
                        config: config
                
                    watcher app, moduleData
                
                # Run watcher for Less
                if config.modules.compilers.cssPreprocessors.modules.less.support is true
    
                    moduleData =
                        module: config.modules.compilers.cssPreprocessors.modules.less
                        name: 'less'
                        path: path
                        config: config
    
                    watcher app, moduleData
                
                # Run watcher for Stylus
                if config.modules.compilers.cssPreprocessors.modules.stylus.support is true
    
                    moduleData =
                        module: config.modules.compilers.cssPreprocessors.modules.stylus
                        name: 'stylus'
                        path: path
                        config: config
    
                    watcher app, moduleData
            

export default projectCycler