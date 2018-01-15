var bgMusic = new Howl({
	src: ['snd/bgMusic.wav'],
	loop: true,
	volume: 1,
	sprite: {
		music1: [0, 166957],
		music2: [168000, 160000],
		music3: [330000, 160000]
	}
});

var gameEffects = new Howl({
	src: ['snd/GameEffects3.wav'],
	volume: 0.6,
	sprite: {
		playerDamage: [0, 750],
		criticalHit: [1000, 750],
		playerDeath: [2000, 1500],
		badMushroom: [4000, 750],
		goodMushroom: [5000, 750],
		healthHeart: [6000, 750],
		playerItem: [7000, 1000],
		door1: [8500, 1000],
		door2: [10000, 1000],
		trapdoor: [11500, 2000],
		swish1: [13500, 750],
		swish2: [14500, 750],
		exitKey: [15500, 750],
		startCoin: [16500, 750],
		crossbow: [17500, 750],
		bigSwish1: [18500, 750],
		bigSwish2: [19500, 750],
		littleSwish1: [20500, 750],
		littleSwish2: [21500, 750],
		menuChange: [22500, 750],
		gem1: [23500, 750],
		gem2: [24500, 750],
		gem3: [25500, 750],
		gem4: [26500, 750],
		charmed: [27500, 750],
		menuAccept: [28500, 750]	
	}
});

var urkGrunts = new Howl({
	src: ['snd/Urk2.wav'],
	volume: 0.6,
	sprite: {
		grunt1: [0, 500],
		grunt2: [1500, 500],
		grunt3: [3000, 500],
		grunt4: [4500, 500],
		grunt5: [6000, 500],
		grunt6: [7500, 500],
		grunt7: [9000, 500],
		death1: [10500, 1000],
		death2: [12500, 1000]
	}
});

var skeltonNoises = new Howl({
	src: ['snd/Skelton.wav'],
	volume: 0.6,
	sprite: {
		noise1: [0, 1000],
		noise2: [1000, 1000],
		noise3: [2000, 1000],
		noise4: [3000, 1000],
		death1: [4000, 1500]
	}
});

var campVampNoises = new Howl({
	src: ['snd/CampVamp2.wav'],
	volume: 0.5,
	sprite: {
		noise1: [0, 800],
		noise2: [1000, 800],
		noise3: [2000, 800],
		noise4: [3000, 800],
		noise5: [4000, 800],
		noise6: [5000, 800],
		death: [6000, 1500]
	}
});

var ogrNoises = new Howl({
	src: ['snd/Ogr2.wav'],
	volume: 0.8,
	sprite: {
		noise1: [0, 800],
		noise2: [1500, 1200],
		noise3: [3000, 1200],
		noise4: [4500, 1200],
		noise5: [6000, 1200],
		death: [7500, 1500]
	}
});

var creatureSounds1 = new Howl({
	src: ['snd/creatureSounds1.wav'],
	volume: 0.6,
	sprite: {
		teleport1: [0, 1000],
		teleport2: [1500, 750],
		fireballShoot1: [2500, 1000],
		fireballShoot2: [4000, 1000],
		fireballShoot3: [5500, 1000],
		fireballHit1: [7000, 1000],
		fireballHit2: [8500, 1000],
		fireballHit3: [10000, 1000],
		waterballHit1: [11500, 1000],
		waterballHit2: [13000, 1000],
		waterballHit3: [14500, 1000],
		summonImp: [16000, 1000],
		mumiDeath: [17500, 2000],
		elementalDeath1: [20500, 1500],
		elementalDeath2: [22500, 1500],
		summonElemental: [24500, 1500],
		squarkKnife1: [26500, 500],
		squarkKnife2: [27500, 500]
	}
})

function playSwish(size) {
	if(size === "big") {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('bigSwish1');
		} else {
			gameEffects.play('bigSwish1');
		}
	} else if(size === "little") {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('littleSwish1');
		} else {
			gameEffects.play('littleSwish1');
		}
	} else {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('swish1');
		} else {
			gameEffects.play('swish1');
		}
	}
}

function playUrkGrunt(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			urkGrunts.play('death1');
		} else {
			urkGrunts.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 7);
		if(snd < 1) {
			urkGrunts.play('grunt1');
		} else if(snd < 2) {
			urkGrunts.play('grunt2');
		} else if(snd < 3) {
			urkGrunts.play('grunt3');
		} else if(snd < 4) {
			urkGrunts.play('grunt4');
		} else if(snd < 5) {
			urkGrunts.play('grunt5');
		} else if(snd < 6) {
			urkGrunts.play('grunt6');
		} else {
			urkGrunts.play('grunt7');
		}
	}
}

function shootFireballSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('fireballShoot1');
	} else if(snd < 2) {
		creatureSounds1.play('fireballShoot2');
	} else {
		creatureSounds1.play('fireballShoot3');
	}
}

function fireballHitSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('fireballHit1');
	} else if(snd < 2) {
		creatureSounds1.play('fireballHit2');
	} else {
		creatureSounds1.play('fireballHit3');
	}
}

function waterballHitSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('waterballHit1');
	} else if(snd < 2) {
		creatureSounds1.play('waterballHit2');
	} else {
		creatureSounds1.play('waterballHit3');
	}
}
