import { Map } from "./map";
import { Grid } from "./../core/grid";
import { Vector } from "./../math/vector";

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
			this.setRects();
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

	renderTexturedMap(map: Map, textures: string[], indexes: number[][]){
		if (map){
			// console.log(textures, indexes)
			for (let x = 0; x < map.size.x; x++){
				for (let y = 0; y < map.size.y; y++){
					let groundtype = Math.clamp(map.data[y][x], 0, 4);
					// console.log(groundtype)
					let tile: any = textures[indexes[groundtype][Math.floor(indexes[groundtype].length*Math.random())]];
					this.ctx.putImageData(tile, x*map.cellSize.x, y*map.cellSize.y);
					// this.ctx.fillStyle = map.colors[key];
					// this.ctx.fillRect(x*map.cellSize.x, y*map.cellSize.y, map.cellSize.x, map.cellSize.y);
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

}