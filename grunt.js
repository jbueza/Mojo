module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    // Project metadata, used by some directives, helpers and tasks.
    meta: {},
    // Lists of files to be concatenated, used by the "concat" task.
    concat: {
      dist: {
        src:  [ 'LICENSE'
              , 'support/mustache.js'
              , 'src/Core.js'
              , 'src/Helper.js'
              , 'src/Messaging.js'
              , 'src/Model.js'
              , 'src/Request.js'
              , 'src/Controller.js'
              , 'src/Application.js'
              , 'src/Service.js'
              , 'src/ServiceLocator.js'
              ],
        dest: 'dist/mojo.js'
      }
    },
    // Lists of files to be linted with JSHint, used by the "lint" task.
    lint: {},
    // Lists of files to be minified with UglifyJS, used by the "min" task.
    min: {
      dist: {
        src: ['dist/mojo.js'],
        dest: 'dist/mojo.min.js'
      }
    },
    // Lists of files or URLs to be unit tested with QUnit, used by the "qunit" task.
    qunit: {},
    // Configuration options for the "server" task.
    server: {},
    // Lists of files to be unit tested with Nodeunit, used by the "test" task.
    test: {},
    // Configuration options for the "watch" task.
    watch: {},
    // Global configuration options for JSHint.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: { jQuery: true }
    },
    // Global configuration options for UglifyJS.
    uglify: {}
  });
  
  grunt.registerTask('default', 'concat min');
};