Obstacle = function(type, room, y, x, modifier, noOffset) {
	if(type === undefined) {
		debugger;
	}
	this.type = type;
	this.sprite = {
		spriteSheet: level.obstacleImg,
	};
	//	Initial type switch to determine size needed for placement - only needed if sprite is bigger than 1x1
	switch(type) {
		case EnumObstacle.DOOR:
		{
			this.sprite.size = {y: 2, x: 1}
			break;
		}
		case EnumObstacle.SKULL_SPIKE:
		case EnumObstacle.FLAG_SPIKE:
		{
			this.sprite.size = {y: 1, x: 0.5}
			break;
		}

		case EnumObstacle.COFFIN: 
		case EnumObstacle.SACKx2:
		case EnumObstacle.NARROW_SHELVES:
		case EnumObstacle.MONOLITH:
		case EnumObstacle.WARRIOR_STATUE:
		case EnumObstacle.STONE_PILLAR:
		{
			this.sprite.size = {y: 2, x: 1}
			break;
		}
		case EnumObstacle.DRAGON_STATUE:
		{
			this.sprite.size = {y:2, x: 1.5}
			break;
		}
		case EnumObstacle.WELL:
		case EnumObstacle.TORTURE_TABLE:
		case EnumObstacle.SPIT:
		case EnumObstacle.BARRELSx3:
		case EnumObstacle.BARRELSx2:
		case EnumObstacle.MUG_TABLE:
		case EnumObstacle.SWORD_TABLE:
		case EnumObstacle.WIDE_SHELVES:
		case EnumObstacle.EXIT_STAIRS:
		{
			this.sprite.size = {y: 2, x: 2}
			 break;
		}
		case EnumObstacle.MEAT_RACK:
		case EnumObstacle.ZOMBI_MASTER_DESK: 
		{
			this.sprite.size = {y: 2, x: 3}
			break;
		}
		case EnumObstacle.DINING_TABLE: {
			this.sprite.size = {y: 4, x: 3}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE: {
			this.sprite.size = {y: 3, x: 2}
			break;
		}
		default: {
			this.sprite.size = {y: 1, x: 1}
			break;
		}
	}
	//	If grid co-ordinates are passed, use them - otherwise attempt to fit randomly in passed room 
	if(x && y) {
		this.grid = {
			x: x,
			y: y
		}
	} else {
		var attempts = levelGen.vars.addObstacleAttempts;
		var validPlacement = false;
		while(attempts && !validPlacement) {
			validPlacement = true;
			tryY = Math.floor(session.prng.nextFloat() * (room.height - 1 - this.sprite.size.y)) + 1 + room.origin.y;
			tryX = Math.floor(session.prng.nextFloat() * (room.width - 1 - this.sprite.size.x)) + 1 + room.origin.x;
			for(var i = 0; i < this.sprite.size.y; i++) {
				for(var j = 0; j < this.sprite.size.x; j++) {
					if(level.obstacleArray[tryY + i][tryX + j] !== undefined) {
						validPlacement = false;
					}	
				}
			}
			attempts--;
		}
		if(validPlacement) {
			this.grid = {
				y: tryY,
				x: tryX
			}
		} else {
			this.grid = {
				y: 0,
				x: 0
			}
		}
	}

	//	Once size is known, switch type to populate obstacle array
	level.obstacleArray[this.grid.y][this.grid.x] = 1;
	switch(type) {
		case EnumObstacle.DOOR:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			break;
		}
		case EnumObstacle.COFFIN: 
		case EnumObstacle.SACKx2:
		case EnumObstacle.NARROW_SHELVES:
		case EnumObstacle.MONOLITH:
		case EnumObstacle.WARRIOR_STATUE:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			break;
		}
		case EnumObstacle.WELL:
		case EnumObstacle.TORTURE_TABLE:
		case EnumObstacle.SPIT:
		case EnumObstacle.BARRELSx3:
		case EnumObstacle.BARRELSx2:
		case EnumObstacle.MUG_TABLE:
		case EnumObstacle.SWORD_TABLE:
		case EnumObstacle.WIDE_SHELVES:
		case EnumObstacle.EXIT_STAIRS:
		case EnumObstacle.DRAGON_STATUE:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.obstacleArray[this.grid.y][this.grid.x+1] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x+1] = 1;
			 break;
		}
		case EnumObstacle.MEAT_RACK:
		case EnumObstacle.ZOMBI_MASTER_DESK: 
		{
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 3; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}
		case EnumObstacle.DINING_TABLE: {
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE: {
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}
		default: {
			break;
		}
	}

	this.foreground = true;
	this.vars = {
		drawOffset: {y:0,x:0}
	};
	this.position = {
		y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
		x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
	}
	this.box = {
		type: EnumBoxtype.OBSTACLE,
		topLeft: {},
		bottomRight: {}
	}
	this.maxOffset = {
		y: 0,
		x: 0
	}
	this.offsetSpace = {
		y: 0,
		x: 0
	}
	// this.interact = function() {};
	switch(this.type) {
		case EnumObstacle.DOOR: {
			this.doorType = Math.floor(session.prng.nextFloat() * level.tiles.door.length / 3);
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.interact = function() {
				if(!this.open) {
					this.open = true;
					this.animated = true;
					this.animTime = 100;
					this.animStart = performance.now();
					this.currentSprite = level.tiles.door[1 + this.doorType * 3];
					level.terrainArray[this.grid.y+1][this.grid.x] = 0;
					return this.animTime;
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.ctx = bgCtx;
				this.currentSprite = level.tiles.door[2 + this.doorType * 3];
			}
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.EXIT_STAIRS: {
			this.closed = true;
			this.sprite.spriteSheet = level.img;
			this.currentSprite = level.tiles.exitStairs[0];
			this.interact = function() {
				var hasKey = false;
				for(var i = 0; i < player.items.length; i++) {
					if(player.items[i].name === "Exit Key") {
						hasKey = true;
					}
				}
				// hasKey = true;
				if(!this.open && hasKey) {
					displayMessage(3000, "Your key unlocks the trapdoor!");
					this.open = true;
					this.animated = true;
					this.animTime = 500;
					this.animStart = performance.now();
					this.currentSprite = level.tiles.exitStairs[1];
					return this.animTime;
				} else if(!this.open) {
					displayMessage(3000, "The trapdoor is locked!", "You need to find the key...");
				} else {
					endLevel();
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.ctx = bgCtx;
				this.currentSprite = level.tiles.exitStairs[2];
			}
			this.vars.drawOffset = {
				y: TILE_SIZE,
				x: 0
			}
			this.vars.drawY = 1;
			this.position = {
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.BARREL: {
			this.currentSprite = level.obstacleTiles[5];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 5,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {y:0,x:3}
			break;
		}
		case EnumObstacle.BARREL_2: {
			this.currentSprite = level.obstacleTiles[11];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 6,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {y:2,x:1}
			break;
		}
		case EnumObstacle.DINING_TABLE: {		//	Occupy 2 tiles on x axis * 4 on y in obstacleArray
			this.currentSprite = level.obstacleTiles[0];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 3,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.vars.drawOffset = {y: TILE_SIZE * 1.75, x:0};
			this.position = {
				y: (this.grid.y * TILE_SIZE),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.DINING_CHAIR: {
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 5,
				x: this.grid.x * TILE_SIZE + TILE_SIZE - 5
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:3}
			if(modifier === 1) {
				this.currentSprite = level.obstacleTiles[1];
			} else if(modifier === 2) {
				this.currentSprite = level.obstacleTiles[2];
			} else if(modifier === 3) {
				this.maxOffset = {y:0,x:1};
				this.currentSprite = level.obstacleTiles[3];
				this.sprite.size.y = 2;
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE - TILE_SIZE / 2 + 12,
					x: this.grid.x * TILE_SIZE - TILE_SIZE / 2 -2
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + TILE_SIZE + 6,
					x: this.grid.x * TILE_SIZE + TILE_SIZE / 2 - 2
				}
				this.position = {
					y: (this.grid.y * TILE_SIZE + 6),
					x: (this.grid.x * TILE_SIZE)
				}
			}
			break;
		}
		case EnumObstacle.BUCKET: {
			this.currentSprite = level.obstacleTiles[6];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 7,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:3}
			break;
		}
		case EnumObstacle.WELL: {
			this.currentSprite = level.obstacleTiles[7];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 16,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 26,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:2,x:8}
			break;
		}
		case EnumObstacle.COFFIN: {
			this.currentSprite = level.obstacleTiles[4];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 22,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:5,x:0}
			break;
		}
		case EnumObstacle.TORTURE_TABLE: {
			this.currentSprite = level.obstacleTiles[8];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 28
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:0,x:2}
			break;
		}
		case EnumObstacle.MEAT_RACK: {
			this.currentSprite = level.obstacleTiles[9];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + (TILE_SIZE * 2 - 1)
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {y:0,x:14}
			break;
		}
		case EnumObstacle.STOOL: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[10];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 10/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:5}
			break;
		}
		case EnumObstacle.SACK: {
			this.currentSprite = level.obstacleTiles[12];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:4}
			break;
		}
		case EnumObstacle.BLOOD_BUCKET: {
			this.currentSprite = level.obstacleTiles[13];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:2,x:1}
			break;
		}
		case EnumObstacle.ZOMBI_MASTER_DESK: {
			this.currentSprite = level.obstacleTiles[15];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {y:4,x:13}
			break;
		}
		case EnumObstacle.ZOMBI_HEAD: {
			this.currentSprite = level.obstacleTiles[16];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.STONES: {
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[14];
				this.maxOffset = {y:5,x:0}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 7,
					x: this.grid.x * TILE_SIZE + 15
				}
			} else {
				this.currentSprite = level.obstacleTiles[39];
				this.maxOffset = {y:0,x:0}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 15
				}
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.SPIT: {
			this.currentSprite = level.obstacleTiles[17];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 19,
				x: this.grid.x * TILE_SIZE + 23
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:8,x:4}
			break;
		}
		case EnumObstacle.FILTH_BUCKET: {
			this.currentSprite = level.obstacleTiles[18];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 9,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.BARRELSx3: {
			this.currentSprite = level.obstacleTiles[19];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 21
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:10,x:10}
			break;
		}
		case EnumObstacle.BARRELSx2: {
			this.currentSprite = level.obstacleTiles[20];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 14,
				x: this.grid.x * TILE_SIZE + 19
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:13,x:10}
			break;
		}
		case EnumObstacle.SACK_2: {
			this.currentSprite = level.obstacleTiles[21];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 11/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:2}
			break;
		}
		case EnumObstacle.SACKx2: {
			this.currentSprite = level.obstacleTiles[22];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:10,x:0}
			break;
		}
		case EnumObstacle.TIPPED_BARREL: {
			this.currentSprite = level.obstacleTiles[23];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:4,x:0}
			break;
		}
		case EnumObstacle.SPLIT_SACK: {
			this.currentSprite = level.obstacleTiles[24];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:0}
			break;
		}
		case EnumObstacle.WATER_BUTT: {
			this.currentSprite = level.obstacleTiles[25];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:4}
			break;
		}
		case EnumObstacle.GRAIN_BARREL: {
			this.currentSprite = level.obstacleTiles[26];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.WOODEN_CHAIR: {
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:2}
			if(modifier === 1) {										//	R facing
				this.currentSprite = level.obstacleTiles[27];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 5,
					x: this.grid.x * TILE_SIZE + 3
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 13
				}
			} else {
				this.currentSprite = level.obstacleTiles[28];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 5,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 10
				}
				this.maxOffset.x = 3;
			}
			break;
		}
		case EnumObstacle.WOODEN_BENCH: {
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			if(modifier === 1) {										//	Vertical
				this.currentSprite = level.obstacleTiles[29];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 3,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 9,
					x: this.grid.x * TILE_SIZE + 9
				}
				this.maxOffset = {y:1,x:6}
			} else {
				this.currentSprite = level.obstacleTiles[30];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 3,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 6,
					x: this.grid.x * TILE_SIZE + 15
				}
				this.maxOffset = {y:6,x:0}
			}
			break;
		}
		case EnumObstacle.MUG_TABLE: {
			this.currentSprite = level.obstacleTiles[31];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 27
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:8,x:4}
			break;
		}
		case EnumObstacle.SWORD_TABLE: {
			this.currentSprite = level.obstacleTiles[32];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 27
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:5,x:4}
			break;
		}
		case EnumObstacle.WIDE_SHELVES: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[33];
			} else {
				this.currentSprite = level.obstacleTiles[35];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 22
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:1,x:6}
			break;
		}
		case EnumObstacle.NARROW_SHELVES: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[34];
			} else {
				this.currentSprite = level.obstacleTiles[36];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.RUBBLE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[37];
			} else {
				this.currentSprite = level.obstacleTiles[38];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 7,
				x: this.grid.x * TILE_SIZE + 16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:4,x:0}
			break;
		}
		case EnumObstacle.SKULL_SPIKE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[40];
			} else {
				this.currentSprite = level.obstacleTiles[41];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + 7
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 4)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.FLAG_SPIKE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[42];
			} else {
				this.currentSprite = level.obstacleTiles[43];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + 4
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 4)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.MONOLITH: {
			this.currentSprite = level.obstacleTiles[44];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 27,
				x: this.grid.x * TILE_SIZE + 13
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.WARRIOR_STATUE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2) + 1;
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[45];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 5
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 22,
					x: this.grid.x * TILE_SIZE + 12
				}
			} else {
				this.currentSprite = level.obstacleTiles[46];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 0
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 22,
					x: this.grid.x * TILE_SIZE + 7
				}
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.DRAGON_STATUE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2) + 1;
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[47];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 0
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 24,
					x: this.grid.x * TILE_SIZE + 12
				}
			} else {
				this.currentSprite = level.obstacleTiles[48];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 4
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 24,
					x: this.grid.x * TILE_SIZE + 16
				}
			}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE: {
			this.currentSprite = level.obstacleTiles[52];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 34,
				x: this.grid.x * TILE_SIZE + 0
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 42,
				x: this.grid.x * TILE_SIZE + 16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE * 3/2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.STONE_PILLAR: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 3) + 1;
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[49];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 20,
					x: this.grid.x * TILE_SIZE + 0
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 25,
					x: this.grid.x * TILE_SIZE + 11
				}
			} else if(modifier < 3) {
				this.currentSprite = level.obstacleTiles[50];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 14,
					x: this.grid.x * TILE_SIZE + 0
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 19,
					x: this.grid.x * TILE_SIZE + 14
				}
			} else {
				this.currentSprite = level.obstacleTiles[51];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 20,
					x: this.grid.x * TILE_SIZE + 0
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 25,
					x: this.grid.x * TILE_SIZE + 9
				}
			}
			console.log(this);
			break;
		}

		default: {
			break;
		}
	}
	if(!noOffset) {
		this.offsetPosition();
	}
	//	If object was successfully placed, add it to the obstacles array
	if(this.grid.x !== 0 & this.grid.y !== 0) {
		level.obstacles.push(this);
	}
}

Obstacle.prototype.offsetPosition = function() {
	var offset_y = Math.floor(session.prng.nextFloat() * this.maxOffset.y);
	var offset_x = Math.floor(session.prng.nextFloat() * this.maxOffset.x);
	this.box.topLeft.y += offset_y;
	this.box.bottomRight.y += offset_y;
	this.position.y += offset_y;
	this.box.topLeft.x += offset_x;
	this.box.bottomRight.x += offset_x;
	this.position.x += offset_x;
}
