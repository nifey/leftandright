const WIDTH = 800;
const HEIGHT = 1200;
const CARWIDTH = 100;
const CARHEIGHT = 150;
const DISTFROMBOTTOM = 50;

var sprites = [];
var left_sprite;
var right_sprite;

kontra.init();

kontra.canvas.width = WIDTH;
kontra.canvas.height = HEIGHT;

function initLevel(){
	sprites.push(kontra.sprite({x:WIDTH/2,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	sprites.push(kontra.sprite({x:WIDTH/4,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	sprites.push(kontra.sprite({x:3*WIDTH/4,y:0,width:2,height:HEIGHT,color:'black',type:'divider'}));
	left_sprite = kontra.sprite({
		x:(WIDTH/4-CARWIDTH)/2,
		y:HEIGHT-DISTFROMBOTTOM-CARHEIGHT,
		width:CARWIDTH,
		height:CARHEIGHT,
		color:'yellow',
	});
	right_sprite = kontra.sprite({
		x:3*WIDTH/4 + (WIDTH/4-CARWIDTH)/2,
		y:HEIGHT-DISTFROMBOTTOM-CARHEIGHT,
		width:CARWIDTH,
		height:CARHEIGHT,
		color:'orange',
	});
}
initLevel();

function levelGen(){

}

function updatePlayer(){
	left_sprite.update();
	right_sprite.update();
}

function renderPlayer(){
	left_sprite.render();
	right_sprite.render();
}

function check(){
	for (i in sprites){
		var sprite = sprites[i];
		if(sprite.type!='divider' && (sprite.collidesWith(left_sprite) || sprite.collidesWith(right_sprite))){
			alert("Game over");
		}
	}

}

let loop = kontra.gameLoop({
	update: function(){
		levelGen();

		check();

		updatePlayer();

		for (i in sprites){
			var sprite = sprites[i]
			sprite.update();
		}
	},
	render: function(){
		renderPlayer();

		for (i in sprites){
			var sprite = sprites[i]
			sprite.render();
		}
	}
});

loop.start();
