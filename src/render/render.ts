import { Grid } from "./../core/grid";

export class Render {

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;

	isRunning: boolean;
	onRenderCallbacks: Function[];

	constructor(){
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext("2d");
		this.setRects();
		this.isRunning = false;
		this.onRenderCallbacks = [];

		window.addEventListener('resize', (e)=> {
			this.setRects();
		});
	}

	setRects(){
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	start(){
		this.isRunning = true;
		this.render();
	}

	stop(){

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

	renderMap(map: Grid){
		if (map){
			this.ctx.fillStyle = "#ddd";
			this.ctx.clearRect(0, 0, this.width, this.height);
			for (let x = 0; x < map.gridSizeX; x++){
				for (let y = 0; y < map.gridSizeY; y++){
					if (map.walkable[x][y] === 0){
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