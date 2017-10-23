configCheck = (app) ->

    # Global for final notification
    configUpdated = false
    warningMessage = ''

    # Get file content
    defaults = JSON.parse app.globals.dependencies.fs.readFileSync './webTemplateFiles/webTemplateConfig.default.json','utf-8'
    config = JSON.parse app.globals.dependencies.fs.readFileSync './webTemplateConfig.json'


    # Dynamically adds values to objects of multilevel depth
    setByPath = app.globalFunctions.gSetValueByPath

    # Load current live config
    buildCurrentConfig = () ->
        configList = []
        app.globals.dependencies.traverse config
            .forEach (value) ->
                key = this.key
                if not key is not 'undefined'
                    configList.push key

                return
        return configList

    configList = buildCurrentConfig()

    # Compare life config with default config
    app.globals.dependencies.traverse defaults
        .forEach (value) ->
            key = this.key

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

    # Rewrite the config file at the end in case something was missing and print out the notification and console log
    if configUpdated is true

        configString = JSON.stringify config,null,4
        app.globals.dependencies.fs.writeFileSync './webTemplateConfig.json', configString

        warningMessage = 'Your main config file "webTemplateConfig.json" was missing some of the default keys and has been updated accordingly. Please modify it to your needs.\n'

    # Set config as global so other parts of app can access it easily
    app.globals.config = config

    return {warningMessage: warningMessage}
export default configCheck