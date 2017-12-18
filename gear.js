var playerWeapons = [
	{
		name: 'Knife',
		currentSprite: { x: 0, y: 4},
		use: function(direction) {
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 150,								//	Length of time the weapon stays animated after attack
			attackRate: 400,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 0, y: 4 },							//	Right facing
				{ x: 0.5, y: 4 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -4/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE * 0.8,						//	Reach of attack from centre of player object position
			damagePlayer: false,
			damageCreatures: true,
			type: EnumAttack.SWIPE,
			displayTime: 50,
			color1: 'rgba(255,255,255,0)',
			color2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}

];