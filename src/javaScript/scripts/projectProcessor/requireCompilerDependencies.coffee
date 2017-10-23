requireCompilerDependencies = (app) ->
    
    # Load dependencies depending on what we will need based on the list of globally supported modules loaded from the modules

    # Set reference for easier readability/edits
    dep = app.globals.dependencies
    list = app.globals.moduleList
    
    ################################
    ### Java Script dependencies ###
    ################################
    
    if list.compilers.javaScript is true
        
        dep.rollup = require 'gulp-better-rollup'
    
        dep.gulpBabel = require 'gulp-babel'
    
        # Coffee script dependencies
        if list.compilers.coffeeScript is true
            
            dep.rollupCoffeeScript = require 'rollup-plugin-coffee-script'

        # Babel dependencies
        if list.compilers.babel is true or list.compilers.jsx is true
            
            dep.rollupBabel = require 'rollup-plugin-babel'
        
        # JSX dependencies (none special)
            
        # Type script dependencies
        if list.compilers.typeScript is true
    
            dep.rollupTypeScript = require 'rollup-plugin-typescript2'
    
    ################################
    ###     CSS dependencies     ###
    ################################
    
    # Node Sass dependencies
    if list.compilers.nodeSass is true
        
        dep.nodeSass = require 'gulp-sass'

    # Ruby Sass dependencies
    if list.compilers.rubySass is true
    
        dep.rubySass = require 'gulp-ruby-sass'
    
    # Less dependencies
    if list.compilers.less is true
    
        dep.less = require 'gulp-less'
        
    # Stylus dependencies
    if list.compilers.stylus is true
        dep.stylus = require 'gulp-stylus'


    ################################
    ###   Utility dependencies   ###
    ################################
    
    # Minify dependencies
    if list.utilities.minify is true
        
        dep.gulpJSminify = require 'gulp-uglify'
        dep.gulpCSSminify = require 'gulp-clean-css'
        
    # Concat dependencies
    if list.utilities.concat is true
        
        dep.gulpConcat = require 'gulp-concat'

    # Source maps dependencies
    if list.utilities.sourceMaps is true
        
        dep.gulpSourceMaps = require 'gulp-sourcemaps'

    # Auto prefix dependencies
    if list.utilities.autoPrefixCSS is true
        
        dep.autoPrefixer = require 'autoprefixer'
        dep.gulpPostCss = require 'gulp-postcss'
    
export default requireCompilerDependencies