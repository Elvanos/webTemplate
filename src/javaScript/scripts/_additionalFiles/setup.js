// Set global var for the app in case we need to rena
let app = webTemplate;

// Set stuff up
app._manager('startUp');

// Turn on dev/debug mode
let debugSwitch = false;
app.globalFunctions.gConsoleDebug(debugSwitch);



// Run default after setup
app.globals.dependencies.gulp.task('default', function () {

   app._manager('processProjects');

});
