interface Array<T> {
	remove(item: any): void;
	contains(item: any): boolean;
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