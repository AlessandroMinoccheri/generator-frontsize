'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

Generator.prototype.frontsizeFiles = function frontsizeFiles() {
  this.bowerInstall('frontsize-sass', { save: true });
};
