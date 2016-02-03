'use strict';

var fs = require('fs');
var mv = require('mv');
var async = require('async');
var mkdirp = require('mkdirp');
var absorb = require('absorb');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var pathInstall = '';

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
    },{
        when: function (response) {
            return response.install == 'yes';
        },
        type: 'input',
        name: 'path',
        message: 'Where do you want to install frontsize theme? (Ex: css/frontsize/your_theme_name)',
        defaults: 'css/frontsize'
    }];

    this.prompt(prompts, function (props) {
        this.pathInstall = props.path;
        cb();
    }.bind(this));
};

Generator.prototype.frontsizeFiles = function frontsizeFiles() {
    var here = this;
    //async.parallel([
        //function(callback){
            console.info('download');
            here.bowerInstall('frontsize-sass', { save: true });
        //    callback(null, 'xyz\n');
        //}], 
        //function(error, results) {
            console.info('callback');
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
                }
                else{
                    packageJsonRoot.dependencies = dependenciesFrontsize;
                }
    
                fs.writeFile('./package.json', JSON.stringify(packageJsonRoot, null, 2), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                }); 
            }
            else{
                fs.createReadStream(directory + '/frontsize-sass/package.json').pipe(fs.createWriteStream('./package.json'));
            }
    
            //quando inserisco il path devo verificare che non esista e lo creo, se esiste gia la cartella theme al suo interno dare errore
            if(fs.exists(here.pathInstall)){
                return console.log('Path already exist!');
            }
            else{
                //create directory
                mkdirp(here.pathInstall);
    
                //move files
                mv(directory + '/frontsize-sass/themes/default/', here.pathInstall + '/', {mkdirp: true}, function(err) {
                    return console.log('Error moving files! ' + err);
                });
            }
        //}
    //);
};
