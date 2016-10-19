module.exports = function(grunt) {

  grunt.initConfig({
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'lib/server.js'
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'utils/**/*.js'],
      options: {
        esversion: 6,
        globals: {
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint','express:dev'],
      options: {
        spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
      }
    },
    bower_concat: {
      all: {
        dest: {
          'js': 'public/_bower.js',
          'css': 'public/_bower.css'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-bower-concat');

  grunt.registerTask('default', ['express:dev', 'watch']);

};
