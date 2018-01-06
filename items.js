var itemTemplates = [
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
				game.items.splice(game.items.indexOf(this), 1);
				return true;
			}
		}
	},
	{
		name: 'Exit Key',
		type: EnumItem.EXIT_KEY,
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
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Purple Mushroom',
		type: EnumItem.PURPLE_MUSHROOM,
		currentSprite: {x:4,y:4},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 0.5,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x: 4, y: 4 },
				{ x: 4.5, y: 4 },		
				{ x: 4, y: 4.5 },
				{ x: 4.5, y: 4.5 }		
			],
			animations: [
				[ 3000, [2700, 2800, 2900, 3000], [0, 1, 2, 3] ]
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
			if(!this.vars.collected) {
				player.effects.push(new Effect(EnumItem.PURPLE_MUSHROOM));
				console.log(this);
				game.items.splice(game.items.indexOf(this), 1);
			}
			this.vars.collected = true;
			return true;
		}
	},
	{
		name: 'Green Mushroom',
		type: EnumItem.GREEN_MUSHROOM,
		currentSprite: {x:5,y:4},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 0.5,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x: 5, y: 4 },
				{ x: 5.5, y: 4 },		
				{ x: 5, y: 4.5 },
				{ x: 5.5, y: 4.5 }		
			],
			animations: [
				[ 3000, [2700, 2800, 2900, 3000], [0, 1, 2, 3] ]
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
			if(!this.vars.collected) {
				player.effects.push(new Effect(EnumItem.GREEN_MUSHROOM));
				console.log(this);
				game.items.splice(game.items.indexOf(this), 1);
			}
			this.vars.collected = true;
			return true;
		}
	}
];

function Effect(type) {
	this.applied = false;
	switch(type) {
		case EnumItem.GREEN_MUSHROOM: {
			this.color = EnumColor.GREEN;
					this.name = "Placeholder";
					this.message1 = "Mmmmm... a *green* mushroom.";
					this.message2 = "";
					this.message3 = "";
					this.apply = function() {
					};
					this.remove = function() {
					}
			break;
		}
		case EnumItem.PURPLE_MUSHROOM: {
			this.color = EnumColor.PURPLE;
			var rand = Math.floor(Math.random() * 7);
			console.log("rand: " + rand);
			switch(rand) {
				case 0: {
					this.name = "Reduced speed";
					this.message1 = "The mushroom doesn't taste great.";
					this.message2 = "You feel woozy...";
					this.message3 = "";
					this.apply = function() {
						player.vars.speed = player.vars.speed * 0.6;
					};
					this.remove = function() {
						player.vars.speed = player.vars.speed / 0.6;
					}
					break;
				}
				case 1: {
					this.name = "Increased attack rate";
					this.message1 = "The mushroom has an odd, nutty flavour.";
					this.message2 = "You feel sharp and alert.";
					this.message3 = "";
					this.apply = function() {
						player.vars.speed = player.vars.speed * 1.05;
						player.vars.attackRate = player.vars.attackRate * 0.8;
					};
					this.remove = function() {
						player.vars.speed = player.vars.speed / 1.05;
						player.vars.attackRate = player.vars.attackRate / 0.8;
					}
					break;
				}
				case 2: {		
					this.name = "Increased speed";
					this.message1 = "The mushroom tastes slightly lemony.";
					this.message2 = "You feel like it has given you an energy boost.";
					this.message3 = "";
					this.apply = function() {
						player.vars.speed = player.vars.speed * 1.1;
					};
					this.remove = function() {
						player.vars.speed = player.vars.speed / 1.1;
					}
					break;
				}
				case 3: {
					this.name = "Disorientation";
					this.message1 = "The mushroom tastes foul and acidic.";
					this.message2 = "You feel utterly disoriented!";
					this.message3 = "";
					this.duration = Math.random() * 5000 + 5000;
					this.apply = function() {
						player.vars.speed = -player.vars.speed * 0.7;
					};
					this.remove = function() {
						player.vars.speed = -player.vars.speed / 0.7;
					}
					break;
				}
				case 4: {		
					this.name = "No effect";
					this.message1 = "The mushroom tastes pretty horrible.";
					this.message2 = "Maybe eating random dungeon fungus isn't a smart move...";
					this.message3 = "";
					this.apply = function() {
					};
					this.remove = function() {
					}
					break;
				}
				case 5: {
					this.name = "Increase max HP";
					this.message1 = "That was surprisingly tasty!";
					this.message2 = "A most benevolent mushroom...";
					this.message3 = "";
					this.duration = 1000;
					this.apply = function() {
						player.vars.maxHP++;
						$('.healthSpan').text(player.vars.currentHP + ' / ' + player.vars.maxHP);
					};
					this.remove = function() {
					}
					break;
				}
				case 6: {
					this.name = "Clear effects";
					this.message1 = "Wow, that tasted bland.";
					this.message2 = "...";
					this.message3 = "";
					this.duration = 1000;
					this.apply = function() {
						player.effects.forEach(function(effect) {
							effect.endTime = performance.now() + 1;
						});
					};
					this.remove = function() {
					}
					break;				
				}
				default: {
					break;
				}
			}
		}
		break;
		default: {
			break;
		}
	}
	displayMessage(3000, this.message1, this.message2, this.message3);
	if(!this.duration) {
		this.duration = Math.random() * session.vars.defaultMushroomFactor + session.vars.defaultMushroomMin;
	}
}
