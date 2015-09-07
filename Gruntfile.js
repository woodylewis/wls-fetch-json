module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: false,
                    cleancss: false,
                    optimization: 2,
                    dumpLineNumbers: 'false'
                },
                files: {
                    "app/css/skeleton.css": "app/less/skeleton.less",
                    "app/css/wls.css": "app/less/wls.less",
                    "app/css/app.css": "app/less/app.less",
                }
            }
        },

        watch: {
            options: {
                livereload: false,
            },
            styles: {
                files: ['app/less/**/*.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['less', 'watch']);
};