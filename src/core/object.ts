import { Node } from './grid-node';
import { Vector } from './../math/vector';


export class Object2D {

	position: Vector;
	rotation: number;
	options: any;

	constructor(pos: Vector = new Vector()){
		this.position = pos;
		this.rotation = 0;
		this.options = {
			color: "red",
			radius: 7
		}
	}

	render(ctx: CanvasRenderingContext2D, options?: any){
		if (options){
			for (let key in options){
				this.options[key] = options[key];
			}
		}
		let pointOnCircle: Vector = Math.getPointOnCircle(this.options.radius, this.rotation).add(this.position);
		ctx.beginPath();
		ctx.strokeStyle = this.options.color;
		ctx.arc(this.position.x, this.position.y, this.options.radius, 0, Math.PI*2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(pointOnCircle.x, pointOnCircle.y);
		ctx.stroke();
	}

}