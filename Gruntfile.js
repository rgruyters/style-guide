module.exports = function(grunt){
  var assets = {
    sass: '_pre/css',
    coffee: '_pre/js',
    css: 'assets/css',
    js: 'assets/js',
    img: '_pre/img',
    build: '_pre/build'
  };

  grunt.initConfig({
    assets: assets,
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      build: {
        options: {
          style: 'compressed',
          sourcemap: true,
          precision: 7
        },
        files: [{
          expand: true,
          cwd: '<%= assets.sass %>',
          src: ['*.scss'],
          dest: '<%= assets.build %>',
          ext: '.min.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version'],
        map: true
      },
      build: {
        expand: true,
        flatten: true,
        src: '<%= assets.build %>/*.css',
        dest: '<%= assets.css %>/'
      }
    },

    cssmin: {
      options: {
        report: 'min'
      },
      prod: {
        files: {
          '<%= assets.css %>/main.min.css': [
            '<%= assets.css %>/*.css',
            '!<%= assets.css %>/*.min.css'
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
      build: [
        '<%= assets.css %>/**/*',
        '<%= assets.js %>/**/*',
        '<%= assets.build %>/**/*'
      ]
    },

    coffee: {
      build: {
        expand: true,
        flatten: true,
        cwd: '<%= assets.coffee %>',
        src: ['*.coffee'],
        dest: '<%= assets.build %>',
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
        "globals": { "console": true, "module": true },
        indent: 2,
        nomen: true
      },
      all: ['Gruntfile.js', '<%= assets.build %>/*.js']
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
          'assets/js/main.min.js': '<%= concat.dist.dest %>',
        }
      }
    },

    concat: {
      dist: {
        src: ['<%= assets.build %>/**/*.js'],
        dest: '<%= assets.build %>/main-combined.js'
      }
    },

    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: '<%= assets.build %>'
        },
        src: '*/*.js'
      }
    },

    watch: {
      options: {
        livereload: true,
      },

      css: {
        files: [
          '<%= assets.sass %>/**/*'
        ],
        tasks: ['sass:build', 'autoprefixer', ],
      },

      js: {
        files: [
          '<%= assets.coffee %>/**/*'
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-bowercopy');

  // Register the default tasks.
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build_css', ['sass:build', 'autoprefixer']);
  grunt.registerTask('build_js', ['bowercopy', 'coffee', 'jshint', 'concat']);
  grunt.registerTask('build', ['clean', 'build_css', 'build_js', 'imagemin', 'uglify']);
  grunt.registerTask('release', ['build']);
};
