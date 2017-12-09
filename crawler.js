$(function() {
	var level;											//	Current level object, loaded from levels.js
	var player = {};									//	Player object

	var creatures = [];
	var attacks = [];
	var colliders = [];							//	Store any active collision boxes - player, creatures, obstacles etc
	var debugs = [];									//	Store any objects to be passed to debug canvas

	var focused = true;									//	Track whether browser tab is focused by user

	//	Player controls
	//	Keyboard input helper object
	var Key = {
		_pressed: {},
		MOVE_LEFT: 'KeyA',
		MOVE_RIGHT: 'KeyD',
		MOVE_UP: 'KeyW',
		MOVE_DOWN: 'KeyS',
		ATTACK_LEFT: 'ArrowLeft',
		ATTACK_RIGHT: 'ArrowRight',
		ATTACK_UP: 'ArrowUp',
		ATTACK_DOWN: 'ArrowDown',
		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},
		noneDown: function() {
			return $.isEmptyObject(this._pressed); 
		},
		onKeydown: function(event) {
			this._pressed[event.code] = true;
		},
		onKeyup: function(event) {
			delete this._pressed[event.code];
		},
		clearPressed: function() {
			this._pressed = {};
		} 
	}

	//	Input control event listeners
	window.addEventListener('keyup', function(event) {
		Key.onKeyup(event);
	}, false);
	window.addEventListener('keydown', function(event) {
		Key.onKeydown(event);
	}, false);




	//	Level setup
	function setupTerrain(level) {									//	Draw core terrain types
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[i].length; j++) {
				var sheetTile_x = 0;							//	Count no. of tiles on spriteSheet from left - first col = 0, second col = 1 etc
				var sheetTile_y = 0;							//	Ditto for rows
				var tileWidth = 1;								//	Increase if terrain spans multiple tiles
				var tileHeight = 1;
				switch(level.terrainArray[i][j]) {
					case 0: {									//	Plain floor tile
						sheetTile_x = 2; sheetTile_y = 3; break;
					}
					case 1: {									//	Impassable wall tiles
						if(level.terrainArray[i+1] !== undefined && level.terrainArray[i+1][j] === 0) {		//	Check if wall tile has passable tile below it
							if(level.terrainArray[i][j-1] !== undefined && level.terrainArray[i][j-1] === 0) {				//	If so, and terrain to left of wall tile is passable, use left end graphic
								sheetTile_x = 0; sheetTile_y = 1; break;		
							} else if(level.terrainArray[i][j+1] !== undefined && level.terrainArray[i][j+1] === 0) {		//	If so, and terrain to right of wall tile is passable, use right end graphic
								sheetTile_x = 2; sheetTile_y = 1; break;		
							} else {																			//	If neither side is passable, use mid wall graphic
								sheetTile_x = 1; sheetTile_y = 1; break;		
							}
						} else {																//	If wall does not have passable tile below it, use solid inner wall tile
							sheetTile_x = 4; sheetTile_y = 6; break;
						}
					}
					default: {
						break;
					}
				}
				bgCtx.drawImage(level.img, 					//	Image to load
					sheetTile_x * TILE_SIZE, 		//	x-coord to start clipping
					sheetTile_y * TILE_SIZE, 		//	y-coord to start clipping
					TILE_SIZE * tileWidth, 			//	width of clipped image
					TILE_SIZE * tileHeight, 		//	height of clipped image
					TILE_SIZE * j, 					//	x-coord of canvas placement
					TILE_SIZE * i, 					//	y-coord of canvas placement
					TILE_SIZE * tileWidth, 			//	width of image on canvas
					TILE_SIZE * tileHeight
				);		//	height of image on canvas
			}
		}
	}

	function setupOverlays(level) {									//	Draw inert overlay tile decorators
		for(var i = 0; i < level.overlayArray.length; i++) {
			for(var j = 0; j < level.overlayArray[i].length; j++) {
				var addOverlay = true;
				var sheetTile_x = 0;							//	Count no. of tiles on spriteSheet from left - first col = 0, second col = 1 etc
				var sheetTile_y = 0;							//	Ditto for rows
				var tileWidth = 1;								//	Increase if terrain spans multiple tiles
				var tileHeight = 1;
				switch(level.overlayArray[i][j]) {
					case 0: {									//	No overlay
						addOverlay = false; break;
					}
					case 1: {
						tileWidth = 2; tileHeight = 3;
						sheetTile_x = 5; sheetTile_y = 0; break;		//	Staircase top (2x1)
					}
					case 2: {
						tileWidth = 1; tileHeight = 2;
						sheetTile_x = 3; sheetTile_y = 1; break;		//	Green ooze from wall
					}
					case 3: {
						tileWidth = 1; tileHeight = 1;
						sheetTile_x = 12; sheetTile_y = 4; break;		//	Red pennant
					}
					case 4: {
						tileWidth = 1; tileHeight = 1;
						sheetTile_x = 3; sheetTile_y = 0; break;		//	Blue wall pipe 1
					}
					case 5: {
						tileWidth = 1; tileHeight = 3;
						sheetTile_x = 6; sheetTile_y = 3; break;		//	Wall column (1x3)
					}
					default: {
						break;
					}
				}
				if(addOverlay) {
					bgCtx.drawImage(level.img, 					//	Image to load
						sheetTile_x * TILE_SIZE, 		//	x-coord to start clipping
						sheetTile_y * TILE_SIZE, 		//	y-coord to start clipping
						TILE_SIZE * tileWidth, 			//	width of clipped image
						TILE_SIZE * tileHeight, 		//	height of clipped image
						TILE_SIZE * j, 					//	x-coord of canvas placement
						TILE_SIZE * i, 					//	y-coord of canvas placement
						TILE_SIZE * tileWidth, 			//	width of image on canvas
						TILE_SIZE * tileHeight
					);		//	height of image on canvas
				}
			}
		}
	}

	//	Set up player
	function setUpPlayer() {
		var playerType = 0;															//	Set playerType template
		player = new Creature(playerTemplates[playerType], 2, 5);					//	Construct player from playerType
		player.ctx = playerCtx;														//	Assign player to player canvas
		player.weapon = playerWeapons[1];											//	Assign starting weapon
		Object.assign(player.weapon.position, player.position);
		player.vars.lastAttackTime = 0;													//	Initialize to zero
		player.vars.attackRate = playerTemplates[playerType].vars.attackRate;					//	Time between attacks
	}

	function setUpCreatures() {
		var creature = new Creature(creatureTemplates[EnumCreature.MINI_GHOST], 4, 4);
		creatures.push(creature);
		var creature2 = new Creature(creatureTemplates[EnumCreature.GREEN_GOBLIN], 3, 6);
		creatures.push(creature2);
	}

	function drawOnCanvas(entity, ctx) {
		if(entity.hasOwnProperty('rotation')) {
			ctx.save();
			ctx.translate(entity.position.x, entity.position.y);
			entity.position.x = entity.vars.drawOffset.x; 
			entity.position.y = entity.vars.drawOffset.y;
			ctx.rotate(entity.rotation);
		} else {
			entity.position.x += entity.vars.drawOffset.x; 
			entity.position.y += entity.vars.drawOffset.y;
		}
		ctx.drawImage(entity.sprite.spriteSheet,
			entity.vars.sprite.x * TILE_SIZE, 												//	x-coord to start clipping
			entity.vars.sprite.y * TILE_SIZE, 												//	y-coord to start clipping
			entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
			entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
			entity.position.x - TILE_SIZE * entity.sprite.size.x / 2, 	//	x-coord of canvas placement
			entity.position.y - TILE_SIZE * entity.sprite.size.y / 2, 	//	y-coord of canvas placement
			entity.sprite.size.x * TILE_SIZE, 			//	width of image on canvas
			entity.sprite.size.y * TILE_SIZE			//	height of image on canvas
		);
		if(entity.hasOwnProperty('rotation')) {
			ctx.restore();
		}
	}

	function Entity(entityTemplate, x, y) {
		this.name = entityTemplate.name;
		this.ctx = entityCtx;
		this.position = {};
		this.position.x = x * TILE_SIZE + TILE_SIZE / 2;
		this.position.y = y * TILE_SIZE + TILE_SIZE / 2;
		this.sprite = entityTemplate.sprite;						//	Reference template sprite object (don't copy)
		this.vars = {};
		Object.assign(this.vars, entityTemplate.vars);				//	Copy vars object
		this.box = {};
		this.box.topLeft = {}; this.box.bottomRight = {};
		Object.assign(this.box, entityTemplate.box);				//	Copy box object
		this.updateBox();											//	Update box co-ordinates
		this.vars.animstart = performance.now();
	}
	Entity.prototype.animate = function() {
		var pointInAnimLoop = Math.floor((performance.now() - this.vars.animstart) % this.sprite.animations[this.vars.animation][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
		//	Need to generalize this - only works for animations with 5 or less frames
		if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][0]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][0]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][1]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][1]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][2]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][2]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][3]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][3]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][4]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][4]];
		}
		if(this.weapon && this.weapon.sprite) {
			if(performance.now() > this.vars.lastAttackTime + this.weapon.vars.animTime) {
				if(pointInAnimLoop <= this.sprite.animations[EnumState.RESTING_R][1][0]) {
					this.weapon.vars.drawOffset.y = 0;
				} else {
					this.weapon.vars.drawOffset.y = 1;
				}
			}
		}
	}
	Entity.prototype.updateBox = function() {
		this.box.topLeft.x = this.position.x - this.box.width / 2 + 1;
		this.box.topLeft.y = this.position.y + (this.sprite.size.y * TILE_SIZE / 2) - this.box.height + 1;
		this.box.bottomRight.x = this.position.x + this.box.width / 2 - 1;
		this.box.bottomRight.y = this.position.y + (this.sprite.size.y * TILE_SIZE / 2) - 1;
		// debugs.push(this.box.topLeft, this.box.bottomRight);
	}

	//	Assign prototype
	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;

	function Creature(creatureTemplate) {
		Entity.apply(this, arguments);
		this.ctx = creatureCtx;
		this.ai = {};
		Object.assign(this.ai, creatureTemplate.ai);
		this.movement = {};
		Object.assign(this.movement, creatureTemplate.movement);
		colliders.push(this);
		console.log(this);
	}
	Creature.prototype.move = function(direction, speed) {
		var tryX = this.position.x + (speed * Math.cos(direction));
		var tryY = this.position.y + (speed * Math.sin(direction));
		var newCoords = checkCollision(this, tryX, tryY);
		this.position.x = newCoords.x;
		this.position.y = newCoords.y;
		this.updateBox();
	}
	Creature.prototype.attack = function(direction) {
		if(performance.now() - this.vars.lastAttackTime > this.vars.attackRate) {
			if((direction < Math.PI * 2 && direction > Math.PI * 1.5) || (direction >= 0 && direction < Math.PI * 0.5) && !this.vars.facingRight) {
				this.vars.facingRight = true;
			} else if((direction < Math.PI * 1.5 && direction > Math.PI / 2 ) && this.vars.facingRight) {
				this.vars.facingRight = false;
			} 
		new Attack(this, direction);
			this.vars.lastAttackTime = performance.now();
		}
	}
	Creature.prototype.setFacing = function() {
		if(Math.cos(this.movement.direction) >= 0) {
			this.vars.facingRight = true;
			if(this.vars.animation === EnumState.MOVING_L) {
				this.vars.animation = EnumState.MOVING_R;
			}
		} else {
			this.vars.facingRight = false;
			if(this.vars.animation === EnumState.MOVING_R) {
				this.vars.animation = EnumState.MOVING_L;
			}
		}
	}

	function Attack(origin, direction) {
		Object.assign(this, origin.weapon.attack);
		this.sprite = origin.weapon.sprite.current;
		this.origin = {
			x: origin.position.x,
			y: origin.position.y
		}
		this.direction = direction;
		origin.weapon.vars.lastAttackDirection = direction;
		if(origin.weapon.vars.hasAttackVariants) {
			origin.weapon.vars.lastAttackVariant = Math.floor(Math.random() * 2);
		}
		this.created = performance.now();
		this.contactPoints = [
			{ x: origin.position.x + Math.cos(this.direction - Math.PI * 0.25) * this.reach, y: origin.position.y + Math.sin(this.direction - Math.PI * 0.25) * this.reach },
			{ x: origin.position.x + Math.cos(this.direction - Math.PI * 0.125) * this.reach, y: origin.position.y + Math.sin(this.direction - Math.PI * 0.125) * this.reach },
			{ x: origin.position.x + Math.cos(this.direction) * this.reach, y: origin.position.y + Math.sin(this.direction) * this.reach },
			{ x: origin.position.x + Math.cos(this.direction + Math.PI * 0.125) * this.reach, y: origin.position.y + Math.sin(this.direction + Math.PI * 0.125) * this.reach },
			{ x: origin.position.x + Math.cos(this.direction + Math.PI * 0.25) * this.reach, y: origin.position.y + Math.sin(this.direction + Math.PI * 0.25) * this.reach },
			{ x: origin.position.x + Math.cos(this.direction - Math.PI * 0.25) * this.reach / 2, y: origin.position.y + Math.sin(this.direction - Math.PI * 0.25) * this.reach / 2},
			{ x: origin.position.x + Math.cos(this.direction) * this.reach / 2, y: origin.position.y + Math.sin(this.direction) * this.reach / 2},
			{ x: origin.position.x + Math.cos(this.direction + Math.PI * 0.25) * this.reach / 2, y: origin.position.y + Math.sin(this.direction + Math.PI * 0.25) * this.reach / 2}
		];
		origin.weapon.sprite.lastAttackVariant = Math.floor(Math.random() * origin.weapon.sprite.attackVariants);
		attacks.push(this);
		// this.contactPoints.forEach(function(contactPoint) {
		// 	debugs.push(contactPoint);
		// });
	}

	function drawAttackSwipe(attack) {
		attackCtx.moveTo(attack.origin.x, attack.origin.y);
		attackCtx.beginPath();
		attackCtx.arc(attack.origin.x, attack.origin.y, attack.reach, attack.direction - attack.arc / 2, attack.direction + attack.arc / 2);
		attackCtx.lineTo(attack.origin.x, attack.origin.y);
		attackCtx.closePath();
		var grd = attackCtx.createRadialGradient(attack.origin.x, attack.origin.y, attack.reach * attack.swipeThickness, attack.origin.x, attack.origin.y, attack.reach);
		grd.addColorStop(0, attack.swipeColor1);
		grd.addColorStop(1, attack.swipeColor2);
		attackCtx.fillStyle = grd;
		attackCtx.fill();
	}

	function drawPlayer() {
		drawOnCanvas(player, playerCtx);
		drawOnCanvas(player.weapon, playerCtx);
	}

	//	Update player movement
	function updatePlayer() {
		var moving = player.vars.moving;
		if(Key.isDown(Key.MOVE_UP)) { player.move(Math.PI * 1.5, player.vars.speed); player.vars.moving = true; };
		if(Key.isDown(Key.MOVE_DOWN)) { player.move(Math.PI * 0.5, player.vars.speed); player.vars.moving = true; }
		if(Key.isDown(Key.MOVE_LEFT)) { player.move(Math.PI * 1, player.vars.speed); player.vars.moving = true; if(player.vars.facingRight) { player.vars.facingRight = false }}
		if(Key.isDown(Key.MOVE_RIGHT)) { player.move(0, player.vars.speed); player.vars.moving = true; if(!player.vars.facingRight) { player.vars.facingRight = true }}

		if(Key.isDown(Key.ATTACK_UP)) { player.attack(Math.PI * 1.5); }
		if(Key.isDown(Key.ATTACK_DOWN)) { player.attack(Math.PI / 2); }
		if(Key.isDown(Key.ATTACK_LEFT)) { player.attack(Math.PI); }
		if(Key.isDown(Key.ATTACK_RIGHT)) { player.attack(0); }

		if(!Key.isDown(Key.MOVE_UP) && !Key.isDown(Key.MOVE_DOWN) && !Key.isDown(Key.MOVE_LEFT) && !Key.isDown(Key.MOVE_RIGHT)) { player.vars.moving = false; }
		if(moving != player.vars.moving) { 
			player.vars.animstart = performance.now();
		}
		//	Assign player.animation (used to load appropriate animation)
		if(!player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.RESTING_R; }
		else if(!player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.RESTING_L; }
		else if(player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.MOVING_R; }
		else if(player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.MOVING_L; }
		updateGear(player);
		player.animate();
	}

	function updateGear(creature) {
		if(creature.weapon !== undefined) {																						//	If creature has a weapon...
			creature.weapon.position.x = creature.position.x;																	//	...set its position to equal that of creature.
			creature.weapon.position.y = creature.position.y;
			if(performance.now() - creature.vars.lastAttackTime < creature.weapon.vars.animTime) {								//	If within animtime of last attack...
				creature.weapon.vars.drawOffset.x = -creature.weapon.sprite.attackDrawOffset.x;									//	...set weapon's drawOffset to attackDrawOffset...
				creature.weapon.vars.drawOffset.y = -creature.weapon.sprite.attackDrawOffset.y;
				if(creature.weapon.vars.lastAttackVariant === 0) {																//	...	and if lastAttackVariant is 0...
					creature.weapon.rotation = creature.weapon.vars.lastAttackDirection + Math.PI / 2 - creature.weapon.attack.arc /2;	//	...rotate weapon to display half arc *above* attack direction...
				} else {																										//	...or if lastAttackVariant is 1...
					creature.weapon.rotation = creature.weapon.vars.lastAttackDirection + Math.PI / 2 + creature.weapon.attack.arc /2;	//	...rotate weapon to display half arc *below* attack direction.
				}
			} else {																											//	Else if has not attacked recently...
				delete creature.weapon.rotation;																				//	...remove any weapon rotation.
				creature.weapon.vars.drawOffset.y = 0;
				if(creature.vars.facingRight) {																					//	If facingRight...
					creature.weapon.vars.sprite = creature.weapon.sprite.frames[0];												//	...set R facing weapon sprite...
					creature.weapon.position.x += creature.weapon.sprite.restingDrawOffset.x;									//	...and offset it.
					creature.weapon.position.y += creature.weapon.sprite.restingDrawOffset.y;
				} else {
					creature.weapon.vars.sprite = creature.weapon.sprite.frames[1];												//	Else if not facingRight, set L facing weapon sprite...
					creature.weapon.position.x -= creature.weapon.sprite.restingDrawOffset.x;									//	...and offset it.
					creature.weapon.position.y += creature.weapon.sprite.restingDrawOffset.y;
				}
			}
		}
	}

	function updateCreatures() {
		creatures.forEach(function(creature) {
			if(creature.vars.currentHP <= 0) {
				creatures.splice(creatures.indexOf(creature), 1);											//	If creature has no more hp, remove it...
				colliders.splice(colliders.indexOf(creature), 1);											//	...and remove it from colliders array
			}
			if(performance.now() > creature.ai.startTime + creature.ai.duration) {							//	If creature's ai action has run its duration...
				setAiAction(creature);																		//	...assign a new one.
			}
			creature.animate();																				//	Animate creature
			if(creature.movement.speed > 0) {																//	If creature has a current movement speed...
				creature.move(creature.movement.direction, creature.movement.speed);						//	...move it accordingly
			}
		});
	}

	function updateAttacks() {
		resolveAttacks();
		attacks.forEach(function(attack) {
			if(performance.now() > attack.created + attack.displayTime) {
				attacks.splice(attacks.indexOf(attack), 1);
			}
		});
	}

	function resolveAttacks() {
		attacks.forEach(function(attack) {
			var hits = 0;
			attack.contactPoints.forEach(function(contactPoint) {
				creatures.forEach(function(creature) {
					//	Check whether contactPoint falls within bounding box of any creature
					if(contactPoint.x >= creature.box.topLeft.x && contactPoint.x <= creature.box.bottomRight.x
					&& contactPoint.y >= creature.box.topLeft.y && contactPoint.y <= creature.box.bottomRight.y) {
						console.log("Hit!");
						hits++;
						resolveHit(attack, creature);				//	If so, resolve hit
					}
					if(hits >= attack.maxHits) {														//	If maxHits for Attack is reached...
						attack.contactPoints.splice(0, attack.contactPoints.length);					//	...clear all contactPoints
					}
					if(performance.now() > attack.created + attack.lifespan) {
						attack.contactPoints.splice(attack.contactPoints.indexOf(contactPoint), 1);
					}
				});
			});
		});
	}

	function resolveHit(attack, target) {
		target.vars.currentHP -= 1;
	}

	function checkCollision(obj, tryX, tryY) {
		var returnCoords = { x: tryX, y: tryY };
		returnCoords = checkTerrainCollision(obj, returnCoords.x, returnCoords.y);
		returnCoords = checkColliderCollision(obj, returnCoords.x, returnCoords.y);
		return returnCoords;
	}

	//	Terrain Collision Manager - check for contact with impassable terrain
	function checkTerrainCollision(obj, tryX, tryY) {
		var returnCoords = {};

		var tryTerRX = Math.floor(((tryX + (obj.box.width / 2)) / TILE_SIZE));
		var tryTerLX = Math.floor(((tryX - (obj.box.width / 2) - 1) / TILE_SIZE));
		var tryTerY;

		if(obj.position.y === tryY) {																						//	If movement has no Y component...
			tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);									//	...set tryTerY to current grid row...
			returnCoords.y = obj.position.y;																				//	...and set return Y coord to current position.
		} else {
			if(tryY > obj.position.y) {																						//	Else if obj is trying to move down...
				tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE));													//	...set tryTerY...
			} else {																										//	...or if trying to move up...
				tryTerY = Math.floor(((tryY - obj.sprite.y_padding) / TILE_SIZE) + 0.5);										//	...set tryTerY.
			}
			if(level.terrainArray[tryTerY] === undefined ||																	//	Check whether terrain in tryY direction does not exist...
			tryTerY === 0 ||																								//	...or is on top row of terrain grid...
			(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) || 		//	...or is impassable on the right...
			(level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {			//	...or is impassable on the left.
				returnCoords.y = obj.position.y;																			//	If so, set y to return unchanged...
				if(obj.movement.bounceOff) {																				//	...and if obj bounces off...
					obj.movement.direction = -obj.movement.direction;														//	...invert direction...
					obj.setFacing();
				}
				tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);								//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}
		// debugger;
		if(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0 || 			//	If terrain does not exist or is impassable on the right...
		level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0) {				//	...or on the left...
			returnCoords.x = obj.position.x;																				//	...set x to return unchanged
			if(obj.movement.bounceOff) {																					//	...and if obj bounces off...
				obj.movement.direction += Math.PI;																			//	...and invert direction.
				obj.setFacing();
			}
		} else {
			returnCoords.x = tryX;																							//	Otherwise, success - return tryX coord
		}

		return returnCoords;																								//	Return final coordinates
	}

	//	Collider Collision Manager - check for contact with active box colliders
	function checkColliderCollision(obj, tryX, tryY) {
		var returnCoords = { x: tryX, y: tryY };
		for(var i = 0; i < colliders.length; i++) {
			if(colliders[i] !== obj) {
				var newTop = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) - obj.box.height - 1;
				var newBtm = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) + 1;
				var newL = returnCoords.x - (obj.box.width / 2 ) - 1;
				var newR = returnCoords.x + (obj.box.width / 2 ) + 1;

				if(
					(newTop < colliders[i].box.topLeft.y +1 && newBtm > colliders[i].box.topLeft.y -1 && newL < colliders[i].box.topLeft.x +1 && newR > colliders[i].box.topLeft.x -1) ||
					(newTop < colliders[i].box.bottomRight.y +1 && newBtm > colliders[i].box.bottomRight.y -1 && newL < colliders[i].box.topLeft.x +1 && newR > colliders[i].box.topLeft.x -1) ||
					(newTop < colliders[i].box.topLeft.y +1 && newBtm > colliders[i].box.topLeft.y -1 && newL < colliders[i].box.bottomRight.x +1 && newR > colliders[i].box.bottomRight.x -1) ||
					(newTop < colliders[i].box.bottomRight.y +1 && newBtm > colliders[i].box.bottomRight.y -1 && newL < colliders[i].box.bottomRight.x +1 && newR > colliders[i].box.bottomRight.x -1)
				) {
					returnCoords.x = obj.position.x;
					returnCoords.y = obj.position.y;
					if(obj.movement.bounceOff) {
						obj.movement.direction = obj.movement.direction + Math.PI;
						obj.setFacing();
					}
				}
			}
		}
		return returnCoords;
	}

	function drawDebugCanvas() {
		if(performance.now() % 5000 < 50) {				//	Clear all debugs every 5 seconds
			debugs = [];
		}
		debugs.forEach(function(debug) {
			debugCtx.strokeStyle = 'red';
			debugCtx.strokeRect(debug.x, debug.y, 1, 1);
		});
		colliders.forEach(function(collider) {
			debugCtx.strokeStyle = 'green';
			debugCtx.strokeRect(collider.box.topLeft.x, collider.box.topLeft.y, 1, 1);
			debugCtx.strokeRect(collider.box.bottomRight.x, collider.box.bottomRight.y, 1, 1);
		});
	}


	//	Master game update function
	function update(delta) {
		updatePlayer();
		updateCreatures();
		updateAttacks();
		// console.log(colliders);
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		// playerCtx.clearRect(player.position.x - TILE_SIZE, player.position.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);	//	Clear player canvas for player location & surrounding 8 tiles
		playerCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);	//	Clear player canvas for player location & surrounding 8 tiles
		attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);				//	Clear entire attack canvas
		creatureCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);			//	Clear entire creature canvas
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawPlayer();
		creatures.forEach(function(creature) {
			drawOnCanvas(creature, creatureCtx);
		});
		attacks.forEach(function(attack) {
			drawAttackSwipe(attack);
		});
		// drawDebugCanvas();
		$('#fps').text(MainLoop.getFPS());
	}

	//	Start routines
	function start() {
		level = loadLevel(0);
		setupTerrain(level);
		setupOverlays(level);
		setUpCreatures();
		setUpPlayer();
		MainLoop.setUpdate(update).setDraw(draw).start();
	}
	start();

	//	Pause & restart game when browser tab loses & regains focus
	window.onfocus = function() {
		focused = true;
		MainLoop.start();
	}
	window.onblur = function() {
		focused = false;
		Key.clearPressed();
		MainLoop.stop();
	}


});