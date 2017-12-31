var CANVAS_WIDTH = 272;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
var CANVAS_HEIGHT = 200;
// var CANVAS_WIDTH = 240;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
// var CANVAS_HEIGHT = 168;
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
	KOB: 9,
	MUMI: 10,
	SNEAKY_SKELTON: 11,
	BLUE_SQUARK: 12,
	ZOMBI: 13,
	ZOMBI_MASTER: 14,
	AIR_ELEMENTAL: 15,

	BOSS_CAMP_VAMP: 105,
	BOSS_URK_SHAMAN: 107,
	BOSS_ZOMBI_MASTER: 114
}

var BossCreature = {
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
	MUMI: 10,
	SNEAKY_SKELTON: 11,
	ZOMBI: 12,
	ZOMBI_MASTER: 13,
	KOB: 14,
	BLUE_SQUARK: 15
}

var EnumCreatureWeapon = {
	GREEN_GOBLIN_CLAW: 1,
	BONE_SWORD: 2,
	BONE_AXE: 3,
	VAMP_DAGGER: 4,
	URK_SWORD: 5,
	BONE_CROSSBOW: 6,
	HULKING_URK_HAMMA: 7,
	KOB_MACE: 8,
	ZOMBI_BITE: 9,
	ZOMBI_MASTER_STAFF: 10,
	SQUARK_KNIFE: 11
}

var EnumCreatureProjectile = {
	BONE_ARROW: 1,
	SQUARK_KNIFE: 2
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
	BASIC_ROOM: 0,
	LIGHT_FLOOR_PATCH: 1,
	MUD_POOL: 2,
	COBBLES: 3,
	GREY_STONE: 4,
	SQUARE_TILE: 5,
	PARQUET_FLOOR: 6,
	FLOORBOARDS: 7,
	PAVED_FLOOR: 8
}

var EnumFloorpatch = {
	LIGHT_RED: 0,
	MUD_POOL: 1
}

var EnumObstacle = {
	DOOR: 0,
	EXIT_STAIRS: 1,
	BARREL: 2,
	BARREL_2: 3,
	DINING_TABLE: 4,
	DINING_CHAIR_R: 5,
	DINING_CHAIR_L: 6,
	BUCKET: 7,
	WELL: 8,
	COFFIN: 9,
	TORTURE_TABLE: 10,
	MEAT_RACK: 11,
	STOOL: 12,
	SACK: 13,
	BLOOD_BUCKET: 14,
	ZOMBI_MASTER_DESK: 15,
	ZOMBI_HEAD: 16,
	STONE_PILE: 17,
	SPIT: 18,
	FILTH_BUCKET: 19,
	BARRELSx3: 20,
	BARRELSx2: 21,
	SACK_2: 22,
	SACKx2: 23,
	TIPPED_BARREL: 24,
	SPLIT_SACK: 25,
	WATER_BUTT: 26,
	GRAIN_BARREL:27
}

var EnumDecortype = {
	FILTH: 0,
	SPLATS: 1,
	PLANTS: 2,
	BONES: 3,
	MISC: 4
}

var EnumObstacletype = {
	BASIC_ROOM: 0,
	TILED_FLOOR: 1,
	STONE_FLOOR: 2
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

var interfaceCanvas = $('<canvas id="interfaceCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var interfaceCtx = interfaceCanvas.get(0).getContext('2d');
interfaceCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
interfaceCtx.font = "10pt dpcomic";
interfaceCtx.fillStyle = "white";
interfaceCanvas.appendTo('body');
