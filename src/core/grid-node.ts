import { Vector } from './../math/vector';

export class Node {

	public walkable: boolean;
	public worldPosition: Vector;

	constructor(w: boolean, wp: Vector){
		this.walkable = w;
		this.worldPosition = wp;
	}

}