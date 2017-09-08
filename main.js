/*
	Whack-A-Mole
*/


/**
 * WhackAMole
 * Setup Mole Grid and initialize modules
 */
function WhackAMole(){
	this.options = {
		gameEl: null,
		moleEls: null,
		scoreEl: null,
		activeClass: 'active',
		spawnTime: 500,
		lifetime: 1000,
		killtime: 500
	};

	this.moles = [];
	this.score = null;
	this.game = null;
};

/**
 * initialize whack a mole with custom options
 * @param  {[obj]} options  custom object options
 */
WhackAMole.prototype.init = function(options){
	this.options = Object.assign({}, this.options, options);

	this.score = new Score(this.options.scoreEl);

	this.setupMoles();

	this.game = new Game(this.moles, this.options.spawnTime);
	this.game.start();
};

/**
 * [setupMoles description]
 */
WhackAMole.prototype.setupMoles = function(){
	this.moles = [];

	if(this.options.moleEls !== null){

		for(var i = 0; i<this.options.moleEls.length; i++){
			if(this.options.moleEls[i] !== null){
				this.moles.push(new Mole(
					this.options.moleEls[i], 
					this.options.activeClass, 
					this.options.lifetime,
					this.options.killtime,
					this.score
				));
			}
		}
	}
};


/**
 * Mole Object. Handles life/kill time and increments game score on kill
 * @param {[type]} moleEl      individual mole element
 * @param {[type]} activeClass active class name
 * @param {[type]} lifetime    mole lifetime
 * @param {[type]} killtime    mole death lifetime
 * @param {[type]} score       score object
 */
function Mole(moleEl, activeClass, lifetime, killtime, score){
	this.moleEl = moleEl;
	this.activeClass = activeClass;
	this.lifetime = lifetime;
	this.killtime = killtime;
	this.score = score;

	this.deactivate();

	this.moleEl.addEventListener('click', this.moleClick.bind(this));
};
/**
 * Activate Mole Object lifetime
 */
Mole.prototype.activate = function(lifetime){
	if(!this.active){
		this.moleEl.classList.add(this.activeClass);
		this.active = true;

		setTimeout(function(){
			this.deactivate();
		}.bind(this), this.getLifetime());
	}
};
/**
 * Deactivate Mole Object and implement killtime
 */
Mole.prototype.deactivate = function(){
	this.moleEl.classList.remove(this.activeClass);
	if(this.active){// set kill timeout
		setTimeout(function(){
			this.active = false;
		}.bind(this), this.killtime);
	}
};

/**
 * On Mole click increase score and deactive Mole
 */
Mole.prototype.moleClick = function(e){
	e.preventDefault();
	if(this.active){
		this.score.increase();
		this.deactivate();
	}
};

/**
 * Return life time
 * TODO: function to eventually create random lifetime 
 * @return {[int]} random lifetime
 */
Mole.prototype.getLifetime = function(){
	return this.lifetime;
};

Mole.prototype.destory = function(){
	// TODO: kill event listeners and self
}



/**
 * Game Object that manage mole spawning
 * @param {[array]} moles     Moles Array
 * @param {[int]} spawnTime	  mole spawn time
 */
function Game(moles, spawnTime){
	this.moles = moles;
	this.spawnTime = spawnTime;
	this.gameActive = false;
};
/**
 * Begin game
 */
Game.prototype.start = function(){
	this.gameActive = true;
	this.spawnMoles();
};
/**
 * Randomly pick mole to spawn within spawn time
 */
Game.prototype.spawnMoles = function(){
	var activeMole;
	if(this.gameActive){
		activeMole = this.moles[ (Math.round(Math.random() * (this.moles.length - 1))) ];
		if(!activeMole.active){
			activeMole.activate();
			
			setTimeout(function(){
				this.start();
			}.bind(this), this.spawnTime);
		}
		else{//pick different mole is already active
			this.start();
		}
	}
};

/**
 * End Game
 */
Game.prototype.end = function(){
	if(this.gameActive !== false){
		this.gameActive = false;

		//TODO: deactive all moles and desctory game
	}
};


/**
 * Score Module
 * @param {[el]} scoreEl Score Element
 * @param {[int]} score   score number
 */
function Score(scoreEl, score){
	this.score = score || 0;
	this.scoreEl = scoreEl;
};
/**
 * Increase score by one
 */
Score.prototype.increase = function(){
	this.score++;
	this.setScore();
};
/**
 * update score el
 */
Score.prototype.setScore = function(){
	this.scoreEl.textContent = this.score;
}
/**
 * reset score
 */
Score.prototype.reset = function(){
	score = 0;
	this.setScore();
}
/**
 * destroy score module
 */
Score.prototype.destoy = function(){
	// TODO: destory score module
}