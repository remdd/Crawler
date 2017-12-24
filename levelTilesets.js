var levelTilesets = [
	{
		tileset: 'Dungeon1',
		floor: { y:0,x:0 },
		solid: { y:1,x:0 },
		solidColor: '#1c1117',
		wallFace: [{ y:1,x:2 }, { y:1,x:1 }, { y:1,x:3 }, { y:1,x:4 }],					//	Wall arrays in order of no ends, left end, right end, both ends
		wallTop: [{ y:0,x:2 }, { y:0,x:1 }, { y:0,x:3 }, { y:0,x:4 }],
		//	Wall bottoms in order of wall-above *3, wall-left *3, wall-right *3, wall-above&left, wall-above&right, wall-l&r, wall-above&l&r
		wallBtm: [{ y:2,x:1 }, { y:2,x:2 }, { y:2,x:3 }, { y:0,x:12}, { y:1,x:12}, { y:2,x:12}, { y:0,x:13}, { y:1,x:13}, { y:2,x:13}, 
			{ y:0,x:14}, { y:1,x:14}, { y:3,x:14}, { y:2,x:14} ],
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
		commonForegroundDecor: [
			{y:6,x:8}, {y:6,x:9}, {y:6,x:10}, {y:6,x:11}, {y:7,x:8}, {y:7,x:9}, {y:7,x:10}, {y:8,x:9} 
		],
		rareForegroundDecor: [
			{y:5,x:8}, {y:5,x:9}, {y:5,x:10}, {y:5,x:11}, {y:7,x:11}, {y:8,x:8}, {y:8,x:10}, {y:6,x:11}, {y:5,x:12}, {y:6,x:12}
		],
		lightFloor: [
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
			[{y:5,x:14}, {y:8,x:14}, {y:8,x:15}],	//	Centre
			[{y:4,x:13}],	//	Top-left
			[{y:4,x:15}],	//	Top-right
			[{y:6,x:13}],	//	Bottom-left
			[{y:6,x:15}],	//	Bottom-right
			[{y:4,x:14}, {y:7,x:14}],	//	Top
			[{y:6,x:14}, {y:8,x:13}],	//	Bottom
			[{y:5,x:13}, {y:7,x:15}],	//	Left
			[{y:5,x:15}, {y:7,x:13}]	//	Right
		],
		cobbleFloor: [
			{y:6,x:0}, {y:6,x:1}, {y:7,x:0}, {y:7,x:1}, {y:6,x:2}, {y:6,x:3}, {y:7,x:2}, {y:7,x:3}
		],
		greyCobbleFloor: [
			{y:8,x:4}, {y:8,x:5}, {y:9,x:4}, {y:9,x:5}, {y:8,x:6}, {y:8,x:7}, {y:9,x:6}, {y:9,x:7}
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
		greyTileFloor: [
			{y:9,x:10}
		],
		door: [
			{y:8,x:1}, {y:8,x:2}, {y:8,x:3}, {y:14,x:0}, {y:14,x:1}, {y:14,x:2}
		],
		tiledFloor: [
			{y:9,x:8}, {y:1,x:10}, {y:9,x:9}
		],
		obstacles: [
			{y:10,x:2}, //	Dining table
			{y:11,x:0}, //	Dining chair - R facing
			{y:11,x:1}, //	Dining chair - L facing
			{y:12,x:0}, //	Dining chair - table head
			{y:10,x:5},	//	Coffin
			{y:10,x:0}, //	Barrel
			{y:10,x:6},	//	Bucket
			{y:12,x:5},	//	Well
			{y:10,x:7},	//	Torture table
			{y:14,x:3},	//	Meat rack
			{y:12,x:7},	//	Stool
			{y:11,x:6}	//	Barrel 2
		] 
	}
]