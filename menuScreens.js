function firstLoad() {
	$('canvas').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('canvas').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('canvas').attr('hidden', true);
	$('#gameMenuDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#gameMenuDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('#messageDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#messageDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	mainMenuEventListener();
	mainMenu();
}

function controlsScreen() {
	$('#startScreen').fadeOut('slow', function() {
		$('button').removeClass('selected');
		$('.mainMenuBtn').addClass('selected');
		menuState.menuScreen = 'How to play';
		menuState.button = 'Main menu';
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#controlsScreen').fadeIn('slow');
		});		
	});
}

function startGame() {
	if(!session.loadingLevel) {
		session.loadingLevel = true;
		menuState.menuVisible = false;
		start(true);
	}
}

var menuState = {
	menuVisible: false,
	menuScreen: 'Main menu',
	button: 'New game'
};

function mainMenu() {
	$.when($('.gameMenuScreen').fadeOut('slow')).then(function() {
		menuState.menuVisible = true;
		menuState.menuScreen = 'Main menu';
		menuState.button = 'New game';
		$('button').removeClass('selected');
		$('.newGameBtn').addClass('selected');
		$('#interfaceDivLeft').fadeOut('slow');
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#startScreen').fadeIn('slow');
		});		
	});
}

function mainMenuEventListener() {
	console.log("Adding event listener");
	window.addEventListener('keydown', function(e) {mainMenuChoice(e)}, true);
}

function mainMenuChoice(e) {
	if(menuState.menuVisible) {
		if(menuState.menuScreen === 'Main menu' && (e.code === 'KeyS' || e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
			gameEffects.play('menuChange');
			e.preventDefault();
			$('button').removeClass('selected');
			if(menuState.button === 'New game') {
				menuState.button = 'How to play';
				$('.howToPlayBtn').addClass('selected');
			} else {
				menuState.button = 'New game';
				$('.newGameBtn').addClass('selected');
			}
		} else if(menuState.menuScreen === 'Death screen' && (e.code === 'KeyS' || e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
			gameEffects.play('menuChange');
			e.preventDefault();
			$('button').removeClass('selected');
			if(menuState.button === 'New game') {
				menuState.button = 'Main menu';
				$('.mainMenuBtn').addClass('selected');
			} else {
				menuState.button = 'New game';
				$('.newGameBtn').addClass('selected');
			}
		} else if(e.code === 'Space' || e.code === 'Enter') {
			e.preventDefault();
			switch(menuState.button) {
				case 'New game': {
					gameEffects.play('startCoin');
					startGame();
					break;
				}
				case 'How to play': {
					gameEffects.play('menuAccept');
					controlsScreen();
					break;
				}
				case 'Main menu': {
					gameEffects.play('menuAccept');
					mainMenu();
					break;
				}
				case 'Next level': {
					gameEffects.play('menuAccept');
					startNextLevel();
					break;
				}
				default: {
					break;
				}
			}
		}
	}
}


function deathScreen() {
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#deathScreen').fadeIn('slow', function() {
				menuState.menuVisible = true;
				menuState.menuScreen = 'Death screen',
				menuState.button = 'New game'
				clearCanvases();
			});
		});
	});
}

function endLevelScreen() {
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#endLevelScreen').fadeIn('slow', function() {
				menuState.menuVisible = true;
				menuState.menuScreen = 'End level screen',
				menuState.button = 'Next level'
				$('.nextLevelBtn').addClass('selected');
				clearCanvases();
			});
		});
	});
}

function startNextLevel() {
	menuState.menuVisible = false;
	start();
}

$('.mainMenuBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.mainMenuBtn').addClass('selected');
	mainMenu();
});

$('.howToPlayBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.howToPlayBtn').addClass('selected');
	controlsScreen();
});

$('.newGameBtn').click(function() {
	gameEffects.play('startCoin');
	$('button').removeClass('selected');
	$('.newGameBtn').addClass('selected');
	startGame();
});

$('.nextLevelBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.nextLevelBtn').addClass('selected');
	startNextLevel();
});