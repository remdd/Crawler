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

	function drawOnCanvas(entity, ctx) {
		ctx.drawImage(entity.spriteSheet,
			entity.sprite.x * TILE_SIZE, 		//	x-coord to start clipping
			entity.sprite.y * TILE_SIZE, 		//	y-coord to start clipping
			entity.spriteSize.x * TILE_SIZE, 			//	width of clipped image
			entity.spriteSize.y * TILE_SIZE, 			//	height of clipped image
			entity.position.x,  				//	x-coord of canvas placement
			entity.position.y, 					//	y-coord of canvas placement
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
	}

	function Creature(name, spriteSheet, start_x, start_y, spriteSize_x, spriteSize_y, width, height ) {
		Entity.apply(this, arguments);
		this.isMoving = false;
		this.facingRight = true;
		this.ctx = creatureCtx;
		setupCreature(this);
	}
	Creature.prototype.move = function(direction, speed) {
		var tryX = Math.floor(this.position.x + 0.5 + (speed * Math.cos(direction)));
		var tryY = Math.floor(this.position.y + 0.5 + (speed * Math.sin(direction)));
		var newCoords = CollisionManager(this, tryX, tryY);
		this.position.x = newCoords.x;
		this.position.y = newCoords.y;
	}

	function setupCreature(obj) {
		if(obj.name === 'Player') {
			obj.speed = 1.2;
			obj.frames = [
				{ x: 0, y: 0 },		//	0	Resting 0 - facing R
				{ x: 1, y: 0 },		//	1	Resting 1 - facing R
				{ x: 2, y: 0 },		//	2	Walking 0 - facing R
				{ x: 3, y: 0 },		//	3	Walking 0 - facing R
				{ x: 4, y: 0 },		//	4	Walking 1 - facing R
				{ x: 0, y: 1 },		//	5	Resting 2 - facing L
				{ x: 1, y: 1 },		//	6	Resting 1 - facing L
				{ x: 2, y: 1 },		//	7	Walking 0 - facing L
				{ x: 3, y: 1 },		//	8	Walking 1 - facing L
				{ x: 4, y: 1 }		//	9	Walking 2 - facing L
			];
			obj.sprite = obj.frames[0];
		}
	}

	var entities = [];
	var player = new Creature('Player', playerSprite, 2, 5, 1, 1, 10, 14);
	player.ctx = playerCtx;
	player.weapon = {
		sprite: { x: 0, y: 3.5, width: 0.5, height: 0 }
	}

	//	Keyboard input helper object
	var Key = {
		_pressed: {},
		LEFT: 65,
		RIGHT: 68,
		UP: 87,
		DOWN: 83,
		isDown: function(keyCode) {
			return this._pressed[keyCode];
		},
		noneDown: function() {
			return $.isEmptyObject(this._pressed); 
		},
		onKeydown: function(event) {
			this._pressed[event.keyCode] = true;
		},
		onKeyup: function(event) {
			delete this._pressed[event.keyCode];
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

	//	Update player movement
	player.update = function() {
		var moving = this.moving;
		if(Key.isDown(Key.UP)) { this.move(Math.PI * 1.5, this.speed); this.moving = true; };
		if(Key.isDown(Key.DOWN)) { this.move(Math.PI * 0.5, this.speed); this.moving = true; }
		if(Key.isDown(Key.LEFT)) { this.move(Math.PI * 1, this.speed); this.moving = true; if(this.facingRight) { this.facingRight = false }}
		if(Key.isDown(Key.RIGHT)) { this.move(0, this.speed); this.moving = true; if(!this.facingRight) { this.facingRight = true }}
		if(Key.noneDown()) { this.moving = false; }
		if(moving != this.moving) { 
			this.animstart = performance.now();
		}
		animatePlayer(this);
	}


	function CollisionManager(obj, tryX, tryY) {
		console.log(tryX + " - " + tryY);
		var returnCoords = {};
		var hasY = false;
		if(tryX !== obj.position.x) {
			if(tryX > obj.position.x) {
				var tryTerX = Math.floor(((tryX + obj.width / 2) / TILE_SIZE) + 0.5);
			} else {
				var tryTerX = Math.floor(((tryX - obj.width / 2) / TILE_SIZE) + 0.5);
			}
		} else {
			var tryTerX = Math.floor((tryX / TILE_SIZE) + 0.5);
		}
		if(tryY !== obj.position.y) {
			hasY = true;
			if(tryY > obj.position.y) {
				var tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE) + 0.5);
			} else {
				var tryTerY = Math.floor(((tryY - Y_PADDING) / TILE_SIZE) + 1);
			}
		} else {
			var tryTerY = Math.floor(((tryY - Y_PADDING) / TILE_SIZE) + 1);
		}
		console.log(tryTerX + " :: " + tryTerY);
		if(level.terrainArray[tryTerY] === undefined || level.terrainArray[tryTerY][tryTerX] === undefined || level.terrainArray[tryTerY][tryTerX] !== 0) {
			returnCoords.x = obj.position.x;
			returnCoords.y = obj.position.y;
		} else {
			returnCoords.x = tryX;
			returnCoords.y = tryY;
		}



		// var targetTerrainX = Math.floor((tryX / TILE_SIZE) + 0.5);
		// var targetTerrainY = Math.floor((tryY / TILE_SIZE) + 0.5);
		// console.log(targetTerrainX + ' : ' + targetTerrainY);
		// if(level.terrainArray[targetTerrainY] === undefined || level.terrainArray[targetTerrainY][targetTerrainX] === undefined || level.terrainArray[targetTerrainY][targetTerrainX] !== 0) {
		// 	returnCoords.x = startX;
		// 	returnCoords.y = startY;
		// } else {
		// 	returnCoords.x = tryX;
		// 	returnCoords.y = tryY;
		// }
		console.log(returnCoords);
		return returnCoords;
	}





	animatePlayer = function(obj) {
		if(obj.moving) {
			if(obj.facingRight) {
				if(((Math.floor(performance.now() - obj.animstart) / 150) % 3) < 1) {
					obj.sprite = obj.frames[2];
				} else if(((Math.floor(performance.now() - obj.animstart) / 150) % 3) < 2) {
					obj.sprite = obj.frames[3];
				} else {
					obj.sprite = obj.frames[4];
				}
			} else {
				if(((Math.floor(performance.now() - obj.animstart) / 150) % 3) < 1) {
					obj.sprite = obj.frames[7];
				} else if(((Math.floor(performance.now() - obj.animstart) / 150) % 3) < 2) {
					obj.sprite = obj.frames[8];
				} else {
					obj.sprite = obj.frames[9];
				}
			}
		} else {
			if(obj.facingRight) {
				if(((Math.floor(performance.now() - obj.animstart) / 500) % 2) < 1.2) {
					obj.sprite = obj.frames[0];
				} else {
					obj.sprite = obj.frames[1];
				}
			} else {
				if(((Math.floor(performance.now() - obj.animstart) / 500) % 2) < 1.2) {
					obj.sprite = obj.frames[5];
				} else {
					obj.sprite = obj.frames[6];
				}
			}
		}
	}








	//	Master game update function
	function update(delta) {
		player.update();
	}

	//	Master game draw function
	function draw(interpolationPercentage) {
		playerCtx.clearRect(player.position.x - TILE_SIZE, player.position.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);	//	Clear player canvas for player location & surrounding 8 tiles
		if(player.moving) {

		}
		drawOnCanvas(player, playerCtx);
		entities.forEach(function(entity) {
			drawOnCanvas(entity, entityCtx);
		});
		$('#fps').text(MainLoop.getFPS());
		// console.log(player);
	}

	//	Start routines
	function start() {
		level = loadLevel(0);
		setupTerrain(level);
		setupOverlays(level);
		setupEntities();
		MainLoop.setUpdate(update).setDraw(draw).start();
	}
	start();

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