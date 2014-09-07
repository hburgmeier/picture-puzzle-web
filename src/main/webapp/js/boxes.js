function boxes(canvas, image, time, done, cancelFct, roundOptions)
{
	
	var options = { size: 8, tick:2 };
	$.extend(options, roundOptions);

	var arr = [];
	for (var i=0;i<options.size*options.size;i++) arr.push(0);
	options.arr = arr;
	
	var delay = Math.ceil(time*1000/(options.size*options.size*options.tick));
	
	var redraw = function(_options){
		_options.count++;
		var _arr = _options.arr;
		var sum = 0;
		$.each(_arr, function(idx, val) { sum+=val; });
		if (sum<_arr.length)
		{
			if (cancelFct.isCancel())
			{
				if (cancelFct.isShow())
				{
					$.each(_arr, function(idx, val) { _arr[idx] = 1; });
				}
			} else {
				if (options.count % options.tick == 0)
				{
				var idx = Math.round(Math.random()*_arr.length);
				while (_arr[idx] > 0)
				{
					idx = Math.round(Math.random()*_arr.length);
				}
				_arr[idx] = 1;
				}
			}
			
			setTimeout(drawImageWithBoxes, delay, canvas, image, _options);
		} else 
		{
			if (done)
				done();
		}
	};
	options.count = -1;
	options.done = redraw;
	drawImageWithBoxes(canvas, image, options);
}

function drawImageWithBoxes(canvas, image, options)
{
	var canvasCenterX = canvas.width / 2;
	var canvasCenterY = canvas.height / 2;
	
	var aspect_x = canvas.width / image.width;
	var aspect_y = canvas.height / image.height;
	
	var aspect = Math.min(aspect_x, aspect_y);
	
	var real_img_x = Math.floor(image.width * aspect);
	var real_img_y = Math.floor(image.height * aspect);	
	
	var imageStartX = canvasCenterX - (real_img_x / 2);
	var imageStartY = canvasCenterY - (real_img_y / 2);
	
	var context = canvas.getContext('2d');
	var canvasBoxWidth = real_img_x / options.size;
	var canvasBoxHeight = real_img_y / options.size;
	
	var imageWidth = image.width / options.size;
	var imageHeight = image.height / options.size;
	
	
	context.fillRect(imageStartX,imageStartY,real_img_x, real_img_y);
	for (var x = 0;x<options.size;x++)
	{
		for (var y = 0;y<options.size;y++)
		{
			if (options.arr[y*options.size+x] > 0)
			{
				context.drawImage(image, x*imageWidth, y*imageHeight, imageWidth+1, imageHeight+1, imageStartX + (x*canvasBoxWidth), imageStartY + (y*canvasBoxHeight), canvasBoxWidth+1, canvasBoxHeight+1);
			}
		}
	}
	
	if ($.isFunction(options.done))
		options.done(options);
}
