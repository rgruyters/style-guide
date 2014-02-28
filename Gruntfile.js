module.exports = function(grunt){
  var assetsPath = {
    sass: '_pre/css',
    coffee: '_pre/js',
    css: 'assets/css',
    js: 'assets/js',
    img: '_pre/img',
    build: '_pre/build'
  };

  grunt.initConfig({
    assetsPath: assetsPath,
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
          cwd: '<%= assetsPath.sass %>',
          src: ['*.scss'],
          dest: '<%= assetsPath.css %>',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version'],
        cascade: true,
        map: true
      },
      no_dest: {
        src: '<%= assetsPath.css %>/!(*.min).css'
      }
    },

    cssmin: {
      options: {
        report: 'min'
      },
      prod: {
        files: {
          '<%= assetsPath.css %>/main.min.css': [
            '<%= assetsPath.css %>/*.css',
            '!<%= assetsPath.css %>/*.min.css'
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
        '<%= assetsPath.css %>/**/*',
        '<%= assetsPath.js %>/**/*',
        '<%= assetsPath.build %>/**/*'
      ]
    },

    coffee: {
      build: {
        expand: true,
        flatten: true,
        cwd: '<%= assetsPath.coffee %>',
        src: ['*.coffee'],
        dest: '<%= assetsPath.build %>',
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
      all: ['<%= assetsPath.build %>/*.js', 'Gruntfile.js']
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
        src: ['<%= assetsPath.build %>/**/*.js'],
        dest: '<%= assetsPath.js %>/main.js'
      }
    },

    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: '<%= assetsPath.build %>'
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
          '<%= assetsPath.sass %>/**/*'
        ],
        tasks: ['sass:build', 'autoprefixer', ],
      },

      js: {
        files: [
          '<%= assetsPath.coffee %>/**/*'
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
  grunt.registerTask('build', ['clean', 'build_css', 'build_js', 'imagemin', 'cssmin', 'uglify']);
  grunt.registerTask('release', ['build']);
};
