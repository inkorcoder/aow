export class Heap {

	items: any[];
	currentItemCount: number = 0;

	constructor(maxHeapSize?: number){
		this.items = [];
	}

	add(item: any){
		item.HeapIndex = this.currentItemCount;
		this.items[this.currentItemCount] = item;
		this.sortUp(item);
		this.currentItemCount++;
	}

	removeFirst(){
		let firstItem: any = this.items[0];
		this.currentItemCount--;
		this.items[0] = this.items[this.currentItemCount];
		this.items[0].HeapIndex = 0;
		this.sortDown(this.items[0]);
		return firstItem;
	}

	public get count(): number {
		return this.currentItemCount;
	}

	updateItem(item: any){
		this.sortUp(item);
	}

	contains(item: any): boolean {
		return this.items[item.HeapIndex] === item;
	}

	sortDown(item: any){
		while (true){
			let childIndexLeft: number = item.HeapIndex * 2 + 1,
					childIndexRight: number = item.HeapIndex * 2 + 2,
					swapIndex = 0;
			if (childIndexLeft < this.currentItemCount){
				swapIndex = childIndexLeft;
				if (childIndexRight < this.currentItemCount){
					if (this.items[childIndexLeft].compareTo(this.items[childIndexRight]) < 0){
						swapIndex = childIndexRight;
					}
				}
				if (item.compareTo(this.items[swapIndex]) < 0){
					this.swap(item, this.items[swapIndex]);
				} else {
					return;
				}
			} else {
				return;
			}
		}
	}

	sortUp(item: any){
		let parentIndex: number = Math.round((item.HeapIndex-1)/2);
		while (true){
			let parentItem = this.items[parentIndex];
			// console.log(parentIndex);
			if (item.compareTo(parentItem) > 0){
				this.swap(item, parentItem);
			} else {
				break;
			}
			parentIndex = Math.round((item.HeapIndex-1)/2);
		}
	}

	swap(itemA: any, itemB: any){
		this.items[itemA.HeapIndex] = itemB;
		this.items[itemB.HeapIndex] = itemA;
		let itemAIndex: number = itemA.HeapIndex;
		itemA.HeapIndex = itemB.HeapIndex;
		itemB.HeapIndex = itemAIndex;
	}

}