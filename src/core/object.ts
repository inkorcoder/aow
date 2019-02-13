import { Node } from './grid-node';
import { Vector } from './../math/vector';


export class Object2D {

	position: Vector;

	constructor(pos: Vector = new Vector()){
		this.position = pos;
	}

	render(ctx: CanvasRenderingContext2D){
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI*2);
		ctx.fill();
	}

}