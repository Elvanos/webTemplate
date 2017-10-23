installCheck = (app) ->

    warningMessage = ''

    configExists = app.globals.dependencies.fs.existsSync './webTemplateConfig.json'

    if not configExists
        defaultFile = app.globals.dependencies.fs.readFileSync './webTemplateFiles/webTemplateConfig.default.json','utf-8'

        app.globals.dependencies.fs.writeFileSync './webTemplateConfig.json',defaultFile,'utf-8'

        warningMessage = '"webTemplate.json" config file not found, loading defaults and creating a copy.\n'


    return warningMessage
export default installCheck