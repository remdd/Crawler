setAiAction = function(creature) {
	// console.log("Setting AI action...");
	creature.ai.startTime = performance.now();
	switch(creature.ai.type) {
		case 0: {				//	Green Goblin
			var action = Math.floor(Math.random() * 2);
			if(action < 1) {
				creature.vars.animStart = performance.now();
				ai.rest(creature);
				break;
			} else {
				ai.moveRandomVector(creature, 1500, 100);
				break;
			}
		}
		case 1: {				//	Mini Ghost
			// var action = Math.floor(Math.random() * 4);
			// if(action < 1) {
				creature.vars.animStart = performance.now();
			// 	ai.rest(creature);
			// 	break;
			// } else {
				ai.moveRandomVector(creature, 2500, 300);
				break;
			// }
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
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.RESTING_R;
		} else {
			creature.vars.animation = EnumState.RESTING_L;
		}
		creature.ai.action = 'rest';
	},
	moveRandomVector: function(creature, duration_factor, duration_min) {
		// console.log("AI: moveRandomVector");
		creature.ai.duration = Math.random() * duration_factor + duration_min;
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.setFacing();
		if(creature.vars.facingRight) {
			creature.vars.animation = EnumState.MOVING_R;
		} else {
			creature.vars.animation = EnumState.MOVING_L;
		}
		creature.movement.speed = creature.vars.speed;
		creature.ai.action = 'moveRandomVector';
	}
}




var playerTemplates = [
	{
		name: 'Hero',
		vars: {
			speed: 1.2,
			maxHP: 10,
			currentHP: 10,
			lastAttackTime: 0,
			attackRate: 500,
			sprite: { x: 0, y: 0 },								//	Holds current sprite to be rendered
			drawOffset: { x: 0, y: 0 },
			animation: 0,										//	Holds current animation number from sprite.animations array
			facingRight: true,
			moving: false
		},
		sprite: { 
			spriteSheet: playerSprite,
			size: { x: 1, y: 1 },
			y_padding: 2,
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
			animations: [											//	Format: Loop time in ms, end time of each frame in ms, frame numbers
				[ 1000, [600, 1000], [0, 1] ],						//	Resting, facing R
				[ 1000, [600, 1000], [6, 7] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [5, 4, 3, 2 ] ],		//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ]		//	Moving, facing L
			]
		},
		box: {
			width: 10, 
			height: 14,
			y_padding: 2,
			type: EnumBoxtype.PLAYER
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: false
		}
	}
];

var creatureTemplates = [
	{
		name: 'Green Goblin',
		vars: {
			speed: 0.6,
			maxHP: 5,
			currentHP: 5,
			lastAttackTime: 0,
			attackRate: 500,
			sprite: { x: 0, y: 0},
			drawOffset: { x: 0, y: 0 },
			animation: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
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
			animations: [
				[ 800, [600, 800], [ 0, 1] ],						//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],						//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ]						//	Moving, facing L
			]
		},
		box: {
			width: 10, 
			height: 10,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: 0,
			startTime: 0,
			duration: 500,
			action: 0
		},
		damageResponse: function() {
			console.log("ouch!!");
		}
	},
	{
		name: 'Mini Ghost',
		vars: {
			speed: 0.2,
			maxHP: 5,
			currentHP: 5,
			lastAttackTime: 0,
			attackRate: 500,
			sprite: { x: 0, y: 2},
			drawOffset: { x: 0, y: 0 },
			animation: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 2 },
				{ x: 1, y: 2 },
				{ x: 2, y: 2 },
				{ x: 0, y: 3 },
				{ x: 1, y: 3 },
				{ x: 2, y: 3 }
			],
			animations: [
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Moving, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ]							//	Moving, facing L
			]
		},
		box: {
			width: 8, 
			height: 14,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: 1,
			startTime: 0,
			duration: 500,
			action: 0
		},
		damageResponse: function() {
			console.log("ouchy!!");
		}
	}
];

// var creatureWeapons = [
// 	{
// 		name: 'Goblin Claw',
// 		// spriteSheet: playerSprite,
// 		spriteSize: {
// 			x: 0.5,
// 			y: 1
// 		},
// 		position: {
// 			x: player.position.x,
// 			y: player.position.y
// 		},
// 		frames: [
// 			{ x: 0, y: 4 },							//	Right facing
// 			{ x: 0.5, y: 4 }						//	Left facing
// 		],
// 		sprite: { x: 0, y: 4 },						//	Starting sprite
// 		reach: TILE_SIZE * 0.8,						//	Reach of attack from centre of player object position
// 		animTime: 150,								//	Length of time the weapon stays animated after attack
// 		restingDrawOffset: {
// 			x: TILE_SIZE * - 0.25,
// 			y: 0
// 		},
// 		rotationDrawOffset: {
// 			x: TILE_SIZE * 0.3,
// 			y: TILE_SIZE * 0.3
// 		},
// 		attack: {
// 			type: EnumAttack.SWIPE,
// 			displayTime: 50,
// 			swipeColor1: 'rgba(255,255,255,0)',
// 			swipeColor2: 'rgb(70,0,160)',
// 			swipeThickness: 0.8,					//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
// 			lifespan: 1
// 		},
// 		maxHits: 1,									//	Number of contact points per swipe that can successfully resolve as hits
// 		lastAttackDirection: 0,						//	Store direction of last attack
// 		attackVariants: 2,							//	Number of attack variants weapon has
// 		lastAttackVariant: 0						//	Hold variant of last attack
// 	}
// ];



