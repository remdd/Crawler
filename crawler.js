$(function() {
	var CANVAS_WIDTH = 320;								//	In native pixels - scale up **in CSS** to avoid antialiasing artefacts
	var CANVAS_HEIGHT = 224;
	var CAMERA_WIDTH = 640;								//	Width of camera FOV window
	var CAMERA_HEIGHT = 320;							//	Height of camera FOV window
	var TILE_SIZE = 16;									//	Native tile size in spriteSheet
	var Y_PADDING = 2;									//	Number of pixels to extend collision buffers in front of walls

	var level;											//	Current level object, loaded from levels.js
	var player = {};									//	Player object
	var playerSprite = document.getElementById('playerSpriteImg');
	var playerWeapons = [];
	var attacks = [];
	var entities = [];

	var focused = true;									//	Track whether browser tab is focused by user

	var playerCanvas = $('<canvas id="playerCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var playerCtx = playerCanvas.get(0).getContext('2d');
	playerCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	playerCanvas.appendTo('body');

	var creatureCanvas = $('<canvas id="creatureCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var creatureCtx = creatureCanvas.get(0).getContext('2d');
	creatureCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	creatureCanvas.appendTo('body');

	var entityCanvas = $('<canvas id="entityCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var entityCtx = entityCanvas.get(0).getContext('2d');
	entityCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
	entityCanvas.appendTo('body');

	var bgCanvas = $('<canvas id="bgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
	var bgCtx = bgCanvas.get(0).getContext('2d');
	bgCanvas.appendTo('body');

	var StateEnum = {
		RESTING_R: 0,
		RESTING_L: 1,
		MOVING_R: 2,
		MOVING_L: 3
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
				reach: TILE_SIZE * 3 / 4,
				attackDisplayTime: 100,
				attackSwipeColor1: 'rgba(255,255,255,0)',
				attackSwipeColor2: 'rgb(70,0,160)'
			}
		];
	}

	//	Set up player
	function setUpPlayer() {
		player = new Creature('Player', playerSprite, 2, 5, 1, 1, 10, 14);
		player.ctx = playerCtx;
		player.speed = 1.2;
		player.state = StateEnum.RESTING_R;
		player.frames = [
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
		];
		player.sprite = player.frames[0];						//	Holds current sprite for rendering
		player.animations = [									//	Format: Loop time in ms, end time of each frame in ms, frame numbers
			[ 1000, [600, 1000], [0, 1] ],						//	Resting, facing R
			[ 1000, [600, 1000], [6, 7] ],						//	Resting, facing L
			[ 400, [100, 200, 300, 400], [5, 4, 3, 2 ] ],		//	Walking, facing R
			[ 400, [100, 200, 300, 400], [8, 9, 10,11] ]		//	Walking, facing L
		];
		setupPlayerWeapons();
		player.weapon = playerWeapons[0];						//	Assign starting weapon
		player.lastAttackTime = 0;
		player.attackRate = 500;								//	Time between attacks
	}

	function drawOnCanvas(entity, ctx) {
		ctx.drawImage(entity.spriteSheet,
			entity.sprite.x * TILE_SIZE, 		//	x-coord to start clipping
			entity.sprite.y * TILE_SIZE, 		//	y-coord to start clipping
			entity.spriteSize.x * TILE_SIZE, 			//	width of clipped image
			entity.spriteSize.y * TILE_SIZE, 			//	height of clipped image
			entity.position.x - TILE_SIZE / 2,  				//	x-coord of canvas placement
			entity.position.y - TILE_SIZE / 2, 					//	y-coord of canvas placement
			entity.spriteSize.x * TILE_SIZE, 			//	width of image on canvas
			entity.spriteSize.y * TILE_SIZE			//	height of image on canvas
		);
	}

	function setupEntities() {
		entities.forEach(function(entity) {
			drawOnCanvas(entity, entityCtx);
		});
	}

	function Entity(name, spriteSheet, start_x, start_y, spriteSize_x, spriteSize_y, width, height ) {
		this.name = name;
		this.spriteSheet = spriteSheet;
		this.ctx = entityCtx;
		this.position = {
			x: start_x * TILE_SIZE + TILE_SIZE / 2,
			y: start_y * TILE_SIZE + TILE_SIZE / 2
		}
		this.spriteSize = {
			x: spriteSize_x,
			y: spriteSize_y
		}
		this.width = width;				//	of collision box - in px
		this.height = height;			//	of collision box - in px
		this.animstart = performance.now();
	}
	Entity.prototype.animate = function() {
		var pointInAnimLoop = Math.floor((performance.now() - this.animstart) % this.animations[this.state][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
		// console.log(pointInAnimLoop);
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
		// console.log(this.sprite);
	}

	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;

	function Creature(name, spriteSheet, start_x, start_y, spriteSize_x, spriteSize_y, width, height ) {
		Entity.apply(this, arguments);
		this.isMoving = false;
		this.facingRight = true;
		this.ctx = creatureCtx;
		this.animstart = performance.now();
		this.animations = [];
		this.state = StateEnum.RESTING_R;
		setupCreature(this);
	}

	Creature.prototype.move = function(direction, speed) {
		var tryX = Math.floor(this.position.x + 0.5 + (speed * Math.cos(direction)));
		var tryY = Math.floor(this.position.y + 0.5 + (speed * Math.sin(direction)));
		var newCoords = CollisionManager(this, tryX, tryY);
		this.position.x = newCoords.x;
		this.position.y = newCoords.y;
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

	function setupCreature(obj) {
		if(obj.name === 'Player') {
			obj.speed = 1.2;
		}
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
		this.created = performance.now();
		this.lifespan = origin.weapon.attackDisplayTime;				//	Placeholder
		this.attackSwipeColor1 = origin.weapon.attackSwipeColor1;
		this.attackSwipeColor2 = origin.weapon.attackSwipeColor2;
		attacks.push(this);
	}

	function drawAttackSwipe(attack) {
		entityCtx.moveTo(attack.origin.x, attack.origin.y);
		entityCtx.beginPath();
		entityCtx.arc(attack.origin.x, attack.origin.y, attack.reach, attack.direction - attack.arc / 2, attack.direction + attack.arc / 2);
		entityCtx.lineTo(attack.origin.x, attack.origin.y);
		entityCtx.closePath();
		var grd = entityCtx.createRadialGradient(attack.origin.x, attack.origin.y, 2 * attack.reach / 3, attack.origin.x, attack.origin.y, attack.reach);
		grd.addColorStop(0, attack.attackSwipeColor1);
		grd.addColorStop(1, attack.attackSwipeColor2);
		entityCtx.fillStyle = grd;
		entityCtx.fill();
	}


	//	Update player movement
	function updatePlayer(player) {
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
		Object.assign(player.weapon.position, player.position);			//	Assign weapon position to player position
		player.animate();
		animatePlayerWeapon(player);
	}

	animatePlayerWeapon = function(player) {
		if(performance.now() - player.lastAttackTime < player.weapon.attackDisplayTime) {
			player.weapon.sprite = '';
		} else {
			if(player.facingRight) {
				player.weapon.sprite = player.weapon.frames[0];
			} else {
				player.weapon.sprite = player.weapon.frames[1];
				player.weapon.position.x += TILE_SIZE / 2;
			}
		}
	}

	function updateAttacks() {
		attacks.forEach(function(attack) {
			if(performance.now() > attack.created + attack.lifespan) {
				attacks.splice(attacks.indexOf(attack), 1);
			}
		});
	}



	//	Collision Manager object - check for contact with impassable terrain
	function CollisionManager(obj, tryX, tryY) {
		// console.log("Trying x: " + tryX + ", y: " + tryY);
		var returnCoords = {};
		var tryTerRX = Math.floor(((tryX + (obj.width / 2)) / TILE_SIZE));
		var tryTerLX = Math.floor(((tryX - (obj.width / 2) - 1) / TILE_SIZE));
		// console.log("tryTerRX: " + tryTerRX + ", tryTerLX: " + tryTerLX);
		if(tryY !== obj.position.y) {
			if(tryY > obj.position.y) {
				var tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE));
			} else {
				var tryTerY = Math.floor(((tryY - Y_PADDING) / TILE_SIZE) + 0.5);
			}
		} else {
			var tryTerY = Math.floor(((tryY - Y_PADDING) / TILE_SIZE) + 0.5);
		}
		// console.log(tryTerX + " :: " + tryTerY);
		if((level.terrainArray[tryTerY] === undefined || level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) ||
			(level.terrainArray[tryTerY] === undefined || level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {
			returnCoords.x = obj.position.x;
			returnCoords.y = obj.position.y;
		} else {
			returnCoords.x = tryX;
			returnCoords.y = tryY;
		}
		// console.log(returnCoords);
		return returnCoords;
	}

	//	Master game update function
	function update(delta) {
		updatePlayer(player);
		updateAttacks();
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		playerCtx.clearRect(player.position.x - TILE_SIZE, player.position.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);	//	Clear player canvas for player location & surrounding 8 tiles
		entityCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);				//	Clear entire entity canvas
		drawOnCanvas(player, playerCtx);									//	Draw player on player canvas
		drawOnCanvas(player.weapon, playerCtx);								//	Draw player weapon on player canvas
		entities.forEach(function(entity) {
			drawOnCanvas(entity, entityCtx);
		});
		attacks.forEach(function(attack) {
			drawAttackSwipe(attack);
		});
		$('#fps').text(MainLoop.getFPS());
	}

	//	Start routines
	function start() {
		level = loadLevel(0);
		setupTerrain(level);
		setupOverlays(level);
		setupEntities();
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