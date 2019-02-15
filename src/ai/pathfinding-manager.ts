import { Pathfinding } from './pathfinding';
import { Grid } from './../core/grid';
import { Vector } from './../math/vector';

export class PathfindingManager {

	private queue: PathfindingQueueitem[];
	private maximumStackSize: number;
	private pathfinder: Pathfinding;

	constructor(grid: Grid, maximumStackSize: number = 10){
		this.queue = [];
		this.pathfinder = new Pathfinding(grid);
		this.maximumStackSize = maximumStackSize;
	}

	enqueue(newItem: PathfindingQueueitem){
		this.queue.push(newItem);
		this.checkForProcessing();
	}

	canHandle(){
		return this.queue.length < this.maximumStackSize;
	}

	checkForProcessing(){
		if (this.queue.length){
			var t1 = performance.now();
			let { start, target, callback } = this.queue[0];
			let path = this.pathfinder.findPath(start, target);
			callback(path);
			this.queue.shift();
			this.checkForProcessing();
			var t2 = performance.now();
		}
	}

}

interface PathfindingQueueitem {
	time?: number;
	start: Vector;
	target: Vector;
	callback: Function;
}