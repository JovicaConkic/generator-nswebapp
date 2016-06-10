/*!
 * NsWeb App Gruntfile
 * @author Jovica Čonkić
 */

'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var serveStatic = require('serve-static');
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return serveStatic(require('path').resolve(dir.toString()));
}; 

/**
 * Grunt module
 */
module.exports = function (grunt) {  

  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * NsWeb Angular Grunt config
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /**
     * Set project info
     */
    project: {
      src: 'app/assets',
      app: 'app',
      dist: 'dist',
	    dist_src: 'dist/assets',
	    index: [
        '<%- project.app %>/index.html'
      ],
      assets: '<%- project.app %>/assets',
      css: [
        'src/scss/*.{scss,sass}'
      ],
      js: [
        'src/js/**/*.js'
      ]
    },
    
    /**
     * Injector
     * https://github.com/klei/grunt-injector
     * Inject references to files into other files
     * (think scripts and stylesheets into an html file)
     */
    injector: {
      options: {
        ignorePath: ['<%- project.app %>/', '<%- project.dist %>/'],
        addRootSlash: false,
        template: '<%- project.app %>/index.html'
      },
      dev: {
        files: {
          '<%- project.app %>/index.html': [
            '<%- project.assets %>/js/**/*.js',
            '<%- project.assets %>/css/*.css'
          ]
        }
      },
	    dist: {
        options: {
          min: true
        },
        files: {
          '<%- project.dist %>/index.html': [
            '<%- project.dist_src %>/js/**/*.js',
            '<%- project.dist_src %>/css/*.css'
          ]
        }
      },
      bower: {
        options: {
          starttag: '<!-- bower:{{ext}} -->',
          endtag: '<!-- endbower -->',
          min: true
        },
        files: {
          '<%- project.app %>/index.html': 'bower.json'
        }
      }
    },

    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%- pkg.name %>\n' +
              ' * <%- pkg.title %>\n' +
              ' * <%- pkg.url %>\n' +
              ' * @author <%- pkg.author %>\n' +
              ' * @version <%- pkg.version %>\n' +
              ' * Copyright <%- pkg.copyright %>. <%- pkg.license %> licensed.\n' +
              ' */\n'
    },

    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
		      base: 'app',
          middleware: function (connect, options) {
            return [
              lrSnippet,
              mountFolder(connect, options.base)
            ];
          }
        }
      }
    },
    
    /**
     * Copy
     * https://github.com/gruntjs/grunt-contrib-copy
     * Copy files and folders
     */
    copy: {
	    main: {
        expand: true,
		    cwd: '<%- project.app %>/',
		    src: ['**/*',  '!**/assets/js/**',  '!**/assets/css/**'],
		    dest: '<%- project.dist %>',
	    },
	  },
	
    /**
     * HTMLmin
     * https://github.com/gruntjs/grunt-contrib-htmlmin
     * Minify HTML
     */
	  htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: '<%- project.dist %>/',
            src: '*.html',
            dest: '<%- project.dist %>/'
          }
        ]
      }
    },

    /**
     * JSHint
     * https://github.com/gruntjs/grunt-contrib-jshint
     * Manage the options inside .jshintrc file
     */
    jshint: {
      files: [
          '<%- project.js %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev: {
        options: {
          stripBanners: false,
          nonull: true,
          banner: '<%- tag.banner %>'
        },
        files: {
          '<%- project.assets %>/js/scripts.js': '<%- project.js %>'
        }
      },
      dist: {
        options: {
          stripBanners: true,
          nonull: true
        },
        files: {
          '<%- project.dist_src %>/js/scripts.min.js': '<%- project.js %>'
        }
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files
     */
    uglify: {
      options: {
        banner: "<%- tag.banner %>",
        report: 'min',
        mangle: true,
		    compress: {
		      sequences: true,
		      dead_code: true,
		      conditionals: true,
		      booleans: true,
		      unused: true,
		      if_return: true,
		      join_vars: true,
		      drop_console: true
	      }
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%- project.dist_src %>/js/',
            src: '**/*.js',
            dest: '<%- project.dist_src %>/js/'
          }
        ]
      }
    },
    
    /**
     * Minify PNG and JPEG images
     * https://github.com/gruntjs/grunt-contrib-imagemin
     * Compresses and minify images
     */
    imagemin: {
      dist: {
	      options: {
          optimizationLevel: 3,
          progressive: true,
          interlaced: true
        },
		    files: [{
			    expand: true,
			    cwd: '<%- project.dist_src %>/images/',
			    src: ['**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}'],
			    dest: '<%- project.dist_src %>/images/'
		    },
        {
			    expand: true,
			    cwd: '<%- project.dist %>/',
			    src: ['*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,ico,ICO}'],
			    dest: '<%- project.dist %>/'
		    }]
	    }
	  },
    
    /**
     * Clean
     * https://github.com/gruntjs/grunt-contrib-clean
     * Clean files and folders
     */
    clean: {
      dist: [
        '<%- project.dist %>'
			]
	  },

    /**
     * Compile Sass/SCSS files
     * https://github.com/gruntjs/grunt-contrib-sass
     * Compiles all Sass/SCSS files and appends project banner
     */
    sass: {
      dev: {
        options: {
          compass: true,
		      noCache: true,
          style: 'expanded'
        },
        files: {
          '<%- project.assets %>/css/style.css': '<%- project.css %>'
        }
      },
      dist: {
        options: {
          compass: true,
		      noCache: true,
		      sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          '<%- project.dist_src %>/css/style.min.css': '<%- project.css %>'
        }
      }
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost:<%- connect.options.port %>'
      }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      concat: {
        files: 'src/js/{,*/}*.js',
        tasks: ['concat:dev', 'jshint']
      },
      sass: {
        files: 'src/scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%- project.app %>/{,*/}*.html',
          '<%- project.assets %>/css/{,*/}*.css',
          '<%- project.assets %>/js/{,*/}*.js',
          '<%- project.assets %>/images/{,*/}*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,webp,WEBP,svg,SVG}'
        ]
      }
    }
  });

  /**
   * Default task
   * Run `grunt` on the command line
   */
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

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then clean, copy, minify and optimize content for distribution
   */
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
};