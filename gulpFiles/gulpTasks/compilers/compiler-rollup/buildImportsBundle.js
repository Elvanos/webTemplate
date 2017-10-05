// Compiler - Rollup
module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let autogenBuildFile = projectSettings.settingsGeneration.autogenBuildFile;
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathJS = projectSettings.settingsPaths.specialInputPathJS;
        
        // Generate file only if "autogenBuildFile" is set to "true"
        if (autogenBuildFile === "true") {
            function buildMainJS() {
                // Get all files for import
                let fileTree = plugins.dirTree('./' + srcFolderPath + '/js/scripts');

                // Set default string for opening and closing of the object
                let objectHeader = 'var exportObject = {';
                let objectFooter = '}; export default exportObject;';
                let objectBody = '';

                // Prepare variables for generating imports
                let partsArray = [];
                let importsString = '';

                let uniqueId = 0;

                // Generate imports and prepare them as string
                function treeSearch(treeLevel) {

                    treeLevel = treeLevel.children;
                    for (let i = 0, len = treeLevel.length; i < len; i++) {

                        // Excluded
                        if (
                            treeLevel[i].name === '.babelrc'
                            ||
                            treeLevel[i].name === specialInputPathJS
                            ||
                            treeLevel[i].name === 'importsBundle.js'
                            ||
                            treeLevel[i].name === 'manualBundle.js'

                        ) {
                            continue;
                        }

                        // If directory
                        if (treeLevel[i].type === 'directory') {

                            // Build object
                            objectBody += treeLevel[i].name + ' :{';
                            treeSearch(treeLevel[i]);
                            objectBody += '},';

                        }


                        // If file
                        if (treeLevel[i].type === 'file') {

                            uniqueId++;

                            // Build object
                            let fileName = treeLevel[i].name;

                            fileName = fileName.replace(treeLevel[i].extension, "");

                            objectBody += fileName +' :' + fileName+ '_'+uniqueId+',';

                            // Build import list
                            let importPath = treeLevel[i].path;

                            // Fix backslashes
                            importPath = importPath.replace(/\\/g, "/");

                            // Fix pathing for imports
                            importPath = importPath.replace(srcFolderPath + "/js/scripts/", "");

                            // Add file to import string
                            importsString += 'import ' + fileName+'_'+uniqueId+ ' from \'./scripts/' + importPath + '\';';

                        }
                    }
                }

                treeSearch(fileTree);


                let fileContent = importsString + objectHeader + objectBody + objectFooter;

                return fileContent;
            }
            let fileContent = buildMainJS();
            return plugins.fs.writeFileSync('./' + srcFolderPath + '/js/importsBundle.js', fileContent);
        } else {
            return true;
        }







    };
}
;