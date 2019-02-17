class Vector {

	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0){
		this.x = x;
		this.y = y;
	}

	add(vector: Vector): Vector {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	subtract(vector: Vector): Vector {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	multiply(multiplier: number): Vector {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}

	divide(divider: number): Vector {
		return new Vector(this.x / divider, this.y / divider);
	}

	getLength(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	getAngle(): number {
		return Math.atan2(this.y, this.x);
	}

	scale(x: number = 1, y: number = 1): Vector {
		this.x *= x;
		this.y *= y;
		return this;
	}

	distanceTo(vector: Vector): number {
		return vector.subtract(this).getLength();
	}

	clone(): Vector {
		return new Vector(this.x, this.y);
	}

	abs(): Vector {
		if (this.x < 0) this.x *= -1;
		if (this.y < 0) this.y *= -1;
		return this;
	}

	fill(value: number): Vector {
		return new Vector(this.x || value, this.y || value);
	}

	floor(){
		return new Vector(Math.floor(this.x), Math.floor(this.y));
	}

	setLength(length: number): Vector {
		let angle = this.getAngle();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
		return this;
	}

	setAngle(angle: number): Vector {
		let length = this.getLength();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
		return this;
	}

	angleTo(vector: Vector): number {
		let temp = this.subtract(vector);
		return Math.atan2(temp.y, temp.x);
	}

	isEqualTo(vector: Vector): boolean {
		return this.x === vector.x && this.y === vector.y;
	}

	normalize(): Vector {
		let length = this.getLength();
		this.x = this.x / length;
		this.y = this.y / length;
		return this;
	}

}

export {
	Vector
};