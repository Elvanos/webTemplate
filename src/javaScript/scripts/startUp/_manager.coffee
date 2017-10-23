_manager = (app,appModule) ->

        warningMessage = ''
    
        appModule.requireCoreDependencies app

        # Check if the config file exists
        warningMessage += appModule.installCheck app

        # Check if the config file isn't missing any setting when compared to the default one
        returnBundle = appModule.configCheck app
        
        warningMessage += returnBundle.warningMessage

        # Checks all project folders, loads needed dependencies and informs the user of project status and undefined projects
        returnBundle = appModule.projectsCheck app, appModule

        projectLogArray = returnBundle.projectArray
        warningMessage += returnBundle.warningMessage
        freshUpdated = returnBundle.freshUpdated

        # Console summary report of all found bugs or problems
        appModule.finalReport warningMessage, freshUpdated

        # Set an array list of all registered projects as global
        app.globals.projectList = projectLogArray
    
        return

export default _manager