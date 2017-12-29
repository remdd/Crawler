var levelTilesets = [
	//	Dungeon 1
	{
		tileset: 'Dungeon1',
		floor: { y:0,x:0 },
		solid: { y:1,x:0 },
		solidColor: '#1c1117',
		wallFace: [{ y:1,x:2 }, { y:1,x:1 }, { y:1,x:3 }, { y:1,x:4 }],					//	Wall arrays in order of no ends, left end, right end, both ends
		wallTop: [{ y:0,x:2 }, { y:0,x:1 }, { y:0,x:3 }, { y:0,x:4 }],
		//	Wall bottoms in order of wall-above *3, wall-left *3, wall-right *3, wall-above&left, wall-above&right, wall-l&r, wall-above&l&r
		wallBtm: [{ y:2,x:1 }, { y:2,x:2 }, { y:2,x:3 }, { y:0,x:12}, { y:1,x:12}, { y:2,x:12}, { y:0,x:13}, { y:1,x:13}, { y:2,x:13}, 
			{ y:0,x:14}, { y:1,x:14}, { y:3,x:14}, { y:2,x:14} 
		],
		floorTransitions: [
			{y:0,x:12},			//	0	Left only
			{y:0,x:13},			//	1	Right only
			{y:3,x:12},			//	2	Top only
			{y:3,x:13},			//	3	Bottom only
			{y:0,x:14},			//	4	Top and left
			{y:1,x:14},			//	5	Top and right
			{y:1,x:15},			//	6	Bottom and left
			{y:2,x:15},			//	7	Bottom and right
			{y:3,x:15},			//	8	Top and bottom
			{y:3,x:14},			//	9	Left and right
			{y:2,x:14},			//	10	Top, left and right
			{y:0,x:15}			//	11	Bottom, left and right
		],
		wallDecorSmall: [
			{y: 1, x: 5},					//	Pipe end 1
			{y: 1, x: 6},					//	Pipe end 2
			{y: 1, x: 7},					//	Grille 1
			{y: 1, x: 8},					//	Grille 2
			{y: 2, x: 5},					//	Dark block
			{y: 2, x: 6},					//	Pipe end 3
			{y: 2, x: 7},					//	Hole 1
			{y: 2, x: 8},					//	Hole 2
			{y: 3, x: 4},					//	Faceplate
			{y: 3, x: 5},					//	Banner 1
			{y: 3, x: 6},					//	Banner 2
			{y: 3, x: 7},					//	Banner 3
			{y: 3, x: 8},					//	Banner 4
			{y: 2, x: 4},					//	Crack
			{y: 4, x: 4},					//	Chains
			{y: 0, x: 5},
			{y: 0, x: 6},
			{y: 0, x: 7},
			{y: 0, x: 8},
			{y: 0, x: 9}
		],
		wallDecorTall: [
			{y: 1, x: 9, height: 2, offset_y: 0},			//	Green goo
			{y: 0, x: 10, height: 3, offset_y: -1},			//	Column
			{y: 0, x: 11, height: 3, offset_y: -1}			//	Red fountain face
		],
		door: [
			{y:8,x:0}, {y:8,x:1}, {y:8,x:2}, {y:10,x:0}, {y:10,x:1}, {y:10,x:2}
		],
		exitStairs: [
			{y:10,x:3}, {y:10,x:5}, {y:10,x:7}
		],
		lightRed: [
			[{y:2,x:0}, {y:4,x:1}, {y:4,x:2}],				//	Centre
			[{y:3,x:0}],									//	Top-left
			[{y:3,x:3}],									//	Top-right
			[{y:5,x:0}],									//	Bottom-left
			[{y:5,x:3}],									//	Bottom-right
			[{y:3,x:1}, {y:3,x:2}],							//	Top
			[{y:5,x:1}, {y:5,x:2}],							//	Bottom
			[{y:4,x:0}],									//	Left
			[{y:4,x:3}]										//	Right
		],
		mudPool: [
			[{y:5,x:14}, {y:8,x:14}, {y:8,x:15}],		//	Centre
			[{y:4,x:13}],								//	Top-left
			[{y:4,x:15}],								//	Top-right
			[{y:6,x:13}],								//	Bottom-left
			[{y:6,x:15}],								//	Bottom-right
			[{y:4,x:14}, {y:7,x:14}],					//	Top
			[{y:6,x:14}, {y:8,x:13}],					//	Bottom
			[{y:5,x:13}, {y:7,x:15}],					//	Left
			[{y:5,x:15}, {y:7,x:13}]					//	Right
		],
		cobbleFloor: [
			[{y:6,x:0}, {y:6,x:1}, {y:7,x:0}, {y:7,x:1}],		//	Centre
			[{y:6,x:2}], 										//	Transition left
			[{y:6,x:3}], 										//	Transition right
			[{y:7,x:2}], 										//	Transition up
			[{y:7,x:3}]											//	Transition down
		],
		greyCobbleFloor: [
			[{y:8,x:4}, {y:8,x:5}, {y:9,x:4}, {y:9,x:5}], 
			[{y:8,x:6}], 
			[{y:8,x:7}], 
			[{y:9,x:6}], 
			[{y:9,x:7}]
		],
		greyWall: [
			[{y:6,x:5}, {y:6,x:4}, {y:6,x:6}, {y:6,x:7}],		//	Wall face
			[{y:5,x:5}, {y:5,x:4}, {y:5,x:6}, {y:5,x:7}],		//	Wall top
			[{y:7,x:4}, {y:7,x:5}, {y:7,x:6}, {y:7,x:7}, {y:4,x:5}, {y:4,x:6}, {y:4,x:7}, {y:4,x:8}, {y:4,x:9}, {y:4,x:10}]		//	Decor
		],
		greyWallFace: [
			{y:6,x:5}, {y:6,x:4}, {y:6,x:6}, {y:6,x:7}
		],
		greyWallTop: [
			{y:5,x:5}, {y:5,x:4}, {y:5,x:6}, {y:5,x:7}
		],
		greyWallDecor: [
			{y:7,x:4}, {y:7,x:5}, {y:7,x:6}, {y:7,x:7}, {y:4,x:5}, {y:4,x:6}, {y:4,x:7}, {y:4,x:8}, {y:4,x:9}, {y:4,x:10}
		],
		squareTileFloor: [
			{y:9,x:10}
		],
		pavedFloor: [
			{y:9,x:12}, {y:9,x:13}, {y:9,x:14}
		],
		plankFloor: [
			{y:9,x:15}
		],
		tiledFloor: [
			{y:9,x:8}, {y:1,x:10}, {y:9,x:9}
		],
		parquetFloor: [
			{y:9,x:11}
		] 
	}
];

var obstacleTiles = [
	//	Dungeon 1 set
	[
		{y:2,x:2}, //	0	Dining table
		{y:3,x:0}, //	1	Dining chair - R facing
		{y:3,x:1}, //	2	Dining chair - L facing
		{y:4,x:0}, //	3	Dining chair - table head
		{y:2,x:5},	//	4	Coffin
		{y:2,x:0}, //	5	Barrel
		{y:2,x:6},	//	6	Bucket
		{y:4,x:5},	//	7	Well
		{y:2,x:7},	//	8	Torture table
		{y:6,x:3},	//	9	Meat rack
		{y:4,x:7},	//	10	Stool
		{y:3,x:6},	//	11	Barrel 2
		{y:5,x:7},	//	12	Sack
		{y:5,x:8},	//	13	Blood Bucket
		{y:4,x:8},	//	14	Stone pile
		{y:6,x:6},	//	15	Zombi Master's Desk
		{y:6,x:9},	//	16	Zombi head
		{y:4,x:9},	//	17	Spit
		{y:6,x:10},//	18	Filth bucket
		{y:2,x:9}	//	19	3x Barrels
	]
];

var floorDecorTiles = [
	[
		//	0	Filth
		{y:1,x:0, maxOffset: {y:11,x:9}}, 
		{y:1,x:1, maxOffset: {y:11,x:6}}, 
		{y:1,x:2, maxOffset: {y:12,x:0}}, 
		{y:1,x:3, maxOffset: {y:8,x:0}}, 
		{y:1,x:4, maxOffset: {y:11,x:5}}, 
		{y:1,x:5, maxOffset: {y:1,x:0}},
		{y:0,x:0, maxOffset: {y:8,x:0}}, 
		{y:0,x:1, maxOffset: {y:11,x:2}}, 
		{y:0,x:2, maxOffset: {y:9,x:1}}, 
		{y:0,x:3, maxOffset: {y:7,x:0}}, 
		{y:0,x:4, maxOffset: {y:6,x:2}} 
	],
	[
		//	1	Splats
		{y:2,x:0, maxOffset: {y:10,x:2}}, 
		{y:2,x:1, maxOffset: {y:5,x:0}}, 
		{y:2,x:2, maxOffset: {y:3,x:0}}, 
		{y:2,x:3, maxOffset: {y:0,x:1}}
	],
	[
		//	2	Plants
		{y:3,x:0, maxOffset: {y:3,x:1}}, 
		{y:3,x:1, maxOffset: {y:13,x:9}}, 
		{y:3,x:2, maxOffset: {y:4,x:0}}, 
		{y:3,x:3, maxOffset: {y:4,x:8}}, 
		{y:3,x:4, maxOffset: {y:4,x:4}}
	],
	[
		//	3	Bones
		{y:4,x:0, maxOffset: {y:8,x:1}}, 
		{y:4,x:1, maxOffset: {y:8,x:1}}, 
		{y:4,x:2, maxOffset: {y:4,x:2}}, 
		{y:4,x:3, maxOffset: {y:9,x:9}}, 
		{y:4,x:4, maxOffset: {y:12,x:4}}, 
		{y:4,x:5, maxOffset: {y:11,x:3}}
	],
	[
		//	4	Misc
		{y:5,x:0, maxOffset: {y:8,x:3}}
	]
];