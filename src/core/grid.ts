import { Node } from './grid-node';
import { Vector } from './../math/vector';

export class Grid {

	grid: Node[][];
	gridSizeX: number;
	gridSizeY: number;

	constructor(sizeX = 1, sizeY = 1, walkable: number[][]){
		this.gridSizeX = sizeX;
		this.gridSizeY = sizeY;
		this.createGrid();
	}

	createGrid(){
		this.grid = [];
		// let worldB

		for (let x = 0; x < this.gridSizeX; x++){
			for (let y = 0; y < this.gridSizeX; y++){

			}
		}
	}

}