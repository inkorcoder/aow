/*
	$(selector, context)
*/
export function $(selector: any, context?: any) {

	let nodes: any = [];

	if (context){
		if (typeof selector === "string"){
			if ($(context)[0]){
				nodes = [].slice.call($(context)[0].querySelectorAll(selector));
			}
		} else {
			nodes = [].slice.call(context.querySelectorAll(selector));
		}
	} else {
		if (typeof selector === "string"){
			nodes = [].slice.call(document.querySelectorAll(selector));
		} else if (selector.push){
			nodes = selector;
		} else {
			nodes = [selector];
		}
	}

	function traverse(processor: Function){
		for (let i = 0; i < nodes.length; i++){
			processor(nodes[i], i);
		}
	}

	function traverseParent(node: any, processor: Function){
		let parent = node.parentNode;
		[].slice.call(parent.children).map((ch: any, i: number)=> processor(ch, i));
	}

	nodes.on = (event: string, handler: Function)=> {
		traverse((node: any)=> {
			node.addEventListener(event, (e: any)=> {
				handler.call(node, e);
			});
		});
	};

	nodes.add = (node: any)=> {
		nodes.push(node);
	};

	nodes.index = ()=> {
		let index: number;
		traverseParent(nodes[0], (ch: any, i: number)=> {
			if (ch === nodes[0]){
				index = i;
				return index;
			}
		});
		return index;
	};

	nodes.siblings = ()=> {
		let sibs: any = [];
		traverse((node: any)=> {
			traverseParent(node, (ch: any)=> {
				if (ch !== node){
					sibs.push(ch);
				}
			});
		});
		return $(sibs);
	};

	nodes.addClass = (className: string)=> {
		traverse((node: any)=> { node.classList.add(className) });
		return nodes;
	};

	nodes.removeClass = (className: string)=> {
		traverse((node: any)=> { node.classList.remove(className) });
		return nodes;
	};

	nodes.hasClass = (className: string)=> {
		return nodes[0].classList.contains(className);
	};

	nodes.attr = (key: string, value?: string)=> {
		if (!value) {
			return nodes[0].getAttribute(key);
		} else {
			traverse((node: any)=> {
				node.setAttribute(key, value);
			});
		}
		return nodes;
	};

	nodes.eq = (index: number)=> {
		return $(nodes[index]);
	};

	nodes.first = ()=> {
		return $(nodes[0]);
	};

	nodes.last = (index: number = 0)=> {
		return $(nodes[nodes.length-1-index]);
	};

	nodes.click = (handler: Function)=> {
		traverse((node: any)=> {
			node.addEventListener('click', function(e: any){
				handler.call(node, e);
			});
		});
	};

	nodes.html = (markup: string)=> {
		traverse((node: any)=> {
			node.innerHTML = markup;
		});
	};

	nodes.each = function(processor: Function){
		traverse(processor);
	};

	return nodes;
}

export interface DOMSelection {
	nodes: Element[] | HTMLElement[];
	length: number;
};


