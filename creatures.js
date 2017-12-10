getPlayerDirection = function(creature) {					//	Returns angle in radians from creature position to player position vectors
	if(player) {
		return Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
	} else {
		return Math.random() * Math.PI * 2;
	}
}

getPlayerDistance = function(creature) {
	if(player) {
		return Math.sqrt(Math.pow(player.position.y - creature.position.y, 2) + Math.pow(player.position.x - creature.position.x, 2));
	}
}

setAiAction = function(creature) {
	// console.log("Setting AI action...");
	creature.ai.startTime = performance.now();
	creature.vars.animStart = performance.now();
	switch(creature.ai.type) {
		//	Green Goblin
		case 0: {				//	Green Goblin
			if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2.5) {
				ai.attackPlayer(creature, Math.PI / 4, creature.vars.attackRate);					//	Accuracy in radians = max offset from player's direction vector
			}
			var action = Math.floor(Math.random() * 3);
			if(action < 2) {
				console.log("Resting...");
				ai.rest(creature);
			} else {
				ai.moveRandomVector(creature, 1500, 100);
			}
			break;
		}

		//	Mini Ghost
		case 1: {				//	Mini Ghost
			var action = Math.floor(Math.random() * 1);
			if(action < 1) {
				ai.moveRandomVector(creature, 2500, 300);
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
	},
	attackPlayer: function(creature, accuracy, waitTimeAfterAttack) {
		var direction = getPlayerDirection(creature);
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.attack(direction);
		if(direction >= 0) {
			creature.facingRight = true;
		} else {
			creature.facingRight = false;
		}
		creature.ai.duration = waitTimeAfterAttack;
		creature.movement.speed = 0;
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
			maxHP: 500,
			currentHP: 500,
			lastAttackTime: 0,
			attackRate: 500,
			sprite: { x: 0, y: 0},
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

var creatureWeapons = [
	{
		name: 'Green Goblin Claw',
		vars: {
			sprite: { x: 4, y: 0},
			animTime: 100,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			drawOffset: { x: 0, y: 0 }
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			displayWhileResting: false,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 4, y: 0 },							//	Right facing
				{ x: 4.5, y: 0 }						//	Left facing
			],
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE * 0.7,						//	Reach of attack from centre of player object position
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeColor1: 'rgba(255,102,0,0)',
			swipeColor2: '#ff944d',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}
];



