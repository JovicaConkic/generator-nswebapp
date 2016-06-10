'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('Web application:', function() {
    this.timeout(0);
    describe('WEB app - Default Test', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../app'))
                .withArguments(['myCoolApp'])
                .withOptions({ skipInstall: true })
                .on('end', done);
        });
        
        it('creates files', function() {
            assert.file([
                'package.json',
                'src/js/script.js',
                '.bowerrc',
                '.gitignore',
                '.jshintrc',
                'bower.json',
                'Gruntfile.js'
            ])
        });
        
        it('script.js to have "use strict" defined ', function() {
            assert.fileContent('src/js/script.js', /'use strict'/);
        });
    });
    
    describe('WEB app - Prompt Test', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../app'))
                .withArguments(['myCoolApp'])
                .withOptions({ skipInstall: true })
                .on('end', done);
        });
        
        it('injects webpage title', function() {
            assert.fileContent('app/index.html', /<title>My Cool App<\/title>/);
        });
        
    });
});