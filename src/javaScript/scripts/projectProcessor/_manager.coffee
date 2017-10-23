_manager = (app,appModule,projectList) ->

    # Check all supported modules and prepare them for loading (sets a global variable)
    appModule.moduleChecker app,projectList
    
    # Loads all needed dependencies depending on what we need
    appModule.requireCompilerDependencies app
    
    # Engage file watchers for each active project
    appModule.projectCycler app, appModule, projectList
  
export default _manager