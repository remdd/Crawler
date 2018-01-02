var level;											//	Current level object, loaded from levels.js

var session = {
	seed: Math.floor(Math.random() * 1000000),		//	Holds level seed
	seed: 617547,
	focused: true,									//	Track whether browser tab is focused by user
	levelNumber: 0,									//	Initial level
	loadingLevel: false,
	score: 0,
	vars: {
		interactDistance: 15,						//	Distance at which player can interact with interactables
		healthDropFrequency: 1						//	Average number of default death drops per health heart drop
	}
}

session.prng = new Random(session.seed);

var game = {
	redrawBackground: false,				//	Set to true only when background redraw is required - on viewport move or animated obstacle
	redrawObstaclesTo: 0,					//	Holds time to which obstacles should be animated
	viewport_offset_x: 0,					//	Holds current horizontal viewport offset
	viewport_offset_y: 0,					//	Holds current vertical viewport offset
	creatures: [],							//	Holds creatures currently present in game
	attacks: [],							//	Holds attacks currently present in game
	projectiles: [],						//	Holds projectiles currently present in game
	colliders: [],							//	Holds *all* collision boxes currently present in game - player, creatures, obstacles etc
	nearbyColliders: [],					//	Holds any colliders near to the player for collision detection every tick
	pickups: [],							//	Holds any contact-collected pickups
	debugs: [],								//	Holds any objects to be passed to debug canvas
	drawables: [],							//	Holds 
	drawOnTop: []							//	Holds drawables to be drawn on top of canvas
}


setViewportOffset = function() {
	game.redrawBackground = false;
	if(game.viewport_offset_x < Math.floor(player.position.x - CANVAS_WIDTH * 0.65)) {
		game.viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.65);
		game.redrawBackground = true;
	} else if(game.viewport_offset_x > Math.floor(player.position.x - CANVAS_WIDTH * 0.35)) {
		game.viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.35);
		game.redrawBackground = true;
	}
	if(game.viewport_offset_x < 0) {
		game.viewport_offset_x = 0;
	} else if(game.viewport_offset_x > (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH) {
		game.viewport_offset_x = (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH;
	}

	if(game.viewport_offset_y < Math.floor(player.position.y - CANVAS_HEIGHT * 0.65)) {
		game.viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.65);
		game.redrawBackground = true;
	} else if(game.viewport_offset_y > Math.floor(player.position.y - CANVAS_HEIGHT * 0.35)) {
		game.viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.35);
		game.redrawBackground = true;
	}
	if(game.viewport_offset_y < 0) {
		game.viewport_offset_y = 0;
	} else if(game.viewport_offset_y > (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT) {
		game.viewport_offset_y = (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT;
	}
}

//	***NEED TO IMPROVE ON IF LARGER SPRITES ARE EVER USED***
inViewport = function(x, y) {
	if(	x > game.viewport_offset_x - TILE_SIZE * 4 && x < game.viewport_offset_x + CANVAS_WIDTH + TILE_SIZE * 4 && 
		y > game.viewport_offset_y - TILE_SIZE * 4 && y < game.viewport_offset_y + CANVAS_HEIGHT + TILE_SIZE * 4) {
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

function setUpLevel() {
	level.obstacles.forEach(function(obstacle) {
		if(obstacle.box) {
			game.colliders.push(obstacle);								//	If obstacle has a collider, push to the collider array
		}
	});
}

function drawOverlays() {											
	for(var i = 0; i < level.terrainArray.length; i++) {			//	Draw inert overlay tile decorators
		for(var j = 0; j < level.terrainArray[i].length; j++) {
			if(inViewport(TILE_SIZE * j + (TILE_SIZE / 2), TILE_SIZE * i + (TILE_SIZE / 2))) {
				if(level.overlayArray[i][j] !== undefined && level.overlayArray[i][j] !== 0) {
					var overlay = level.overlayArray[i][j];
					bgCtx.drawImage(level.img, 						//	Image to load
						overlay.x * TILE_SIZE, 						//	x-coord to start clipping
						overlay.y * TILE_SIZE, 						//	y-coord to start clipping
						TILE_SIZE, 									//	width of clipped image
						TILE_SIZE, 									//	height of clipped image
						TILE_SIZE * j - game.viewport_offset_x, 			//	x-coord of canvas placement
						TILE_SIZE * i - game.viewport_offset_y, 			//	y-coord of canvas placement
						TILE_SIZE, 									//	width of image on canvas
						TILE_SIZE									//	height of image on canvas
					);
				}
			}
		}
	}
}

//	Set up player
function setUpPlayer() {
	player = {};
	var playerType = 0;																						//	Set playerType template
	player = new Creature(playerTemplates[playerType], level.playerStart.x, level.playerStart.y);			//	Construct player from playerType
	player.weapon = new Weapon(playerWeapons[0], player);													//	Assign starting weapon
	player.vars.lastAttackTime = 0;																			//	Initialize to zero
	player.vars.attackRate = playerTemplates[playerType].vars.attackRate;									//	Time between attacks
	player.weapon.reset();
	player.updateGear();
	player.items = [];
	$('.healthSpan').text(player.vars.currentHP + ' / ' + player.vars.maxHP);
	player.addItem = function(item) {
		player.items.push(item);
		console.log(player.items);
	}
}

function setUpCreatures() {
	for(var i = 0; i < level.creatureArray.length; i++) {
		for(var j = 0; j < level.creatureArray[i].length; j++) {
			if(level.creatureArray[i][j]) {
				var creature = new Creature(creatureTemplates[level.creatureArray[i][j]]);
				creature.position.x = j * TILE_SIZE + TILE_SIZE / 2;
				creature.position.y = i * TILE_SIZE + TILE_SIZE / 2;
				creature.grid.x = j;
				creature.grid.y = i;
				creature.updateBox();
				game.creatures.push(creature);
			}
		}
	}
	console.log(game.creatures);
}

function drawOnCanvas(entity, ctx) {
	if(inViewport(entity.position.x, entity.position.y)) {
		if(entity.vars.hasOwnProperty('rotation')) {
			ctx.save();
			ctx.translate(entity.position.x - game.viewport_offset_x, entity.position.y - game.viewport_offset_y);
			ctx.rotate(entity.vars.rotation);
			var drawPosition = {};
			drawPosition.x = Math.floor(entity.vars.drawOffset.x - TILE_SIZE * entity.sprite.size.x / 2); 
			drawPosition.y = Math.floor(entity.vars.drawOffset.y - TILE_SIZE * entity.sprite.size.y / 2);
			ctx.drawImage(entity.sprite.spriteSheet,
				entity.currentSprite.x * TILE_SIZE, 											//	x-coord to start clipping
				entity.currentSprite.y * TILE_SIZE, 											//	y-coord to start clipping
				entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
				entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
				drawPosition.x, 																//	x-coord of canvas placement
				drawPosition.y, 																//	y-coord of canvas placement
				entity.sprite.size.x * TILE_SIZE, 												//	width of image on canvas
				entity.sprite.size.y * TILE_SIZE												//	height of image on canvas
			);
			ctx.restore();
		} else {
			try {
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.currentSprite.x * TILE_SIZE, 												//	x-coord to start clipping
					entity.currentSprite.y * TILE_SIZE, 												//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 													//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 													//	height of clipped image
					Math.floor(entity.position.x - TILE_SIZE * entity.sprite.size.x / 2 - game.viewport_offset_x) + entity.vars.drawOffset.x, 	//	x-coord of canvas placement
					Math.floor(entity.position.y - TILE_SIZE * entity.sprite.size.y / 2 - game.viewport_offset_y) + entity.vars.drawOffset.y, 	//	y-coord of canvas placement
					entity.sprite.size.x * TILE_SIZE, 			//	width of image on canvas
					entity.sprite.size.y * TILE_SIZE			//	height of image on canvas
				);
			}
			catch(err) {
				console.log(err);
				console.log(entity);
			}
		}
	}
}

function Entity(entityTemplate, x, y) {
	this.name = entityTemplate.name;
	this.grid = {
		x: x,
		y: y
	}
	this.position = {
		x: x * TILE_SIZE + TILE_SIZE / 2,
		y: y * TILE_SIZE + TILE_SIZE / 2
	}
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
Entity.prototype.getGridOffsetFromPlayer = function() {
	var offset = {
		x: this.grid.x - player.grid.x,
		y: this.grid.y - player.grid.y
	}
	if(offset.x < 0) { offset.x *= -1 };
	if(offset.y < 0) { offset.y *= -1 };
	return offset;
}

//	Assign Entity prototype
Pickup.prototype = Object.create(Entity.prototype);
Pickup.prototype.constructor = Pickup;

function Pickup(pickupTemplate) {
	Entity.apply(this, arguments);
	this.pickup = pickupTemplate.pickup;
	this.vars.background = true;
	this.vars.animStart = performance.now();
	this.vars.animation = 0;
	this.currentSprite = pickupTemplate.currentSprite;
	this.movement = {};
	Object.assign(this.movement, pickupTemplate.movement);
	game.pickups.push(this);
}

//	Assign Entity prototype
Weapon.prototype = Object.create(Entity.prototype);
Weapon.prototype.constructor = Weapon;

function Weapon(weaponTemplate, holder) {
	Entity.apply(this, arguments);
	// Object.assign(this, weaponTemplate);
	this.currentSprite = weaponTemplate.currentSprite;
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
		this.vars.rotation = direction + Math.PI/2 + this.attack.arc / 2;
	} else {
		this.vars.rotation = direction + Math.PI/2 - this.attack.arc / 2;
	}
}
Weapon.prototype.shoot = function(direction, projectile) {
	this.vars.lastAttackTime = performance.now();
	this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
	this.vars.lastAttackDirection = direction;
	if(this.holder.vars.facingRight) {
		this.currentSprite = this.sprite.frames[0];
		this.vars.rotation = direction;
	} else {
		this.currentSprite = this.sprite.frames[1];
		this.vars.rotation = direction + Math.PI;
	}
	new Projectile(creatureProjectiles[projectile], this.holder, direction);
}

Projectile.prototype = Object.create(Entity.prototype);
Projectile.prototype.constructor = Projectile;

function Projectile(projectileTemplate, shooter, direction) {
	Entity.apply(this, arguments);
	this.vars = { 
		shooter: shooter, 
		drawOffset: { x: projectileTemplate.vars.drawOffset.x, y: projectileTemplate.vars.drawOffset.y }, 
		rotation: direction + projectileTemplate.vars.rotation,
		displayTime: projectileTemplate.vars.displayTime,
		damagePlayer: projectileTemplate.vars.damagePlayer,
		damageCreatures: projectileTemplate.vars.damageCreatures,
		startY: shooter.grid.y
	};
	this.damage = projectileTemplate.damage;
	this.currentSprite = projectileTemplate.currentSprite;
	this.sprite = {};
	Object.assign(this.sprite, projectileTemplate.sprite);
	this.position = { x: shooter.weapon.position.x, y: shooter.weapon.position.y };
	this.movement = {};
	Object.assign(this.movement, projectileTemplate.movement);
	this.movement.direction = direction;
	game.projectiles.push(this);
}

function updateProjectiles() {
	game.projectiles.forEach(function(projectile) {
		if(performance.now() > projectile.deleteTime) {
			game.projectiles.splice(game.projectiles.indexOf(projectile), 1);
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
				projectile.damage(projectile.stuckTo);
				projectile.stuckOffset = {};
				if(projectile.position.x > projectile.stuckTo.position.x) {
					projectile.stuckOffset.x = projectile.position.x - projectile.stuckTo.position.x - 2;
				} else {
					projectile.stuckOffset.x = projectile.position.x - projectile.stuckTo.position.x + 2;
				}
				if(projectile.position.y > projectile.stuckTo.position.y) {
					projectile.stuckOffset.y = projectile.position.y - projectile.stuckTo.position.y - 2;
				} else {
					projectile.stuckOffset.y = projectile.position.y - projectile.stuckTo.position.y + 2;
				}
				projectile.collidedWith.stuckProjectiles.push(projectile);
			} else if(!projectile.stuckTo && projectile.collidedWith && projectile.collidedWith === 1) {
				projectile.missed = true;
			}
			if(projectile.stuckTo) {
				projectile.movement.speed = 0;
				projectile.position.x = projectile.stuckTo.position.x + projectile.stuckOffset.x;
				projectile.position.y = projectile.stuckTo.position.y + projectile.stuckOffset.y;
			} else if(projectile.missed) {
				projectile.movement.speed = 0;
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
	this.vars.suspended = true;
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
	if(creatureTemplate.setAiType) {
		this.setAiType = creatureTemplate.setAiType;
		this.setAiType();
	}
	if(creatureTemplate.touchDamage) {
		this.touchDamage = creatureTemplate.touchDamage;
	}
	if(creatureTemplate.deathDrop) {
		this.deathDrop = creatureTemplate.deathDrop;
	} else {
		this.deathDrop = function() {
			var rand = Math.floor(Math.random() * session.vars.healthDropFrequency);
			if(rand < 1) {
				var exitKey = new Pickup(pickupTemplates[EnumPickup.EXIT_KEY], this.grid.x, this.grid.y);
				exitKey.position.x = this.position.x;
				exitKey.position.y = this.position.y + 2;
				exitKey.movement.speed = 1;
				exitKey.movement.direction = getPlayerDirection(this) + Math.PI;
			}
			// if(rand < 1) {
			// 	var heart = new Pickup(pickupTemplates[EnumPickup.HEALTH_HEART], this.grid.x, this.grid.y);
			// 	heart.position.x = this.position.x;
			// 	heart.position.y = this.position.y + 2;
			// 	heart.movement.speed = 1;
			// 	heart.movement.direction = getPlayerDirection(this) + Math.PI;
			// }
			console.log("Default death drop...");
		}
	}
	this.inflictDamage = creatureTemplate.inflictDamage;		//	Set damage response function from template
	this.deathResponse = creatureTemplate.deathResponse;		//	Set death response function from template
	game.colliders.push(this);										//	Add creature to colliders array
}
Creature.prototype.move = function(direction, speed) {
	var tryX = this.position.x + (speed * Math.cos(direction));
	var tryY = this.position.y + (speed * Math.sin(direction));
	var newCoords = checkCollision(this, tryX, tryY);
	this.position.x = newCoords.x;
	this.position.y = newCoords.y;
	this.grid = {
		x: Math.floor(this.position.x / TILE_SIZE),
		y: Math.floor(this.position.y / TILE_SIZE),
	}
	this.collidedWith = newCoords.collidedWith;
	if(this.updateBox) {
		this.updateBox();
	}
}
Creature.prototype.attack = function(direction) {
	if(this.weapon && performance.now() > this.vars.lastAttackTime + this.weapon.vars.attackRate * this.vars.attackRate) {
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
Creature.prototype.aim = function(direction) {
	if(this.weapon) {
		this.setFacing(direction);
		if(this.vars.facingRight) {
			this.weapon.currentSprite = this.sprite.frames[0];
			this.weapon.vars.rotation = direction;
		} else {
			this.weapon.currentSprite = this.sprite.frames[1];
			this.weapon.vars.rotation = direction + Math.PI;
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
		addScore(this.vars.score);
		this.vars.dead = true;
		if(this.weapon) {
			delete this.weapon;															//	Delete creature's weapon property
		}
		game.colliders.splice(game.colliders.indexOf(this), 1);									//	Remove from the colliders array.
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
		if(this.deathDrop) {
			this.deathDrop();
		}
		this.vars.deathTime = performance.now() + this.sprite.animations[this.vars.animation][0] - 100;		//	Set deathTime to be current time plus duration of death animation minus 100ms
	}
}
Creature.prototype.hasClearPathToPlayer = function() {
	var x1, x2, y1, y2;
	if(this.grid.x > player.grid.x) {
		x1 = player.grid.x;
		x2 = this.grid.x;
	} else {
		x1 = this.grid.x;
		x2 = player.grid.x;
	}
	if(this.grid.y > player.grid.y) {
		y1 = player.grid.y;
		y2 = this.grid.y;
	} else {
		y1 = this.grid.y;
		y2 = player.grid.y;
	}
	var diffX = x2 - x1;
	var diffY = y2 - y1;
	if(Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {				//	If grid squares are adjacent, return clear
		return true;
	} else if(diffX === 0) {
		for(var i = 0; i < diffY; i++) {
			if(level.terrainArray[y1+i][x1] !== 0) {
				console.log("Blocked vertically!");
				return false;
			}
		}
		console.log("Clear path vertically");
		return true;
	} else if(diffY === 0) {
		for(var i = 0; i < diffX; i++) {
			if(level.terrainArray[y1][x1+i] !== 0) {
				console.log("Blocked horizontally!");
				return false;
			}
		}
		console.log("Clear path horizontally");
		return true;
	} else {
		var diff = 0;
		if(diffX === diffY) {
			for(var i = 0; i < diffX; i++) {
				if(level.terrainArray[y1+i][x1+i] !== 0) {
					console.log("Blocked perfect diag!");
					return false;
				}
			}
			console.log("Clear path perfect diag");
			return true;
		} else if(diffX >= diffY) {
			var stepY = diffY / diffX;
			var incY = 0;
			for(var i = 0; i < diffX; i++) {
				if(diff > 0.5) {
					diff--;
					incY++;
				}
				if(level.terrainArray[y1+incY][x1+i] !== 0) {
					console.log("Blocked across diag!");
					return false;
				}
				diff += stepY;
			}
			console.log("Clear path across diag");
			return true;
		} else {
			var stepX = diffX / diffY;
			var incX = 0;
			console.log(stepX);
			for(var i = 0; i < diffY; i++) {
				console.log(i);
				console.log(diff);
				if(diff > 0.5) {
					diff--;
					incX++;
						}
				if(level.terrainArray[y1+i][x1+incX] !== 0) {
					console.log("Blocked down diag!");
					return false;
				}
				diff += stepX;
			}
			console.log("Clear path down diag");
			return true;
		}
	}
}
Creature.prototype.addHealth = function(health) {
	console.log("Adding health!");
	this.vars.currentHP += health;
}
Creature.prototype.checkIfCollides = function() {
	var collides = false;
	for(var i = 0; i < game.colliders.length; i++) {
		if(game.colliders[i] !== this && !game.colliders[i].vars.moveThroughColliders) {
			var top = this.box.topLeft.y;
			var btm = this.box.bottomRight.y;
			var left = this.box.topLeft.x;
			var right = this.box.bottomRight.x;

			var objTop = game.colliders[i].box.topLeft.y - 1;
			var objBtm = game.colliders[i].box.bottomRight.y + 1;
			var objL = game.colliders[i].box.topLeft.x - 1;
			var objR = game.colliders[i].box.bottomRight.x + 1;

			if(
			//	Check if obj overlaps any corner of the collider...
			(top <= objTop && btm >= objTop && left <= objL && right >= objL) ||
			(top <= objTop && btm >= objTop && left <= objR && right >= objR) ||
			(top <= objBtm && btm >= objBtm && left <= objL && right >= objL) ||
			(top <= objBtm && btm >= objBtm && left <= objR && right >= objR) ||
			//	...or if obj overlaps the top or bottom side of the collider...
			(top <= objTop && btm >= objTop && left >= objL && right <= objR) ||
			(top <= objBtm && btm >= objBtm && left >= objL && right <= objR) ||
			//	...or if obj overlaps the left or right side of the collider...
			(top >= objTop && btm <= objBtm && left <= objL && right >= objL) ||
			(top >= objTop && btm <= objBtm && left <= objR && right >= objR) ||
			//	...or falls fully inside the collider
			(top >= objTop && btm <= objBtm && left >= objL && right <= objR)
			) {
				collides = game.colliders[i];
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
		if(inViewport(obstacle.grid.x * TILE_SIZE, obstacle.grid.y * TILE_SIZE) && obstacle.interact) {
			if(getDistanceToPlayer(obstacle.position.x, obstacle.position.y) < session.vars.interactDistance) {
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
	game.attacks.push(this);
	this.contactPoints.forEach(function(contactPoint) {
		game.debugs.push(contactPoint);
	});
}

function drawAttack(attack) {
	switch(attack.type) {
		case(EnumAttack.SWIPE): {
			var origin_x = attack.attacker.position.x - game.viewport_offset_x;
			var origin_y = attack.attacker.position.y - game.viewport_offset_y;
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
	game.creatures.forEach(function(creature) {
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
	game.attacks.forEach(function(attack) {
		drawAttack(attack);
	});
}

//	Add any drawable non-BG objects to drawables array and sort by y position for drawing on canvas
function updateDrawables() {
	game.drawables.length = 0;
	game.drawOnTop.length = 0;
	game.drawables.push(player);
	game.creatures.forEach(function(creature) {
		if(inViewport(creature.position.x, creature.position.y)) {
			if(creature.vars.foreground) {
				game.drawOnTop.push(creature);
			} else {
				game.drawables.push(creature);
			}
		}
	});
	game.projectiles.forEach(function(projectile) {
		if(inViewport(projectile.position.x, projectile.position.y)) {
			if(projectile.vars.foreground) {
				game.drawOnTop.push(projectile);
			} else {
				game.drawables.push(projectile);
			}
		}
	});
	level.obstacles.forEach(function(obstacle) {
		if(inViewport(obstacle.position.x, obstacle.position.y) && obstacle.foreground) {
			game.drawables.push(obstacle);
		}
	});
	game.pickups.forEach(function(pickup) {
		if(pickup.movement.speed > 0) {

		}
	});
	game.drawables.sort(function(a, b) {
		return a.position.y-b.position.y;
	});
}

//	Update player movement
function updatePlayer() {
	//	Assign current player animation
	if(player.vars.dead) {
		if(performance.now() > game.playerDeathTime + 3000) {
			deathScreen();
		} else {
			if(player.vars.facingRight) {
				player.vars.animation = 8;
			} else {
				player.vars.animation = 9;
			}
		}
	} else {
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
			if(this.vars.restingWeaponAnimation && this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
				this.weapon.vars.drawOffset.y += 1;
			}
		}
	}
}

function updateCreatures() {
	game.creatures.forEach(function(creature) {
		if(performance.now() > creature.vars.deathTime) {							//	If creature's deathTime has passed...
			leaveCorpse(creature);
			game.creatures.splice(game.creatures.indexOf(creature), 1);				//	...and remove the creature from creatures array...
		}
		var offset = creature.getGridOffsetFromPlayer();
		if(offset.x > CANVAS_WIDTH / TILE_SIZE - 1 || offset.y > CANVAS_HEIGHT / TILE_SIZE - 1) {
			creature.vars.suspended = true;
			creature.movement.speed = 0;
		} else {
			creature.vars.suspended = false;
		}
		if(performance.now() > creature.ai.endTime) {								//	If creature's ai action has run its duration...
			setAiAction(creature);													//	...assign a new one.
		}
		creature.animate();															//	Animate creature
		creature.updateGear();
		if(creature.movement.speed > 0) {											//	If creature has a current movement speed...
			creature.move(creature.movement.direction, creature.movement.speed);	//	...move it accordingly
		}
	});
}

function addScore(score) {
	session.score += score;
	console.log(session.score);
	$('.scoreSpan').text('Score: ' + session.score);
}

function updateAttacks() {
	resolveAttacks();
	game.attacks.forEach(function(attack) {
		if(performance.now() > attack.created + attack.displayTime) {
			game.attacks.splice(game.attacks.indexOf(attack), 1);
		}
	});
}

function resolveAttacks() {
	game.attacks.forEach(function(attack) {																							//	For each attack...
		var hits = 0;																											//	Count successful hits
		attack.contactPoints.forEach(function(contactPoint) {																	//	...iterate contact points...
			if(attack.damagePlayer) {																					//	...and if attacker was not player...
				if(contactPoint.x >= player.box.topLeft.x - 1 && contactPoint.x <= player.box.bottomRight.x + 1 				//	...check if attack falls within player's box...
				&& contactPoint.y >= player.box.topLeft.y - 1 && contactPoint.y <= player.box.bottomRight.y + 1) {
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
			game.creatures.forEach(function(creature) {
				if(!creature.vars.dead && attack.damageCreatures) {
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
	var okY;

	if(obj.position.y === tryY) {																						//	If movement has no Y component...
		tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + (obj.sprite.size.y * 0.5));		//	...set tryTerY to current grid row...
		returnCoords.y = obj.position.y;																				//	...and set return Y coord to current position.
	} else {
		if(tryY > obj.position.y) {																						//	Else if obj is trying to move down...
			if(obj.box.type === EnumBoxtype.PROJECTILE) {																//	...and is a projectile...
				tryTerY = Math.floor(((tryY - obj.sprite.y_padding) / TILE_SIZE) + 8/16);								//	...set tryTerY.
				if(tryTerY === obj.vars.startY) {																		//	If tryTerY is on same grid row as start,
					okY = true;																							//	allow movement
				} else {
					tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE) - 8/16);									//	...else set tryTerY to be 1/2 row below...
				}
			} else {
				tryTerY = Math.floor(((tryY + TILE_SIZE* obj.sprite.size.y / 2) / TILE_SIZE));							//	...else set tryTerY...
			}
		} else {																										//	...or if trying to move up...
			tryTerY = Math.floor(((tryY - obj.sprite.y_padding) / TILE_SIZE) + 8/16);									//	...set tryTerY.
		}
		if(okY) {
			returnCoords.y = tryY;
		} else {
			if(level.terrainArray[tryTerY] === undefined ||																	//	Check whether terrain in tryY direction does not exist...
			tryTerY === 0 ||																								//	...or is on top row of terrain grid...
			(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) || 		//	...or is impassable on the right...
			(level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {			//	...or is impassable on the left.
				returnCoords.y = obj.position.y;																			//	If so, set y to return unchanged...
				returnCoords.collidedWith = 1;
				if(obj.movement.bounceOff) {																				//	...and if obj bounces off...
					obj.movement.direction = -obj.movement.direction;														//	...invert direction...
					if(obj.setFacing) {
						obj.setFacing(obj.movement.direction);
					}
				} else if(obj.ai !== undefined) {
					// obj.movement.speed = 0;
					obj.ai.endTime = performance.now();
				}
				tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);							//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}
	}
	if(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0 || 			//	If terrain does not exist or is impassable on the right...
	level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0) {				//	...or on the left...
		returnCoords.x = obj.position.x;																				//	...set x to return unchanged
		returnCoords.collidedWith = 1;
		if(obj.movement.bounceOff) {																					//	...and if obj bounces off...
			obj.movement.direction += Math.PI;																			//	...and invert direction.
			if(obj.setFacing) {
				obj.setFacing(obj.movement.direction);
			}
		}
	} else {
		returnCoords.x = tryX;																							//	Otherwise, success - return tryX coord
	}
	return returnCoords;																								//	Return final coordinates
}

//	Collider Collision Manager - check for contact with active box colliders
function checkColliderCollision(obj, tryX, tryY, collidedWith) {
	var returnCoords = { x: tryX, y: tryY, collidedWith: collidedWith };
	for(var i = 0; i < game.nearbyColliders.length; i++) {

		if(game.nearbyColliders[i] !== obj && !game.nearbyColliders[i].vars.moveThroughColliders && 
			!obj.vars.moveThroughColliders && game.nearbyColliders[i] !== obj.vars.shooter) {

			//	Projectile nearbyColliders can pass through obstacle nearbyColliders
			if(game.nearbyColliders[i].box.type === EnumBoxtype.OBSTACLE && obj.box.type === EnumBoxtype.PROJECTILE) {
				return returnCoords;
			}
			if(obj.box.type === EnumBoxtype.PROJECTILE) {
				var newTop = returnCoords.y - (obj.box.height / 2);
				var newBtm = returnCoords.y + (obj.box.height / 2);
				var newL = returnCoords.x - (obj.box.width / 2 );
				var newR = returnCoords.x + (obj.box.width / 2 );
			} else {
				var newTop = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) - obj.box.height;
				var newBtm = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2);
				var newL = returnCoords.x - (obj.box.width / 2 );
				var newR = returnCoords.x + (obj.box.width / 2 );
			}

			var objTop = game.nearbyColliders[i].box.topLeft.y;
			var objBtm = game.nearbyColliders[i].box.bottomRight.y;
			var objL = game.nearbyColliders[i].box.topLeft.x;
			var objR = game.nearbyColliders[i].box.bottomRight.x;

			if(
			//	Check if obj overlaps any corner of the collider...
			(newTop <= objTop && newBtm >= objTop && newL <= objL && newR >= objL) ||
			(newTop <= objTop && newBtm >= objTop && newL <= objR && newR >= objR) ||
			(newTop <= objBtm && newBtm >= objBtm && newL <= objL && newR >= objL) ||
			(newTop <= objBtm && newBtm >= objBtm && newL <= objR && newR >= objR) ||
			//	...or if obj overlaps the top or bottom side of the collider...
			(newTop <= objTop && newBtm >= objTop && newL >= objL && newR <= objR) ||
			(newTop <= objBtm && newBtm >= objBtm && newL >= objL && newR <= objR) ||
			//	...or if obj overlaps the left or right side of the collider...
			(newTop >= objTop && newBtm <= objBtm && newL <= objL && newR >= objL) ||
			(newTop >= objTop && newBtm <= objBtm && newL <= objR && newR >= objR) ||
			//	...or falls fully inside the collider
			(newTop >= objTop && newBtm <= objBtm && newL >= objL && newR <= objR)
			) {
				//	If player comes into contact with a collider dealing touch damage, execute its touchDamage function
				if(obj.vars.touchDamage && game.nearbyColliders[i] === player) {
					obj.vars.touchDamage = false;			//	Turn off touch damage to prevent multiple contact attacks
					player.vars.lastDamageTime = performance.now();
					player.inflictDamage(obj.touchDamage());
				}
				//	If player comes into contact with a pickup, execute its pickup function
				if(game.nearbyColliders[i].box.type === EnumBoxtype.PICKUP || obj.box.type === EnumBoxtype.PICKUP) {
					if(obj === player) {
						game.nearbyColliders[i].pickup();
					} else if(obj.box.type === EnumBoxtype.CREATURE || game.nearbyColliders[i].box.type === EnumBoxtype.CREATURE) {
						console.log("sdfasdf")
						return returnCoords;
					}
				} else {
					returnCoords.x = obj.position.x;
					returnCoords.y = obj.position.y;
					returnCoords.collidedWith = game.nearbyColliders[i];
					if(obj.movement.bounceOff) {
						obj.movement.direction = obj.movement.direction + Math.PI;
						if(obj.setFacing) {
							obj.setFacing(obj.movement.direction);
						}
					}
				}
			}
		}
	}
	return returnCoords;
}

function drawDrawables() {
	game.pickups.forEach(function(pickup) {
		drawOnCanvas(pickup, drawableCtx);
	});
	game.drawables.forEach(function(drawable) {
		if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
		drawOnCanvas(drawable, drawableCtx);
		if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
	});
	game.drawOnTop.forEach(function(drawable) {
		if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
		drawOnCanvas(drawable, drawableCtx);
		if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
	});
	game.projectiles.forEach(function(projectile) {
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

function updatePickups() {
	game.pickups.forEach(function(pickup) {
		if(pickup.movement.speed > 0) {
			// debugger;
			Creature.prototype.move.call(pickup, pickup.movement.direction, pickup.movement.speed);
			if(pickup.movement.deceleration) {
				pickup.movement.speed -= pickup.movement.deceleration;
			}
		}
		pickup.animate();
	});
}

function updateColliders() {
	game.nearbyColliders.length = 0;
	game.nearbyColliders.push(player);
	game.creatures.forEach(function(creature) {
		var offset = creature.getGridOffsetFromPlayer();
		if(offset.x >= CANVAS_WIDTH / TILE_SIZE + 1 || offset.y >= CANVAS_HEIGHT / TILE_SIZE + 1) {
			if(!creature.vars.suspended) {
				if(creature.checkIfCollides()) {
					console.log(creature);
					console.log("Collides with...");
					console.log(creature.checkIfCollides());
				}
				// creature.grid.x = Math.floor(creature.position.x / TILE_SIZE);
				// creature.grid.y = Math.floor(creature.position.y / TILE_SIZE);
				// creature.position.x = creature.grid.x * TILE_SIZE + (TILE_SIZE / 2);
				// creature.position.y = creature.grid.y * TILE_SIZE + (TILE_SIZE / 2);
			}
		} else {
			game.nearbyColliders.push(creature);
		}
	});
	level.obstacles.forEach(function(obstacle) {
		var offset = Creature.prototype.getGridOffsetFromPlayer.call(obstacle);
		if(offset.x <= CANVAS_WIDTH / TILE_SIZE + 3 || offset.y <= CANVAS_HEIGHT / TILE_SIZE + 3) {
			game.nearbyColliders.push(obstacle);
		}
	});
	game.pickups.forEach(function(pickup) {
		var offset = Creature.prototype.getGridOffsetFromPlayer.call(pickup);
		if(offset.x <= CANVAS_WIDTH / TILE_SIZE + 3 || offset.y <= CANVAS_HEIGHT / TILE_SIZE + 3) {
			game.nearbyColliders.push(pickup);
		}
	});
	// console.log(nearbyColliders);
}

function updateInterface() {
	if(game.displayedMessage && performance.now() > game.messageHideTime) {
		hideMessage();
	}
}

function displayMessage(duration, line1, line2, line3) {
	if(line3) {
		$('#messageSpan').html(line1 + '<br>' + line2 + '<br>' + line3);
	} else if(line2) {
		$('#messageSpan').html(line1 + '<br>' + line2);
	} else if(line1) {
		$('#messageSpan').html(line1);
	}
	$('#messageDiv').fadeIn('fast');
	game.displayedMessage = true;
	game.messageHideTime = performance.now() + duration;
}

function hideMessage() {
	$('#messageDiv').fadeOut('slow');
}

function drawDebugCanvas() {
	game.projectiles.forEach(function(projectile) {
		var debug = { x: projectile.position.x, y: projectile.position.y, color: 'orange'};
		game.debugs.push(debug);
	});
	game.colliders.forEach(function(collider) {
		var debug = { x: collider.box.topLeft.x, y: collider.box.topLeft.y, color: 'blue'};
		game.debugs.push(debug);
		var debug2 = { x: collider.box.bottomRight.x, y: collider.box.bottomRight.y, color: 'blue'};
		game.debugs.push(debug2);
	});
	game.attacks.forEach(function(attack) {
		attack.contactPoints.forEach(function(contactPoint) {
			var debug = { x: contactPoint.x, y: contactPoint.y, color: 'green'};
			game.debugs.push(debug);
		});
	});
	game.debugs.forEach(function(debug) {
		debugCtx.strokeStyle = debug.color;
		debugCtx.strokeRect(debug.x - game.viewport_offset_x, debug.y - game.viewport_offset_y, 1, 1);
	});
	game.debugs.length = 0;
}

function playerDeath() {
	console.log("The player has died!");
	game.creatures.forEach(function(creature) {
		creature.ai.nextAction = -1;
		creature.movement.speed = 0;
		if(creature.vars.facingRight) {
			creature.vars.animation = 0;
		} else {
			creature.vars.animation = 1;
		}
	});
	player.vars.dead = true;
	player.movement.speed = 0;
	delete player.weapon;
	session.loadingLevel = false;
	player.vars.animStart = performance.now();
	game.playerDeathTime = performance.now();
}

function deathScreen() {
	$('.finalScoreSpan').text(session.score);
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#deathScreen').fadeIn('slow');
		});
	});
}

//	Master game update function
function update(delta) {
	updateColliders();
	setViewportOffset();
	updatePlayer();
	updateCreatures();
	updateAttacks();
	updateObstacles();
	updatePickups();
	updateProjectiles();
	updateDrawables();
	updateInterface();
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
	$('#fps').text("FPS: " + MainLoop.getFPS().toFixed(4));
}

function startScreen() {
	$('canvas').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('canvas').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('canvas').attr('hidden', true);
	$('#gameMenuDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#gameMenuDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('#messageDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#messageDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
}

$('.startBtn').click(function() {
	if(!session.loadingLevel) {
		session.loadingLevel = true;
		start(true);
	}
});

function endLevel() {
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#completedLevelSpan').text(session.levelNumber + 1);
		$('#nextLevelSpan').text(session.levelNumber + 2);
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#endLevelScreen').fadeIn('slow');
			MainLoop.stop();
			session.loadingLevel = false;
			session.levelNumber++;
			$('.nextLevelBtn').click(function() {
				if(!session.loadingLevel) {
					session.loadingLevel = true;
					console.log("Loading level " + session.levelNumber);
					start();
				}
			});
		});
	});
}

function initializeGame() {
	console.log("Initializing game");
	game.redrawBackground = true;
	game.redrawObstaclesTo = performance.now() + 1000;
	game.viewport_offset_x = 0;
	game.viewport_offset_y = 0;
	game.creatures.length = 0;
	game.attacks.length = 0;
	game.projectiles.length = 0;
	game.pickups.length = 0;
	game.colliders.length = 0;
	game.nearbyColliders.length = 0;
	game.debugs.length = 0;
	game.drawables.length = 0;
	game.drawOnTop.length = 0;
}

function initializeLevel() {
	console.log("Initializing level");
	level = {
		height: 0,
		width: 0,
		terrainArray: [],
		creatureArray: [],
		obstacleArray: [],
		overlayArray: [],
		fillArray: [],
		obstacles: [],
		rooms: [],
		decor: [],
		corridors: [],
		playerStart: {
			x: 0,
			y: 0
		},
		bossStart: {
			x: 0,
			y: 0
		},
		exit: {
			x: 0,
			y: 0 
		},
		displayAsMap: false,
		validLevel: false
	}
}

//	Start routines
function start(newGame) {
	if(newGame) {
		startSound.play();
		session.levelNumber = 0;
		session.score = 0;
		$('.scoreSpan').text('');
		session.prng = new Random(Math.floor(Math.random() * 2147483647));
		// session.prng = new Random(617547);
	}
	console.log("Seed: " + session.seed);
	initializeLevel();
	level = levelGen.loadLevel(session.levelNumber);
	initializeGame();
	console.log(level);
	if(newGame) {
		setUpPlayer();
	} else {
		player.grid.x = level.playerStart.x;
		player.grid.y = level.playerStart.y;
		player.position.x = player.grid.x * TILE_SIZE + TILE_SIZE / 2;
		player.position.y = player.grid.y * TILE_SIZE + TILE_SIZE / 2;
	}
	setViewportOffset();
	addBackground();
	setUpLevel();
	drawOverlays();
	setUpCreatures();
	game.creatures.forEach(function(creature) {
		if(creature.weapon) {
			creature.weapon.reset();
		}
	});
	// bgMusic.play();
	$('#gameMenuDiv').fadeOut('slow', function() {
		$('.gameMenuScreen').hide();
		if(newGame) {
			$('.finalScoreSpan').text('');
			new Pickup(pickupTemplates[EnumPickup.HEALTH_HEART], player.grid.x + 1, player.grid.y + 1);
		}
		console.log("Starting game - level: " + level.levelNumber);
		MainLoop.setUpdate(update).setDraw(draw).start();
		drawMap();
		$('canvas').fadeIn('slow', function() {
			displayMessage(5000, "Gripping your trusty knife in sweaty palms,", "you enter the Baron's dungeon...")
		});
	});
}

//	Pause & restart game when browser tab loses & regains focus
window.onfocus = function() {
	session.focused = true;
	// bgMusic.play();
	MainLoop.start();
}
window.onblur = function() {
	session.focused = false;
	// bgMusic.pause();
	Key.clearPressed();
	MainLoop.stop();
}

function drawMap() {
	$('#mapDiv').remove();
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



//	Show game start screen on load
startScreen();
