var CANVAS_WIDTH = 240;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
var CANVAS_HEIGHT = 168;
var SCALE_FACTOR = 3;								//	Factor by which pixels are scaled up for display

var TILE_SIZE = 16;									//	Native tile size in spriteSheet

var player = {};

var EnumState = { 
	RESTING_R: 0, 
	RESTING_L: 1, 
	MOVING_R: 2, 
	MOVING_L: 3,
	RESTING_HITFLASH_R: 4,
	RESTING_HITFLASH_L: 5, 
	MOVING_HITFLASH_R: 6,
	MOVING_HITFLASH_L: 7 
}

var EnumAttack = { 
	SWIPE: 0,
	STAB: 1 
}

var EnumCreature = {
	GREEN_GOBLIN: 1,
	MINI_GHOST: 2,
	SKELTON: 3,
	GREEN_SLUDGIE: 4,
	CAMP_VAMP: 5
}

var EnumBoxtype = {
	PLAYER: 0,
	CREATURE: 1,
	CREATURE_TOXIC_TO_PLAYER: 2,
	POWERUP: 3,
	ITEM: 4
}

var EnumRoomtype = {
	MUD_PATCH: 0,
	COBBLES: 1,
	GREY_STONE: 2
}

var playerSprite = document.getElementById('playerSpriteImg');
var monsterSprites = document.getElementById('monsterSprites');

var bgCanvas = $('<canvas id="bgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var bgCtx = bgCanvas.get(0).getContext('2d');
bgCanvas.appendTo('body');

var creatureCanvas = $('<canvas id="creatureCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var creatureCtx = creatureCanvas.get(0).getContext('2d');
creatureCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
creatureCanvas.appendTo('body');

var playerCanvas = $('<canvas id="playerCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var playerCtx = playerCanvas.get(0).getContext('2d');
playerCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
playerCanvas.appendTo('body');

var fgCanvas = $('<canvas id="fgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var fgCtx = fgCanvas.get(0).getContext('2d');
fgCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
fgCanvas.appendTo('body');

var attackCanvas = $('<canvas id="attackCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var attackCtx = attackCanvas.get(0).getContext('2d');
attackCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
attackCanvas.appendTo('body');

var debugCanvas = $('<canvas id="debugCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var debugCtx = debugCanvas.get(0).getContext('2d');
debugCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
debugCanvas.appendTo('body');
