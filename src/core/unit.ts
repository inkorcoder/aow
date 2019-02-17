import { MovementManager } from './../ai/movement-manager';
import { Object2D } from './object';
import { Vector } from './../math/vector';
import { Grid } from './grid';

export class Unit {

	movementManager: MovementManager;
	object: Object2D;
	speed: number;
	position: Vector;
	rotation: number;

	constructor(grid: Grid){
		this.movementManager = new MovementManager(grid);
		this.object = new Object2D();
		this.setSpeed(2);
	}

	setSpeed(speed: number){
		this.movementManager.speed = speed;
		this.speed = speed;
	}

	update(){
		this.object.position = this.position;
		this.object.rotation = this.rotation;
		if (!this.movementManager.isRunning){
			this.movementManager.start();
		} else {
			this.movementManager.tick();
		}
		this.position = this.movementManager.lastPosition;
		this.rotation = this.movementManager.nextPosition.angleTo(this.movementManager.lastPosition);

	}

	render(ctx: CanvasRenderingContext2D, options: any){
		this.object.render(ctx, options);
	}
}