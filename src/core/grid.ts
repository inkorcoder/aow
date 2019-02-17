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
		this.nodeDiameter = r*1.5; // 2
		this.walkable = walkable;
		this.createGrid();
	}

	createGrid(){
		this.grid = [];
		// let worldB
		// console.log(this.gridSizeX, this.gridSizeY)

		for (let x = 0; x < this.gridSizeX; x++){
			for (let y = 0; y < this.gridSizeY; y++){
				if (!this.grid[y]) {
					this.grid[y] = [];
				}
				this.grid[y][x] = new Node(this.walkable[y][x] !== 0, new Vector(x, y), x, y);
			}
		}
	}

	nodeFromWorldPoint(position: Vector): Node {
		let x = Math.floor(position.x / this.nodeDiameter),
				y = Math.floor(position.y / this.nodeRadius);
		x = Math.clamp(x, 0, this.gridSizeX-1);
		y = Math.clamp(y, 0, this.gridSizeY-1);
		return this.grid[y][x];
	}

	nodeCenter(node: Node){
		return node.worldPosition.clone().scale(this.nodeDiameter, this.nodeRadius).add(new Vector(this.nodeDiameter/2, this.nodeRadius/2));
	}

	getNeighbours(node: Node){
		let neighbours: Node[] = [];
		for (let x = -1; x <= 1; x ++){
			for (let y = -1; y <= 1; y ++){
				if (x === 0 && y === 0) continue;
				let checkX = node.gridX + x,
						checkY = node.gridY + y;

				if (checkX >= 0 && checkX < this.gridSizeX && checkY >= 0 && checkY < this.gridSizeY){
					neighbours.push(this.grid[checkY][checkX]);
				}
			}
		}
		return neighbours;
	}

}