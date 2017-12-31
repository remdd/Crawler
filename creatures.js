var creatureTemplates = [
	{},			//	Template 0 is not used - indicates no creature!
	{
		name: 'Green Goblin',
		currentSprite: { x: 0, y: 0},
		vars: {
			speed: 0.6,
			maxHP: 3,
			currentHP: 3,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 0 },	//	Facing R 1
				{ x: 1, y: 0 },	//	Facing R 2
				{ x: 2, y: 0 },	//	Facing R 3
				{ x: 3, y: 0 },	//	Facing R 4
				{ x: 0, y: 1 },	//	Facing L 1
				{ x: 1, y: 1 },	//	Facing L 2
				{ x: 2, y: 1 },	//	Facing L 3
				{ x: 3, y: 1 },	//	Facing L 4
				{ x: 4, y: 0 },	//	Death facing R 1
				{ x: 5, y: 0 },	//	Death facing R 2
				{ x: 4, y: 1 },	//	Death facing L 1
				{ x: 5, y: 1 }	//	Death facing L 2
			],
			animations: [
				[ 800, [600, 800], [ 0, 1] ],												//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],												//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ],						//	Moving, facing L
				[ 1000, [500, 1000], [8, 9] ],												//	Death, facing R
				[ 1000, [500, 1000], [10, 11] ]												//	Death, facing L
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
			type: EnumAi.GREEN_GOBLIN,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			// return EnumCreatureWeapon.URK_SWORD;
			return EnumCreatureWeapon.GREEN_GOBLIN_CLAW;
		}	
	},
	{
		name: 'Mini Ghost',
		currentSprite: { x: 0, y: 2},
		vars: {
			speed: 0.2,
			maxHP: 5,
			currentHP: 5,
			moveThroughColliders: true,
			foreground: true,
			score: 0
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
				{ x: 2, y: 3 },
				{ x: 3, y: 2 },
				{ x: 4, y: 2 },
				{ x: 5, y: 2 },
				{ x: 3, y: 3 },
				{ x: 4, y: 3 },
				{ x: 5, y: 3 },
				{ x: 0, y: 7 }			//	Empty frame!
			],
			animations: [
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Moving, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Moving, facing L
				[ 2000, [100, 200, 300, 400, 2000], [1, 6, 7, 8, 12] ],				//	Death, facing R
				[ 2000, [100, 200, 300, 400, 2000], [4, 9, 10, 11, 12] ]			//	Death, facing L
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
			type: EnumAi.MINI_GHOST,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Skelton',
		currentSprite: { x: 3, y: 4 },
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 4 },
				{ x: 1, y: 4 },
				{ x: 2, y: 4 },
				{ x: 3, y: 4 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 0, y: 5 },
				{ x: 1, y: 5 },
				{ x: 2, y: 5 },
				{ x: 3, y: 5 },
				{ x: 4, y: 5 },
				{ x: 5, y: 5 },
				{ x: 6, y: 5 }
			],
			animations: [
				[ 1000, [1000], [0] ],									//	Resting, facing R
				[ 1000, [1000], [7] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 3, 2, 0] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 10, 9, 7] ],			//	Moving, facing L
				[ 2000, [500, 1000, 2000], [4, 5, 6]],					//	Death, facing R
				[ 2000, [500, 1000, 2000], [11, 12, 13]]				//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.SKELTON,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var rand = Math.floor(Math.random() * 3);
				if(rand < 1) {
					skeltonNoises.play('noise1');
				} else if(rand < 2) {
					skeltonNoises.play('noise2');
				} else if(rand < 3) {
					skeltonNoises.play('noise3');
				} else {
					skeltonNoises.play('noise4');
				}
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			skeltonNoises.play('death1');
			this.kill();
		},
		deathDrop: function() {
			console.log("Skelton death drop");
		},
		addWeapon: function() {
			var rand = Math.floor(session.prng.nextFloat() * 4);
			if(rand < 1) {
				return EnumCreatureWeapon.BONE_AXE;
			} else if(rand < 2) {
				return EnumCreatureWeapon.BONE_CROSSBOW;
			} else {
				return EnumCreatureWeapon.BONE_SWORD;
			}
		},
		setAiType: function() {
			if(this.weapon.name === "Bone Crossbow") {
				this.ai.type = EnumAi.SKELTON_ARCHER;
			}
		}
	},
	{
		name: 'Green Sludgie',
		currentSprite: { x: 3, y: 4 },
		vars: {
			speed: 2,
			maxHP: 3,
			currentHP: 3,
			minFacingChangeTime: 50,
			score: 75
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{x:0,y:8}, {x:1,y:8}, {x:2,y:8}, {x:3,y:8}, {x:4,y:8}, {x:5,y:8},
				{x:0,y:9}, {x:1,y:9}, {x:2,y:9}, {x:3,y:9}, {x:4,y:9}, {x:5,y:9},
				{x:6,y:8}, {x:7,y:8}, {x:8,y:8}, {x:6,y:9},	{x:7,y:9}, {x:8,y:9}
			],
			animations: [
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [0, 1, 2, 1, 0, 1] ],		//	Resting, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [6, 7, 8, 7, 6, 7] ],		//	Resting, facing L
				[ 1000, [150, 300, 700, 850, 1000], [3, 4, 5, 4, 3] ],					//	Moving, facing R
				[ 1000, [150, 300, 700, 850, 1000], [9, 10, 11, 10, 9] ],				//	Moving, facing L
				[ 2400, [800, 1600, 2400], [12, 13, 14]],								//	Death, facing R
				[ 2400, [800, 1600, 2400], [15, 16, 17]]								//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 7,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.GREEN_SLUDGIE,
		},
		touchDamage: function() {
			return 1;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Camp Vamp',
		currentSprite: { x: 0, y: 10 },
		vars: {
			speed: 0.7,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			minFacingChangeTime: 50,
			transformStartTime: 0,
			transformEndTime: 0,
			isBat: false,
			score: 250
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 10 },
				{ x: 1, y: 10 },
				{ x: 2, y: 10 },
				{ x: 3, y: 10 },
				{ x: 4, y: 10 },
				{ x: 5, y: 10 },
				{ x: 6, y: 10 },
				{ x: 7, y: 10 },
				{ x: 8, y: 10 },
				{ x: 9, y: 10 },
				{ x: 10, y: 10 },
				{ x: 11, y: 10 },
				{ x: 12, y: 10 },
				{ x: 13, y: 10 },
				{ x: 0, y: 11 },
				{ x: 1, y: 11 },
				{ x: 2, y: 11 },
				{ x: 3, y: 11 },
				{ x: 4, y: 11 },
				{ x: 5, y: 11 },
				{ x: 6, y: 11 },
				{ x: 7, y: 11 },
				{ x: 8, y: 11 },
				{ x: 9, y: 11 },
				{ x: 10, y: 11 },
				{ x: 11, y: 11 },
				{ x: 12, y: 11 },
				{ x: 13, y: 11 }
			],
			animations: [
				[ 500, [300, 500], [0, 1] ],																	//	Resting, facing R
				[ 500, [300, 500], [14, 15] ],																	//	Resting, facing L
				[ 400, [100, 200, 300, 400], [6, 8, 7, 9] ],													//	Moving, facing R
				[ 400, [100, 200, 300, 400], [20, 22, 21, 23] ],												//	Moving, facing L
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 600, [100, 200, 300, 400, 500, 600], [14, 15, 16, 17, 18, 19] ],								//	Transform into bat
				[ 600, [100, 200, 300, 400, 500, 600], [19, 18, 17, 16, 15, 14] ],								//	Transform back from bat
				[ 200, [50, 100, 150, 200], [2, 3, 4, 5] ]														//	Moving as bat
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.CAMP_VAMP,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else if(!this.vars.isBat) {
				this.ai.nextAction = 3;
				clearAiAction(this);
			} else {
				this.ai.nextAction = 4;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.VAMP_DAGGER;
		}
	},
	{
		name: 'Urk',
		currentSprite: { x: 0, y: 12},
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 60
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 12 },	//	Resting facing R 1
				{ x: 1, y: 12 },	//	Resting facing R 2
				{ x: 2, y: 12 },	//	Moving facing R 1
				{ x: 3, y: 12 },	//	Moving facing R 2
				{ x: 4, y: 12 },	//	Moving facing R 3
				{ x: 5, y: 12 },	//	Death facing R 1
				{ x: 6, y: 12 },	//	Death facing R 2
				{ x: 7, y: 12 },	//	Death facing R 3
				{ x: 0, y: 13 },	//	Resting facing L 1
				{ x: 1, y: 13 },	//	Resting facing L 2
				{ x: 2, y: 13 },	//	Moving facing L 1
				{ x: 3, y: 13 },	//	Moving facing L 2
				{ x: 4, y: 13 },	//	Moving facing L 3
				{ x: 5, y: 13 },	//	Death facing L 1
				{ x: 6, y: 13 },	//	Death facing L 2
				{ x: 7, y: 13 }		//	Death facing L 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 8, 9] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.URK,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var rand = Math.floor(Math.random() * 3);
				if(rand < 1) {
					urkGrunts.play('grunt5');
				} else if(rand < 2) {
					urkGrunts.play('grunt6');
				} else {
					urkGrunts.play('grunt7');
				}
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			var rand = Math.floor(Math.random() * 2);
			if(rand < 1) {
				urkGrunts.play('death1');
			} else {
				urkGrunts.play('death2');
			}
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.URK_SWORD;
		}	
	},
	{
		name: 'Urk Shaman',
		currentSprite: { x: 0, y: 14},
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 80
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 14 },	//	Resting facing R 1
				{ x: 1, y: 14 },	//	Resting facing R 2
				{ x: 2, y: 14 },	//	Moving facing R 1
				{ x: 3, y: 14 },	//	Moving facing R 2
				{ x: 4, y: 14 },	//	Moving facing R 3
				{ x: 5, y: 14 },	//	Death facing R 1
				{ x: 6, y: 14 },	//	Death facing R 2
				{ x: 7, y: 14 },	//	Death facing R 3
				{ x: 0, y: 15 },	//	Resting facing L 1
				{ x: 1, y: 15 },	//	Resting facing L 2
				{ x: 2, y: 15 },	//	Moving facing L 1
				{ x: 3, y: 15 },	//	Moving facing L 2
				{ x: 4, y: 15 },	//	Moving facing L 3
				{ x: 5, y: 15 },	//	Death facing L 1
				{ x: 6, y: 15 },	//	Death facing L 2
				{ x: 7, y: 15 }		//	Death facing L 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 8, 9] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 15,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.URK,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var rand = Math.floor(Math.random() * 3);
				if(rand < 1) {
					urkGrunts.play('grunt5');
				} else if(rand < 2) {
					urkGrunts.play('grunt6');
				} else {
					urkGrunts.play('grunt7');
				}
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			var rand = Math.floor(Math.random() * 2);
			if(rand < 1) {
				urkGrunts.play('death1');
			} else {
				urkGrunts.play('death2');
			}
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.URK_SWORD;
		}	
	},
	{
		name: 'Hulking Urk',
		currentSprite: { x: 0, y: 16},
		vars: {
			speed: 0.4,
			maxHP: 10,
			currentHP: 10,
			restingWeaponAnimation: true,
			score: 120
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 2, y: 2 },
			y_padding: 5,
			frames: [
				{ x: 0, y: 16 },	//	Resting facing R 1
				{ x: 2, y: 16 },	//	Resting facing R 2
				{ x: 4, y: 16 },	//	Moving facing R 1
				{ x: 6, y: 16 },	//	Moving facing R 2
				{ x: 8, y: 16 },	//	Moving facing R 3
				{ x: 10, y: 16 },	//	Moving facing R 4
				{ x: 12, y: 16 },	//	Death facing R 1
				{ x: 14, y: 16 },	//	Death facing R 2
				{ x: 16, y: 16 },	//	Death facing R 3
				{ x: 18, y: 16 },	//	Death facing R 3
				{ x: 0, y: 18 },	//	Resting facing L 1
				{ x: 2, y: 18 },	//	Resting facing L 2
				{ x: 4, y: 18 },	//	Moving facing L 1
				{ x: 6, y: 18 },	//	Moving facing L 2
				{ x: 8, y: 18 },	//	Moving facing L 3
				{ x: 10, y: 18 },	//	Moving facing L 4
				{ x: 12, y: 18 },	//	Death facing L 1
				{ x: 14, y: 18 },	//	Death facing L 2
				{ x: 16, y: 18 },	//	Death facing L 3
				{ x: 18, y: 18 },	//	Death facing L 3
				{ x: 20, y: 16 },	//	Bezerk facing R 1
				{ x: 22, y: 16 },	//	Bezerk facing R 2
				{ x: 20, y: 18 },	//	Bezerk facing L 1
				{ x: 22, y: 18 }	//	Bezerk facing L 2
			],
			animations: [
				[ 1000, [600, 800], [ 0, 1] ],									//	Resting, facing R
				[ 1000, [600, 800], [ 10, 11] ],								//	Resting, facing L
				[ 1000, [200, 400, 600, 800, 1000], [ 2, 3, 4, 0, 5 ] ],		//	Moving, facing R
				[ 1000, [200, 400, 600, 800, 1000], [ 12,13,14,10,15 ] ],		//	Moving, facing L
				[ 2000, [600, 1100, 1500, 2000], [6, 7, 8, 9 ] ],				//	Death, facing R
				[ 2000, [600, 1100, 1500, 2000], [16,17,18,19] ],				//	Death, facing L
				[ 200, [100, 200], [20, 21] ],							//	Bezerk, facing R
				[ 200, [100, 200], [22, 23] ],							//	Bezerk, facing L
			]
		},
		box: {
			width: 18, 
			height: 24,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.HULKING_URK,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				if(!this.vars.bezerkAttacks) {
					var action = Math.floor(Math.random() * 3);
					if(action < 1) {
						this.ai.nextAction = 4;
					} else {
						this.ai.nextAction = 2;
					}
					clearAiAction(this);
				}
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.HULKING_URK_HAMMA;
		}	
	},
	{
		name: 'Kob',
		currentSprite: { x: 0, y: 20},
		vars: {
			speed: 0.8,
			maxHP: 4,
			currentHP: 4,
			restingWeaponAnimation: true,
			score: 65
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 20 },	//	Resting facing R 1
				{ x: 1, y: 20 },	//	Resting facing R 2
				{ x: 2, y: 20 },	//	Moving facing R 1
				{ x: 3, y: 20 },	//	Moving facing R 2
				{ x: 4, y: 20 },	//	Moving facing R 3
				{ x: 5, y: 20 },	//	Death facing R 1
				{ x: 6, y: 20 },	//	Death facing R 2
				{ x: 7, y: 20 },	//	Death facing R 3
				{ x: 0, y: 21 },	//	Resting facing L 1
				{ x: 1, y: 21 },	//	Resting facing L 2
				{ x: 2, y: 21 },	//	Moving facing L 1
				{ x: 3, y: 21 },	//	Moving facing L 2
				{ x: 4, y: 21 },	//	Moving facing L 3
				{ x: 5, y: 21 },	//	Death facing L 1
				{ x: 6, y: 21 },	//	Death facing L 2
				{ x: 7, y: 21 }		//	Death facing L 3
			],
			animations: [
				[ 600, [400, 600], [ 0, 1] ],											//	Resting, facing R
				[ 600, [400, 600], [ 8, 9] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.KOB,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.KOB_MACE;
		}	
	},
	{
		name: 'Mumi',
		currentSprite: { x: 7, y: 4 },
		vars: {
			speed: 0.8,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: false,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 7, y: 4 },
				{ x: 8, y: 4 },
				{ x: 9, y: 4 },
				{ x: 10, y: 4 },
				{ x: 11, y: 4 },
				{ x: 12, y: 4 },
				{ x: 13, y: 4 },
				{ x: 14, y: 4 },
				{ x: 15, y: 4 },
				{ x: 7, y: 5 },
				{ x: 8, y: 5 },
				{ x: 9, y: 5 },
				{ x: 10, y: 5 },
				{ x: 11, y: 5 },
				{ x: 12, y: 5 },
				{ x: 13, y: 5 },
				{ x: 14, y: 5 },
				{ x: 15, y: 5 }
			],
			animations: [
				[ 800, [400, 800], [0, 1] ],							//	Resting, facing R
				[ 800, [400, 800], [9, 10] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 1] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [11,12,13,10] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [5, 6, 7, 8]],				//	Death, facing R
				[ 800, [200, 400, 600, 800], [14,15,16,17]]				//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.MUMI,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BONE_SWORD;
		}
	},
	{
		name: 'Sneaky Skelton',
		currentSprite: { x: 6, y: 4 },
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 4 },
				{ x: 1, y: 4 },
				{ x: 2, y: 4 },
				{ x: 3, y: 4 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 0, y: 5 },
				{ x: 1, y: 5 },
				{ x: 2, y: 5 },
				{ x: 3, y: 5 },
				{ x: 4, y: 5 },
				{ x: 5, y: 5 },
				{ x: 6, y: 5 }
			],
			animations: [
				[ 1000, [1000], [0] ],									//	Resting, facing R
				[ 1000, [1000], [7] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 3, 2, 0] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 10, 9, 7] ],			//	Moving, facing L
				[ 2000, [500, 1000, 2000], [4, 5, 6]],					//	Death, facing R
				[ 2000, [500, 1000, 2000], [11, 12, 13]],				//	Death, facing L
				[ 1000, [200, 400, 1000], [6, 5, 4]],					//	Ambush, facing R
				[ 1000, [200, 400, 1000], [13, 12, 11]],				//	Ambush, facing L
				[ 250, [250], [6]],										//	Lying in wait, facing R
				[ 250, [250], [13]]										//	Lying in wait, facing L
			]
		},
		box: {
			width: 8, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.SNEAKY_SKELTON,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BONE_SWORD;
		}
	},
	{
		name: 'Blue Squark',
		currentSprite: { x: 9, y: 2},
		vars: {
			speed: 1,
			maxHP: 4,
			currentHP: 4,
			restingWeaponAnimation: true,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 9, y: 2 },		//	Resting facing R 1
				{ x: 10, y: 2 },	//	Resting facing R 2
				{ x: 11, y: 2 },	//	Moving facing R 1
				{ x: 12, y: 2 },	//	Moving facing R 2
				{ x: 13, y: 2 },	//	Moving facing R 3
				{ x: 14, y: 2 },	//	Death facing R 1
				{ x: 15, y: 2 },	//	Death facing R 2
				{ x: 16, y: 2 },	//	Death facing R 3
				{ x: 17, y: 2 },	//	Death facing R 4
				{ x: 9, y: 3 },		//	Resting facing L 1
				{ x: 10, y: 3 },	//	Resting facing L 2
				{ x: 11, y: 3 },	//	Moving facing L 1
				{ x: 12, y: 3 },	//	Moving facing L 2
				{ x: 13, y: 3 },	//	Moving facing L 3
				{ x: 14, y: 3 },	//	Death facing L 1
				{ x: 15, y: 3 },	//	Death facing L 2
				{ x: 16, y: 3 },	//	Death facing L 3
				{ x: 17, y: 3 }		//	Death facing L 4
			],
			animations: [
				[ 600, [400, 600], [ 0, 1] ],											//	Resting, facing R
				[ 600, [400, 600], [ 9, 10] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 11,12,13,10 ] ],							//	Moving, facing L
				[ 1400, [800, 1000, 1200, 1400], [5, 6, 7, 8 ] ],									//	Death, facing R
				[ 1400, [800, 1000, 1200, 1400], [14,15,16,17] ]									//	Death, facing L
			]
		},
		box: {
			width: 16, 
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
			type: EnumAi.SKELTON_ARCHER,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.SQUARK_KNIFE;
		}	
	},
	{
		name: 'Zombi',
		currentSprite: { x: 12, y: 0},
		vars: {
			speed: 0.4,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 12, y: 0 },	//	Moving facing R 1
				{ x: 13, y: 0 },	//	Moving facing R 2
				{ x: 14, y: 0 },	//	Moving facing R 3
				{ x: 15, y: 0 },	//	Moving facing R 4
				{ x: 16, y: 0 },	//	Death facing R 1
				{ x: 17, y: 0 },	//	Death facing R 2
				{ x: 18, y: 0 },	//	Death facing R 3
				{ x: 12, y: 1 },	//	Moving facing L 1
				{ x: 13, y: 1 },	//	Moving facing L 2
				{ x: 14, y: 1 },	//	Moving facing L 3
				{ x: 15, y: 1 },	//	Moving facing L 4
				{ x: 16, y: 1 },	//	Death facing L 1
				{ x: 17, y: 1 },	//	Death facing L 2
				{ x: 18, y: 1 },	//	Death facing L 3
				{ x: 19, y: 0 },	//	Biting facing R 1
				{ x: 20, y: 0 },	//	Biting facing R 2
				{ x: 19, y: 1 },	//	Biting facing L 1
				{ x: 20, y: 1 }		//	Biting facing L 2
			],
			animations: [
				[ 200, [200], [0] ],											//	Resting, facing R
				[ 200, [200], [7] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 0, 1, 2, 3 ] ],					//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 7, 8, 9,10 ] ],					//	Moving, facing L
				[ 600, [200, 400, 600], [4, 5, 6] ],							//	Death, facing R
				[ 600, [200, 400, 600], [11,12,13] ],							//	Death, facing L
				[ 400, [200, 300, 400], [14,15,0] ],							//	Biting, facing R
				[ 400, [200, 300, 400], [16,17,7] ],							//	Biting, facing L
				[ 200, [200], [6] ],											//	Dead, facing R
				[ 600, [200], [13] ],											//	Dead, facing L
				[ 600, [200, 400, 600], [6, 5, 4] ],							//	Reanimate, facing R
				[ 600, [200, 400, 600], [13,12,11] ]							//	Reanimate, facing L
			]
		},
		box: {
			width: 10, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.ZOMBI,
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ZOMBI_BITE;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			if(!this.vars.dead) {
				addScore(this.vars.score);
				this.vars.score = 0;														//	Override score so repeat kills do not earn extra points
				this.vars.dead = true;
				this.vars.moveThroughColliders = true;
				this.ai.nextAction = 1;														//	Prevent further AI actions
				this.movement.speed = 0;													//	Zero speed
				this.movement.moving = false;												//	Stop moving
				this.position.x = Math.floor(this.position.x);								//	Round co-ords down to prevent blurred drawing on canvas
				this.position.y = Math.floor(this.position.y);
				this.vars.animStart = performance.now();									//	Set animation start time to now...
				if(this.vars.facingRight) {													//	...and set death animation
					this.vars.animation = 4;
				} else {
					this.vars.animation = 5;
				}
				this.ai.nextAction = 1;
				// this.vars.deathTime = performance.now() + this.sprite.animations[this.vars.animation][0] - 100;		//	Set deathTime to be current time plus duration of death animation minus 100ms
			}
		}
	},
	{
		name: 'Zombi Master',
		currentSprite: { x: 21, y: 0},
		vars: {
			speed: 0.8,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 300
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 21, y: 0 },	//	Resting facing R 1
				{ x: 22, y: 0 },	//	Resting facing R 2
				{ x: 23, y: 0 },	//	Moving facing R 1
				{ x: 24, y: 0 },	//	Moving facing R 2
				{ x: 25, y: 0 },	//	Moving facing R 3
				{ x: 26, y: 0 },	//	Moving facing R 4
				{ x: 27, y: 0 },	//	Death facing R 1
				{ x: 28, y: 0 },	//	Death facing R 2
				{ x: 29, y: 0 },	//	Death facing R 3
				{ x: 30, y: 0 },	//	Death facing R 4
				{ x: 31, y: 0 },	//	Death facing R 5
				{ x: 21, y: 1 },	//	Resting facing L 1
				{ x: 22, y: 1 },	//	Resting facing L 2
				{ x: 23, y: 1 },	//	Moving facing L 1
				{ x: 24, y: 1 },	//	Moving facing L 2
				{ x: 25, y: 1 },	//	Moving facing L 3
				{ x: 26, y: 1 },	//	Moving facing L 4
				{ x: 27, y: 1 },	//	Death facing L 1
				{ x: 28, y: 1 },	//	Death facing L 2
				{ x: 29, y: 1 },	//	Death facing L 3
				{ x: 30, y: 1 },	//	Death facing L 4
				{ x: 31, y: 1 } 	//	Death facing L 5
			],
			animations: [
				[ 800, [500, 800], [0, 1] ],									//	Resting, facing R
				[ 800, [500, 800], [11,12] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],					//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 13,14,15,16 ] ],					//	Moving, facing L
				[ 1500, [300, 600, 900, 1200, 1500], [6, 7, 8, 9, 10] ],		//	Death, facing R
				[ 1500, [300, 600, 900, 1200, 1500], [17,18,19,20,21] ]			//	Death, facing L
			]
		},
		box: {
			width: 12, 
			height: 16,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.ZOMBI_MASTER,
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ZOMBI_MASTER_STAFF;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			this.kill();
		}
	},
	{
		name: 'Air Elemental',
		currentSprite: { x: 8, y: 20},
		vars: {
			speed: 0.4,
			maxHP: 5,
			currentHP: 5,
			moveThroughColliders: false,
			foreground: true,
			score: 175
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 8, y: 20 },
				{ x: 9, y: 20 },
				{ x: 10, y: 20 },
				{ x: 11, y: 20 },
				{ x: 8, y: 22 },
				{ x: 9, y: 22 },
				{ x: 10, y: 22 },
				{ x: 11, y: 22 }
			],
			animations: [
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 6, 7] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 6, 7] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 6, 7] ]						//	Resting, facing L
			]
		},
		box: {
			width: 10, 
			height: 25,
			type: EnumBoxtype.CREATURE
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: true
		},
		ai: {
			type: EnumAi.MINI_GHOST,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			this.kill();
		}
	}
];
