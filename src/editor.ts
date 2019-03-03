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
import { Texturer } from './core/texturer';
import { noise } from './math/noise';
import { Input } from './core/input';
import { $ } from './core/dom';


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
		r = 20,
		d = 30,
		walkable = [],
		mapData,
		scale = .5,
		oldScale = .5,
		dimension = 256,
		center = new Vector(),
		centerPoint = new Vector(),
		translation = new Vector(),
		lastPosition = new Vector(),
		segment = new Vector(),
		type = MapModes.General,

		activeTab: string = "map",
		mapColor: string = "water",
		mapLayer: string = "texture";

// console.dir();
function insertTexturerView(page: number = 0, pagination: number = 9){
	let texturesHtml: string = "";
	let array = Texturer.samples.ground.slice(page*pagination, (page+1)*pagination);
	$('.texturer span').html("("+page*pagination+"-"+(page+1)*pagination+")");
	for (let i = 0; i < array.length; i++){
		// if (i < 54) continue;
		texturesHtml += `<li data-index="${page*pagination+i}"><img src="${array[i]}"></li>`;
	}
	$('.textures-list').html(texturesHtml);
};
insertTexturerView();

class TexturerView {
	private _page: number = 0;
	private _pagination: number = 0;
	get page(){ return this._page; }
	set page(newpage: number){
		this._page = newpage;
		insertTexturerView(this.page, this.pagination);
	}
	get pagination(){ return this._pagination; }
	set pagination(newpagination: number){
		this._pagination = newpagination;
		insertTexturerView(this.page, this.pagination);
	}
}

let texturer: TexturerView = new TexturerView();

texturer.page = 0;
texturer.pagination = 9*3;
// console.log(texturer);

let mapColors: string[] = ["water","ground","grass","greenery","foot","mountain"];

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
	let t1 = performance.now();
	mapData = noise(dimension, 1, 4, 1, 0);
	map = new Map(sizeX, sizeY, mapData, r, d);
	map.setMode(type);
	map.generateGrid(mapData);
	transform();
	texturedMapRenderer.setRects(sizeX*d, sizeY*r);
	// texturedMapRenderer.renderSingleFrame();
	noiseRenderer.setRects(sizeX*d, sizeY*r);
	// noiseRenderer.renderSingleFrame();
	render();
	let t2 = performance.now();
	console.log(`[ Map::creating ]
			perlin:         ${dimension} x ${dimension},
			size:           ${sizeX} x ${sizeY},
			type:           ${type}
			time:           ${(t2-t1).toFixed()} ms`.replace(/\t/gim, ''));
}

// let grid: Grid = new Grid(sizeX, sizeY, walkable, r, d);
let map: Map;
let noiseRenderer: Render = new Render('#noiseRender');
let texturedMapRenderer: Render = new Render('#texturedMapRender');

noiseRenderer.setRects(sizeX*d, sizeY*r);
texturedMapRenderer.setRects(sizeX*d, sizeY*r);

noiseRenderer.onRender(()=> {
	if (map){
		noiseRenderer.renderColoredMap(map);
	}
});
// noiseRenderer.renderSingleFrame();

let textrs: any = [
	[].createNumerical(18, 18),
	[].createNumerical(63, 27),
	[].createNumerical(108, 27),
	[].createNumerical(153, 27),
	[].createNumerical(180, 27)
];
texturedMapRenderer.onRender(()=> {
	if (map){
		texturedMapRenderer.renderTexturedMap(map, Texturer.data.ground, textrs);
	}
});


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
	$('#debugScale').html((scale * 100).toFixed()+"%");
	$('#debugPositionX').html((translation.x).toFixed());
	$('#debugPositionY').html((translation.y).toFixed());
}
transform();

function render(){
	$(noiseRenderer.canvas).removeClass('active');
	$(texturedMapRenderer.canvas).removeClass('active');
	switch (mapLayer){
		case "noise":
			$(noiseRenderer.canvas).addClass('active');
			noiseRenderer.renderSingleFrame();
			break;
		case "texture":
			$(texturedMapRenderer.canvas).addClass('active');
			texturedMapRenderer.renderSingleFrame();
			break;
		case "walk":
			break;
	}
}




Input.on('dragstart', (e: any, center: Vector)=> {
	// console.log(center);
});
Input.on('mousedown', (e: any, center: Vector)=> {
	if (activeTab === "map"){
		if (Input.key.ctrl && e.which === 1){
			noiseRenderer.renderColoredMapSegment(map, segment, mapColor);
		} else if (!Input.key.ctrl && e.which === 1 && e.target.matches && e.target.matches('canvas')) {
			let bbox = wrapper.getBoundingClientRect();
			$('#texturer').css("left", ((segment.x + 2) * d * scale / bbox.width * 100)+"%");
			$('#texturer').css("top", (segment.y * r * scale / bbox.height * 100)+"%");
		}
	}
});
Input.on('drag', (e: any, direction: Vector)=> {
	if (activeTab === "map"){
		if (Input.key.ctrl && e.which === 1) {
			noiseRenderer.renderColoredMapSegment(map, segment, mapColor);
			return;
		}
	}
	if (e.target.matches && e.target.matches('canvas') && e.which === 2){
		transform(direction);
	}
});
Input.on('dragend', (e: any)=> {
	if (e.target.matches && e.target.matches('canvas')){
		center = translation.clone();
	}
});
Input.on('mousemove', (e: MouseEvent)=> {
	let bbox = wrapper.getBoundingClientRect();
	let x = Math.clamp((Input.mouse.x - bbox.left) / bbox.width, 0, 1),
			y = Math.clamp((Input.mouse.y - bbox.top) / bbox.height, 0, 1);
	$('#debugMouseX').html((x * bbox.width).toFixed());
	$('#debugMouseY').html((y * bbox.height).toFixed());
	segment.x = Math.floor((x * bbox.width) / (d * scale));
	segment.y = Math.floor((y * bbox.height) / (r * scale));
	$('#debugSegmentX').html(segment.x.toString());
	$('#debugSegmentY').html(segment.y.toString());
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
	if (e.target.matches && e.target.matches('canvas')){
		let origin = Input.mouse.clone().subtract(new Vector(bbox.left, bbox.top));
		if (direction < 0){
			if (scale < 5) scale *= 2;
			transform(null, origin);
		} else {
			if (scale > 0.2) scale /= 2;
			transform(null, origin);
		}
	} else if (e.target.matches && e.target.matches('.texturer, .texturer *')){
		if (direction < 0){
			texturer.page--;
		} else {
			texturer.page++;
		}
		texturer.page = Math.clamp(texturer.page, 0, 8);
	}
});

Input.on('keydown', (e: KeyboardEvent)=> {
	if (activeTab === "map"){
		if (parseInt(e.key) < 7){
			mapColor = mapColors[parseInt(e.key)-1];
			$(`[data-map-color="${mapColor}"]`).addClass('active').siblings().removeClass('active');
		}
	}
	if (e.keyCode === 27){
		$('#texturer').css("left", "-1000px");
		$('#texturer').css("top", "-1000px");
	}
});


/*
	MAP
*/
$('[name="size"]').click(function(e: any){
	dimension = parseInt(this.value);
});

$('#mapSizeX').on("input", (e: any)=> {
	sizeX = parseInt(e.target.value);
});
$('#mapSizeY').on("input", (e: any)=> {
	sizeY = parseInt(e.target.value);
});
$('#mapType').on("change", (e: any)=> {
	console.log(e.target.value)
	type = e.target.value;
});
$('[data-map-color]').click(function(e: any){
	mapColor = mapColors[$(this).index()];
	$(`[data-map-color="${mapColor}"]`).addClass('active').siblings().removeClass('active');
});


$('#generateMap').click(()=> {
	createMap();
	$('#debugMapSegmentsX').html(sizeX.toString());
	$('#debugMapSegmentsY').html(sizeY.toString());
});


$('[data-set-tab]').map((node: any, index: number)=> {
	$(node).click((e: Event)=> {
		let attribute: any = $(node).attr('data-set-tab').split(',');
		let [ tabsContentSelector, tabSelector, tabType ] = attribute;
		let tabsContent = $(tabsContentSelector);
		$(node).siblings().removeClass('active');
		$(node).addClass('active');
		activeTab = tabType;
		$(".tab", tabsContent).each((tab: any)=> {
			if ($(tab).attr('id') === tabSelector.replace(/\#/gim, '')){
				$(tab).addClass('active');
			} else {
				$(tab).removeClass('active');
			}
		});
	});
});

$('#addTextures').on('click', (e: any)=> {

});

$('[name="layer"]').on('click', (e: any)=> {
	mapLayer = e.target.value;
	render();
});

/*
	Output
*/
$('[data-output]').each((node: any)=> {
	$(node).on('input', (e: any)=> {
		$($(node).attr('data-output')).html(e.target.value);
	});
});


/*
	DEBUG
*/
$('#debugSetScale').click(()=> {
	scale = 1;
	translation.x = 0;
	translation.y = 0;
	center.x = 0;
	center.y = 0;
	transform();
});