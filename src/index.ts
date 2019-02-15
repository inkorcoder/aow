import "./styles.scss";
import './math/math';
import './core/arrays';

import { Vector } from "./math/vector";
import { Grid } from './core/grid';
import { Node } from './core/grid-node';
import { Object2D } from './core/object';
import { Render } from "./render/render";
// import { Pathfinding } from './ai/pathfinding';
import { PathfindingManager } from './ai/pathfinding-manager';

// let vec1: Vector = new Vector();
// console.log(vec1);

let sizeX: number = 30,
		sizeY: number = 30,
		walkable = [],
		// walkable: number[][] = [
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
		// 	[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
		// 	[1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,0,0,1,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		// ],
		r = 14;
for (let y = 0; y < sizeY; y++){
	walkable[y] = [];
	for (let x = 0; x < sizeX; x++){
		walkable[y].push(Math.random() < .2 ? 0 : 1);
	}
}

// for (let x = 0; x < sizeX; x++){
// 	for (let y = 0; y < sizeY; y++){

// 	}
// }

let grid: Grid = new Grid(sizeX, sizeY, walkable, r);
let render: Render = new Render();
let player: Object2D = new Object2D();
player.position.x = 100;
player.position.y = 110;

// let pathfinder: Pathfinding = new Pathfinding(grid);
let pathfindingManager: PathfindingManager = new PathfindingManager(grid);

render.width = sizeX*(r*2);
render.height = sizeY*r;
render.setRects();
render.onRender(()=> {
	render.clear();
	render.renderMap(grid);
	player.render(render.ctx);
	// let ns = grid.getNeighbours (grid.nodeFromWorldPoint(player.position));
	// console.log(ns)

	let d1 = performance.now();
	for (let j = 0; j < 1; j++){
		pathfindingManager.enqueue({
			time: new Date().getTime(),
			start: new Vector(),
			target: player.position,
			callback: (path: any[])=> {
				// let path = pathfinder.findPath(new Vector(), player.position);
				if (path) {
					for (let i = 0; i < path.length; i++){
						let p = new Object2D();
						p.position = grid.nodeCenter(path[i]);
						p.render(render.ctx);
					}
				}
			}
		})
	}
	let d2 = performance.now();
	// console.log(((d2-d1)).toFixed(0))
});
render.start();


document.addEventListener('mousemove', (e: MouseEvent)=> {
	let rect = render.canvas.getBoundingClientRect();
	let node: Node = grid.nodeFromWorldPoint(new Vector(
		e.clientX - rect.left, e.clientY - rect.top,
	));
	player.position = grid.nodeCenter(node);
})