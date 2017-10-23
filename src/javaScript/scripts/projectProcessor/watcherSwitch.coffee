watcherSwitch = (app, moduleData) ->
    
    # Get Chokidar dependency
    watcherModule = app.globals.dependencies.watcher
    
    # Get compiler module
    compilerModule = app.gulpCompilers
    
    # React to different inputs
    switch moduleData.name

        ######################
        ###  JS COMPILERS  ###
        ######################

        # Java script watcher
        when 'javaScript'

            # Set watcher path array
            watcherPath = []
            
            # Add core path
            watcherPath.push moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'javaScript/scripts'
            
            # Additional path
            watcherPath.push watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder
 
            # IF NOT supporting additional files
            if moduleData.module.additionalFiles.support is false
    
                # Add watcher for javaScript module
                watcherModule
                    .watch [watcherPath[0], '!'+watcherPath[1]], {ignoreInitial: true}
                    .on 'change', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScript'
                    .on 'add', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'unlink', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'addDir', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'unlinkDir', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                
            
            # IF supporting additional files AND main ones
            if moduleData.module.additionalFiles.support is true and moduleData.module.additionalFiles.onlyAdditional is false
    
                # Add watcher for javaScript AND javaScriptAdditional module
                watcherModule
                    .watch watcherPath[0], {ignoreInitial: true}
                    .on 'change', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScript'
                    .on 'add', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'unlink', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'addDir', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                    .on 'unlinkDir', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScriptRefresh'
                      
            # IF supporting ONLY additional files
            if moduleData.module.additionalFiles.support is true and moduleData.module.additionalFiles.onlyAdditional is true
    
                # Add watcher for javaScript AND javaScriptAdditional module
                watcherModule
                    .watch watcherPath[1], {}
                    .on 'change', (path, event) ->
                        compilerModule._manager app, moduleData, 'javaScript'

        #######################
        ###  CSS COMPILERS  ###
        #######################
            
        # Ruby Sass watcher
        when 'rubySass'

            # Set watcher path array
            watcherPath = []
            
            # Add core path
            watcherPath.push moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'rubySass'
            
            # Additional path
            watcherPath.push watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder
            
            # Add watcher for rubySass module
            watcherModule
                .watch [watcherPath[0], '!'+watcherPath[1]], {}
                .on ['change'], (path, event) ->
                    compilerModule._manager app, moduleData, 'rubySass'
            
            
            # IF supporting additional files
            if moduleData.module.additionalFiles.support is true

                # Additional ignore path
                watcherPath.push '!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder
                
                # Add watcher for rubySass module - additional files
                watcherModule
                    .watch [watcherPath[1],watcherPath[2]], {}
                    .on ['change'], (path, event) ->
                        compilerModule._manager app, moduleData, 'rubySassAdditional', path
    
            
        # Node Sass watcher
        when 'nodeSass'
            
            # Set watcher path array
            watcherPath = []
    
            # Add core path
            watcherPath.push moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'nodeSass'

            # Additional path
            watcherPath.push watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder
            
            # Add watcher for nodeSass module
            watcherModule
                .watch [watcherPath[0], '!'+watcherPath[1]], {}
                .on ['change'], (path, event) ->
                    compilerModule._manager app, moduleData, 'nodeSass'
            
            
            # IF supporting additional files
            if moduleData.module.additionalFiles.support is true
    
                # Additional ignore path
                watcherPath.push '!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder
                
                # Add watcher for nodeSass module - additional files
                watcherModule
                    .watch [watcherPath[1],watcherPath[2]], {}
                    .on ['change'], (path, event) ->
                        compilerModule._manager app, moduleData, 'nodeSassAdditional', path
            
        # Less watcher
        when 'less'

            # Set watcher path array
            watcherPath = []
            
            # Add core path
            watcherPath.push moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'less'
            
            # Additional path
            watcherPath.push watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder
            
            # Add watcher for Less module
            watcherModule
                .watch [watcherPath[0], '!'+watcherPath[1]], {}
                .on ['change'], (path, event) ->
                    compilerModule._manager app, moduleData, 'less'
            
            
            # IF supporting additional files
            if moduleData.module.additionalFiles.support is true

                # Additional ignore path
                watcherPath.push '!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder
                
                # Add watcher for Less module - additional files
                watcherModule
                    .watch [watcherPath[1],watcherPath[2]], {}
                    .on ['change'], (path, event) ->
                        compilerModule._manager app, moduleData, 'lessAdditional', path
        
            
        # Stylus watcher
        when 'stylus'

            # Set watcher path array
            watcherPath = []
            
            # Add core path
            watcherPath.push moduleData.path + '/' + moduleData.config.paths.srcFolder + '/' + 'stylus'
            
            # Additional path
            watcherPath.push watcherPath[0] + '/' + moduleData.module.additionalFiles.srcFolder
            
            # Add watcher for Stylus module
            watcherModule
                .watch [watcherPath[0], '!'+watcherPath[1]], {}
                .on ['change'], (path, event) ->
                   compilerModule._manager app, moduleData, 'stylus'
            
            
            # IF supporting additional files
            if moduleData.module.additionalFiles.support is true

                # Additional ignore path
                watcherPath.push '!' + watcherPath[1] + '/' + moduleData.module.additionalFiles.ignoreFolder
                
                # Add watcher for Stylus module - additional files
                watcherModule
                    .watch [watcherPath[1],watcherPath[2]], {}
                    .on ['change'], (path, event) ->
                        compilerModule._manager app, moduleData, 'stylusAdditional', path

export default watcherSwitch