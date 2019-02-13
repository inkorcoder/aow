import { Vector } from './../math/vector';
import { Node } from './../core/grid-node';
import { Grid } from './../core/grid';

export class Pathfinding {

	grid: Grid;

	constructor(grid: Grid){
		this.grid = grid;
	}

	findPath(startPosition: Vector, targetPosition: Vector){
		let startNode: Node = this.grid.nodeFromWorldPoint(startPosition);
		let targetNode: Node = this.grid.nodeFromWorldPoint(targetPosition);

		let openSet: Node[] = [];
		let closedSet: Node[] = [];

		openSet.push(startNode);
		while (openSet.length){
			let currentNode: Node = openSet[0];
			for (let i = 0; i < openSet.length; i++){
				if (openSet[i].fCost < currentNode.fCost || openSet[i].fCost == currentNode.fCost && openSet[i].hCost < currentNode.hCost){
					currentNode = openSet[i];
				}
			}

			openSet.remove(currentNode);
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
						openSet.push(neighbour);
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
		path.reverse();
		return path;
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