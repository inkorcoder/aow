import "./styles.scss";
import './math/math';
import './core/arrays';

import { Vector } from "./math/vector";
import { Grid } from './core/grid';
import { Node } from './core/grid-node';
import { Object2D } from './core/object';
import { Render } from "./render/render";
import { Map } from "./render/map";
// import { Pathfinding } from './ai/pathfinding';
import { PathfindingManager } from './ai/pathfinding-manager';
import { Unit } from './core/unit';
import { noise } from './math/noise';


let sizeX = 120,
		sizeY = 120,
		r = 4,
		d = 7,
		walkable = [],
		mapData;

for (let y = 0; y < sizeY; y++){
	walkable[y] = [];
	for (let x = 0; x < sizeX; x++){
		walkable[y].push(Math.random() < .05 ? 0 : 1);
	}
}

function updateMap(size: number){
	mapData = noise(size, 1, 4, 1, 0);
	map = new Map(sizeX, sizeY, mapData, r, d);
}
updateMap(128);

// let grid: Grid = new Grid(sizeX, sizeY, walkable, r, d);
let map: Map = new Map(sizeX, sizeY, mapData, r, d);
let render: Render = new Render();

render.width = sizeX*(r*2);
render.height = sizeY*r;
render.setRects();
render.onRender(()=> {
	render.clear();
	render.renderMap(map);

});
render.start();
// render.stop();

// console.log()

[].slice.call(document.querySelectorAll('input')).forEach((node: any)=> {
	node.addEventListener('click', (e: any)=> {
		let size = 128;
		if (e.target.name === 'size'){
			size = parseInt(e.target.value);
		}
		console.log(size)
		updateMap(size);
	});
})
