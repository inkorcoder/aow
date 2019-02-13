interface Math {
	clamp(value: number, min: number, max: number): number;
}

Math.clamp = function(value: number, min: number, max: number): number {
	return value < 0 ? 0 : value > max ? max : value;
};