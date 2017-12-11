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

		case EnumCreature.GREEN_GOBLIN: {
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

		case EnumCreature.MINI_GHOST: {
			var action = Math.floor(Math.random() * 1);
			if(action < 1) {
				ai.moveRandomVector(creature, 2500, 300);
				break;
			}
		}

		case EnumCreature.SKELTON: {
			switch(creature.ai.nextAction) {
				case 0: {
					var action = Math.floor(Math.random() * 2);
					if(action < 1) {
						ai.moveRandomVector(creature, 1000, 500);
					} else {
						ai.rest(creature, 1000, 500);
					}
					break;				
				}
				default: {
					break;
				}
			}
		}

		case EnumCreature.GREEN_SLUDGIE: {
			switch(creature.ai.nextAction) {
				case 0: {
					if(getPlayerDistance(creature) > TILE_SIZE * 5) {
						ai.rest(creature, 1000, 500);
					} else {
						var action = Math.floor(Math.random() * 2);
						if(action < 1) {
							ai.moveRandomVector(creature, 0, 1000);
							creature.ai.nextAction = 1;
						} else {
							ai.rest(creature, 1000, 500);
						}
					}
					break;
				}
				case 1: {
					ai.rest(creature, 0, 1000);
					creature.ai.nextAction = 0;
					break;
				}
				default: {
					break;
				}
			}
			break;
		}

		case EnumCreature.CAMP_VAMP: {
			switch(creature.ai.nextAction) {
				case 0: {
					creature.vars.animStart = performance.now();
					ai.rest(creature, 0, 2000);
					creature.ai.nextAction = 1;
					break;
				}
				case 1: {
					creature.vars.animStart = performance.now();
					ai.moveRandomVector(creature, 0, 5000);
					creature.ai.nextAction = 0;
					break;
				}
				default: {
					break;
				}
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
	creature.vars.animStart = performance.now();
	creature.vars.animEnd = performance.now() + duration;
}
clearAiAction = function(creature) {
	creature.ai.endTime = performance.now();
}

var ai = {
	rest: function(creature, duration_factor, duration_min) {
		// console.log("AI: rest");
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
		// console.log("AI: moveRandomVector");
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
		// console.log("AI: attacking");
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
		// console.log("AI: moveAwayFromPlayer " + speed_multiplier);
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
	},
	moveTowardsPlayer: function(creature, duration_factor, duration_min, speed_multiplier) {
		// console.log("AI: moveAwayFromPlayer " + speed_multiplier);
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature);
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
				{ x: 5, y: 1 },		//	11	Walking 3 - facing L
				{ x: 0, y: 2 },		//	12	Resting Hitflash 0 - facing R
				{ x: 1, y: 2 },		//	13	Resting Hitflash 1 - facing R
				{ x: 0, y: 3 },		//	14	Resting Hitflash 0 - facing L
				{ x: 1, y: 3 },		//	15	Resting Hitflash 1 - facing L
				{ x: 2, y: 2 },		//	16	Walking Hitflash 0 - facing R
				{ x: 3, y: 2 },		//	17	Walking Hitflash 1 - facing R
				{ x: 4, y: 2 },		//	18	Walking Hitflash 2 - facing R
				{ x: 5, y: 2 },		//	19	Walking Hitflash 3 - facing R
				{ x: 2, y: 3 },		//	20	Walking Hitflash 0 - facing L
				{ x: 3, y: 3 },		//	21	Walking Hitflash 1 - facing L
				{ x: 4, y: 3 },		//	22	Walking Hitflash 2 - facing L
				{ x: 5, y: 3 }		//	23	Walking Hitflash 3 - facing L
			],
			animations: [											//	Format: Loop time in ms, end time of each frame in ms, frame numbers
				[ 1000, [600, 1000], [0, 1] ],						//	Resting, facing R
				[ 1000, [600, 1000], [6, 7] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [5, 4, 3, 2 ] ],		//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ],		//	Moving, facing L
				[ 200, [100, 200 ], [ 12, 0 ] ],					//	Resting Hitflash, facing R
				[ 200, [100, 200 ], [ 14, 6 ] ],					//	Resting Hitflash, facing L
				[ 400, [100, 200, 300, 400], [5, 18, 3, 16] ],		//	Moving Hitflash, facing R
				[ 400, [100, 200, 300, 400], [8, 21, 10,23] ]		//	Moving Hitflash, facing L
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
			currentHP: 5,
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
				{ x: 4, y: 0 },	//	Death facing R 1
				{ x: 5, y: 0 },	//	Death facing R 2
				{ x: 4, y: 1 },	//	Death facing L 1
				{ x: 5, y: 1 }	//	Death facing L 2
			],
			animations: [
				[ 800, [600, 800], [ 0, 1] ],												//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],												//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ],						//	Moving, facing L
				[ 1000, [500, 1000], [8, 9] ],												//	Death, facing R
				[ 1000, [500, 1000], [10, 11] ]												//	Death, facing L
			]
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
			type: EnumCreature.GREEN_GOBLIN,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function(creature) {
			if(creature.vars.currentHP > 0) {
				creature.ai.nextAction = 2;
				clearAiAction(creature);
			}
		},
		deathResponse: function() {
			this.kill();
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
			type: EnumCreature.MINI_GHOST,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Skelton',
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 3, y: 4 }
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 4 },
				{ x: 1, y: 4 },
				{ x: 2, y: 4 },
				{ x: 3, y: 4 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 0, y: 5 },
				{ x: 1, y: 5 },
				{ x: 2, y: 5 },
				{ x: 3, y: 5 },
				{ x: 4, y: 5 },
				{ x: 5, y: 5 },
				{ x: 6, y: 5 }
			],
			animations: [
				[ 1000, [1000], [0] ],									//	Resting, facing R
				[ 1000, [1000], [7] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 3, 2, 0] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 10, 9, 7] ],			//	Moving, facing L
				[ 2000, [500, 1000, 2000], [4, 5, 6]],					//	Death, facing R
				[ 2000, [500, 1000, 2000], [11, 12, 13]]				//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumCreature.SKELTON,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Green Sludgie',
		vars: {
			speed: 2,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 3, y: 4 },
			minFacingChangeTime: 20
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 8 },
				{ x: 1, y: 8 },
				{ x: 2, y: 8 },
				{ x: 3, y: 8 },
				{ x: 4, y: 8 },
				{ x: 5, y: 8 },
				{ x: 0, y: 9 },
				{ x: 1, y: 9 },
				{ x: 2, y: 9 },
				{ x: 3, y: 9 },
				{ x: 4, y: 9 },
				{ x: 5, y: 9 },
				{ x: 6, y: 8 },
				{ x: 7, y: 8 },
				{ x: 8, y: 8 },
				{ x: 6, y: 9 },
				{ x: 7, y: 9 },
				{ x: 8, y: 9 }
			],
			animations: [
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [0, 1, 2, 1, 0, 1] ],		//	Resting, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [6, 7, 8, 7, 6, 7] ],		//	Resting, facing L
				[ 1000, [150, 300, 700, 850, 1000], [3, 4, 5, 4, 3] ],					//	Moving, facing R
				[ 1000, [150, 300, 700, 850, 1000], [9, 10, 11, 10, 9] ],				//	Moving, facing L
				[ 2400, [800, 1600, 2400], [12, 13, 14]],								//	Death, facing R
				[ 2400, [800, 1600, 2400], [15, 16, 17]]								//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 7,
			type: EnumBoxtype.CREATURE_TOXIC_TO_PLAYER
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumCreature.GREEN_SLUDGIE,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Camp Vamp',
		vars: {
			speed: 0,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 0, y: 10 },
			minFacingChangeTime: 200
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 10 },
				{ x: 1, y: 10 },
				{ x: 2, y: 10 },
				{ x: 3, y: 10 },
				{ x: 4, y: 10 },
				{ x: 5, y: 10 },
				{ x: 6, y: 10 },
				{ x: 7, y: 10 },
				{ x: 8, y: 10 },
				{ x: 9, y: 10 },
				{ x: 0, y: 11 },
				{ x: 1, y: 11 }
			],
			animations: [
				[ 200, [50, 100, 150, 200], [6, 7, 8, 9] ],		//	Resting, facing R
				[ 200, [50, 100, 150, 200], [6, 7, 8, 9] ],		//	Resting, facing L
				[ 5000, [50, 100, 150, 200, 250, 4800, 4850, 4900, 4950, 5000], [5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5] ],					//	Moving, facing R
				[ 5000, [50, 100, 150, 200, 250, 4800, 4850, 4900, 4950, 5000], [5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5] ],					//	Moving, facing L
				[ 2400, [800, 1600, 2400], [12, 13, 14]],								//	Death, facing R
				[ 2400, [800, 1600, 2400], [15, 16, 17]]								//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumCreature.CAMP_VAMP,
			startTime: 0,
			endTime: 500,
			action: 0,
			nextAction: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		},
		deathResponse: function() {
			this.kill();
		}
	}
];

var creatureWeapons = [
	{
		name: 'Green Goblin Claw',
		vars: {
			sprite: { x: 2, y: 6},
			animTime: 50,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 800,
			drawOffset: { x: 0, y: 0 },
			foreground: false
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
				{ x: 2, y: 6 },							//	Right facing
				{ x: 2.5, y: 6 }						//	Left facing
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
	},
	{
		name: 'Skelton Sword',
		vars: {
			sprite: { x: 0, y: 6},
			animTime: 250,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 1000,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			displayWhileResting: true,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 0, y: 6 },							//	Right facing
				{ x: 0.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -0.25,
				y: -TILE_SIZE / 4
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			type: EnumAttack.SWIPE,
			displayTime: 50,
			swipeColor1: 'rgba(255,255,255,0)',
			swipeColor2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}
];



