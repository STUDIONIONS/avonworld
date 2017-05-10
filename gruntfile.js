module.exports = function(grunt){
	var gc = {
		imageNotyfy: __dirname+'\\notify.png',
		minifyHtml: false,
		minifyCss: true
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		less: {
			css: {
				files : {
					'test/css/main.css' : [
						'src/less/main.less'
					]
				},
				options : {
					compress: gc.minifyCss,
					ieCompat: false
				}
			},
			book: {
				files : {
					'test/css/bookstyle.css' : [
						'src/less/bookstyle.less'
					]
				},
				options : {
					compress: gc.minifyCss,
					ieCompat: false
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox 16.0', 'Opera 12.1', "Chrome 26.0"],
				cascade: false
			},
			css: {
				expand: true,
				flatten: true,
				src: [
					'test/css/main.css'
				],
				dest: 'assets/templates/ioweb/css/'
			},
			book: {
				expand: true,
				flatten: true,
				src: [
					'test/css/bookstyle.css'
				],
				dest: 'assets/templates/ioweb/css/'
			}
		},
		uglify : {
			options: {
				ASCIIOnly: true,
				//beautify: true
			},
			app: {
				files: {
					'assets/templates/ioweb/js/' : [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/jquery-ui/jquery-ui.js',
						'bower_components/jquery-mousewheel/jquery.mousewheel.js',
						'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js',
					]
				}
			},
			hypher: {
				files: {
					'assets/templates/ioweb/js/' : [
						'bower_components/hyphernationRUru/dist/jquery.hypher.js',
						'bower_components/hyphernationRUru/dist/ru-ru.js',
					]
				}
			},
			plugins: {
				files: {
					'assets/templates/ioweb/js/plugins.js' : [
						'bower_components/jquery_lazyload/jquery.lazyload.js',
						'bower_components/jquery.maskedinput/dist/jquery.maskedinput.js',
						'bower_components/fancybox/dist/jquery.fancybox.js',
						'bower_components/slick-carousel/slick/slick.js',
						'bower_components/jarallax/jarallax/jarallax.js',
						'bower_components/jarallax/jarallax/jarallax-video.js',
						'bower_components/arcticModal/arcticmodal/jquery.arcticmodal.js',
					]
				}
			},
			book : {
				files: {
					'assets/templates/ioweb/js/main.js': [
						'src/js/turn.js',
						'src/js/book.js'
					]
				}
			},
			main: {
				files: {
					'assets/templates/ioweb/js/main.js': [
						'bower_components/bootstrap/dist/js/bootstrap.js',
						'src/js/main.js'
					]
				}
			}
		},
		imagemin: {
			base: {
				options: {
					optimizationLevel: 5,
					//progressive: true,
					//interlaced: true,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/images/*.{png,jpg,gif,svg}'
						],
						dest: 'assets/templates/ioweb/images/',
						filter: 'isFile'
					}
				]
			},
			css: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/images/css/*.{png,jpg,gif,svg}'
						],
						dest: 'src/images/bin/',
						filter: 'isFile'
					}
				]
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: 'src/fonts',
				src: '**',
				dest: 'assets/templates/ioweb/fonts/',
			},
			bootstrap: {
				expand: true,
				cwd: 'bower_components/bootstrap/dist/fonts',
				src: '**',
				dest: 'assets/templates/ioweb/fonts/',
			},
			slick: {
				expand: true,
				cwd: 'bower_components/slick-carousel/slick/fonts',
				src: '**',
				dest: 'assets/templates/ioweb/fonts/',
			}
		},
		jade: {
			avon: {
				options: {
					pretty: !gc.minifyHtml,
					data: {
						debug: false
					}
				},
				files: {
					"index.html": [
						"src/html/index.jade"
					]
				}
			},
			templates: {
				options: {
					pretty: !gc.minifyHtml,
					data: {
						debug: false
					}
				},
				files: [
					{
						expand: true,
						cwd: 'src/html/includes',
						src: ['*.jade'],
						dest: 'install/assets/chunks/',
						ext: '.tpl'
					}
				]
			}
		},
		usebanner: {
			chunk: {
				options: {
					position: 'top',
					replace: /\s+/,
					process: function (filepath, f1, f2, f3, f4) {
						var arr = [].slice.call(arguments, 0);
						grunt.log.oklns(arr[0]);
						return grunt.template.process(
							"/** \n"+
							" * <%= filename %>\n"+
							" * \n"+
							" * <%= template %> Templates AVON BUSINES\n"+
							" * \n"+
							" * @category	chunk\n"+
							" * @version		1.0\n"+
							" * @license		http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)\n"+
							" * @internal	@modx_category Templates AVON BUSINES\n"+
							" * @internal	@installset base\n"+
							" * @internal	@overwrite false\n"+
							" */\n",
							{
								data: {
									filename: filepath.match(/\/([^/]*)\.tpl$/)[1],
									template: String(filepath.match(/\/([^/]*)\.tpl$/)[1]).toUpperCase(filepath.match(/\/([^/]*)\.tpl$/)[1])
								}
							}
						);
					}
				},
				files: {
					src: ['install/assets/chunks/*.tpl']
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			html: {
				files: [
					'src/html/**/*.jade',
				],
				tasks: ["jade","usebanner","notify:done"]
			},
			js: {
				files: [
					'src/js/**/*.js'
				],
				tasks: ['notify:watch', 'uglify:main', 'uglify:plugins', 'uglify:book','notify:done']
			},
			css: {
				files: [
					'src/less/**/*.{css,less}',
				],
				tasks: ['notify:watch', 'less', 'autoprefixer','notify:done']//
			},
			images: {
				files: [
					'src/images/*.{png,jpg,gif,svg}',
					'src/images/css/*.{png,jpg,gif,svg}'
				],
				tasks: ['notify:watch', 'newer:imagemin', 'less', 'autoprefixer','notify:done']//
			}
		},
		notify: {
			watch: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: 'Запуск',
					image: '<%= globalConfig.imageNotyfy %>'
				}
			},
			done: {
				options: { 
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: "Успешно Завершено",
					image: '<%= globalConfig.imageNotyfy %>'
				}
			}
		}
	});
	grunt.registerTask('default', 	['notify:watch', 'imagemin', 'less', 'autoprefixer', 'copy', 'uglify', 'jade', 'notify:done']);
	grunt.registerTask('dev', 		['watch']);
}