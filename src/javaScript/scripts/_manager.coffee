_manager = (command) ->
    
        #Self-reference to the parent app
        app = webTemplate
    
        # React to diffent commands for the app
        switch command
            
            # gulpStart module - Returns an array of objects (projects)
            when 'startUp'
                app.startUp._manager app,app.startUp
                
            # Process the project list
            when 'processProjects'
                app.projectProcessor._manager app,app.projectProcessor,app.globals.projectList
            

        return
export default _manager