module.exports = function (grunt) {
    grunt.initConfig({
        // 内联图片文件的配置
        inline: {
            page: {
                src: ['index.html']
            }
        },
        // 压缩CSS和JavaScript文件的配置
        uglify: {
            dist: {
                files: {
                    'dist/js/album.min.js': ['src/js/album.js']
                }
            }
        },
        // 压缩CSS文件的配置
        cssmin: {
            dist: {
                files: {
                    'dist/css/reset.min.css': ['src/css/reset.css'],
                    'dist/css/album.min.css': ['src/css/album.css']
                }
            }
        },
        // 合并多个文件的配置
        concat: {
            dist: {
                src: ['dist/css/reset.min.css', 'dist/css/album.min.css'],
                dest: 'dist/css/all.min.css'
            }
        }
    });
    // 加载这些任务
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 默认执行的任务列表
    grunt.registerTask('default', ['inline', 'uglify', 'cssmin', 'concat']);
};