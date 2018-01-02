var pickupTemplates = [
	{},
	{
		name: 'Health heart',
		currentSprite: {x:3,y:4},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 0.5,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x: 3, y: 4 },
				{ x: 3.5, y: 4 },		
				{ x: 3, y: 4.5 },
				{ x: 3.5, y: 4.5 }		
			],
			animations: [
				[ 3000, [2850, 2900, 2950, 3000], [0, 1, 2, 3] ]
			]
		},
		box: {
			width: 8, 
			height: 4,
			type: EnumBoxtype.PICKUP
		},
		movement: {
			moving: true,
			direction: 0,
			speed: 0,
			deceleration: 0.01,
			bounceOff: true
		},
		pickup: function() {
			if(player.vars.currentHP < player.vars.maxHP) {
				console.log("Picking up health heart!");
				player.addHealth(1);
				$('.healthSpan').text(player.vars.currentHP + ' / ' + player.vars.maxHP);
				game.pickups.splice(game.pickups.indexOf(this), 1);
			}
		}
	},
	{
		name: 'Exit Key',
		type: EnumPickup.EXIT_KEY,
		currentSprite: {x:0,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 1,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x: 0, y: 5 },
				{ x: 0, y: 5.5 }		
			],
			animations: [
				[ 3000, [2750, 2800, 2850, 2900, 2950, 3000], [0, 1, 0, 1, 0, 1] ]
			]
		},
		box: {
			width: 8, 
			height: 4,
			type: EnumBoxtype.PICKUP
		},
		movement: {
			moving: true,
			direction: 0,
			speed: 0,
			deceleration: 0.01,
			bounceOff: true
		},
		pickup: function() {
			console.log("Picking up exit key!");
			player.addItem(this);
			game.pickups.splice(game.pickups.indexOf(this), 1);
		}
	}
];
