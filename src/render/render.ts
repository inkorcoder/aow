import { Grid } from "./../core/grid";

export class Render {

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;

	constructor(){
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext("2d");
		this.setRects();

		window.addEventListener('resize', (e)=> {
			this.setRects();
		});
	}

	setRects(){
		this.canvas.width = this.width;
		this.canvas.height = this.height;
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