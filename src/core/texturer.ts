let images: any = {
	ground: document.querySelector('#textureGround')
};

let positions: number[][] = [
	// water
	[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2],
	[3,0], [4,0], [5,0], [3,1], [4,1], [5,1], [3,2], [4,2], [5,2],
	[6,0], [6,1], [6,2], [7,0], [7,1], [7,2], [8,0], [8,1], [8,2],
	// ground
	[0,3], [1,3], [2,3], [0,4], [1,4], [2,4], [0,5], [1,5], [2,5],
	[3,3], [4,3], [5,3], [3,4], [4,4], [5,4], [3,5], [4,5], [5,5],
	[6,3], [6,4], [6,5], [7,3], [7,4], [7,5], [8,3], [8,4], [8,5],
	// grass
	[0,6], [1,6], [2,6], [0,7], [1,7], [2,7], [0,8], [1,8], [2,8],
	[3,6], [4,6], [5,6], [3,7], [4,7], [5,7], [3,8], [4,8], [5,8],
	[6,6], [6,7], [6,8], [7,6], [7,7], [7,8], [8,6], [8,7], [8,8],
	// grass 2
	[0,9], [1,9], [2,9], [0,10], [1,10], [2,10], [0,11], [1,11], [2,11],
	[3,9], [4,9], [5,9], [3,10], [4,10], [5,10], [3,11], [4,11], [5,11],
	[6,9], [6,10], [6,11], [7,9], [7,10], [7,11], [8,9], [8,10], [8,11],
];

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
