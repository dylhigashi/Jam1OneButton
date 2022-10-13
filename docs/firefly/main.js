//testing push
title = "Firefly Catch";

description = `
  Catch fireflies, 

  avoid wasps!
`;

characters = [
// cyan firefly (a)
`
  ccc
  c c 
ccc c 
c  ccc
cccccc
   ccc  
`, 
// wasp (b)
`
  LLL 
LLL L 
L L L 
yLyLL 
rLyLll
yLyL  
`,
// jar lid (C)
`
      
      
      
      
llllll
llllll 
`, // jar base frame 1 (d)
`
L    L
Lc   L
L    L
L  y L
L    L
 LLLL 
`, // jar base frame 2 (e)
`
L    L
L   cL
L    L
L y  L
L    L
 LLLL 
`, // hands (f)
`
  lll 
  lll
  lll 
   l    
   l  
   l    
`,
// purple firefly (g)
`
  ppp
  p p 
ppp p 
p  ppp
pppppp
   ppp  
`, 
// green firefly (h)
`
  ggg
  g g 
ggg g 
g  ggg
gggggg
   ggg  
`, 
// blue firefly (i)
`
  bbb
  b b 
bbb b 
b  bbb
bbbbbb
   bbb   
`
];

const settings = {
	WIDTH: 300,
	HEIGHT: 150,

    FIREFLY_SPEED_MIN: 0.5,
	FIREFLY_SPEED_MAX: 1.0,

	WASP_SPEED_MIN: 0.5,
	WASP_SPEED_MAX: 1.0,
    
    PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,

	NUM_FIREFLIES: 20,

	PLAYER_SPEED: 0.5,
};

options = {
	viewSize: {x: settings.WIDTH, y: settings.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 4848,
    isPlayingBgm: true,
    isReplayEnabled: true,
    theme: "shapeDark"
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * color: Color,
 * id: string
 * }} Firefly
 */

/**
 * @type { Firefly [] }
 */
let fireflies;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Wasp
 */

/**
 * @type { Wasp [] }
 */
let wasps;

//controlling the Jar/Player
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @type { number }
 */
 let numWasps;

 /**
 * @typedef {{
  * units: number,
  * color: Color,
  * base: number,
  * id: string
  * }} Order
  */
 
 /**
  * @type { Order }
  */
 let order;

/**
  * @type { Color [] }
  */
 let colors;

 colors = ["cyan", "purple", "green", "blue"];

 /**
 * @type { number }
 */
  let numLives = 3;

  /**
 * @type { Boolean }
 */
 let spawnedFirst;

 let ids = ["a", "g", "h", "i"];
function update() {
	if (!ticks) {
		
		let xPos = 10;
		fireflies = times(settings.NUM_FIREFLIES, () => {
			xPos += 15;
			const posX = xPos;
            const posY = rnd(25, settings.HEIGHT - 30);
			const rand = Math.floor(Math.random() * 4)
			return {
				pos: vec(posX, posY),
				speed: rnd(settings.FIREFLY_SPEED_MIN, settings.FIREFLY_SPEED_MAX),
				color: colors[rand],
				id: ids[rand]
			};
		});
		const num = Math.floor(rnd(1, 5));
		const rand = Math.floor(Math.random() * 4);
		order = {
			base: num,
			units: num,
			color: colors[rand],
			id: ids[rand]

		}
		wasps = [];


		//player
		player = {
			//pos:vec(settings.WIDTH * 0.5, settings.HEIGHT - 3), 
			pos:vec(settings.WIDTH * 0.5, settings.HEIGHT - 20),
			speed: settings.PLAYER_SPEED
		};
	}

	//print jar out
	char(addWithCharCode("d", floor(ticks / 30) % 2), player.pos.x, player.pos.y);

	if (input.isPressed && player.pos.y > 25) {
		player.pos.y--
		char("c", player.pos.x, player.pos.y - 7, { rotation: 45 });
	} else {
		char("c", player.pos.x, player.pos.y - 6);
		player.pos.y++
	}
	//making boundaries
	player.pos.clamp(0, settings.WIDTH , 0, settings.HEIGHT - 10);
	//trying to move it


	//making jar unable to move left and right when button is pressed
	if (!input.isPressed && player.pos.y == settings.HEIGHT-10) {
		//constantly move player left and right
			player.pos.x += settings.PLAYER_SPEED;
		
		if (player.pos.x == settings.WIDTH -9 || player.pos.x == 9) {
			//player.pos.x = settings.WIDTH;
			settings.PLAYER_SPEED *= -1;
		}
	}

	

	// hands?
	char("f", player.pos.x - 4, player.pos.y + 6);
	char("f", player.pos.x + 3, player.pos.y + 6);


	//Display lines at top
	line(0, 20, 300, 20, 4);
	line(125, 0, 125, 20, 4);
	line(175, 0, 175, 20, 4);

	//Display order
	color(order.color);
	char(order.id, 145, 9);
	text("x" + order.units, 152, 9)
	color("black");

	//hearts
	for(let i = 0; i < numLives; i++) {
		char("b", 50 + i*10, 9);
	}

	//if fireflies get caught or go off screen, spawn new ones up to the number there should be (settings.NUM_FIREFLIES)
	if(fireflies.length < settings.NUM_FIREFLIES) {
		for(let i = fireflies.length; i < settings.NUM_FIREFLIES ; i++) {
			const posX = 10;
			const posY = rnd(25, settings.HEIGHT- 30);
			const rand = Math.floor(Math.random() * 4);
			fireflies.push({
				pos: vec(posX, posY),
				speed: rnd(settings.ENEMY_MIN_BASE_SPEED, settings.ENEMY_MAX_BASE_SPEED),
				color: colors[rand],
				id: ids[rand]
			});
		}
	}

	//Spawn wasps at intervals of time
	if(ticks === 100 && numWasps == 0) {
		const posX = 10;
		const posY = rnd(35, settings.HEIGHT- 30);
		wasps.push({
			pos: vec(posX, posY),
			speed: 0.32
		});
		spawnedFirst = true;
	}

	numWasps = Math.floor(score/10) + (spawnedFirst ? 1:0);
	console.log(score%10);

	//if wasps get destroyed spawn more up to the number there should be on the screen
	if(wasps.length < numWasps + 1) {
		for(let i = wasps.length; i < numWasps; i++) {
			const posX = 10;
			const posY = rnd(25, settings.HEIGHT- 30);
			wasps.push({
				pos: vec(posX, posY),
				speed: 0.32
			});
		}
	}

	//Update functions for wasps and fireflies
	wasps.forEach((w) => {
		if(w.pos.x >= settings.WIDTH || w.pos.x <= 0) {
			w.speed *= -1;	
		}
		w.pos.x += w.speed;
		w.pos.y += sin(w.pos.x/5);
		char("b", w.pos);
	});
	fireflies.forEach((f) => {
		
		f.pos.x += 0.25;
		char(f.id, f.pos);
	});



	//remove conditions for wasps and fireflies
	remove(fireflies, (f) => {
		let isCollidingFLYINJAR
		isCollidingFLYINJAR = char(f.id, f.pos).isColliding.char.c;
		//const isCollidingFLYINJAR = char("a", f.pos).isColliding.char.c;

		//small particle explosion
		if (isCollidingFLYINJAR) {
			
			color(f.color);
			particle(f.pos);
			color("black");

			//check if part of order
			if(order.color == f.color) {
				order.units--;
				play("coin");
			}
			else {
				order.units = order.base;
				play("explosion");
			}

			//if order goes through make new one
			if(order.units == 0) {
				color(f.color);
				particle(150, 10);
				color("black");
				const num = Math.floor(rnd(1, 5));
				score += order.base*order.base;
				play("powerUp");
				const rand = Math.floor(Math.random() * 4);
				order = {
					base: num,
					units: num,
					color: colors[rand],
					id: ids[rand]

				}
			}

		}

		return (isCollidingFLYINJAR || f.pos.x > settings.WIDTH );
	});
	remove(wasps, (w) => {
		const isCollidingWasp = char("b", w.pos).isColliding.char.c;

		if (isCollidingWasp) {
			play("hit");
			color("red");
			particle(w.pos);
			particle(50 + numLives*10, 9)
			color("black");
			numLives--;
			if(numLives == 0) {
				numLives = 3;
				numWasps = 0;
				end("Ouch! Those stings hurt.");
			}
		}

		return isCollidingWasp || w.pos.y > settings.HEIGHT || w.pos.y < 0;
	})


	

}
