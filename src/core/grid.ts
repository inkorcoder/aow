import { Node } from './grid-node';
import { Vector } from './../math/vector';

export class Grid {

	grid: Node[][];
	gridSizeX: number;
	gridSizeY: number;
	nodeRadius: number;
	nodeDiameter: number;
	walkable: number[][];

	constructor(sizeX = 1, sizeY = 1, walkable: number[][], r: number = 5){
		this.gridSizeX = sizeX;
		this.gridSizeY = sizeY;
		this.nodeRadius = r;
		this.nodeDiameter = r*2;
		this.walkable = walkable;
		// this.createGrid();
	}

	createGrid(){
		this.grid = [];
		// let worldB

		for (let x = 0; x < this.gridSizeX; x++){
			for (let y = 0; y < this.gridSizeY; y++){

			}
		}
	}

}