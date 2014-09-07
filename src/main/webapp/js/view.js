var animationCancel = function() {
	this.cancelled = false;
	this.show = false;
	this.isCancel = function() { return this.cancelled; };
	this.cancel = function(_show) { this.cancelled = true; this.show = _show; };
	this.isShow = function() { return this.show; };
};

var gameView = function(gameViewId, model, canvas_width, canvas_height) {
	var root = this;
	
	this.construct = function(gameViewId, model) {
		this.model = model;
		this.model.onTick = root.tick;
		
		this.gameViewEl = $(gameViewId);
		this.puzzleView = $("#puzzle");
		this.headerView = $("#header");
		
		this.successBtn = $("#successBtn");
		this.successBtn.click(this._onSuccess);
		this.skipBtn = $("#skipBtn");
		this.skipBtn.click(this._onSkip);
		this.nextBtn = $("#nextBtn");
		this.nextBtn.click(function() { root.onNext(); });
		this.startBtn = $("#startBtn");
		this.startBtn.click(function() { root.onStart(); });
		
		var header_source   = $("#header-template").html();
		this.header_template = Handlebars.compile(header_source);

		var score_source   = $("#score-template").html();
		this.score_template = Handlebars.compile(score_source);
		
		this.nextBtn.hide();
		this.skipBtn.hide();
		this.successBtn.hide();
	};
	
	this.startNextRound = function(round, afterLoad) {
		var afterDone = undefined;
		
		this.successBtn.show();
		this.skipBtn.show();
		this.nextBtn.hide();
		
		this.puzzleView.empty();
		var canvasEl = $('<canvas>').attr({
		    id: "puzzleCanvas",
		    width: canvas_width,
		    height: canvas_height
		});
		canvasEl.appendTo(this.puzzleView);
		var canvas = document.getElementById("puzzleCanvas");
		
		this.currentCancel = new animationCancel();
		
		if (round.picture)
		{
			this.animatePicture(canvas, round.picture, round.effect, round.time, round.options, afterDone, this.currentCancel, afterLoad);
		}
		if (round.video)
		{
			this.animateVideo(canvas, round.video, round.video_size_x, round.video_size_y, round.effect, round.time, round.options, afterDone, this.currentCancel, afterLoad);
		}
	};
	
	this.animatePicture = function (canvas, url, animateFct, time, roundOptions, afterDone, cancelFct, afterLoad)
	{
		var context = canvas.getContext('2d');
		context.clearRect(0,0,canvas.width, canvas.height);

	    // load image from data url
	    var imageObj = new Image();
	    imageObj.onload = function() {
	    	if ($.isFunction(afterLoad))
	    		afterLoad();
	    	animateFct(canvas, this, time, afterDone, cancelFct, roundOptions);
	    };

	    imageObj.src = url;	
	};
	
	this.animateVideo = function (canvas, url, size_x, size_y, animateFct, time, roundOptions, afterDone, cancelFct, afterLoad)
	{
		var context = canvas.getContext('2d');
		context.clearRect(0,0,canvas.width, canvas.height);

		var videoEl = $('<video>').attr({
		    id: "videoEl",
		    width: size_x,
		    height: size_y,
		    src: url,
		    autoplay: true,
		    loop: true,
		    play: function() {
		    	if ($.isFunction(afterLoad))
		    		afterLoad();
		    	animateFct(canvas, this, time, afterDone, cancelFct, roundOptions);
		    	root.currentVideo = this;
		    } 
		});
	};	
	
	this._onSuccess = function() {
		root.onSuccess();
	};
	this.onSuccess = function() {};
	this._onSkip = function() {
		root.onSkip();
	};
	this.onSkip = function() {};
	this.onStart = function() {};
	this.showEndGame = function()
	{
		this.headerView.empty();
		this.puzzleView.empty();
		var source   = $("#endGame-template").html();
		var template = Handlebars.compile(source);
		var html = template(this.model);
		this.puzzleView.append(html);
		
		var restartBtn = $("#restartBtn");
		restartBtn.click(function() { root.onStart(); });
	};
	this.endRound = function(success, skip) {
		this.currentCancel.cancel(true);
		this.skipBtn.hide();
		this.successBtn.hide();
		
		if (this.currentVideo)
		{
			this.currentVideo.pause();
			this.currentVideo = null;
		}
		
		if (!skip)
		{
			var moreRounds = root.model.hasMoreRounds();
			var complete = function()
			{
				if (moreRounds)
					root.nextBtn.show();
				else
					root.showEndGame();
			};
			var fadeComplete = function()
			{
				setTimeout(function() {
					root.tick();
					$("#scoreMessage").fadeOut(500, complete);
				}, 700);
			};
			if (success) {
				var html = root.score_template(root.model);
				root.puzzleView.append(html);
				$("#scoreMessage").fadeIn(1500, fadeComplete);
			} else {
				complete();
			}
		}
	};
	this.tick = function() {
		var remainingTime = root.model.currentTime;
		var short = remainingTime < 6 && remainingTime > 0;

		var context = {
				points: root.model.points,
				currentTime: remainingTime,
				toDo: (root.model.rounds.length - root.model.toDoRounds.length),
				lastRound: (root.model.toDoRounds.length==0)
		};
		var html = root.header_template(context);
		root.headerView.empty();
		root.headerView.append(html);
		if (short)
		{
			$("#timeMessage").addClass("blink");
		}
	};
	
	
	this.construct(gameViewId, model);
};