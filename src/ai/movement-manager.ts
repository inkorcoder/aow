import { Node } from './../core/grid-node';
import { Vector } from './../math/vector';
import { Grid } from './../core/grid';

export class MovementManager {

	path: Node[] | null;
	lastPosition: Vector | null;
	isRunning: boolean;
	isTargetReached: boolean;
	nextPosition: Vector;
	currentWaypointIndex: number;
	grid: Grid;
	speed: number;

	constructor(grid: Grid){
		this.path = null;
		this.lastPosition = null;
		this.isRunning = false;
		this.isTargetReached = false;
		this.currentWaypointIndex = 0;
		this.grid = grid;
		this.nextPosition = new Vector();
	}


	setPath(path: Node[]){
		this.path = path;
	}

	tick(){
		if (!this.isRunning || this.isTargetReached) return;
		if (!this.lastPosition) {
			this.lastPosition = this.grid.nodeCenter(this.path[0]);
			this.currentWaypointIndex++;
		}
		if (!this.path[this.currentWaypointIndex]){
			this.isTargetReached = true;
			this.stop()
			console.log("target reached!");
			return
		}
		this.nextPosition = this.grid.nodeCenter(this.path[this.currentWaypointIndex]);
		let direction: Vector = this.nextPosition.subtract(this.lastPosition).normalize();
		this.lastPosition = this.lastPosition.add(direction.multiply(this.speed));

		if (this.lastPosition.distanceTo(this.nextPosition) < this.speed){
			this.currentWaypointIndex++;
			// if (this.currentWaypointIndex === this.path.length-1){
			// 	this.isTargetReached = true;
			// 	this.stop()
			// 	console.log("target reached!");
			// }
		}
	}

	start(){
		this.isRunning = true;
		this.tick();
	}

	stop(){
		this.isRunning = false;
	}

	removePath(){
		this.path = null;
	}


	public get hasPath(){
		return this.path !== null;
	}

}