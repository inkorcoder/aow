// http://www.somethinghitme.com/projects/canvasterrain/js/canvasTerrain.js

export function noise(mapDimension: number, unitSize: number, roughness: number, seed: number, random: number) {
	var map = create2DArray(mapDimension+1, mapDimension+1);
		startDisplacement(map, mapDimension);
		return map;

		// Setup the map array for use
		function create2DArray(d1: number, d2: number) {
			var x = new Array(d1),
			i = 0,
			j = 0;

			for (i = 0; i < d1; i += 1) {
				x[i] = new Array(d2);
			}

			for (i=0; i < d1; i += 1) {
				for (j = 0; j < d2; j += 1) {
					x[i][j] = 0;
				}
			}

			return x;
		}

		// Starts off the map generation, seeds the first 4 corners
		function startDisplacement(map: number[][], mapDimension: number){
			var tr, tl, t, br, bl, b, r, l, center;

			// top left
			map[0][0] = seed;
			tl = map[0][0];

			// bottom left
			map[0][mapDimension] = seed;
			bl = map[0][mapDimension];

			// top right
			map[mapDimension][0] = seed;
			tr = map[mapDimension][0];

			// bottom right
			map[mapDimension][mapDimension] = seed;
			br = map[mapDimension][mapDimension];

			// Center
			map[mapDimension / 2][mapDimension / 2] = map[0][0] + map[0][mapDimension] + map[mapDimension][0] + map[mapDimension][mapDimension] / 4;
			map[mapDimension / 2][mapDimension / 2] = normalize(map[mapDimension / 2][mapDimension / 2]);
			center = map[mapDimension / 2][mapDimension / 2];

			/* Non wrapping terrain */
			/*map[mapDimension / 2][mapDimension] = bl + br + center / 3;
			map[mapDimension / 2][0] = tl + tr + center / 3;
			map[mapDimension][mapDimension / 2] = tr + br + center / 3;
			map[0][mapDimension / 2] = tl + bl + center / 3;*/

			/*Wrapping terrain */

			map[mapDimension / 2][mapDimension] = bl + br + center + center / 4;
			map[mapDimension / 2][0] = tl + tr + center + center / 4;
			map[mapDimension][mapDimension / 2] = tr + br + center + center / 4;
			map[0][mapDimension / 2] = tl + bl + center + center / 4;


			// Call displacment
			midpointDisplacment(mapDimension);
		}

		// Workhorse of the terrain generation.
		function midpointDisplacment(dimension: number){
			var newDimension = dimension / 2,
				top, topRight, topLeft, bottom, bottomLeft, bottomRight, right, left, center,
				i, j;

			if (newDimension > unitSize){
				for(i = newDimension; i <= mapDimension; i += newDimension){
					for(j = newDimension; j <= mapDimension; j += newDimension){
						let x = i - (newDimension / 2);
						let y = j - (newDimension / 2);

						topLeft = map[i - newDimension][j - newDimension];
						topRight = map[i][j - newDimension];
						bottomLeft = map[i - newDimension][j];
						bottomRight = map[i][j];

						// Center
						map[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + displace(dimension);
						map[x][y] = normalize(map[x][y]);
						center = map[x][y];

						// Top
						if(j - (newDimension * 2) + (newDimension / 2) > 0){
							map[x][j - newDimension] = (topLeft + topRight + center + map[x][j - dimension + (newDimension / 2)]) / 4 + displace(dimension);;
						}else{
							map[x][j - newDimension] = (topLeft + topRight + center) / 3+ displace(dimension);
						}

						map[x][j - newDimension] = normalize(map[x][j - newDimension]);

						// Bottom
						if(j + (newDimension / 2) < mapDimension){
							map[x][j] = (bottomLeft + bottomRight + center + map[x][j + (newDimension / 2)]) / 4+ displace(dimension);
						}else{
							map[x][j] = (bottomLeft + bottomRight + center) / 3+ displace(dimension);
						}

						map[x][j] = normalize(map[x][j]);


						//Right
						if(i + (newDimension / 2) < mapDimension){
							map[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4+ displace(dimension);
						}else{
							map[i][y] = (topRight + bottomRight + center) / 3+ displace(dimension);
						}

						map[i][y] = normalize(map[i][y]);

						// Left
						if(i - (newDimension * 2) + (newDimension / 2) > 0){
							map[i - newDimension][y] = (topLeft + bottomLeft + center + map[i - dimension + (newDimension / 2)][y]) / 4 + displace(dimension);;
						}else{
							map[i - newDimension][y] = (topLeft + bottomLeft + center) / 3+ displace(dimension);
						}

						map[i - newDimension][y] = normalize(map[i - newDimension][y]);
					}
				}
				midpointDisplacment(newDimension);
			}
		}

		// Random function to offset the center
		function displace(num: number){
			var max = num / (mapDimension + mapDimension) * roughness;
			return (Math.random()- 0.5) * max;
		}

		// Normalize the value to make sure its within bounds
		function normalize(value: number){
			if( value > 1){
				value = 1;
			}else if(value < 0){
				value = 0;
			}
			return parseFloat(value.toFixed(2));
		}
};