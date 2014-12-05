/**
 * Gruntfile for freedom-for-node
 */
var freedomPrefix = require('path').dirname(require.resolve('freedom'));

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine_node: {
      integration: ['spec']
    },
    copy:{
      'interface-bundle': {
        src: 'freedomjs-interface-bundle.js',
        dest: 'node_modules/'
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },
    'npm-publish': {
      options: {
        // list of tasks that are required before publishing
        requires: [],
        // if the workspace is dirty, abort publishing (to avoid publishing local changes)
        abortIfDirty: true,
      }
    },
    prompt: {
      tagMessage: {
        options: {
          questions: [
            {
              config: 'bump.options.tagMessage',
              type: 'input',
              message: 'Enter a git tag message:',
              default: 'v%VERSION%',
            }
          ]
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-prompt');
  grunt.loadNpmTasks('freedom');

  grunt.registerTask('build', [
    'copy:interface-bundle'
  ]);

  grunt.registerTask('test', [
    'jasmine_node'
  ]);
  
  grunt.registerTask('release', function(arg) {
    if (arguments.length === 0) {
      arg = 'patch';
    }
    grunt.task.run([
      'prompt:tagMessage',
      'bump:'+arg,
      'npm-publish'
    ]);
  });

  grunt.registerTask('default', ['build', 'test']);
};
