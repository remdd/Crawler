
var creatureWeapons = [
	{},				//	0 is blank - not a weapon!
		//	1
	{
		name: 'Green Goblin Claw',
		currentSprite: { x: -1, y: -1},
		use: function(direction) {
			if(this.holder.vars.facingRight) {
				this.currentSprite = this.sprite.frames[2];
			} else {
				this.currentSprite = this.sprite.frames[3];
			}
			this.swipe(direction);
			// this.vars.hidden = false;
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			// this.vars.hidden = true;
			this.vars.attacking = false;
		},
		vars: {
			// hidden: true,
			animTime: 100,								//	Length of time the weapon stays animated after attack
			attackRate: 800,
			drawOffset: { x: 0, y: 0 },
			foreground: false
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: -1, y: -1},							//	Resting - no sprite
				{ x: -1, y: -1},							//	Resting - no sprite
				{ x: 2, y: 6 },								//	Right facing
				{ x: 2.5, y: 6 }							//	Left facing
			],
			restingDrawOffset: {
				x: 0,
				y: 0
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE * 0.7,						//	Reach of attack from centre of creature position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			color1: 'rgba(255,102,0,0)',
			color2: '#ff944d',
			swipeThickness: 0.85,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	2
	{
		name: 'Bone Sword',
		currentSprite: { x: 0, y: 6},
		use: function(direction) {
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 250,								//	Length of time the weapon stays animated after attack
			attackRate: 500,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 0, y: 6 },							//	Right facing
				{ x: 0.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -4/16,
				y: TILE_SIZE * -4/16
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 50,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	3
	{
		name: 'Bone Axe',
		currentSprite: { x: 1, y: 6},
		use: function(direction) {
			this.chop(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 800,								//	Length of time the weapon stays animated after attack
			attackRate: 1000,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 1, y: 6 },							//	Right facing
				{ x: 1.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -2/16,
				y: TILE_SIZE * -5/16
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 50,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	4
	{
		name: 'Vamp Dagger',
		currentSprite: { x: 4, y: 6},
		use: function(direction) {
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 200,								//	Length of time the weapon stays animated after attack
			attackRate: 100,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 4, y: 6 },							//	Right facing
				{ x: 4.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -0.25,
				y: TILE_SIZE * -3/16
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 200,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	5
	{

		name: 'Urk Sword',
		currentSprite: { x: 2, y: 7},
		use: function(direction) {
			var rand = Math.floor(Math.random() * 4);
			if(rand < 1) {
				urkGrunts.play('grunt1');
			} else if(rand < 2) {
				urkGrunts.play('grunt2');
			} else if(rand < 3) {
				urkGrunts.play('grunt3');
			} else if(rand < 4) {
				urkGrunts.play('grunt4');
			}
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 500,								//	Length of time the weapon stays animated after attack
			attackRate: 1000,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 2, y: 7 },							//	Right facing
				{ x: 2.5, y: 7 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -5/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -10/16
			}
		},
		attack: {
			reach: TILE_SIZE * 1.125,					//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 150,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	6
	{
		name: 'Bone Crossbow',
		currentSprite: { x: 2, y: 7},
		use: function(direction) {
			this.shoot(direction, this.projectile);
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 200,								//	Length of time the weapon stays animated after attack
			attackRate: 1000,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true,
			displayTime: 1000,
			aimTime: 500
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 3, y: 7 },							//	Right facing
				{ x: 3, y: 7.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 2/16,
				y: TILE_SIZE * 1/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 1/16,
				y: TILE_SIZE * 1/16
			}
		},
		attack: {
			type: EnumAttack.ARROW
		},
		projectile: EnumCreatureProjectile.BONE_ARROW
	},
		//	7
	{
		name: 'Hulking Urk Hamma',
		currentSprite: { x: 5, y: 6},
		use: function(direction) {
			this.chop(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 800,								//	Length of time the weapon stays animated after attack
			attackRate: 1200,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 1,
				y: 2
			},
			frames: [
				{ x: 5, y: 6 },							//	Right facing
				{ x: 6, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -5/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 3/16,
				y: TILE_SIZE * -12/16
			}
		},
		attack: {
			reach: TILE_SIZE * 28/16,					//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 200,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 3* Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	8
	{
		name: 'Kob Mace',
		currentSprite: { x: 7, y: 6},
		use: function(direction) {
			this.chop(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 300,								//	Length of time the weapon stays animated after attack
			attackRate: 600,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 7, y: 6 },							//	Right facing
				{ x: 7.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -3/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -8/16
			}
		},
		attack: {
			reach: TILE_SIZE * 14/16,					//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Zombi Bite',
		currentSprite: { x: -1, y: -1},
		use: function(direction) {
			if(this.holder.vars.facingRight) {
				this.currentSprite = this.sprite.frames[0];
			} else {
				this.currentSprite = this.sprite.frames[0];
			}
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			// this.vars.hidden = true;
			this.vars.attacking = false;
		},
		vars: {
			hidden: true,
			animTime: 100,								//	Length of time the weapon stays animated after attack
			attackRate: 800,
			drawOffset: { x: 0, y: 0 },
			foreground: false
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: -1, y: -1},							//	Resting - no sprite
				{ x: -1, y: -1}							//	Resting - no sprite
			],
			restingDrawOffset: {
				x: 0,
				y: 0
			},
			attackDrawOffset: {
				x: 0,
				y: TILE_SIZE * -0.6
			}
		},
		attack: {
			reach: TILE_SIZE * 0.75,						//	Reach of attack from centre of creature position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			color1: 'rgba(255,102,0,0)',
			color2: '#ff944d',
			swipeThickness: 0.85,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: "Zombi Master's Staff",
		currentSprite: { x: 7, y: 7},
		use: function(direction) {
			this.chop(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},

		vars: {
			animTime: 1000,								//	Length of time the weapon stays animated after attack
			attackRate: 2000,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 7, y: 7 },							//	Right facing
				{ x: 7.5, y: 7 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -3/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -8/16
			}
		},
		attack: {
			reach: TILE_SIZE * 14/16,					//	Reach of attack from centre of player object position
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Squark Knife',
		currentSprite: { x: 8, y: 6},
		use: function(direction) {
			this.vars.hidden = true;
			this.shoot(direction, this.projectile);
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.hidden = false;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 300,								//	Length of time the weapon stays animated after attack
			attackRate: 500,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true,
			displayTime: 1000,
			aimTime: 50
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 8, y: 6 },							//	Right facing
				{ x: 8.5, y: 6 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -3/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * -3/16,
				y: TILE_SIZE * -2/16
			}
		},
		attack: {
			type: EnumAttack.ARROW
		},
		projectile: EnumCreatureProjectile.SQUARK_KNIFE
	}
];

var creatureProjectiles = [
	{},
	{
		name: 'Bone Arrow',
		currentSprite: { x: 4, y: 7 },
		vars: { 
			drawOffset: { x: 0, y: 0},
			displayTime: 800,
			damagePlayer: true,
			damageCreatures: false,
			rotation: 0
		},
		sprite: { 
			size: { x:1, y:0.5 },
			spriteSheet: monsterSprites,
			y_padding: 1,
			frames: [
				{ x: 4, y: 7 },
				{ x: 4, y: 7.5 }
			]
		},
		position: { x: 0, y: 0 },
		box: {
			width: 1,
			height: 1,
			type: EnumBoxtype.PROJECTILE
		},
		movement: {
			speed: 5,
			bounceOff: false
		},
		damage: function(target) {
			target.inflictDamage(1);
		},
		type: EnumAttack.ARROW,
		maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
	},
	{
		name: 'Thrown Squark Knife',
		currentSprite: { x: 8, y: 6 },
		vars: { 
			drawOffset: { x: 0, y: 0},
			displayTime: 800,
			damagePlayer: true,
			damageCreatures: false,
			rotation: Math.PI / 2
		},
		sprite: { 
			size: { x:0.5, y:1 },
			spriteSheet: monsterSprites,
			y_padding: 1,
			frames: [
				{ x: 8, y: 6 },
				{ x: 8.5, y: 6 }
			]
		},
		position: { x: 0, y: 0 },
		box: {
			width: 1,
			height: 1,
			type: EnumBoxtype.PROJECTILE
		},
		movement: {
			speed: 5,
			bounceOff: false
		},
		damage: function(target) {
			target.inflictDamage(1);
		},
		type: EnumAttack.ARROW,
		maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
	}

];

