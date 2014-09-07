var gameModel = function()
{
	this.rounds = [];
	this.toDoRounds = [];
	this.currentRound = undefined;
	this.currentTime = undefined;
	this.currentTimer = undefined;
	this.lastScore = undefined;
	var root = this;
	
	this.construct = function() {
	};
	this.addPictureRound = function(picUrl, effect, time, options) {
		this.rounds.push({
			picture: picUrl,
			effect: effect,
			time: time,
			options: options
		});
	};
	this.addVideoRound = function(videoUrl, size_x, size_y, effect, time, options) {
		this.rounds.push({
			video: videoUrl,
			effect: effect,
			time: time,
			video_size_x: size_x,
			video_size_y: size_y,
			options: options
		});
	};
	this.startGame = function() {
		this.points = 0;
		this.toDoRounds = [];
		$.each(this.rounds, function(idx, val) {
			root.toDoRounds.push(idx);
		});
	};
	this.getNextRound = function() {
		if (this.toDoRounds.length>0)
		{
			var roundIndex = this.toDoRounds.shift();
			var round = this.rounds[roundIndex];
			this.currentRound = roundIndex;
			return round;
		} else {
			return null;
		}
	};
	this.startTimer = function(round) {
		this.currentTime = round.time;
		this.currentTimer = setInterval(function() {
			root.currentTime--;
			if (root.currentTime>0)
			{
				root.onTick();
			} else {
				clearInterval(root.currentTimer);
				root.currentTimer = null;
				
				root.onTick();
				root.onTimerExpire();
			}
		},1000);
		this.onTick();
	};
	this.skipRound = function() {
		this.toDoRounds.push(this.currentRound);
		this.rounds[this.currentRound].time = root.currentTime;
		this.currentRound = undefined;
		if (root.currentTimer)
		{
			clearInterval(root.currentTimer);
			root.currentTimer = null;
		}		
	};
	this.completeRound = function() {
		if (root.currentTimer)
		{
			clearInterval(root.currentTimer);
			root.currentTimer = null;
		}
		var pointsThisRound = this.getPoints(root.currentTime);
		this.lastScore = pointsThisRound;
		this.points += pointsThisRound;
	};
	this.getPoints = function(time) {
		return Math.ceil(time/5)*5;
	};
	this.hasMoreRounds = function() {
		return this.toDoRounds.length > 0;
	};
	this.onTick = function() { };
	this.onTimerExpire = function() { };
	
	this.construct();
};



