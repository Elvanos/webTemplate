projectsCheck = (app,appModule) ->
    
    config = app.globals.config
    
    # Global string mesages
    warningMessage = ''
    freshUpdated = ''

    # Global vars to count all project and shown projects
    countAllProject = 0
    countFilteredProjects = 0


    #Load default config file in case we will need it later
    defaultConfig = app.globals.dependencies.fs.readFileSync './webTemplateFiles/defaultProject/projectConfig.json','utf-8'
    defaultConfig = JSON.parse defaultConfig

    #Set array of project data for later use
    projectArray = []

    # Set base level of projects 
    projectDir = config.projectDirectory

    # Set array of allowed project to process
    allStatuses = [
        'active',
        'onhold',
        'finished',
        'canceled',
        'fresh']
    includedStatues = []

    if config.includeStatus.active is true
        includedStatues.push 'active'
    if config.includeStatus.onhold is true
        includedStatues.push 'onhold'
    if config.includeStatus.finished is true
        includedStatues.push 'finished'
    if config.includeStatus.canceled is true
        includedStatues.push 'canceled'
    if config.includeStatus.fresh is true
        includedStatues.push 'fresh'

    # Function to run through a project directory level
    iterateThroughProjectLevel = (directoryPath) ->

        #Get a list of projects
        projects = app.globals.dependencies.dirTree(directoryPath).children

        # Check all project for the config file
        for project,index in projects

            # Skip files, do only directories
            if project.type is "directory"
    
                #Remove the fresh status from a project at the end of a cycle unless it was just created
                removeFresh = true

                # Fix derpy dirTree path formatting ( \\ instead of / )
                configPath = project.path.replace /\\/g, "/"

                # Check if config file exists
                configExists = app.globals.dependencies.fs.existsSync configPath+'/projectConfig.json'

                # If project config doesn't exists, build config file from default
                if not configExists
                    removeFresh = false

                    defaultString = JSON.stringify defaultConfig,null,4
                    app.globals.dependencies.fs.writeFileSync configPath+'/projectConfig.json',defaultString,'utf-8'

                # Get the config file
                projectConfig = app.globals.dependencies.fs.readFileSync configPath+'/projectConfig.json', 'utf-8'
                projectConfig = JSON.parse projectConfig

                # Check if the config file contains all data as default, if not, fix it
                returnBundle = appModule._projectCheck.projectConfigCheck(app,projectConfig,defaultConfig, configPath,removeFresh)
                warningMessage += returnBundle.warningMessage
                freshUpdated += returnBundle.freshUpdated

                # Reload config file with fixed content
                projectConfig = app.globals.dependencies.fs.readFileSync configPath+'/projectConfig.json', 'utf-8'
                projectConfig = JSON.parse projectConfig

                # Check if the directory is a project or category
                if projectConfig.isCategory is true
                    # Run a sub-iteration of this function for the sub-level of directories

                    iterateThroughProjectLevel(configPath)

                else

                    # Add project to total project count
                    countAllProject++

                    # Check if project applies for the status filter, if so, let it through
                    if (includedStatues.includes projectConfig.status) or !(allStatuses.includes projectConfig.status)

                        # Build a project array instance
                        projectObject =
                            name: projectConfig.projectName
                            path: configPath
                            configPath: configPath+'/projectConfig.json'
                            status: projectConfig.status
                            config: projectConfig

                        # Push it in the array
                        projectArray.push projectObject

                        # Add project to filtered project count
                        countFilteredProjects++


    # Build the project list
    iterateThroughProjectLevel projectDir

    # Sort the list based on statuses
    compareStatuses = (a, b) ->

        # Set values for different statuses
        statusValue = (status) ->
            value = 0
            switch status
                when 'fresh'
                    value = 5
                when 'active'
                    value = 4
                when 'onhold'
                    value = 2
                when 'finished'
                    value = 1
                when 'canceled'
                    value = 0
                else
                    value = 3

        # Add values to statues and set global
        statusA = statusValue(a.status)
        statusB = statusValue(b.status)

        #Compare status values
        if statusA > statusB
            return -1
        if statusA < statusB
            return 1

    projectArray.sort compareStatuses



    # Add empty line before the output
    console.log ''

    # Final log
    for project,index in projectArray

        # Check if gulp was launched from a project level and if so, inform user from which one
        currentMessage = ''
        curProjectDirName = project.path.split("/").pop()
        curProjectCheck = process.env.INIT_CWD
        curProjectCheck = curProjectCheck.split("\\").pop()
        curProjectCheck = project.name is curProjectCheck or curProjectDirName is curProjectCheck
        if curProjectCheck > 0
            currentMessage =  app.globals.dependencies.colors.white(' - ') + app.globals.dependencies.colors.blue('current')


        switch project.status
            when 'fresh'
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.blue project.status +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )
            when 'active'
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.green project.status +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )
            when 'onhold'
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.yellow project.status +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )
            when 'canceled'
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.red project.status +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )
            when 'finished'
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.magenta project.status +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )
            else
                console.log (
                    app.globals.dependencies.colors.cyan project.name +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.bgRed.black(project.status) +
                    currentMessage +
                    app.globals.dependencies.colors.white ' - ' +
                    app.globals.dependencies.colors.white project.path
                )

    # Add empty line After the output
    console.log ''

    # Print out the number of project total and shown + current filters
    console.log app.globals.dependencies.colors.magenta 'Showing ' + countFilteredProjects + ' filtered projects out of ' + countAllProject + ' total projects.'
    console.log app.globals.dependencies.colors.magenta 'Allowed statuses for filtering*: ' + includedStatues.join ', '
    console.log '* also shows all non-standard statuses'

    # Add empty line After the output
    console.log ''

    return {projectArray: projectArray, warningMessage: warningMessage, freshUpdated: freshUpdated}

export default projectsCheck