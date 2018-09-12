const WIDTH = 500;
const HEIGHT = 700;
const CARWIDTH = 60;
const CARHEIGHT = 80;
const DISTANCEFROMBOTTOM = 50;
const A = 0;
const B = WIDTH/4;
const C = WIDTH/2;
const D = 3*WIDTH/4;
const SPRITEWIDTH = 20;
const SPRITEHEIGHT = 20;
const MAXOBSTACLEDISTANCE = 2000;
const MINOBSTACLEDISTANCE = 500;
const XSPEED = 10;
const YSPEED = 9;
const SPRITESPAWNPROBABILITY = 0.00;
const SPRITETYPEPROBABILITY = 0.5;

var dividers = [];
var sprites = [];
var left_sprite;
var right_sprite;
var score = 0;

kontra.init();

kontra.canvas.width = WIDTH;
kontra.canvas.height = HEIGHT;

function initLevel(){
	let limage = new Image();
	limage.src = 'src/assets/red.png';
	let rimage = new Image();
	rimage.src = 'src/assets/blue.png';

	dividers.push(kontra.sprite({x:WIDTH/2,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	dividers.push(kontra.sprite({x:WIDTH/4,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	dividers.push(kontra.sprite({x:3*WIDTH/4,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	left_sprite = kontra.sprite({
		x:(WIDTH/4-CARWIDTH)/2,
		y:HEIGHT-DISTANCEFROMBOTTOM-CARHEIGHT,
		dx:0,
		image: limage
	});
	right_sprite = kontra.sprite({
		x:3*WIDTH/4 + (WIDTH/4-CARWIDTH)/2,
		y:HEIGHT-DISTANCEFROMBOTTOM-CARHEIGHT,
		width:CARWIDTH,
		height:CARHEIGHT,
		dx:0,
		image: rimage
	});
	var rand = Math.random();
	var dist;
	if (rand < 0.5)
		dist = A;
	else 
		dist = B;
	spawn(dist);
	if (rand < 0.5)
		dist = C;
	else 
		dist = D;
	spawn(dist);
}
initLevel();

function spawn(dist){
	if(Math.random()< SPRITESPAWNPROBABILITY){
		if(Math.random()< SPRITETYPEPROBABILITY){
			sprites.push(getCollectible(dist));
		} else {
			sprites.push(getObstacle(dist));
		}
	}
}

function getObstacle(a){
	return kontra.sprite({
		x: a + (WIDTH/4 - SPRITEWIDTH)/2,
		y: - SPRITEHEIGHT,
		width: SPRITEWIDTH,
		height: SPRITEHEIGHT,
		dy: YSPEED,
		color: 'blue',
		type: 'obstacle'
	});
}

function getCollectible(a){
	return kontra.sprite({
		x: a + (WIDTH/4 - SPRITEWIDTH)/2,
		y: - SPRITEHEIGHT,
		width: SPRITEWIDTH,
		height: SPRITEHEIGHT,
		dy: YSPEED,
		color: 'red',
		type: 'collectible'
	});
}

function levelGen(){
	var a=HEIGHT,b=HEIGHT,c=HEIGHT,d=HEIGHT;
	for (i in sprites){
		var sprite = sprites[i];	
		if(sprite.x == A + (WIDTH/4 - SPRITEWIDTH)/2){
			if(sprite.y < a)
				a = sprite.y;
		} else if(sprite.x == B + (WIDTH/4 - SPRITEWIDTH)/2){
			if(sprite.y < b)
				b = sprite.y;
		} else if(sprite.x == C + (WIDTH/4 - SPRITEWIDTH)/2){
			if(sprite.y < c)
				c = sprite.y;
		} else if(sprite.x == D + (WIDTH/4 - SPRITEWIDTH)/2){
			if(sprite.y < d)
				d = sprite.y;
		}
	}
	if(a> MINOBSTACLEDISTANCE && a< MAXOBSTACLEDISTANCE){
		spawn(A);
	}
	if(b> MINOBSTACLEDISTANCE && b< MAXOBSTACLEDISTANCE){
		spawn(B);
	}
	if(c> MINOBSTACLEDISTANCE && c< MAXOBSTACLEDISTANCE){
		spawn(C);
	}
	if(d> MINOBSTACLEDISTANCE && d< MAXOBSTACLEDISTANCE){
		spawn(D);
	}
}

function updatePlayer(){
	left_sprite.update();
	if(left_sprite.x + CARWIDTH > C - (WIDTH/4 - CARWIDTH)/2){
		left_sprite.dx = 0;
		left_sprite.x = C - (WIDTH/4 - CARWIDTH)/2 - CARWIDTH;
	} else if(left_sprite.x < A + (WIDTH/4 - CARWIDTH)/2){
		left_sprite.dx = 0;
		left_sprite.x = A + (WIDTH/4 - CARWIDTH)/2;
	}
	right_sprite.update();
	if(right_sprite.x + CARWIDTH > WIDTH - (WIDTH/4 - CARWIDTH)/2){
		right_sprite.dx = 0;
		right_sprite.x = WIDTH - (WIDTH/4 - CARWIDTH)/2 - CARWIDTH;
	} else if(right_sprite.x < C + (WIDTH/4 - CARWIDTH)/2){
		right_sprite.dx = 0;
		right_sprite.x = C + (WIDTH/4 - CARWIDTH)/2;
	}
}

function renderPlayer(){
	left_sprite.render();
	right_sprite.render();
}

function check(){
	var del = [];
	for (i in sprites){
		var sprite = sprites[i];
		if(sprite.type=='obstacle' && (sprite.collidesWith(left_sprite) || sprite.collidesWith(right_sprite))){
			gameOver();
		} else if(sprite.type=='collectible' && (sprite.collidesWith(left_sprite) || sprite.collidesWith(right_sprite))){
			score += 1;
			del.push(i);
		}
	}
	for (i in del){
		sprites.splice(i, 1);
	}

}

function gameOver(){
	loop.stop();
	kontra.context.fillStyle = 'rgba(0,0,0,0.9)'
	kontra.context.fillRect(0,0,WIDTH,HEIGHT);
}

kontra.keys.bind('left',function(){
	if(left_sprite.dx == 0){
		if(left_sprite.x < B){
			left_sprite.dx = XSPEED;
		} else {
			left_sprite.dx = - XSPEED;
		}
	}else 
		left_sprite.dx = -left_sprite.dx;
});

kontra.keys.bind('right',function(){
	if(right_sprite.dx == 0){
		if(right_sprite.x < D){
			right_sprite.dx = XSPEED;
		} else {
			right_sprite.dx = - XSPEED;
		}
	}else 
		right_sprite.dx = -right_sprite.dx;
});

let loop = kontra.gameLoop({
	update: function(){
		levelGen();

		updatePlayer();

		var del = [];
		for (i in sprites){
			var sprite = sprites[i]
			sprite.update();
			if(sprite.y > HEIGHT){
				if(sprite.type=='collectible'){
					gameOver();
				}
				del.push(i);
			}
		}
		for (i in del){
			sprites.splice(del[i],1);
		}

		check();
	},
	render: function(){
		for (i in dividers){
			var sprite = dividers[i]
			sprite.render();
		}

		for (i in sprites){
			var sprite = sprites[i]
			sprite.render();
		}

		renderPlayer();
	}
});

loop.start();
