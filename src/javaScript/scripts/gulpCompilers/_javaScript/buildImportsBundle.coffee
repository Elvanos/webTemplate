buildImportsBundle = (app, appModule, moduleData, srcPath) ->

    # Get dependencies
    dep = app.globals.dependencies
    
    # Set vars   
    srcFolderPath = srcPath + '/scripts'
    additionalFilesPath = moduleData.module.additionalFiles.srcFolder
    importPathFix = moduleData.path + '/'+ moduleData.config.paths.srcFolder + '/javaScript/scripts/'

    # Set the function that returns a file content for the auto import bundle
    buildMainJS = () ->
        
        # Get all files for import
        fileTree = dep.dirTree srcFolderPath
        
        # Set default string for opening and closing of the object
        objectHeader = 'var exportObject = {'
        objectFooter = '}; export default exportObject;'
        objectBody = ''
        
        # Prepare variables for generating imports
        importsString = ''
        uniqueId = 0
        
        # Generate imports and prepare them as string
        treeSearch = (treeLevel) ->
            treeLevel = treeLevel.children
            i = 0
            len = treeLevel.length
            while i < len
                
                # Excluded
                if treeLevel[i].name is '.babelrc' or treeLevel[i].name is additionalFilesPath or treeLevel[i].name is 'importsBundle.js' or treeLevel[i].name is 'manualBundle.js'
                    i++
                    continue
                # If directory
                if treeLevel[i].type == 'directory'
                    # Build object
                    objectBody += treeLevel[i].name + ' :{'
                    treeSearch treeLevel[i]
                    objectBody += '},'
                # If file
                if treeLevel[i].type == 'file'
                    
                    uniqueId++
                    
                    # Build object
                    fileName = treeLevel[i].name
                    fileName = fileName.replace(treeLevel[i].extension, '')
                    objectBody += fileName + ' :' + fileName + '_' + uniqueId + ','
                    
                    # Build import list
                    importPath = treeLevel[i].path
                    
                    # Check if all files are formatted properly, if not, wrap them properly so we dont end up generating errors
                    fileContents = dep.fs.readFileSync(importPath, 'utf8')
                    
                    if fileContents.indexOf('export default') is -1
                        
                        prefix = ''
                        suffix = ''
                        
                        # React to different file types
                        if treeLevel[i].extension is '.js' or treeLevel[i].extension is '.jsx' or treeLevel[i].extension == '.ts'
                            prefix = 'let ' + fileName + ' = function () {\n\n'
                            suffix = '};\nexport default ' + fileName + ';'
                            
                        if treeLevel[i].extension is '.coffee'
                            prefix = fileName + ' = () ->\n\n'
                            suffix = 'export default ' + fileName
                            
                        fileContents = prefix + fileContents + suffix
                        dep.fs.writeFileSync importPath, fileContents, 'utf8'
                        
                    # Fix backslashes
                    importPath = importPath.replace(/\\/g, '/')
                    
                    # Fix pathing for imports
                    importPath = importPath.replace(importPathFix, '')
                    
                    # Add file to import string
                    importsString += 'import ' + fileName + '_' + uniqueId + ' from \'./scripts/' + importPath + '\';'
                    
                i++
                
            return
        
        treeSearch fileTree
        importsString + objectHeader + objectBody + objectFooter

    fileContent = buildMainJS()
    dep.fs.writeFileSync srcPath + '/importsBundle.js', fileContent

export default buildImportsBundle