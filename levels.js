//	Level generator
var levelGen = {
	vars: {
		roomAttempts: 1000,
		verticalConnectorSparseness: 10,
		horizontalConnectorSparseness: 25,
		corridorStraightness: 5,
		wallDecorFrequency: 7,				//	On average, wall decor is displayed 1 in every X times on permitted wall faces
		tallDecorRarity: 5,					//	On average, every 1 in X wall decorations is tall (spans more than 1 tile on Y axis)
		floorDecorFrequency: 30,			//	Base frequency of floor decor
		deadEndFactor: 0.5,					//	Fraction of dead ends that get filled in is 1 divided by this number
		addCreatureAttempts: 20,
		addObstacleAttempts: 20,
		minimumCreatureCount: 30,
		basicItemFrequency: 5
	},
	earlyBossRooms: [
		EnumCreature.URK_SHAMAN,
		EnumCreature.ZOMBI_MASTER,
		EnumCreature.CAMP_VAMP,
		EnumCreature.BLACK_KNIGHT
	],
	lateBossRooms: [
		EnumCreature.BLACK_WIZ,
		EnumCreature.RED_WIZ
	],
	finalBossRoom: 0,
	startingRoomTypes: [
		EnumRoomtype.BASIC_ROOM,
		EnumRoomtype.BASIC_ROOM,
		EnumRoomtype.BASIC_ROOM,
		EnumRoomtype.LIGHT_FLOOR_PATCH, 
		EnumRoomtype.MUD_POOL,
		EnumRoomtype.PUDDLE,
		EnumRoomtype.RED_COBBLES,
		EnumRoomtype.SQUARE_TILE,
		EnumRoomtype.PAVED_FLOOR,
		EnumRoomtype.PARQUET_FLOOR,
		EnumRoomtype.FLOORBOARDS,
		EnumRoomtype.BIG_SQUARE_TILE,
		EnumRoomtype.GREY_COBBLES,
		EnumRoomtype.GREY_SQUARE_TILE,
		EnumRoomtype.GREY_PAVED_FLOOR
	],
	startingCommonCreatures: [
		EnumCreature.GREEN_GOBLIN,
		EnumCreature.URK,
		EnumCreature.SKELTON,
		EnumCreature.URK_WARRIOR
	],
	startingUncommonCreatures: [
		EnumCreature.GREEN_SLUDGIE,
		EnumCreature.MINI_GHOST
	],
	startingRareCreatures: [
		EnumCreature.URK_VETERAN,
		EnumCreature.ZOMBI
	],
	startingCommonItems: [
		EnumItem.HEALTH_HEART,
		EnumItem.HEALTH_HEART,
		EnumItem.HEALTH_HEART,
		EnumItem.GREEN_MUSHROOM
	],
	startingSpecialItems: [
		EnumItem.BASIC_SWORD,
		EnumItem.BASIC_SWORD,
		EnumItem.BASIC_SWORD,
		EnumItem.CRYSTAL_KNIFE,
		EnumItem.WATER_KNIFE,
		EnumItem.CRYSTAL_HELMET,
		EnumItem.WATER_HELMET
	],
	randomRoomRange: 10,					//	Sets range of possible random room contents for generator
	randomRoomBaseline: 0				//	Set baseline room number to be used by generator - higher values start from 
}

var sessionVars = {};

levelGen.loadLevel = function(levelNumber) {
	level.levelNumber = levelNumber;
	level.bossDrop = function() {
		var exitKey = new Item(itemTemplates[EnumItem.EXIT_KEY], this.grid.x, this.grid.y);
		exitKey.position.x = this.position.x;
		exitKey.position.y = this.position.y + 2;
		exitKey.movement.speed = 1;
		exitKey.movement.direction = getPlayerDirection(this) + Math.PI;
	};
	level.img = document.getElementById('dungeon1Tiles');
	level.obstacleImg = document.getElementById('obstacleSprites');
	level.floorDecorImg = document.getElementById('floorDecorSprites');
	level.tiles = levelTilesets[0];
	level.obstacleTiles = obstacleTiles[0];
	level.floorDecorTiles = floorDecorTiles;
	level.creatureCount = 0;
	//	If the first level is being loaded, reset the session variables to starting values
	if(level.levelNumber === 1) {
		sessionVars = Object.create({});
		sessionVars.earlyBossRooms = [];
		// sessionVars.earlyBossRooms = levelGen.earlyBossRooms.slice();
		sessionVars.lateBossRooms = [];
		sessionVars.lateBossRooms = levelGen.lateBossRooms.slice();
		sessionVars.roomTypes = levelGen.startingRoomTypes.slice();
		sessionVars.commonCreatures = [];
		sessionVars.commonCreatures = levelGen.startingCommonCreatures.slice();
		sessionVars.uncommonCreatures = [];
		sessionVars.uncommonCreatures = levelGen.startingUncommonCreatures.slice();
		sessionVars.rareCreatures = [];
		sessionVars.rareCreatures = levelGen.startingRareCreatures.slice();
		sessionVars.commonItems = [];
		sessionVars.commonItems = levelGen.startingCommonItems.slice();
		sessionVars.specialItems = [];
		sessionVars.specialItems = levelGen.startingSpecialItems.slice();
		sessionVars.randomRoomRange = levelGen.randomRoomRange;
		sessionVars.randomRoomBaseline = levelGen.randomRoomBaseline;
		sessionVars.minimumCreatureCount = levelGen.vars.minimumCreatureCount;
		sessionVars.basicItemFrequency = levelGen.vars.basicItemFrequency;
	}
	level.commonCreatures = [];
	level.commonCreatures = sessionVars.commonCreatures.slice();
	level.uncommonCreatures = [];
	level.uncommonCreatures = sessionVars.uncommonCreatures.slice();
	level.rareCreatures = [];
	level.rareCreatures = sessionVars.rareCreatures.slice();
	level.commonItems = [];
	level.commonItems = sessionVars.commonItems.slice();
	level.specialItems = [];
	level.specialItems = sessionVars.specialItems.slice();
	level.randomRoomRange = sessionVars.randomRoomRange;
	level.randomRoomBaseline = sessionVars.randomRoomBaseline;

	//	Pick a random boss room from the earlyBossRoom array and delete it from the array
	if(sessionVars.earlyBossRooms.length > 0) {
		var rand = Math.floor(session.prng.nextFloat() * sessionVars.earlyBossRooms.length);
		level.bossRoomType = sessionVars.earlyBossRooms[rand];
		sessionVars.earlyBossRooms.splice(rand, 1);
		//	Add the boss room contents function relevant to type
		switch(level.bossRoomType) {
			case EnumCreature.BLACK_KNIGHT: {
				level.bossRoomNumber = 3;
				level.bossSizeMin = 9;
				level.bossSizeMax = 9;
				level.bossSizeRand = 0;
				sessionVars.rareCreatures.push(EnumCreature.BLACK_KNIGHT);
				sessionVars.specialItems.push(EnumItem.SHADOW_KNIFE);
				sessionVars.specialItems.push(EnumItem.SHADOW_HELMET);
				break;
			}
			case EnumCreature.URK_SHAMAN: {
				level.bossRoomNumber = 2;
				level.bossSizeMin = 8;
				level.bossSizeMax = 15;
				level.bossSizeRand = 6;
				sessionVars.uncommonCreatures.push(EnumCreature.URK_VETERAN);
				sessionVars.rareCreatures.push(EnumCreature.URK_SHAMAN);
				sessionVars.specialItems.push(EnumItem.FIRE_KNIFE);
				sessionVars.specialItems.push(EnumItem.FIRE_HELMET);
				break;
			}
			case EnumCreature.ZOMBI_MASTER: {
				level.bossRoomNumber = 1;
				level.bossSizeMin = 8;
				level.bossSizeMax = 12;
				level.bossSizeRand = 5;
				sessionVars.specialItems.push(EnumItem.ACID_KNIFE);
				sessionVars.specialItems.push(EnumItem.ACID_HELMET);
				break;
			}
			case EnumCreature.CAMP_VAMP: {
				level.bossRoomNumber = 0;
				level.bossSizeMin = 8;
				level.bossSizeMax = 11;
				level.bossSizeRand = 3;
				sessionVars.uncommonCreatures.push(EnumCreature.MUMI);
				sessionVars.rareCreatures.push(EnumCreature.CAMP_VAMP);
				sessionVars.specialItems.push(EnumItem.LIGHTNING_KNIFE);
				sessionVars.specialItems.push(EnumItem.LIGHTNING_HELMET);
				break;
			}
			default: {
				console.log("Should never be hit!");
				debugger;
				break;
			}
		}
	} else {
		var rand = Math.floor(session.prng.nextFloat() * sessionVars.lateBossRooms.length);
		// level.bossRoomType = sessionVars.lateBossRooms[rand];
		// sessionVars.lateBossRooms.splice(rand, 1);
		level.bossRoomType = EnumCreature.BLACK_WIZ;
		//	Add the boss room contents function relevant to type
		switch(level.bossRoomType) {
			case EnumCreature.BLACK_WIZ: {
				level.bossRoomNumber = 4;
				level.bossSizeMin = 11;
				level.bossSizeMax = 11;
				level.bossSizeRand = 0;
				sessionVars.rareCreatures.push(EnumCreature.BLACK_WIZ);
				sessionVars.specialItems.push(EnumItem.SHADOW_SWORD);
				sessionVars.specialItems.push(EnumItem.LIGHTNING_SWORD);
				sessionVars.specialItems.push(EnumItem.ACID_SWORD);
				break;
			}
			case EnumCreature.RED_WIZ: {
				level.bossRoomNumber = 5;
				level.bossSizeMin = 20;
				level.bossSizeMax = 20;
				level.bossSizeRand = 3;
				sessionVars.rareCreatures.push(EnumCreature.RED_WIZ);
				sessionVars.specialItems.push(EnumItem.FIRE_SWORD);
				sessionVars.specialItems.push(EnumItem.WATER_SWORD);
				sessionVars.specialItems.push(EnumItem.CRYSTAL_SWORD);
				break;
			}
			default: {
				console.log("Should never be hit!");
				debugger;
				break;
			}
		}
	}
	//	Copy session roomtypes to level roomtypes
	level.roomTypes = sessionVars.roomTypes.slice();
	//	Add boss room setup function
	level.bossRoomContents = function() {
		level.playerStart = {y: this.origin.y, x: this.origin.x};
		// levelGen.bossRooms[level.bossRoomNumber](this);
		levelGen.bossRooms[4](this);
	};
	level.exitRoomContents = function() {
		// level.playerStart = {y: this.origin.y, x: this.origin.x};
		new Obstacle(EnumObstacle.EXIT_STAIRS, null, this.origin.y + 1, this.origin.x + 1);
	};
	//	Default startRoom contents function
	level.startRoomContents = function() {
		console.log("Adding start room contents");
	};
	//	Switch level number to set up level variables
	switch(levelNumber) {
		case 1: {
			level.height = 70;
			level.width = 70;
			var rand = Math.floor(session.prng.nextFloat() * 2);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else {
				level.specialItemCount = 1;
			}
			// level.specialItemCount = 10;
			sessionVars.uncommonCreatures.push(EnumCreature.SNEAKY_SKELTON);
			level.startRoomContents = function() {
				console.log("Adding start room contents");
			};
			break;
		}
		case 2: {
			level.height = 70;
			level.width = 85;
			sessionVars.minimumCreatureCount = 40;
			sessionVars.uncommonCreatures.push(EnumCreature.KOB);
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else if(rand < 2) {
				level.specialItemCount = 1;
			} else {
				level.specialItemCount = 2;
			}
			break;
		}
		case 3: {
			level.height = 85;
			level.width = 85;
			sessionVars.minimumCreatureCount = 45;
			sessionVars.uncommonCreatures.push(EnumCreature.BLUE_SQUARK);
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else if(rand < 2) {
				level.specialItemCount = 1;
			} else {
				level.specialItemCount = 2;
			}
			break;
		}
		case 4: {
			level.height = 100;
			level.width = 85;
			sessionVars.minimumCreatureCount = 50;
			sessionVars.uncommonCreatures.push(EnumCreature.OGR);
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else if(rand < 2) {
				level.specialItemCount = 1;
			} else {
				level.specialItemCount = 2;
			}
			break;
		}
		case 5: {
			level.height = 70;
			level.width = 100;
			sessionVars.minimumCreatureCount = 55;
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else if(rand < 2) {
				level.specialItemCount = 1;
			} else {
				level.specialItemCount = 2;
			}
			break;
		}
		case 5: {
			level.height = 90;
			level.width = 90;
			sessionVars.minimumCreatureCount = 60;
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				level.specialItemCount = 0;
			} else if(rand < 2) {
				level.specialItemCount = 1;
			} else {
				level.specialItemCount = 2;
			}
			break;
		}
		default: {
			console.log("********** should never be hit! ************");
			level.height = 100;
			level.width = 100;
			break;
		}
	}
	//	Generate level and return it to game
	this.generateLevel();
	return level;
}

levelGen.generateLevel = function() {
	//	Generate layouts and discard if invalid until a valid one is created
	while(!level.validLevel) {
		this.fillOutMap();
	}

	//	Add basic tileset overlays - solid wall, basic floor, undecorated wall faces, dirt at base of walls
	this.addBasicOverlays();

	//	Run each room's own tileset overlay
	level.rooms.forEach(function(room) {
		room.setupOverlays();
	});

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
	while(level.specialItemCount > 0) {
		this.addSpecialItem();
	}
},

levelGen.fillOutMap = function() {
	this.clearLevel();
	this.setupInitialGrid(level.height, level.width);

	//	Set up special rooms
	this.setupEssentialRooms();

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
		var rand = Math.floor(session.prng.nextFloat() * 10);
		var doorDirections = [];
		if(rand < 8) {
			doors = 1;
		} else {
			doors = 2;
		}
		while(doors && tries) {
			var direction = Math.floor(session.prng.nextFloat() * 2);
			if(!doorDirections.includes(direction)) {
				switch(direction) {
					case 0: {						//	Up
						var x = Math.floor(session.prng.nextFloat() * room.width);
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
						var x = Math.floor(session.prng.nextFloat() * room.width);
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
						var y = Math.floor(session.prng.nextFloat() * room.height);
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
						var y = Math.floor(session.prng.nextFloat() * room.height);
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
					var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.horizontalConnectorSparseness);
					if(rand < 1) {
						level.terrainArray[i][j] = 0;
					}
				} else if(level.terrainArray[i-1][j] === 0 && level.terrainArray[i + 2][j] === 0 &&		//	...or if the tiles above and *2* below are open...
					level.terrainArray[i][j-1] !== 0 && level.terrainArray[i][j-1] !== 0				//	...and the tiles to left and right are not open...
				) { 	
					var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.verticalConnectorSparseness);
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
	if(level.bossStart.y === undefined) {
		debugger;
	}
	if(level.fillArray[level.bossStart.y][level.bossStart.x] !== 2) {
		// console.log("Invalid level - no connection to boss room, clearing...");
		level.validLevel = false;
	} else if(level.fillArray[level.exit.y][level.exit.x] !== 2) {
		// console.log("Invalid level - no connection to exit room, clearing...");
		level.validLevel = false;
	} else if(level.rooms.length < 16) {
		console.log("Invalid level - not enough rooms...");
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
};

levelGen.clearLevel = function() {
	level.terrainArray.length = 0;
	level.obstacleArray.length = 0;
	level.itemArray.length = 0;
	level.fillArray.length = 0;
	level.overlayArray.length = 0;
	level.rooms.length = 0;
	level.obstacles.length = 0;
	level.corridors.length = 0;
};

levelGen.setupInitialGrid = function() {
	for(var i = 0; i < level.height; i++) {
		level.terrainArray[i] = [];
		level.obstacleArray[i] = [];
		level.overlayArray[i] = [];
		level.creatureArray[i] = [];
		level.itemArray[i] = [];
		for(var j = 0; j < level.width; j++) {
			level.terrainArray[i][j] = 1;								//	1 = regular impassable wall tile
			level.creatureArray[i][j] = 0;								//	0 = no creature

		}
	}
};

levelGen.setupEssentialRooms = function() {
	var startRand = Math.floor(session.prng.nextFloat() * 5);
	var startSizeX = 8 - startRand; 
	var startSizeY = 4 + startRand;
	var bossRand = Math.floor(session.prng.nextFloat() * level.bossSizeRand);
	var bossSizeX = level.bossSizeMin + bossRand;
	var bossSizeY = level.bossSizeMax - bossRand; 
	var exitRand = Math.floor(session.prng.nextFloat() * 4);
	var exitSizeX = 8 - startRand; 
	var exitSizeY = 4 + startRand;
	var startPosX, startPosY, bossPosX, bossPosY, exitPosX, exitPosY;
	var startCorner = Math.floor(session.prng.nextFloat() * 4);
	var rand = Math.floor(session.prng.nextFloat() * 2);
	switch(startCorner) {
		case 0: {
			startPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
			startPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			bossPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - bossSizeY -2;
			bossPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - bossSizeX -2;
			if(rand) {
				exitPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
				exitPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - exitSizeX -2;
			} else {
				exitPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - exitSizeY -2;
				exitPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			}
			break;
		}
		case 1: {
			startPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - startSizeY -2;
			startPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - startSizeX -2;
			bossPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
			bossPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			if(rand) {
				exitPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
				exitPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - exitSizeX -2;
			} else {
				exitPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - exitSizeY -2;
				exitPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			}
			break;
		}
		case 2: {
			startPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - startSizeY -2;
			startPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			bossPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
			bossPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - bossSizeX -2;
			if(rand) {
				exitPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
				exitPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			} else {
				exitPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - exitSizeY -2;
				exitPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - exitSizeX -2;
			}
			break;
		}
		case 3: {
			startPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
			startPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - startSizeX -2;
			bossPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - bossSizeY -2;
			bossPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			if(rand) {
				exitPosY = Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3 +2);
				exitPosX = Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3 +2);
			} else {
				exitPosY = level.terrainArray.length - (Math.floor(session.prng.nextFloat() * level.terrainArray.length * 0.3)) - exitSizeY -2;
				exitPosX = level.terrainArray[0].length - (Math.floor(session.prng.nextFloat() * level.terrainArray[0].length * 0.3)) - exitSizeX -2;
			}
			break;
		}
		default: {
			break;
		}
	}
	level.playerStart.y = startPosY + 1;
	level.playerStart.x = startPosX + 1;
	level.bossStart.y = bossPosY + 1;
	level.bossStart.x = bossPosX + 1;
	level.exit.y = exitPosY + 1;
	level.exit.x = exitPosX + 1;
	var startRoom = new Room(startPosY, startPosX, startSizeY, startSizeX, 'start', level.startRoomContents);
	var bossRoom = new Room(bossPosY, bossPosX, bossSizeY, bossSizeX, 'boss', level.bossRoomContents);
	var exitRoom = new Room(exitPosY, exitPosX, exitSizeY, exitSizeX, 'exit', level.exitRoomContents);
	level.bossRoom = {
		origin: {
			y: bossPosY,
			x: bossPosX
		},
		height: bossSizeY,
		width: bossSizeX
	},
	level.startRoom = {
		origin: {
			y: startPosY,
			x: startPosX
		},
		height: startSizeY,
		width: startSizeX
	}
};

levelGen.addBasicOverlays = function() {
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
	//	Then iterate terrain array and add wall tops, dirt at base of walls
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
			//	...or if tile is floor with no existing decor (add dirt at base of wall faces)...
			else if(level.terrainArray[i][j] === 0  && level.overlayArray[i][j] === level.tiles.floor) {
				//	...plus tile above is wall face...
				if(	level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j-1] !== undefined && level.terrainArray[i-1][j+1] !== undefined && 
					level.terrainArray[i-1][j] === 1 && level.terrainArray[i][j-1] === 0 && level.terrainArray[i][j+1] === 0) 
				{
					var rand = Math.floor(session.prng.nextFloat() * 3);
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
					var rand = Math.floor(session.prng.nextFloat() * 3) + 3;
					level.overlayArray[i][j] = level.tiles.wallBtm[rand];
				//	...or tile to right is wall face...
				} else if(
					level.terrainArray[i-1] !== undefined && level.terrainArray[i-1][j+1] !== undefined && level.terrainArray[i-1][j+1] === 1 && level.terrainArray[i][j+1] === 1) 
				{
					var rand = Math.floor(session.prng.nextFloat() * 3) + 6;
					level.overlayArray[i][j] = level.tiles.wallBtm[rand];
				}
			}
		}
	}
};

	//	Add a random number of connectors to each corridor (not currently used)
levelGen.addCorridorConnectors = function() {
	level.corridors.forEach(function(corridor) {
		var crossConnectors = Math.floor(session.prng.nextFloat() * corridor.tiles.length / 5) + 1;
		var tries = 100;
		while(crossConnectors && tries) {
			var rand = Math.floor(session.prng.nextFloat() * corridor.tiles.length);
			var direction = Math.floor(session.prng.nextFloat() * 4);
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
};

levelGen.addDoors = function() {
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
					var door = new Obstacle(EnumObstacle.DOOR, null, room.origin.y-2, i);
				}
			}
		}
	});
};

levelGen.fillInUnreaachableAreas = function() {
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
};

levelGen.reduceDeadEnds = function() {
	for(var i = 1; i < level.terrainArray.length -1; i++) {
		for(var j = 1; j < level.terrainArray[0].length -1; j++) {
			if(level.terrainArray[i][j] === 0) {
				var exits = this.getExits(i, j);
				if(exits.length === 1) {
					var fillIn = 0;					
					// var fillIn = Math.floor(session.prng.nextFloat() * levelGen.vars.deadEndFactor);
					if(fillIn < 1) {
						this.fillTunnel(i, j);
					}
				}
			}
		}
	}
};

//	Returns array of open terrain grid squares directly adjacent to given co-ordinates (ie the squares above, below, left & right)
levelGen.getExits = function(y, x) {
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
};

//	If terrain grid square at passed co-ordinates has just a single exit (ie is a dead end square), fill it in & convert to solid terrain
levelGen.fillTunnel = function(y, x) {
	var exits = this.getExits(y, x);
	if(exits.length === 1) {
		level.terrainArray[y][x] = 1;
		this.fillTunnel(exits[0].y, exits[0].x);
	}
};

//	Pass an array to fill, starting co-ordinates, the value to be overwritten and the value to overwrite it with - will fill in the contiguous area from starting co-ords
levelGen.fill = function(arr, startY, startX, fillValue, fillWith) {
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
};

levelGen.checkForCorridorStart = function(y, x) {
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
};

levelGen.addRandomCreatures = function() {
	console.log(level.creatureCount + " creatures - minimum is " + sessionVars.minimumCreatureCount);
	while(level.creatureCount < sessionVars.minimumCreatureCount) {
		//	Add extra creatures in ratio 4 common to 1 uncommon
		var rarity = Math.floor(session.prng.nextFloat() * 5);
		if(rarity < 1) {
			var rand = Math.floor(session.prng.nextFloat() * sessionVars.uncommonCreatures.length);
			var creature = sessionVars.uncommonCreatures[rand];
		} else {
			var rand = Math.floor(session.prng.nextFloat() * sessionVars.commonCreatures.length);
			var creature = sessionVars.commonCreatures[rand];
		}
		var retry = true;
		while(retry) {
			var randY = Math.floor(session.prng.nextFloat() * (level.terrainArray.length));
			var randX = Math.floor(session.prng.nextFloat() * (level.terrainArray[0].length));
			if(		
				//	Check that creature array and obstacle array are clear, and that position is not in the player start room
				level.terrainArray[randY][randX] === 0 && level.creatureArray[randY][randX] === 0 && level.obstacleArray[randY][randX] === undefined &&
				!(randY >= level.startRoom.origin.y && randY <= level.startRoom.origin.y + level.startRoom.height &&
				randX >= level.startRoom.origin.x && randX <= level.startRoom.origin.x + level.startRoom.width)
			) {			//	If so, add creature to level.creatureArray
				level.creatureArray[randY][randX] = creature;
				level.creatureCount++;
				retry = false;
				console.log("Adding extra creature...");
			}
		}
	}
};

levelGen.addSpecialItem = function(room) {
	var item = Math.floor(session.prng.nextFloat() * level.specialItems.length);
	var retry = true;
	var tries = levelGen.vars.addCreatureAttempts;
	while(tries && retry) {
		if(room) {
			var randY = Math.floor(session.prng.nextFloat() * (room.height));
			var randX = Math.floor(session.prng.nextFloat() * (room.width));
			//	Check that terrain, item and obstacle arrays are clear
			if(
				level.terrainArray[room.origin.y + randY][room.origin.x + randX] === 0 && level.obstacleArray[room.origin.y + randY][room.origin.x + randX] === undefined &&
				level.itemArray[room.origin.y + randY][room.origin.x + randX] === undefined
			) {
				level.itemArray[room.origin.y + randY][room.origin.x + randX] = level.specialItems[item];
				console.log("Adding special item! " + item);
				level.specialItemCount--;
				retry = false;
			}
			tries--;
		} else {
			var randY = Math.floor(session.prng.nextFloat() * (level.terrainArray.length));
			var randX = Math.floor(session.prng.nextFloat() * (level.terrainArray[0].length));
			if(		
				//	Check that terrain, item and obstacle arrays are clear, and that position is not within 5 tiles of the player start room
				level.terrainArray[randY][randX] === 0 && level.obstacleArray[randY][randX] === undefined &&
				level.itemArray[randY][randX] === undefined &&
				!(randY >= level.startRoom.origin.y - 5 && randY <= level.startRoom.origin.y + level.startRoom.height + 5 &&
				randX >= level.startRoom.origin.x - 5 && randX <= level.startRoom.origin.x + level.startRoom.width + 5)
			) {
				level.itemArray[randY][randX] = level.specialItems[item];
				console.log("Adding special item! " + item);
				level.specialItemCount--;
				retry = false;
			}
			tries--;
		}
	}
}

//	Boss rooms
levelGen.bossRooms = [

	//	Camp Vamp's dining room
	function(room) {
		level.boss = EnumCreature.CAMP_VAMP;
		console.log("Adding Camp Vamp boss room");
		room.removeExistingContents();

		//	Add special obstacles - dining table & chairs - ***** needs a min room height of 8 and width of 6
		var rand = Math.floor(session.prng.nextFloat() * (room.height - 6 - 2));			//	6: total height of table & chairs, 2: to ensure a space either side
		var diningRoom_y = room.origin.y + 1 + rand;
		var rand2 = Math.floor(session.prng.nextFloat() * (room.width - 4 - 2));			//	4: total width of table & chairs, 2: to ensure a space either side
		var diningRoom_x = room.origin.x + 1 + rand2;

		new Obstacle(EnumObstacle.DINING_TABLE, null, diningRoom_y + 1, diningRoom_x + 1);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 0, diningRoom_x + 2, 3);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 1, diningRoom_x + 0, 1);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 3, diningRoom_x + 0, 1);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 4, diningRoom_x + 0, 1);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 2, diningRoom_x + 3, 2);
		new Obstacle(EnumObstacle.DINING_CHAIR, null, diningRoom_y + 4, diningRoom_x + 3, 2);
		new Obstacle(EnumObstacle.COFFIN, room);

		//	Add tiled floor and decor
		room.addFloor(level.tiles.tiledFloor, null, null, true);
		room.addFloorDecor(1, [EnumDecortype.BONES, EnumDecortype.SPLATS, EnumDecortype.FILTH]);

		//	Add columns on facing wall spaces
		for(var i = room.origin.x; i < room.origin.x + room.width; i++) {
			if(level.terrainArray[room.origin.y-2][i] === 1 && level.overlayArray[room.origin.y-2][i-1] !== level.tiles.wallDecorTall[1] &&
				level.obstacleArray[room.origin.y-2][i] === undefined && level.obstacleArray[room.origin.y-1][i] === undefined
			) {
				level.overlayArray[room.origin.y-2][i] = level.tiles.wallDecorTall[1];
				level.overlayArray[room.origin.y-1][i] = level.tiles.tiledFloor[3];
				level.overlayArray[room.origin.y][i] = level.tiles.tiledFloor[4];
			} else if(level.terrainArray[room.origin.y-2][i] === 1 && level.overlayArray[room.origin.y-2][i-1] === level.tiles.wallDecorTall[1] &&
				level.obstacleArray[room.origin.y-2][i] === undefined && level.obstacleArray[room.origin.y-1][i] === undefined
			) {
				level.overlayArray[room.origin.y-1][i] = level.tiles.wallFace[0];
			}
		}

		// Add boss and other creatures
		room.addCreature(level.boss);
		var extraCreatures = 4 + level.levelNumber;
		var rand = Math.floor(session.prng.nextFloat() * 2);
		if(rand < 1) {
			room.addCreature(EnumCreature.MUMI);
			extraCreatures -= 2;
		}
		for(var i = 0; i < extraCreatures; i++) {
			room.addCreature(EnumCreature.SKELTON);
		}	
	},

	//	Zombi Master's lair
	function(room) {
		level.boss = EnumCreature.ZOMBI_MASTER;
		console.log("Adding Zombi Master boss room");
		room.removeExistingContents();

		//	Add special obstacles 
		new Obstacle(EnumObstacle.ZOMBI_MASTER_DESK, room);
		var rand = Math.floor(session.prng.nextFloat() * 10);
		if(rand < 2) {
			new Obstacle(EnumObstacle.BLOOD_BUCKET, room);
			new Obstacle(EnumObstacle.BLOOD_BUCKET, room);
			new Obstacle(EnumObstacle.ZOMBI_HEAD, room);
		} else if(rand < 7) {
			new Obstacle(EnumObstacle.BLOOD_BUCKET, room);
			new Obstacle(EnumObstacle.ZOMBI_HEAD, room);
		} else {
			new Obstacle(EnumObstacle.BLOOD_BUCKET, room);
		}

		//	Add room wall and floor decor
		room.addWallDecor(false, 2);
		var rand2 = Math.floor(session.prng.nextFloat() * 2);
		if(rand2 < 1) {
			room.addFloor(level.tiles.redCobbleFloor, true);
		} else {
			room.addFloor(level.tiles.floorboards);
		}
		room.addFloorDecor(5);

		// Add boss and other creatures
		room.addCreature(level.boss);
		var zombis = 5 + level.levelNumber;
		for(var i = 0; i < zombis; i++) {
			room.addCreature(EnumCreature.ZOMBI);
		}	
	},
	
	//	Urk Nest
	function(room) {
		level.boss = EnumCreature.URK_SHAMAN;
		console.log("Adding Urk Nest boss room");
		room.removeExistingContents();

		//	Add special obstacles
		var rand = Math.floor(session.prng.nextFloat() * 3);
		if(rand < 2) {
			new Obstacle(EnumObstacle.MEAT_RACK, room);
		}
		var rand = Math.floor(session.prng.nextFloat() * 3);
		if(rand < 2) {
			new Obstacle(EnumObstacle.SPIT, room);
		}
		//	Add room floor and decor
		room.addFloorPatch(EnumFloorpatch.MUD_POOL);
		room.addStoreRoomObstacles(5);
		room.addFloorDecor(5);

		// Add boss and other creatures
		room.addCreature(level.boss);
		var extraToughCreatures = 1 + level.levelNumber;
		var extraWeakCreatures = 3;
		for(var i = 0; i < extraToughCreatures; i++) {
			var rand = Math.floor(session.prng.nextFloat() * 2);
			if(rand < 1) {
				room.addCreature(EnumCreature.HULKING_URK);
			} else {
				room.addCreature(EnumCreature.URK_VETERAN);
			}
		}
		for(var i = 0; i < extraWeakCreatures; i++) {
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 1) {
				room.addCreature(EnumCreature.URK);
			} else if(rand < 2) {
				room.addCreature(EnumCreature.URK_WARRIOR);
			} else {
				room.addCreature(EnumCreature.GREEN_GOBLIN);
			}
		}
	},	

	//	Black Knight
	function(room) {
		level.boss = EnumCreature.BLACK_KNIGHT;
		console.log("Adding Black Knight boss room");
		room.removeExistingContents();

		//	Add special obstacles
		var rand = Math.floor(session.prng.nextFloat() * (room.height - 9));				//	7: total height of statues, 2: to ensure a space either side
		var statueRoom_y = room.origin.y + 1 + rand;
		var rand2 = Math.floor(session.prng.nextFloat() * (room.width - 9));				//	7: total width of statues, 2: to ensure a space either side
		var statueRoom_x = room.origin.x + 1 + rand2;

		new Obstacle(EnumObstacle.BLACK_KNIGHT_STATUE, null, statueRoom_y + 0, statueRoom_x + 3, true);
		new Obstacle(EnumObstacle.WARRIOR_STATUE, null, statueRoom_y + 2, statueRoom_x + 2, 1, true);
		new Obstacle(EnumObstacle.WARRIOR_STATUE, null, statueRoom_y + 2, statueRoom_x + 4, 2, true);
		new Obstacle(EnumObstacle.DRAGON_STATUE, null, statueRoom_y + 4, statueRoom_x + 1, 1, true);
		new Obstacle(EnumObstacle.DRAGON_STATUE, null, statueRoom_y + 4, statueRoom_x + 5, 2, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y - 1, statueRoom_x + 0, 1, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y + 2, statueRoom_x + 0, 1, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y + 5, statueRoom_x + 0, 1, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y - 1, statueRoom_x + 6, 1, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y + 2, statueRoom_x + 6, 1, true);
		new Obstacle(EnumObstacle.STONE_PILLAR, null, statueRoom_y + 5, statueRoom_x + 6, 1, true);
		var carpet1 = new Decor(uniqueFloorDecor[0][0].y, uniqueFloorDecor[0][0].x, statueRoom_y + 3, statueRoom_x + 3, 0, 0);
		var carpet2 = new Decor(uniqueFloorDecor[0][1].y, uniqueFloorDecor[0][1].x, statueRoom_y + 4, statueRoom_x + 3, 0, 0);
		var carpet3 = new Decor(uniqueFloorDecor[0][2].y, uniqueFloorDecor[0][2].x, statueRoom_y + 5, statueRoom_x + 3, 0, 0);

		//	Add room floor and decor
		var rand = Math.floor(session.prng.nextFloat() * 3);
		if(rand < 1) {
			room.addFloor(level.tiles.squareTileFloor, null, null, true);
		} else if(rand < 2) {
			room.addFloor(level.tiles.pavedFloor);
		} else {
			room.addFloor(level.tiles.parquetFloor, null, null, true);
		}
		room.addWallDecor(false, 4);
		room.addFloorDecor(2);
		// Add boss and other creatures
		room.addCreature(level.boss);
	},	

	//	Black Wiz
	function(room) {
		level.boss = EnumCreature.BLACK_WIZ;
		console.log("Adding Black Wiz boss room");
		room.removeExistingContents();

		//	Add pentagram in centre of floor
		var pentagram_y = room.origin.y + Math.floor(room.height / 2) - 1;
		var pentagram_x = room.origin.x +Math.floor(room.width / 2) - 2;
		for(var i = 0; i < 3; i++) {
			for(var j = 0; j < 4; j++) {
				new Decor(uniqueFloorDecor[1][(4*i)+j].y, uniqueFloorDecor[1][(4*i)+j].x, pentagram_y + i, pentagram_x + j, 0, 0);
			}
		}

		//	Add desk and special obstacles
		var desk_y, shelves_y;
		var rand = Math.floor(session.prng.nextFloat() * 1) + 3;
		if(rand < 1) {			//	Desk top left
			shelves_y = pentagram_y + 4;
			desk_y = room.origin.y + 1;
			new Obstacle(EnumObstacle.WIZ_DESK, room, desk_y, room.origin.x + 2);
			new Obstacle(EnumObstacle.STOOL, room, desk_y + 2, room.origin.x + 3);
			new Obstacle(EnumObstacle.BLUE_SPHERE, room, desk_y + 1, room.origin.x + 7);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y + 5, room.origin.x + 1);
			new Obstacle(EnumObstacle.BARREL, room, desk_y + 3, room.origin.x + 9);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y + 5, room.origin.x + 8);
			new Obstacle(EnumObstacle.SKULL_SPIKE, room, desk_y + 3, room.origin.x + 2);
		} else if(rand < 2) {	//	Desk top right
			shelves_y = pentagram_y + 4;
			desk_y = room.origin.y + 1;
			new Obstacle(EnumObstacle.WIZ_DESK, room, desk_y, room.origin.x + 6);
			new Obstacle(EnumObstacle.STOOL, room, desk_y + 2, room.origin.x + 7);
			new Obstacle(EnumObstacle.BLUE_SPHERE, room, desk_y + 4, room.origin.x + 1);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y, room.origin.x + 1);
			new Obstacle(EnumObstacle.SACK, room, desk_y + 4, room.origin.x + 8);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y + 1, room.origin.x + 5);
			new Obstacle(EnumObstacle.SKULL_SPIKE, room, desk_y, room.origin.x + 3);
		} else if(rand < 3) {	//	Desk bottom left
			desk_y = pentagram_y + 3;
			shelves_y = room.origin.y + 1;
			new Obstacle(EnumObstacle.WIZ_DESK, room, desk_y, room.origin.x + 2);
			new Obstacle(EnumObstacle.STOOL, room, desk_y + 2, room.origin.x + 3);
			new Obstacle(EnumObstacle.BLUE_SPHERE, room, desk_y + 1, room.origin.x + 7);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y -2, room.origin.x + 1);
			new Obstacle(EnumObstacle.BARRELSx2, room, desk_y -3, room.origin.x + 8);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y + 1, room.origin.x + 5);
			new Obstacle(EnumObstacle.SKULL_SPIKE, room, desk_y -1, room.origin.x + 8);
		} else {				//	Desk bottom right
			desk_y = pentagram_y + 3;
			shelves_y = room.origin.y + 1;
			new Obstacle(EnumObstacle.WIZ_DESK, room, desk_y, room.origin.x + 6);
			new Obstacle(EnumObstacle.STOOL, room, desk_y + 2, room.origin.x + 7);
			new Obstacle(EnumObstacle.BLUE_SPHERE, room, desk_y, room.origin.x + 1);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y - 3, room.origin.x + 2);
			new Obstacle(EnumObstacle.SACKx2, room, desk_y -2, room.origin.x + 9);
			new Obstacle(EnumObstacle.CANDLES, room, desk_y + 1, room.origin.x + 5);
			new Obstacle(EnumObstacle.SKULL_SPIKE, room, desk_y, room.origin.x + 3);
		}
		//	Add shelves
		new Obstacle(EnumObstacle.BOOKCASE_WIDE, room, shelves_y, room.origin.x + 1);
		new Obstacle(EnumObstacle.NARROW_SHELVES, room, shelves_y, room.origin.x + 3);
		new Obstacle(EnumObstacle.BOOKCASE, room, shelves_y, room.origin.x + 5);
		new Obstacle(EnumObstacle.WIDE_SHELVES, room, shelves_y, room.origin.x + 7);
		new Obstacle(EnumObstacle.NARROW_SHELVES, room, shelves_y, room.origin.x + 9);

		//	Add room floor and decor
		var rand = Math.floor(session.prng.nextFloat() * 3);
		if(rand < 1) {
			room.addFloor(level.tiles.squareTileFloor, null, null, true);
		} else if(rand < 2) {
			room.addFloor(level.tiles.pavedFloor);
		} else {
			room.addFloor(level.tiles.floorboards);
		}
		room.addWallDecor(false, 4);
		room.addFloorDecor(2, [EnumDecortype.SPLATS, EnumDecortype.BONES, EnumDecortype.MISC] );

		// Add boss and other creatures
		room.addCreature(level.boss);
	}
];

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
			var turn = Math.floor(session.prng.nextFloat() * levelGen.vars.corridorStraightness);						//	Probability weighting of continuing to dig in straight line if possible
			if(turn < 1) {
				var digDir = Math.floor(session.prng.nextFloat() * this.validDirections.length);
				this.digDirection = this.validDirections[digDir];
			}
		} else {
			var digDir = Math.floor(session.prng.nextFloat() * this.validDirections.length);
			this.digDirection = this.validDirections[digDir];
		}
	}
}

Corridor.prototype.checkDirection = function(direction) {
	if(direction === 'right') {
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
		this.type = level.roomTypes[Math.floor(session.prng.nextFloat() * level.roomTypes.length)];
	}
	if(addContents) {
		this.addContents = addContents.bind(this);
	} else {
		this.addContents = function() {};
		this.addContents = this.generateRoomContents();
	}
	//	Set up overlays (floor, wall & decor) by room type
	switch(this.type) {
		case EnumRoomtype.BASIC_ROOM: {
			this.setupOverlays = function() {
				this.addWallDecor(true);
				this.addObstacles(EnumObstacletype.BASIC_ROOM);
			}
			break;
		}
		case EnumRoomtype.LIGHT_FLOOR_PATCH: {
			this.setupOverlays = function() {
				this.addFloorPatch(EnumFloorpatch.LIGHT_RED);
				this.addWallDecor(true);
				this.addObstacles(EnumObstacletype.BASIC_ROOM);
			}
			break;
		}
		case EnumRoomtype.MUD_POOL: {
			this.setupOverlays = function() {
				this.addFloorPatch(EnumFloorpatch.MUD_POOL);
				this.addWallDecor(true);
				this.addObstacles(EnumObstacletype.BASIC_ROOM);
			}
			break;
		}
		case EnumRoomtype.PUDDLE: {
			this.setupOverlays = function() {
				this.addFloorPatch(EnumFloorpatch.PUDDLE);
				this.addWallDecor(true);
				this.addObstacles(EnumObstacletype.PUDDLE);
			}
			break;
		}
		case EnumRoomtype.RED_COBBLES: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.redCobbleFloor, true);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.STONE_FLOOR);
			}
			break;
		}
		case EnumRoomtype.GREY_COBBLES: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.greyCobbleFloor, true);
				this.replaceWalls(level.tiles.greyWall, 4);
				this.addObstacles(EnumObstacletype.STONE_FLOOR);
			}
			break;
		}
		case EnumRoomtype.SQUARE_TILE: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.squareTileFloor, null, null, true);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.PARQUET_FLOOR: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.parquetFloor, null, null, true);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.FLOORBOARDS: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.floorboards);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.PAVED_FLOOR: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.pavedFloor);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.GREY_PAVED_FLOOR: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.greyPavedFloor);
				this.replaceWalls(level.tiles.greyWall, 4);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.GREY_SQUARE_TILE: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.greySquareTileFloor, null, null, true);
				this.replaceWalls(level.tiles.greyWall, 4);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
			}
			break;
		}
		case EnumRoomtype.BIG_SQUARE_TILE: {
			this.setupOverlays = function() {
				this.addFloor(level.tiles.bigSquareTileFloor, null, null, true);
				this.addWallDecor(false);
				this.addObstacles(EnumObstacletype.TILED_FLOOR);
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
		this.origin.y = Math.floor(session.prng.nextFloat() * level.height);
	} else {
		this.origin.y = origin_y;
	}
	if(!origin_x) {
		this.origin.x = Math.floor(session.prng.nextFloat() * level.width);
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
	return Math.floor(session.prng.nextFloat() * (max - min)) + min;
}
Room.prototype.checkIfFits = function() {
	for(var i = this.origin.y - 2; i < this.origin.y + this.height + 2; i++) {
		for(var j = this.origin.x - 2; j < this.origin.x + this.width + 2; j++) {
			if(level.terrainArray[i] === undefined || level.terrainArray[i][j] === undefined || level.terrainArray[i][j] === 0) {
				return false;
			} 
		}
	}
	return true;
}
//	Adds a variable-sized patch to the floor, leaving at least 1 tile of clearance at top, left & right 
Room.prototype.addFloorPatch = function(type) {
	var minHeight = 2;
	var minWidth = 2;
	var height = Math.floor(session.prng.nextFloat() * (this.height - 3)) + minHeight;
	var width = Math.floor(session.prng.nextFloat() * (this.width - 4)) + minWidth;
	var offset_y = Math.floor(session.prng.nextFloat() * (this.height - 2 - height)) + 2;
	var offset_x = Math.floor(session.prng.nextFloat() * (this.width - 2 - width)) + 1;
	var origin = {
		y: this.origin.y + offset_y,
		x: this.origin.x + offset_x
	}
	var tiles;
	switch(type) {
		case EnumFloorpatch.LIGHT_RED: {
			tiles = level.tiles.lightRed;
			break;
		}
		case EnumFloorpatch.MUD_POOL: {
			tiles = level.tiles.mudPool;
			break;
		}
		case EnumFloorpatch.PUDDLE: {
			tiles = level.tiles.puddle;
			break;
		}
		default: {
			break;
		}
	}
	for(var i = origin.y; i < origin.y + height; i++) {
		for(var j = origin.x; j < origin.x + width; j++) {
			if(i === origin.y && j === origin.x) {							//	Top-left
				var rand = Math.floor(session.prng.nextFloat() * tiles[1].length);
				level.overlayArray[i][j] = tiles[1][rand];
			} else if(i === origin.y && j === origin.x + width-1) {			//	Top-right
				var rand = Math.floor(session.prng.nextFloat() * tiles[2].length);
				level.overlayArray[i][j] = tiles[2][rand];
			} else if(i === origin.y + height-1 && j === origin.x) {			//	Bottom-left
				var rand = Math.floor(session.prng.nextFloat() * tiles[3].length);
				level.overlayArray[i][j] = tiles[3][rand];
			} else if(i === origin.y + height-1 && j === origin.x + width-1) {	//	Bottom-right
				var rand = Math.floor(session.prng.nextFloat() * tiles[4].length);
				level.overlayArray[i][j] = tiles[4][rand];
			} else if(i === origin.y) {										//	Top
				var rand = Math.floor(session.prng.nextFloat() * tiles[5].length);
				level.overlayArray[i][j] = tiles[5][rand];
			} else if(i === origin.y + height-1) {							//	Bottom
				var rand = Math.floor(session.prng.nextFloat() * tiles[6].length);
				level.overlayArray[i][j] = tiles[6][rand];
			} else if(j === origin.x) {										//	Left
				var rand = Math.floor(session.prng.nextFloat() * tiles[7].length);
				level.overlayArray[i][j] = tiles[7][rand];
			} else if(j === origin.x + width-1) {								//	Right
				var rand = Math.floor(session.prng.nextFloat() * tiles[8].length);
				level.overlayArray[i][j] = tiles[8][rand];
			} else {
				var rand = Math.floor(session.prng.nextFloat() * tiles[0].length);
				level.overlayArray[i][j] = tiles[0][rand];
			}
		}
	}
}
//	Pass tileset, then flag to indicate whether floor has transition tiles to be placed at exits *inside* the room - or outside
Room.prototype.addFloor = function(floorTiles, innerTransitions, outerTransitions, sequential) {
	if(innerTransitions) {																			//	Transitions to basic floor happen *within* room
		for(var i = 0; i < this.height; i++) {
			for(var j = 0; j < this.width; j++) {
				var rand = Math.floor(session.prng.nextFloat() * floorTiles[0].length);
				level.overlayArray[this.origin.y+i][this.origin.x+j] = floorTiles[0][rand];
			}
		}
		for(var i = 0; i < this.height; i++) {
			if(level.terrainArray[this.origin.y+i][this.origin.x-1] === 0) {
				level.overlayArray[this.origin.y+i][this.origin.x] = floorTiles[1][0];
			}
			if(level.terrainArray[this.origin.y+i][this.origin.x + this.width] === 0) {
				level.overlayArray[this.origin.y+i][this.origin.x + this.width-1] = floorTiles[2][0];
			}
		}
		for(var i = 0; i < this.width; i++) {
			if(level.terrainArray[this.origin.y-1][this.origin.x+i] === 0) {
				level.overlayArray[this.origin.y][this.origin.x+i] = floorTiles[3][0];
			}
			if(level.terrainArray[this.origin.y+this.height+1][this.origin.x+i] === 0) {
				level.overlayArray[this.origin.y+this.height][this.origin.x+i] = floorTiles[4][0];
			}
		}
	} else if(outerTransitions) {																	//	Transitions to basic floor happen *outside* room (placeholder)

	} else {																						//	Basic floor tile without transitions
		//	If tiles need to be laid in a specific order from top to bottom...
		if(sequential) {
			for(var i = 0; i < this.height; i++) {
				for(var j = 0; j < this.width; j++) {
					if(i % 3 === 0) {
						level.overlayArray[this.origin.y+i][this.origin.x+j] = floorTiles[0];
					} else if(i % 3 === 1) {
						level.overlayArray[this.origin.y+i][this.origin.x+j] = floorTiles[1];
					} else {
						level.overlayArray[this.origin.y+i][this.origin.x+j] = floorTiles[2];
					}
				}
			}
		} else {
			for(var i = 0; i < this.height; i++) {
				for(var j = 0; j < this.width; j++) {
					var rand = Math.floor(session.prng.nextFloat() * floorTiles.length);
					level.overlayArray[this.origin.y+i][this.origin.x+j] = floorTiles[rand];
				}
			}
		}
		//	Add transitions
		for(var i = this.origin.x; i < this.origin.x + this.width; i++) {
			if(level.terrainArray[this.origin.y + this.height][i] === 0) {
				if(sequential) {
					level.overlayArray[this.origin.y + this.height][i] = floorTiles[this.height % 3];
				} else {
					level.overlayArray[this.origin.y + this.height][i] = floorTiles[rand];
				}
			}
			if(level.terrainArray[this.origin.y + this.height + 1][i] === 0 && level.terrainArray[this.origin.y + this.height + 1][i - 1] === 1  
			&& level.terrainArray[this.origin.y + this.height + 1][i + 1] === 1) {
				level.overlayArray[this.origin.y + this.height + 1][i] = level.tiles.floorTransitions[10];
			} else if (level.terrainArray[this.origin.y + this.height + 1][i] === 0 && level.terrainArray[this.origin.y + this.height + 1][i - 1] === 1  
			&& level.terrainArray[this.origin.y + this.height + 1][i + 1] === 0) {
				level.overlayArray[this.origin.y + this.height + 1][i] = level.tiles.floorTransitions[4];
			} else if (level.terrainArray[this.origin.y + this.height + 1][i] === 0 && level.terrainArray[this.origin.y + this.height + 1][i - 1] === 0  
			&& level.terrainArray[this.origin.y + this.height + 1][i + 1] === 1) {
				level.overlayArray[this.origin.y + this.height + 1][i] = level.tiles.floorTransitions[5];
			} else if (level.terrainArray[this.origin.y + this.height + 1][i] === 0 && level.terrainArray[this.origin.y + this.height + 1][i - 1] === 0  
			&& level.terrainArray[this.origin.y + this.height + 1][i + 1] === 0) {
				level.overlayArray[this.origin.y + this.height + 1][i] = level.tiles.floorTransitions[2];
			} 
			if(level.terrainArray[this.origin.y-1][i] === 0 && level.terrainArray[this.origin.y-1][i-1] === 1 && level.terrainArray[this.origin.y-1][i+1] === 1) {
				level.overlayArray[this.origin.y-1][i] = level.tiles.floorTransitions[11];
			} else if(level.terrainArray[this.origin.y-1][i] === 0 && level.terrainArray[this.origin.y-1][i-1] === 1 && level.terrainArray[this.origin.y-1][i+1] === 0) {
				level.overlayArray[this.origin.y-1][i] = level.tiles.floorTransitions[6];
			} else if(level.terrainArray[this.origin.y-1][i] === 0 && level.terrainArray[this.origin.y-1][i-1] === 0 && level.terrainArray[this.origin.y-1][i+1] === 1) {
				level.overlayArray[this.origin.y-1][i] = level.tiles.floorTransitions[7];
			} else if(level.terrainArray[this.origin.y-1][i] === 0 && level.terrainArray[this.origin.y-1][i-1] === 0 && level.terrainArray[this.origin.y-1][i+1] === 0) {
				level.overlayArray[this.origin.y-1][i] = level.tiles.floorTransitions[3];
			}
		}
		for(var i = this.origin.y; i < this.origin.y + this.height; i++) {
			if(level.terrainArray[i][this.origin.x-1] === 0 && level.terrainArray[i-1][this.origin.x-1] === 1) {
				level.overlayArray[i][this.origin.x-1] = level.tiles.floorTransitions[5];
			} else if(level.terrainArray[i][this.origin.x-1] === 0 && level.terrainArray[i-1][this.origin.x-1] === 0) {
				level.overlayArray[i][this.origin.x-1] = level.tiles.floorTransitions[1];
			}
			if(level.terrainArray[i][this.origin.x+this.width] === 0 && level.terrainArray[i-1][this.origin.x+this.width] === 1) {
				level.overlayArray[i][this.origin.x+this.width] = level.tiles.floorTransitions[4];
			} else if(level.terrainArray[i][this.origin.x+this.width] === 0 && level.terrainArray[i-1][this.origin.x+this.width] === 0) {
				level.overlayArray[i][this.origin.x+this.width] = level.tiles.floorTransitions[0];
			}
		}
	}
}
Room.prototype.replaceWalls = function(wallTiles, decorFrequency) {
	for(var i = 0; i < this.width; i++) {
		if(level.terrainArray[this.origin.y-1][this.origin.x+i] === 1) {
			if(level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 0 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 0) {
				level.overlayArray[this.origin.y-1][this.origin.x+i] = wallTiles[0][3];
				level.overlayArray[this.origin.y-2][this.origin.x+i] = wallTiles[1][3];
			} else if(i === 0 || (level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 0 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 1)) {
				level.overlayArray[this.origin.y-1][this.origin.x+i] = wallTiles[0][1];
				level.overlayArray[this.origin.y-2][this.origin.x+i] = wallTiles[1][1];
			} else if(i === this.width-1 || (level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 1 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 0)) {
				level.overlayArray[this.origin.y-1][this.origin.x+i] = wallTiles[0][2];
				level.overlayArray[this.origin.y-2][this.origin.x+i] = wallTiles[1][2];
			} else if(level.terrainArray[this.origin.y-1][this.origin.x+i-1] === 1 && level.terrainArray[this.origin.y-1][this.origin.x+i+1] === 1) {
				var rand = Math.floor(session.prng.nextFloat() * decorFrequency)
				if(rand < 1) {
					var rand2 = Math.floor(session.prng.nextFloat() * wallTiles[2].length);
					level.overlayArray[this.origin.y-1][this.origin.x+i] = wallTiles[2][rand2];
				} else {
					level.overlayArray[this.origin.y-1][this.origin.x+i] = wallTiles[0][0];
				}
				level.overlayArray[this.origin.y-2][this.origin.x+i] = wallTiles[1][0];
			}
		}
	}
}
Room.prototype.addWallDecor = function(allowTallDecor, frequencyFactor) {
	var i = this.origin.y - 1;
	if(!frequencyFactor) {
		frequencyFactor = 1;
	}
	for(var j = this.origin.x; j < this.origin.x + this.width; j++) {
		if(level.terrainArray[i][j] === 1 && level.terrainArray[i+1] !== undefined && level.terrainArray[i+1][j] === 0 && 
			level.terrainArray[i][j-1] !== undefined && level.terrainArray[i][j-1] === 1 && level.terrainArray[i][j+1] !== undefined && level.terrainArray[i][j+1] === 1) {
			var smallDecor = true;
			//	Randomly determine whether wall face should have decor added...
			if(allowTallDecor) {
				var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.tallDecorRarity);
				if(rand < 1) {
					smallDecor = false;
				}
			}
			if(smallDecor) {
				var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.wallDecorFrequency / frequencyFactor);
				if(rand < 1) {
					var rand2 = Math.floor(session.prng.nextFloat() * level.tiles.wallDecorSmall.length);
					level.overlayArray[i][j] = level.tiles.wallDecorSmall[rand2];
				}
			} else {
				var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.wallDecorFrequency / frequencyFactor);
				if(rand < 1) {
					var rand2 = Math.floor(session.prng.nextFloat() * level.tiles.wallDecorTall.length);
					for(var k = 0; k < level.tiles.wallDecorTall[rand2].height; k++) {
						level.overlayArray[i+k+level.tiles.wallDecorTall[rand2].offset_y][j] = {
							y: level.tiles.wallDecorTall[rand2].y + k,
							x: level.tiles.wallDecorTall[rand2].x
						};
					}
				}
			}
		}
	}
}

Room.prototype.generateRoomContents = function() {
	var addContents = function() {
		var rand = Math.floor(session.prng.nextFloat() * level.randomRoomRange) + level.randomRoomBaseline;
		switch(rand) {
			case 0: case 1: case 2: {
				var rand = Math.floor(session.prng.nextFloat() * sessionVars.basicItemFrequency);
				if(rand < 1) {
					var item = Math.floor(session.prng.nextFloat() * level.commonItems.length);
					this.addItem(level.commonItems[item]);
				}
				//	Empty room
				break; 
			} case 3: case 4: {
				//	Add 1 common creature
				var rand = Math.floor(session.prng.nextFloat() * level.commonCreatures.length);
				this.addCreature(level.commonCreatures[rand]);
				break;
			} case 5: {
				//	Add 1-2 of a common creature
				var rand = Math.floor(session.prng.nextFloat() * level.commonCreatures.length);
				var rand2 = Math.floor(session.prng.nextFloat() * 2) + 1;
				for(var i = 0; i < rand2; i++) {
					this.addCreature(level.commonCreatures[rand]);
				}
				break;
			} case 6: {
				//	Add 1 uncommon creature
				var rand = Math.floor(session.prng.nextFloat() * level.uncommonCreatures.length);
				this.addCreature(level.uncommonCreatures[rand]);
				break;
			} case 7: {
				//	Add 2 of the same uncommon creature
				var rand = Math.floor(session.prng.nextFloat() * level.uncommonCreatures.length);
				this.addCreature(level.uncommonCreatures[rand]);
				this.addCreature(level.uncommonCreatures[rand]);
				break;
			} case 8: {
				//	Add 2-3 of one common creature and 1 common creature of another type
				var rand = Math.floor(session.prng.nextFloat() * level.commonCreatures.length);
				var rand2 = Math.floor(session.prng.nextFloat() * 2) + 2;
				for(var i = 0; i < rand2; i++) {
					this.addCreature(level.commonCreatures[rand]);
				}
				var rand3 = Math.floor(session.prng.nextFloat() * level.commonCreatures.length);
				this.addCreature(level.commonCreatures[rand3]);
				break;
			} case 9: {
				//	Add 1 uncommon creature and 1-3 different common creatures
				var rand = Math.floor(session.prng.nextFloat() * level.uncommonCreatures.length);
				this.addCreature(level.uncommonCreatures[rand]);
				var rand2 = Math.floor(session.prng.nextFloat() * 3) + 1;
				for(var i = 0; i < rand2; i++) {
					var rand3 = Math.floor(session.prng.nextFloat() * level.commonCreatures.length);
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
Room.prototype.addObstacles = function(obstacleType) {
	switch(obstacleType) {
		case EnumObstacletype.BASIC_ROOM: {
			var rand = Math.floor(session.prng.nextFloat() * 10);
			if(rand < 4) {
				//	Empty room
				this.addFloorDecor(2);
			} else if(rand < 6) {
				//	Storeroom
				this.addStoreRoomObstacles();
				this.addFloorDecor(1);
				if(level.specialItemCount > 0) {
					levelGen.addSpecialItem(this);
				}
			} else if(rand < 7) {
				//	Well room
				this.addWellRoomObstacles();
				this.addFloorDecor(2, [EnumDecortype.FILTH, EnumDecortype.PLANTS]);
			} else if(rand < 8) {
				//	Table room
				this.addTableRoomObstacles();
				this.addFloorDecor(2);
			} else if(rand < 9) {
				//	Food room
				var rand2 = Math.floor(session.prng.nextFloat() * 5);
				if(rand2 < 1) {
					new Obstacle(EnumObstacle.SPIT, this);
					new Obstacle(EnumObstacle.STOOL, this);
				} else if(rand2 < 2) {
					new Obstacle(EnumObstacle.SPIT, this);
					new Obstacle(EnumObstacle.MEAT_RACK, this);
					new Obstacle(EnumObstacle.STOOL, this);
				} else if(rand2 < 3) {
					new Obstacle(EnumObstacle.MEAT_RACK, this);
					new Obstacle(EnumObstacle.SACK, this);
				} else if(rand2 < 4) {
					new Obstacle(EnumObstacle.SPIT, this);
					new Obstacle(EnumObstacle.BLOOD_BUCKET, this);
				} else {
					new Obstacle(EnumObstacle.SPIT, this);
					new Obstacle(EnumObstacle.BUCKET, this);
					new Obstacle(EnumObstacle.STOOL, this);
				}
				this.addFloorDecor(1);
			} else if(rand < 10) {
				//	???
				new Obstacle(EnumObstacle.STONES, this);
				this.addFloorDecor(1);
			}
			break;
		}
		case EnumObstacletype.TILED_FLOOR: {
			var rand = Math.floor(session.prng.nextFloat() * 10);
			if(rand < 5) {
				//	Empty room
				this.addFloorDecor(2);
			} else if(rand < 7) {
				//	Storeroom
				this.addStoreRoomObstacles();
				this.addFloorDecor(1);
			} else if(rand < 10) {
				//	Torture room
				this.addTableRoomObstacles();
				this.addFloorDecor(2, [EnumDecortype.SPLATS]);
			}
			break;
		}
		case EnumObstacletype.PUDDLE: {
			var rand = Math.floor(session.prng.nextFloat() * 10);
			if(rand < 7) {
				//	Empty room
				this.addFloorDecor(3, [EnumDecortype.FILTH, EnumDecortype.PLANTS]);
			} else if(rand < 10) {
				//	WELL ROOM
				this.addWellRoomObstacles();
				this.addFloorDecor(3, [EnumDecortype.FILTH, EnumDecortype.PLANTS]);
			}
			break;
		}
		default: {
			break;
		}
	}
}
Room.prototype.addStoreRoomObstacles = function(num) {
	if(!num) {
		num = Math.floor(session.prng.nextFloat() * 10) + 1;		//	Random 1-10
	}
	var storeRoomObstacles = [
		EnumObstacle.BARREL,
		EnumObstacle.BARREL,
		EnumObstacle.BARREL_2,
		EnumObstacle.BARRELSx2,
		EnumObstacle.BARRELSx2,
		EnumObstacle.BARRELSx3,
		EnumObstacle.BARRELSx3,
		EnumObstacle.SACK,
		EnumObstacle.SACK,
		EnumObstacle.SACK_2,
		EnumObstacle.SACK_2,
		EnumObstacle.SACKx2,
		EnumObstacle.SACKx2,
		EnumObstacle.TIPPED_BARREL,
		EnumObstacle.SPLIT_SACK,
		EnumObstacle.WATER_BUTT,
		EnumObstacle.GRAIN_BARREL,
		EnumObstacle.WIDE_SHELVES,
		EnumObstacle.NARROW_SHELVES,
		EnumObstacle.RUBBLE
	];
	for(var i = 0; i < num; i++) {
		var rand = Math.floor(session.prng.nextFloat() * storeRoomObstacles.length);
		new Obstacle(storeRoomObstacles[rand], this);
	}
}
Room.prototype.addWellRoomObstacles = function() {
	new Obstacle(EnumObstacle.WELL, this);
	var wellRoomObstacles = [
		EnumObstacle.STOOL,
		EnumObstacle.BUCKET,
		EnumObstacle.WATER_BUTT,
		EnumObstacle.BARREL,
		EnumObstacle.WOODEN_BENCH,
		EnumObstacle.STONES,
		EnumObstacle.RUBBLE
	]
	var rand2 = Math.floor(session.prng.nextFloat() * 5);
	for(var i = 0; i < rand2; i++) {
		var rand3 = Math.floor(session.prng.nextFloat() * wellRoomObstacles.length);
		new Obstacle(wellRoomObstacles[rand3], this);
	}
}
Room.prototype.addTableRoomObstacles = function() {
	var rand = Math.floor(session.prng.nextFloat() * 3);
	if(rand < 1) {
		new Obstacle(EnumObstacle.TORTURE_TABLE, this);
		var rand2 = Math.floor(session.prng.nextFloat() * 5);
		if(rand2 < 1) {
			new Obstacle(EnumObstacle.BLOOD_BUCKET, this);
		} else if(rand2 < 2) {
			this.addStoreRoomObstacles(1);
		} else if(rand2 < 3) {
			new Obstacle(EnumObstacle.FILTH_BUCKET, this);
		}
		var rand3 = Math.floor(session.prng.nextFloat() * 3);
		if(rand3 < 1) {
			new Obstacle(EnumObstacle.SKULL_SPIKE, this);
		}
	} else if(rand < 2) {
		new Obstacle(EnumObstacle.MUG_TABLE, this);
		var rand2 = Math.floor(session.prng.nextFloat() * 10);
		if(rand2 < 1) {
			this.addStoreRoomObstacles(1);
		} else if(rand2 < 2) {
			this.addStoreRoomObstacles(2);
		} else if(rand2 < 3) {
			new Obstacle(EnumObstacle.FILTH_BUCKET, this);
		} else if(rand2 < 4) {
			new Obstacle(EnumObstacle.WOODEN_CHAIR, this);
		} else if(rand2 < 5) {
			new Obstacle(EnumObstacle.WOODEN_CHAIR, this);
			new Obstacle(EnumObstacle.WOODEN_CHAIR, this);
		} else if(rand2 < 6) {
			new Obstacle(EnumObstacle.WOODEN_BENCH, this);
		} else if(rand2 < 7) {
			new Obstacle(EnumObstacle.WOODEN_BENCH, this);
			new Obstacle(EnumObstacle.WOODEN_BENCH, this);
		}
		var rand3 = Math.floor(session.prng.nextFloat() * 3);
		if(rand3 < 1) {
			new Obstacle(EnumObstacle.FLAG_SPIKE, this);
		}
	} else {
		new Obstacle(EnumObstacle.SWORD_TABLE, this);
		var rand2 = Math.floor(session.prng.nextFloat() * 5);
		if(rand2 < 1) {
			this.addStoreRoomObstacles(1);
		} else if(rand2 < 2) {
			this.addStoreRoomObstacles(2);
		} else if(rand2 < 3) {
			new Obstacle(EnumObstacle.BLOOD_BUCKET, this);
		}
		var rand3 = Math.floor(session.prng.nextFloat() * 3);
		if(rand3 < 1) {
			new Obstacle(EnumObstacle.FLAG_SPIKE, this);
		}
	}
}

Room.prototype.addCreature = function(creature) {
	var tries;
	if(creature === level.boss) {
		tries = Infinity;
	} else {
		tries = levelGen.vars.addCreatureAttempts;
	}
	var retry = true;
	while(tries && retry) {
		var randY = this.origin.y + Math.floor(session.prng.nextFloat() * (this.height - 2)) + 1;
		var randX = this.origin.x + Math.floor(session.prng.nextFloat() * (this.width - 2)) + 1; 
		if(		
			level.creatureArray[randY][randX] === 0 && level.obstacleArray[randY][randX] === undefined &&
			// //	Check that creatureArray is empty for this and all surrounding tiles...
			// level.creatureArray[randY-1][randX-1] === 0 && level.creatureArray[randY-1][randX] === 0 && level.creatureArray[randY+1][randX+1] === 0 &&
			// level.creatureArray[randY][randX-1] === 0 && level.creatureArray[randY][randX] === 0 && level.creatureArray[randY][randX+1] === 0 &&
			// level.creatureArray[randY+1][randX-1] === 0 && level.creatureArray[randY+1][randX] === 0 && level.creatureArray[randY+1][randX+1] === 0 &&
			// //	...and that obstacle array is clear...
			// level.obstacleArray[randY-1][randX-1] === undefined && level.obstacleArray[randY-1][randX] === undefined && level.obstacleArray[randY+1][randX+1] === undefined &&
			// level.obstacleArray[randY][randX-1] === undefined && level.obstacleArray[randY][randX] === undefined && level.obstacleArray[randY][randX+1] === undefined &&
			// level.obstacleArray[randY+1][randX-1] === undefined && level.obstacleArray[randY+1][randX] === undefined && level.obstacleArray[randY+1][randX+1] === undefined &&
			//	...and that this is not the player's location...
			randX !== level.playerStart.x && randY !== level.playerStart.y
		) {			//	If so, add creature to level.creatureArray
			level.creatureArray[randY][randX] = creature;
			level.creatureCount++;
			retry = false;
		}
		tries--;
	}
}
Room.prototype.addItem = function(item) {
	tries = levelGen.vars.addCreatureAttempts;
	var retry = true;
	while(tries && retry) {
		var randY = this.origin.y + Math.floor(session.prng.nextFloat() * (this.height - 2)) + 1;
		var randX = this.origin.x + Math.floor(session.prng.nextFloat() * (this.width - 2)) + 1; 
		if(		
			level.itemArray[randY][randX] === undefined && level.obstacleArray[randY][randX] === undefined &&
			randX !== level.playerStart.x && randY !== level.playerStart.y
		) {
			level.itemArray[randY][randX] = item;
			console.log("Adding item! " + item);
			retry = false;
		}
		tries--;
	}
}
Room.prototype.addFloorDecor = function(decorFactor, decorTypes) {
	if(!decorFactor) {
		decorFactor = 1;
	}
	var allowedDecor = [];
	if(!decorTypes) {
		for(var i = 0; i < level.floorDecorTiles.length; i++) {
			allowedDecor.push.apply(allowedDecor, level.floorDecorTiles[i]);
		}
	} else {
		for(var i = 0; i < level.floorDecorTiles.length; i++) {
			if(decorTypes.includes(i)) {
				allowedDecor.push.apply(allowedDecor, level.floorDecorTiles[i]);
			}
		}
	}	
	for(var i = this.origin.y; i < this.origin.y + this.height; i++) {
		for(var j = this.origin.x; j < this.origin.x + this.width; j++) {
			if(level.obstacleArray[i][j] === undefined) {
				var rand = Math.floor(session.prng.nextFloat() * levelGen.vars.floorDecorFrequency / decorFactor);
				if(rand < 1) {
					var rand2 = Math.floor(session.prng.nextFloat() * allowedDecor.length);
					var offsetY = Math.floor(session.prng.nextFloat() * allowedDecor[rand2].maxOffset.y);
					var offsetX = Math.floor(session.prng.nextFloat() * allowedDecor[rand2].maxOffset.x);
					new Decor(allowedDecor[rand2].y, allowedDecor[rand2].x, i, j, offsetY, offsetX);
				}
			}
		}
	}
}
Room.prototype.removeExistingContents = function() {
	//	Remove any existing obstacles apart from doors
	for(var i = level.obstacles.length - 1; i >= 0; i--) {
		if(	level.obstacles[i].grid.y >= this.origin.y && level.obstacles[i].grid.y <= this.origin.y + this.height && 
			level.obstacles[i].grid.x >= this.origin.x && level.obstacles[i].grid.x <= this.origin.x + this.width
			&& level.obstacles[i].type !== EnumObstacle.DOOR
		) {
			console.log("Deleting obstacle...");
			level.obstacles.splice(i, 1);
		}
	}
	//	Remove any existing decor **********************************Need to remove existing tall decor too********************************
	for(var i = level.decor.length - 1; i >= 0; i--) {
		if(	level.decor[i].grid.y >= this.origin.y && level.decor[i].grid.y <= this.origin.y + this.height && 
			level.decor[i].grid.x >= this.origin.x && level.decor[i].grid.x <= this.origin.x + this.width
		) {
			console.log("Deleting decor...");
			level.decor.splice(i, 1);
		}
	}
}


Decor = function(spriteY, spriteX, gridY, gridX, offsetY, offsetX) {
	this.grid = {
		x: gridX,
		y: gridY
	}
	this.sprite = {};
	this.sprite.size = {
		y: 1,
		x: 1
	}
	this.sprite.spriteSheet = level.floorDecorImg;
	this.position = {
		y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
		x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
	}
	this.vars = {};
	this.vars.drawOffset = {
		y: offsetY,
		x: offsetX
	};
	this.currentSprite = {
		y: spriteY,
		x: spriteX
	};
	level.decor.push(this);
}

