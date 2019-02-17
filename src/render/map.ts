import { Vector } from './../math/vector';

export class Map {

	size: Vector;
	data: number[][];
	cellSize: Vector;

	roughtness: number = 5;

	layers: mapLayers = {
		water: .7,
		ground: .77,
		grass: .97,
		foot: .99,
		mountain: 10,
	};

	colors: mapColors = {
		water: "#519ddb",
		ground: "#999da3",
		grass: "#5eb57c",
		foot: "#b8d8c3",
		mountain: "#f0f0f0"
	};

	constructor(sizeX: number = 0, sizeY: number = 0, data: number[][], r: number = 5, d: number = 10){
		this.size = new Vector(sizeX, sizeY);
		this.data = data;
		this.cellSize = new Vector(d, r);
	}

}

interface mapLayers {
	water: number;
	ground: number;
	grass: number;
	foot: number;
	mountain: number;
}

interface mapColors {
	water: string;
	ground: string;
	grass: string;
	foot: string;
	mountain: string;
}