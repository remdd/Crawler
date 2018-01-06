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
			[{y:4,x:0}, {y:8,x:3}],							//	Left
			[{y:4,x:3}, {y:9,x:3}]							//	Right
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
			{y:10,x:11}, {y:11,x:11}, {y:12,x:11}
		],
		pavedFloor: [
			{y:9,x:12}, {y:9,x:13}, {y:9,x:14}
		],
		plankFloor: [
			{y:9,x:15}
		],
		tiledFloor: [
			{y:10,x:9}, {y:11,x:9}, {y:12,x:9}, {y:1,x:10}, {y:9,x:9}
		],
		parquetFloor: [
			{y:10,x:10}, {y:11,x:10}, {y:12,x:10}
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
		{y:4,x:8},	//	14	Stone pile 1
		{y:6,x:6},	//	15	Zombi Master's Desk
		{y:6,x:9},	//	16	Zombi head
		{y:4,x:9},	//	17	Spit
		{y:6,x:10},	//	18	Filth bucket
		{y:2,x:9},	//	19	3x Barrels
		{y:0,x:9},	//	20	2x Barrels
		{y:4,x:11},	//	21	Sack 2
		{y:0,x:11},	//	22	Sack x2
		{y:0,x:12},	//	23	Tipped Barrel
		{y:1,x:12},	//	24	Split Sack
		{y:2,x:12},	//	25	Water Butt
		{y:3,x:12},	//	26	Grain Barrel
		{y:0,x:4},	//	27	Wooden chair - R facing
		{y:1,x:4},	//	28	Wooden chair - L facing
		{y:0,x:2},	//	29	Wooden bench - vertical
		{y:0,x:3},	//	30	Wooden bench - horizontal
		{y:0,x:5},	//	31	Mug & knife table
		{y:0,x:7},	//	32	Sword table
		{y:0,x:13},	//	33	Wide shelves 1
		{y:2,x:13},	//	34	Narrow shelves 1
		{y:2,x:14},	//	35	Wide shelves 1
		{y:0,x:15},	//	36	Narrow shelves 1
		{y:1,x:0},	//	37	Rubble pile 1
		{y:1,x:1},	//	38	Rubble pile 2
		{y:1,x:2},	//	39	Stone lump
		{y:4,x:1},	//	40	Skull spike R
		{y:4,x:1.5},//	41	Skull spike L
		{y:5,x:1},	//	42	Flag spike R
		{y:5,x:1.5},//	43	Flag spike L
		{y:2,x:11},	//	44	Monolith
		{y:6,x:0},	//	45	Warrior statue L
		{y:6,x:1},	//	46	Warrior statue R
		{y:8,x:0},	//	47	Dragon statue L
		{y:8,x:1.5},//	48	Dragon statue R
		{y:6,x:2},	//	49	Stone Pillar 1
		{y:8,x:3},	//	50	Stone Pillar 2
		{y:8,x:4},	//	51	Stone Pillar 3
		{y:8,x:5}	//	52	Black Knight statue
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

var uniqueFloorDecor = [
	[	//	Black Knight's carpet
		{y:13,x:0},
		{y:14,x:0},
		{y:15,x:0}
	]
]