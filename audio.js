var bgMusic = new Howl({
	src: ['snd/Crawler.wav'],
	loop: true,
	volume: 0.4
});

var startSound = new Howl({
	src: ['snd/Arcade_Echo_FX_001.wav'],
	volume: 0.2
});

var urkGrunts = new Howl({
	src: ['snd/Urk.wav'],
	volume: 0.7,
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
	volume: 0.5,
	sprite: {
		noise1: [0, 1000],
		noise2: [1000, 1000],
		noise3: [2000, 1000],
		noise4: [3000, 1000],
		death1: [4000, 1500]
	}
});

var pickupNoise = new Howl({
	src: ['snd/CS_VocoBitB_Hit-03.wav'],
	volume: 0.5,
});

var critHitNoise = new Howl({
	src: ['snd/CS_VocoBitA_Hit-06.wav'],
	volume: 0.5,
});

var playerDamage = new Howl({
	src: ['snd/CS_VocoBitC_Hit-01.wav'],
	volume: 0.5,
})
