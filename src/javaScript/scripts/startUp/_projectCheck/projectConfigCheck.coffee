projectConfigCheck = (app,projectConfig,defaultConfig,projectPath,removeFresh) ->

    # Global string mesages
    warningMessage = ''
    freshUpdated = ''

    # Generate placeholder name for project if it doesn't have one
    projectFolderName = projectPath.split("/").pop()

    # Global for final notification
    configUpdated = false

    # Get file content
    defaults = defaultConfig
    config = projectConfig

    # Dynamically adds values to objects of multilevel depth
    setByPath = app.globalFunctions.gSetValueByPath

    # Load current live config
    buildCurrentConfig = () ->
        configList = []
        app.globals.dependencies.traverse config
            .forEach (value) ->

                # Fix for overlapping name entries
                key = this.path
                key = key.join '.'

                if not key is not 'undefined'
                    configList.push key
                return

        return configList

    configList = buildCurrentConfig()

    # Compare life config with default config
    app.globals.dependencies.traverse defaults
        .forEach (value) ->
            key = this.path
            key = key.join '.'

            if not key is not 'undefined'

                position = configList.indexOf key

                # Check if key of the JSON pair exists in the array made before
                if position < 0

                    configUpdated = true

                    #If it isn't in the array, add it to the object, then reload the array from the updated object
                    path = this.path
                    setByPath config, path, value
                    configList = buildCurrentConfig()

            return



    # Check if default name is equal to current name
    if config.projectName is defaults.projectName

        configUpdated = true
        config.projectName = projectFolderName

    # Rewrite fresh status unless the project was just created
    if removeFresh is true and config.status is 'fresh'

        configUpdated = true
        config.status = 'active'
        freshUpdated = 'Your fresh project "' + config.projectName + '" had it\'s status changes to "active".'

    # Rewrite the config file at the end in case something was missing and print out the notification and console log
    if configUpdated is true

        configPath = projectPath+'/projectConfig.json'

        configString = JSON.stringify config,null,4
        app.globals.dependencies.fs.writeFileSync configPath, configString


        if not config.status is not 'fresh' and freshUpdated.length is 0

            warningMessage = '\nPROJECT: '+config.projectName+'\n' +'Your project config file was missing or had incomplete/corrupted data. Some of the keys and values has been updated accordingly. Please modify it to your needs. \n'


    return {warningMessage,freshUpdated}

export default projectConfigCheck