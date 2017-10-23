moduleLoader = (app,projectList) ->

    # Get module list
    moduleList = app.globals.moduleList

    # Check which modules to load
    for project in projectList

        # Set compilers vars for easier readability
        config = project.config.modules.compilers
        
        #######################
        ### Check compilers ###
        #######################
    

        # If Java Script support
        if config.javaScript.support is true
            moduleList.compilers.javaScript = true
            
            # If Coffee Script support
            if config.javaScript.modules.coffeeScript.support is true
                moduleList.compilers.coffeeScript = true
                
            # If Type Script support
            if config.javaScript.modules.typeScript.support is true
                moduleList.compilers.typeScript = true

            # If JSX support
            if config.javaScript.modules.jsx.support is true
                moduleList.compilers.jsx = true
    
            # If Babel support
            if config.javaScript.modules.babel.support is true
                moduleList.compilers.babel = true
                
                
        # If CSS compiler support
        if config.cssPreprocessors.support is true

            # If Node Sass support
            if config.cssPreprocessors.modules.nodeSass.support is true
                moduleList.compilers.nodeSass = true
            
            # If Ruby Sass support
            if config.cssPreprocessors.modules.rubySass.support is true
                moduleList.compilers.rubySass = true
            
            # If Less support
            if config.cssPreprocessors.modules.less.support is true
                moduleList.compilers.less = true
            
            # If Stylus support
            if config.cssPreprocessors.modules.stylus.support is true
                moduleList.compilers.stylus = true
    
    
        #######################
        ### Check Utilities ###
        #######################
        
        # If Java Script support
        if config.javaScript.support is true

            # If Source Map support
            if config.javaScript.sourceMaps is true
                moduleList.utilities.sourceMaps = true
            
            # If Minify support
            if config.javaScript.allowMinify.support is true
                moduleList.utilities.minify = true
            
            # If Concat support
            if config.javaScript.additionalFiles.support is true
                moduleList.utilities.concat = true
        
        
        # If CSS compiler support
        if config.cssPreprocessors.support is true

            # If Node Sass support
            if config.cssPreprocessors.modules.nodeSass.support is true
                moduleList.compilers.nodeSass = true
                
                # If Source Map support
                if config.cssPreprocessors.modules.nodeSass.sourceMaps is true
                    moduleList.utilities.sourceMaps = true
                    
                # If Glob Sass support
                if config.cssPreprocessors.modules.nodeSass.modules.globSass is true
                    moduleList.utilities.globNodeSass = true
    
                # If Auto Prefix support
                if config.cssPreprocessors.modules.nodeSass.modules.autoPrefix is true
                    moduleList.utilities.autoPrefixCSS = true
            
                # If Minify support
                if config.cssPreprocessors.modules.nodeSass.allowMinify.support is true
                    moduleList.utilities.minify = true
            
            # If Ruby Sass support
            if config.cssPreprocessors.modules.rubySass.support is true
                moduleList.compilers.rubySass = true
    
                # If Source Map support
                if config.cssPreprocessors.modules.rubySass.sourceMaps is true
                    moduleList.utilities.sourceMaps = true
    
                # If Auto Prefix support
                if config.cssPreprocessors.modules.rubySass.modules.autoPrefix is true
                    moduleList.utilities.autoPrefixCSS = true
    
                # If Minify support
                if config.cssPreprocessors.modules.rubySass.allowMinify.support is true
                    moduleList.utilities.minify = true
            
            # If Less support
            if config.cssPreprocessors.modules.less.support is true
                moduleList.compilers.less = true
    
                # If Source Map support
                if config.cssPreprocessors.modules.less.sourceMaps is true
                    moduleList.utilities.sourceMaps = true
               
                # If Auto Prefix support
                if config.cssPreprocessors.modules.less.modules.autoPrefix is true
                    moduleList.utilities.autoPrefixCSS = true
    
                # If Minify support
                if config.cssPreprocessors.modules.less.allowMinify.support is true
                    moduleList.utilities.minify = true
            
            # If Stylus support
            if config.cssPreprocessors.modules.stylus.support is true
                moduleList.compilers.stylus = true
    
                # If Source Map support
                if config.cssPreprocessors.modules.stylus.sourceMaps is true
                    moduleList.utilities.sourceMaps = true
    
                # If Auto Prefix support
                if config.cssPreprocessors.modules.stylus.modules.autoPrefix is true
                    moduleList.utilities.autoPrefixCSS = true
    
                # If Minify support
                if config.cssPreprocessors.modules.stylus.allowMinify.support is true
                    moduleList.utilities.minify = true
    
    
        #######################
        ### Check Custom    ###
        #######################
    
        # If Java Script support
        if config.javaScript.support is true

            # If Build helper support
            if config.javaScript.buildHelper.support is true
            
                # If Build helper - Auto Fix
                if config.javaScript.buildHelper.autoFix.support is true
    
                    # If Build helper - Auto Fix - Fix new files
                    if config.javaScript.buildHelper.autoFix.modules.fixNewFiles is true
                        moduleList.custom.fixNewFilesJS = true
                
                # If Build helper - Auto Build
                if config.javaScript.buildHelper.autoBuild.support is true

                    moduleList.custom.autoBuild = true
                    
    
    return

export default moduleLoader