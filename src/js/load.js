var tmpd = "/assets/templates/projectsoft",
	stamp = "?v="+(new Date()).getTime();
yepnope({
	nope:{
			style: tmpd + "/css/main.css"+stamp,
			book: tmpd + "/css/book.css"+stamp,
			app:tmpd + "/js/app.js"+stamp,
			hypher:tmpd + "/js/hypher.js"+stamp,
			main:tmpd + "/js/main.js"+stamp,
		},
	callback:{
		style: function(){
			/*var body = document.getElementsByTagName("body");
			body[0].style.display = "initial";*/
		},
		app: function(){
			$('body').removeClass("preloadpage");
		},
		main: function() {
			yepnope({
				test:"object" == typeof window.CatalogAvon,
				yep:{
					js: tmpd + "/js/book.js"+stamp
				}
			});
		},
		book: function() {
			setTimeout(function(){$('.catalog > .container > .row').slideDown("slow");}, 500);
		},
		hypher: function(){
			$('.agent-step li p, .hypher, .hypher *').hyphenate('ru');
		}
	}
});