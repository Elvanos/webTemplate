// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let srcFileSass = projectSettings.settingsFileNames.srcFileSass;
        let distFileCss = projectSettings.settingsFileNames.distFileCss;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        
        gulp.task('compiler-sassCompressed', () =>
            gulp.src(srcFolderPath + '/sass/' + srcFileSass + '.sass')
                .pipe(plugins.sass({
                        outputStyle: 'compressed',
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(distFileCss + ".min.css"))
                .pipe(gulp.dest(distFolderPath + '/css/'))
        );
    };
};
