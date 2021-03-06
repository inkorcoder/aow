import { Map } from "./map";
import { Grid } from "./../core/grid";
import { Vector } from "./../math/vector";
import { Texturer } from './../core/texturer';

export class Render {

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;

	isRunning: boolean;
	onRenderCallbacks: Function[];

	constructor(canvasSelector?: string){
		if (canvasSelector){
			this.canvas = document.querySelector(canvasSelector);
		} else{
			this.canvas = document.querySelector('canvas');
		}
		this.ctx = this.canvas.getContext("2d");
		this.setRects();
		this.isRunning = false;
		this.onRenderCallbacks = [];

		window.addEventListener('resize', (e)=> {
			// this.setRects(this.width, this.height);
			// this.renderSingleFrame();
		});
	}

	setRects(width?: number, height?: number){
		this.canvas.width = width || this.width;
		this.canvas.height = height || this.height;
	}

	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	start(){
		this.isRunning = true;
		this.render();
	}

	stop(){
		this.isRunning = false;
	}

	onRender(callback: Function){
		if (callback){
			this.onRenderCallbacks.push(callback);
		} else {
			console.warn("Renderer :: no onRender cllback passed!");
		}
	}

	render(){

		for (let c = 0; c < this.onRenderCallbacks.length; c++){
			if (this.onRenderCallbacks[c]){
				this.onRenderCallbacks[c]();
			}
		}

		if (this.isRunning){
			requestAnimationFrame(this.render.bind(this));
		}
	}

	renderSingleFrame(){
		this.start();
		this.stop();
	}

	renderColoredMap(map: Map){
		if (map){
			for (let x = 0; x < map.size.x; x++){
				for (let y = 0; y < map.size.y; y++){
					let key: string = map.colorsArray[map.data[y][x]];
					this.ctx.fillStyle = map.colors[key];
					this.ctx.fillRect(x*map.cellSize.x, y*map.cellSize.y, map.cellSize.x, map.cellSize.y);
				}
			}
		}
	}

	renderTexturedMap(map: Map){
		if (map){
			let mountainsIndexes: any[] = [];
			for (let x = 0; x < map.size.x; x++){
				for (let y = 0; y < map.size.y; y++){
					// console.log(map.data[y][x]);
					let tile: any = Texturer.data.ground[map.textures[y][x]];
					this.ctx.putImageData(tile, x*map.cellSize.x, y*map.cellSize.y);
					// mountain
					if (map.data[y][x] === 5){
						mountainsIndexes.push({
							x: x, y: y
						});
						// console.log(x, y)
					}
				}
			}
			console.log(mountainsIndexes.length)
			for (let i = 0; i < mountainsIndexes.length; i++){
				let tile: any = Texturer.getRandomMountainSamle();
				let x: any = mountainsIndexes[i].x;
				let y: any = mountainsIndexes[i].y;
				let img = new Image();
				img.src = tile;
				this.ctx.drawImage(img, x*map.cellSize.x-map.cellSize.x/2, y*map.cellSize.y-map.cellSize.y);
			}

			return {
				subscribe: function(callback?: Function){
					if (callback) {
						callback();
					}
				}
			}
		}
	}

	renderColoredMapSegment(map: Map, segment: Vector, color: string){
		map.data[segment.y][segment.x] = map.colorsKeys[color];
		let key: string = map.colorsArray[map.data[segment.y][segment.x]];
		this.ctx.fillStyle = map.colors[key];
		this.ctx.fillRect(segment.x*map.cellSize.x, segment.y*map.cellSize.y, map.cellSize.x, map.cellSize.y);
	}

	renderTexturedMapSegment(map: Map, segment: Vector, type: string, directIndex?: number){
		let textures = Texturer.data.ground,
				indexes = Texturer.groundIndexes,
				tile: any,
				tileIndex: number;
		if (typeof directIndex === "number"){
			tile = Texturer.data.ground[directIndex];
			tileIndex = directIndex;
		} else {
			let t = Texturer.getRandomGroundTile(map.colorsKeys[type]);
			tile = t.tile;
			tileIndex = t.index;
		}
		if (tile){
			this.ctx.putImageData(tile, segment.x*map.cellSize.x, segment.y*map.cellSize.y);
			map.textures[segment.y][segment.x] = tileIndex;
		} else {
			console.log('Render texture: tile is null');
		}
		return {
			subscribe: function(callback?: Function){
				if (callback) {
					callback(tile, segment, type);
				}
			}
		}
	}

	renderGrid(map: Grid){
		if (map){
			this.ctx.fillStyle = "#ddd";
			for (let x = 0; x < map.gridSizeX; x++){
				for (let y = 0; y < map.gridSizeY; y++){
					if (map.walkable[y][x] === 0){
						this.ctx.fillStyle = "#555";
					} else {
						this.ctx.fillStyle = "#ddd";
					}
					this.ctx.fillRect(x*map.nodeDiameter+1, y*map.nodeRadius+1, map.nodeDiameter-2, map.nodeRadius-2);
				}
			}
		}
	}

	getSnapshot(scale: number = 1){
		let tempCanvas = document.createElement('canvas'),
				tempCtx = tempCanvas.getContext('2d');
		tempCanvas.width = this.canvas.width * scale;
		tempCanvas.height = this.canvas.height * scale;
		let data = this.canvas.toDataURL();
		let image = new Image();
		let callback;
		image.src = data;
		return {
			subscribe: function(callback?: Function){
				image.onload = ()=> {
					tempCtx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);
					if (callback){
						callback(tempCanvas.toDataURL());
					}
				};
			}
		}
	}

}