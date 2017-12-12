$(function() {
	var level;											//	Current level object, loaded from levels.js

	var creatures = [];
	var attacks = [];
	var colliders = [];							//	Store any active collision boxes - player, creatures, obstacles etc
	var debugs = [];									//	Store any objects to be passed to debug canvas
	var corpses = [];

	var focused = true;									//	Track whether browser tab is focused by user

	var viewport_offset_x = 0;
	var viewport_offset_y = 0;
	var redrawBackground = false;

	setViewportOffset = function() {
		redrawBackground = false;
		if(viewport_offset_x < Math.floor(player.position.x - CANVAS_WIDTH * 0.65)) {
			viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.65);
			redrawBackground = true;
		} else if(viewport_offset_x > Math.floor(player.position.x - CANVAS_WIDTH * 0.35)) {
			viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.35);
			redrawBackground = true;
		}
		if(viewport_offset_x < 0) {
			viewport_offset_x = 0;
		} else if(viewport_offset_x > (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH) {
			viewport_offset_x = (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH;
		}

		if(viewport_offset_y < Math.floor(player.position.y - CANVAS_HEIGHT * 0.65)) {
			viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.65);
			redrawBackground = true;
		} else if(viewport_offset_y > Math.floor(player.position.y - CANVAS_HEIGHT * 0.35)) {
			viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.35);
			redrawBackground = true;
		}
		if(viewport_offset_y < 0) {
			viewport_offset_y = 0;
		} else if(viewport_offset_y > (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT) {
			viewport_offset_y = (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT;
		}
	}

	//	***NEED TO IMPROVE ON THIS IF SPRITES ARE EVER USED GREATER THAN 2x2 TILES***
	inViewport = function(x, y) {
		if(	x > viewport_offset_x - TILE_SIZE && x < viewport_offset_x + CANVAS_WIDTH + TILE_SIZE && 
			y > viewport_offset_y - TILE_SIZE && y < viewport_offset_y + CANVAS_HEIGHT + TILE_SIZE) {
			return true;
		} else {
			return false;
		}
	}


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
	function drawTerrain(level) {									//	Draw core terrain types
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
				if(inViewport(TILE_SIZE * j + (tileWidth * TILE_SIZE / 2), TILE_SIZE * i + (tileHeight * TILE_SIZE / 2))) {
					bgCtx.drawImage(level.img, 					//	Image to load
						sheetTile_x * TILE_SIZE, 		//	x-coord to start clipping
						sheetTile_y * TILE_SIZE, 		//	y-coord to start clipping
						TILE_SIZE * tileWidth, 			//	width of clipped image
						TILE_SIZE * tileHeight, 		//	height of clipped image
						TILE_SIZE * j - viewport_offset_x, 					//	x-coord of canvas placement
						TILE_SIZE * i - viewport_offset_y, 					//	y-coord of canvas placement
						TILE_SIZE * tileWidth, 			//	width of image on canvas
						TILE_SIZE * tileHeight
					);		//	height of image on canvas
				}
			}
		}
	}

	function drawOverlays(level) {									//	Draw inert overlay tile decorators
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
					if(inViewport(TILE_SIZE * j + (tileWidth * TILE_SIZE / 2), TILE_SIZE * i + (tileHeight * TILE_SIZE / 2))) {
						bgCtx.drawImage(level.img, 					//	Image to load
							sheetTile_x * TILE_SIZE, 		//	x-coord to start clipping
							sheetTile_y * TILE_SIZE, 		//	y-coord to start clipping
							TILE_SIZE * tileWidth, 			//	width of clipped image
							TILE_SIZE * tileHeight, 		//	height of clipped image
							TILE_SIZE * j - viewport_offset_x, 					//	x-coord of canvas placement
							TILE_SIZE * i - viewport_offset_y, 					//	y-coord of canvas placement
							TILE_SIZE * tileWidth, 			//	width of image on canvas
							TILE_SIZE * tileHeight
						);		//	height of image on canvas
					}
				}
			}
		}
	}

	//	Set up player
	function setUpPlayer() {
		var playerType = 0;															//	Set playerType template
		player = new Creature(playerTemplates[playerType], 2, 5);					//	Construct player from playerType
		player.ctx = playerCtx;														//	Assign player to player canvas
		player.weapon = new Weapon(playerWeapons[0]);								//	Assign starting weapon
		// Object.assign(player.weapon.position, player.position);
		player.vars.lastAttackTime = 0;													//	Initialize to zero
		player.vars.attackRate = playerTemplates[playerType].vars.attackRate;					//	Time between attacks
	}

	function setUpCreatures(level) {
		for(var i = 0; i < level.creatureArray.length; i++) {
			for(var j = 0; j < level.creatureArray[i].length; j++) {
				if(level.creatureArray[i][j]) {
					var creature = new Creature(creatureTemplates[level.creatureArray[i][j]]);
					creature.position.x = j * TILE_SIZE + TILE_SIZE / 2;
					creature.position.y = i * TILE_SIZE + TILE_SIZE / 2;
					creatures.push(creature);
					console.log(creature);
				}
			}
		}
		// var creature = new Creature(creatureTemplates[EnumCreature.GREEN_SLUDGIE], 4, 4);
		// creatures.push(creature);

		// var creature2 = new Creature(creatureTemplates[EnumCreature.GREEN_GOBLIN], 3, 6);
		// creature2.weapon = new Weapon(creatureWeapons[0]);
		// creatures.push(creature2);

		// var creature3 = new Creature(creatureTemplates[EnumCreature.MINI_GHOST], 13, 10);
		// creatures.push(creature3);

		// var creature4 = new Creature(creatureTemplates[EnumCreature.CAMP_VAMP], 16, 12);
		// creature4.weapon = new Weapon(creatureWeapons[3]);
		// creatures.push(creature4);

		// var creature5 = new Creature(creatureTemplates[EnumCreature.SKELTON], 15, 8);
		// creature5.weapon = new Weapon(creatureWeapons[1]);
		// creatures.push(creature5);

		// var creature6 = new Creature(creatureTemplates[EnumCreature.SKELTON], 16, 8);
		// creature6.weapon = new Weapon(creatureWeapons[2]);
		// creatures.push(creature6);

		// var creature7 = new Creature(creatureTemplates[EnumCreature.SKELTON], 15, 9);
		// creature7.weapon = new Weapon(creatureWeapons[1]);
		// creatures.push(creature7);

		// var creature8 = new Creature(creatureTemplates[EnumCreature.SKELTON], 16, 7);
		// creature8.weapon = new Weapon(creatureWeapons[2]);
		// creatures.push(creature8);

		// var creature9 = new Creature(creatureTemplates[EnumCreature.SKELTON], 16, 9);
		// creature9.weapon = new Weapon(creatureWeapons[2]);
		// creatures.push(creature9);

		// var creature10 = new Creature(creatureTemplates[EnumCreature.SKELTON], 15, 7);
		// creature10.weapon = new Weapon(creatureWeapons[1]);
		// creatures.push(creature10);
	}

	function drawOnCanvas(entity, ctx) {
		if(inViewport(entity.position.x, entity.position.y)) {
			if(entity.hasOwnProperty('rotation')) {
				ctx.save();
				ctx.translate(entity.position.x - viewport_offset_x, entity.position.y - viewport_offset_y);
				ctx.rotate(entity.rotation);
				entity.position.x = entity.vars.drawOffset.x - TILE_SIZE * entity.sprite.size.x / 2; 
				entity.position.y = entity.vars.drawOffset.y - TILE_SIZE * entity.sprite.size.y / 2;
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.vars.sprite.x * TILE_SIZE, 												//	x-coord to start clipping
					entity.vars.sprite.y * TILE_SIZE, 												//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
					entity.position.x, 	//	x-coord of canvas placement
					entity.position.y, 	//	y-coord of canvas placement
					entity.sprite.size.x * TILE_SIZE, 			//	width of image on canvas
					entity.sprite.size.y * TILE_SIZE			//	height of image on canvas
				);
				ctx.restore();
			} else {
				entity.position.x += entity.vars.drawOffset.x; 
				entity.position.y += entity.vars.drawOffset.y;
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.vars.sprite.x * TILE_SIZE, 												//	x-coord to start clipping
					entity.vars.sprite.y * TILE_SIZE, 												//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
					entity.position.x - TILE_SIZE * entity.sprite.size.x / 2 - viewport_offset_x, 	//	x-coord of canvas placement
					entity.position.y - TILE_SIZE * entity.sprite.size.y / 2 - viewport_offset_y, 	//	y-coord of canvas placement
					entity.sprite.size.x * TILE_SIZE, 			//	width of image on canvas
					entity.sprite.size.y * TILE_SIZE			//	height of image on canvas
				);
			}
		}
	}

	function Entity(entityTemplate, x, y) {
		this.name = entityTemplate.name;
		this.position = {};
		this.position.x = x * TILE_SIZE + TILE_SIZE / 2;
		this.position.y = y * TILE_SIZE + TILE_SIZE / 2;
		this.sprite = entityTemplate.sprite;						//	Reference template sprite object (don't copy)
		this.vars = {};
		Object.assign(this.vars, entityTemplate.vars);				//	Copy vars object
		this.vars.drawOffset = { x: 0, y: 0 };
		this.vars.touchDamage = false;								//	Default - does not damage player on contact
		this.box = {};
		this.box.topLeft = {}; this.box.bottomRight = {};
		Object.assign(this.box, entityTemplate.box);				//	Copy box object
		this.updateBox();											//	Update box co-ordinates
		this.vars.animStart = performance.now();
	}
	Entity.prototype.animate = function() {
		var pointInAnimLoop = Math.floor((performance.now() - this.vars.animStart) % this.sprite.animations[this.vars.animation][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
		//	Need to generalize this
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
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][5]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][5]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][6]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][6]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][7]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][7]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][8]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][8]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][9]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][9]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][10]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][10]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][11]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][11]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][12]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][12]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][13]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][13]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][14]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][14]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][15]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][15]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][16]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][16]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][17]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][17]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][18]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][18]];
		} else if(pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][19]) {
			this.vars.sprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][19]];
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

	//	Assign Entity prototype
	Weapon.prototype = Object.create(Entity.prototype);
	Weapon.prototype.constructor = Weapon;

	function Weapon(weaponTemplate) {
		Entity.apply(this, arguments);
		this.attack = weaponTemplate.attack;
	}


	//	Assign Entity prototype
	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;

	function Creature(creatureTemplate) {
		Entity.apply(this, arguments);
		if(!this.vars.attackRate) { this.vars.attackRate = 1 };
		this.vars.animation = 0;									//	Track animation number currently playing
		this.vars.animEnd = 0;
		this.vars.lastAttackTime = 0;								//	Track time of last attack
		this.vars.facingRight = true;
		this.vars.lastFacingChangeTime = 0;							//	Track time that facing direction last changed
		if(!this.vars.minFacingChangeTime) {
			this.vars.minFacingChangeTime = 50;						//	Minimum time to leave before allowing a change in facing direction (prevent 1 frame spins when trapped against walls)
		}
		this.ctx = creatureCtx;										//	Draw on Creature Canvas
		this.ai = {};
		Object.assign(this.ai, creatureTemplate.ai);				//	Copy AI object for this creature template
		this.movement = {};
		Object.assign(this.movement, creatureTemplate.movement);	//	Copy movement object for this creature template
		if(creatureTemplate.addWeapon) {
			var weapon = new Weapon(creatureWeapons[creatureTemplate.addWeapon()]);
			this.weapon = weapon;
		}
		if(creatureTemplate.touchDamage) {
			this.touchDamage = creatureTemplate.touchDamage;
		}
		this.inflictDamage = creatureTemplate.inflictDamage;		//	Set damage response function from template
		this.deathResponse = creatureTemplate.deathResponse;		//	Set death response function from template
		colliders.push(this);										//	Add creature to colliders array
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
		if(performance.now() - this.vars.lastAttackTime > this.vars.attackRate * this.weapon.vars.attackRate) {
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
		if(performance.now() > this.vars.lastFacingChangeTime + this.vars.minFacingChangeTime) {
			this.vars.lastFacingChangeTime = performance.now();
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
	}
	Creature.prototype.kill = function() {
		if(!this.vars.dead) {
			this.vars.dead = true;
			if(this.weapon) {
				delete this.weapon;															//	Delete creature's weapon property
			}
			colliders.splice(colliders.indexOf(this), 1);									//	Remove from the colliders array.
			this.ai.nextAction = -1;														//	Prevent further AI actions
			this.movement.speed = 0;														//	Zero speed
			this.movement.moving = false;													//	Stop moving
			this.position.x = Math.floor(this.position.x);									//	Round co-ords down to prevent blurred drawing on canvas
			this.position.y = Math.floor(this.position.y);
			this.vars.animStart = performance.now();										//	Set animation start time to now...
			if(this.vars.facingRight) {														//	...and set death animation
				this.vars.animation = 4;
			} else {
				this.vars.animation = 5;
			}
			this.vars.deathTime = performance.now() + this.sprite.animations[this.vars.animation][0] - 100;		//	Set deathTime to be current time plus duration of death animation minus 100ms
		}
	}
	Creature.prototype.checkIfCollides = function() {
		var collides = false;
		for(var i = 0; i < colliders.length; i++) {
			if(colliders[i] !== this) {
				var top = this.box.topLeft.y;
				var btm = this.box.bottomRight.y;
				var left = this.box.topLeft.x;
				var right = this.box.bottomRight.x;

				if(
				//	Check if this overlaps any corner of the collider...
				(top < colliders[i].box.topLeft.y +1 && btm > colliders[i].box.topLeft.y -1 && left < colliders[i].box.topLeft.x +1 && right > colliders[i].box.topLeft.x -1) ||
				(top < colliders[i].box.bottomRight.y +1 && btm > colliders[i].box.bottomRight.y -1 && left < colliders[i].box.topLeft.x +1 && right > colliders[i].box.topLeft.x -1) ||
				(top < colliders[i].box.topLeft.y +1 && btm > colliders[i].box.topLeft.y -1 && left < colliders[i].box.bottomRight.x +1 && right > colliders[i].box.bottomRight.x -1) ||
				(top < colliders[i].box.bottomRight.y +1 && btm > colliders[i].box.bottomRight.y -1 && left < colliders[i].box.bottomRight.x +1 && right > colliders[i].box.bottomRight.x -1) ||
				//	...or if this overlaps the top or bottom side of the collider...
				(top > colliders[i].box.topLeft.y -1 && btm < colliders[i].box.bottomRight.y +1 && left < colliders[i].box.topLeft.x +1 && right > colliders[i].box.topLeft.x -1) ||
				(top > colliders[i].box.topLeft.y -1 && btm < colliders[i].box.bottomRight.y +1 && left < colliders[i].box.bottomRight.x +1 && right > colliders[i].box.bottomRight.x -1) ||
				//	...or if this overlaps the left or right side of the collider...
				(top < colliders[i].box.topLeft.y +1 && btm > colliders[i].box.topLeft.y -1 && left > colliders[i].box.topLeft.x -1 && right < colliders[i].box.bottomRight.x +1) ||
				(top < colliders[i].box.bottomRight.y +1 && btm > colliders[i].box.bottomRight.y -1 && left > colliders[i].box.topLeft.x -1 && right < colliders[i].box.topLeft.x +1) ||
				//	...or dalls fully inside the collider
				(top > colliders[i].box.topLeft.y -1 && btm < colliders[i].box.bottomRight.y +1 && left > colliders[i].box.topLeft.x -1 && right < colliders[i].box.bottomRight.x +1)
				) {
					collides = true;
				}
			}
			if(collides) {
				break;
			}
		}
		return collides;
	}

	function leaveCorpse(creature) {
		var corpse = {
			position: {},
			vars: {
				drawOffset: {}
			},
			sprite: {}
		}
		Object.assign(corpse.sprite, creature.sprite);
		var lastFrame = creature.sprite.animations[creature.vars.animation][2].length - 1;				//	...get last frame of current animation (should be death animation!)...
		corpse.vars.sprite = creature.sprite.frames[creature.sprite.animations[creature.vars.animation][2][lastFrame]];	//	...and set it as the creature's current sprite...
		corpse.position.x = Math.floor(creature.position.x);
		corpse.position.y = Math.floor(creature.position.y);
		corpse.vars.drawOffset.x = Math.floor(creature.vars.drawOffset.x);
		corpse.vars.drawOffset.y = Math.floor(creature.vars.drawOffset.y);
		drawOnCanvas(corpse, bgCtx);
		corpses.push(corpse);
	}




	function Attack(origin, direction) {
		Object.assign(this, origin.weapon.attack);
		this.attacker = origin;
		if(origin.weapon.sprite) {
			this.sprite = origin.weapon.sprite.current;
		}
		this.origin = {
			x: origin.position.x,
			y: origin.position.y + origin.sprite.size.y * TILE_SIZE / 2 - origin.box.height / 2
		}
		this.direction = direction;
		origin.weapon.vars.lastAttackDirection = direction;
		if(origin.weapon.vars.hasAttackVariants) {
			origin.weapon.vars.lastAttackVariant = Math.floor(Math.random() * 2);
			origin.weapon.sprite.lastAttackVariant = Math.floor(Math.random() * origin.weapon.sprite.attackVariants);
		}
		this.created = performance.now();
		switch(this.type) {
			case(EnumAttack.SWIPE): {
				this.contactPoints = [
					{ x: this.origin.x + Math.cos(this.direction - this.arc * 0.50) * this.reach, y: this.origin.y + Math.sin(this.direction - this.arc * 0.50) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction - this.arc * 0.28) * this.reach, y: this.origin.y + Math.sin(this.direction - this.arc * 0.28) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction - this.arc * 0.15) * this.reach, y: this.origin.y + Math.sin(this.direction - this.arc * 0.15) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction) * this.reach, y: this.origin.y + Math.sin(this.direction) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction + this.arc * 0.15) * this.reach, y: this.origin.y + Math.sin(this.direction + this.arc * 0.15) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction + this.arc * 0.28) * this.reach, y: this.origin.y + Math.sin(this.direction + this.arc * 0.28) * this.reach },
					{ x: this.origin.x + Math.cos(this.direction + this.arc * 0.50) * this.reach, y: this.origin.y + Math.sin(this.direction + this.arc * 0.50) * this.reach },

					{ x: this.origin.x + Math.cos(this.direction - this.arc * 0.50) * this.reach / 2, y: this.origin.y + Math.sin(this.direction - this.arc * 0.50) * this.reach / 2},
					{ x: this.origin.x + Math.cos(this.direction - this.arc * 0.28) * this.reach / 2, y: this.origin.y + Math.sin(this.direction - this.arc * 0.28) * this.reach / 2},
					{ x: this.origin.x + Math.cos(this.direction) * this.reach / 2, y: this.origin.y + Math.sin(this.direction) * this.reach / 2},
					{ x: this.origin.x + Math.cos(this.direction + this.arc * 0.28) * this.reach / 2, y: this.origin.y + Math.sin(this.direction + this.arc * 0.28) * this.reach / 2},
					{ x: this.origin.x + Math.cos(this.direction + this.arc * 0.50) * this.reach / 2, y: this.origin.y + Math.sin(this.direction + this.arc * 0.50) * this.reach / 2}
				];
				break;
			}
			case(EnumAttack.STAB): {
				this.contactPoints = [
					{ x: origin.position.x + Math.cos(this.direction) * this.reach, y: origin.position.y + Math.sin(this.direction) * this.reach }
				];
				break;
			}
			default:
				break;
		} 
		attacks.push(this);
		this.contactPoints.forEach(function(contactPoint) {
			debugs.push(contactPoint);
		});
	}

	function drawAttack(attack) {
		switch(attack.type) {
			case(EnumAttack.SWIPE): {
				var origin_x = attack.origin.x - viewport_offset_x;
				var origin_y = attack.origin.y - viewport_offset_y;
				attackCtx.moveTo(origin.x,origin.y);
				attackCtx.beginPath();
				attackCtx.arc(origin_x, origin_y, attack.reach, attack.direction - attack.arc / 2, attack.direction + attack.arc / 2);
				attackCtx.lineTo(origin_x, origin_y);
				attackCtx.closePath();
				var grd = attackCtx.createRadialGradient(origin_x, origin_y, attack.reach * attack.swipeThickness, origin_x, origin_y, attack.reach);
				grd.addColorStop(0, attack.swipeColor1);
				grd.addColorStop(1, attack.swipeColor2);
				attackCtx.fillStyle = grd;
				attackCtx.fill();
				break;
			}
			case(EnumAttack.STAB): {
				attackCtx.beginPath();
				attackCtx.moveTo(attack.origin.x, attack.origin.y + attack.stabOffset_y);
				attackCtx.lineTo(attack.contactPoints[0].x, attack.contactPoints[0].y);
				attackCtx.strokeStyle = attack.stabColor1;
				attackCtx.lineWidth = attack.stabWidth;
				attackCtx.stroke();
				break;
			}
		}
	}

	function drawPlayer() {
		drawOnCanvas(player, playerCtx);
		drawOnCanvas(player.weapon, attackCtx);
	}

	function drawCreatures() {
		creatures.forEach(function(creature) {
			if(creature.vars.moveThroughColliders) {
				drawOnCanvas(creature, attackCtx);
			} else if(creature.weapon && !creature.weapon.vars.foreground) {
				if(creature.weapon.sprite.displayWhileResting || performance.now() < creature.vars.lastAttackTime + creature.weapon.vars.animTime) {
					drawOnCanvas(creature.weapon, creatureCtx);
				}
				drawOnCanvas(creature, creatureCtx);
			} else {
				drawOnCanvas(creature, creatureCtx);
			}
		});
	}

	function drawWeapons() {
		creatures.forEach(function(creature) {
			if(creature.weapon && !creature.vars.hideWeapon && creature.weapon.vars.foreground) {
				if(creature.weapon.sprite.displayWhileResting || performance.now() < creature.vars.lastAttackTime + creature.weapon.vars.animTime) {
					drawOnCanvas(creature.weapon, attackCtx);
				}
			} else if(creature.weapon && !creature.vars.hideWeapon && !creature.weapon.vars.foreground) {
				if(creature.weapon.sprite.displayWhileResting || creature.vars.lastAttackTime !== 0 && performance.now() < creature.vars.lastAttackTime + creature.weapon.vars.animTime) {
					drawOnCanvas(creature.weapon, attackCtx);
					// drawOnCanvas(creature, attackCtx);
				}
			}

		});
	}

	function drawAttacks() {
		attacks.forEach(function(attack) {
			drawAttack(attack);
		});
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
			player.vars.animStart = performance.now();
		}
		//	Assign current player animation
		if(performance.now() < player.vars.lastDamageTime + 1000) {						//	+ length of time to flash after taking damage
			if(!player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.RESTING_HITFLASH_R; }
			else if(!player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.RESTING_HITFLASH_L; }
			else if(player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.MOVING_HITFLASH_R; }
			else if(player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.MOVING_HITFLASH_L; }
		} else {
			if(!player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.RESTING_R; }
			else if(!player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.RESTING_L; }
			else if(player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.MOVING_R; }
			else if(player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.MOVING_L; }
		}
		updateGear(player);
		player.animate();
	}

	function updateGear(creature) {
		if(creature.weapon !== undefined) {																						//	If creature has a weapon...
			creature.weapon.position.x = creature.position.x;																	//	...set its position to equal that of creature.
			creature.weapon.position.y = creature.position.y + creature.sprite.size.y * TILE_SIZE / 2 - creature.box.height / 2;
			if(performance.now() - creature.vars.lastAttackTime < creature.weapon.vars.animTime) {								//	If within animtime of last attack...
				creature.weapon.vars.drawOffset.x = creature.weapon.sprite.attackDrawOffset.x;									//	...set weapon's drawOffset to attackDrawOffset...
				creature.weapon.vars.drawOffset.y = creature.weapon.sprite.attackDrawOffset.y;
				if(creature.weapon.vars.lastAttackVariant === 0) {																//	...	and if lastAttackVariant is 0...
					creature.weapon.rotation = creature.weapon.vars.lastAttackDirection + Math.PI / 2 - creature.weapon.attack.arc /2;	//	...rotate weapon to display half arc *above* attack direction...
				} else {																										//	...or if lastAttackVariant is 1...
					creature.weapon.rotation = creature.weapon.vars.lastAttackDirection + Math.PI / 2 + creature.weapon.attack.arc /2;	//	...rotate weapon to display half arc *below* attack direction.
				}
			} else {
				if(creature.weapon.sprite.displayWhileResting) {																//	Else if has not attacked recently...
					delete creature.weapon.rotation;																			//	...remove any weapon rotation.
					creature.weapon.vars.drawOffset.y = 0;
					if(creature.vars.facingRight) {																				//	If facingRight...
						creature.weapon.vars.sprite = creature.weapon.sprite.frames[0];											//	...set R facing weapon sprite...
						creature.weapon.position.x += creature.weapon.sprite.restingDrawOffset.x;								//	...and offset it.
						creature.weapon.position.y += creature.weapon.sprite.restingDrawOffset.y;
					} else {
						creature.weapon.vars.sprite = creature.weapon.sprite.frames[1];											//	Else if not facingRight, set L facing weapon sprite...
						creature.weapon.position.x -= creature.weapon.sprite.restingDrawOffset.x;								//	...and offset it.
						creature.weapon.position.y += creature.weapon.sprite.restingDrawOffset.y;
					}
				}	
			}
		}
	}

	function updateCreatures() {
		creatures.forEach(function(creature) {
			if(performance.now() > creature.vars.deathTime) {					//	If creature's deathTime has passed...
				leaveCorpse(creature);
				creatures.splice(creatures.indexOf(creature), 1);				//	...and remove the creature from creatures array...
			}
			if(creature.vars.currentHP <= 0 && !creature.vars.deathTime) {		//	If creature has 0 or less HP and deathTime has not yet been set...
				creature.deathResponse();										//	...trigger its death response.
			}
			if(performance.now() > creature.ai.endTime) {						//	If creature's ai action has run its duration...
				setAiAction(creature);																		//	...assign a new one.
			}
			creature.animate();																				//	Animate creature
			if(creature.movement.speed > 0) {																//	If creature has a current movement speed...
				creature.move(creature.movement.direction, creature.movement.speed);						//	...move it accordingly
			}
			if(creature.weapon !== undefined) {
				updateGear(creature);
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
		attacks.forEach(function(attack) {																							//	For each attack...
			var hits = 0;																											//	Count successful hits
			attack.contactPoints.forEach(function(contactPoint) {																	//	...iterate contact points...
				if(attack.attacker !== player) {																					//	...and if attacker was not player...
					if(contactPoint.x >= player.box.topLeft.x - 1 && contactPoint.x <= player.box.bottomRight.x + 1 				//	...check if attack falls within player's box...
					&& contactPoint.y >= player.box.topLeft.y - 1 && contactPoint.y <= player.box.bottomRight.y + 1) {
						if(player.vars.facingRight) {
							player.vars.animation = EnumState.HITFLASH_R;
						} else {
							player.vars.animation = EnumState.HITFLASH_L;
						}
						player.vars.lastDamageTime = performance.now();
						hits++;
						resolveHit(attack, player);				//	If so, resolve hit
					}
					if(hits >= attack.maxHits) {														//	If maxHits for Attack is reached...
						attack.contactPoints.splice(0, attack.contactPoints.length);					//	...clear all contactPoints
					}
					// if(performance.now() > attack.created + attack.lifespan) {
					// 	attack.contactPoints.splice(attack.contactPoints.indexOf(contactPoint), 1);
					// }
				}
				creatures.forEach(function(creature) {
					if(attack.attacker !== creature) {
						//	Check whether contactPoint falls within bounding box of any creature
						if(contactPoint.x >= creature.box.topLeft.x && contactPoint.x <= creature.box.bottomRight.x
						&& contactPoint.y >= creature.box.topLeft.y && contactPoint.y <= creature.box.bottomRight.y) {
							hits++;
							resolveHit(attack, creature);				//	If so, resolve hit
						}
						if(hits >= attack.maxHits) {														//	If maxHits for Attack is reached...
							attack.contactPoints.splice(0, attack.contactPoints.length);					//	...clear all contactPoints
						}
						// if(performance.now() > attack.created + attack.lifespan) {
						// 	attack.contactPoints.splice(attack.contactPoints.indexOf(contactPoint), 1);
						// }
					}
				});
			});
		});
	}

	function resolveHit(attack, target) {
		//	DAMAGE CALC GOES HERE
		var damage = 1;
		target.inflictDamage(damage);
		// console.log(target.name + " has " + target.vars.currentHP + " HP remaining.");
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
				} else if(obj.ai !== undefined) {
					obj.movement.speed = 0;
					obj.ai.endTime = performance.now();
				}
				tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);								//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}
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
			if(colliders[i] !== obj && !colliders[i].vars.moveThroughColliders && !obj.vars.moveThroughColliders) {
				var newTop = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) - obj.box.height;
				var newBtm = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2);
				var newL = returnCoords.x - (obj.box.width / 2 );
				var newR = returnCoords.x + (obj.box.width / 2 );

				if(
				//	Check if obj overlaps any corner of the collider...
				(newTop < colliders[i].box.topLeft.y +1 && newBtm > colliders[i].box.topLeft.y -1 && newL < colliders[i].box.topLeft.x +1 && newR > colliders[i].box.topLeft.x -1) ||
				(newTop < colliders[i].box.bottomRight.y +1 && newBtm > colliders[i].box.bottomRight.y -1 && newL < colliders[i].box.topLeft.x +1 && newR > colliders[i].box.topLeft.x -1) ||
				(newTop < colliders[i].box.topLeft.y +1 && newBtm > colliders[i].box.topLeft.y -1 && newL < colliders[i].box.bottomRight.x +1 && newR > colliders[i].box.bottomRight.x -1) ||
				(newTop < colliders[i].box.bottomRight.y +1 && newBtm > colliders[i].box.bottomRight.y -1 && newL < colliders[i].box.bottomRight.x +1 && newR > colliders[i].box.bottomRight.x -1) ||
				//	...or if obj overlaps the top or bottom side of the collider...
				(newTop > colliders[i].box.topLeft.y -1 && newBtm < colliders[i].box.bottomRight.y +1 && newL < colliders[i].box.topLeft.x +1 && newR > colliders[i].box.topLeft.x -1) ||
				(newTop > colliders[i].box.topLeft.y -1 && newBtm < colliders[i].box.bottomRight.y +1 && newL < colliders[i].box.bottomRight.x +1 && newR > colliders[i].box.bottomRight.x -1) ||
				//	...or if obj overlaps the left or right side of the collider...
				(newTop < colliders[i].box.topLeft.y +1 && newBtm > colliders[i].box.topLeft.y -1 && newL > colliders[i].box.topLeft.x -1 && newR < colliders[i].box.bottomRight.x +1) ||
				(newTop < colliders[i].box.bottomRight.y +1 && newBtm > colliders[i].box.bottomRight.y -1 && newL > colliders[i].box.topLeft.x -1 && newR < colliders[i].box.topLeft.x +1) ||
				//	...or dalls fully inside the collider
				(newTop > colliders[i].box.topLeft.y -1 && newBtm < colliders[i].box.bottomRight.y +1 && newL > colliders[i].box.topLeft.x -1 && newR < colliders[i].box.bottomRight.x +1)
				) {
					if(obj.vars.touchDamage && colliders[i] === player) {
						obj.vars.touchDamage = false;			//	Turn off touch damage to prevent multiple contact attacks
						player.vars.lastDamageTime = performance.now();
						player.inflictDamage(obj.touchDamage());
					}
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

	function collisionFixer() {
		colliders.forEach(function(collider) {
			if(collider !== player) {
				if(	checkColliderCollision(collider, player.box.topLeft.x, player.box.topLeft.y).x !== player.box.topLeft.x ||
					checkColliderCollision(collider, player.box.topLeft.x, player.box.topLeft.y).y !== player.box.topLeft.y ||
					checkColliderCollision(collider, player.box.bottomRight.x, player.box.topLeft.y).x !== player.box.bottomRight.x ||
					checkColliderCollision(collider, player.box.bottomRight.x, player.box.topLeft.y).y !== player.box.topLeft.y ||
					checkColliderCollision(collider, player.box.topLeft.x, player.box.bottomRight.y).x !== player.box.topLeft.x ||
					checkColliderCollision(collider, player.box.topLeft.x, player.box.bottomRight.y).y !== player.box.bottomRight.y ||
					checkColliderCollision(collider, player.box.bottomRight.x, player.box.bottomRight.y).x !== player.box.bottomRight.x ||
					checkColliderCollision(collider, player.box.bottomRight.x, player.box.bottomRight.y).y !== player.box.bottomRight.y ) {
					console.log(collider);
					console.log(player);
					debugger;
					console.log("STUCK!!!");
				}
				else {
					console.log("Ok!");
				}
			}
		});
	}

	function drawCorpses() {
		corpses.forEach(function(corpse) {
			drawOnCanvas(corpse, bgCtx);
		});
	}

	function drawDebugCanvas() {
		if(performance.now() % 5000 < 50) {				//	Clear all debugs every 5 seconds
			debugs = [];
		}
		// debugs.forEach(function(debug) {
		// 	debugCtx.strokeStyle = 'red';
		// 	debugCtx.strokeRect(debug.x, debug.y, 1, 1);
		// });
		colliders.forEach(function(collider) {
			debugCtx.strokeStyle = 'green';
			debugCtx.strokeRect(collider.box.topLeft.x, collider.box.topLeft.y, 1, 1);
			debugCtx.strokeRect(collider.box.bottomRight.x, collider.box.bottomRight.y, 1, 1);
		});
		attacks.forEach(function(attack) {
			attack.contactPoints.forEach(function(contactPoint) {
				debugCtx.strokeStyle = 'blue';
				debugCtx.strokeRect(contactPoint.x, contactPoint.y, 1, 1);
			});
		});
	}


	//	Master game update function
	function update(delta) {
		updatePlayer();
		updateCreatures();
		updateAttacks();
		// collisionFixer();
		setViewportOffset();
		// console.log(colliders);
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		if(redrawBackground) {
			bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			drawTerrain(level);
			drawOverlays(level);
			drawCorpses();
		}
		playerCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);	//	Clear player canvas for player location & surrounding 8 tiles
		attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);				//	Clear entire attack canvas
		creatureCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);			//	Clear entire creature canvas
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawCreatures();
		drawPlayer();
		drawAttacks();
		drawWeapons();
		// drawDebugCanvas();
		$('#fps').text(MainLoop.getFPS());
	}

	//	Start routines
	function start() {
		level = loadLevel(0);
		drawTerrain(level);
		drawOverlays(level);
		setUpPlayer();
		setUpCreatures(level);
		$('canvas').css('width', CANVAS_WIDTH * 3);
		$('canvas').css('height', CANVAS_HEIGHT * 3);
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