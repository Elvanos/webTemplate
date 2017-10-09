// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;


        
        gulp.task('compiler-additionalSassCompressed', () =>
            gulp.src(
                [
                srcFolderPath +'/sass/' + specialInputPathSass + '/*.sass',
                srcFolderPath +'/sass/' + specialInputPathSass + '/*.scss',
                '!'+srcFolderPath +'/sass/' + specialInputPathSass + '/ignore/*.sass',
                '!'+srcFolderPath +'/sass/' + specialInputPathSass + '/ignore/*.scss'
                ]
            )
                .pipe(plugins.plumberNotifier())
                .pipe(plugins.sass({
                        outputStyle: 'compressed',
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename({suffix: '.min'}))
                .pipe(gulp.dest(distFolderPath + '/css/'))
        );
    };
};
