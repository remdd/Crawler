//	Level to be returned
var level = {
	height: 0,
	width: 0,
	terrainArray: [],
	creatureArray: [],
	overlayArray: [],
	rooms: [],
	corridors: [],
	displayAsMap: false
}

//	Level generator
var levelGen = {
	loadLevel: function(levelNumber) {
		switch(levelNumber) {
			case 0: {
				level.img = document.getElementById('tilesetImg');
				level.height = 100;
				level.width = 100;
				var roomAttempts = 100;
				this.setupTerrain(level.height, level.width, roomAttempts);
				return level;
				break;
			}
			default: {
				break;
			}
		}
	},

	setupTerrain: function(height, width, roomAttempts) {

		this.setupInitialGrid(height, width);

		//	Add rooms
		var startRoom = new Room(2, 2, 5, 5);
		for(var i = 0; i < roomAttempts; i++) {
			var room = new Room();
		}
		console.log(level.rooms);

		//	Add corridors
		for(var i = 0; i < level.terrainArray.length; i++) {
			for(var j = 0; j < level.terrainArray[0].length; j++) {
				checkForCorridorStart(i, j);
			}
		}

		//	Add a random selection of connectors between corridors and rooms
		var potentialConnectors = [];
		for(var i = 1; i < level.terrainArray.length - 2; i++) {
			for(var j = 1; j < level.terrainArray[0].length - 1; j++) {
				if(level.terrainArray[i][j] === 1) {												//	If the tile is solid rock...
					if(level.terrainArray[i][j-1] === 0 && level.terrainArray[i][j+1] === 0 &&		//	...and the tiles to left and right are both open...
						level.terrainArray[i+2][j] !== 0 && level.terrainArray[i+1][j] !== 0 &&		//	...and the 2 tiles below are not open...
						level.terrainArray[i-2][j] !== 0 && level.terrainArray[i-1][j] !== 0		//	...and the 2 tiles above are not open...
					) {
						potentialConnectors.push( [{ y: i, x: j }]);									//	...push to array.
					} else if(level.terrainArray[i - 1][j] === 0 && level.terrainArray[i + 2][j] === 0) { 	//	...or if the tiles above and *2* below are open...
						potentialConnectors.push( [{ y: i, x: j}, { y: i+1, x: j }] );
					}
				}
			}
		}
		var connectorSparseness = 4;						//	Higher numbers mean fewer random connectors
		potentialConnectors.forEach(function(connector) {
			if(Math.floor(Math.random() * connectorSparseness) < 1) {
				connector.forEach(function(tile) {
					level.terrainArray[tile.y][tile.x] = 0;
				});
			}
		});

		//	Iterate through rooms to ensure they all have at least 1 connector, add one if not
		level.rooms.forEach(function(room) {

		});

	},

	setupInitialGrid(height, width) {
		for(var i = 0; i < height; i++) {
			level.terrainArray[i] = [];
			for(var j = 0; j < width; j++) {
				if(i === 0 || i === height || j === 0 || j === width) {
					level.terrainArray[i][j] = 2;								//	2 = edge tile
				} else {
					level.terrainArray[i][j] = 1;								//	1 = regular impassable wall tile
				}
			}
		}
	},
};

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
			var turn = Math.floor(Math.random() * 3);							//	Probability weighting of continuing to dig in straight line if possible
			if(turn < 1) {
				var digDir = Math.floor(Math.random() * this.validDirections.length);
				this.digDirection = this.validDirections[digDir];
			}
		} else {
			var digDir = Math.floor(Math.random() * this.validDirections.length);
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
Room = function(origin_y, origin_x, height, width) {
	this.min_size = 4;
	this.max_size = 15;
	if(!origin_y) {
		this.origin_y = Math.floor(Math.random() * level.height);
	} else {
		this.origin_y = origin_y;
	}
	if(!origin_x) {
		this.origin_x = Math.floor(Math.random() * level.width);
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
	return Math.floor(Math.random() * (max - min)) + min;
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

