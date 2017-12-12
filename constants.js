var CANVAS_WIDTH = 320;								//	In native pixels - scale up **in CSS** to avoid antialiasing artefacts
var CANVAS_HEIGHT = 224;

var VIEWPORT_WIDTH = 160;
var VIEWPORT_HEIGHT = 112;

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
	GREEN_GOBLIN: 0,
	MINI_GHOST: 1,
	SKELTON: 2,
	GREEN_SLUDGIE: 3,
	CAMP_VAMP: 4
}

var EnumBoxtype = {
	PLAYER: 0,
	CREATURE: 1,
	CREATURE_TOXIC_TO_PLAYER: 2,
	POWERUP: 3,
	ITEM: 4
}

var playerSprite = document.getElementById('playerSpriteImg');
var monsterSprites = document.getElementById('monsterSprites');

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
