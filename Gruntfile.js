module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      css: {
        files: [
          'assets/_scss/**/*'
        ],
        tasks: ['sass:build', 'autoprefixer']
      },
    },

    sass: {
      build: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'assets/_scss',
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
      prod: {
        files: {
          'assets/css/main.min.css': [
            'assets/css/*.css',
            '!assets/css/*.min.css'
          ]
        }
      }
    },

    clean: {
      build: [ 'assets/css/*.min.css']
    }
  });

  // Load the Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Register the default tasks.
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build',
    [
      'clean',
      'sass:build',
      'autoprefixer'
    ]
  );
  grunt.registerTask('release',
    [
      'build',
      'cssmin'
    ]
  )
};