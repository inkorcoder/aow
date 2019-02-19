import { Vector } from './../math/vector';

export class Map {

	size: Vector;
	data: number[][];
	cellSize: Vector;

	roughtness: number = 5;

	layers: mapLayers;

	colors: mapColors = {
		water: "#519ddb",
		ground: "#999da3",
		grass: "#5eb57c",
		foot: "#d1c5ab",
		mountain: "#fff"
	};

	constructor(sizeX: number = 0, sizeY: number = 0, data: number[][], r: number = 5, d: number = 10){
		this.size = new Vector(sizeX, sizeY);
		this.data = data;
		this.cellSize = new Vector(d, r);
		this.setMode(MapModes.Mountains);
	}

	setMode(mode: MapModes){
		var layers: mapLayers;
		switch(mode){
			case MapModes.General:
				layers = {water: .7, ground: .77, grass: .95, foot: .98, mountain: 10};
				break;
			case MapModes.Water:
				layers = {water: .85, ground: 1, grass: 1000, foot: 1000, mountain: 1000};
				break;
			case MapModes.Greenery:
				layers = {water: .7, ground: .8, grass: 1, foot: 1000, mountain: 1000};
				break;
			case MapModes.Swamp:
				layers = {water: .7, ground: .95, grass: 1, foot: 1000, mountain: 1000};
				break;
			case MapModes.Desert:
				layers = {water: 0, ground: 0, grass: .7, foot: 1, mountain: 1};
				break;
			case MapModes.Mountains:
				layers = {water: 0, ground: 0, grass: 0, foot: .9, mountain: 1};
				break;
		}
		this.layers = layers;
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

enum MapModes {
	General = "general",
	Water = "water",
	Greenery = "greenery",
	Swamp = "swamp",
	Desert = "desert",
	Mountains = "mountains"
}