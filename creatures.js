getPlayerDirection = function(creature) {					//	Returns angle in radians from creature position to player position vectors
	return Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
}

getPlayerCompassDirection = function(creature) {
	var direction = Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
	return direction;
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
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.vars.attackRate, direction, Math.PI / 8);		//	...attack in player's general direction...
						creature.ai.nextAction = 1;															//	...and set next action to 1.
					} else {
						var action = Math.floor(Math.random() * 3);											//	Otherwise, randomly choose to...
						if(action < 2) {
							ai.rest(creature, 500, 250);													//	...rest...
						} else {
							ai.moveRandomVector(creature, 1500, 100, 1);									//	...or move in a random direction.
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
			switch(creature.ai.nextAction) {
				case 0: {
					var action = Math.floor(Math.random() * 1);
					if(action < 1) {
						ai.moveRandomVector(creature, 2500, 300, 1);
					}
					break;
				}
				default: {
					break;
				}
			}
			break;
		}

		case EnumCreature.SKELTON: {
			creature.movement.bounceOff = true;
			switch(creature.ai.nextAction) {
				case 0: {
					if(getPlayerDistance(creature) < TILE_SIZE * 3.5) {
						var action = Math.floor(Math.random() * 4)
						if(action < 3) {
							ai.moveTowardsPlayer(creature, 300, 350, 2);
							creature.movement.bounceOff = false;
							creature.ai.nextAction = 1;
						} else {
							ai.moveRandomVector(creature, 300, 350, 2);
						}
					} else {
						var action = Math.floor(Math.random() * 2);
						if(action < 1) {
							ai.moveRandomVector(creature, 1000, 500, 1);
						} else {
							ai.rest(creature, 1000, 500);
						}
					}
					break;				
				}
				case 1: {
					var direction = getPlayerCompassDirection(creature);
					ai.attack(creature, 0, creature.vars.attackRate, direction, 0);		//	...attack in player's compass direction...
					creature.ai.nextAction = 2;
					break;
				}
				case 2: {
					ai.rest(creature, 1000, 500);
					creature.ai.nextAction = 0;
					break;
				}
				case 3: {
					ai.moveAwayFromPlayer(creature, 500, 500, 2);											//	...move away from player for 0.5 - 1s, at 2x speed
					creature.ai.nextAction = 0;
					break;
				}
				default: {
					break;
				}
			}
			break;
		}

		case EnumCreature.GREEN_SLUDGIE: {
			creature.vars.touchDamage = false;								//	Reset to stop touch damage
			switch(creature.ai.nextAction) {
				case 0: {
					if(getPlayerDistance(creature) > TILE_SIZE * 5) {
						ai.rest(creature, 1000, 500);
					} else {
						var action = Math.floor(Math.random() * 2);
						if(action < 1) {
							creature.vars.touchDamage = true;				//	Set to cause touch damage when moving
							ai.moveRandomVector(creature, 0, 1000, 1);
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
			creature.movement.bounceOff = true;
			switch(creature.ai.nextAction) {
				case 0: {
					creature.vars.hideWeapon = false;						//	Redisplay dagger if hidden while flying
					if(getPlayerDistance(creature) < TILE_SIZE * 4) {
						ai.moveTowardsPlayer(creature, 300, 350, 2);
						creature.movement.bounceOff = false;
						creature.ai.nextAction = 1;
					} else {
						var action = Math.floor(Math.random() * 3);
						if(action < 1) {
							ai.rest(creature, 500, 500);
						} else {
							ai.moveRandomVector(creature, 500, 500, 1);
						}
						creature.ai.nextAction = 0;
					}
					break;
				}
				case 1: {
					var direction = getPlayerCompassDirection(creature);
					ai.attack(creature, 0, creature.vars.attackRate, direction, 0);						//	...attack in player's compass direction...
					creature.ai.nextAction = 2;
					break;
				}
				case 2: {
					ai.moveAwayFromPlayer(creature, 500, 500, 2);
					creature.ai.nextAction = 0;
					break;
				}
				case 3: {				//	Transform into bat!
					creature.vars.transformEndTime = performance.now() + 2000 + Math.random() * 8000;	//	Set transformation duration
					ai.moveAwayFromPlayer(creature, 0, creature.sprite.animations[6][0], 1.5);			//	Set AI timing to last for duration of transformation animation
					creature.vars.animation = 6;														//	Transform to bat
					creature.ai.nextAction = 4;															//	Fly as bat
					creature.vars.isBat = true;
					creature.vars.hideWeapon = true;
					creature.vars.moveThroughColliders = true;
					break;
				}
				case 4: {
					if(performance.now() > creature.vars.transformEndTime) {							//	If transform time has elapsed...
							creature.vars.moveThroughColliders = false;									//	...turn collider back on and check that it does not collide with any other...
						if(!creature.checkIfCollides()) {
							creature.ai.nextAction = 5;													//	...if it does not, set next action to be transform back from bat
							clearAiAction(creature);
						} else {
							creature.vars.transformEndTime += 200;										//	If it *does* collide, extend anim by another 200 ms and continue random movement
							creature.vars.moveThroughColliders = true;
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveAwayFromPlayer(creature, 200, 50, 3.5);
							} else {
								ai.moveRandomVector(creature, 200, 50, 3.5);
							}
							creature.vars.animation = 8;					//	Bat flying animation
						}
					} else {
						var action = Math.floor(Math.random() * 3);
						if(action < 1) {
							ai.moveAwayFromPlayer(creature, 200, 50, 3.5);
							creature.vars.animation = 8;					//	Bat flying animation
						} else {
							ai.moveRandomVector(creature, 200, 50, 3.5);
							creature.vars.animation = 8;					//	Bat flying animation
						}
					}
					break;
				}
				case 5: {
					ai.rest(creature, 0, creature.sprite.animations[7][0]);			//	Set AI timing to last for duration of transformation animation
					creature.vars.animation = 7;									//	Transform back to vamp
					creature.ai.nextAction = 0;
					creature.vars.isBat = false;
					break;
				}
				default: {
					break;
				}
			}
			break;
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
	moveRandomVector: function(creature, duration_factor, duration_min, speed_multiplier) {
		// console.log("AI: moveRandomVector");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing();
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.MOVING_R;
		} else {
			creature.vars.animation = EnumState.MOVING_L;
		}
	},
	attack: function(creature, duration_factor, duration_min, direction, accuracy) {
		// console.log("AI: attacking");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
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
				[ 1000, [67, 134, 200, 267, 334, 400, 467, 534, 600, 667, 734, 800, 867, 934, 1000 ], [ 12, 0, 12, 0, 12, 0, 12, 0, 12, 1, 13, 1, 13, 1, 13 ] ],	//	Resting Hitflash, facing R
				[ 1000, [67, 134, 200, 267, 334, 400, 467, 534, 600, 667, 734, 800, 867, 934, 1000 ], [ 14, 6, 14, 6, 14, 6, 14, 6, 14, 7, 15, 7, 15, 7, 15 ] ],	//	Resting Hitflash, facing L
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
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
			// console.log(this.name + " has " + this.vars.currentHP + " HP remaining.");
		},
		deathResponse: function() {	
			// console.log("The player has died!");
		}
	}
];

var creatureTemplates = [
	{},			//	Template 0 is not used - indicates no creature!
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
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return 1;
		}	
	},
	{
		name: 'Mini Ghost',
		vars: {
			speed: 0.2,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 0, y: 2},
			moveThroughColliders: true
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
				{ x: 2, y: 3 },
				{ x: 3, y: 2 },
				{ x: 4, y: 2 },
				{ x: 5, y: 2 },
				{ x: 3, y: 3 },
				{ x: 4, y: 3 },
				{ x: 5, y: 3 },
				{ x: 0, y: 7 }			//	Empty frame!
			],
			animations: [
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Moving, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Moving, facing L
				[ 2000, [100, 200, 300, 400, 2000], [1, 6, 7, 8, 12] ],					//	Death, facing R
				[ 2000, [100, 200, 300, 400, 2000], [4, 9, 10, 11, 12] ]					//	Death, facing L
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
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
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
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			var rand = Math.floor(Math.random() * 3);
			if(rand < 1) {
				return 2;
			} else {
				return 3;
			}
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
				{x:0,y:8}, {x:1,y:8}, {x:2,y:8}, {x:3,y:8}, {x:4,y:8}, {x:5,y:8},
				{x:0,y:9}, {x:1,y:9}, {x:2,y:9}, {x:3,y:9}, {x:4,y:9}, {x:5,y:9},
				{x:6,y:8}, {x:7,y:8}, {x:8,y:8}, {x:6,y:9},	{x:7,y:9}, {x:8,y:9}
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
			type: EnumBoxtype.CREATURE
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
		touchDamage: function() {
			return 1;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Camp Vamp',
		vars: {
			speed: 0.7,
			maxHP: 5,
			currentHP: 5,
			sprite: { x: 0, y: 10 },
			minFacingChangeTime: 50,
			transformStartTime: 0,
			transformEndTime: 0,
			isBat: false
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
				{ x: 10, y: 10 },
				{ x: 11, y: 10 },
				{ x: 12, y: 10 },
				{ x: 13, y: 10 },
				{ x: 0, y: 11 },
				{ x: 1, y: 11 },
				{ x: 2, y: 11 },
				{ x: 3, y: 11 },
				{ x: 4, y: 11 },
				{ x: 5, y: 11 },
				{ x: 6, y: 11 },
				{ x: 7, y: 11 },
				{ x: 8, y: 11 },
				{ x: 9, y: 11 },
				{ x: 10, y: 11 },
				{ x: 11, y: 11 },
				{ x: 12, y: 11 },
				{ x: 13, y: 11 }
			],
			animations: [
				[ 500, [300, 500], [0, 1] ],																	//	Resting, facing R
				[ 500, [300, 500], [14, 15] ],																	//	Resting, facing L
				[ 400, [100, 200, 300, 400], [6, 8, 7, 9] ],													//	Moving, facing R
				[ 400, [100, 200, 300, 400], [20, 22, 21, 23] ],												//	Moving, facing L
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 600, [100, 200, 300, 400, 500, 600], [14, 15, 16, 17, 18, 19] ],								//	Transform into bat
				[ 600, [100, 200, 300, 400, 500, 600], [19, 18, 17, 16, 15, 14] ],								//	Transform back from bat
				[ 400, [100, 200, 300, 400], [2, 3, 4, 5] ]														//	Moving as bat
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
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else if(!this.vars.isBat) {
				this.ai.nextAction = 3;
				clearAiAction(this);
			} else {
				this.ai.nextAction = 4;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return 4;
		}
	}
];

var creatureWeapons = [
	{},				//	0 is blank - not a weapon!
	{
		name: 'Green Goblin Claw',
		vars: {
			sprite: { x: 2, y: 6},
			animTime: 100,								//	Length of time the weapon stays animated after attack
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
				y: TILE_SIZE * -0.5
			}
		},
		attack: {
			reach: TILE_SIZE * 0.6,						//	Reach of attack from centre of creature position
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
		name: 'Bone Sword',
		vars: {
			sprite: { x: 0, y: 6},
			animTime: 250,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 750,
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
				y: TILE_SIZE * -0.25
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
	},
	{
		name: 'Bone Axe',
		vars: {
			sprite: { x: 1, y: 6},
			animTime: 400,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 1500,
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
				{ x: 1, y: 6 },							//	Right facing
				{ x: 1.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -0.125,
				y: TILE_SIZE * -0.375
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
	},
	{
		name: 'Vamp Dagger',
		vars: {
			sprite: { x: 4, y: 6},
			animTime: 200,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 100,
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
				{ x: 4, y: 6 },							//	Right facing
				{ x: 4.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -0.25,
				y: TILE_SIZE * -0.125
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			type: EnumAttack.SWIPE,
			displayTime: 200,
			swipeColor1: 'rgba(255,255,255,0)',
			swipeColor2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}

];



