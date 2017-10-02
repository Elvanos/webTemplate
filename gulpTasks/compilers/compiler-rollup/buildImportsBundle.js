// Compiler - Rollup
module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        // Generate file only if "autogenBuildFile" is set to "true"
        if (projectSettings.settingsGeneration.autogenBuildFile === "true") {
            function buildMainJS() {
                // Get all files for import
                var fileTree = plugins.dirTree('./' + projectSettings.settingsPaths.srcFolderPath + '/js');

                // Set default string for opening and closing of the object
                var objectHeader = 'var exportObject = {';
                var objectFooter = '}; export default exportObject;';
                var objectBody = '';

                // Prepare variables for generating imports
                var partsArray = [];
                var importsString = '';

                // Generate imports and prepare them as string
                function treeSearch(treeLevel) {

                    treeLevel = treeLevel.children;
                    for (var i = 0, len = treeLevel.length; i < len; i++) {

                        // Excluded
                        if (
                            treeLevel[i].name === '.babelrc'
                            ||
                            treeLevel[i].name === 'specialInput'
                            ||
                            treeLevel[i].name === 'importsBundle.js'
                            ||
                            treeLevel[i].name === 'manualBundle.js'

                        ) {
                            continue;
                        }
                        ;

                        // If directory
                        if (treeLevel[i].type === 'directory') {

                            // Build object
                            objectBody += treeLevel[i].name + ' :{';
                            treeSearch(treeLevel[i]);
                            objectBody += '},';

                        }
                        ;

                        // If file
                        if (treeLevel[i].type === 'file') {

                            // Build object
                            var fileName = treeLevel[i].name;

                            fileName = fileName.replace(treeLevel[i].extension, "");

                            objectBody += fileName + ' :' + fileName + ',';

                            // Build import list
                            var importPath = treeLevel[i].path;

                            // Fix backslashes
                            importPath = importPath.replace(/\\/g, "/");

                            // Fix pathing for imports
                            importPath = importPath.replace(projectSettings.settingsPaths.srcFolderPath + "/js/", "");

                            // Add file to import string
                            importsString += 'import ' + fileName + ' from \'./' + importPath + '\';';

                        }
                        ;


                    }
                    ;

                }

                treeSearch(fileTree);


                var fileContent = importsString + objectHeader + objectBody + objectFooter;

                return fileContent;
            }
            var fileContent = buildMainJS();
            return plugins.fs.writeFileSync('./' + projectSettings.settingsPaths.srcFolderPath + '/js/importsBundle.js', fileContent);
        } else {
            return true;
        }
        ;






    };
}
;