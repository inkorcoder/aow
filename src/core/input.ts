import { Vector } from './../math/vector';

interface InputInterface {
	key: {
		a: boolean;
		b: boolean;
		c: boolean;
		d: boolean;
		e: boolean;
		f: boolean;
		g: boolean;
		h: boolean;
		i: boolean;
		j: boolean;
		k: boolean;
		l: boolean;
		m: boolean;
		n: boolean;
		o: boolean;
		p: boolean;
		q: boolean;
		r: boolean;
		s: boolean;
		t: boolean;
		u: boolean;
		v: boolean;
		w: boolean;
		x: boolean;
		y: boolean;
		z: boolean;
		alt: boolean;
		shift: boolean;
		esc: boolean;
		tab: boolean;
		ctrl: boolean;
		up: boolean;
		right: boolean;
		down: boolean;
		left: boolean;
		space: boolean;
		backspace: boolean;
		enter: boolean;
		"0": boolean;
		"1": boolean;
		"2": boolean;
		"3": boolean;
		"4": boolean;
		"5": boolean;
		"6": boolean;
		"7": boolean;
		"8": boolean;
		"9": boolean;
		plus: boolean;
		minus: boolean;
		times: boolean;
		divide: boolean;
		delete: boolean;
	};
	subscribers: {
		mousedown: Function[];
		dragstart: Function[];
		drag: Function[];
		dragend: Function[];
		keydown: Function[];
		mousemove: Function[];
		mousewheel: Function[];
	};
	on: Function;
	mouse: Vector;
}


export let Input = <InputInterface>{
	key: {
		"a": false,
		"b": false,
		"c": false,
		"d": false,
		"e": false,
		"f": false,
		"g": false,
		"h": false,
		"i": false,
		"j": false,
		"k": false,
		"l": false,
		"m": false,
		"n": false,
		"o": false,
		"p": false,
		"q": false,
		"r": false,
		"s": false,
		"t": false,
		"u": false,
		"v": false,
		"w": false,
		"x": false,
		"y": false,
		"z": false,
		"alt": false,
		"shift": false,
		"esc": false,
		"tab": false,
		"ctrl": false,
		"up": false,
		"right": false,
		"down": false,
		"left": false,
		"space": false,
		"backspace": false,
		"enter": false,
		"0": false,
		"1": false,
		"2": false,
		"3": false,
		"4": false,
		"5": false,
		"6": false,
		"7": false,
		"8": false,
		"9": false,
		"plus": false,
		"minus": false,
		"times": false,
		"divide": false,
		"delete": false
	},
	subscribers: {
		mousedown: [],
		dragstart: [],
		drag: [],
		dragend: [],
		keydown: [],
		mousemove: [],
		mousewheel: []
	},
	on: (event: string, handler: Function)=> {
		let subscribers: any = Input.subscribers;
		subscribers[event].push(handler);
	},
	mouse: new Vector()
};

let keyCodes: any = {
	"65": "a", "66": "b", "67": "c", "68": "d", "69": "e",
	"70": "f", "71": "g", "72": "h", "73": "i", "74": "j",
	"75": "k", "76": "l", "77": "m", "78": "n", "79": "o",
	"80": "p", "81": "q", "82": "r", "83": "s", "84": "t",
	"85": "u", "86": "v", "87": "w", "88": "x", "89": "y",
	"90": "z",
	"18": "alt", "16": "shift", "27": "esc", "9": "tab",
	"17": "ctrl", "38": "up", "39": "right", "40": "down",
	"37": "left", "32": "space", "8": "backspace", "13": "enter",
	"48": "0", "49": "1", "50": "2", "51": "3", "52": "4",
	"53": "5", "54": "6", "55": "7", "56": "8", "57": "9",
	"107": "plus", "187": "plus",
	"109": "minus", "189": "minus",
	"106": "times", "111": "divide", "46": "delete"
};

/* variables */
let isDradding: boolean = false,
		lastIsDradding: boolean = false,
		dragstartPosition: Vector;


document.addEventListener('keydown', (e: KeyboardEvent)=> {
	let key: string = keyCodes[e.keyCode.toString().toLowerCase()];
	let keys: any = Input.key;
	keys[key] = true;

	for (let i = 0; i < Input.subscribers.keydown.length; i++){
		if (Input.subscribers.keydown[i]){
			Input.subscribers.keydown[i](e);
		}
	}
});


document.addEventListener('keyup', (e: KeyboardEvent)=> {
	let key: string = keyCodes[e.keyCode.toString().toLowerCase()];
	let keys: any = Input.key;
	keys[key] = false;
});


document.addEventListener("mousedown", (e: MouseEvent)=> {
	isDradding = true;

	dragstartPosition = new Vector(e.clientX, e.clientY);
	for (let i = 0; i < Input.subscribers.mousedown.length; i++){
		if (Input.subscribers.mousedown[i]){
			Input.subscribers.mousedown[i](e, dragstartPosition);
		}
	}
	for (let i = 0; i < Input.subscribers.dragstart.length; i++){
		if (Input.subscribers.dragstart[i]){
			Input.subscribers.dragstart[i](e, dragstartPosition);
		}
	}
});


document.addEventListener("mousemove", (e: MouseEvent)=> {
	Input.mouse.x = e.clientX;
	Input.mouse.y = e.clientY;

	for (let i = 0; i < Input.subscribers.mousemove.length; i++){
		if (Input.subscribers.mousemove[i]){
			Input.subscribers.mousemove[i](e);
		}
	}
	if (isDradding){
		for (let i = 0; i < Input.subscribers.drag.length; i++){
			if (Input.subscribers.drag[i]){
				Input.subscribers.drag[i](e, Input.mouse.clone().subtract(dragstartPosition));
			}
		}
	}
});


document.addEventListener("mouseup", (e: Event)=> {

	if (isDradding){
		isDradding = false;
		for (let i = 0; i < Input.subscribers.dragend.length; i++){
			if (Input.subscribers.dragend[i]){
				Input.subscribers.dragend[i](e);
			}
		}
	}
});


document.addEventListener("mouseleave", (e: Event)=> {

	if (isDradding){
		isDradding = false;
		for (let i = 0; i < Input.subscribers.dragend.length; i++){
			if (Input.subscribers.dragend[i]){
				Input.subscribers.dragend[i](e);
			}
		}
	}
});


document.addEventListener("mousewheel", (e: MouseWheelEvent)=> {

	for (let i = 0; i < Input.subscribers.mousewheel.length; i++){
		if (Input.subscribers.mousewheel[i]){
			Input.subscribers.mousewheel[i](e, e.deltaY < 0 ? -1 : 1, e.deltaY);
		}
	}
});