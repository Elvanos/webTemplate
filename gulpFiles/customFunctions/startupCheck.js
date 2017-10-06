module.exports = function startupCheck(plugins){

    let warningMessage = '';
    let projectSettings;
    let defaultFileContent = require('../gulp-config.default.json');


    // Check if config file exists, otherwise close settings from default one and create one
    if (!plugins.fs.existsSync('./gulpFiles/gulp-config.json')) {

        plugins.fs.writeFileSync('./gulpFiles/gulp-config.json', JSON.stringify(defaultFileContent,null,4));

        warningMessage += 'PROJECT SETTINGS MISSING:\n"gulp-config.json" not found, one was created from "gulp-config.default.json".\nPlease update it to your needs.\n\n';
    }

    // Get Project settings
    projectSettings = require('../gulp-config.json');

    // Check if user settings are alright
    let rewriteConfig = false;


    // Check "name"
    if (projectSettings.name === undefined) {
        rewriteConfig = true;
        projectSettings.name = defaultFileContent.name;
        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "name" property, one with a key "'+projectSettings.name+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
    }

    // Check "settingsGeneration"
    if (projectSettings.settingsGeneration === undefined) {
        rewriteConfig = true;
        projectSettings.settingsGeneration = defaultFileContent.settingsGeneration;
        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
    }else{

        // Sub-object settingsGeneration

            // Check "settingsGeneration.autogenBuildFile"
            if (projectSettings.settingsGeneration.autogenBuildFile === undefined) {
                rewriteConfig = true;
                projectSettings.settingsGeneration.autogenBuildFile = defaultFileContent.settingsGeneration.autogenBuildFile;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.autogenBuildFile" property, one with a key "'+projectSettings.settingsGeneration.autogenBuildFile+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsGeneration.compileOnLoad"
            if (projectSettings.settingsGeneration.compileOnLoad === undefined) {
                rewriteConfig = true;
                projectSettings.settingsGeneration.compileOnLoad = defaultFileContent.settingsGeneration.autogenBuildFile;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.compileOnLoad" property, one with a key "'+projectSettings.settingsGeneration.compileOnLoad+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsGeneration.allowAdditionalSass"
            if (projectSettings.settingsGeneration.allowAdditionalSass === undefined) {
                rewriteConfig = true;
                projectSettings.settingsGeneration.allowAdditionalSass = defaultFileContent.settingsGeneration.allowAdditionalSass;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsGeneration.allowAdditionalSass" property, one with a key "'+projectSettings.settingsGeneration.allowAdditionalSass+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }
    }

    // Check "settingsFileNames"
    if (projectSettings.settingsFileNames === undefined) {
        rewriteConfig = true;
        projectSettings.settingsFileNames = defaultFileContent.settingsFileNames;
        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
    }else{

        // Sub-object settingsFileNames

            // Check "settingsFileNames.srcFileSass"
            if (projectSettings.settingsFileNames.srcFileSass === undefined) {
                rewriteConfig = true;
                projectSettings.settingsFileNames.srcFileSass = defaultFileContent.settingsFileNames.srcFileSass;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.srcFileSass" property, one with a key "'+projectSettings.settingsFileNames.srcFileSass+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsFileNames.distFileCss"
            if (projectSettings.settingsFileNames.distFileCss === undefined) {
                rewriteConfig = true;
                projectSettings.settingsFileNames.distFileCss = defaultFileContent.settingsFileNames.distFileCss;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.distFileCss" property, one with a key "'+projectSettings.settingsFileNames.distFileCss+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsFileNames.distFileJs"
            if (projectSettings.settingsFileNames.distFileJs === undefined) {
                rewriteConfig = true;
                projectSettings.settingsFileNames.distFileJs = defaultFileContent.settingsFileNames.distFileJs;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsFileNames.distFileJs" property, one with a key "'+projectSettings.settingsFileNames.distFileJs+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }
        }

    // Check "settingsPaths"
    if (projectSettings.settingsPaths === undefined) {
        rewriteConfig = true;
        projectSettings.settingsPaths = defaultFileContent.settingsPaths;
        warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths" property, one, along with default sub-keys has been automatically added to it.\nPlease update it to your needs.\n\n';
    }else{

        // Sub-object settingsPaths


            // Check "settingsPaths.splitObjectDir"
            if (projectSettings.settingsPaths.splitObjectDir === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths.splitObjectDir = defaultFileContent.settingsPaths.splitObjectDir;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.splitObjectDir" property, one with a key "'+projectSettings.settingsPaths.splitObjectDir+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsPaths.distFolderPath"
            if (projectSettings.settingsPaths.distFolderPath === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths.distFolderPath = defaultFileContent.settingsPaths.distFolderPath;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.distFolderPath" property, one with a key "'+projectSettings.settingsPaths.distFolderPath+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsPaths.srcFolderPath"
            if (projectSettings.settingsPaths.srcFolderPath === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths.srcFolderPath = defaultFileContent.settingsPaths.srcFolderPath;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.srcFolderPath" property, one with a key "'+projectSettings.settingsPaths.srcFolderPath+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsPaths.specialInputPathJS"
            if (projectSettings.settingsPaths.specialInputPathJS === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths.specialInputPathJS = defaultFileContent.settingsPaths.specialInputPathJS;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.specialInputPathJS" property, one with a key "'+projectSettings.settingsPaths.specialInputPathJS+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

            // Check "settingsPaths.specialInputPathSass"
            if (projectSettings.settingsPaths.specialInputPathSass === undefined) {
                rewriteConfig = true;
                projectSettings.settingsPaths.specialInputPathSass = defaultFileContent.settingsPaths.specialInputPathSass;
                warningMessage += 'MISSING SETTING:\nYour settings file was missing a "settingsPaths.specialInputPathSass" property, one with a key "'+projectSettings.settingsPaths.specialInputPathSass+'" has been automatically added to it.\nPlease update it to your needs.\n\n';
            }

    }




    // Rewrite config file if needed
    if (rewriteConfig === true) {
        let configString = JSON.stringify(projectSettings,null,4);
        plugins.fs.writeFileSync('./gulpFiles/gulp-config.json', configString);
    }


    // Check if dist directory exists, if not, let user know that dist is being created for him... and make it
    if (!plugins.fs.existsSync('./'+projectSettings.settingsPaths.distFolderPath)){

        plugins.fs.mkdirSync('./'+projectSettings.settingsPaths.distFolderPath);
        warningMessage += 'DISTRIBUTION DIRECTORY MISSING:\nA new directory "'+projectSettings.settingsPaths.distFolderPath+'" has been created for you.\n\n';

    }

    return [projectSettings, warningMessage];

}