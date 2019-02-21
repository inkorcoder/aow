import { Map } from "./map";
import { Grid } from "./../core/grid";

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

	}

	renderMap(map: Map){
		if (map){
			// this.ctx.clearRect(0, 0, this.width, this.height);
			for (let x = 0; x < map.size.x; x++){
				for (let y = 0; y < map.size.y; y++){
					// console.log(map.data[y][x]);
					// if (map.data[y][x] === 0){
					// 	this.ctx.fillStyle = "#555";
					// } else {
					// 	this.ctx.fillStyle = "#ddd";
					// }
					// this.ctx.fillStyle = map.colors.mountain;
					let v = map.data[y][x];
					if (v <= map.layers.water){
						this.ctx.fillStyle = map.colors.water;
					} else if (v <= map.layers.ground){
						this.ctx.fillStyle = map.colors.ground;
					} else if (v <= map.layers.grass){
						this.ctx.fillStyle = map.colors.grass;
					} else if (v <= map.layers.foot){
						this.ctx.fillStyle = map.colors.foot;
					} else {
						this.ctx.fillStyle = map.colors.mountain;
					}
					// this.ctx.fillStyle = `rgb(${v/1*255},${v/1*255},${v/1*255})`;
					// this.ctx.fillStyle = "#ddd";
					this.ctx.fillRect(x*map.cellSize.x, y*map.cellSize.y, map.cellSize.x, map.cellSize.y);
					// this.ctx.fillStyle = "#999";
					// this.ctx.fillText(map.data[y][x].toString(), x*map.cellSize.x+2, y*map.cellSize.y+12);
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

}