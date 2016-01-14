'use strict';
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

  if(this.install == 'yes'){
    
  }
  else{
    
  }
};
