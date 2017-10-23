_manager = (app, config, command, path) ->

    appModule = app.gulpCompilers
    
    switch command
        
        ######################
        ###  JS COMPILERS  ###
        ######################
        
        # Run JS Compiler
        when 'javaScript'
            appModule.javaScript app, appModule ,config
            
        # Refrssh imports bundle on added files
        when 'javaScriptRefresh'
            srcPath = config.path + '/' + config.config.paths.srcFolder + '/' + 'javaScript/'
            appModule._javaScript.buildImportsBundle app, appModule , config, srcPath
    
        #######################
        ###  CSS COMPILERS  ###
        #######################
        
        
        # Run nodeSass compiler
        when 'nodeSass'
            appModule.nodeSass app, appModule ,config

        # Run nodeSassAdditional compiler
        when 'nodeSassAdditional'
            appModule.nodeSassAdditional app, appModule ,config, path

        # Run rubySass compiler
        when 'rubySass'
            appModule.rubySass app, appModule ,config

        # Run rubySassAdditional compiler
        when 'rubySassAdditional'
            appModule.rubySassAdditional app, appModule ,config, path

        # Run less compiler
        when 'less'
            appModule.less app, appModule ,config

        # Run lessAdditional compiler
        when 'lessAdditional'
            appModule.lessAdditional app, appModule ,config, path

        # Run stylus compiler
        when 'stylus'
            appModule.stylus app, appModule ,config

        # Run stylusAdditional compiler
        when 'stylusAdditional'
            appModule.stylusAdditional app, appModule ,config, path
    
            
export default _manager