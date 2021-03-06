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

Generator.prototype.install = function downloadFiles() {
    console.info('download');
    this.bowerInstall('frontsize-sass', { save: true });
};

Generator.prototype.end = function moveFiles() {
    console.info('move');
    var here = this;
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

        if(here.pathInstall.substr(here.pathInstall.length - 1) != '/'){
            here.pathInstall = here.pathInstall + '/';
        }

        //move themes directory
        mv(directory + '/frontsize-sass/themes/default/', here.pathInstall, {mkdirp: true}, function(err) {
            if((err != undefined) && (err != null)){
                return console.log('Error moving theme files! ' + err);
            }
            else{
                mv(directory + '/frontsize-sass/compile.scss', here.pathInstall + 'compile.scss', function(err) {
                    if((err != undefined) && (err != null)){
                        return console.log('Error moving file compile.scss! ' + err);
                    }
                    else{
                        mv(directory + '/frontsize-sass/gulpfile.js', 'gulpfile.js', function(err) {
                            if((err != undefined) && (err != null)){
                                return console.log('Error moving file gulpfile.js! ' + err);
                            }
                            else{
                                mv(directory + '/frontsize-sass/frontsize.yml.dist', 'frontsize.yml', function(err) {
                                    if((err != undefined) && (err != null)){
                                        return console.log('Error moving file frontsize.yml! ' + err);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};
