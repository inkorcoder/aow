import "./styles.scss";

import { Vector } from "./math/vector";
import { Grid } from './core/grid';
import { Render } from "./render/render";


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
		],
		r = 20;

// for (let x = 0; x < sizeX; x++){
// 	for (let y = 0; y < sizeY; y++){

// 	}
// }

let grid: Grid = new Grid(sizeX, sizeY, walkable, r);
let render: Render = new Render();
render.width = sizeX*(r*2);
render.height = sizeY*r;
render.setRects();
render.renderMap(grid);