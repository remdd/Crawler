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
		pickup: function() {
			if(player.vars.currentHP < player.vars.maxHP && !this.vars.collected) {
				this.vars.collected = true;
				pickupNoise.play();
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
		pickup: function() {
			if(!this.vars.collected) {
				this.vars.collected = true;
				pickupNoise.play();
				console.log("Picking up exit key!");
				player.addItem(this);
				game.items.splice(game.items.indexOf(this), 1);
				return true;
			}
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
		pickup: function() {
			if(!this.vars.collected) {
				this.vars.collected = true;
				pickupNoise.play();
				player.effects.push(new Effect(EnumItem.PURPLE_MUSHROOM));
				console.log(this);
				game.items.splice(game.items.indexOf(this), 1);
				return true;
			}
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
		pickup: function() {
			if(!this.vars.collected) {
				this.vars.collected = true;
				pickupNoise.play();
				player.effects.push(new Effect(EnumItem.GREEN_MUSHROOM));
				console.log(this);
				game.items.splice(game.items.indexOf(this), 1);
				return true;
			}
		}
	},
	{
		name: 'Orange Mushroom',
		type: EnumItem.ORANGE_MUSHROOM,
		currentSprite: {x:6,y:4},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 0.5,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x: 6, y: 4 },
				{ x: 6.5, y: 4 },		
				{ x: 6, y: 4.5 },
				{ x: 6.5, y: 4.5 }		
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
		pickup: function() {
			if(!this.vars.collected) {
				this.vars.collected = true;
				pickupNoise.play();
				player.effects.push(new Effect(EnumItem.ORANGE_MUSHROOM));
				console.log(this);
				game.items.splice(game.items.indexOf(this), 1);
				return true;
			}
		}
	},
	{
		name: 'Basic Knife',
		currentSprite: {x:2,y:4.5},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 1,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x:2,y:4.5}
			],
			animations: [
				[ 3000, [3000], [0] ]
			]
		},
		box: {
			width: 10, 
			height: 6,
			type: EnumBoxtype.ITEM
		},
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.IRON);
			console.log("Picking up Basic Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Acid Knife',
		currentSprite: {x:0,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:0,y:6},{x:0,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.ACID);
			console.log("Picking up Acid Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Crystal Knife',
		currentSprite: {x:1,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:1,y:6},{x:1,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.CRYSTAL);
			console.log("Picking up Crystal Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Shadow Knife',
		currentSprite: {x:2,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:2,y:6},{x:2,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.SHADOW);
			console.log("Picking up Shadow Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Fire Knife',
		currentSprite: {x:3,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:3,y:6},{x:3,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.FIRE);
			console.log("Picking up Fire Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Water Knife',
		currentSprite: {x:4,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:4,y:6},{x:4,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.WATER);
			console.log("Picking up Water Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Lightning Knife',
		currentSprite: {x:5,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:5,y:6},{x:5,y:6.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.KNIFE, EnumLode.LIGHTNING);
			console.log("Picking up Lightning Knife!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Basic Sword',
		currentSprite: {x:2,y:4},
		sprite: {
			spriteSheet: playerSprite,
			size: {
				x: 1,
				y: 0.5
			},
			y_padding: 4,
			frames: [
				{ x:2,y:4}
			],
			animations: [
				[ 3000, [3000], [0] ]
			]
		},
		box: {
			width: 13, 
			height: 6,
			type: EnumBoxtype.ITEM
		},
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.IRON);
			console.log("Picking up Basic Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}

	},
	{
		name: 'Acid Sword',
		currentSprite: {x:4,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:4,y:5},{x:4,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.ACID);
			console.log("Picking up Acid Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Crystal Sword',
		currentSprite: {x:5,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:5,y:5},{x:5,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.CRYSTAL);
			console.log("Picking up Crystal Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Shadow Sword',
		currentSprite: {x:6,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:6,y:5},{x:6,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.SHADOW);
			console.log("Picking up Shadow Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Fire Sword',
		currentSprite: {x:7,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:7,y:5},{x:7,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.FIRE);
			console.log("Picking up Fire Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Water Sword',
		currentSprite: {x:8,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:8,y:5},{x:8,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.WATER);
			console.log("Picking up Water Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Lightning Sword',
		currentSprite: {x:9,y:5},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:9,y:5},{x:9,y:5.5}],
			animations: [ [ 3000, [2850,2900,2950,3000], [0,1,0,1] ] ]
		},
		box: { width: 13, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			switchPlayerWeapon(EnumPlayerWeapon.SWORD, EnumLode.LIGHTNING);
			console.log("Picking up Lightning Sword!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Acid Helmet',
		currentSprite: {x:12,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:12,y:6},{x:12,y:6.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.ACID);
			console.log("Equipping Acid Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Crystal Helmet',
		currentSprite: {x:12,y:7},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:12,y:7},{x:12,y:7.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.CRYSTAL);
			console.log("Equipping Crystal Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Shadow Helmet',
		currentSprite: {x:13,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:13,y:6},{x:13,y:6.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.SHADOW);
			console.log("Equipping Shadow Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Fire Helmet',
		currentSprite: {x:13,y:7},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:13,y:7},{x:13,y:7.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.FIRE);
			console.log("Equipping Fire Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Water Helmet',
		currentSprite: {x:14,y:6},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:14,y:6},{x:14,y:6.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.WATER);
			console.log("Equipping Water Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	},
	{
		name: 'Lightning Helmet',
		currentSprite: {x:14,y:7},
		sprite: {
			spriteSheet: playerSprite,
			size: {x:1,y:0.5},
			y_padding: 4,
			frames: [{x:14,y:7},{x:14,y:7.5}],
			animations: [ [ 3000, [2850, 2900, 2950, 3000], [0,1,0,1] ] ]
		},
		box: { width: 10, height: 6, type: EnumBoxtype.ITEM },
		interact: function() {
			addPlayerHelmet(EnumPlayerHelmet.LIGHTNING);
			console.log("Equipping Lightning Helmet!");
			game.items.splice(game.items.indexOf(this), 1);
			return true;
		}
	}
];

function addPlayerHelmet(helmetType) {
	//	Drop existing helmet as item, if one is held
	if(player.helmet) {
		var newItem;
		var existingLode = player.lode;
		switch(existingLode) {
			case EnumLode.ACID: {
				newItem = EnumItem.ACID_HELMET;
				break;
			}
			case EnumLode.CRYSTAL: {
				newItem = EnumItem.CRYSTAL_HELMET;
				break;
			}
			case EnumLode.SHADOW: {
				newItem = EnumItem.SHADOW_HELMET;
				break;
			}
			case EnumLode.FIRE: {
				newItem = EnumItem.FIRE_HELMET;
				break;
			}
			case EnumLode.WATER: {
				newItem = EnumItem.WATER_HELMET;
				break;
			}
			case EnumLode.LIGHTNING: {
				newItem = EnumItem.LIGHTNING_HELMET;
				break;
			}
			default: {
				break;
			}
		}
		var item = new Item(itemTemplates[newItem], player.grid.x,player.grid.y);
		item.position.x = player.position.x;
		item.position.y = player.position.y + 2;
		item.movement.speed = 1;
		item.movement.direction = Math.random() * Math.PI * 2;
	}

	//	Pick up helmet and update player's lode
	player.helmet = new Helmet(helmetTemplates[helmetType]);
	player.lode = player.helmet.lode;
}


function switchPlayerWeapon(newWeaponType, newWeaponLode) {
	//	Drop existing weapon as item
	var existingLode = player.weapon.lode;
	var existingType = player.weapon.type;
	var newItem;
	switch(existingType) {
		case EnumPlayerWeapon.KNIFE: {
			switch(existingLode) {
				case EnumLode.ACID: {
					newItem = EnumItem.ACID_KNIFE;
					break;
				}
				case EnumLode.CRYSTAL: {
					newItem = EnumItem.CRYSTAL_KNIFE;
					break;
				}
				case EnumLode.SHADOW: {
					newItem = EnumItem.SHADOW_KNIFE;
					break;
				}
				case EnumLode.FIRE: {
					newItem = EnumItem.FIRE_KNIFE;
					break;
				}
				case EnumLode.WATER: {
					newItem = EnumItem.WATER_KNIFE;
					break;
				}
				case EnumLode.LIGHTNING: {
					newItem = EnumItem.LIGHTNING_KNIFE;
					break;
				}
				default: {
					newItem = EnumItem.BASIC_KNIFE;
					break;
				}
			}
			break;
		}
		case EnumPlayerWeapon.SWORD: {
			switch(existingLode) {
				case EnumLode.ACID: {
					newItem = EnumItem.ACID_SWORD;
					break;
				}
				case EnumLode.CRYSTAL: {
					newItem = EnumItem.CRYSTAL_SWORD;
					break;
				}
				case EnumLode.SHADOW: {
					newItem = EnumItem.SHADOW_SWORD;
					break;
				}
				case EnumLode.FIRE: {
					newItem = EnumItem.FIRE_SWORD;
					break;
				}
				case EnumLode.WATER: {
					newItem = EnumItem.WATER_SWORD;
					break;
				}
				case EnumLode.LIGHTNING: {
					newItem = EnumItem.LIGHTNING_SWORD;
					break;
				}
				default: {
					newItem = EnumItem.BASIC_SWORD;
					break;
				}
			}
			break;
		}
		default: {
			break;
		}
	}
	var item = new Item(itemTemplates[newItem], player.grid.x,player.grid.y);
	item.position.x = player.position.x;
	item.position.y = player.position.y + 2;
	item.movement.speed = 1;
	item.movement.direction = Math.random() * Math.PI * 2;

	//	Add new weapon to player
	player.weapon = new Weapon(playerWeapons[newWeaponType], player);								//	Assign starting weapon
	player.weapon.type = newWeaponType;
	player.weapon.setUpLode(newWeaponLode);
}


function Effect(type) {
	this.applied = false;
	switch(type) {
		case EnumItem.GREEN_MUSHROOM: {
			this.color = EnumColor.GREEN;
			var rand = Math.floor(Math.random() * 1);
			switch(rand) {
				case 0: {
					this.name = "Extra Invulnerability time";
					this.message1 = "Not bad! A bit like chicken.";
					this.message2 = "Your peripheral vision seems sharper, somehow...";
					this.message3 = "";
					this.apply = function() {
						player.vars.invulnerableTime = player.vars.invulnerableTime * 5;
					};
					this.remove = function() {
						player.vars.invulnerableTime = player.vars.invulnerableTime / 5;
					}
					break;
				}
				default: {
					break;
				}
			}
			break;
		}
		case EnumItem.PURPLE_MUSHROOM: {
			this.color = EnumColor.PURPLE;
			var rand = Math.floor(Math.random() * 7);
			switch(rand) {
				case 0: {
					this.name = "Reduced speed";
					this.message1 = "The mushroom doesn't taste great.";
					this.message2 = "You feel woozy...";
					this.message3 = "";
					this.apply = function() {
						player.vars.speed = player.vars.speed * 0.75;
					};
					this.remove = function() {
						player.vars.speed = player.vars.speed / 0.75;
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
