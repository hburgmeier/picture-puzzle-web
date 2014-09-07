function spotlight(canvas, image, time, done, cancelFct, roundOptions)
{
	var canvasCenterX = Math.floor(canvas.width / 2);
	var canvasCenterY = Math.floor(canvas.height / 2);
	
	var scale = imageScale(image, canvas);
	
	var coords = {x:canvasCenterX, y:canvasCenterY};
	var angle = ((Math.random()*2)-1)*Math.PI;
	var maxCount = time*1000/10;
	
	var redraw = function(_options){

		var angle = motion(_options.coords, _options.angle, _options.radius, _options.speed, canvas, scale.startX, scale.startY, scale.imageWidth, scale.imageHeight);
		
		if (_options.cnt % 300 == 0 && _options.cnt > 0)
		{
			angle = ((Math.random()*2)-1)*Math.PI;
		}
		
		if (_options.cnt < maxCount)
		{
			_options.angle = angle;
			_options.cnt++;
			if (!cancelFct.isCancel())
			{
				setTimeout(drawSpotlight, 10, canvas, image, _options);
			} else {
				_options.done = null;
				drawSpotlight(canvas, image, _options);
			}
		} else {
			if (done)
			{
				done();
			}
		} 
	};
	var options = {
			coords:coords,
			angle:angle,
			radius:100,
			speed:5,
			cnt:0,
			done:redraw,
			cancelFct:cancelFct
	};
	$.extend(options, roundOptions);
	$("#puzzleCanvas").mousedown(function(){
		options.angle = ((Math.random()*2)-1)*Math.PI;
	});
	drawSpotlight(canvas, image, options, coords, angle, 100, 0);
}

function drawSpotlight(canvas, image, options)
{
	var context = canvas.getContext('2d');
	clearImage(image, canvas, context);
	
	context.save();
	if (!options.cancelFct.isCancel())
	{
		context.beginPath();
		context.arc(options.coords.x, options.coords.y, options.radius, 0, Math.PI*2,true);
		context.clip();
	}
	if (!options.cancelFct.isCancel() || options.cancelFct.isShow())
	{
		drawImage(image, canvas, context);
	}
	
	if (!options.cancelFct.isCancel())
	{
		var gradient = context.createRadialGradient(options.coords.x, options.coords.y, options.radius-10,
				options.coords.x, options.coords.y, options.radius+10);
		gradient.addColorStop(0, 'rgba(255,255,255,0)');
		gradient.addColorStop(1, 'rgba(0,0,0,1)');
		context.fillStyle = gradient;	
		context.fillRect(options.coords.x-options.radius, options.coords.y-options.radius,options.coords.x+options.radius, options.coords.y+options.radius);
	}
	
	context.restore();
	if ($.isFunction(options.done))
		options.done(options);
}

function motion(_coords, _angle, _radius, speed, canvas, startX, startY, imgWidth, imgHeight)
{
	var angle = _angle;
	var recalc = false;
	var dx = _coords.dx;
	var dy = _coords.dy;
	if (dx == undefined || dy == undefined)
		recalc = true;
	
	if (_coords.x+(2*dx) < startX + _radius)
	{
		angle = Math.PI -_angle;
		recalc = true;
	}
	if (_coords.y+(2*dy) < startY + _radius)
	{
		angle = - _angle;
		recalc = true;
	}
	if (_coords.y+(2*dy) > (startY + imgHeight - _radius))
	{
		angle = -_angle;
		recalc = true;
	}
	if (_coords.x+(2*dx) > startX + imgWidth - _radius)
	{
		angle = Math.PI-_angle;
		recalc = true;
	}

	var step = speed;
	if (recalc)
	{
		_coords.dx = Math.cos(angle)*step;
		_coords.dy = Math.sin(angle)*step;
		if (dx == undefined || dy == undefined)
		{
			dx = _coords.dx;
			dy = _coords.dy;
		}
	}
		
	_coords.x += dx;
	_coords.y += dy;
	return angle;
}
