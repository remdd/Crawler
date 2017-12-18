$(function() {
	var level;											//	Current level object, loaded from levels.js

	var game = {
		redrawBackground: false,
		redrawObstaclesTo: 0
	}

	var creatures = [];
	var attacks = [];
	var projectiles = [];
	var colliders = [];							//	Store any active collision boxes - player, creatures, obstacles etc
	var nearbyColliders = [];					//	Store any colliders near the player to be checked every tick
	var debugs = [];							//	Store any objects to be passed to debug canvas
	var drawables = [];
	var drawOnTop = [];

	var focused = true;							//	Track whether browser tab is focused by user

	var viewport_offset_x = 0;
	var viewport_offset_y = 0;

	var interactDistance = 15;					//	Distance at which player can interact with interactables

	// var seed = Math.floor(Math.random() * 1000000);
	var seed = 3;
	var prng = new Random(seed);

	setViewportOffset = function() {
		game.redrawBackground = false;
		if(viewport_offset_x < Math.floor(player.position.x - CANVAS_WIDTH * 0.65)) {
			viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.65);
			game.redrawBackground = true;
		} else if(viewport_offset_x > Math.floor(player.position.x - CANVAS_WIDTH * 0.35)) {
			viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.35);
			game.redrawBackground = true;
		}
		if(viewport_offset_x < 0) {
			viewport_offset_x = 0;
		} else if(viewport_offset_x > (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH) {
			viewport_offset_x = (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH;
		}

		if(viewport_offset_y < Math.floor(player.position.y - CANVAS_HEIGHT * 0.65)) {
			viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.65);
			game.redrawBackground = true;
		} else if(viewport_offset_y > Math.floor(player.position.y - CANVAS_HEIGHT * 0.35)) {
			viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.35);
			game.redrawBackground = true;
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
	//	Keyboard input helper object to manage held down keys
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
		if(event.code === 'Space') {
			interact();
		} else {
			Key.onKeydown(event);
		}
	}, false);


	//	Level setup
	function addBackground() {
		var background = $('<div id="background">');
		background.css('background', level.tiles.solidColor);
		background.css('width', CANVAS_WIDTH * SCALE_FACTOR);
		background.css('height', CANVAS_HEIGHT * SCALE_FACTOR);
		background.appendTo('body');
	}

	function drawOverlays() {											//	Draw inert overlay tile decorators
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[i].length; j++) {
				if(inViewport(TILE_SIZE * j + (TILE_SIZE / 2), TILE_SIZE * i + (TILE_SIZE / 2))) {
					if(level.overlayArray[i][j] !== undefined && level.overlayArray[i][j] !== 0) {
						var overlay = level.overlayArray[i][j];
						bgCtx.drawImage(level.img, 						//	Image to load
							overlay.x * TILE_SIZE, 						//	x-coord to start clipping
							overlay.y * TILE_SIZE, 						//	y-coord to start clipping
							TILE_SIZE, 									//	width of clipped image
							TILE_SIZE, 									//	height of clipped image
							TILE_SIZE * j - viewport_offset_x, 			//	x-coord of canvas placement
							TILE_SIZE * i - viewport_offset_y, 			//	y-coord of canvas placement
							TILE_SIZE, 									//	width of image on canvas
							TILE_SIZE									//	height of image on canvas
						);
					}
				}
			}
		}
	}

	function drawObstacles() {
		for(var i = 0; i < level.obstacles.length; i++) {
			// debugger;
			if(inViewport(TILE_SIZE * level.obstacles[i].x + (TILE_SIZE / 2), TILE_SIZE * level.obstacles[i].y + (TILE_SIZE / 2))) {
				var ctx;
				var obstacle = level.obstacles[i];
				if(obstacle.ctx) {
					ctx = obstacle.ctx;
				} else {
					ctx = bgCtx;
				}
				ctx.drawImage(level.img, 						//	Image to load
					obstacle.sprite.x * TILE_SIZE, 						//	x-coord to start clipping
					obstacle.sprite.y * TILE_SIZE, 						//	y-coord to start clipping
					obstacle.size.x * TILE_SIZE, 						//	width of clipped image
					obstacle.size.y * TILE_SIZE, 						//	height of clipped image
					TILE_SIZE * obstacle.x - viewport_offset_x, 		//	x-coord of canvas placement
					TILE_SIZE * obstacle.y - viewport_offset_y, 		//	y-coord of canvas placement
					obstacle.size.x * TILE_SIZE, 						//	width of image on canvas
					obstacle.size.y * TILE_SIZE							//	height of image on canvas
				);
			}
		}	
	}

	//	Set up player
	function setUpPlayer() {
		var playerType = 0;																						//	Set playerType template
		player = new Creature(playerTemplates[playerType], level.playerStart.x, level.playerStart.y);			//	Construct player from playerType
		player.weapon = new Weapon(playerWeapons[0], player);													//	Assign starting weapon
		player.vars.lastAttackTime = 0;																			//	Initialize to zero
		player.vars.attackRate = playerTemplates[playerType].vars.attackRate;									//	Time between attacks
		player.weapon.reset();
		player.updateGear();
	}

	function setUpCreatures() {
		for(var i = 0; i < level.creatureArray.length; i++) {
			for(var j = 0; j < level.creatureArray[i].length; j++) {
				if(level.creatureArray[i][j]) {
					var creature = new Creature(creatureTemplates[level.creatureArray[i][j]]);
					creature.position.x = j * TILE_SIZE + TILE_SIZE / 2;
					creature.position.y = i * TILE_SIZE + TILE_SIZE / 2;
					creature.updateBox();
					creatures.push(creature);
				}
			}
		}
	}

	function drawOnCanvas(entity, ctx) {
		if(inViewport(entity.position.x, entity.position.y)) {
			if(entity.vars.hasOwnProperty('rotation')) {
				if(entity.name === 'Bone Arrow') {
					console.log(entity);
				}
				ctx.save();
				ctx.translate(entity.position.x - viewport_offset_x, entity.position.y - viewport_offset_y);
				ctx.rotate(entity.vars.rotation);
				var drawPosition = {};
				drawPosition.x = entity.vars.drawOffset.x - TILE_SIZE * entity.sprite.size.x / 2; 
				drawPosition.y = entity.vars.drawOffset.y - TILE_SIZE * entity.sprite.size.y / 2;
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.currentSprite.x * TILE_SIZE, 											//	x-coord to start clipping
					entity.currentSprite.y * TILE_SIZE, 											//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
					Math.floor(drawPosition.x), 													//	x-coord of canvas placement
					Math.floor(drawPosition.y), 													//	y-coord of canvas placement
					entity.sprite.size.x * TILE_SIZE, 												//	width of image on canvas
					entity.sprite.size.y * TILE_SIZE												//	height of image on canvas
				);
				ctx.restore();
			} else {
				// entity.position.x += entity.vars.drawOffset.x; 
				// entity.position.y += entity.vars.drawOffset.y;
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.currentSprite.x * TILE_SIZE, 												//	x-coord to start clipping
					entity.currentSprite.y * TILE_SIZE, 												//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 													//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 													//	height of clipped image
					Math.floor(entity.position.x - TILE_SIZE * entity.sprite.size.x / 2 - viewport_offset_x) + entity.vars.drawOffset.x, 	//	x-coord of canvas placement
					Math.floor(entity.position.y - TILE_SIZE * entity.sprite.size.y / 2 - viewport_offset_y) + entity.vars.drawOffset.y, 	//	y-coord of canvas placement
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
		this.vars.pointInAnimLoop = Math.floor((performance.now() - this.vars.animStart) % this.sprite.animations[this.vars.animation][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
		//	Need to generalize this
		if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][0]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][0]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][1]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][1]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][2]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][2]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][3]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][3]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][4]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][4]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][5]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][5]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][6]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][6]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][7]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][7]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][8]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][8]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][9]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][9]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][10]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][10]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][11]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][11]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][12]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][12]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][13]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][13]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][14]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][14]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][15]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][15]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][16]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][16]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][17]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][17]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][18]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][18]];
		} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][19]) {
			this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][19]];
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

	function Weapon(weaponTemplate, holder) {
		Entity.apply(this, arguments);
		this.use = weaponTemplate.use;
		this.reset = weaponTemplate.reset;
		this.attack = weaponTemplate.attack;
		this.projectile = weaponTemplate.projectile;
		this.holder = holder;
		this.vars.attacking = false;
	}
	Weapon.prototype.swipe = function(direction) {
		this.vars.lastAttackTime = performance.now();
		this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
		this.vars.lastAttackDirection = direction;
		var rand = Math.floor(Math.random() * 2);
		if(rand < 1) {
			this.vars.rotation = direction + 3 * this.attack.arc / 2;
		} else {
			this.vars.rotation = direction + 1 * this.attack.arc / 2;
		}
	}
	Weapon.prototype.chop = function(direction) {
		this.vars.lastAttackTime = performance.now();
		this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
		this.vars.lastAttackDirection = direction;
		if(this.holder.vars.facingRight) {
			this.vars.rotation = direction + 3 * this.attack.arc / 2;
		} else {
			this.vars.rotation = direction + 1 * this.attack.arc / 2;
		}
	}
	Weapon.prototype.shoot = function(direction, projectile) {
		this.holder.setFacing(direction);
		if(this.holder.vars.facingRight) {
			this.currentSprite = this.sprite.frames[0];
			this.vars.rotation = direction;
		} else {
			this.currentSprite = this.sprite.frames[1];
			this.vars.rotation = direction + Math.PI;
		}
		console.log("Shooting! " + direction + " " + projectile);
		new Projectile(creatureProjectiles[projectile], this.holder, direction);
	}

	Projectile.prototype = Object.create(Entity.prototype);
	Projectile.prototype.constructor = Projectile;

	function Projectile(projectileTemplate, shooter, direction) {
		console.log("New projectile! " + direction + " " + shooter.name);
		console.log(projectileTemplate);
		Entity.apply(this, arguments);
		this.vars = { 
			shooter: shooter, 
			drawOffset: { x: projectileTemplate.vars.drawOffset.x, y: projectileTemplate.vars.drawOffset.y }, 
			rotation: direction,
			displayTime: projectileTemplate.vars.displayTime,
			damagePlayer: projectileTemplate.vars.damagePlayer,
			damageCreatures: projectileTemplate.vars.damageCreatures
		};
		this.currentSprite = projectileTemplate.currentSprite;
		this.sprite = {};
		Object.assign(this.sprite, projectileTemplate.sprite);
		this.position = { x: shooter.weapon.position.x, y: shooter.weapon.position.y };
		this.movement = {};
		Object.assign(this.movement, projectileTemplate.movement);
		this.movement.direction = direction;
		projectiles.push(this);
		console.log(projectiles);
	}

	function updateProjectiles() {
		projectiles.forEach(function(projectile) {
			if(performance.now() > projectile.deleteTime) {
				projectiles.splice(projectiles.indexOf(projectile), 1);
			} else {
				Creature.prototype.move.call(projectile, projectile.movement.direction, projectile.movement.speed);
				if(projectile.collidedWith && !projectile.deleteTime) {
					projectile.deleteTime = performance.now() + projectile.vars.displayTime;
				}
				if(!projectile.stuckTo && projectile.collidedWith && projectile.collidedWith !== 1) {
					if(projectile.collidedWith.stuckProjectiles === undefined) {
						projectile.collidedWith.stuckProjectiles = [];
					}
					projectile.stuckTo = projectile.collidedWith;
					projectile.stuckOffset = {
						x: projectile.position.x - projectile.stuckTo.position.x,
						y: projectile.position.y - projectile.stuckTo.position.y
					}
					projectile.collidedWith.stuckProjectiles.push(projectile);
				}
				if(projectile.stuckTo) {
					projectile.movement.speed = 0;
					projectile.position.x = projectile.stuckTo.position.x + projectile.stuckOffset.x;
					projectile.position.y = projectile.stuckTo.position.y + projectile.stuckOffset.y;
				}
			}
		});

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
			this.vars.minFacingChangeTime = 200;					//	Minimum time to leave before allowing a change in facing direction (prevent 1 frame spins when trapped against walls)
		}
		this.ai = {};
		Object.assign(this.ai, creatureTemplate.ai);				//	Copy AI object for this creature template
		this.ai.startTime = 0;
		this.ai.endTime = 500;
		this.ai.action = 0;
		this.ai.nextAction = 0;		
		this.movement = {};
		Object.assign(this.movement, creatureTemplate.movement);	//	Copy movement object for this creature template
		if(creatureTemplate.addWeapon) {
			var weapon = new Weapon(creatureWeapons[creatureTemplate.addWeapon()], this);
			this.weapon = weapon;
		}
		if(this.setAiType) {
			this.setAiType();
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
		this.collidedWith = newCoords.collidedWith;
		if(this.updateBox) {
			this.updateBox();
		}
	}
	Creature.prototype.attack = function(direction) {
		if(this.weapon && performance.now() > this.vars.lastAttackTime + this.weapon.vars.attackRate) {
			this.setFacing(direction);
			this.vars.lastAttackTime = performance.now();
			this.weapon.vars.attacking = true;
			if(this.weapon.attack.type === EnumAttack.SWIPE || this.weapon.attack.type === EnumAttack.STAB) {
				var attack = this.weapon.use(direction);
				attack.attacker = this;
				new Attack(attack, direction);
			} else if(this.weapon.attack.type === EnumAttack.ARROW) {
				this.weapon.use(direction);
			}
		}
	}
	Creature.prototype.setFacing = function(direction) {
		if(performance.now() > this.vars.lastFacingChangeTime + this.vars.minFacingChangeTime) {
			this.vars.lastFacingChangeTime = performance.now();
			if(Math.cos(direction) >= 0) {
				this.vars.facingRight = true;
				if(this.vars.animation === EnumState.MOVING_L) {
					this.vars.animation = EnumState.MOVING_R;
				} else if(this.vars.animation === EnumState.RESTING_L) {
					this.vars.animation = EnumState.RESTING_R;
				}
			} else {
				this.vars.facingRight = false;
				if(this.vars.animation === EnumState.MOVING_R) {
					this.vars.animation = EnumState.MOVING_L;
				} else if(this.vars.animation === EnumState.RESTING_L) {
					this.vars.animation = EnumState.RESTING_R;
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


	interact = function() {
		level.obstacles.forEach(function(obstacle) {
			if(inViewport(obstacle.x * TILE_SIZE, obstacle.y * TILE_SIZE) && obstacle.interact) {
				if(getDistanceToPlayer(obstacle.position.x, obstacle.position.y) < interactDistance) {
					game.redrawObstaclesTo = performance.now() + obstacle.interact();
				}
			}
		});
	}

	function getDistanceToPlayer(x, y) {
		return Math.sqrt(((x - player.position.x) * (x - player.position.x)) + ((y - player.position.y) * (y - player.position.y)));
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
		corpse.currentSprite = creature.sprite.frames[creature.sprite.animations[creature.vars.animation][2][lastFrame]];	//	...and set it as the creature's current sprite...
		corpse.position.x = Math.floor(creature.position.x);
		corpse.position.y = Math.floor(creature.position.y);
		corpse.vars.drawOffset.x = Math.floor(creature.vars.drawOffset.x);
		corpse.vars.drawOffset.y = Math.floor(creature.vars.drawOffset.y);
		drawOnCanvas(corpse, bgCtx);
		level.decor.push(corpse);
	}

	function Attack(attack, direction) {
		Object.assign(this, attack);
		this.direction = direction;
		this.created = performance.now();
		switch(this.type) {
			case(EnumAttack.SWIPE): {
				this.contactPoints = [
					{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.50) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.50) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.28) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.28) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.15) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.15) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction) * this.reach, y: this.attacker.position.y + Math.sin(this.direction) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.15) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.15) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.28) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.28) * this.reach },
					{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.50) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.50) * this.reach },

					{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.50) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.50) * this.reach / 2},
					{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.28) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.28) * this.reach / 2},
					{ x: this.attacker.position.x + Math.cos(this.direction) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction) * this.reach / 2},
					{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.28) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.28) * this.reach / 2},
					{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.50) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.50) * this.reach / 2}
				];
				break;
			}
			case(EnumAttack.STAB): {
				this.contactPoints = [
					{ x: attacker.position.x + Math.cos(this.direction) * this.reach, y: attacker.position.y + Math.sin(this.direction) * this.reach }
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
				var origin_x = attack.attacker.position.x - viewport_offset_x;
				var origin_y = attack.attacker.position.y - viewport_offset_y;
				attackCtx.moveTo(origin.x,origin.y);
				attackCtx.beginPath();
				attackCtx.arc(origin_x, origin_y, attack.reach, attack.direction - attack.arc / 2, attack.direction + attack.arc / 2);
				attackCtx.lineTo(origin_x, origin_y);
				attackCtx.closePath();
				var grd = attackCtx.createRadialGradient(origin_x, origin_y, attack.reach * attack.swipeThickness, origin_x, origin_y, attack.reach);
				grd.addColorStop(0, attack.color1);
				grd.addColorStop(1, attack.color2);
				attackCtx.fillStyle = grd;
				attackCtx.fill();
				break;
			}
			case(EnumAttack.STAB): {
				attackCtx.beginPath();
				attackCtx.moveTo(attack.attacker.x, attack.attacker.y + attack.stabOffset_y);
				attackCtx.lineTo(attack.contactPoints[0].x, attack.contactPoints[0].y);
				attackCtx.strokeStyle = attack.stabColor1;
				attackCtx.lineWidth = attack.stabWidth;
				attackCtx.stroke();
				break;
			}
		}
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

	//	Add any drawable non-BG objects to drawables array and sort by y position for drawing on canvas
	function updateDrawables() {
		drawables.length = 0;
		drawOnTop.length = 0;
		drawables.push(player);
		creatures.forEach(function(creature) {
			if(inViewport(creature.position.x, creature.position.y)) {
				if(creature.vars.foreground) {
					drawOnTop.push(creature);
				} else {
					drawables.push(creature);
				}
			}
		});
		projectiles.forEach(function(projectile) {
			if(inViewport(projectile.position.x, projectile.position.y)) {
				if(projectile.vars.foreground) {
					drawOnTop.push(projectile);
				} else {
					drawables.push(projectile);
				}
			}
		});
		level.obstacles.forEach(function(obstacle) {
			if(inViewport(obstacle.position.x, obstacle.position.y) && obstacle.foreground) {
				drawables.push(obstacle);
			}
		});
		drawables.sort(function(a, b) {
			return a.position.y-b.position.y;
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

		if(Key.isDown(Key.INTERACT)) { interact(); }

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
		player.animate();
		player.updateGear();
	}

	Creature.prototype.updateGear = function() {
		if(this.weapon) {																									//	If creature has a weapon...
			this.weapon.position.x = this.position.x;																		//	Set weapon position to that of holder..
			this.weapon.position.y = this.position.y;
			if(this.weapon.vars.attacking && performance.now() > this.weapon.vars.endAttackAnimationTime) {					//	If its attack animation time has expired...
				this.weapon.vars.attacking = false;																			//	...reset its 'attacking' flag...
				this.weapon.reset();																						//	...and run its reset function.
			}
			if(this.weapon.vars.attacking) {																				//	If *still* attacking...
				this.weapon.vars.drawOffset.y = this.weapon.sprite.attackDrawOffset.y;										//	Set its y draw offset to the 'attacking' value...
				if(this.vars.facingRight) {
					this.weapon.vars.drawOffset.x = this.weapon.sprite.attackDrawOffset.x;									//	...and the x offset +ve or -ve depending on facing.
				} else {
					this.weapon.vars.drawOffset.x = -this.weapon.sprite.attackDrawOffset.x;
				}
			} else if(!this.weapon.vars.hidden) {
				this.weapon.vars.drawOffset.y = this.weapon.sprite.restingDrawOffset.y;										//	If *not* attacking...
				if(this.vars.facingRight) {																					//	...if holder is facing right...
					this.weapon.currentSprite = this.weapon.sprite.frames[0];													//	...set the weapon's right-facing sprite...
					this.weapon.vars.drawOffset.x = this.weapon.sprite.restingDrawOffset.x;									//	...and set +ve offset x
				} else {
					this.weapon.currentSprite = this.weapon.sprite.frames[1];
					this.weapon.vars.drawOffset.x = -this.weapon.sprite.restingDrawOffset.x;								//	If facing left, set -ve offset x
				}
				if(this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
					this.weapon.vars.drawOffset.y += 1;
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
			creature.updateGear();
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
		attacks.forEach(function(attack) {																							//	For each attack...
			var hits = 0;																											//	Count successful hits
			attack.contactPoints.forEach(function(contactPoint) {																	//	...iterate contact points...
				if(attack.damagePlayer) {																					//	...and if attacker was not player...
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
					if(attack.damageCreatures) {
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
		returnCoords = checkColliderCollision(obj, returnCoords.x, returnCoords.y, returnCoords.collidedWith);
		return returnCoords;
	}

	//	Terrain Collision Manager - check for contact with impassable terrain
	function checkTerrainCollision(obj, tryX, tryY) {
		var returnCoords = {};

		var tryTerRX = Math.floor(((tryX + (obj.box.width / 2)) / TILE_SIZE));
		var tryTerLX = Math.floor(((tryX - (obj.box.width / 2) - 1) / TILE_SIZE));
		var tryTerY;

		if(obj.position.y === tryY) {																						//	If movement has no Y component...
			tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);								//	...set tryTerY to current grid row...
			returnCoords.y = obj.position.y;																				//	...and set return Y coord to current position.
		} else {
			if(tryY > obj.position.y) {																						//	Else if obj is trying to move down...
				if(obj.box.type === EnumBoxtype.PROJECTILE) {																//	...and is a projectile...
					if(obj.position.y > obj.vars.shooter.position.y + obj.vars.shooter.sprite.size.y * TILE_SIZE / 2) {		//	...and has a y position lower than the base of its shooter...
						tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE) - 8/16);									//	...set tryTerY to be 1/2 row lower...
					} else {
						tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE));											//	...else set tryTerY as per norrmal.
					}
				} else {
					tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE));												//	...else set tryTerY...
				}
			} else {																										//	...or if trying to move up...
				tryTerY = Math.floor(((tryY - obj.sprite.y_padding) / TILE_SIZE) + 8/16);									//	...set tryTerY.
			}
			if(level.terrainArray[tryTerY] === undefined ||																	//	Check whether terrain in tryY direction does not exist...
			tryTerY === 0 ||																								//	...or is on top row of terrain grid...
			(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) || 		//	...or is impassable on the right...
			(level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {			//	...or is impassable on the left.
				returnCoords.y = obj.position.y;																			//	If so, set y to return unchanged...
				returnCoords.collidedWith = 1;
				if(obj.movement.bounceOff) {																				//	...and if obj bounces off...
					obj.movement.direction = -obj.movement.direction;														//	...invert direction...
					obj.setFacing(obj.movement.direction);
				} else if(obj.ai !== undefined) {
					// obj.movement.speed = 0;
					obj.ai.endTime = performance.now();
				}
				tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);							//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}
		if(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0 || 			//	If terrain does not exist or is impassable on the right...
		level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0) {				//	...or on the left...
			returnCoords.x = obj.position.x;																				//	...set x to return unchanged
			returnCoords.collidedWith = 1;
			if(obj.movement.bounceOff) {																					//	...and if obj bounces off...
				obj.movement.direction += Math.PI;																			//	...and invert direction.
				obj.setFacing(obj.movement.direction);
			}
		} else {
			returnCoords.x = tryX;																							//	Otherwise, success - return tryX coord
		}
		return returnCoords;																								//	Return final coordinates
	}

	//	Collider Collision Manager - check for contact with active box colliders
	function checkColliderCollision(obj, tryX, tryY, collidedWith) {
		var returnCoords = { x: tryX, y: tryY, collidedWith: collidedWith };
		for(var i = 0; i < colliders.length; i++) {
			if(colliders[i] !== obj && !colliders[i].vars.moveThroughColliders && !obj.vars.moveThroughColliders && colliders[i] !== obj.vars.shooter) {
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
					returnCoords.collidedWith = colliders[i];
					if(obj.movement.bounceOff) {
						obj.movement.direction = obj.movement.direction + Math.PI;
						obj.setFacing(obj.movement.direction);
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

	function drawDrawables() {
		drawables.forEach(function(drawable) {
			if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
				drawOnCanvas(drawable.weapon, drawableCtx);
			}
			drawOnCanvas(drawable, drawableCtx);
			if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
				drawOnCanvas(drawable.weapon, drawableCtx);
			}
		});
		drawOnTop.forEach(function(drawable) {
			if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
				drawOnCanvas(drawable.weapon, drawableCtx);
			}
			drawOnCanvas(drawable, drawableCtx);
			if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
				drawOnCanvas(drawable.weapon, drawableCtx);
			}
		});
		projectiles.forEach(function(projectile) {
			drawOnCanvas(projectile, drawableCtx);
		});
	}

	function drawDecor() {
		level.decor.forEach(function(decor) {
			drawOnCanvas(decor, bgCtx);
		});
	}

	function updateObstacles() {
		level.obstacles.forEach(function(obstacle) {
			if(obstacle.animated) {
				if(performance.now() > obstacle.animStart + obstacle.animTime) {
					obstacle.interactionEnd();
					game.redrawObstaclesTo = performance.now() + 1;
				}
			}
		});
	}

	function drawDebugCanvas() {
		projectiles.forEach(function(projectile) {
			var debug = { x: projectile.position.x, y: projectile.position.y, color: 'orange'};
			debugs.push(debug);
		});
		// colliders.forEach(function(collider) {
		// 	var debug = { x: collider.position.x, y: collider.position.y, color: 'blue'};
		// 	debugs.push(debug);
		// });
		// attacks.forEach(function(attack) {
		// 	attack.contactPoints.forEach(function(contactPoint) {
		// 		var debug = { x: contactPoint.x, y: contactPoint.y, color: 'green'};
		// 		debugs.push(debug);
		// 	});
		// });
		debugs.forEach(function(debug) {
			debugCtx.strokeStyle = debug.color;
			debugCtx.strokeRect(debug.x - viewport_offset_x, debug.y - viewport_offset_y, 1, 1);
		});
		debugs.length = 0;
	}


	//	Master game update function
	function update(delta) {
		setViewportOffset();
		updatePlayer();
		updateCreatures();
		updateAttacks();
		updateObstacles();
		updateProjectiles();
		updateDrawables();
		// collisionFixer();
		// console.log(colliders);
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		if(game.redrawBackground || game.redrawObstaclesTo > performance.now()) {
			bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			drawOverlays();
			drawDecor();
		}
		drawableCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawDrawables();
		attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawAttacks();
		// debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		// drawDebugCanvas();
		$('#fps').text(MainLoop.getFPS());
	}

	//	Start routines
	function start() {
		// debugger;
		level = levelGen.loadLevel(0, prng);
		console.log(level);
		setUpPlayer();
		setViewportOffset();
		addBackground();
		drawOverlays();
		// drawObstacles();
		setUpCreatures();
		$('canvas').css('width', CANVAS_WIDTH * SCALE_FACTOR);
		$('canvas').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
		MainLoop.setUpdate(update).setDraw(draw).start();
		drawMap();
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

	function drawMap() {
		var mapDiv = $('<div id="mapDiv"></div>');
		mapDiv.appendTo('body');
		$('#mapDiv').height(level.height * 3);
		$('#mapDiv').width(level.width * 3);
		for(var i = 0; i < level.height; i++) {
			for(var j = 0; j < level.width; j++) {
				if(level.terrainArray[i][j] === 0 && level.fillArray[i][j] === 2) {
					var terrain = $('<div class="terrain filledRoom"></div>');
					terrain.appendTo('#mapDiv');
				} else if(level.terrainArray[i][j] === 0 && level.fillArray[i][j] !== 2) {
					var terrain = $('<div class="terrain room"></div>');
					terrain.appendTo('#mapDiv');
				} else {
					var terrain = $('<div class="terrain"></div>');
					terrain.appendTo('#mapDiv');
				}
			}
		}
	}

});