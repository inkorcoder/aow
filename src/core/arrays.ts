interface Array<T> {
	remove(item: any): void;
	contains(item: any): boolean;
	min(): number;
	max(): number;
	createNumerical(shift: number, length: number): number[];
}

Array.prototype.remove = function(item: any): void {
	for (let i = 0; i < this.length; i++){
		if (this[i] === item){
			this.splice(i, 1);
			return;
		}
	}
}

Array.prototype.contains = function(item: any): boolean {
	for (let i = 0; i < this.length; i++){
		if (this[i] === item){
			return true;
		}
	}
	return false;
}

Array.prototype.max = function() {
	return Math.max.apply(null, this);
};

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

Array.prototype.createNumerical = function(shift: number, length: number){
	let array: number[] = [];
	for (let i = 0; i < length; i++){
		array.push(shift+i);
	}
	return array;
}