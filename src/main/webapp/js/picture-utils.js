function imageScale(image, canvas)
{
	var canvasCenterX = Math.floor(canvas.width / 2);
	var canvasCenterY = Math.floor(canvas.height / 2);
	
	var aspect_x = canvas.width / image.width;
	var aspect_y = canvas.height / image.height;
	
	var aspect = Math.min(aspect_x, aspect_y);
	
	var real_img_x = Math.floor(image.width * aspect);
	var real_img_y = Math.floor(image.height * aspect);

	var imageStartX = Math.floor(canvasCenterX - (real_img_x / 2));
	var imageStartY = Math.floor(canvasCenterY - (real_img_y / 2));
	
	return {
		imageWidth:real_img_x,
		imageHeight:real_img_y,
		startX: imageStartX,
		startY: imageStartY
	};
}

function drawImage(image, canvas, context)
{
	var scale = imageScale(image, canvas);
	
	var real_img_x = scale.imageWidth;
	var real_img_y = scale.imageHeight;

	var imageStartX = scale.startX;
	var imageStartY = scale.startY;

	context.drawImage(image, 0, 0, image.width, image.height, imageStartX, imageStartY, real_img_x, real_img_y);
	
}

function clearImage(image, canvas, context)
{
	var canvasCenterX = Math.floor(canvas.width / 2);
	var canvasCenterY = Math.floor(canvas.height / 2);

	var aspect_x = canvas.width / image.width;
	var aspect_y = canvas.height / image.height;
	
	var aspect = Math.min(aspect_x, aspect_y);
	
	var real_img_x = Math.floor(image.width * aspect);
	var real_img_y = Math.floor(image.height * aspect);
	
	var imageStartX = Math.floor(canvasCenterX - (real_img_x / 2));
	var imageStartY = Math.floor(canvasCenterY - (real_img_y / 2));
	
	context.fillStyle="#000000";
	context.fillRect(imageStartX,imageStartY,real_img_x, real_img_y);	
}