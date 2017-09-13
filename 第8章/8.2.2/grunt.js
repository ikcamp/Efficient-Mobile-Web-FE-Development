
// 包装函数
module.exports = function (grunt) {
	// 任务配置，所有插件的配置信息
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// uglify插件
		uglify: {
			// 插件的配置信息
			options: {
				beautify: true,//是否压缩
				mangle: false, //不混淆变量名
				compress: true,//打开或关闭使用默认选项源压缩
			},
			// 插件执行的任务
			app_task: {
				files: {
					'build/app.min.js': ['lib/index.js', 'lib/test.js']
				}
			}
		}
	});
	// 告诉Grunt使用的插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// 告诉Grunt需要执行的任务
	grunt.registerTask('default', ['uglify']);
};

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	uglify: {
		options: {
			banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build: {
			src: 'src/<%= pkg.name %>.js',
			dest: 'build/<%= pkg.name %>.min.js'
		}
	}
});

module.exports = function(grunt) {
    grunt.registerTask('mytask', '自定义任务：输出参数内容', function(arg) {
    	grunt.log.writeln('任务' + this.name + "的参数是：" + arg);
    });
};