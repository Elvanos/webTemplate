// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;

        gulp.task('compiler-additionalSassDevelopment', () =>
            gulp.src(
                [
                    srcFolderPath +'/sass/' + specialInputPathSass + '/*.sass',
                    srcFolderPath +'/sass/' + specialInputPathSass + '/*.scss',
                    '!'+srcFolderPath +'/sass/' + specialInputPathSass + '/ignore/*.sass',
                    '!'+srcFolderPath +'/sass/' + specialInputPathSass + '/ignore/*.scss'
                ]
                )
                .pipe(plugins.sass(
                    {
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(gulp.dest(distFolderPath + '/css/'))
        );
    };
};