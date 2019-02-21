import "./styles.scss";
import './math/math';
import './core/arrays';

import { Vector } from "./math/vector";
import { Grid } from './core/grid';
import { Node } from './core/grid-node';
import { Object2D } from './core/object';
import { Render } from "./render/render";
import { Map } from "./render/map";
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
		center = new Vector(),
		centerPoint = new Vector(),
		translation = new Vector();
let view: HTMLElement = document.querySelector('.view');
let wrapper: HTMLElement = document.querySelector('.view .wrapper');
// for (let y = 0; y < sizeY; y++){
// 	walkable[y] = [];
// 	for (let x = 0; x < sizeX; x++){
// 		walkable[y].push(Math.random() < .05 ? 0 : 1);
// 	}
// }
// wrapper.style.width = sizeX*d+"px";
// wrapper.style.height = sizeY*r+"px";

function updateMap(size: number){
	mapData = noise(size, 1, 4, 1, 0);
	map = new Map(sizeX, sizeY, mapData, r, d);
}
updateMap(256);

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

	// console.log(direction)
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
	// if (!origin){
	// 	origin = new Vector();
	// }
	// centerPoint = position.clone();
	// position = position;
	let position = viewCenter.add(translation).subtract(halfSize);
	let posBefore = viewCenter.add(translation).subtract(halfSizeOld);
	if (origin){
		let precent = new Vector(origin.x / oldSize.x, origin.y / oldSize.y);
		let diff = size.subtract(oldSize);
		console.log(diff)

		position = posBefore.subtract(new Vector(diff.x*precent.x, diff.y*precent.y));

		translation = position.clone().add(halfSize).clone().subtract(viewCenter).clone();
		center = translation.clone();
		// position.x = scale * (position.x - origin.x) + origin.x;
		// position.y = scale * (position.y - origin.y) + origin.y;
		// translation = translation.add(centerPoint);
		// console.log(position.add(halfSize).subtract(viewCenter))
	}
	// console.log(translation).
	// let tr: any = document.querySelector('#translation');
	// tr.style.top = translation.y+"px";
	// tr.style.left = translation.x+"px";
		// .add(halfSize.clone().scaleBy(origin));.
	// position.y += size.y * origin.y;
	wrapper.style.width = size.x+"px";
	wrapper.style.height = size.y+"px";
	wrapper.style.left = position.x+"px";
	wrapper.style.top = position.y+"px";

	oldScale = scale;

	// console.log(translation)
/*	if (origin){
		console.log(origin)
		console.log(translation.clone().scale(origin.x, origin.y))
		// console.log(translation.clone().scale(origin.x, origin.y))
		// wrapper.style.transformOrigin = (origin.x*100)+"% "+(origin.y*100)+"%";
		translation = translation.clone().subtract(translation.clone().scale(origin.x, origin.y));
	} else {
		// wrapper.style.transformOrigin = "";
	}*/
	// console.log(wrapper.style.transformOrigin)
	// wrapper.style.transform = `
	// 	translate(${translation.x}px,${translation.y}px) scale(${scale})
	// `;
	// scale(${scale})
	noiseRenderer.start();
	noiseRenderer.stop();
}
transform();

Input.on('dragstart', (e: any, center: Vector)=> {
	// console.log(center);
});
Input.on('drag', (e: any, direction: Vector)=> {
	// console.log(direction);
	// if (e.target.matches('canvas')){
		transform(direction);
	// }
});
Input.on('dragend', (e: any)=> {
	// if (e.target.matches('canvas')){
		center = translation.clone();
	// }
});
Input.on('mousemove', (e: MouseEvent)=> {
	// console.log(Input.mouse.clone());
});
Input.on('mousewheel', (e: any, direction: number, delta: number)=> {
	// console.dir(e.path.map((node: any)=>{
	// 	return node.outerHTML;
	// }).join())
	let bbox = wrapper.getBoundingClientRect();
	let origin = new Vector(
		-0.5 + (Input.mouse.x - bbox.left) / bbox.width,
		-0.5 + (Input.mouse.y - bbox.top) / bbox.height
	);
	if (e.target.matches('canvas')){
		let origin = Input.mouse.clone().subtract(new Vector(bbox.left, bbox.top));
		if (direction < 0){
			if (scale < 5) scale *= 1.2;
			transform(null, origin);
			// transform(new Vector());
			// center = translation.clone();
		} else {
			if (scale > 0.1) scale /= 1.2;
			transform(null, origin);
			// transform(new Vector());
			// center = translation.clone();
		}
	}
});
// wrapper.addEventListener('mousewheel', (e: any)=> {
// 	// console.log(Input)
// });





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
[].slice.call(document.querySelectorAll('input')).forEach((node: any)=> {
	node.addEventListener('click', (e: any)=> {
		let size = 256;
		if (e.target.name === 'size'){
			size = parseInt(e.target.value);
		}
		console.log(size);
		updateMap(size);
	});
});

/*
	Output
*/
[].slice.call(document.querySelectorAll('[data-output]')).forEach((node: any)=> {
	node.addEventListener('input', (e: any)=> {
		document.querySelector(node.getAttribute('data-output')).innerHTML = e.target.value;
	});
});