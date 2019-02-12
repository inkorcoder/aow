import "./styles.scss";

import { Vector } from "./math/vector";
import { Grid } from './core/grid';


// let vec1: Vector = new Vector();
// console.log(vec1);

let sizeX: number = 10,
		sizeY: number = 10,
		walkable: number[][] = [
			[1,1,1,1,1,1,1,1,1,1],
			[1,0,0,1,1,1,1,0,0,1],
			[1,0,0,1,1,1,1,0,0,1],
			[1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,0,0,1,1,1,1],
			[1,1,1,1,0,0,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1],
			[1,0,0,1,1,1,1,0,0,1],
			[1,0,0,1,1,1,1,0,0,1],
			[1,1,1,1,1,1,1,1,1,1]
		];

// for (let x = 0; x < sizeX; x++){
// 	for (let y = 0; y < sizeY; y++){

// 	}
// }

let grid: Grid = new Grid(sizeX, sizeY, walkable);
