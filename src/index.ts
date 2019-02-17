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
import { Unit } from './core/unit';

// let vec1: Vector = new Vector();
// console.log(vec1);

let sizeX: number = 40,
		sizeY: number = 40,
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
		r = 15,
		d = 25;

let availableCells: Vector[] = [];
for (let y = 0; y < sizeY; y++){
	walkable[y] = [];
	for (let x = 0; x < sizeX; x++){
		let isAvailable = Math.random() > .2;
		if (isAvailable){
			availableCells.push(new Vector(x, y));
		}
		walkable[y].push(isAvailable ? 1 : 0);
	}
}
// console.log(availableCells)
// for (let x = 0; x < sizeX; x++){
// 	for (let y = 0; y < sizeY; y++){

// 	}
// }


let grid: Grid = new Grid(sizeX, sizeY, walkable, r, d);
let render: Render = new Render();
let player: Object2D = new Object2D();

// player.position = grid.nodeCenterByVector(new Vector(sizeX/2, sizeY/2));
// player.position = availableCells[Math.floor(availableCells.length*Math.random())].add(new Vector(5,5)).scale(d,r);
player.position = new Vector(210, 200);

let units: Unit[] = [];
for (let j = 0; j < 10; j++){
	let u = new Unit(grid);
	u.position = new Vector(Math.randomInt(0, sizeX)*d, Math.randomInt(0, sizeY)*r);
	if (grid.nodeFromWorldPoint(u.position).walkable){
		units.push(u);
	}
}

// let pathfinder: Pathfinding = new Pathfinding(grid);
let pathfindingManager: PathfindingManager = new PathfindingManager(grid);

render.width = sizeX*(r*2);
render.height = sizeY*r;
render.setRects();
render.onRender(()=> {
	render.clear();
	render.renderGrid(grid);
	player.render(render.ctx);
	// let ns = grid.getNeighbours (grid.nodeFromWorldPoint(player.position));
	// console.log(ns)
	let pl1 = new Object2D();
	pl1.position = player.position;
	pl1.render(render.ctx, {color: "blue", radius: 20});
	let d1 = performance.now();
	for (let j = 0; j < units.length; j++){
		let pl = units[j];
		pl.position = units[j].position;
		pl.render(render.ctx, {color: "green", radius: 10});
		if (!pl.movementManager.hasPath){
			pathfindingManager.enqueue({
				time: new Date().getTime(),
				start: pl.position,
				target: player.position,
				callback: (path: any[])=> {
					// let path = pathfinder.findPath(new Vector(), player.position);
					pl.movementManager.setPath(path);
				}
			})
		} else if (pl.movementManager) {
			// for (let i = 0; i < pl.movementManager.path.length; i++){
			// 	let p = new Object2D();
			// 	p.position = grid.nodeCenter(pl.movementManager.path[i]);
			// 	if (pl.movementManager.path[i+1]){
			// 		p.rotation = p.position.angleTo(grid.nodeCenter(pl.movementManager.path[i+1])) + Math.PI;
			// 	}
			// 	p.render(render.ctx, {radius: 7});
			// }
		}
		pl.update();
	}
	let d2 = performance.now();
	// console.log(((d2-d1)).toFixed(0))
});
render.start();
// render.stop();


// document.addEventListener('mousemove', (e: MouseEvent)=> {
// 	let rect = render.canvas.getBoundingClientRect();
// 	let node: Node = grid.nodeFromWorldPoint(new Vector(
// 		e.clientX - rect.left, e.clientY - rect.top,
// 	));
// 	player.position = grid.nodeCenter(node);
// })