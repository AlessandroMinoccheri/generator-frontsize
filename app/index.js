'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.frontsizeFiles = function frontsizeFiles() {
  this.bowerInstall('frontsize-sass', { save: true });
};
