// var CANVAS_WIDTH = 272;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
// var CANVAS_HEIGHT = 200;
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
	STAB: 1,
	ARROW: 2
}

var EnumCreature = {
	GREEN_GOBLIN: 1,
	MINI_GHOST: 2,
	SKELTON: 3,
	GREEN_SLUDGIE: 4,
	CAMP_VAMP: 5,
	URK: 6,
	URK_SHAMAN: 7,
	HULKING_URK: 8,
	DENZIN: 9,
	MUMI: 10
}

var EnumAi = {
	GREEN_GOBLIN: 1,
	MINI_GHOST: 2,
	SKELTON: 3,
	GREEN_SLUDGIE: 4,
	CAMP_VAMP: 5,
	URK: 6,
	URK_SHAMAN: 7,
	SKELTON_ARCHER: 8,
	HULKING_URK: 9,
	MUMI: 10
}

var EnumCreatureWeapon = {
	GREEN_GOBLIN_CLAW: 1,
	BONE_SWORD: 2,
	BONE_AXE: 3,
	VAMP_DAGGER: 4,
	URK_SWORD: 5,
	BONE_CROSSBOW: 6,
	HULKING_URK_HAMMA: 7,
	DENZIN_MACE: 8 
}

var EnumCreatureProjectile = {
	BONE_ARROW: 1
}

var	EnumLodetype = {
	IRON: 1,
	BONE: 2,
	ACID: 3,
	CRYSTAL: 4,
	SHADOW: 5
}

var EnumBoxtype = {
	PLAYER: 0,
	CREATURE: 1,
	PROJECTILE: 2,
	OBSTACLE: 3,
	ITEM: 4
}

var EnumRoomtype = {
	MUD_PATCH: 0,
	COBBLES: 1,
	GREY_STONE: 2
}

var EnumObstacle = {
	DOOR: 0,
	COMMON_FLOATING_DECOR: 1,
	RARE_FLOATING_DECOR: 2,
	BARREL: 3,
	DINING_TABLE: 4,
	DINING_CHAIR_R: 5,
	DINING_CHAIR_L: 6,
	BUCKET: 7,
	WELL: 8,
	COFFIN: 9,
	TORTURE_TABLE: 10
}

var playerSprite = document.getElementById('playerSpriteImg');
var monsterSprites = document.getElementById('monsterSprites');

var bgCanvas = $('<canvas id="bgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var bgCtx = bgCanvas.get(0).getContext('2d');
bgCanvas.appendTo('body');

var attackCanvas = $('<canvas id="attackCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var attackCtx = attackCanvas.get(0).getContext('2d');
attackCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
attackCanvas.appendTo('body');

var drawableCanvas = $('<canvas id="drawableCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var drawableCtx = drawableCanvas.get(0).getContext('2d');
drawableCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
drawableCanvas.appendTo('body');

var debugCanvas = $('<canvas id="debugCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var debugCtx = debugCanvas.get(0).getContext('2d');
debugCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
debugCanvas.appendTo('body');
