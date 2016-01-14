'use strict';

var fs = require('fs');
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

    //check if package.json exists in root
    if (fs.existsSync('./package.json')) {
        console.log('Found file');
    }
    else{
        console.log('Not Found file');
        var directory = 'bower_components';
        if (fs.existsSync('./.bowerrc')) {
            var obj = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));
            if(obj.directory !== undefined){
                directory = obj.directory;
            }
        }
       
        fs.createReadStream('./ ' + directory + 'test.log').pipe(fs.createWriteStream('newLog.log'));
    }

    if(this.install == 'yes'){
    
    }
    else{
    
    }
};
