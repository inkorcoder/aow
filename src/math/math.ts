import { Vector } from './vector';

declare global {
	interface Math {
		clamp(value: number, min: number, max: number): number;
		getPointOnCircle(radius: number, angle: number): Vector;
		degreesToRadians(degrees: number): number;
		radiansToDegrees(radians: number): number;
		randomInt(min: number, max: number): number;
		randomFloat(min: number, max: number): number;
	}
}

Math.clamp = function(value: number, min: number, max: number): number {
	return value < 0 ? 0 : value > max ? max : value;
};

Math.getPointOnCircle = function(radius: number, angle: number): Vector {
	return new Vector(
		radius * Math.cos(angle),
		radius * Math.sin(angle)
	);
}

Math.degreesToRadians = function(degrees: number): number {
	return degrees * (Math.PI / 180);
}

Math.radiansToDegrees = function(radians: number): number {
	return radians * (180 / Math.PI);
}

Math.randomInt = function(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

Math.randomFloat = function(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}