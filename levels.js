//	Level to be returned
var level = {
	height: 0,
	width: 0,
	terrainArray: [],
	creatureArray: [],
	overlayArray: [],
	fillArray: [],
	rooms: [],
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
	vars: {
		connectorSparseness: 20,
		corridorStraightness: 5,
		wallDecorFrequency: 8,
		tallDecorRarity: 5,
		minSpecialRooms: 1,
		maxSpecialRooms: 4,
		deadEndFactor: 0.5,					//	Fraction of dead ends that get filled in is 1 divided by this number
		basicRoomScarcity: 5				//	1 = 100% basic rooms, 2 = 50% etc				
	}
}

//	Level generator
var levelGen = {
	loadLevel: function(levelNumber, prng) {
		level.seed = prng;
		switch(levelNumber) {
			case 0: {
				level.img = document.getElementById('tilesetImg');
				level.tiles = {
					tileset: 'Dungeon1',
					floor: { y:0,x:0 },
					solid: { y:1,x:0 },
					solidColor: '#1c1117',
					wallFace: [{ y:1,x:2 }, { y:1,x:1 }, { y:1,x:3 }, { y:1,x:4 }],					//	Wall arrays in order of no ends, left end, right end, both ends
					wallTop: [{ y:0,x:2 }, { y:0,x:1 }, { y:0,x:3 }, { y:0,x:4 }],
					//	Wall bottoms in order of wall-above *3, wall-left *3, wall-right *3, wall-above&left, wall-above&right, wall-l&r, wall-above&l&r
					wallBtm: [{ y:2,x:1 }, { y:2,x:2 }, { y:2,x:3 }, { y:0,x:12}, { y:1,x:12}, { y:2,x:12}, { y:0,x:13}, { y:1,x:13}, { y:2,x:13}, 
						{ y:0,x:14}, { y:1,x:14}, { y:3,x:14}, { y:2,x:14} ],
					wallDecorSmall: [
						{y: 1, x: 5},					//	Pipe end 1
						{y: 1, x: 6},					//	Pipe end 2
						{y: 1, x: 7},					//	Grille 1
						{y: 1, x: 8},					//	Grille 2
						{y: 2, x: 5},					//	Dark block
						{y: 2, x: 6},					//	Pipe end 3
						{y: 2, x: 7},					//	Hole 1
						{y: 2, x: 8},					//	Hole 2
						{y: 3, x: 4},					//	Faceplate
						{y: 3, x: 5},					//	Banner 1
						{y: 3, x: 6},					//	Banner 2
						{y: 3, x: 7},					//	Banner 3
						{y: 3, x: 8},					//	Banner 4
						{y: 2, x: 4},					//	Crack
						{y: 4, x: 4}					//	Chains
					],
					wallDecorTall: [
						{y: 1, x: 9, height: 2, offset_y: 0},			//	Green goo
						{y: 0, x: 10, height: 3, offset_y: -1},			//	Column
						{y: 0, x: 11, height: 3, offset_y: -1}			//	Red fountain face
					],
					lightMudFloor: [
						{y:2,x:0}, {y:3,x:0}, {y:3,x:1}, {y:3,x:2}, {y:3,x:3}, {y:4,x:0}, {y:4,x:1}, {y:4,x:2}, {y:4,x:3}, {y:5,x:0}, {y:5,x:1}, {y:5,x:2}, {y:5,x:3}
					],
					cobbleFloor: [
						{y:6,x:0}, {y:6,x:1}, {y:7,x:0}, {y:7,x:1}, {y:6,x:2}, {y:6,x:3}, {y:7,x:2}, {y:7,x:3}
					],
					greyCobbleFloor: [
						{y:8,x:4}, {y:8,x:5}, {y:9,x:4}, {y:9,x:5}, {y:8,x:6}, {y:8,x:7}, {y:9,x:6}, {y:9,x:7}
					],
					greyWallFace: [
						{y:6,x:5}, {y:6,x:4}, {y:6,x:6}, {y:6,x:7}
					],
					greyWallTop: [
						{y:5,x:5}, {y:5,x:4}, {y:5,x:6}, {y:5,x:7}
					],
					greyWallDecor: [
						{y:7,x:4}, {y:7,x:5}, {y:7,x:6}, {y:7,x:7}
					]
				},
				level.roomTypes = [
					EnumRoomtype.MUD_PATCH, EnumRoomtype.COBBLES, EnumRoomtype.GREY_STONE
				]

				//	Set up terrain array
				level.height = 70;
				level.width = 70;
				this.setupTerrain();

				return level;
				break;
			}
			default: {
				break;
			}
		}
	},

	setupTerrain: function() {
		this.setupInitialGrid(level.height, level.width);

		//	Set up special rooms
		this.setupStartAndBossRooms();
		level.specialRooms = 0;					//	Count number of successfully added special rooms
		this.setupSpecialRooms();

		//	Fill remaining map with random rooms and corridors
		level.roomAttempts = 300;
		this.fillOutMap();

		//	Add basic tileset overlays
		this.addBasicOverlays();

		//	Run each room's own tileset overlay
		level.rooms.forEach(function(room) {
			room.setupOverlays();
		});
		console.log(level.rooms);
	},


	fillOutMap: function() {
		//	Add rooms
		for(var i = 0; i < level.roomAttempts; i++) {
			var room = new Room();
		}

		//	Add corridors
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[0].length; j++) {
				checkForCorridorStart(i, j);
			}
		}

		//	Add some doors to rooms on 1-3 of their walls
		level.rooms.forEach(function(room) {
			var doors = 0;
			var tries = 100;
			var rand = Math.floor(level.seed.nextFloat() * 10);
			var doorDirections = [];
			if(rand < 5) {
				doors = 1;
			} else if(rand < 8) {
				doors = 2;
			} else {
				doors = 3;
			}
			// doors = 4;
			while(doors && tries) {
				var direction = Math.floor(level.seed.nextFloat() * 4);
				if(!doorDirections.includes(direction)) {
					switch(direction) {
						case 0: {						//	Up
							var x = Math.floor(level.seed.nextFloat() * room.width);
							if(	level.terrainArray[room.origin_y-3] !== undefined && 
								level.terrainArray[room.origin_y-3][room.origin_x+x] !== undefined && 
								level.terrainArray[room.origin_y-2][room.origin_x+x-1] !== 0 && level.terrainArray[room.origin_y-2][room.origin_x+x+1] !== 0 &&
								level.terrainArray[room.origin_y-3][room.origin_x+x] === 0) 
							{
								level.terrainArray[room.origin_y-2][room.origin_x+x] = 0;
								level.terrainArray[room.origin_y-1][room.origin_x+x] = 0;
								room.doors.push({y: room.origin_y-1, x: room.origin_x+x});
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 1: {						//	Down
							var x = Math.floor(level.seed.nextFloat() * room.width);
							if(	level.terrainArray[room.origin_y+room.height+2] !== undefined &&
								level.terrainArray[room.origin_y+room.height+2][room.origin_x+x] !== undefined && 
								level.terrainArray[room.origin_y+room.height+1][room.origin_x+x-1] !== 0 && level.terrainArray[room.origin_y+room.height+1][room.origin_x+x+1] !== 0 &&
								level.terrainArray[room.origin_y+room.height+2][room.origin_x+x] === 0) 
							{
								level.terrainArray[room.origin_y+room.height+1][room.origin_x+x] = 0;
								level.terrainArray[room.origin_y+room.height][room.origin_x+x] = 0;
								room.doors.push({y: room.origin_y+room.height, x: room.origin_x+x});
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 2: {						//	Left
							var y = Math.floor(level.seed.nextFloat() * room.height);
							if(	level.terrainArray[room.origin_y+y][room.origin_x-2] !== undefined && 
								level.terrainArray[room.origin_y+y+2] !== undefined && level.terrainArray[room.origin_y+y-2] !== undefined &&
								level.terrainArray[room.origin_y+y+2][room.origin_x-1] !== 0 && level.terrainArray[room.origin_y+y-2][room.origin_x-1] !== 0 &&
								level.terrainArray[room.origin_y+y+1][room.origin_x-1] !== 0 && level.terrainArray[room.origin_y+y-1][room.origin_x-1] !== 0 &&
								level.terrainArray[room.origin_y+y][room.origin_x-2] === 0) 
							{
								level.terrainArray[room.origin_y+y][room.origin_x-1] = 0;
								room.doors.push({y: room.origin_y+y, x: room.origin_x-1});
								doors--;
								doorDirections.push(direction);
							}
							break;
						}
						case 3: {						//	Right
							// debugger;
							var y = Math.floor(level.seed.nextFloat() * room.height);
							if(	level.terrainArray[room.origin_y+y][room.origin_x+room.width+1] !== undefined && 
								level.terrainArray[room.origin_y+y+2] !== undefined && level.terrainArray[room.origin_y+y-2] !== undefined &&
								level.terrainArray[room.origin_y+y+2][room.origin_x+room.width] !== 0 && level.terrainArray[room.origin_y+y-2][room.origin_x+room.width] !== 0 &&
								level.terrainArray[room.origin_y+y+1][room.origin_x+room.width] !== 0 && level.terrainArray[room.origin_y+y-1][room.origin_x+room.width] !== 0 &&
								level.terrainArray[room.origin_y+y][room.origin_x+room.width+1] === 0) 
							{
								level.terrainArray[room.origin_y+y][room.origin_x+room.width] = 0;
								room.doors.push({y: room.origin_y+y, x: room.origin_x+room.width});
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

		console.log(level.corridors);

		// Add random connectors
		for(var i = 1; i < level.terrainArray.length - 2; i++) {
			for(var j = 1; j < level.terrainArray[0].length - 1; j++) {
				if(level.terrainArray[i][j] === 1) {												//	If the tile is solid rock...
					if(level.terrainArray[i][j-1] === 0 && level.terrainArray[i][j+1] === 0 &&		//	...and the tiles to left and right are both open...
						level.terrainArray[i+2][j] !== 0 && level.terrainArray[i+1][j] !== 0 &&		//	...and the 2 tiles below are not open...
						level.terrainArray[i-2][j] !== 0 && level.terrainArray[i-1][j] !== 0		//	...and the 2 tiles above are not open...
					) {
						var rand = Math.floor(level.seed.nextFloat() * level.vars.connectorSparseness);
						if(rand < 1) {
							level.terrainArray[i][j] = 0;
						}
					} else if(level.terrainArray[i-1][j] === 0 && level.terrainArray[i + 2][j] === 0 &&		//	...or if the tiles above and *2* below are open...
						level.terrainArray[i][j-1] !== 0 && level.terrainArray[i][j-1] !== 0				//	...and the tiles to left and right are not open...
					) { 	
						var rand = Math.floor(level.seed.nextFloat() * level.vars.connectorSparseness);
						if(rand < 1) {
							level.terrainArray[i][j] = 0;
							level.terrainArray[i+1][j] = 0;
						}
					}
				}
			}
		}

		//	Fill fillArray, starting from start room
		level.fillArray = arrayClone(level.terrainArray);
		fill(level.fillArray, level.playerStart.y, level.playerStart.x, 0, 2);

		console.log(level);

		// 	If boss room does not connect to player start room, regenerate map
		if(level.fillArray[level.bossStart.y][level.bossStart.x] !== 2) {
			console.log("Regenerating...");
			this.setupTerrain();
		}

		// Fill in any areas not connected to the main network
		fillInUnreaachableAreas();

		// Pick some dead ends and back-fill them
		reduceDeadEnds();
	},

	setupInitialGrid: function() {
		level.terrainArray.length = 0;
		level.fillArray.length = 0;
		level.overlayArray.length = 0;
		level.rooms.length = 0;
		level.corridors.length = 0;
		for(var i = 0; i < level.height; i++) {
			level.terrainArray[i] = [];
			for(var j = 0; j < level.width; j++) {
				level.terrainArray[i][j] = 1;								//	1 = regular impassable wall tile
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
		// var startCorner = Math.floor(level.seed.nextFloat() * 4);
		var startCorner = 0;
		switch(startCorner) {
			case 0: {
				startPosY = Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3 +2);
				startPosX = Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3 +2);
				bossPosY = level.terrainArray.length - (Math.floor(level.seed.nextFloat() * level.terrainArray.length * 0.3)) - bossSizeY -2;
				bossPosX = level.terrainArray[0].length - (Math.floor(level.seed.nextFloat() * level.terrainArray[0].length * 0.3)) - bossSizeX -2;
			}
			default: {
				break;
			}
		}
		level.playerStart.y = startPosY + 1;
		level.playerStart.x = startPosX + 1;
		level.bossStart.y = bossPosY + 1;
		level.bossStart.x = bossPosX + 1;
		var startRoom = new Room(startPosY, startPosX, startSizeY, startSizeX, 'start');
		var bossRoom = new Room(bossPosY, bossPosX, bossSizeY, bossSizeX, 'boss');
	},

	setupSpecialRooms: function() {
		//	Placeholder!
	},

	addBasicOverlays: function() {
		//	First iterate terrain array and set every tile to either floor or solid
		for(var i = 0; i < level.terrainArray.length; i++) {
			level.overlayArray.push([]);
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
						var rand = Math.floor(level.seed.nextFloat() * level.vars.tallDecorRarity);
						if(rand < 1) {
							smallDecor = false;
						}
					}
					if(smallDecor) {
						var rand = Math.floor(level.seed.nextFloat() * level.vars.wallDecorFrequency);
						if(rand < 1) {
							var rand2 = Math.floor(level.seed.nextFloat() * level.tiles.wallDecorSmall.length);
							level.overlayArray[i][j] = level.tiles.wallDecorSmall[rand2];
						}
					} else {
						var rand = Math.floor(level.seed.nextFloat() * level.vars.wallDecorFrequency);
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
	}
};

function fillInUnreaachableAreas() {
	level.rooms.forEach(function(room) {
		var roomFill = arrayClone(level.terrainArray);
		fill(roomFill, room.origin_y + 1, room.origin_x + 1, 0, 2);
		if(roomFill[level.playerStart.y][level.playerStart.x] !== 2) {
			level.rooms.splice(level.rooms.indexOf(room), 1);
		}
	});
	for(var i = 0; i < level.fillArray.length; i++) {
		for(var j = 0; j < level.fillArray[0].length; j++) {
			if(level.fillArray[i][j] !== 2) {
				level.terrainArray[i][j] = 1;
			}
		}
	}
}


function reduceDeadEnds() {
	console.log(level.terrainArray);
	for(var i = 1; i < level.terrainArray.length -1; i++) {
		for(var j = 1; j < level.terrainArray[0].length -1; j++) {
			if(level.terrainArray[i][j] === 0) {
				var exits = getExits(i, j);
				if(exits.length === 1) {
					var fillIn = 0;					
					// var fillIn = Math.floor(level.seed.nextFloat() * level.vars.deadEndFactor);
					if(fillIn < 1) {
						fillTunnel(i, j);
					}
				}
			}
		}
	}
}

function getExits(y, x) {
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
}

function fillTunnel(y, x) {
	// debugger;
	var exits = getExits(y, x);
	if(exits.length === 1) {
		level.terrainArray[y][x] = 1;
		fillTunnel(exits[0].y, exits[0].x);
	}
}

function fill(arr, startY, startX, fillValue, fillWith) {
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

function arrayClone(arr) {
    var i, copy;
    if( Array.isArray( arr ) ) {
        copy = arr.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
            copy[ i ] = arrayClone( copy[ i ] );
        }
        return copy;
    } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }

}

function checkForCorridorStart(y, x) {
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
			var turn = Math.floor(level.seed.nextFloat() * level.vars.corridorStraightness);						//	Probability weighting of continuing to dig in straight line if possible
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
Room = function(origin_y, origin_x, height, width, type) {
	if(type) {
		this.type = type;
	} else {
		var rand = Math.floor(level.seed.nextFloat() * level.vars.basicRoomScarcity);
		if(rand < 1) {
			this.type = "basic"
		} else {
			this.type = level.roomTypes[Math.floor(level.seed.nextFloat() * level.roomTypes.length)];
		}
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
				mud_origin_y = this.origin_y + 1 + Math.floor(level.seed.nextFloat() * (this.height - mud_height -1));
				mud_origin_x = this.origin_x + 1 + Math.floor(level.seed.nextFloat() * (this.width - mud_width - 1)); 
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
						level.overlayArray[this.origin_y+i][this.origin_x+j] = level.tiles.cobbleFloor[rand];
					}
				}
				for(var i = 0; i < this.height; i++) {
					if(level.terrainArray[this.origin_y+i][this.origin_x-1] === 0) {
						level.overlayArray[this.origin_y+i][this.origin_x] = level.tiles.cobbleFloor[4];
					}
					if(level.terrainArray[this.origin_y+i][this.origin_x + this.width] === 0) {
						level.overlayArray[this.origin_y+i][this.origin_x + this.width-1] = level.tiles.cobbleFloor[5];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin_y-1][this.origin_x+i] === 0) {
						level.overlayArray[this.origin_y][this.origin_x+i] = level.tiles.cobbleFloor[6];
					}
					if(level.terrainArray[this.origin_y+this.height+1][this.origin_x+i] === 0) {
						level.overlayArray[this.origin_y+this.height][this.origin_x+i] = level.tiles.cobbleFloor[7];
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
						level.overlayArray[this.origin_y+i][this.origin_x+j] = level.tiles.greyCobbleFloor[rand];
					}
				}
				for(var i = 0; i < this.height; i++) {
					if(level.terrainArray[this.origin_y+i][this.origin_x-1] === 0) {
						level.overlayArray[this.origin_y+i][this.origin_x] = level.tiles.greyCobbleFloor[4];
					}
					if(level.terrainArray[this.origin_y+i][this.origin_x + this.width] === 0) {
						level.overlayArray[this.origin_y+i][this.origin_x + this.width-1] = level.tiles.greyCobbleFloor[5];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin_y-1][this.origin_x+i] === 0) {
						level.overlayArray[this.origin_y][this.origin_x+i] = level.tiles.greyCobbleFloor[6];
					}
					if(level.terrainArray[this.origin_y+this.height+1][this.origin_x+i] === 0) {
						level.overlayArray[this.origin_y+this.height][this.origin_x+i] = level.tiles.greyCobbleFloor[7];
					}
				}
				for(var i = 0; i < this.width; i++) {
					if(level.terrainArray[this.origin_y-1][this.origin_x+i] === 1) {
						if(level.terrainArray[this.origin_y-1][this.origin_x+i-1] === 0 && level.terrainArray[this.origin_y-1][this.origin_x+i+1] === 0) {
							level.overlayArray[this.origin_y-1][this.origin_x+i] = level.tiles.greyWallFace[3];
							level.overlayArray[this.origin_y-2][this.origin_x+i] = level.tiles.greyWallTop[3];
						} else if(i === 0 || (level.terrainArray[this.origin_y-1][this.origin_x+i-1] === 0 && level.terrainArray[this.origin_y-1][this.origin_x+i+1] === 1)) {
							level.overlayArray[this.origin_y-1][this.origin_x+i] = level.tiles.greyWallFace[1];
							level.overlayArray[this.origin_y-2][this.origin_x+i] = level.tiles.greyWallTop[1];
						} else if(i === this.width-1 || (level.terrainArray[this.origin_y-1][this.origin_x+i-1] === 1 && level.terrainArray[this.origin_y-1][this.origin_x+i+1] === 0)) {
							level.overlayArray[this.origin_y-1][this.origin_x+i] = level.tiles.greyWallFace[2];
							level.overlayArray[this.origin_y-2][this.origin_x+i] = level.tiles.greyWallTop[2];
						} else if(level.terrainArray[this.origin_y-1][this.origin_x+i-1] === 1 && level.terrainArray[this.origin_y-1][this.origin_x+i+1] === 1) {
							var rand = Math.floor(level.seed.nextFloat() * 2)
							if(rand < 1) {
								level.overlayArray[this.origin_y-1][this.origin_x+i] = level.tiles.greyWallFace[0];
							} else {
								var rand2 = Math.floor(level.seed.nextFloat() * level.tiles.greyWallDecor.length);
								level.overlayArray[this.origin_y-1][this.origin_x+i] = level.tiles.greyWallDecor[rand2];
							}
							level.overlayArray[this.origin_y-2][this.origin_x+i] = level.tiles.greyWallTop[0];
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
	if(!origin_y) {
		this.origin_y = Math.floor(level.seed.nextFloat() * level.height);
	} else {
		this.origin_y = origin_y;
	}
	if(!origin_x) {
		this.origin_x = Math.floor(level.seed.nextFloat() * level.width);
	} else {
		this.origin_x = origin_x;
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
	if(!(this.origin_y + this.height > level.height - 1 || this.origin_x + this.width > level.width -1)) {
		for(var i = this.origin_y; i < this.origin_y + this.height; i++) {
			for(var j = this.origin_x; j < this.origin_x + this.width; j++) {
				level.terrainArray[i][j] = 0;
			}
		}
	}
}
Room.prototype.random_size = function(min, max) {
	return Math.floor(level.seed.nextFloat() * (max - min)) + min;
}
Room.prototype.checkIfFits = function() {
	for(var i = this.origin_y - 2; i < this.origin_y + this.height + 2; i++) {
		for(var j = this.origin_x - 1; j < this.origin_x + this.width + 1; j++) {
			if(level.terrainArray[i] === undefined || level.terrainArray[i][j] === undefined || level.terrainArray[i][j] === 0) {
				return false;
			} 
		}
	}
	return true;
}



