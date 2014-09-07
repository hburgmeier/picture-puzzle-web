function blur(canvas, image, time, done, cancelFct, roundOptions)
{
	var startRadius = time*2;

	var options = {
			radius:startRadius,
	};
	$.extend(options, roundOptions);
	
	var delta = options.radius / (time*2);
	
	var redraw = function(_options)
	{
		_options.radius-=delta;
		if (cancelFct.isCancel())
		{
			_options.radius = 0;
		}
		if (_options.radius < 0)
		{
			if (done)
				done();
		} else
			setTimeout(blurImage, 500, image, canvas, _options);
	};
	options.doneFct = redraw;

	var aspect_x = 900 / image.width;
	var aspect_y = 500 / image.height;
	
	var aspect = Math.min(aspect_x, aspect_y);
	
	var real_img_x = Math.floor(image.width * aspect);
	var real_img_y = Math.floor(image.height * aspect);
	
	var puzzleView = $("#puzzle");

	puzzleView.empty();
	puzzleView.append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="'+real_img_x+'" height="'+real_img_y+'"><defs><filter id="blurFilter" in="SourceGraphic"><feGaussianBlur id="gauss" stdDeviation="2"/></filter></defs><g filter="url(#blurFilter)"><image width="'+real_img_x+'" height="'+real_img_y+'" xlink:href="'+image.src+'"></image></g></svg>');
	
	blurImage(image, canvas, options);
}

function blurImage(image, canvas, options)
{
	var blur10 = document.getElementById("gauss");
	if (blur10)
	{
		blur10.setAttribute("stdDeviation", Math.floor(options.radius));
		if ($.isFunction(options.doneFct))
			options.doneFct(options);
	}
}
