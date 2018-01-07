
var creatureWeapons = [
	{},				//	0 is blank - not a weapon!
		//	1
	{
		name: 'Green Goblin Claw',
		lode: EnumLode.CLAW,
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
			swipeThickness: 0.85,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	2
	{
		name: 'Bone Sword',
		lode: EnumLode.BONE,
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
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	3
	{
		name: 'Bone Axe',
		lode: EnumLode.BONE,
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
			criticalMax: 2,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 50,
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	4
	{
		name: 'Vamp Dagger',
		lode: EnumLode.LIGHTNING,
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
			criticalMax: 3,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 200,
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	5
	{

		name: 'Urk Sword',
		lode: EnumLode.IRON,
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
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	6
	{
		name: 'Bone Crossbow',
		lode: EnumLode.BONE,
		currentSprite: { x: 2, y: 7},
		use: function(direction) {
			this.shoot(direction, this.projectile, true);
			return false;
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
		lode: EnumLode.IRON,
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
			baseDamage: 2,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 200,
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 3* Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
		//	8
	{
		name: 'Kob Mace',
		lode: EnumLode.IRON,
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
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Zombi Bite',
		lode: EnumLode.BITE,
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
			swipeThickness: 0.85,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: "Zombi Master's Staff",
		lode: EnumLode.ACID,
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
			reach: TILE_SIZE * 18/16,					//	Reach of attack from centre of player object position
			criticalMax: 3,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Squark Knife',
		lode: EnumLode.WATER,
		currentSprite: { x: 8, y: 6},
		use: function(direction) {
			if(getPlayerDistance(this.holder) < TILE_SIZE * 1.5) {
				this.swipe(direction);
				return this.attack;
			} else {
				this.vars.hidden = true;
				this.shoot(direction, this.projectile, true);
				return false;
			}
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
				y: TILE_SIZE * -1/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * -3/16,
				y: TILE_SIZE * -2/16
			}
		},
		attack: {
			reach: TILE_SIZE,							//	Reach of attack from centre of player object position
			criticalMax: 2,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,						//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		},
		projectile: EnumCreatureProjectile.SQUARK_KNIFE
	},
	{
		name: "Urk Shaman's Staff",
		lode: EnumLode.FIRE,
		currentSprite: { x: 8, y: 7},
		use: function(direction) {
			if(getPlayerDistance(this.holder) < TILE_SIZE * 1.5) {
				this.chop(direction);
				return this.attack;
			} else {
				var fireballs = Math.floor(Math.random() * 4) + 1;
				for(var i = 0; i < fireballs; i++) {
					this.shoot(direction, this.projectile, false, true);
				}
				return false;
			}
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 500,								//	Length of time the weapon stays animated after attack
			attackRate: 1500,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true,
			displayTime: 1000,
			aimTime: 100
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 8, y: 7 },							//	Right facing
				{ x: 8.5, y: 7 }						//	Left facing
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
			reach: TILE_SIZE * 18/16,					//	Reach of attack from centre of player object position
			criticalMax: 3,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 4,						//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		},
		projectile: EnumCreatureProjectile.URK_SHAMAN_FIREBALL
	},
	{
		name: "Black Knight's Sword",
		lode: EnumLode.SHADOW,
		currentSprite: { x: 16, y: 4},
		use: function(direction) {
			console.log("Attacking!");
			this.position.y -= 8;
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			this.position.y += 8;
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 400,								//	Length of time the weapon stays animated after attack
			attackRate: 500,							//	Time to rest after attack
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: monsterSprites,
			size: {
				x: 0.5,
				y: 2
			},
			frames: [
				{ x: 16, y: 4 },							//	Right facing
				{ x: 16.5, y: 4 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -4/16,
				y: TILE_SIZE * 3/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * -0/16,
				y: TILE_SIZE * -8/16
			},
			attackPositionOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * 8/16
			}
		},
		attack: {
			reach: TILE_SIZE * 26/16,					//	Reach of attack from centre of player object position
			baseDamage: 2,
			criticalMax: 3,
			damagePlayer: true,
			damageCreatures: false,
			type: EnumAttack.SWIPE,
			displayTime: 100,
			swipeThickness: 0.7,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: 1 * Math.PI / 2,
			maxHits: 1,									//	Number of contact points per swipe that can successfully resolve as hits
			attackPositionOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * 8/16
			}
		}
	}
];

var creatureProjectiles = [
	{},
	{
		name: 'Bone Arrow',
		lode: EnumLode.BONE,
		currentSprite: { x: 4, y: 7 },
		vars: { 
			drawOffset: { x: 0, y: 0},
			displayTime: 800,
			damagePlayer: true,
			damageCreatures: true,
			rotation: 0,
			sticky: true
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
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 2,
				lode: EnumLode.NONE
			}
			return touchDamage;
		},
		type: EnumAttack.ARROW,
		maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
	},
	{
		name: 'Thrown Squark Knife',
		lode: EnumLode.WATER,
		currentSprite: { x: 8, y: 6 },
		vars: { 
			drawOffset: { x: 0, y: 0},
			displayTime: 800,
			damagePlayer: true,
			damageCreatures: true,
			rotation: Math.PI / 2,
			sticky: true
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
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 2,
				lode: EnumLode.WATER
			}
			return touchDamage;
		},
		type: EnumAttack.ARROW,
		maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
	},
	{
		name: 'Urk Shaman Fireball',
		lode: EnumLode.FIRE,
		currentSprite: { x: 9, y: 6 },
		vars: { 
			drawOffset: { x: 0, y: 0},
			displayTime: 1000,
			damagePlayer: true,
			damageCreatures: false,
			animated: true,
			animation: 0,
			explodeOnImpact: true,
			rotation: -Math.PI / 2,
			spinFactor: 0.05
		},
		sprite: { 
			size: { x:0.5, y:1 },
			spriteSheet: monsterSprites,
			y_padding: 1,
			frames: [
				{ x: 9, y: 6 },
				{ x: 9.5, y: 6 },
				{ x: 10, y: 6 },
				{ x: 10.5, y: 6 },
				{ x: 11, y: 6 },
				{ x: 11.5, y: 6 },
				{ x: -1, y: -1 }
			],
			animations: [
				[ 200, [50, 100, 150, 200], [0, 1, 2, 3] ],						//	In flight
				[ 1500, [150, 300, 1500], [4, 5, 6] ]								//	Explosion
			]
		},
		position: { x: 0, y: 0 },
		box: {
			width: 4,
			height: 4,
			type: EnumBoxtype.PROJECTILE
		},
		movement: {
			speed: 2.5,
			bounceOff: false
		},
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 2,
				lode: EnumLode.FIRE
			}
			return touchDamage;
		},
		type: EnumAttack.FIREBALL,
		maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
	}

];

spinOffProjectile = function(projectile, spinFactor) {
	projectile.vars.spinOff = 0;
	var rand = Math.floor(Math.random() * 5);
	if(rand < 1) {
		spinFactor *= 5;
	}
	projectile.vars.spinOff += Math.random() * spinFactor;
	projectile.vars.spinOff -= Math.random() * spinFactor;
}