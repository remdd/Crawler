$(function() {
	var CANVAS_WIDTH = 320;								//	In native pixels - scale up **in CSS** to avoid antialiasing artefacts
	var CANVAS_HEIGHT = 224;
	var TILE_SIZE = 16;									//	Native tile size in spriteSheet
	var Y_PADDING = 2;									//	Number of pixels to extend collision buffers in front of walls

	var level;											//	Current level object, loaded from levels.js
	var player = {};									//	Player object
	var playerSprite = document.getElementById('playerSpriteImg');
	var playerWeapons = [];

	var creatures = [];
	var attacks = [];

	var collisionBoxes = [];							//	Store any active collision boxes - player, creatures, obstacles etc

	var debugs = [];									//	Store any objects to be passed to debug canvas

	var monsterSprites = document.getElementById('monsterSprites');

	var focused = true;									//	Track whether browser tab is focused by user

	var bgCanvas = $('<canvas id="bgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var bgCtx = bgCanvas.get(0).getContext('2d');
	bgCanvas.appendTo('body');

	var entityCanvas = $('<canvas id="entityCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var entityCtx = entityCanvas.get(0).getContext('2d');
	entityCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	entityCanvas.appendTo('body');

	var creatureCanvas = $('<canvas id="creatureCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var creatureCtx = creatureCanvas.get(0).getContext('2d');
	creatureCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	creatureCanvas.appendTo('body');

	var playerCanvas = $('<canvas id="playerCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var playerCtx = playerCanvas.get(0).getContext('2d');
	playerCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	playerCanvas.appendTo('body');

	var attackCanvas = $('<canvas id="attackCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var attackCtx = attackCanvas.get(0).getContext('2d');
	attackCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	attackCanvas.appendTo('body');

	var debugCanvas = $('<canvas id="debugCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var debugCtx = debugCanvas.get(0).getContext('2d');
	debugCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	debugCanvas.appendTo('body');

	var StateEnum = { RESTING_R: 0, RESTING_L: 1, MOVING_R: 2, MOVING_L: 3 }
	var AttackEnum = { SWIPE: 0 }


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

	function setupPlayerWeapons() {
		playerWeapons = [
			{
				name: 'Knife',
				spriteSheet: playerSprite,
				spriteSize: {
					x: 0.5,
					y: 1
				},
				position: {
					x: player.position.x,
					y: player.position.y
				},
				frames: [
					{ x: 0, y: 4 },							//	Right facing
					{ x: 0.5, y: 4 }						//	Left facing
				],
				sprite: { x: 0, y: 4 },						//	Starting sprite
				reach: TILE_SIZE * 0.8,						//	Reach of attack from centre of player object position
				animTime: 150,								//	Length of time the weapon stays animated after attack
				restingDrawOffset: {
					x: TILE_SIZE * - 0.25,
					y: 0
				},
				rotationDrawOffset: {
					x: TILE_SIZE * 0.3,
					y: TILE_SIZE * 0.3
				},
				attack: {
					type: AttackEnum.SWIPE,
					displayTime: 50,
					swipeColor1: 'rgba(255,255,255,0)',
					swipeColor2: 'rgb(70,0,160)',
					lifespan: 1
				},
				maxHits: 1,									//	Number of contact points per swipe that can successfully resolve as hits
				lastAttackDirection: 0,						//	Store direction of last attack
				attackVariants: 2,							//	Number of attack variants weapon has
				lastAttackVariant: 0						//	Hold variant of last attack
			}
		];
	}


	//	Set up player
	function setUpPlayer() {
		var playerType = 0;															//	Set playerType template
		player = new Creature(playerTemplates[playerType]);							//	Construct player from playerType
		player.ctx = playerCtx;														//	Assign player to player canvas
		setupPlayerWeapons();														//	Placeholder - need to revisit as part of item system
		player.weapon = playerWeapons[0];											//	Assign starting weapon
		player.lastAttackTime = 0;													//	Initialize to zero
		player.attackRate = playerTemplates[playerType].attackRate;					//	Time between attacks
	}

	function setUpCreatures() {
		creature = new Creature(creatureTemplates[EnumCreatures.GOBLIN]);
		console.log(creature);
		creatures.push(creature);
	}

	function drawOnCanvas(entity, ctx) {
		if(entity.hasOwnProperty('rotation')) {
			ctx.save();
			ctx.translate(entity.position.x, entity.position.y);
			entity.position.x = 0; entity.position.y = 0;
			ctx.rotate(entity.rotation);
		}
		ctx.drawImage(entity.spriteSheet,
			entity.sprite.x * TILE_SIZE, 		//	x-coord to start clipping
			entity.sprite.y * TILE_SIZE, 		//	y-coord to start clipping
			entity.spriteSize.x * TILE_SIZE, 			//	width of clipped image
			entity.spriteSize.y * TILE_SIZE, 			//	height of clipped image
			entity.position.x - TILE_SIZE * entity.spriteSize.x / 2,  				//	x-coord of canvas placement
			entity.position.y - TILE_SIZE * entity.spriteSize.y / 2, 					//	y-coord of canvas placement
			entity.spriteSize.x * TILE_SIZE, 			//	width of image on canvas
			entity.spriteSize.y * TILE_SIZE			//	height of image on canvas
		);
		if(entity.hasOwnProperty('rotation')) {
			ctx.restore();
		}
	}

	function Entity(entityTemplate) {
		this.name = entityTemplate.name;
		this.spriteSheet = entityTemplate.spriteSheet;
		this.ctx = entityCtx;
		this.position = {
			x: entityTemplate.start_x * TILE_SIZE + TILE_SIZE / 2,
			y: entityTemplate.start_y * TILE_SIZE + TILE_SIZE / 2
		}
		this.spriteSize = {
			x: entityTemplate.spriteSize_x,
			y: entityTemplate.spriteSize_y
		}
		this.width = entityTemplate.width;				//	of collision box - in px
		this.height = entityTemplate.height;			//	of collision box - in px
		this.box = {
			topLeft: {
				x: ((entityTemplate.start_x + (entityTemplate.spriteSize_x / 2)) * TILE_SIZE) - entityTemplate.width / 2, 
				y: ((entityTemplate.start_y + entityTemplate.spriteSize_y) * TILE_SIZE) - entityTemplate.height
			},
			bottomRight: {
				x: ((entityTemplate.start_x + (entityTemplate.spriteSize_x / 2)) * TILE_SIZE) + entityTemplate.width / 2, 
				y: (entityTemplate.start_y + entityTemplate.spriteSize_y) * TILE_SIZE
			}
		}
		this.animstart = performance.now();
	}
	Entity.prototype.animate = function() {
		var pointInAnimLoop = Math.floor((performance.now() - this.animstart) % this.animations[this.state][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
		//	Need to generalize this - only works for animations with 5 or less frames
		if(pointInAnimLoop <= this.animations[this.state][1][0]) {
			this.sprite = this.frames[this.animations[this.state][2][0]];
		} else if(pointInAnimLoop <= this.animations[this.state][1][1]) {
			this.sprite = this.frames[this.animations[this.state][2][1]];
		} else if(pointInAnimLoop <= this.animations[this.state][1][2]) {
			this.sprite = this.frames[this.animations[this.state][2][2]];
		} else if(pointInAnimLoop <= this.animations[this.state][1][3]) {
			this.sprite = this.frames[this.animations[this.state][2][3]];
		} else if(pointInAnimLoop <= this.animations[this.state][1][4]) {
			this.sprite = this.frames[this.animations[this.state][2][4]];
		}
	}

	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;

	function Creature(creatureTemplate) {
		Entity.apply(this, arguments);
		this.frames = creatureTemplate.frames;
		this.sprite = creatureTemplate.sprite;
		this.animations = creatureTemplate.animations;
		this.hp = creatureTemplate.hp;
		this.speed = creatureTemplate.speed;
		this.facingRight = true;
		this.ctx = creatureCtx;
		this.animstart = 0;
		this.animations = creatureTemplate.animations;
		this.state = StateEnum.RESTING_R;
		this.ai = creatureTemplate.ai;
		this.movement = creatureTemplate.movement;
		collisionBoxes.push(this.box);
		console.log(this);
	}
	Creature.prototype.move = function(direction, speed) {
		var tryX = this.position.x + (speed * Math.cos(direction));
		var tryY = this.position.y + (speed * Math.sin(direction));
		var newCoords = CollisionManager(this, tryX, tryY);
		this.position.x = newCoords.x;
		this.position.y = newCoords.y;
		this.updateBox();
	}
	Creature.prototype.attack = function(direction) {
		if(performance.now() - this.lastAttackTime > this.attackRate) {
			if((direction < Math.PI * 2 && direction > Math.PI * 1.5) || (direction >= 0 && direction < Math.PI * 0.5) && !this.facingRight) {
				this.facingRight = true;
			} else if((direction < Math.PI * 1.5 && direction > Math.PI / 2 ) && this.facingRight) {
				this.facingRight = false;
			} 
		new Attack(this, direction);
			this.lastAttackTime = performance.now();
		}
	}
	Creature.prototype.updateBox = function() {
		this.box.topLeft.x = this.position.x - this.width / 2;
		this.box.topLeft.y = this.position.y + (this.spriteSize.y * TILE_SIZE / 2) - this.height;
		this.box.bottomRight.x = this.position.x + this.width / 2;
		this.box.bottomRight.y = this.position.y + (this.spriteSize.y * TILE_SIZE / 2);
		// debugs.push(this.box.topLeft, this.box.bottomRight);
	}

	function Attack(origin, direction) {
		this.sprite = origin.weapon.sprite;
		this.origin = {
			x: origin.position.x,
			y: origin.position.y
		}
		this.reach = origin.weapon.reach;				//	Radius of attack swipe from centre of creature
		this.arc = Math.PI / 2;							//	Placeholder
		this.direction = direction;
		origin.weapon.lastAttackDirection = direction;
		this.created = performance.now();
		this.lifespan = origin.weapon.lifespan;
		this.maxHits = origin.weapon.maxHits;
		this.displayTime = origin.weapon.attack.displayTime;				//	Placeholder
		this.swipeColor1 = origin.weapon.attack.swipeColor1;
		this.swipeColor2 = origin.weapon.attack.swipeColor2;
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
		origin.weapon.lastAttackVariant = Math.floor(Math.random() * origin.weapon.attackVariants);
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
		var grd = attackCtx.createRadialGradient(attack.origin.x, attack.origin.y, 2 * attack.reach / 3, attack.origin.x, attack.origin.y, attack.reach);
		grd.addColorStop(0, attack.swipeColor1);
		grd.addColorStop(1, attack.swipeColor2);
		attackCtx.fillStyle = grd;
		attackCtx.fill();
	}


	//	Update player movement
	function updatePlayer() {
		var moving = player.moving;
		if(Key.isDown(Key.MOVE_UP)) { player.move(Math.PI * 1.5, player.speed); player.moving = true; };
		if(Key.isDown(Key.MOVE_DOWN)) { player.move(Math.PI * 0.5, player.speed); player.moving = true; }
		if(Key.isDown(Key.MOVE_LEFT)) { player.move(Math.PI * 1, player.speed); player.moving = true; if(player.facingRight) { player.facingRight = false }}
		if(Key.isDown(Key.MOVE_RIGHT)) { player.move(0, player.speed); player.moving = true; if(!player.facingRight) { player.facingRight = true }}

		if(Key.isDown(Key.ATTACK_UP)) { player.attack(Math.PI * 1.5); }
		if(Key.isDown(Key.ATTACK_DOWN)) { player.attack(Math.PI / 2); }
		if(Key.isDown(Key.ATTACK_LEFT)) { player.attack(Math.PI); }
		if(Key.isDown(Key.ATTACK_RIGHT)) { player.attack(0); }

		if(Key.noneDown()) { player.moving = false; }
		if(moving != player.moving) { 
			player.animstart = performance.now();
		}
		//	Assign player.state (used to load appropriate animation)
		if(!player.moving && player.facingRight) { player.state = StateEnum.RESTING_R; }
		else if(!player.moving && !player.facingRight) { player.state = StateEnum.RESTING_L; }
		else if(player.moving && player.facingRight) { player.state = StateEnum.MOVING_R; }
		else if(player.moving && !player.facingRight) { player.state = StateEnum.MOVING_L; }
		player.animate();
		updateWeapon(player);
	}


	updateWeapon = function(creature) {
		creature.weapon.position.x = creature.position.x;
		creature.weapon.position.y = creature.position.y;
		if(performance.now() - creature.lastAttackTime < creature.weapon.animTime) {												//	If within animtime of last attack...
			if(creature.weapon.lastAttackDirection > Math.PI * 1.75 || creature.weapon.lastAttackDirection <= Math.PI * 0.25) {		//	...and attack was to the right...
				creature.weapon.position.x += creature.weapon.rotationDrawOffset.x;													//	...offset x position and
				if(creature.weapon.lastAttackVariant < 1) {
					creature.weapon.rotation = Math.PI * 0.25;																		//	...rotate weapon to point down and right, or...
					creature.weapon.position.y -= creature.weapon.rotationDrawOffset.y;
				} else {
					creature.weapon.rotation = Math.PI * 0.75;																		//	...rotate weapon to point down and right
					creature.weapon.position.y += creature.weapon.rotationDrawOffset.y;
				}
			} else if(creature.weapon.lastAttackDirection > Math.PI * 0.25 && creature.weapon.lastAttackDirection <= Math.PI * 0.75) {	//	...or if attack was down...
				creature.weapon.rotation = Math.PI * 0.75;																	//	...rotate weapon to point down and right...
				creature.weapon.position.x += creature.weapon.rotationDrawOffset.x;											//	...and offset position
				creature.weapon.position.y += creature.weapon.rotationDrawOffset.y;
			} else if(creature.weapon.lastAttackDirection > Math.PI * 0.75 && creature.weapon.lastAttackDirection <= Math.PI * 1.25) {	//	...or if attack was left...
				creature.weapon.rotation = Math.PI * 1.25;																	//	...rotate weapon to point down and left...
				creature.weapon.position.x -= creature.weapon.rotationDrawOffset.x;											//	...and offset position
				creature.weapon.position.y += creature.weapon.rotationDrawOffset.y;
			} else if(creature.weapon.lastAttackDirection > Math.PI * 1.25 && creature.weapon.lastAttackDirection <= Math.PI * 1.75) {	//	...or if attack was up...
				creature.weapon.rotation = Math.PI * 0.25;																	//	...rotate weapon to point up and left...
				creature.weapon.position.x += creature.weapon.rotationDrawOffset.x;											//	...and offset position
				creature.weapon.position.y -= creature.weapon.rotationDrawOffset.y;
			}
		} else {																											//	Else if has not attacked recently...
			delete creature.weapon.rotation;																				//	...remove any weapon rotation...
			if(creature.facingRight) {
				creature.weapon.sprite = creature.weapon.frames[0];
				creature.weapon.position.x += creature.weapon.restingDrawOffset.x;
				creature.weapon.position.y += creature.weapon.restingDrawOffset.y;
			} else {
				creature.weapon.sprite = creature.weapon.frames[1];
				creature.weapon.position.x -= creature.weapon.restingDrawOffset.x;
				creature.weapon.position.y += creature.weapon.restingDrawOffset.y;
			}
		}
	}

	function updateCreatures() {
		creatures.forEach(function(creature) {
			if(creature.hp <= 0) {
				creatures.splice(creatures.indexOf(creature), 1);											//	If creature has no more hp, remove it...
				collisionBoxes.splice(collisionBoxes.indexOf(creature.box), 1);								//	...and remove its collision box from collisionBoxes array
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
		target.hp -= 1;
	}

	//	Collision Manager object - check for contact with impassable terrain
	function CollisionManager(obj, tryX, tryY) {
		// console.log("Trying x: " + tryX + ", y: " + tryY);
		var returnCoords = {};

		var tryTerRX = Math.floor(((tryX + (obj.width / 2)) / TILE_SIZE));
		var tryTerLX = Math.floor(((tryX - (obj.width / 2) - 1) / TILE_SIZE));
		var tryTerY;

		if(obj.position.y === tryY) {																						//	If movement has no Y component...
			tryTerY = Math.floor(((obj.position.y - Y_PADDING) / TILE_SIZE) + 0.5);											//	...set tryTerY to current grid row...
			returnCoords.y = obj.position.y;																				//	...and set return Y coord to current position.
		} else {
			if(tryY > obj.position.y) {																						//	Else if obj is trying to move down...
				tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE));													//	...set tryTerY...
			} else {																										//	...or if trying to move up...
				tryTerY = Math.floor(((tryY - Y_PADDING) / TILE_SIZE) + 0.5);												//	...set tryTerY.
			}
			if(level.terrainArray[tryTerY] === undefined ||																	//	Check whether terrain in tryY direction does not exist...
			(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) || 		//	...or is impassable on the right...
			(level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {			//	...or is impassable on the left.
				returnCoords.y = obj.position.y;																			//	If so, set y to return unchanged...
				tryTerY = Math.floor(((obj.position.y - Y_PADDING) / TILE_SIZE) + 0.5);												//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}

		if(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0 || 			//	If terrain does not exist or is impassable on the right...
		level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0) {				//	...or on the left...
			returnCoords.x = obj.position.x;																				//	...set x to return unchanged
		} else {
			returnCoords.x = tryX;																							//	Otherwise, success - return tryX coord
		}

		for(var i = 0; i < collisionBoxes.length; i++) {
			if(collisionBoxes[i] === obj.box) {
				// continue;
			} else {
				// console.log("Return coords: " + returnCoords.x + ", " + returnCoords.y);
				// console.log("Collision box: " + collisionBoxes[i].topLeft.x + ", " + collisionBoxes[i].topLeft.y + " - " + collisionBoxes[i].bottomRight.x + ", " + collisionBoxes[i].bottomRight.y);
				var newTop = returnCoords.y + (obj.spriteSize.y * TILE_SIZE / 2) - obj.height;
				var newBtm = returnCoords.y + (obj.spriteSize.y * TILE_SIZE / 2);
				var newL = returnCoords.x - (obj.width / 2 );
				var newR = returnCoords.x + (obj.width / 2 );

				if(
					(newTop <= collisionBoxes[i].topLeft.y && newBtm >= collisionBoxes[i].topLeft.y && newL <= collisionBoxes[i].topLeft.x && newR >= collisionBoxes[i].topLeft.x) ||
					(newTop <= collisionBoxes[i].bottomRight.y && newBtm >= collisionBoxes[i].bottomRight.y && newL <= collisionBoxes[i].topLeft.x && newR >= collisionBoxes[i].topLeft.x) ||
					(newTop <= collisionBoxes[i].topLeft.y && newBtm >= collisionBoxes[i].topLeft.y && newL <= collisionBoxes[i].bottomRight.x && newR >= collisionBoxes[i].bottomRight.x) ||
					(newTop <= collisionBoxes[i].bottomRight.y && newBtm >= collisionBoxes[i].bottomRight.y  && newL <= collisionBoxes[i].bottomRight.x && newR >= collisionBoxes[i].bottomRight.x)
				) {
					console.log("Collision!");
					returnCoords.x = obj.position.x;
					returnCoords.y = obj.position.y;
				}
			}
		}

		return returnCoords;																								//	Return final coordinates
	}

	function drawDebugCanvas() {
		if(performance.now() % 5000 < 50) {				//	Clear all debugs every 5 seconds
			debugs = [];
		}
		debugs.forEach(function(debug) {
			debugCtx.strokeStyle = 'red';
			debugCtx.strokeRect(debug.x, debug.y, 1, 1);
		});
		collisionBoxes.forEach(function(box) {
			debugCtx.strokeStyle = 'green';
			debugCtx.strokeRect(box.topLeft.x, box.topLeft.y, 1, 1);
			debugCtx.strokeRect(box.bottomRight.x, box.bottomRight.y, 1, 1);
		});
	}


	//	Master game update function
	function update(delta) {
		updatePlayer();
		updateCreatures();
		updateAttacks();
		// console.log(collisionBoxes);
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		playerCtx.clearRect(player.position.x - TILE_SIZE, player.position.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);	//	Clear player canvas for player location & surrounding 8 tiles
		attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);				//	Clear entire attack canvas
		creatureCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);			//	Clear entire creature canvas
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		drawOnCanvas(player, playerCtx);									//	Draw player on player canvas
		drawOnCanvas(player.weapon, playerCtx);								//	Draw player weapon on player canvas
		creatures.forEach(function(creature) {
			drawOnCanvas(creature, creatureCtx);
		});
		attacks.forEach(function(attack) {
			drawAttackSwipe(attack);
		});
		drawDebugCanvas();
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