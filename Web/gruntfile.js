module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				banner: '/*! Practice Grunt <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: false
			},
			dist: {
				files: {
					"files/compiled/base.min.js" : ["files/js/base.js"],
					"files/compiled/angular-resource.min.js" : ["files/js/providers/*.js", "files/js/directives/*.js", "files/js/controllers/*.js", "files/js/filters/*.js"]
				}
			}
		},

		less: {
			production: {
				files: {
					"files/compiled/base.css" : "files/css/base.less"
				}
			}
		},

		cssmin: {
			minify: {
				expand: true,
				cwd: "files/compiled/",
				src: "base.css",
				dest: "files/compiled/",
				ext: ".min.css"
			}
		},

		watch: {
			options: {
				livereload: true
			},

			scripts: {
				files: ["files/js/base.js", "files/js/controllers/*.js", "files/js/directives/*.js", "files/js/providers/*.js", "files/js/filters/*.js"],
				tasks: ["uglify"]
			},

			css: {
				files: "files/css/**",
				tasks: ["less","cssmin"]
			},

			html: {
				files: ["*.htm", "partial/*.htm"],
				tasks: []
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify',"less", "cssmin"]);
};