/* ---------------------------------------------------------------------------
   SETUP
-----------------------------------------------------------------------------*/
var gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    del = require( 'del' ),
    imagemin = require( 'gulp-imagemin' ),
    replace = require( 'gulp-replace' ),
    concat = require( 'gulp-concat' ),
    gutil = require( 'gulp-util' ),
    lazypipe = require( 'lazypipe' ),
    panini = require( 'panini' ),
    sassJson = require( 'gulp-sass-json' ),
    browser = require( 'browser-sync' ).create(),

    // Optionally change the default path to the html files
    default_html_file_path = './build/',

    current_date = new Date().toLocaleString()

/* ---------------------------------------------------------------------------
   GULP TASKS
-----------------------------------------------------------------------------*/
gulp.task( 'cleanBuild',
    function() {
        return clean( 'build' );
    }
);
gulp.task( 'cleanBuild' ).description = "Clean old files from build folder";

gulp.task( 'cleanDist',
    function() {
        return clean( 'dist' );
    }
);
gulp.task( 'cleanDist' ).description = "Clean old files from dist folder";

gulp.task( 'build',
    gulp.series(
        'cleanBuild',
        json,
        pages,
        scss,
        images
    )
);
gulp.task( 'build' ).description = "Build all files needed to serve up to the browser";

gulp.task( 'dist',
    gulp.series(
        'cleanDist',
        json,
        pagesDist,
        scssDist,
        imagesDist
    )
);
gulp.task( 'dist' ).description = "Build all files for distribution and handoff";

gulp.task( 'default',
    gulp.series(
        'build',
        server,
        watch
    )
);
gulp.task( 'default' ).description = "Build all files, start the server and watch for changes";

/* ---------------------------------------------------------------------------
   REUSABLE FUNCTIONS
-----------------------------------------------------------------------------*/
// Reusable function to clean up files in build or dist folders
function clean( folder ) {
    if( folder == 'dist' ) {
        console.log( gutil.colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            'dist/**/*'
            // Negate the pattern to ignore files (add a comma above)
            //'!build/js/jquery.js.min'
        ]);
    } else if( folder == 'build' ) {
        console.log( gutil.colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            'build/**/*'
            // Negate the pattern to ignore files (add a comma above)
            //'!build/js/jquery.js.min'
        ]);
    } else {
        console.log( gutil.colors.red( 'Cannot clean the ' + folder + ' folder, permission denied.' ) );
        // Need to figure out how to signal that the task is done in this case...
    }
}

// Compile the SCSS for the build folder
function scss() {
    return gulp.src( 'src/assets/scss/*.scss' )
        .pipe( concat( 'style.scss/' ) )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( './build/assets/css/' ) );
};

// Compile the SCSS for the distribution folder
function scssDist() {
    return gulp.src( 'src/assets/scss/*.scss' )
        .pipe( concat( 'style.scss/' ) )
        .pipe( sass().on( 'error', sass.logError ) )
        .pipe( gulp.dest( './dist/assets/css/' ) );
};

// Convert Sass settings to JSON variables for Panini templates
function json() {
    return gulp.src( 'src/assets/scss/settings.scss' )
        .pipe( sassJson() )
        .pipe( gulp.dest( 'src/data' ) );
}

// Refresh Panini's cache of layouts and partials
function refresh( done ) {
    panini.refresh();
    done();
}

// Compile layouts, pages, and partials into flat HTML files with Panini
function pages() {
    return gulp.src( 'src/pages/**/*.html' )
        .pipe( panini({
            root: 'src/pages',
            layouts: 'src/layouts',
            partials: 'src/partials',
            helpers: 'src/helpers',
            data: 'src/data'
        }))
        .pipe( gulp.dest( 'build' ) );
}

// Compile Panini templates into HTML + CSS handoff files
function pagesDist() {
    return gulp.src( 'src/pages/**/*.html' )
        .pipe( panini({
            root: 'src/pages',
            layouts: 'src/layouts',
            partials: 'src/partials',
            helpers: 'src/helpers',
            data: 'src/data'
        }))
        .pipe( gulp.dest( 'dist' ) );
}

// Start a server with BrowserSync to preview the site
function server( done ) {
    browser.init({
        server: 'build'
    });
    done();
}

// Copy images from src to the build folder for BrowserSync server
function images() {
    return gulp.src( 'src/assets/img/**/*' )
        .pipe( gulp.dest( './build/assets/img' ) );
}

// Copy images from src to distribution folder and minify them
function imagesDist() {
    return gulp.src( 'src/assets/img/**/*' )
        .pipe( imagemin() )
        .pipe( gulp.dest( './dist/assets/img' ) );
}

// Watch for file changes while BrowserSync is running
function watch() {
    gulp.watch( 'src/pages/**/*.html' ).on( 'change', gulp.series( pages, browser.reload ) );
    gulp.watch( ['src/layouts/**/*', 'src/partials/**/*'] ).on( 'change', gulp.series( refresh, pages, browser.reload ) );
    gulp.watch( ['../scss/**/*.scss', 'src/assets/scss/**/*.scss'] ).on( 'change', gulp.series( refresh, json, scss, pages, browser.reload ) );
    gulp.watch( 'src/assets/img/**/*' ).on( 'change', gulp.series( images, browser.reload ) );
}
