import { $ } from './../core/dom';


let images: any = {
	ground: document.querySelector('#textureGround'),
	mountains: document.querySelector('#textureMountains')
};

let positions: number[][] = [];
for (let groupY = 0; groupY < 5; groupY++){
	for (let groupX = 0; groupX < 7; groupX++){
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
	samples: { // igamges base64
		ground: [],
		mountains: []
	},
	data: { // canvas imageData
		ground: [],
		mountains: []
	},
	groundIndexes: [
		[].createNumerical(18, 18),
		[].createNumerical(81, 36),
		[].createNumerical(144, 36),
		[].createNumerical(207, 36),
		[].createNumerical(252, 36)
	],
	groundBoundaries: {
		water: {min: 0, max: 44},
		ground: {min: 45, max: 89},
		grass: {min: 90, max: 134},
		greenery: {min: 135, max: 179},
		foot: {min: 180, max: 206},
		mountain: {min: 180, max: 206}
	},
	getRandomGroundTile: function(groundType: number){
		let availableTiles = this.data.ground,
				indexesArray = this.groundIndexes[groundType],
				tileIndex = Math.floor(Math.random()*indexesArray.length);
				// console.log(groundType, tileIndex);
		return {
			tile: availableTiles[indexesArray[tileIndex]],
			index: indexesArray[tileIndex]
		};
	},
	getTypeByBoundary: function(index: number){
		let bounds = this.groundBoundaries;
		if (index >= bounds.water.min && index <= bounds.water.max){
			return "water";
		} else if (index >= bounds.ground.min && index <= bounds.ground.max){
			return "ground";
		} else if (index >= bounds.grass.min && index <= bounds.grass.max){
			return "grass";
		} else if (index >= bounds.greenery.min && index <= bounds.greenery.max){
			return "greenery";
		} else if (index >= bounds.foot.min && index <= bounds.foot.max){
			return "foot";
		} else if (index >= bounds.mountain.min && index <= bounds.mountain.max){
			return "mountain";
		}
	},
	getRandomMountainTile: function(){
		return Texturer.data.mountains[Math.randomInt(0, Texturer.data.mountains.length)];
	},
	getRandomMountainSamle: function(){
		return Texturer.samples.mountains[Math.randomInt(0, Texturer.samples.mountains.length)];
	}
};
Texturer.canvas.width = Texturer.canvas.height = 1024;
Texturer.ctx = Texturer.canvas.getContext("2d");

let tileCanvas = document.createElement('canvas'),
		tileCtx = tileCanvas.getContext('2d');
tileCanvas.width = 30;
tileCanvas.height = 20;






/* ground loading */
function createTiles(){
	Texturer.ctx.clearRect(0, 0, 1024, 1024);
	Texturer.ctx.drawImage(images.ground, 0, 0, images.ground.clientWidth, images.ground.clientHeight);
	for (let i = 0; i < positions.length; i++){
		let pos = positions[i];
		let tile = Texturer.ctx.getImageData(pos[0]*31+1, pos[1]*21+1, 30, 20);
		tileCtx.putImageData(tile, 0, 0);
		Texturer.samples.ground.push(tileCanvas.toDataURL());
		Texturer.data.ground.push(tile);
	}
}

if (images.ground){
	if (images.ground.complete){
		createTiles();
	} else {
		images.ground.onload = (e: any)=> {
			createTiles();
		};
	}
}
/**/

/* mountains loading */
function createMountainsTiles(){
	Texturer.ctx.clearRect(0, 0, 1024, 1024);
	Texturer.ctx.drawImage(images.mountains, 0, 0, images.mountains.clientWidth, images.mountains.clientHeight);
	tileCanvas.width = 60;
	tileCanvas.height = 40;
	let html: string = "";
	for (let y = 0; y < 3; y++){
		for (let x = 0; x < 6; x++){
			let imgX = x*61+1,
					imgY = y*41+1;
			let tile = Texturer.ctx.getImageData(imgX, imgY, 60, 40);
			tileCtx.putImageData(tile, 0, 0);
			Texturer.samples.mountains.push(tileCanvas.toDataURL());
			Texturer.data.mountains.push(tile);
			html += `<li><img src="${tileCanvas.toDataURL()}"/></li>`;
		}
	}
	$('.objects-list').html(html);
}

if (images.mountains){
	if (images.mountains.complete){
		createMountainsTiles();
	} else {
		images.mountains.onload = (e: any)=> {
			createMountainsTiles();
		};
	}
}
/**/


interface TexturesSet {
	ground: HTMLImageElement;
	canvas: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
	samples?: {
		ground: string[];
		mountains: string[];
	};
	data: {
		ground: any[];
		mountains: any[];
	};
	groundIndexes: number[][];
	getRandomGroundTile: Function;
	groundBoundaries: {
		water: {
			min: number;
			max: number;
		};
		ground: {
			min: number;
			max: number;
		};
		grass: {
			min: number;
			max: number;
		};
		greenery: {
			min: number;
			max: number;
		};
		foot: {
			min: number;
			max: number;
		};
		mountain: {
			min: number;
			max: number;
		};
	};
	getTypeByBoundary: Function;
	getRandomMountainTile: Function;
	getRandomMountainSamle: Function;
}
