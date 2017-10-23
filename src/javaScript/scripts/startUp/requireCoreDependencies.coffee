requireCoreDependencies = (app) ->
    
    # Set reference for easier readability/edits
    dep = app.globals.dependencies
    
   # Core
    dep.gulp                = require 'gulp'
    dep.fs                  = require 'fs-extra'
    dep.path                = require 'path'
    dep.colors              = require 'colors'
    dep.traverse            = require 'traverse'
    dep.notify              = require 'node-notifier'
    dep.dirTree             = require 'directory-tree'
    dep.watcher             = require 'chokidar'

    # Gulp plugins
    dep.gulpCond            = require 'gulp-if-else'
    dep.gulpAdd             = require 'gulp-add-src'
    dep.gulpClean           = require 'gulp-clean-dest'
    dep.gulpParams          = require 'gulp-parameterized'
    dep.gulpPlumber         = require 'gulp-plumber'
    dep.gulpPlumberNofifier = require 'gulp-plumber-notifier'
    dep.gulpRename          = require 'gulp-rename'
    dep.gulpTap             = require 'gulp-tap'
    dep.gulpBeautify        = require 'gulp-beautify'
    
    return

export default requireCoreDependencies