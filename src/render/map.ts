import { Vector } from './../math/vector';
import { Texturer } from './../core/texturer';

export class Map {

	size: Vector;
	data: number[][];
	textures: number[][];
	cellSize: Vector;

	roughtness: number = 5;
	type: string;

	layers: mapLayers;

	colors: mapColors = {
		water: "#519ddb",
		ground: "#999da3",
		grass: "#5eb57c",
		greenery: "#53825e",
		foot: "#d1c5ab",
		mountain: "#fff"
	};

	colorsArray: string[] = [
		"water", "ground", "grass", "greenery", "foot", "mountain"
	];

	colorsKeys: mapColorsInt = {
		water: 0,
		ground: 1,
		grass: 2,
		greenery: 3,
		foot: 4,
		mountain: 5
	}

	constructor(sizeX: number = 0, sizeY: number = 0, data: number[][], r: number = 5, d: number = 10){
		this.size = new Vector(sizeX, sizeY);
		this.data = data || [];
		this.cellSize = new Vector(d, r);
		this.setMode(MapModes.General);
		this.textures = [];
	}

	static createMapFromObject(mapData: Map): Map {
		let map = new Map(
			mapData.size.x, mapData.size.y,
			mapData.data,
			mapData.cellSize.y, mapData.cellSize.x
		);
		map.textures = mapData.textures;
		return map;
	}

	setMode(mode: MapModes){
		var layers: mapLayers;
		switch(mode){
			case MapModes.General:
				layers = {water: .7, ground: .77, grass: .88, greenery: .95, foot: .98, mountain: 10};
				break;
			case MapModes.Water:
				layers = {water: .85, ground: 1, grass: 1000, greenery: 1000, foot: 1000, mountain: 1000};
				break;
			case MapModes.Greenery:
				layers = {water: .7, ground: .8, grass: .88, greenery: 1, foot: 1000, mountain: 1000};
				break;
			case MapModes.Swamp:
				layers = {water: .7, ground: .95, grass: .98, greenery: 1, foot: 1000, mountain: 1000};
				break;
			case MapModes.Desert:
				layers = {water: 0, ground: 0, grass: .7, greenery: .8, foot: 1, mountain: 1};
				break;
			case MapModes.Mountains:
				layers = {water: 0, ground: 0, grass: .7, greenery: .8, foot: .9, mountain: 1};
				break;
		}
		this.type = mode;
		this.layers = layers;
	}

	generateGrid(data: number[][]){
		for (let x = 0; x < this.size.x; x++){
			for (let y = 0; y < this.size.y; y++){
				if (!this.data[y]){
					this.data[y] = [];
				}
				let v = data[y][x];
				if (v <= this.layers.water){
					this.data[y][x] = 0;
				} else if (v <= this.layers.ground){
					this.data[y][x] = 1;
				} else if (v <= this.layers.grass){
					this.data[y][x] = 2;
				} else if (v <= this.layers.greenery){
					this.data[y][x] = 3;
				} else if (v <= this.layers.foot){
					this.data[y][x] = 4;
				} else {
					this.data[y][x] = 5;
				}
			}
		}
		this.generateTextures();
	}

	generateTextures(){
		let textures = Texturer.data.ground,
				indexes = Texturer.groundIndexes;
		for (let x = 0; x < this.size.x; x++){
			for (let y = 0; y < this.size.y; y++){
				let groundType = Math.clamp(this.data[y][x], 0, 4);
				// console.log(groundType);
				let tile: any = Texturer.getRandomGroundTile(groundType);
				// let tile: any = textures[indexes[groundType][Math.floor(indexes[groundType].length*Math.random())]];
				if (!this.textures[y]) this.textures[y] = [];
				this.textures[y][x] = tile.index;
			}
		}
	}

}

interface mapLayers {
	water: number;
	ground: number;
	grass: number;
	greenery: number;
	foot: number;
	mountain: number;
}

interface mapColors {
	[key:string]: string;
	water: string;
	ground: string;
	grass: string;
	greenery: string;
	foot: string;
	mountain: string;
}

interface mapColorsInt {
	[key:string]: number;
	water: number;
	ground: number;
	grass: number;
	greenery: number;
	foot: number;
	mountain: number;
}

export enum MapModes {
	General = "general",
	Water = "water",
	Greenery = "greenery",
	Swamp = "swamp",
	Desert = "desert",
	Mountains = "mountains"
}