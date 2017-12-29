Obstacle = function(type, room, y, x, modifier) {
	this.type = type;
	this.sprite = {
		spriteSheet: level.obstacleImg,
	};
	//	Initial type switch to determine size needed for placement - only needed if sprite is bigger than 1x1
	switch(type) {
		case EnumObstacle.DOOR:
		case EnumObstacle.COFFIN: 
		{
			this.sprite.size = {y: 2, x: 1}; break;
		}
		case EnumObstacle.WELL:
		case EnumObstacle.TORTURE_TABLE:
		case EnumObstacle.SPIT:
		case EnumObstacle.BARRELSx3:
		{
			this.sprite.size = {y: 2, x: 2}; break;
		}
		case EnumObstacle.MEAT_RACK:
		case EnumObstacle.ZOMBI_MASTER_DESK: 
		{
			this.sprite.size = {y: 2, x: 3}; break;
		}
		case EnumObstacle.DINING_TABLE: {
			this.sprite.size = {x: 3, y: 4}; break;
		}
		default: {
			this.sprite.size = {y: 1, x: 1}; break;
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
			tryY = Math.floor(level.seed.nextFloat() * (room.height - 1 - this.sprite.size.y)) + 1 + room.origin.y;
			tryX = Math.floor(level.seed.nextFloat() * (room.width - 1 - this.sprite.size.x)) + 1 + room.origin.x;
			for(var i = 0; i < this.sprite.size.y; i++) {
				for(var j = 0; j < this.sprite.size.x; j++) {
					if(level.obstacleArray[tryY + i][tryX + j] !== undefined) {
						validPlacement = false;
					}	
				}
			}
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
	this.offsetSpace = {
		y: 0,
		x: 0
	}
	// this.interact = function() {};
	switch(this.type) {
		case EnumObstacle.DOOR: {
			this.doorType = Math.floor(level.seed.nextFloat() * level.tiles.door.length / 3);
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
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
		case EnumObstacle.BARREL: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[5];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {
				y: 0,
				x: 3
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.BARREL_2: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[11];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 14/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {
				y: 2,
				x: 1
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.DINING_TABLE: {		//	Occupy 2 tiles on x axis * 4 on y in obstacleArray
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
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
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + TILE_SIZE - 5
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 0,
				x: 3
			}
			if(modifier === 'Right') {
				this.currentSprite = level.obstacleTiles[1];
				this.offsetPosition();
			} else if(modifier === 'Left') {
				this.currentSprite = level.obstacleTiles[2];
				this.offsetPosition();
			} else if(modifier === 'Facing') {
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
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[6];
			this.sprite.size.y = 1;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 13/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 3,
				x: 3
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.WELL: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			level.obstacleArray[this.grid.y][this.grid.x+1] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x+1] = 1;
			this.currentSprite = level.obstacleTiles[7];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 16,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 30,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {
				y: 2,
				x: 8
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.COFFIN: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[4];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 26,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 5,
				x: 0
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.TORTURE_TABLE: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			level.obstacleArray[this.grid.y][this.grid.x+1] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x+1] = 1;
			this.currentSprite = level.obstacleTiles[8];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + (TILE_SIZE * 2) - 4,
				x: this.grid.x * TILE_SIZE + 28
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {
				y: 0,
				x: 2
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.MEAT_RACK: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 3; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			this.currentSprite = level.obstacleTiles[9];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + (TILE_SIZE * 2 - 1),
				x: this.grid.x * TILE_SIZE + (TILE_SIZE * 2 - 1)
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {
				y: 0,
				x: 14
			}
			this.offsetPosition();
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
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 13/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 10/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 3,
				x: 5
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.SACK: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[12];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 15/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 1,
				x: 4
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.BLOOD_BUCKET: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[13];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 14/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 2,
				x: 1
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.ZOMBI_MASTER_DESK: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 3; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			this.currentSprite = level.obstacleTiles[15];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {
				y: 4,
				x: 13
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.ZOMBI_HEAD: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[16];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 0,
				x: 0
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.STONE_PILE: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[14];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 11/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 15/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 5,
				x: 0
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.SPIT: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			this.currentSprite = level.obstacleTiles[17];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE + 23
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {
				y: 8,
				x: 4
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.FILTH_BUCKET: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[18];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 13/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {
				y: 1,
				x: 0
			}
			this.offsetPosition();
			break;
		}
		case EnumObstacle.BARRELSx3: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			this.currentSprite = level.obstacleTiles[19];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 22,
				x: this.grid.x * TILE_SIZE + 21
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {
				y: 10,
				x: 10
			}
			this.offsetPosition();
			break;
		}
		default: {
			break;
		}
	}
	level.obstacles.push(this);
}

Obstacle.prototype.offsetPosition = function() {
	var offset_y = Math.floor(level.seed.nextFloat() * this.maxOffset.y);
	var offset_x = Math.floor(level.seed.nextFloat() * this.maxOffset.x);
	this.box.topLeft.y += offset_y;
	this.box.bottomRight.y += offset_y;
	this.position.y += offset_y;
	this.box.topLeft.x += offset_x;
	this.box.bottomRight.x += offset_x;
	this.position.x += offset_x;
}
