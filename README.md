# generator-nswebapp [![Build Status](https://secure.travis-ci.org/JovicaConkic/generator-nswebapp.svg?branch=master)](http://travis-ci.org/JovicaConkic/generator-nswebapp) [![Dependency Status](https://david-dm.org/JovicaConkic/generator-nswebapp.svg)](https://david-dm.org/JovicaConkic/generator-nswebapp) [![devDependency Status](https://david-dm.org/JovicaConkic/generator-nswebapp/dev-status.svg)](https://david-dm.org/JovicaConkic/ggenerator-nswebapp#info=devDependencies) [![npm version](https://badge.fury.io/js/generator-nswebapp.svg)](https://badge.fury.io/js/generator-nswebapp)
> Yeoman generator for Web Applications with GruntJS

generator-nswebapp is generators for building a web application based on 
yeoman generator. It is created as a sum of everything that you can find all over www and which is really necessary and 
helpful to start your work of building web application.

## Prerequisites

In order to use this generator-nswebapp, you'll need to install the latest version of [nodeJS](https://nodejs.org/en/download/) and for Windows users [Ruby](http://rubyinstaller.org/downloads/). 
Once when you install the latest version of nodeJS, or you already have it, you'll need to install globally following packages using 
node package manager (npm):
* yo
* generator-nswebapp
* grunt
* grunt-cli
* bower

To do so, you can just simply run npm command
```
npm install -g yo generator-nswebapp grunt grunt-cli bower
```

Once when you install Ruby or you already have it, you'll need to install following ruby gems (required for Grunt tasks):
* sass
* compass

To do so, you can just simply run command
```
gem install sass compass
```

Once you are done with installation of all prerequisites, you'll be good to go to use generator-nswebapp.

## Usage

Make a new project directory, and cd into it:
```
mkdir 'path/to/the/project/directory' && cd 'path/to/the/project/directory'
```

If you are done with this step, it is time to run and use generator-nswebapp using following command:
```
yo nswebapp [projectName]
```

for example:
```
yo nswebapp myWebApp
```
if you want to skip installation of the node and bower dependencies you can use `--skip-install` generator option, 
but this is not required if you running installation for a first time:
```
yo nswebapp myWebApp --skip-install
```

Application Generator will sets up a new Web app, generating Grunt file with tasks and all the boilerplate you need to get started. The app generator is offering also optionally to install additional Third party libraries, such are jQuery and Bootstrap. Bootstrap CSS only, third party library will be installed by default if you choose to not use bootstrap js.

## Application Directory Layout

```
app/                            --> all of the source files for the application
  index.html                    --> the main html template for the application
  favicon.ico                   --> favicon file
  assets/
    bower_components/           --> 3rd party libraries managed by bower
    css/                        --> css source files
      style.css                 --> default stylesheet
    fonts/                      --> fonts source files
    images/                     --> images source files
      logo.svg                  --> logo image file
    js/                         --> app JS files
      script.js                 --> JavaScript file
dist/                           --> distributable version of app built using grunt and Gruntfile.js
node_modules/                   --> npm managed libraries used by grunt
src/                            --> source directory used as SCSS/SASS compiling source
  scss/                         --> SCSS/SASS directory
    mixins/                     --> mixins
    modules/                    --> common modules
    partials/                   --> partials
    vendor/                     --> CSS or Sass from other projects
    style.scss                  --> primary Sass file
  js/                           --> JavaScript source file directory used for grunt tasks
    script.js                   --> default JavaScript source file
.bowerrc                        --> bower configuration file
.gitattributes                  --> git attributes file
.gitignore                      --> git ignore config file
.jshintrc                       --> jshintrc config file
.travis.yml                     --> travis ci continuous build config file
.yo-rc.json                     --> yeoman configuration options file
bower.json                      --> package definition manifest for bower
Gruntfile.js                    --> Grunt build file
package.json                    --> package definition manifest for Node/npm

```

## Gruntfile.js & Grunt tasks

Gruntfile.js contains next 4 main grunt tasks:

* [grunt](#grunt) or [grunt default](#grunt)
* [grunt build](#grunt-build)

### Grunt
Grunt default task runner.

Example:
```bash
grunt
```
or
```bash
grunt default
```

Grunt default snippet:
```javascript
grunt.registerTask('default', [
    'sass:dev',
    'jshint',
    'concat:dev',
    'injector:dev',
    'injector:bower',
    'connect:livereload',
    'open',
    'watch'
  ]);
```

Grunt default task contains following grunt sub-tasks:
* [sass:dev](https://github.com/gruntjs/grunt-contrib-sass) - SCSS/SASS compiler for development (expanded CSS style)
* [jshint](https://github.com/gruntjs/grunt-contrib-jshint) - JSHint
* [concat:dev](https://github.com/gruntjs/grunt-contrib-concat) - Concatenate JavaScript source files and place script file in development directory
* [injector:dev](https://github.com/klei/grunt-injector) - Inject references (js files and stylesheets) into a html file
* [injector:bower](https://github.com/klei/grunt-injector) - Inject bower references into a html file
* [connect:livereload](https://github.com/gruntjs/grunt-contrib-connect) - Starts a local webserver with rewrite rules and livereload
* [open](https://github.com/jsoverson/grunt-open) - Open the webserver in the browser
* [watch](https://github.com/gruntjs/grunt-contrib-watch) - Watching development files and run concat/compile tasks

### Grunt Build
Grunt build task runner. Build task running clean, copy, minify application files into dist directory and perform content optimization for distribution.

Example:
```bash
grunt build
```

Grunt build snippet:
```javascript
grunt.registerTask('build', [
    'clean',
    'copy',
    'sass:dist',
    'jshint',
    'concat:dist',
    'uglify',
    'injector:dist',
    'injector:bower',
    'imagemin:dist',
    'htmlmin:dist'
  ]);
```

Grunt build task contains following grunt sub-tasks:
* [clean](https://github.com/gruntjs/grunt-contrib-clean) - Cleans dist folder
* [copy](https://github.com/gruntjs/grunt-contrib-copy) - Copy app files and folders in dist directory
* [sass:dist](https://github.com/gruntjs/grunt-contrib-sass) - SCSS/SASS compiler for distribution (compressed CSS)
* [jshint](https://github.com/gruntjs/grunt-contrib-jshint) - JSHint
* [concat:dist](https://github.com/gruntjs/grunt-contrib-concat) - Concatenate JavaScript source files and place script file in dist directory
* [uglify](https://github.com/gruntjs/grunt-contrib-uglify) - Compresses and minifies all JavaScript files
* [injector:dist](https://github.com/klei/grunt-injector) - Inject references (js files and stylesheets) into a html file for distribution
* [injector:bower](https://github.com/klei/grunt-injector) - Inject bower references into a html file for distribution
* [imagemin:dist](https://github.com/gruntjs/grunt-contrib-imagemin) - Compresses and minify images
* [htmlmin:dist](https://github.com/gruntjs/grunt-contrib-htmlmin) - Minify HTML


## Continuous Integration

### Travis CI

[Travis CI](https://travis-ci.org/) is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. generator-nswebapp and also generated application
project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your
tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more
instruction on how to do this.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/JovicaConkic/generator-nswebapp/releases)

## License

[ISC license](https://opensource.org/licenses/ISC)
