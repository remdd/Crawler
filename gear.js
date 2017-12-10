var playerWeapons = [
	{
		name: 'Knife',
		vars: {
			sprite: { x: 0, y: 4},
			animTime: 150,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 400,
			drawOffset: { x: 0, y: 0 }
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
				x: TILE_SIZE * -0.25,
				y: TILE_SIZE * -0.25
			},
			attackDrawOffset: {
				x: 0,
				y: -TILE_SIZE * 0.6
			}
		},
		attack: {
			reach: TILE_SIZE * 0.8,						//	Reach of attack from centre of player object position
			type: EnumAttack.SWIPE,
			displayTime: 50,
			swipeColor1: 'rgba(255,255,255,0)',
			swipeColor2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Sword',
		vars: {
			sprite: { x: 1, y: 4},
			animTime: 150,								//	Length of time the weapon stays animated after attack
			hasAttackVariants: true,					//	True if has 2 attack variants
			lastAttackVariant: 0,						//	Hold variant of last attack - 0 or 1
			lastAttackDirection: 0,						//	Store direction of last attack
			attackRate: 500,
			drawOffset: { x: 0, y: 0 }
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
				{ x: 1, y: 4 },							//	Right facing
				{ x: 1.5, y: 4 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -0.25,
				y: -TILE_SIZE / 4
			},
			attackDrawOffset: {
				x: 0,
				y: -TILE_SIZE / 2
			}
		},
		attack: {
			reach: TILE_SIZE,						//	Reach of attack from centre of player object position
			type: EnumAttack.SWIPE,
			displayTime: 50,
			swipeColor1: 'rgba(255,255,255,0)',
			swipeColor2: 'rgb(70,0,160)',
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}
];