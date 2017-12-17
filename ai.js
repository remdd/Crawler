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
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
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
					ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);					//	...attack in player's compass direction...
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
					creature.vars.hideWeapon = false;											//	Redisplay dagger if hidden while flying
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
					ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);		//	...attack in player's compass direction...
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
		case EnumCreature.URK: {
			switch(creature.ai.nextAction) {
				case 0: {
					//	Next action not specified
					if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3) {						//	If player is within 3x attack reach...
						var action = Math.floor(Math.random() * 2);
						var direction = getPlayerDirection(creature);
						if(action < 1) {
							ai.moveTowardsPlayer(creature, 250, 250, 1.5);
							creature.ai.nextAction = 3;
						} else {
							ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
							creature.ai.nextAction = 1;															//	...and set next action to 1.
						}
					} else {
						var action = Math.floor(Math.random() * 3);												//	Otherwise, randomly choose to...
						if(action < 2) {
							ai.rest(creature, 500, 250);														//	...rest...
						} else {
							ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
						}
						creature.ai.nextAction = 0;
					}
					break;
				}
				case 1: {
					ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
					creature.ai.nextAction = 0;
					break;
				}
				case 2: {
					ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
					creature.ai.nextAction = 0;
					break;
				}
				case 3: {
					var direction = getPlayerDirection(creature);
					ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
					creature.ai.nextAction = 1;
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
	rest: function(creature, duration_factor, duration_min, animation) {
		// console.log("AI: rest");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		if(animation) {
			creature.vars.animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	moveRandomVector: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		// console.log("AI: moveRandomVector");
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	attack: function(creature, duration_factor, duration_min, direction, accuracy, animation) {
		// console.log("AI: attacking");
		console.log(creature);
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.attack(direction);
		if(animation) {
			creature.vars.animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	moveAwayFromPlayer: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		// console.log("AI: moveAwayFromPlayer " + speed_multiplier);
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature) + Math.PI;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	moveTowardsPlayer: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		// console.log("AI: moveAwayFromPlayer " + speed_multiplier);
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature);
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	}
}