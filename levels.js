//	Level to be returned
var level = {
	height: 0,
	width: 0,
	terrainArray: [],
	creatureArray: [],
	obstacleArray: [],
	overlayArray: [],
	fillArray: [],
	obstacles: [],
	rooms: [],
	obstacles: [],
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
	displayAsMap: false,
	validLevel: false
}


//	Level generator
var levelGen = {
	vars: {
		roomAttempts: 300,
		verticalConnectorSparseness: 10,
		horizontalConnectorSparseness: 25,
		corridorStraightness: 5,
		wallDecorFrequency: 8,
		tallDecorRarity: 5,
		commonFloatingDecorScarcity: 30,
		rareFloatingDecorScarcity: 60,
		minSpecialRooms: 1,
		maxSpecialRooms: 4,
		deadEndFactor: 0.5,					//	Fraction of dead ends that get filled in is 1 divided by this number
		basicRoomScarcity: 5,				//	1 = 100% basic rooms, 2 = 50% etc				
		addCreatureAttempts: 20
	},

	loadLevel: function(levelNumber, prng) {
		level.seed = prng;
		switch(levelNumber) {
			case 0: {
				level.height = 70;
				level.width = 70;
				level.img = document.getElementById('tilesetImg');
				level.tiles = levelTilesets[0];
				level.roomTypes = [
					EnumRoomtype.MUD_PATCH, EnumRoomtype.COBBLES, EnumRoomtype.GREY_STONE
				];
				level.startRoomContents = function() {
					console.log("Adding start room contents");
					level.playerStart = {y: this.origin.y, x: this.origin.x};
					new Obstacle(level.playerStart.y + 1, level.playerStart.x + 1, EnumObstacle.TORTURE_TABLE);
					this.addCreature(EnumCreature.MUMI);
				};
				level.boss = EnumCreature.CAMP_VAMP;
				level.bossRoomContents = function() {
					console.log("Adding boss room contents");
					//	Remove any existing obstacles apart from doors
					var that = this;
					for(var i = level.obstacles.length - 1; i >= 0; i--) {
						if(	level.obstacles[i].grid.y >= that.origin.y && level.obstacles[i].grid.y <= that.origin.y + that.height && 
							level.obstacles[i].grid.x >= that.origin.x && level.obstacles[i].grid.x <= that.origin.x + that.width
							&& level.obstacles[i].type !== EnumObstacle.DOOR
						) {
							console.log("Deleting obstacle...");
							level.obstacles.splice(i, 1);
						}
					}
					//	Remove any existing decor **********************************Need to remove existing tall decor too********************************
					for(var i = level.decor.length - 1; i >= 0; i--) {
						if(	level.decor[i].grid.y >= that.origin.y && level.decor[i].grid.y <= that.origin.y + that.height && 
							level.decor[i].grid.x >= that.origin.x && level.decor[i].grid.x <= that.origin.x + that.width
						) {
							console.log("Deleting decor...");
							level.decor.splice(i, 1);
						}
					}
					// Add tiled floor
					for(var i = this.origin.y; i < this.origin.y + this.height + 1; i++) {
						for(var j = this.origin.x; j < this.origin.x + this.width; j++) {
							if(level.terrainArray[i][j] === 0) {
								level.overlayArray[i][j] = level.tiles.tiledFloor[0];
							}
						}
					}
					//	Add special obstacles - dining table & chairs - ***** needs a min room height of 8 and width of 6
					var rand = Math.floor(level.seed.nextFloat() * (this.height - 6 - 2));			//	6: total height of table & chairs, 2: to ensure a space either side
					var diningRoom_y = this.origin.y + 1 + rand;
					var rand2 = Math.floor(level.seed.nextFloat() * (this.width - 4 - 2));			//	4: total width of table & chairs, 2: to ensure a space either side
					var diningRoom_x = this.origin.x + 1 + rand2;


					new Obstacle(diningRoom_y + 1, diningRoom_x + 1, EnumObstacle.DINING_TABLE);
					new Obstacle(diningRoom_y + 0, diningRoom_x + 2, EnumObstacle.DINING_CHAIR, 'Facing');
					new Obstacle(diningRoom_y + 1, diningRoom_x + 0, EnumObstacle.DINING_CHAIR, 'Right');
					new Obstacle(diningRoom_y + 3, diningRoom_x + 0, EnumObstacle.DINING_CHAIR, 'Right');
					new Obstacle(diningRoom_y + 4, diningRoom_x + 0, EnumObstacle.DINING_CHAIR, 'Right');
					new Obstacle(diningRoom_y + 2, diningRoom_x + 3, EnumObstacle.DINING_CHAIR, 'Left');
					new Obstacle(diningRoom_y + 4, diningRoom_x + 3, EnumObstacle.DINING_CHAIR, 'Left');
					//	Add columns on facing wall spaces
					for(var i = this.origin.x; i < this.origin.x + this.width; i++) {
						if(level.terrainArray[this.origin.y-2][i] === 1 && level.overlayArray[this.origin.y-2][i-1] !== level.tiles.wallDecorTall[1] &&
							level.obstacleArray[this.origin.y-2][i] === undefined && level.obstacleArray[this.origin.y-1][i] === undefined
						) {
							level.overlayArray[this.origin.y-2][i] = level.tiles.wallDecorTall[1];
							level.overlayArray[this.origin.y-1][i] = level.tiles.tiledFloor[1];
							level.overlayArray[this.origin.y][i] = level.tiles.tiledFloor[2];
						}
					}

					// Add boss and other creatures
					this.addCreature(level.boss);
					var rand = Math.floor(level.seed.nextFloat() * 3) + 3		//	From 3 - 5
					for(var i = 0; i < rand; i++) {
						this.addCreature(EnumCreature.SKELTON);
					}
				};
				level.commonCreatures = [
					EnumCreature.GREEN_GOBLIN,
					EnumCreature.URK,
					EnumCreature.SKELTON
				];
				level.uncommonCreatures = [
					EnumCreature.MINI_GHOST,
					EnumCreature.GREEN_SLUDGIE,
					EnumCreature.HULKING_URK,
					EnumCreature.DENZIN
				];
				level.rareCreatures = [
					EnumCreature.MINI_GHOST
				];
				level.commonObstacles = [
					EnumObstacle.BARREL,
					EnumObstacle.BUCKET
				];
				level.uncommonObstacles = [
					EnumObstacle.WELL
				];
				level.rareObstacles = [
					EnumObstacle.COFFIN
				];
				level.randomRoomFactor = 10;			//	Sets range of possible random room contents for generator
				level.randomRoomIncrease = 0;				//	Increment for higher levels, added to random level selector
				break;
			}
			default: {
				break;
			}
		}
		//	Generate level and return it to game
		this.generateLevel();
		return level;
	},

	generateLevel: function() {
		//	Generate layouts and discard if invalid until a valid one is created
		while(!level.validLevel) {
			this.fillOutMap();
		}

		//	Add basic tileset overlays
		this.addBasicOverlays();

		//	Run each room's own tileset overlay
		level.rooms.forEach(function(room) {
			room.setupOverlays();
		});

		//	Add floating decor graphics (obstacles)
		this.addFloatingDecor();
		//	Add doors
		this.addDoors();
		//	Run each room's 'addContents' function
		level.rooms.forEach(function(room) {
			// if(room.type === 'start') {
				room.addContents();
			// }
		});
		//	Add a smattering of extra random creatures
		this.addRandomCreatures();
	},


	fillOutMap: function() {
		this.clearLevel();
		this.setupInitialGrid(level.height, level.width);

		//	Set up special rooms
		this.setupStartAndBossRooms();
		level.specialRooms = 0;					//	Count number of successfully added special rooms
		this.setupSpecialRooms();

		//	Add rooms
		for(var i = 0; i < levelGen.vars.roomAttempts; i++) {
			var room = new Room();
		}

		//	Add corridors
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[0].length; j++) {
				this.checkForCorridorStart(i, j);
			}
		}

		//	Add some connectors to rooms on 1-2 of their walls
		level.rooms.forEach(function(room) {
			var doors = 0;
			var tries = 100;
			var rand = Math.floor(level.seed.nextFloat() * 10);
			var doorDirections = [];
			if(rand < 8) {
				doors = 1;
			} else {
				doors = 2;
			}
			while(doors && tries) {
				var direction = Math.floor(level.seed.nextFloat() * 2);
				if(!doorDirections.includes(direction)) {
					switch(direction) {
						case 0: {						//	Up
							var x = Math.floor(level.seed.nextFloat() * room.width);
							if(	level.terrainArray[room.origin.y-3] !== undefined && 
								level.terrainArray[room.origin.y-3][room.origin.x+x] !== undefined && 
								level.terrainArray[room.origin.y-2][room.origin.x+x-1] !== 0 && level.terrainArray[room.origin.y-2][room.origin.x+x+1] !== 0 &&
								level.terrainArray[room.origin.y-3][room.origin.x+x] === 0) 
							{
								level.terrainArray[room.origin.y-2][room.origin.x+x] = 0;
								level.terrainArray[room.origin.y-1][room.origin.x+x] = 0;
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 1: {						//	Down
							var x = Math.floor(level.seed.nextFloat() * room.width);
							if(	level.terrainArray[room.origin.y+room.height+2] !== undefined &&
								level.terrainArray[room.origin.y+room.height+2][room.origin.x+x] !== undefined && 
								level.terrainArray[room.origin.y+room.height+1][room.origin.x+x-1] !== 0 && level.terrainArray[room.origin.y+room.height+1][room.origin.x+x+1] !== 0 &&
								level.terrainArray[room.origin.y+room.height+2][room.origin.x+x] === 0) 
							{
								level.terrainArray[room.origin.y+room.height+1][room.origin.x+x] = 0;
								level.terrainArray[room.origin.y+room.height][room.origin.x+x] = 0;
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 2: {						//	Left
							var y = Math.floor(level.seed.nextFloat() * room.height);
							if(	level.terrainArray[room.origin.y+y][room.origin.x-2] !== undefined && 
								level.terrainArray[room.origin.y+y+2] !== undefined && level.terrainArray[room.origin.y+y-2] !== undefined &&
								level.terrainArray[room.origin.y+y+2][room.origin.x-1] !== 0 && level.terrainArray[room.origin.y+y-2][room.origin.x-1] !== 0 &&
								level.terrainArray[room.origin.y+y+1][room.origin.x-1] !== 0 && level.terrainArray[room.origin.y+y-1][room.origin.x-1] !== 0 &&
								level.terrainArray[room.origin.y+y][room.origin.x-2] === 0) 
							{
								level.terrainArray[room.origin.y+y][room.origin.x-1] = 0;
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 3: {						//	Right
							// debugger;
							var y = Math.floor(level.seed.nextFloat() * room.height);
							if(	level.terrainArray[room.origin.y+y][room.origin.x+room.width+1] !== undefined && 
								level.terrainArray[room.origin.y+y+2] !== undefined && level.terrainArray[room.origin.y+y-2] !== undefined &&
								level.terrainArray[room.origin.y+y+2][room.origin.x+room.width] !== 0 && level.terrainArray[room.origin.y+y-2][room.origin.x+room.width] !== 0 &&
								level.terrainArray[room.origin.y+y+1][room.origin.x+room.width] !== 0 && level.terrainArray[room.origin.y+y-1][room.origin.x+room.width] !== 0 &&
								level.terrainArray[room.origin.y+y][room.origin.x+room.width+1] === 0) 
							{
								level.terrainArray[room.origin.y+y][room.origin.x+room.width] = 0;
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						default: {
							break;
						}
					}
					tries--;
				}
			}
		});

		// Add some more random connectors
		for(var i = 1; i < level.terrainArray.length - 2; i++) {
			for(var j = 1; j < level.terrainArray[0].length - 1; j++) {
				if(level.terrainArray[i][j] === 1) {												//	If the tile is solid rock...
					if(level.terrainArray[i][j-1] === 0 && level.terrainArray[i][j+1] === 0 &&		//	...and the tiles to left and right are both open...
						level.terrainArray[i+2][j] !== 0 && level.terrainArray[i+1][j] !== 0 &&		//	...and the 2 tiles below are not open...
						level.terrainArray[i-2][j] !== 0 && level.terrainArray[i-1][j] !== 0		//	...and the 2 tiles above are not open...
					) {
						var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.horizontalConnectorSparseness);
						if(rand < 1) {
							level.terrainArray[i][j] = 0;
						}
					} else if(level.terrainArray[i-1][j] === 0 && level.terrainArray[i + 2][j] === 0 &&		//	...or if the tiles above and *2* below are open...
						level.terrainArray[i][j-1] !== 0 && level.terrainArray[i][j-1] !== 0				//	...and the tiles to left and right are not open...
					) { 	
						var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.verticalConnectorSparseness);
						if(rand < 1) {
							level.terrainArray[i][j] = 0;
							level.terrainArray[i+1][j] = 0;
						}
					}
				}
			}
		}

		//	Fill fillArray, starting from start room
		level.fillArray.length = 0;
		for(var i = 0; i < level.fillArray.length; i++) {
			level.fillArray[i] = [];
		}
		level.fillArray = cloneArray(level.terrainArray);
		this.fill(level.fillArray, level.playerStart.y, level.playerStart.x, 0, 2);

		// 	If boss room does not connect to player start room, regenerate map
		if(level.fillArray[level.bossStart.y][level.bossStart.x] !== 2) {
			console.log("Invalid level, clearing...");
			level.validLevel = false;
		} else {
			// Fill in any areas not connected to the main network
			this.fillInUnreaachableAreas();
			// Pick some dead ends and back-fill them
			this.reduceDeadEnds();
			// Fill in any areas not connected to the main network again
			// (not totally sure why this is required again but it seems to be to remove occasional overlays in inaccessible areas!)
			this.fillInUnreaachableAreas();
			level.validLevel = true;
		}

	},

	clearLevel: function() {
		level.terrainArray.length = 0;
		level.obstacleArray.length = 0;
		level.fillArray.length = 0;
		level.overlayArray.length = 0;
		level.rooms.length = 0;
		level.obstacles.length = 0;
		level.corridors.length = 0;
	},

	setupInitialGrid: function() {
		for(var i = 0; i < level.height; i++) {
			level.terrainArray[i] = [];
			level.obstacleArray[i] = [];
			level.overlayArray[i] = [];
			level.creatureArray[i] = [];
			for(var j = 0; j < level.width; j++) {
				level.terrainArray[i][j] = 1;								//	1 = regular impassable wall tile
				level.creatureArray[i][j] = 0;								//	0 = no creature

			}
		}

	},

	setupStartAndBossRooms: function() {
		var startRand = Math.floor(level.seed.nextFloat() * 5);
		var startSizeX = 7 - startRand; 
		var startSizeY = 3 + startRand;
		var bossRand = Math.floor(level.seed.nextFloat() * 5);
		var bossSizeX = 8 + bossRand;
		var bossSizeY = 12 - bossRand; 
		var startPosX, startPosY, bossPosX, bossPosY;
		var startCorner = Math.floor(level.seed.nextFloat() * 4);
		var startCorner = 1;
		switch(startCorner) {
			case 0: {
				startPosY = Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3 +2);
				startPosX = Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3 +2);
				bossPosY = level.terrainArray.length - (Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3)) - bossSizeY -2;
				bossPosX = level.terrainArray[0].length - (Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3)) - bossSizeX -2;
			}
			case 1: {
				startPosY = level.terrainArray.length - (Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3)) - startSizeY -2;
				startPosX = level.terrainArray[0].length - (Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3)) - startSizeX -2;
				bossPosY = Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3 +2);
				bossPosX = Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			}
			case 2: {
				startPosY = level.terrainArray.length - (Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3)) - startSizeY -2;
				startPosX = Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3 +2);
				bossPosY = Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3 +2);
				bossPosX = level.terrainArray[0].length - (Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3)) - bossSizeX -2;
			}
			case 4: {
				startPosY = Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3 +2);
				startPosX = level.terrainArray[0].length - (Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3)) - startSizeX -2;
				bossPosY = level.terrainArray.length - (Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3)) - bossSizeY -2;
				bossPosX = Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			}
			default: {
				break;
			}
		}
		level.playerStart.y = startPosY + 1;
		level.playerStart.x = startPosX + 1;
		level.bossStart.y = bossPosY + 1;
		level.bossStart.x = bossPosX + 1;

		var startRoom = new Room(startPosY, startPosX, startSizeY, startSizeX, 'start', level.startRoomContents);
		var bossRoom = new Room(bossPosY, bossPosX, bossSizeY, bossSizeX, 'boss', level.bossRoomContents);
	},

	setupSpecialRooms: function() {
		//	Placeholder!
	},

	addBasicOverlays: function() {
		//	First iterate terrain array and set every tile to either floor or solid
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[0].length; j++) {
				if(level.terrainArray[i][j] === 0) {
					level.overlayArray[i][j] = level.tiles.floor;
				} else {
					level.overlayArray[i][j] = level.tiles.solid;
				}
			}
		}
		//	Then iterate terrain array and add basic wall faces
		for(var i = 1; i < level.terrainArray.length-1; i++) {
			for(var j = 1; j < level.terrainArray[0].length-1; j++) {
				if(	level.terrainArray[i][j] === 0 && level.terrainArray[i-1][j] === 1) {
					if(level.terrainArray[i-1][j-1] === 0 && level.terrainArray[i-1][j+1] === 0) {
						level.overlayArray[i-1][j] = level.tiles.wallFace[3];
					} else if(level.terrainArray[i-1][j-1] === 0 && level.terrainArray[i-1][j+1] === 1) {
						level.overlayArray[i-1][j] = level.tiles.wallFace[1];
					} else if(level.terrainArray[i-1][j-1] === 1 && level.terrainArray[i-1][j+1] === 0) {
						level.overlayArray[i-1][j] = level.tiles.wallFace[2];
					} else if(level.terrainArray[i-1][j-1] === 1 && level.terrainArray[i-1][j+1] === 1) {
						level.overlayArray[i-1][j] = level.tiles.wallFace[0];
					} 
				}
			}
		}
		//	Then iterate terrain array and add wall tops, wall decor, dirt at base of walls
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[0].length; j++) {
				//	If tile is solid and tile 2 below it is floor (add wall tops)...
				if(level.terrainArray[i+2] !== undefined && level.terrainArray[i+2][j] !== undefined && level.terrainArray[i+1][j] === 1 && level.terrainArray[i+2][j] === 0) {
					//	...add a wall top overlay, depending on whether this is an end wall or not
					if(level.terrainArray[i+1][j-1] === 0 && level.terrainArray[i+1][j+1] === 0) {
						level.overlayArray[i][j] = level.tiles.wallTop[3];		//	both ends
					} else if(level.terrainArray[i+1][j-1] === 0) {
						level.overlayArray[i][j] = level.tiles.wallTop[1];		//	left end
					} else if(level.terrainArray[i+1][j+1] === 0) {
						level.overlayArray[i][j] = level.tiles.wallTop[2];		//	right end
					} else {
						level.overlayArray[i][j] = level.tiles.wallTop[0];		//	no ends
					}
				}
				//	...or if tile is wall face with floor on tile below it (randomly add wall decor)...
				else if(level.terrainArray[i][j] === 1 && level.terrainArray[i+1] !== undefined && level.terrainArray[i+1][j] === 0 && 
					level.terrainArray[i][j-1] !== undefined && level.terrainArray[i][j-1] === 1 && level.terrainArray[i][j+1] !== undefined && level.terrainArray[i][j+1] === 1) {
					var smallDecor = true;
					var allowTallDecor = false;
					if(level.terrainArray[i+1][j-1] === 0 && level.terrainArray[i+1][j+1] === 0) {
						allowTallDecor = true;
					}
					//	Randomly determine whether wall face should have decor added...
					if(allowTallDecor) {
						var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.tallDecorRarity);
						if(rand < 1) {
							smallDecor = false;
						}
					}
					if(smallDecor) {
						var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.wallDecorFrequency);
						if(rand < 1) {
							var rand2 = Math.floor(level.seed.nextFloat() * level.tiles.wallDecorSmall.length);
							level.overlayArray[i][j] = level.tiles.wallDecorSmall[rand2];
						}
					} else {
						var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.wallDecorFrequency);
						if(rand < 1) {
							var rand2 = Math.floor(level.seed.nextFloat() * level.tiles.wallDecorTall.length);
							for(var k = 0; k < level.tiles.wallDecorTall[rand2].height; k++) {
								level.overlayArray[i+k+level.tiles.wallDecorTall[rand2].offset_y][j] = {
									y: level.tiles.wallDecorTall[rand2].y + k,
									x: level.tiles.wallDecorTall[rand2].x
								};
							}
						}
					}
				}
				//	...or if tile is floor with no existing decor (add dirt at base of wall faces)...
				else if(level.terrainArray[i][j] === 0  && level.overlayArray[i][j] === level.tiles.floor) {
					//	...plus tile above is wall face...
					if(	level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j-1] !== undefined && level.terrainArray[i-1][j+1] !== undefined && 
						level.terrainArray[i-1][j] === 1 && level.terrainArray[i][j-1] === 0 && level.terrainArray[i][j+1] === 0) 
					{
						var rand = Math.floor(level.seed.nextFloat() * 3);
						level.overlayArray[i][j] = level.tiles.wallBtm[rand];
					//	...or both tiles above and left and above and right are inner wall corners...
					} else if(
						level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j-1] !== undefined && level.terrainArray[i-1][j+1] !== undefined &&
						level.terrainArray[i][j-1] === 1 && level.terrainArray[i][j+1] === 1 && level.terrainArray[i-1][j] === 1) 
					{
						level.overlayArray[i][j] = level.tiles.wallBtm[12];
					//	...or tile above and left is inner wall corner...
					} else if(
						level.terrainArray[i-1][j-1] !== undefined && level.terrainArray[i-1][j-1] === 1 && level.terrainArray[i][j-1] === 1 && level.terrainArray[i-1][j] === 1) 
					{
						level.overlayArray[i][j] = level.tiles.wallBtm[9];
					//	...or tile above and right is inner wall corner...
					} else if(
						level.terrainArray[i-1][j+1] !== undefined && level.terrainArray[i-1][j+1] === 1 && level.terrainArray[i][j+1] === 1 && level.terrainArray[i-1][j] === 1) 
					{
						level.overlayArray[i][j] = level.tiles.wallBtm[10];
					//	...or tiles left and right are wall faces...
					} else if(
						level.terrainArray[i-1] !== undefined && level.terrainArray[i][j-1] !== undefined && level.terrainArray[i][j+1] !== undefined &&
						level.terrainArray[i-1][j-1] === 1 && level.terrainArray[i-1][j+1] === 1 && level.terrainArray[i][j-1] === 1 && level.terrainArray[i][j+1] === 1) 
					{
						level.overlayArray[i][j] = level.tiles.wallBtm[11];
					//	...or tile to left is wall face...
					} else if(
						level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j-1] !== undefined && level.terrainArray[i-1][j-1] === 1 && level.terrainArray[i][j-1] === 1) 
					{
						var rand = Math.floor(level.seed.nextFloat() * 3) + 3;
						level.overlayArray[i][j] = level.tiles.wallBtm[rand];
					//	...or tile to right is wall face...
					} else if(
						level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j+1] !== undefined && level.terrainArray[i-1][j+1] === 1 && level.terrainArray[i][j+1] === 1) 
					{
						var rand = Math.floor(level.seed.nextFloat() * 3) + 6;
						level.overlayArray[i][j] = level.tiles.wallBtm[rand];
					}
				}
			}
		}
	},

	addFloatingDecor: function() {
		for(var i = 1; i < level.terrainArray.length - 1; i++) {
			for(var j = 1; j < level.terrainArray[0].length - 1; j++) {
				if(level.terrainArray[i][j] === 0 && (level.terrainArray[i][j-1] === 0 || level.terrainArray[i][j+1] === 0)) {
					var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.commonFloatingDecorScarcity);
					if(rand < 1) {
						var decor = new Decor(i, j, 1, 1, EnumObstacle.COMMON_FLOATING_DECOR);
					} else {
						var rand2 = Math.floor(level.seed.nextFloat() * levelGen.vars.rareFloatingDecorScarcity);
						if(rand2 < 1) {
							var decor = new Decor(i, j, 1, 1, EnumObstacle.RARE_FLOATING_DECOR);
						}
					}
				} 
			}
		}
	},

	//	Add a random number of connectors to each corridor (not currently used)
	addCorridorConnectors: function() {
		level.corridors.forEach(function(corridor) {
			var crossConnectors = Math.floor(level.seed.nextFloat() * corridor.tiles.length / 5) + 1;
			var tries = 100;
			while(crossConnectors && tries) {
				var rand = Math.floor(level.seed.nextFloat() * corridor.tiles.length);
				var direction = Math.floor(level.seed.nextFloat() * 4);
				switch(direction) {
					case 0: {				//	Up
						if(	level.terrainArray[corridor.tiles[rand].y-3] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y-3][corridor.tiles[rand].x] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x-1] !== 0 && level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x+1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y-3][corridor.tiles[rand].x] === 0) 
						{
							level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x] = 0;
							level.terrainArray[corridor.tiles[rand].y-1][corridor.tiles[rand].x] = 0;
							crossConnectors--;
						}
						break;
					}
					case 1: {				//	Down
						if(	level.terrainArray[corridor.tiles[rand].y+3] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y+3][corridor.tiles[rand].x] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y+2][corridor.tiles[rand].x-1] !== 0 && level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x+1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y+3][corridor.tiles[rand].x] === 0) 
						{
							level.terrainArray[corridor.tiles[rand].y+2][corridor.tiles[rand].x] = 0;
							level.terrainArray[corridor.tiles[rand].y+1][corridor.tiles[rand].x] = 0;
							crossConnectors--;
						}
						break;
					}
					case 2: {				//	Left
						if(	level.terrainArray[corridor.tiles[rand].y-2] !== undefined && level.terrainArray[corridor.tiles[rand].y+2] !== undefined &&
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x-1] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x-1] !== 0 && level.terrainArray[corridor.tiles[rand].y+2][corridor.tiles[rand].x-1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y-1][corridor.tiles[rand].x-1] !== 0 && level.terrainArray[corridor.tiles[rand].y+1][corridor.tiles[rand].x-1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x-1] === 0) 
						{
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x-1] = 0;
							crossConnectors--;
						}
						break;
					}
					case 2: {				//	Left
						if(	level.terrainArray[corridor.tiles[rand].y-2] !== undefined && level.terrainArray[corridor.tiles[rand].y+2] !== undefined &&
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x+1] !== undefined && 
							level.terrainArray[corridor.tiles[rand].y-2][corridor.tiles[rand].x+1] !== 0 && level.terrainArray[corridor.tiles[rand].y+2][corridor.tiles[rand].x+1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y-1][corridor.tiles[rand].x+1] !== 0 && level.terrainArray[corridor.tiles[rand].y+1][corridor.tiles[rand].x+1] !== 0 &&
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x+1] === 0) 
						{
							level.terrainArray[corridor.tiles[rand].y][corridor.tiles[rand].x+1] = 0;
							crossConnectors--;
						}
						break;
					}
					default: {
						break;
					}
				}
				tries--;
			}
		});
	},

	addDoors: function() {
		level.rooms.forEach(function(room) {
			for(var i = room.origin.x; i < room.origin.x + room.width; i++) {
				if(level.terrainArray[room.origin.y-1][i] === 0 && level.terrainArray[room.origin.y-1][i-1] === 1 && level.terrainArray[room.origin.y-1][i+1] === 1) {
					var addDoor = true;
					level.obstacles.forEach(function(obstacle) {
						if(obstacle.grid.y - room.origin.y-1 <= 2 && obstacle.grid.y - room.origin.y-1 >= 2 && obstacle.grid.x - i <= 2 && obstacle.grid.x - i >= 2) {
							addDoor = false;
						}
					});
					if(addDoor) {
						var door = new Obstacle(room.origin.y-2, i, EnumObstacle.DOOR);
					}
				}
			}
		});

	},

	fillInUnreaachableAreas: function() {
		//	Iterate through rooms and check that when filled they connect to player start - if not, delete them
		for(var i = level.rooms.length - 1; i >= 0; i--) {
			var roomFill = cloneArray(level.terrainArray);
			this.fill(roomFill, level.rooms[i].origin.y + 1, level.rooms[i].origin.x + 1, 0, 2);
			if(roomFill[level.playerStart.y][level.playerStart.x] !== 2) {
				level.rooms.splice(i, 1);
			}
		}
		for(var i = 0; i < level.fillArray.length; i++) {
			for(var j = 0; j < level.fillArray[0].length; j++) {
				if(level.fillArray[i][j] !== 2) {							//	...if tile does not connect to player start...
					level.terrainArray[i][j] = 1;							//	...turn the tile into solid in terrainArray...
					level.overlayArray[i][j] = {y:-1, x:-1};				//	...and remove any existing overlay
				}
			}
		}
	},

	reduceDeadEnds: function() {
		for(var i = 1; i < level.terrainArray.length -1; i++) {
			for(var j = 1; j < level.terrainArray[0].length -1; j++) {
				if(level.terrainArray[i][j] === 0) {
					var exits = this.getExits(i, j);
					if(exits.length === 1) {
						var fillIn = 0;					
						// var fillIn = Math.floor(level.seed.nextFloat() * levelGen.vars.deadEndFactor);
						if(fillIn < 1) {
							this.fillTunnel(i, j);
						}
					}
				}
			}
		}
	},

	//	Returns array of open terrain grid squares directly adjacent to given co-ordinates (ie the squares above, below, left & right)
	getExits: function(y, x) {
		var exits = [];
		exits.length = 0;
		if(level.terrainArray[y-1][x] === 0) {
			exits.push({y: y-1, x: x});
		}
		if(level.terrainArray[y+1][x] === 0) {
			exits.push({y: y+1, x: x});
		}
		if(level.terrainArray[y][x-1] === 0) {
			exits.push({y: y, x: x-1});
		}
		if(level.terrainArray[y][x+1] === 0) {
			exits.push({y: y, x: x+1});
		}
		return exits;
	},

	//	If terrain grid square at passed co-ordinates has just a single exit (ie is a dead end square), fill it in & convert to solid terrain
	fillTunnel: function(y, x) {
		var exits = this.getExits(y, x);
		if(exits.length === 1) {
			level.terrainArray[y][x] = 1;
			this.fillTunnel(exits[0].y, exits[0].x);
		}
	},

	//	Pass an array to fill, starting co-ordinates, the value to be overwritten and the value to overwrite it with - will fill in the contiguous area from starting co-ords
	fill: function(arr, startY, startX, fillValue, fillWith) {
		arr[startY][startX] = fillWith;
		var filling = true;
		while(filling) {
			filling = false;
			for(var i = 1; i < arr.length -1; i++) {
				for(var j = 1; j < arr[0].length -1; j++) {
					if(arr[i][j] === fillWith) {
						if(arr[i-1][j] === fillValue) { 
							arr[i-1][j] = fillWith;
							filling = true;
						}
						if(arr[i+1][j] === fillValue) { 
							arr[i+1][j] = fillWith;
							filling = true;
						}
						if(arr[i][j-1] === fillValue) { 
							arr[i][j-1] = fillWith;
							filling = true;
						}
						if(arr[i][j+1] === fillValue) { 
							arr[i][j+1] = fillWith;
							filling = true;
						}
					}
				}
			}
		}
	},

	checkForCorridorStart: function(y, x) {
		if(
			level.terrainArray[y-2] === undefined ||
			level.terrainArray[y-1] === undefined ||
			level.terrainArray[y+1] === undefined ||
			level.terrainArray[y+2] === undefined ||
			level.terrainArray[y][x-2] === undefined ||
			level.terrainArray[y][x-1] === undefined ||
			level.terrainArray[y][x+2] === undefined ||
			level.terrainArray[y][x+1] === undefined ||

			level.terrainArray[y-2][x-1] === 0 ||
			level.terrainArray[y-2][x] === 0 ||
			level.terrainArray[y-2][x+1] === 0 ||
			level.terrainArray[y-1][x-1] === 0 ||
			level.terrainArray[y-1][x] === 0 ||
			level.terrainArray[y-1][x+1] === 0 ||
			level.terrainArray[y][x-1] === 0 ||
			level.terrainArray[y][x] === 0 ||
			level.terrainArray[y][x+1] === 0 ||
			level.terrainArray[y+1][x-1] === 0 ||
			level.terrainArray[y+1][x] === 0 ||
			level.terrainArray[y+1][x+1] === 0 ||
			level.terrainArray[y+2][x-1] === 0 ||
			level.terrainArray[y+2][x] === 0 ||
			level.terrainArray[y+2][x+1] === 0
		) {
			return false;
		} else {
			var corridor = new Corridor(y, x);
		}
	},

	addRandomCreatures: function() {

	}
};


//	Deep clone an array of objects
function cloneArray (existingArray) {
   var newObj = (existingArray instanceof Array) ? [] : {};
   for (i in existingArray) {
      if (i == 'clone') continue;
      if (existingArray[i] && typeof existingArray[i] == "object") {
         newObj[i] = cloneArray(existingArray[i]);
      } else {
         newObj[i] = existingArray[i]
      }
   }
   return newObj;
}

Corridor = function(y, x) {
	this.y = y;
	this.x = x;
	this.tiles = [];
	this.tiles.push({ y: this.y, x: this.x });
	level.terrainArray[this.y][this.x] = 0;
	this.digging = true;
	this.digDirection = 0;			//	Initialize
	this.validDirections = [];
	while(this.digging) {
		this.chooseDigDirection();
		this.dig();
	}
	level.corridors.push(this);
}

Corridor.prototype.dig = function() {
	if(this.digging) {
		switch(this.digDirection) {
			case 'right': {
				this.x += 1;
				break;
			}
			case 'down': {
				this.y += 1;
				break;
			}
			case 'left': {
				this.x -= 1;
				break;
			}
			case 'up': {
				this.y -= 1;
				break;
			}
			default: {
				break;
			}
		}
	}
	this.tiles.push({ y: this.y, x: this.x });
	level.terrainArray[this.y][this.x] = 0;
}


Corridor.prototype.chooseDigDirection = function() {
	this.validDirections.length = 0;			//	Clear array
	var tryDir;
	for(var i = 0; i < 4; i++) {
		switch(i) {
			case 0: {
				tryDir = 'right';
				break;
			}
			case 1: {
				tryDir = 'down';
				break;
			}
			case 2: {
				tryDir = 'left';
				break;
			}
			case 3: {
				tryDir = 'up';
				break;
			}
			default: {
				break;
			}
		}
		if(this.checkDirection(tryDir)) {
			this.validDirections.push(tryDir);
		}
	}
	if(this.validDirections.length === 0) {
		this.digging = false;
	} else {
		if(this.validDirections.includes(this.digDirection)) {
			var turn = Math.floor(level.seed.nextFloat() * levelGen.vars.corridorStraightness);						//	Probability weighting of continuing to dig in straight line if possible
			if(turn < 1) {
				var digDir = Math.floor(level.seed.nextFloat() * this.validDirections.length);
				this.digDirection = this.validDirections[digDir];
			}
		} else {
			var digDir = Math.floor(level.seed.nextFloat() * this.validDirections.length);
			this.digDirection = this.validDirections[digDir];
		}
	}
}

Corridor.prototype.checkDirection = function(direction) {
	if(direction === 'right') {
		// debugger;
		if(
			level.terrainArray[this.y][this.x+1] === undefined ||
			level.terrainArray[this.y][this.x+2] === undefined ||
			level.terrainArray[this.y-2][this.x+1] === 0 ||
			level.terrainArray[this.y-2][this.x+2] === 0 ||
			level.terrainArray[this.y-1][this.x+1] === 0 ||
			level.terrainArray[this.y-1][this.x+2] === 0 ||
			level.terrainArray[this.y][this.x+1] === 0 ||
			level.terrainArray[this.y][this.x+2] === 0 ||
			level.terrainArray[this.y+1][this.x+1] === 0 ||
			level.terrainArray[this.y+1][this.x+2] === 0 ||
			level.terrainArray[this.y+2][this.x+1] === 0 ||
			level.terrainArray[this.y+2][this.x+2] === 0
		) {
			return false;
		}
	} else if(direction === 'down') {
		if(
			level.terrainArray[this.y+1] === undefined ||
			level.terrainArray[this.y+2] === undefined ||
			level.terrainArray[this.y+3] === undefined ||
			level.terrainArray[this.y+1][this.x-1] === 0 ||
			level.terrainArray[this.y+1][this.x] === 0 ||
			level.terrainArray[this.y+1][this.x+1] === 0 ||
			level.terrainArray[this.y+2][this.x-1] === 0 ||
			level.terrainArray[this.y+2][this.x] === 0 ||
			level.terrainArray[this.y+2][this.x+1] === 0 ||
			level.terrainArray[this.y+3][this.x-1] === 0 ||
			level.terrainArray[this.y+3][this.x] === 0 ||
			level.terrainArray[this.y+3][this.x+1] === 0
		) {
			return false;
		}
	} else if(direction === 'left') {
		if(
			level.terrainArray[this.y][this.x-1] === undefined ||
			level.terrainArray[this.y][this.x-2] === undefined ||
			level.terrainArray[this.y-2][this.x-2] === 0 ||
			level.terrainArray[this.y-2][this.x-1] === 0 ||
			level.terrainArray[this.y-1][this.x-2] === 0 ||
			level.terrainArray[this.y-1][this.x-1] === 0 ||
			level.terrainArray[this.y][this.x-2] === 0 ||
			level.terrainArray[this.y][this.x-1] === 0 ||
			level.terrainArray[this.y+1][this.x-2] === 0 ||
			level.terrainArray[this.y+1][this.x-1] === 0 ||
			level.terrainArray[this.y+2][this.x-2] === 0 ||
			level.terrainArray[this.y+2][this.x-1] === 0
		) {
			return false;
		}
	} else if(direction === 'up') {
		if(
			level.terrainArray[this.y-3] === undefined ||
			level.terrainArray[this.y-2] === undefined ||
			level.terrainArray[this.y-1] === undefined ||
			level.terrainArray[this.y-3][this.x-1] === 0 ||
			level.terrainArray[this.y-3][this.x] === 0 ||
			level.terrainArray[this.y-3][this.x+1] === 0 ||
			level.terrainArray[this.y-2][this.x-1] === 0 ||
			level.terrainArray[this.y-2][this.x] === 0 ||
			level.terrainArray[this.y-2][this.x+1] === 0 ||
			level.terrainArray[this.y-1][this.x-1] === 0 ||
			level.terrainArray[this.y-1][this.x] === 0 ||
			level.terrainArray[this.y-1][this.x+1] === 0
		) {
			return false;
		}
	}
	return direction;
}

//	Room constructor
Room = function(origin_y, origin_x, height, width, type, addContents) {
	if(type) {
		this.type = type;
	} else {
		var rand = Math.floor(level.seed.nextFloat() * levelGen.vars.basicRoomScarcity);
		if(rand < 1) {
			this.type = "basic"
		} else {
			this.type = level.roomTypes[Math.floor(level.seed.nextFloat() * level.roomTypes.length)];
		}
	}
	if(addContents) {
		this.addContents = addContents.bind(this);
	} else {
		this.addContents = function() {};
		this.addContents = this.generateRoomContents();
	}
	switch(this.type) {
		case EnumRoomtype.MUD_PATCH: {
			this.setupOverlays = function() {
				var mud_origin_y, mud_origin_x, mud_height, mud_width;
				mud_height = Math.floor(level.seed.nextFloat() * (this.height));
				mud_width = Math.floor(level.seed.nextFloat() * (this.width));
				if(mud_height < 3) {
					mud_height = 3;
				} else if(mud_height > this.height -2) {
					mud_height = this.height -2;
				}
				if(mud_width < 3) {
					mud_width = 3;
				} else if(mud_width > this.width -2) {
					mud_width = this.width -2;
				}
				mud_origin_y = this.origin.y + 1 + Math.floor(level.seed.nextFloat() * (this.height - mud_height -1));
				mud_origin_x = this.origin.x + 1 + Math.floor(level.seed.nextFloat() * (this.width - mud_width - 1)); 
				for(var i = 0; i < mud_height; i++) {
					for(var j = 0; j < mud_width; j++) {
						if(i === 0 && j === 0) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[1];
						} else if(i === 0 && j === mud_width-1) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[4];
						} else if(i === 0) {
							var rand = Math.floor(level.seed.nextFloat() * 2);
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[2 + rand];
						} else if(i < mud_height-1 && j === 0) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[5];
						} else if(i < mud_height-1 && j === mud_width-1) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[8];
						} else if(i === mud_height-1 && j === 0) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[9];
						} else if(i === mud_height-1 && j === mud_width-1) {
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[12];
						} else if(i === mud_height-1) {
							var rand = Math.floor(level.seed.nextFloat() * 2);
							level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[10 + rand];
						} else {
							var rand = Math.floor(level.seed.nextFloat() * 3);
							if(rand === 2) {
								level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[0];
							} else {
								level.overlayArray[mud_origin_y+i][mud_origin_x+j] = level.tiles.lightMudFloor[6 + rand];
							}
						}
					}
				}
			}
			break;
		}
		case EnumRoomtype.COBBLES: {
			this.setupOverlays = function() {
				for(var i = 0; i < this.height; i++) {
					for(var j = 0; j < this.width; j++) {
						var rand = Math.floor(level.seed.nextFloat() * 4);
						level.overlayArray[this.origin.y+i][this.origin.x+j] = level.tiles.cobbleFloor[rand];
					}
				}
				for(var i = 0; i < this.height; i++) {
					if(level.terrainArray[this.origin.y+i][this.origin.x-1] === 0) {
						level.overlayArray[this.origin.y+i][this.origin.x] = level.tiles.cobbleFloor[4];
					}
					if(level.terrainArray[this.origin.y+i][this.origin.x + this.width] === 0) {
						level.overlayArray[this.origin.y+i][this.origin.x + this.width-1] = level.tiles.cobbleFloor[5];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin.y-1][this.origin.x+i] === 0) {
						level.overlayArray[this.origin.y][this.origin.x+i] = level.tiles.cobbleFloor[6];
					}
					if(level.terrainArray[this.origin.y+this.height+1][this.origin.x+i] === 0) {
						level.overlayArray[this.origin.y+this.height][this.origin.x+i] = level.tiles.cobbleFloor[7];
					}
				}
			}
			break;
		}
		case EnumRoomtype.GREY_STONE: {
			this.setupOverlays = function() {
				for(var i = 0; i < this.height; i++) {
					for(var j = 0; j < this.width; j++) {
						var rand = Math.floor(level.seed.nextFloat() * 4);
						level.overlayArray[this.origin.y+i][this.origin.x+j] = level.tiles.greyCobbleFloor[rand];
					}
				}
				for(var i = 0; i < this.height; i++) {
					if(level.terrainArray[this.origin.y+i][this.origin.x-1] === 0) {
						level.overlayArray[this.origin.y+i][this.origin.x] = level.tiles.greyCobbleFloor[4];
					}
					if(level.terrainArray[this.origin.y+i][this.origin.x + this.width] === 0) {
						level.overlayArray[this.origin.y+i][this.origin.x + this.width-1] = level.tiles.greyCobbleFloor[5];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin.y-1][this.origin.x+i] === 0) {
						level.overlayArray[this.origin.y][this.origin.x+i] = level.tiles.greyCobbleFloor[6];
					}
					if(level.terrainArray[this.origin.y+this.height+1][this.origin.x+i] === 0) {
						level.overlayArray[this.origin.y+this.height][this.origin.x+i] = level.tiles.greyCobbleFloor[7];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin.y-1][this.origin.x+i] === 1) {
						if(level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 0 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 0) {
							level.overlayArray[this.origin.y-1][this.origin.x+i] = level.tiles.greyWallFace[3];
							level.overlayArray[this.origin.y-2][this.origin.x+i] = level.tiles.greyWallTop[3];
						} else if(i === 0 || (level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 0 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 1)) {
							level.overlayArray[this.origin.y-1][this.origin.x+i] = level.tiles.greyWallFace[1];
							level.overlayArray[this.origin.y-2][this.origin.x+i] = level.tiles.greyWallTop[1];
						} else if(i === this.width-1 || (level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 1 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 0)) {
							level.overlayArray[this.origin.y-1][this.origin.x+i] = level.tiles.greyWallFace[2];
							level.overlayArray[this.origin.y-2][this.origin.x+i] = level.tiles.greyWallTop[2];
						} else if(level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 1 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 1) {
							var rand = Math.floor(level.seed.nextFloat() * 2)
							if(rand < 1) {
								level.overlayArray[this.origin.y-1][this.origin.x+i] = level.tiles.greyWallFace[0];
							} else {
								var rand2 = Math.floor(level.seed.nextFloat() * level.tiles.greyWallDecor.length);
								level.overlayArray[this.origin.y-1][this.origin.x+i] = level.tiles.greyWallDecor[rand2];
							}
							level.overlayArray[this.origin.y-2][this.origin.x+i] = level.tiles.greyWallTop[0];
						}
					}
				}
			}
			break;
		}
		default: {
			this.setupOverlays = function() {};
			break;
		}
	}
	this.doors = [];
	this.min_size = 5;
	this.max_size = 10;
	this.origin = {};
	if(!origin_y) {
		this.origin.y = Math.floor(level.seed.nextFloat() * level.height);
	} else {
		this.origin.y = origin_y;
	}
	if(!origin_x) {
		this.origin.x = Math.floor(level.seed.nextFloat() * level.width);
	} else {
		this.origin.x = origin_x;
	}
	if(!width) {
		this.width = this.random_size(this.min_size, this.max_size);
	} else {
		this.width = width;
	}
	if(!height) {
		this.height = this.random_size(this.min_size, this.max_size);
	} else {
		this.height = height;
	}
	if(this.checkIfFits()) {
		this.draw();
		level.rooms.push(this);
	}
}
Room.prototype.draw = function() {
	if(!(this.origin.y + this.height > level.height - 1 || this.origin.x + this.width > level.width -1)) {
		for(var i = this.origin.y; i < this.origin.y + this.height; i++) {
			for(var j = this.origin.x; j < this.origin.x + this.width; j++) {
				level.terrainArray[i][j] = 0;
			}
		}
	}
}
Room.prototype.random_size = function(min, max) {
	return Math.floor(level.seed.nextFloat() * (max - min)) + min;
}
Room.prototype.checkIfFits = function() {
	for(var i = this.origin.y - 2; i < this.origin.y + this.height + 2; i++) {
		for(var j = this.origin.x - 1; j < this.origin.x + this.width + 1; j++) {
			if(level.terrainArray[i] === undefined || level.terrainArray[i][j] === undefined || level.terrainArray[i][j] === 0) {
				return false;
			} 
		}
	}
	return true;
}
Room.prototype.generateRoomContents = function() {
	var addContents = function() {
		console.log("Adding contents!");
		var rand = Math.floor(level.seed.nextFloat() * level.randomRoomFactor) + level.randomRoomIncrease;
		switch(rand) {
			case 0: case 1: case 2: case 3: {
				//	Empty room
				break; 
			} case 4: case 5: {
				//	Add 1 common creature
				var rand = Math.floor(level.seed.nextFloat() * level.commonCreatures.length);
				this.addCreature(level.commonCreatures[rand]);
				break;
			} case 6: {
				//	Add 1-2 of a common creature
				var rand = Math.floor(level.seed.nextFloat() * level.commonCreatures.length);
				var rand2 = Math.floor(level.seed.nextFloat() * 2) + 1;
				for(var i = 0; i < rand2; i++) {
					this.addCreature(level.commonCreatures[rand]);
				}
				break;
			} case 7: {
				//	Add 1 uncommon creature
				var rand = Math.floor(level.seed.nextFloat() * level.uncommonCreatures.length);
				this.addCreature(level.uncommonCreatures[rand]);
				break;
			} case 8: {
				//	Add 2-3 of one common creature and 1 common creature of another type
				var rand = Math.floor(level.seed.nextFloat() * level.commonCreatures.length);
				var rand2 = Math.floor(level.seed.nextFloat() * 2) + 2;
				for(var i = 0; i < rand2; i++) {
					this.addCreature(level.commonCreatures[rand]);
				}
				var rand3 = Math.floor(level.seed.nextFloat() * level.commonCreatures.length);
				this.addCreature(level.commonCreatures[rand3]);
				break;
			} case 9: {
				//	Add 1 uncommon creature and 1-3 different common creatures
				var rand = Math.floor(level.seed.nextFloat() * level.uncommonCreatures.length);
				this.addCreature(level.uncommonCreatures[rand]);
				var rand2 = Math.floor(level.seed.nextFloat() * 3) + 1;
				for(var i = 0; i < rand2; i++) {
					var rand3 = Math.floor(level.seed.nextFloat() * level.commonCreatures.length);
					this.addCreature(level.commonCreatures[rand3]);
				}
				break;
			} default: {
				break;
			}
		}
	}
	return addContents;
}
Room.prototype.addCreature = function(creature) {
	var tries = levelGen.vars.addCreatureAttempts;
	var retry = true;
	while(tries && retry) {
		var randY = this.origin.y + Math.floor(level.seed.nextFloat() * (this.height - 2)) + 1;
		var randX = this.origin.x + Math.floor(level.seed.nextFloat() * (this.width - 2)) + 1; 
		if(			
			//	Check that creatureArray is empty for this and all surrounding tiles...
			level.creatureArray[randY-1][randX-1] === 0 && level.creatureArray[randY-1][randX] === 0 && level.creatureArray[randY+1][randX+1] === 0 &&
			level.creatureArray[randY][randX-1] === 0 && level.creatureArray[randY][randX] === 0 && level.creatureArray[randY][randX+1] === 0 &&
			level.creatureArray[randY+1][randX-1] === 0 && level.creatureArray[randY+1][randX] === 0 && level.creatureArray[randY+1][randX+1] === 0 &&
			//	...and that obstacle array is clear...
			level.obstacleArray[randY][randX] === undefined &&
			//	...and that this is not the player's location...
			randX !== level.playerStart.x && randY !== level.playerStart.y
		) {			//	If so, add creature to level.creatureArray
			level.creatureArray[randY][randX] = creature;
			retry = false;
		}
		tries--;
	}
}

Decor = function(y, x, size_y, size_x, type) {
	this.grid = {
		x: x,
		y: y
	}
	this.sprite = {};
	this.sprite.size = {
		y: size_y,
		x: size_x
	}
	this.sprite.spriteSheet = level.img;
	this.position = {
		y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * size_y / 2),
		x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * size_x / 2)
	}
	this.vars = {};
	this.vars.drawOffset = {y:0,x:0};
	this.type = type;
	switch(this.type) {
		case EnumObstacle.COMMON_FLOATING_DECOR: {
			var rand = Math.floor(level.seed.nextFloat() * level.tiles.commonForegroundDecor.length);
			this.currentSprite = level.tiles.commonForegroundDecor[rand];
			break;
		}
		case EnumObstacle.RARE_FLOATING_DECOR: {
			var rand = Math.floor(level.seed.nextFloat() * level.tiles.rareForegroundDecor.length);
			this.currentSprite = level.tiles.rareForegroundDecor[rand];
			break;
		}
		default: {
			break;
		}
	}
	level.decor.push(this);
}

Obstacle = function(y, x, type, modifier) {
	this.type = type;
	this.grid = {
		x: x,
		y: y
	}
	this.sprite = {
		spriteSheet: level.img,
		size: {
			y: 1,
			x: 1
		}
	};
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
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.sprite.size.y = 2;
			this.interact = function() {
				this.open = true;
				this.animated = true;
				this.animTime = 100;
				this.animStart = performance.now();
				this.currentSprite = level.tiles.door[1 + this.doorType * 3];
				level.terrainArray[this.grid.y+1][this.grid.x] = 0;
				return this.animTime;
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
			this.currentSprite = level.tiles.obstacles[5];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE,
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
		case EnumObstacle.DINING_TABLE: {		//	Occupy 2 tiles on x axis * 4 on y in obstacleArray
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			this.currentSprite = level.tiles.obstacles[0];
			this.sprite.size.x = 3;		
			this.sprite.size.y = 4;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 8/16,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 0
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 4,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.vars.drawOffset = {y: TILE_SIZE * this.sprite.size.y / 2, x:0};
			this.position = {
				y: (this.grid.y * TILE_SIZE),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.DINING_CHAIR: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE,
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
				this.currentSprite = level.tiles.obstacles[1];
				this.offsetPosition();
			} else if(modifier === 'Left') {
				this.currentSprite = level.tiles.obstacles[2];
				this.offsetPosition();
			} else if(modifier === 'Facing') {
				this.currentSprite = level.tiles.obstacles[3];
				this.sprite.size.y = 2;
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE - TILE_SIZE / 2 + 6,
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
			this.currentSprite = level.tiles.obstacles[6];
			this.sprite.size.y = 1;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE,
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
			this.currentSprite = level.tiles.obstacles[7];
			this.sprite.size = {
				y: 2,
				x: 2
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 8,
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
			this.currentSprite = level.tiles.obstacles[4];
			this.sprite.size = {
				y: 2,
				x: 1
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 2,
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
			this.currentSprite = level.tiles.obstacles[8];
			this.sprite.size = {
				y: 2,
				x: 2
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + (TILE_SIZE * 2),
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
