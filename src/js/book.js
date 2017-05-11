$(function(){
	window.onLoadThumbFn = function(){
		if(_thumbPreview){
			setTimeout(function(){
				var _ws = $(_thumbPreview).parent().outerWidth(),
					_w = -($(_thumbPreview).outerWidth() - _ws) / 2;
				$(_thumbPreview).css({
					left: _w
				});
			}, 200);
		}
	}
	// book
	if("object" == typeof window.CatalogAvon){
		window.widthCatalog = 10;
		window.heightCatalog = 10;
		window.pageWidth = 10;
		window.pageHeight = 10;
		window.fnImg = function(a) {
			var b = $(a),
				c = b.attr("data-page"),
				d = b.parent();
			$(".divshadow", d).removeClass("preloader"), $(".page.p" + c + " .divshadow").removeClass("preloader"), setTimeout(function(a) {
				$("img", $(a)).removeClass("imghide");
				d.removeClass("preloader");
			}, 100, d)
		};
		var cat = window.CatalogAvon,
			$canvas = $("#canvas"),
			media = "https://my.avon.ru/media/brochure/ru-ru/",
			globalData = [],
			ajaxCatalog = null,
			view_catalog = -1,
			view_page = 0,
			book = $(".sj-book"),
			pages = [],
			countPages = pages.length,
			broshure = null,
			jsonfile = "",
			$button = $("#dropLabel"),
			$labelCatalog = $('.labelCatalog', $button),
			selectCatalogFn = function(e){
				e.preventDefault();
				var $this = $(this),
					title = $this.attr('data-title'),
					folder = parseInt($this.attr('data-folder')),
					time = "?"+(new Date()).getTime();
				if(view_catalog != folder){
					if(view_catalog != -1){
						$("#sliderbar").slider("destroy");
						book.turn("destroy");
						$("#slider-bar").removeClass("turnjs-slider");
					}
					$canvas.removeClass("select-none").addClass("select").addClass("preloader");
					$('.book-avoncatalog').addClass('scaling');
					$("#slider-bar").hide();
					$(".book-nav").hide();
					view_catalog = parseInt(folder);	
					$labelCatalog.text(title);
					broshure = cat.broshures[view_catalog];
					jsonfile = broshure.json + time;
					$('.catalogDropDown li').removeClass('active');
					$('.catalogDropDown li a[data-folder='+folder+']').parent().addClass('active');
					$(".catalogouter_wrapper_products").empty();
					ajaxCatalog && ajaxCatalog.abort();
					setTimeout(function() {
						view_page = 0;
						ajaxCatalog = $.ajax({
							type: "GET",
							url: jsonfile,
							dataType: "json",
							success: loadJsonFileFn,
							error: function(a) {
								ajaxCatalog = null;
								view_catalog = -1;
								//c.text("Ошибка загрузки. Попробуйте ещё раз.")
							}
						})
					}, 40);
				}
				$(document).trigger('click.bs.dropdown.data-api');
				return !1;
			},
			loadJsonFileFn = function(data){
				view_page = 1;
				if("object" == typeof data.Pages){
					pages = [];
					globalData = data.Pages;
					var pg = data.Pages,
						width = 1,
						height = 1,
						j = 0,
						$cw = $canvas.outerWidth()-40;
						// 201706/004/p006.jpg
					for (j; j<pg.length; ++j){
						window.pageWidth = pg[j].Width;
						window.pageHeight = pg[j].Height;
						
						widthCatalog = $cw;
						heightCatalog = ($cw / (window.pageWidth * 2)) * window.pageHeight;
						pages.push({
							page: cat.broshures[view_catalog].media + "p" + String(pg[j].Index).leftPad(3, "0") + ".jpg",
							thumb: cat.broshures[view_catalog].media + "t" + String(pg[j].Index).leftPad(3, "0") + ".jpg"
						});
						var img = new Image;
						img.src = cat.broshures[view_catalog].media + "t" + String(pg[j].Index).leftPad(3, "0") + ".jpg"
					}
					countPages = pages.length;
					$("#slider-bar").show();
					$(".book-nav").show();
					makeBookFn();
					setTimeout(function(){
						$('.book-avoncatalog').removeClass('scaling');
					}, 1000);
				}
			},
			makeBookFn = function(){
				$("#slider-bar").addClass("turnjs-slider");
				$canvas.removeClass("select-none").removeClass("preloader");
				window._thumbPreview = null;
				$("#sliderbar").slider({
					min: 1,
					max: countPages,
					start: function(a, b) {
						window._thumbPreview ? slideFn(b.value) : (
							window._thumbPreview = $("<div />", {
								"class": "thumbnail"
							}).html("<div></div>"), slideFn(b.value), window._thumbPreview.appendTo($(b.handle)))
					},
					slide: function(a, b) {
						slideFn(b.value)
					},
					stop: function() {
						if(window._thumbPreview){
							_thumbPreview.removeClass("show");
							$(".sj-book").turn("page", Math.max(1, $(this).slider("value")));
						}
					}
				});
				book.turn({
					elevation: 50,
					acceleration: false,
					autoCenter: !0,
					gradients: !0,
					duration: 800,
					pages: countPages,
					width: widthCatalog,
					height: heightCatalog,
					page: view_page,
					display: 'double',
					when: {
						turning:  function(a, b, c) { //function(e, page, view) {
							var d = $(this),
								e = d.turn("page"),
								f = d.turn("pages");
							if (e > 3 && f - 3 > e) {
								if (1 == b){
									return d.turn("page", 2).turn("stop").turn("page", b);
									a.preventDefault();
								}
								if (b == f){
									return d.turn("page", f - 1).turn("stop").turn("page", b);
									a.preventDefault();
								}
							} else if (b > 3 && f - 3 > b) {
								if (1 == e){
									return d.turn("page", 2).turn("stop").turn("page", b);
									a.preventDefault();
								}
								if (e == f){
									return d.turn("page", f - 1).turn("stop").turn("page", b);
									a.preventDefault();
								}
							}
							turnPageFn(d, b)
						},
						turned: function(a, b, d) {
							var e = $(this);
							turnPageFn(e);
							var numPage = getPageFn(e, b);
							$("#sliderbar").slider("value", numPage);
							e.turn("center");
							f = !1;
							// вывод продукции
							var dub = numPage % 2,
							outPages = {
								double: !(numPage == 1 || numPage == countPages),
								start: dub == 0 ? (numPage == countPages ? countPages : numPage) : (numPage == countPages ? countPages : (numPage==1 ? numPage : numPage-1)),
							};
							outPagesFn(outPages);
						},
						start: function(a, b) {
							//A(!0)
						},
						end: function(a, b) {
							var c = $(this);
							turnPageFn(c);
							setTimeout(function() {
								$("#sliderbar").slider("value", getPageFn(c))
							}, 1);
							//A(!1)
						},
						missing: function(a, b) {
							for (var c = 0; c < b.length; c++){
								preloadTurnPageFn(b[c], $(this), c);
							}
						}
					}
				})
			},
			slideFn = function(val) {
				var b = pages[val - 1].thumb,
					$thm = $(_thumbPreview),
					c = $thm.children(":first"),
					ws = c.outerWidth(),
					w = -(($thm.outerWidth() - $thm.parent().outerWidth()) / 2);
					1 == val || val == $("#sliderbar").slider("option", "max") ? 1 : 2;
				$thm.addClass("no-transition").css({
					left: w
				}), c.css({
					position: "relative"
				}).attr({
					"data-page": val
				}).html('<img class="img-responsive thumbnail-catalog" src="' + b + '" onload="onLoadThumbFn()" />'), ("" === c.css("background-image") || "none" == c.css("background-image")) && (c.css({
					//backgroundImage: "url(" + b + ")"
					
				}), setTimeout(function() {
					$thm.removeClass("no-transition").css({
						left: w
					})
				}, 0))
				setTimeout(function() {
					$thm.removeClass("no-transition").css({
						left: w
					})
				}, 200);
			},
			getPageFn = function(a, b) {
				return parseInt(b || a.turn("page"), 10);
			},
			turnPageFn = function(a, b) {
				a.turn("page");
				a.turn("pages");
			},
			preloadTurnPageFn = function(a, b,c) {
				b.turn("pages");
				if (!b.turn("hasPage", a)) {
					var c = pages[a - 1].page,
						d = $("<div />", {
							"class": "own-size preloader",
							/*css: {
								width: widthCatalog,
								height: heightCatalog
							}*/
						}).append($("<div />", {
							"class": "divshadow preloader"
						})).append($("<img />").attr({
							"class": "img-responsive imghide",
							"data-page": a,
							src: c,
							onload: "fnImg(this)",
							onerror: "fnImg(this)"
						})).append(
							$("<span />", {
								'class': "zoom-img icon-zoom-in",
								'data-src': c
							})
						);/*.css({
							width: widthCatalog,
							height: heightCatalog
						})*/
					b.turn("addPage", d, a)
				}
			},
			outPagesFn = function(ob) {
				var data = {},
				debug = {},
					i = 0,
					k = 0,
					prod = [],
					hotsposts = null,
					vp = view_page;
				if(vp != ob.start){
					view_page = ob.start;
					hotsposts = globalData[ob.start-1].Hotspots;
					for(i = 0; i<hotsposts.length; ++i){
						prod = hotsposts[i].Products;
						for(k=0;k<prod.length;++k){
							data["Product_"+prod[k].ProductId] = prod[k];
						}
					}
					if(ob.double){
						hotsposts = globalData[ob.start].Hotspots;
						for(i = 0; i<hotsposts.length; ++i){
							prod = hotsposts[i].Products;
							for(k=0;k<prod.length;++k){
								data["Product_"+prod[k].ProductId] = prod[k];
							}
						}
					}
					var fid = [],
						hhh = $(".catalogouter_wrapper_products").height();
					$(".catalogouter_wrapper_products").slideUp('slow', function(){
						
					});
					$.each(data, function(){
						fid.push(this.ProductId);
						//https://my.avon.ru/assets/ru-ru/images/product/prod_1146776_1_310x310.jpg
						/*tpl += "<div class=\"ProductItem\">";
							tpl += "<p>"+this.ProductName.split(";")[0]+"</p>";
							tpl += "<div class=\"ProductImage\">";
								tpl += "<img class=\"img-responsive\" src=\"https://my.avon.ru/assets/ru-ru/images/product/prod_"+this.ProductId+"_1_310x310.jpg\"/>";
							tpl += "</div>";
						tpl += "</div>";
						console.log("ProductName", this.ProductName);*/
					})
					//tpl += "</div>";
					
					if(fid.length){
						var req = "/api.json?m="+fid.join(",");
						$.ajax({
							type: "GET",
							url: req,
							dataType: "json",
							success: function(d){
								//console.log(d)
								$(".catalogouter_wrapper_products").empty();
								var tpl = "",
									pi = 0;
								$.each(d, function(){
									this.sale = this.sale + "";
									tpl += "<div class=\"ProductItem container\">";
										tpl += "<div class=\"ProductItemDiv\">";
											tpl += "<h4 class=\"ProductItem_title\">"+this.name+"</h4>";
											tpl += "<div class=\"ProductItem_image ProductAvonImage\">";
												tpl += this.sale.length > 1 ? "<span class=\"ProductItem_price\">"+this.sale+"</span>" : "";
												tpl += "<img class=\"img-responsive\" src=\""+window.avonCdn+this.thumb+"\" data-href=\""+window.avonCdn+this.image+"\" data-position=\""+pi+"\" width=\"310\" height=\"310\" alt=\""+this.name+"\" data-sale=\""+this.sale+"\" data-code=\""+(this.code != null ? this.code : 0)+"\" />";
												tpl += this.code != null ? "<span class=\"ProductItem_code\">"+this.code+"</span>" : "";
											tpl += "</div>";
											tpl += "<div class=\"ProductItem_description text-justify\">"+this.description+"</div>";
										tpl += "</div>";
									tpl += "</div>";
									++pi;
								})
								if(pi!=0){
									tpl = "<div class=\"ProductsWrapper row\">"+tpl+"</div>";
									$(".catalogouter_wrapper_products").css({height: 'auto'}).html(tpl).slideDown(200, 'swing', function(){
										$(".catalogouter_wrapper_products").css({height: 'auto'});
									});
								}else{
									$(".catalogouter_wrapper_products").empty().css({height: 'auto'});
								}
								$(".catalogouter_wrapper_products *").hyphenate('ru');
							},
							error: function(a) {
								//ajaxCatalog = null;
								//view_catalog = -1;
								//c.text("Ошибка загрузки. Попробуйте ещё раз.")
							}
						});
					}
				}
			},
			onResizedFn = function(e){
				if(view_catalog != -1){
					book.turn("destroy");
					$("#sliderbar").slider("destroy");
					var $cw = $canvas.outerWidth()-40;
					widthCatalog = $cw;
					heightCatalog = ($cw / (window.pageWidth * 2)) * window.pageHeight;
					makeBookFn();
				}
			};
		$('.left, .right', $('.book-nav')).on('click', function(e){
			e.preventDefault();
			if(view_catalog != -1){
				$(this).hasClass('left') && book.turn('previous');
				$(this).hasClass('right') && book.turn('next');
			}
			return !1;
		});
		$(window).on('resize', onResizedFn);
		$('.catalogDropDown li a, a.select_catalog').on('click', selectCatalogFn);
		$(".catalogouter_wrapper_products").on("click", '.ProductItem_description img', function(e){
			e.preventDefault();
			var data = [{
				src: $(this).attr("src")
			}];
			$.fancybox.open(data, {
				loop : false,
				touch : {
					vertical : true
				}
			});
			return !1;
		});
		$(".catalogouter_wrapper_products").on("click", ".ProductAvonImage", function(e){
			e.preventDefault();
			var imgs = $('.catalogouter_wrapper_products .ProductAvonImage img'),
				data = [],
				position = $("img", this).attr("data-position");
			$.each(imgs, function(){
				data.push({
					src : $(this).attr("data-href"),
					opts: {
						caption: $(this).attr("alt")+($(this).attr("data-sale") != "" ? "<br>"+$(this).attr("data-sale") : "")+($(this).attr("data-code")+"" != "0" ? "<br>Код: "+$(this).attr("data-code") : "")
					}
				});
			});
			console.log(position);
			$.fancybox.open(data, {
				loop : false,
				touch : {
					vertical : true
				}
			}, position);
			return !1;
		});
		$(".sj-book").on("click", ".zoom-img", function(e){
			
			$.fancybox.open([{
					src: $(this).attr("data-src")
				}], {
				loop : false,
				touch : {
					vertical : true
				}
			});
			setTimeout(function(){
				$.fancybox.getInstance().scaleToActual(0, 0, 700);
			}, 200);
		})
	}
});