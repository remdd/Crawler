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

getDistance = function(creature1, creature2) {
	return Math.sqrt(Math.pow(creature1.position.y - creature2.position.y, 2) + Math.pow(creature1.position.x - creature2.position.x, 2));
}

setAiAction = function(creature) {
	// console.log("Setting AI action...");
	if(!creature.vars.suspended) {
		switch(creature.ai.type) {

			case EnumAi.GREEN_GOBLIN: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {					//	If player is within 3x attack reach...
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

			case EnumAi.MINI_GHOST: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.vars.touchDamage = true;
						ai.moveRandomVector(creature, 2500, 300, 1);
						break;
					}
					case 1: {				//	Fade out
						creature.vars.invisible = true;
						if(creature.vars.facingRight) {
							ai.moveRandomVector(creature, 0, 500, 1, 6);
						} else {
							ai.moveRandomVector(creature, 0, 500, 1, 7);
						}
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {				//	Move while invisible
						ai.moveRandomVector(creature, 0, 10000, 1, 10);
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							creature.ai.nextAction = 3;
						}
						break;
					}
					case 3: {
						creature.vars.invisible = false;
						if(creature.vars.facingRight) {
							ai.moveRandomVector(creature, 0, 500, 1, 8);
						} else {
							ai.moveRandomVector(creature, 0, 500, 1, 9);
						}
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SKELTON: {
				if(creature.weapon) {
					creature.weapon.vars.hidden = false;													//	Show weapon for Ambush Skeltons once they have animated
				}
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 5 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveTowardsPlayer(creature, 300, 350, 2);
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
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 2);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 2);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 500, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SKELTON_ARCHER: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 8 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
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
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, Math.PI / 8);					//	...attack in player's compass direction...
						creature.ai.nextAction = 4;
						break;
					}
					case 2: {
						ai.rest(creature, 1000, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 2);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 2);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 200, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					case 4: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SNEAKY_SKELTON: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.weapon.vars.hidden = true;
						creature.vars.animation = 6;
						if(getPlayerDistance(creature) < TILE_SIZE * 2.5 && creature.hasClearPathToPlayer()) {
							ai.rest(creature, 0, 100, 6);
							creature.ai.nextAction = 1;
						} else {
							ai.rest(creature, 0, 200, 6);
						}
						break;
					}
					case 1: {
						ai.rest(creature, 0, 600, 4);
						creature.ai.type = EnumAi.SKELTON;
						creature.ai.nextAction = 1;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.MUMI: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 3.5 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveTowardsPlayer(creature, 300, 350, 1.5);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 1.5);
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
						var rand = Math.floor(Math.random() * 3);
						if(rand < 2) {
							creature.ai.nextAction = 1;
						} else {
							creature.ai.nextAction = 2;
						}
						break;
					}
					case 2: {
						ai.rest(creature, 1000, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 4);
						if(rand < 2) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 3) {
							ai.rest(creature, 250, 250);
							creature.ai.nextAction = 1;
						} else {
							ai.moveRandomVector(creature, 500, 500, 1.5);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.GREEN_SLUDGIE: {
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

			case EnumAi.CAMP_VAMP: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.weapon.vars.hidden = false;											//	Redisplay dagger if hidden while flying
						if(getPlayerDistance(creature) < TILE_SIZE * 6 && creature.hasClearPathToPlayer()) {
							ai.moveTowardsPlayer(creature, 300, 350, 2);
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
						creature.vars.foreground = true;
						creature.weapon.vars.hidden = true;
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
						creature.vars.foreground = false;
						creature.vars.isBat = false;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.URK: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
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
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							urkGrunts.play('grunt3');
						} else if(rand < 2) {
							urkGrunts.play('grunt4');
						}
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
				break;
			}

			case EnumAi.URK_VETERAN: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 100, 100, 2.5);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate * creature.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								var rand = Math.floor(Math.random() * 2);
								if(rand < 1) {
									creature.ai.nextAction = 0;
								} else {
									creature.ai.nextAction = 1;
								}
							}
						} else if(getPlayerDistance(creature) < creature.weapon.attack.reach * 5 && creature.hasClearPathToPlayer()) {
							var rand = Math.floor(Math.random() * 2);
							var direction;
							if(rand < 1) {
								direction = getPlayerDirection(creature) + Math.PI / 4;
							} else {
								direction = getPlayerDirection(creature) - Math.PI / 4;
							}
							ai.moveInDirection(creature, 250, 250, 1.5, direction);
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							urkGrunts.play('grunt3');
						} else if(rand < 2) {
							urkGrunts.play('grunt4');
						}
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
						if(rand < 1) {
							creature.ai.nextAction = 0;
						} else {
							creature.ai.nextAction = 1;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.URK_SHAMAN: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 10 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
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
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, 0);
						creature.ai.nextAction = 3;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 300, 350, 2);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.HULKING_URK: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						creature.weapon.vars.attackRate = 1200;														//	Reset to normal attack rate if resetting from bezerk
						creature.weapon.vars.animTime = 800;
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
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
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 3) {
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
					case 4: {																//	Bezerk!
						creature.movement.bounceOff = true;
						creature.vars.bezerkAttacks = Math.floor(Math.random() * 5) + 5;
						creature.weapon.vars.attackRate = 200;
						creature.weapon.vars.animTime = 150;
						ai.rest(creature, 0, 600, 1);
						var direction = getPlayerDirection(creature);
						creature.setFacing(direction);
						if(creature.vars.facingRight) {
							creature.vars.animation = 6;
						} else {
							creature.vars.animation = 7;
						}
						creature.ai.nextAction = 5;
						break;
					}
					case 5: {																//	Bezerk!
						if(creature.vars.bezerkAttacks) {
							ai.moveTowardsPlayer(creature, 0, 200, 3);
							creature.ai.nextAction = 6;
						} else {
							creature.ai.nextAction = 7;
						}
						break;
					}
					case 6: {																//	Bezerk!
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						creature.vars.bezerkAttacks--;
						creature.ai.nextAction = 5;
						break;
					}
					case 7: {																//	Exhausted...
						creature.movement.bounceOff = false;
						if(creature.vars.facingRight) {
							animation = 8;
						} else {
							animation = 9;
						}
						ai.rest(creature, 3000, 3000, animation);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.KOB: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 4 && creature.hasClearPathToPlayer()) {						//	If player is within 4x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 3;
							} else {
								ai.moveAwayFromPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 0;															//	...and set next action to 1.
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
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ZOMBI: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerCompassDirection(creature);
							creature.setFacing(direction);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, 0, 6);
							} else {
								ai.attack(creature, 0, 400, direction, 0, 7);
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 10) {
							var direction = getPlayerCompassDirection(creature);
							ai.moveInDirection(creature, 0, 400, 1, direction, Math.PI / 2)
						} else {
							ai.moveRandomVector(creature, 0, 400, 1);
						}
						break;
					}
					case 1: {
						if(creature.vars.facingRight) {
							ai.rest(creature, 0, 200, 8);
						} else {
							ai.rest(creature, 0, 200, 9);
						}
						break;
					}
					case 2: {
						console.log("Reanimating");
						if(creature.checkIfCollides()) {
							creature.ai.nextAction = 3;
						} else {
							creature.vars.moveThroughColliders = false;
							creature.vars.dead = false;
							creature.vars.currentHP = creature.vars.maxHP;
							if(creature.vars.facingRight) {
								ai.rest(creature, 0, 600, 10);
							} else {
								ai.rest(creature, 0, 600, 11);
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 3: {
						if(creature.vars.facingRight) {
							ai.rest(creature, 0, 200, 8);
						} else {
							ai.rest(creature, 0, 200, 9);
						}
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ZOMBI_MASTER: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1.5 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerDirection(creature);
							ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);
							creature.ai.nextAction = 1;
						} else if(getPlayerDistance(creature) < TILE_SIZE * 3 && creature.hasClearPathToPlayer()) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
							creature.ai.nextAction = 0;
						} else {
							var rand = Math.floor(Math.random() * 8);
							if(rand < 1) {
								console.log("Raising zombies!");
								game.creatures.forEach(function(zombi) {
									if(zombi.ai.type === EnumAi.ZOMBI && zombi.vars.dead && getDistance(creature, zombi) < TILE_SIZE * 10) {
										zombi.ai.nextAction = 2;
									}
								});
								ai.rest(creature, 500, 500);
							} else if(rand < 3) {
								ai.rest(creature, 500, 500);
							} else {
								ai.moveRandomVector(creature, 250, 250, 1);
							}
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BLUE_SQUARK: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 2 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								creature.ai.nextAction = 1;
							} else {
								ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
								creature.ai.nextAction = 0;
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 8 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 1);
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
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, Math.PI / 16);
						creature.ai.nextAction = 4;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 1);
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 200, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					case 4: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BLACK_KNIGHT: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 100, 100, 2);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate * creature.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								var rand = Math.floor(Math.random() * 2);
								if(rand < 1) {
									creature.ai.nextAction = 0;
								} else {
									creature.ai.nextAction = 1;
								}
							}
						} else if(getPlayerDistance(creature) < creature.weapon.attack.reach * 5 && creature.hasClearPathToPlayer()) {
							var rand = Math.floor(Math.random() * 2);
							var direction;
							if(rand < 1) {
								direction = getPlayerDirection(creature) + Math.PI / 4;
							} else {
								direction = getPlayerDirection(creature) - Math.PI / 4;
							}
							ai.moveInDirection(creature, 250, 250, 1.5, direction);
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
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
						delete creature.weapon.vars.rotation;
						creature.weapon.vars.endAttackAnimationTime = performance.now() - 1;
						creature.weapon.vars.attacking = false;
						creature.weapon.sprite.attackPositionOffset.y = TILE_SIZE * 8/16;
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						var rand = Math.floor(Math.random() * 6);
						if(rand < 1) {
							creature.ai.nextAction = 0;
						} else if(rand < 3) {
							creature.ai.nextAction = 2;
						} else {
							creature.ai.nextAction = 4;
						}
						break;
					}
					case 4: {
						ai.rest(creature, 500, 1750);			
						creature.weapon.vars.attacking = true;
						creature.weapon.vars.endAttackAnimationTime = performance.now() + 3000;
						creature.weapon.sprite.attackPositionOffset.y = TILE_SIZE * 12/16;
						if(creature.vars.facingRight) {
							creature.weapon.vars.rotation = Math.PI / 2;
						} else {
							creature.weapon.vars.rotation = 3 * Math.PI / 2;
						}
						creature.ai.nextAction = 2;
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
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	moveRandomVector: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	aim: function(creature, duration_factor, duration_min, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.aim(direction);
		creature.vars.aimDirection = direction;
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	attack: function(creature, duration_factor, duration_min, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.attack(direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	moveAwayFromPlayer: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
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
	},
	moveInDirection: function(creature, duration_factor, duration_min, speed_multiplier, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		if(!accuracy) {
			accuracy = 1;
		}
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.movement.direction = direction;
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
	bite: function(creature, duration, animation) {
		creature.setFacing(getPlayerDirection(creature));
		setAiTiming(creature, duration);
		if(animation) {
			creature.vars.animation = animation;
		}
		creature.movement.speed = 0;
	}
}