let images: any = {
	ground: document.querySelector('#textureGround')
};

let positions: number[][] = [];
for (let groupY = 0; groupY < 5; groupY++){
	for (let groupX = 0; groupX < 5; groupX++){
		if (groupY === 4 && groupX < 2){
			continue;
		}
		for (let y = 0; y < 3; y++){
			for (let x = 0; x < 3; x++){
				positions.push([groupX*3+x,groupY*3+y]);
			}
		}
	}
}


export let Texturer: TexturesSet = {
	ground: images.ground,
	canvas: document.createElement('canvas'),
	samples: {
		ground: []
	},
	data: {
		ground: []
	}
};
Texturer.canvas.width = Texturer.canvas.height = 512;
Texturer.ctx = Texturer.canvas.getContext("2d");

let tileCanvas = document.createElement('canvas'),
		tileCtx = tileCanvas.getContext('2d');
tileCanvas.width = 30;
tileCanvas.height = 20;

function createTiles(){
	Texturer.ctx.drawImage(images.ground, 0, 0, images.ground.clientWidth, images.ground.clientHeight);
	for (let i = 0; i < positions.length; i++){
		let pos = positions[i];
		let tile = Texturer.ctx.getImageData(pos[0]*31+1, pos[1]*21+1, 30, 20);
		tileCtx.putImageData(tile, 0, 0);
		Texturer.samples.ground.push(tileCanvas.toDataURL());
		Texturer.data.ground.push(tile);
	}
}

if (images.ground.complete){
	createTiles();
} else {
	images.ground.onload = (e: any)=> {
		createTiles();
	};
}



interface TexturesSet {
	ground: HTMLImageElement;
	canvas: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
	samples?: {
		ground: any[];
	};
	data: {
		ground: any[]
	}
}
