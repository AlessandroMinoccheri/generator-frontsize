/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('assert');

describe('Frontsize generator test', function () {
  beforeEach(function (done) {
    this.bowerInstallCalls = [];

    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('frontsize-sass', [
        '../../app'
      ]);

      // Mock bower install and track the function calls.
      this.app.bowerInstall = function () {
        this.bowerInstallCalls.push(arguments);
      }.bind(this);

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
  });

  it('installs frontsize-sass', function (done) {
    helpers.mockPrompt(this.app, {
      format: 'css'
    });

    this.app.run(function () {
      assert.equal(this.bowerInstallCalls[0][0], 'frontsize-sass');
      done();
    }.bind(this));
  });
});