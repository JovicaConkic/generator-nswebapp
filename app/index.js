'use strict';

var generators = require('yeoman-generator'),
    _ = require('lodash'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    chip = require('chip')();

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        
        this.argument('appname', { type: String, required: true });
        
        chip('Application Name (arg): ' + this.appname);
        this.appname = _.kebabCase(this.appname);
    },
    
    initializing: function() {
        this.pkg = {
            name: '<%= pkg.name %>',
            title: '<%= pkg.title %>',
            url: '<%= pkg.url %>',
            author: '<%= pkg.author %>',
            version: '<%= pkg.version %>',
            copyright: '<%= pkg.copyright %>',
            license: '<%= pkg.license %>'
        };
        this.project = {
            src: '<%= project.src %>',
            dist: '<%= project.dist %>',
            dist_src: '<%= project.dist_src %>',
            app: '<%= project.app %>',
            index: '<%= project.index %>',
            assets: '<%= project.assets %>',
            css: '<%= project.css %>',
            js: '<%= project.js %>'
        };
        this.tag = {
            banner: '<%= tag.banner %>'
        };
        this.connect = {
            options: {
                port: '<%= connect.options.port %>'
            }
        };
    },
    prompting: function() {
        this.log(yosay('Welcome to ' + chalk.yellow.bold('NSWD WebApp') + ' Generator!\n'));
        
        var dependencyPrompt = {
            type: 'checkbox',
            name: 'dependencies',
            message: 'Which Third party Libraries would you like to include?',
            choices: [{
                name: 'bootstrap: v3.3.6',
                value: 'bootstrap',
                checked: false
            },{
                name: 'jquery: ^2.2.1',
                value: 'jquery',
                checked: false
            }]
        };
        
        var promptArray = [];
        
        if(!this.options['skip-install']) {
            promptArray.push(dependencyPrompt);
        }
        
        return this.prompt(promptArray).then(function(answers) {
            this.config.set('webappname', _.camelCase(this.appname));
            this.config.save();
            
            if(!this.options['skip-install']) {
                this.includeBootstrap = _.includes(answers.dependencies, 'bootstrap');
                this.includeJquery = _.includes(answers.dependencies, 'jquery');
                this.config.set('bootstrap', this.includeBootstrap);
                this.config.set('jquery', this.includeJquery);
                
                this.log('\n');
                if(!this.includeBootstrap) {
                    chip('By default, following library will be installed:')
                    chip.info('bootstrap-css-only: ^3.3.6');
                    this.log('\n');
                }
                chip('Additional Third party libraries will be installed:');
                this.includeBootstrap ? chip.info('bootstrap: v3.3.6') : chip.error('bootstrap: v3.3.6');
                this.includeJquery ? chip.info('jquery: ^2.2.1\n') : this.includeBootstrap ? chip.info('jquery: ^2.2.1 (bootstrap dependency)\n') : chip.error('jquery: ^2.2.1\n');
            }
        }.bind(this));
    },
    configuring: function() {
    },
    writing: {
        gruntfile: function() {
            this.copy('_Gruntfile.js', 'Gruntfile.js'),
            {
                pkg: this.pkg,
                project: this.project,
                tag: this.tag,
                connect: this.connect
            }
            this.copy('jshintrc', '.jshintrc');
        },
        packageJSON: function() {
            this.copy('_package.json', 'package.json');
        },
        git: function() {
            this.composeWith('common', {
                options: {
                    'skip-messages': true,
                    gitignore: true,
                    gitattributes: true,
                    jshintrc: false,
                    editorconfig: false,
                    'test-jshintrc': false                   
                }
            },
            {
                local: require.resolve('generator-common')
            });
        },
        travis: function() {
            this.composeWith('travis', {
                options: {}
            },
            {
                local: require.resolve('generator-travis')
            });
        },
        bower: function() {
            if(!this.options['skip-install'] || !this.config.get('bowerInstalled')) {
                var bowerJson = {
                    name: this.appname,
                    license: 'MIT',
                    dependencies: {},
                    devDependencies: {},
                    overrides: {}
                };
            
                if(!this.includeBootstrap) {
                    bowerJson.dependencies['bootstrap-css-only'] = '^3.3.6';
                }   
                if(this.includeBootstrap) {
                    bowerJson.dependencies['bootstrap'] = '^3.3.6';
                    bowerJson.overrides['bootstrap'] = new Object;
                    bowerJson.overrides['bootstrap']['main'] = [
                        'less/bootstrap.less',
                        'dist/css/bootstrap.css',
                        'dist/js/bootstrap.js'
                    ];
                }
                if(this.includeJquery || this.includeBootstrap) {
                    bowerJson.dependencies['jquery'] = '^2.2.1';
                }
                this.fs.writeJSON('bower.json', bowerJson);
                this.copy('bowerrc', '.bowerrc');
                this.config.set('bowerInstalled', true);
            }
        },
        appStaticFiles: function() {
            this.copy('_favicon.ico', 'app/favicon.ico');
            this.directory('src/scss', 'src/scss');
            this.directory('app/css', 'app/assets/css');
            this.directory('app/fonts', 'app/assets/fonts');
            this.directory('app/images', 'app/assets/images');
            this.directory('app/js', 'app/assets/js');
        },
        scripts: function() {
            this.fs.copyTpl(
                this.templatePath('src/js/_script.js'),
                this.destinationPath('src/js/script.js'),
                {
                    jquery: this.config.get('jquery') || false,
                    bootstrap: this.config.get('bootstrap') || false
                }
            );
        },
        html: function() {
            this.fs.copyTpl(
                this.templatePath('_index.html'),
                this.destinationPath('app/index.html'),
                {
                    appname: _.startCase(this.appname),
                    currentYear: new Date().getFullYear()>2016 ? ' - ' + new Date().getFullYear() : ''
                }
            );
        },
    },
    conflicts: function() {
    },
    install: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    },
    end: function() {
        chip(chalk.yellow.bold('Installation successful!\n'));

        var howToInstall =
            'After running ' + chalk.yellow.bold('npm install & bower install') +
            ', enjoy in your work using ' +
            chalk.yellow.bold('NSWD WebApp') + 
            ' Generator.';

        if (this.options['skip-install']) {
            chip(howToInstall);
            return;
        }
    }
});