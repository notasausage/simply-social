# Simply Social

A web application code challenge built using Gulp, Panini, Sass and standards-based HTML & CSS (and maybe a bit of JavaScript too).

## Components

The templating system is built on [Handlebars](http://handlebarsjs.com/) using Zurb's [Panini](http://foundation.zurb.com/sites/docs/panini.html) flat-file generator to speed up development and Gulp as the task runner.

## System Requirements

You'll need node and npm to run and build this web app demo.

https://nodejs.org

The best way to install npm on macOS without sudo rights:

http://www.johnpapa.net/how-to-use-npm-global-without-sudo-on-osx/

### Install Gulp

*Note: This project uses Gulp 4.0. To run it, you'll need to install Gulp 4 globally but can run older versions of Gulp locally.*

To remove previous versions of Gulp:

    $ npm rm -g gulp

Install Gulp globally (to provide access to the Gulp CLI):

    $ npm install -g gulp-cli

In terminal, `cd` into the `simply-social` directory and run:

    $ npm install gulp

This will install the base requirement of Gulp. Once this is complete, run:

    $ npm install

This will install all of the node modules (listed in `packages.json`) that are necessary to run the Gulp tasks.

## Available Tasks

The `gulp` default task will build the app from pages, layouts and partials, and then start up a server with LiveReload (using Browsersync) at `localhost:3000` and refresh the current page when files are saved. It will also watch for file changes and refresh as needed.

    $ gulp

The `build` task is called by the default task to build the app and ready it for the browser.

    $ gulp build

The `dist` task can be used to compile and build the app for distribution and files will be ready for handoff to development.

    $ gulp dist

Other tasks are used by the default task primarily, but can be called manually to clear out the `build` or `dist` folders.

    $ gulp cleanBuild
    $ gulp cleanDist

## Acknowledgements

This demo was built from scratch using HTML, CSS & JavaScript, with a little help from the following code and media sources.

### Code

Jeremy Thomas's [minireset](https://github.com/jgthms/minireset.css) was used to reset all browser styles. Tim Pietrusky's [Advanced Checkbox Hack](http://timpietrusky.com/advanced-checkbox-hack) was helpful to develop a CSS-only show/hide toggle on the comments, as well as the profile drop-down.

### Photography

Profile photos courtesy of the [Random User Generator](https://www.randomuser.me/photos), other media courtesy of [Pexels](https://www.pexels.com).
