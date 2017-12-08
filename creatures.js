var playerSprite = document.getElementById('playerSpriteImg');
var StateEnum = { RESTING_R: 0, RESTING_L: 1, MOVING_R: 2, MOVING_L: 3 }

setAiAction = function(creature) {
	// console.log("Setting AI action...");
	creature.ai.startTime = performance.now();
	switch(creature.ai.type) {
		case 0: {
			var action = Math.floor(Math.random() * 4);
			if(action < 1) {
				creature.animStart = performance.now();
				ai.rest(creature);
				break;
			} else {
				ai.moveRandomVector(creature);
				break;
			}
		}
		default: {
			break;
		}
	}
}

var ai = {
	rest: function(creature) {
		// console.log("AI: rest");
		creature.ai.duration = Math.random() * 500 + 250;
		creature.movement.speed = 0;
		if(creature.facingRight) {
			creature.animation = StateEnum.RESTING_R;
		} else {
			creature.animation = StateEnum.RESTING_L;
		}
		creature.ai.action = 'rest';
	},
	moveRandomVector: function(creature) {
		// console.log("AI: moveRandomVector");
		creature.ai.duration = Math.random() * 1500 + 100;
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.setFacing();
		if(creature.facingRight) {
			creature.animation = StateEnum.MOVING_R;
		} else {
			creature.animation = StateEnum.MOVING_L;
		}
		creature.movement.speed = creature.speed;
		creature.ai.action = 'moveRandomVector';
	}
}

var EnumBoxtypes = {
	PLAYER: 0,
	CREATURE: 1,
	CREATURE_TOXIC: 2,
	POWERUP: 3,
	ITEM: 4
}


var playerTemplates = [
	{
		name: 'Hero',
		spriteSheet: playerSprite,
		start_x: 2, 
		start_y: 5, 
		spriteSize_x: 1, 
		spriteSize_y: 1, 
		width: 10, 
		height: 14,
		speed: 1.2,
		frames: [
			{ x: 0, y: 0 },		//	0	Resting 0 - facing R
			{ x: 1, y: 0 },		//	1	Resting 1 - facing R
			{ x: 2, y: 0 },		//	2	Walking 0 - facing R
			{ x: 3, y: 0 },		//	3	Walking 1 - facing R
			{ x: 4, y: 0 },		//	4	Walking 2 - facing R
			{ x: 5, y: 0 },		//	5	Walking 3 - facing R
			{ x: 0, y: 1 },		//	6	Resting 0 - facing L
			{ x: 1, y: 1 },		//	7	Resting 1 - facing L
			{ x: 2, y: 1 },		//	8	Walking 0 - facing L
			{ x: 3, y: 1 },		//	9	Walking 1 - facing L
			{ x: 4, y: 1 },		//	10	Walking 2 - facing L
			{ x: 5, y: 1 }		//	11	Walking 3 - facing L
		],
		sprite: { x: 0, y: 0 },									//	Holds current sprite for rendering
		animations: [											//	Format: Loop time in ms, end time of each frame in ms, frame numbers
			[ 1000, [600, 1000], [0, 1] ],						//	Resting, facing R
			[ 1000, [600, 1000], [6, 7] ],						//	Resting, facing L
			[ 400, [100, 200, 300, 400], [5, 4, 3, 2 ] ],		//	Moving, facing R
			[ 400, [100, 200, 300, 400], [8, 9, 10,11] ]		//	Moving, facing L
		],
		lastAttackTime: 0,
		attackRate: 500,
		hp: 10,
		box: {
			type: EnumBoxtypes.PLAYER
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: false
		}
	}
];

var EnumCreatures = {
	GOBLIN: 0
}

var creatureTemplates = [
	{
		name: 'Goblin',
		spriteSheet: monsterSprites,
		start_x: 3, 
		start_y: 4, 
		spriteSize_x: 1, 
		spriteSize_y: 1, 
		width: 10, 
		height: 10,
		speed: 0.6,
		frames: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 3, y: 1 }
		],
		sprite: { x: 0, y: 0 },
		animations: [
			[ 800, [600, 800], [ 0, 1] ],						//	Resting, facing R
			[ 800, [600, 800], [ 4, 5] ],						//	Resting, facing L
			[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
			[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ]						//	Moving, facing L
		],
		hp: 5,
		box: {
			type: EnumBoxtypes.CREATURE
		},
		ai: {
			type: 0,
			startTime: 0,
			duration: 500,
			action: 0
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		damageResponse: function() {
			console.log("ouch!!");
		}
	}
];

//	AI actions

// ai.moveRandomVector = function(creature) {
// 	creature.move(Math.PI * 0, 0.2);
// }

