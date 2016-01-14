'use strict';

var fs = require('fs');
var absorb = require('absorb');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var install = '';

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor(argument) {
    var cb = this.async();
    var options = ['yes', 'no'];
    var prompts = [{
        type: 'list',
        name: 'install',
        message: 'Would you like to install a frontsize theme?',
        choices: options
    }];

    this.prompt(prompts, function (props) {
        this.install = props.install;
        cb();
    }.bind(this));
};

Generator.prototype.frontsizeFiles = function frontsizeFiles() {
    this.bowerInstall('frontsize-sass', { save: true });

    var directory = 'bower_components';
    var pattern = /\/$/;
    if (fs.existsSync('./.bowerrc')) {
        var obj = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));
        if(obj.directory !== undefined){
            directory = obj.directory;
        }
    }
    directory = directory.replace(pattern, '');

    //check if package.json exists in root
    if (fs.existsSync('./package.json')) {
        var dependenciesFrontsize = '';
        var dependenciesRoot = '';
        
        var packageJsonFrontsize = JSON.parse(fs.readFileSync(directory + '/frontsize-sass/package.json', 'utf8'));
        if(packageJsonFrontsize.dependencies !== undefined){
            dependenciesFrontsize = packageJsonFrontsize.dependencies;
        }
        var packageJsonRoot = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if(packageJsonRoot.dependencies !== undefined){
            dependenciesRoot = packageJsonRoot.dependencies;
        }

        if(dependenciesRoot != ''){
            packageJsonRoot.dependencies = absorb(dependenciesRoot, dependenciesFrontsize);
            fs.writeFile('./package.json', JSON.stringify(packageJsonRoot), function(err) {
                if(err) {
                    return console.log(err);
                }

            }); 
        }
        else{

        }
    }
    else{
        fs.createReadStream(directory + '/frontsize-sass/package.json').pipe(fs.createWriteStream('./package.json'));
    }

    if(this.install == 'yes'){
    
    }
    else{
    
    }
};
