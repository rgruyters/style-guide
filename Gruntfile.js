module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      build: {
        options: {
          style: 'expanded',
          sourcemap: true,
          precision: 7
        },
        files: [{
          expand: true,
          cwd: '_pre/css',
          src: ['*.scss'],
          dest: 'assets/css',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      no_dest: {
        src: 'assets/css/!(*.min).css'
      }
    },

    cssmin: {
      options: {
        report: 'min'
      },
      prod: {
        files: {
          'assets/css/main.min.css': [
            'assets/css/*.css',
            '!assets/css/*.min.css'
          ]
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: '_pre/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'assets/img/'
        }]
      }
    },

    clean: {
      build: [ 'assets/css/*.min.css']
    },

    coffee: {
      build: {
        expand: true,
        flatten: true,
        cwd: '_pre/js',
        src: ['*.coffee'],
        dest: '<%= coffee.build.cwd %>',
        ext: '.js'
      }
    },

    jshint: {
      options: {
        curly:   true,
        eqeqeq:  true,
        immed:   true,
        latedef: true,
        newcap:  true,
        noarg:   true,
        sub:     true,
        undef:   true,
        boss:    true,
        eqnull:  true,
        browser: true,
        "globals": { "console": true }
      },
      directives: {
        // The number of spaces used for indentation
        indent: 2,
        // browser environment
        browser: true,
        // allow dangling underscores in var names
        nomen: true,
        // allow to do statements
        todo: true,
        // don't require use strict pragma
        // sloppy: true
      },
      beforeconcat: ['<%= concat.dist.src %>'],
      afterconcat: ['<%= concat.dist.dest %>']
    },

    uglify: {
      options: {
        sourceMap: true,
        mangle: {
          except: ['jQuery', 'Backbone']
        }
      },
      prod: {
        files: {
          'assets/js/main.min.js': '_pre/js/main.js',
        }
      }
    },

    concat: {
      dist: {
        src: ['_pre/js/**/*.js'],
        dest: 'assets/js/main.js'
      }
    },

    watch: {
      options: {
        livereload: true,
      },

      css: {
        files: [
          '_pre/css/**/*'
        ],
        tasks: ['sass:build', 'autoprefixer', ],
      },

      js: {
        files: [
          '_pre/js/**/*'
        ],
        tasks: ['build_js', 'uglify']
      },

      images: {
        files: ['img/**/*.{png,jpg,gif}', 'img/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
      }
    }
  });

  // Load the Grunt plugins.
  require('load-grunt-tasks')(grunt);

  // Register the default tasks.
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build_css', ['sass:build', 'autoprefixer']);
  grunt.registerTask('build_js', ['coffee', 'jshint', 'concat']);
  grunt.registerTask('build', ['clean', 'build_css', 'build_js', 'imagemin', 'cssmin', 'uglify']);
  grunt.registerTask('release', ['build'])
};
