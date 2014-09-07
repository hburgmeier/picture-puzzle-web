var gameController = function(model, view) {
	var root = this;
	
	this.construct = function(model, view) {
		this.model = model;
		this.model.onTimerExpire = this.noSuccess; 
			
		this.view = view;
		this.view.onSuccess = root.success;
		this.view.onSkip = root.skip;
		this.view.onNext = root.startNextRound;
		this.view.onStart = root.startGame;
	};

	this.startNextRound = function() {
		var round = root.model.getNextRound();
		if (round!=null)
		{
			view.startNextRound(round, function() {
				root.model.startTimer(round);
			});
		}
	};
	this.startGame = function() {
		root.model.startGame();
		root.startNextRound();
	};
	this.noSuccess = function() {
		view.endRound(false);
	};
	this.success = function() {
		root.model.completeRound();
		view.endRound(true);
	};
	this.skip = function() {
		view.endRound(false, true);
		root.model.skipRound();
		root.startNextRound();
	};
	
	this.construct(model, view);
};