import { Vector } from './../math/vector';

export class Node {

	public walkable: boolean;
	public worldPosition: Vector;

	public gridX: number;
	public gridY: number;

	public gCost: number;
	public hCost: number;
	public parent: Node;

	constructor(w: boolean, wp: Vector, gx: number, gy: number){
		this.walkable = w;
		this.worldPosition = wp;
		this.gridX = gx;
		this.gridY = gy;
		this.gCost = 0;
		this.hCost = 0;
	}

	public get fCost(): number {
		return this.gCost + this.hCost;
	}

}