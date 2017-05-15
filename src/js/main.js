$(function(){
	$("img.lazy").lazyload({
		effect : "fadeIn",
		threshold: -300
	});
	if($("#slider .item").length > 1){
		$("#slider").slick({
			//lazyLoad: 'ondemand',
			slidesToShow: 1,
			slidesToScroll: 1,
			pauseOnHover: false,
			autoplay: true,
			pauseOnFocus: false
		});
	}
	$('.jarallax').jarallax({
		speed: 0.3,
		imgWidth: 992,
		imgHeight: 1172
	});
	$('*[data-toggle=tooltip]').tooltip();
	if(typeof window.thankZayavTpl != "undefined"){
		var c = $('<div class="box-modal" />');
			c.html(thankZayavTpl);
		c.prepend('<div class="box-modal_close arcticmodal-close">X</div>');
		$.arcticmodal({
			content: c
		});
	}
	setTimeout(function(){
		$(window).trigger('resize');
	}, 20);
});