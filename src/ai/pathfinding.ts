import { Vector } from './../math/vector';
import { Node } from './../core/grid-node';
import { Grid } from './../core/grid';
import { Heap } from './heap';

export class Pathfinding {

	grid: Grid;

	constructor(grid?: Grid){
		this.grid = grid;
	}

	findPath(startPosition: Vector, targetPosition: Vector){
		let startNode: Node = this.grid.nodeFromWorldPoint(startPosition);
		let targetNode: Node = this.grid.nodeFromWorldPoint(targetPosition);

		if (!startNode.walkable || !targetNode.walkable){
			return [];
		}

		let openSet: Heap = new Heap();
		let closedSet: Node[] = [];

		openSet.add(startNode);
		while (openSet.count){
			let currentNode: Node = openSet.removeFirst();

			closedSet.push(currentNode);

			if (currentNode === targetNode){
				// console.log("founded!");
				return this.retracePath(startNode, targetNode);
			}

			let neighbours: Node[] = this.grid.getNeighbours(currentNode);
			for (let i = 0; i < neighbours.length; i++){
				let neighbour = neighbours[i];
				if (!neighbour.walkable || closedSet.contains(neighbour)){
					continue;
				}
				let newMovementCost = currentNode.gCost + this.getDistance(currentNode, neighbour);
				if (newMovementCost < neighbour.gCost || !openSet.contains(neighbour)){
					neighbour.gCost = newMovementCost;
					neighbour.hCost = this.getDistance(neighbour, targetNode);
					neighbour.parent = currentNode;

					if (!openSet.contains(neighbour)){
						openSet.add(neighbour);
					}
				}
			}
		}
	}

	retracePath(startNode: Node, endNode: Node){
		let path: Node[] = [];
		let currentNode: Node = endNode;

		while (currentNode != startNode){
			path.push(currentNode);
			currentNode = currentNode.parent;
		}
		let waypoints = this.simplifyPath(path);
		waypoints.reverse();
		return waypoints;
		// path.reverse();
		// return path;
	}

	simplifyPath(path: Node[]){
		let waypoints: Node[] = [];
		let directionOld = new Vector();
		for (let i = 1; i < path.length; i++){
			let directionNew = new Vector(
				path[i-1].gridX - path[i].gridX,
				path[i-1].gridY - path[i].gridY
			);
			if (!directionNew.isEqualTo(directionOld)){
				waypoints.push(path[i-1]);
				waypoints.push(path[i]);
			}
			directionOld = directionNew;
		}
		return waypoints;
	}

	getDistance(nodeA: Node, nodeB: Node): number {
		let distX = Math.abs(nodeA.gridX - nodeB.gridX),
				distY = Math.abs(nodeA.gridY - nodeB.gridY);
		if (distX > distY){
			return 14*distY + 10*(distX-distY);
		} else {
			return 14*distX + 10*(distY-distX);
		}
	}

}