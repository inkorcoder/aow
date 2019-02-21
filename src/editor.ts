import "./styles.scss";
import './math/math';
import './core/arrays';

import { Vector } from "./math/vector";
import { Grid } from './core/grid';
import { Node } from './core/grid-node';
import { Object2D } from './core/object';
import { Render } from "./render/render";
import { Map, MapModes } from "./render/map";
// import { Pathfinding } from './ai/pathfinding';
import { PathfindingManager } from './ai/pathfinding-manager';
import { Unit } from './core/unit';
import { noise } from './math/noise';
import { Input } from './core/input';


// // console.log(Input.key)

// Input.on('mousedown', (e: Event)=> {
// 	// console.log(e);
// })

// Input.on("mousemove", (e: Event)=> {
// 	// console.log(Input.mouse);
// })

// Input.on("dragstart", (e: Event)=> {
// 	console.log("dragstart");
// })

// Input.on("drag", (e: Event, vector: Vector)=> {
// 	console.log(vector);
// })

// Input.on("dragend", (e: Event)=> {
// 	console.log("dragend");
// })

// Input.on("mousewheel", (e: Event, direction: number, delta: number)=> {
// 	console.log(direction);
// })

let sizeX = 50,
		sizeY = 50,
		r = 10,
		d = 15,
		walkable = [],
		mapData,
		scale = 1,
		oldScale = 1,
		dimension = 256,
		center = new Vector(),
		centerPoint = new Vector(),
		translation = new Vector(),
		lastPosition = new Vector(),
		segment = new Vector(),
		type = MapModes.General;
let view: HTMLElement = document.querySelector('.view');
let wrapper: HTMLElement = document.querySelector('.view .wrapper');
let segmentPointer: HTMLElement = document.querySelector('#segmentPointer');
// for (let y = 0; y < sizeY; y++){
// 	walkable[y] = [];
// 	for (let x = 0; x < sizeX; x++){
// 		walkable[y].push(Math.random() < .05 ? 0 : 1);
// 	}
// }
// wrapper.style.width = sizeX*d+"px";
// wrapper.style.height = sizeY*r+"px";

function createMap(){
	console.log(`Map::creating ${dimension}x${dimension}, size: ${sizeX}x${sizeY}, type: ${type}`);
	mapData = noise(dimension, 1, 4, 1, 0);
	map = new Map(sizeX, sizeY, mapData, r, d);
	map.setMode(type);
	transform();
	noiseRenderer.setRects(sizeX*d, sizeY*r);
	noiseRenderer.start();
	noiseRenderer.stop();
}

// let grid: Grid = new Grid(sizeX, sizeY, walkable, r, d);
let map: Map;
let noiseRenderer: Render = new Render('#noiseRender');
noiseRenderer.setRects(sizeX*d, sizeY*r);
noiseRenderer.onRender(()=> {
	if (map){
		noiseRenderer.renderMap(map);
	}
});
noiseRenderer.start();
noiseRenderer.stop();


function transform(direction?: Vector, origin?: Vector){
	let viewBbox = view.getBoundingClientRect(),
			wrapperBbox = wrapper.getBoundingClientRect(),
			viewCenter = new Vector(viewBbox.width/2, viewBbox.height/2),
			halfSize = new Vector(),
			halfSizeOld = new Vector();

	let oldSize = new Vector(sizeX*d*oldScale, sizeY*r*oldScale);
	let size = new Vector(sizeX*d*scale, sizeY*r*scale);
	halfSize.x = size.x / 2;
	halfSize.y = size.y / 2;
	halfSizeOld.x = oldSize.x / 2;
	halfSizeOld.y = oldSize.y / 2;

	if (direction){
		translation = center.add(direction.clone());
	}
	let position = viewCenter.add(translation).subtract(halfSize);
	let posBefore = viewCenter.add(translation).subtract(halfSizeOld);
	if (origin){
		let precent = new Vector(origin.x / oldSize.x, origin.y / oldSize.y);
		let diff = size.subtract(oldSize);
		position = posBefore.subtract(new Vector(diff.x*precent.x, diff.y*precent.y));
		translation = position.clone().add(halfSize).clone().subtract(viewCenter).clone();
		center = translation.clone();
	}
	lastPosition = position.clone();
	wrapper.style.width = size.x+"px";
	wrapper.style.height = size.y+"px";
	wrapper.style.left = position.x+"px";
	wrapper.style.top = position.y+"px";
	oldScale = scale;
	noiseRenderer.start();
	noiseRenderer.stop();
	document.querySelector('#debugScale').innerHTML = (scale * 100).toFixed()+"%";
	document.querySelector('#debugPositionX').innerHTML = (translation.x).toFixed();
	document.querySelector('#debugPositionY').innerHTML = (translation.y).toFixed();
}
transform();




Input.on('dragstart', (e: any, center: Vector)=> {
	// console.log(center);
});
Input.on('drag', (e: any, direction: Vector)=> {
	// console.log(direction);
	if (e.target.matches('canvas')){
		transform(direction);
	}
});
Input.on('dragend', (e: any)=> {
	if (e.target.matches('canvas')){
		center = translation.clone();
	}
});
Input.on('mousemove', (e: MouseEvent)=> {
	let bbox = wrapper.getBoundingClientRect();
	let x = Math.clamp((Input.mouse.x - bbox.left) / bbox.width, 0, 1),
			y = Math.clamp((Input.mouse.y - bbox.top) / bbox.height, 0, 1);
	document.querySelector('#debugMouseX').innerHTML = (x * bbox.width).toFixed();
	document.querySelector('#debugMouseY').innerHTML = (y * bbox.height).toFixed();
	segment.x = Math.floor((x * bbox.width) / (d * scale));
	segment.y = Math.floor((y * bbox.height) / (r * scale));
	document.querySelector('#debugSegmentX').innerHTML = segment.x.toString();
	document.querySelector('#debugSegmentY').innerHTML = segment.y.toString();
	if (map){
		segmentPointer.style.left = (segment.x / sizeX * bbox.width)+"px";
		segmentPointer.style.top = (segment.y / sizeY * bbox.height)+"px";
		segmentPointer.style.width = (d*scale)+"px";
		segmentPointer.style.height = (r*scale)+"px";
	}
});
Input.on('mousewheel', (e: any, direction: number, delta: number)=> {

	let bbox = wrapper.getBoundingClientRect();
	let origin = new Vector(
		-0.5 + (Input.mouse.x - bbox.left) / bbox.width,
		-0.5 + (Input.mouse.y - bbox.top) / bbox.height
	);
	if (e.target.matches('canvas')){
		let origin = Input.mouse.clone().subtract(new Vector(bbox.left, bbox.top));
		if (direction < 0){
			if (scale < 5) scale *= 2;
			transform(null, origin);
		} else {
			if (scale > 0.2) scale /= 2;
			transform(null, origin);
		}
	}
});


/*
	MAP
*/
[].slice.call(document.querySelectorAll('[name="size"]')).forEach((node: any)=> {
	node.addEventListener('click', ()=> {
		dimension = parseInt(node.value);
	});
});
document.querySelector('#mapSizeX').addEventListener("input", (e: any)=> {
	sizeX = parseInt(e.target.value);
});
document.querySelector('#mapSizeY').addEventListener("input", (e: any)=> {
	sizeY = parseInt(e.target.value);
});
document.querySelector('#mapType').addEventListener("change", (e: any)=> {
	type = e.target.value;
});


document.querySelector('#generateMap').addEventListener("click", ()=> {
	createMap();
	document.querySelector('#debugMapSegmentsX').innerHTML = sizeX.toString();
	document.querySelector('#debugMapSegmentsY').innerHTML = sizeY.toString();
});


[].slice.call(document.querySelectorAll('[data-set-tab]')).forEach((node: any)=> {
	node.addEventListener("mousedown", (e: Event)=> {
		let tabsContentSelector = node.getAttribute('data-set-tab').split(',')[0],
			tabSelector = node.getAttribute('data-set-tab').split(',')[1];
		let tabsContent = document.querySelector(tabsContentSelector);
		[].slice.call(node.parentNode.children).forEach((tab: any)=> {
			tab.classList.remove('active');
		});
		node.classList.add('active');
		
		[].slice.call(tabsContent.children).forEach((tab: any)=> {
			if (tab.id === tabSelector.replace(/\#/gim, '')){
				tab.classList.add('active');
			} else {
				tab.classList.remove('active');
			}
		});
	})
});

/*
*/
// [].slice.call(document.querySelectorAll('input')).forEach((node: any)=> {
// 	node.addEventListener('click', (e: any)=> {
// 		let size = 256;
// 		if (e.target.name === 'size'){
// 			size = parseInt(e.target.value);
// 		}
// 		createMap(size);
// 	});
// });

/*
	Output
*/
[].slice.call(document.querySelectorAll('[data-output]')).forEach((node: any)=> {
	node.addEventListener('input', (e: any)=> {
		document.querySelector(node.getAttribute('data-output')).innerHTML = e.target.value;
	});
});


/*
	DEBUG
*/
document.querySelector('#debugSetScale').addEventListener("mousedown", ()=> {
	scale = 1;
	translation.x = 0;
	translation.y = 0;
	center.x = 0;
	center.y = 0;
	transform();
});