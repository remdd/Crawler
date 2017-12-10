getPlayerDirection = function(creature) {					//	Returns angle in radians from creature position to player position vectors
	if(player) {
		return Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
	} else {
		return Math.random() * Math.PI * 2;
	}
}

getPlayerDistance = function(creature) {
	if(player) {
		return Math.sqrt(Math.pow(player.position.y - creature.position.y, 2) + Math.pow(player.position.x - creature.position.x, 2));
	}
}

setAiAction = function(creature) {
	// console.log("Setting AI action...");
	switch(creature.ai.type) {

		case 0: {
		//	Green Goblin
			switch(creature.ai.nextAction) {
				case 0: {
					//	Next action not specified
					if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3) {					//	If player is within 3x attack reach...
						ai.attackPlayer(creature, 0, creature.vars.attackRate, Math.PI / 8);				//	...attack player...
						creature.ai.nextAction = 1;															//	...and set next action to 1.
					} else {
						var action = Math.floor(Math.random() * 3);											//	Otherwise, randomly choose to...
						if(action < 2) {
							ai.rest(creature, 500, 250);													//	...rest...
						} else {
							ai.moveRandomVector(creature, 1500, 100);										//	...or move in a random direction.
						}
						creature.ai.nextAction = 0;
					}
					break;
				}
				case 1: {
					ai.moveAwayFromPlayer(creature, 0, 500, 1);											//	...move away from player for 500ms, at 1x speed
					creature.ai.nextAction = 0;
					break;
				}
				case 2: {
					ai.moveAwayFromPlayer(creature, 0, 500, 2);											//	...move away from player for 500ms, at 1x speed
					creature.ai.nextAction = 0;
					break;
				}
				default: {
					break;
				}
			}
			break;
		}

		case 1: {
		//	Mini Ghost
			var action = Math.floor(Math.random() * 1);
			if(action < 1) {
				ai.moveRandomVector(creature, 2500, 300);
				break;
			}
		}

		default: {
			break;
		}
	}
}

setAiTiming = function(creature, duration) {
	creature.ai.startTime = performance.now();
	creature.ai.endTime = performance.now() + duration;
	console.log(creature.ai.startTime + " - " + creature.ai.endTime);
	creature.vars.animStart = performance.now();
}
clearAiAction = function(creature) {
	creature.ai.endTime = performance.now();
}

var ai = {
	rest: function(creature, duration_factor, duration_min) {
		console.log("AI: rest");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.RESTING_R;
		} else {
			creature.vars.animation = EnumState.RESTING_L;
		}
	},
	moveRandomVector: function(creature, duration_factor, duration_min) {
		console.log("AI: moveRandomVector");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.movement.speed = creature.vars.speed;
		creature.setFacing();
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.MOVING_R;
		} else {
			creature.vars.animation = EnumState.MOVING_L;
		}
	},
	attackPlayer: function(creature, duration_factor, duration_min, accuracy) {
		console.log("AI: attacking");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		var direction = getPlayerDirection(creature);
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.attack(direction);
		if(direction >= 0) {
			creature.facingRight = true;
		} else {
			creature.facingRight = false;
		}
	},
	moveAwayFromPlayer: function(creature, duration_factor, duration_min, speed_multiplier) {
		console.log("AI: moveAwayFromPlayer " + speed_multiplier);
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature) + Math.PI;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing();
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.MOVING_R;
		} else {
			creature.vars.animation = EnumState.MOVING_L;
		}
	}
}




var playerTemplates = [
	{
		name: 'Hero',
		vars: {
			speed: 1.2,
			maxHP: 10,
			currentHP: 10,
			attackRate: 1,
			sprite: { x: 0, y: 0 },								//	Holds current sprite to be rendered
			moving: false
		},
		sprite: { 
			spriteSheet: playerSprite,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 0 },		//	0	Resting 0 - facing R
				{ x: 1, y: 0 },		//	1	Resting 1 - facing R
				{ x: 2, y: 0 },		//	2	Walking 0 - facing R
				{ x: 3, y: 0 },		//	3	Walking 1 - facing R
				{ x: 4, y: 0 },		//	4	Walking 2 - facing R
				{ x: 5, y: 0 },		//	5	Walking 3 - facing R
				{ x: 0, y: 1 },		//	6	Resting 0 - facing L
				{ x: 1, y: 1 },		//	7	Resting 1 - facing L
				{ x: 2, y: 1 },		//	8	Walking 0 - facing L
				{ x: 3, y: 1 },		//	9	Walking 1 - facing L
				{ x: 4, y: 1 },		//	10	Walking 2 - facing L
				{ x: 5, y: 1 }		//	11	Walking 3 - facing L
			],
			animations: [											//	Format: Loop time in ms, end time of each frame in ms, frame numbers
				[ 1000, [600, 1000], [0, 1] ],						//	Resting, facing R
				[ 1000, [600, 1000], [6, 7] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [5, 4, 3, 2 ] ],		//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ]		//	Moving, facing L
			]
		},
		box: {
			width: 10, 
			height: 14,
			y_padding: 2,
			type: EnumBoxtype.PLAYER
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: false
		}
	}
];

var creatureTemplates = [
	{
		name: 'Green Goblin',
		vars: {
			speed: 0.6,
			maxHP: 5,
			currentHP: 50,
			sprite: { x: 0, y: 0}
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 0 },	//	Facing R 1
				{ x: 1, y: 0 },	//	Facing R 2
				{ x: 2, y: 0 },	//	Facing R 3
				{ x: 3, y: 0 },	//	Facing R 4
				{ x: 0, y: 1 },	//	Facing L 1
				{ x: 1, y: 1 },	//	Facing L 2
				{ x: 2, y: 1 },	//	Facing L 3
				{ x: 3, y: 1 },	//	Facing L 4
				{ x: 5, y: 0 },	//	Death facing R 1
				{ x: 6, y: 0 },	//	Death facing R 2
				{ x: 4, y: 1 },	//	Death facing L 1
				{ x: 5, y: 1 }	//	Death facing L 2
			],
			animations: [
				[ 800, [600, 800], [ 0, 1] ],						//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],						//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ],						//	Moving, facing L
				[ 500, [500], [8] ],						//	Death, facing R
				[ 500, [500], [10] ]						//	Death, facing L
			],
			deadFrameR: { x: 6, y: 0 },
			deadFrameL: { x: 5, y: 1 }
		},
		box: {
			width: 10, 
			height: 10,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: 0,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function(creature) {
			creature.ai.nextAction = 2;
			clearAiAction(creature);
		}
	},
	{
		name: 'Mini Ghost',
		vars: {
			speed: 0.2,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 0, y: 2}
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 2 },
				{ x: 1, y: 2 },
				{ x: 2, y: 2 },
				{ x: 0, y: 3 },
				{ x: 1, y: 3 },
				{ x: 2, y: 3 }
			],
			animations: [
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Moving, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ]							//	Moving, facing L
			]
		},
		box: {
			width: 8, 
			height: 14,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: 1,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		}
	}
];

var creatureWeapons = [
	{
		name: 'Green Goblin Claw',
		vars: {
			sprite: { x: 4, y: 0},
			animTime: 50,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 800,
			drawOffset: { x: 0, y: 0 }
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			displayWhileResting: false,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 4, y: 0 },							//	Right facing
				{ x: 4.5, y: 0 }						//	Left facing
			],
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE * 0.7,						//	Reach of attack from centre of creature position
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeColor1: 'rgba(255,102,0,0)',
			swipeColor2: '#ff944d',
			swipeThickness: 0.85,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}
];



