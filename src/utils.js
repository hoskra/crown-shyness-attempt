import { planeSize } from "./config";
// import { noise } from "../libs/perlin";

// noise.seed(Math.random());

export function randomBetween(min, max) { return Math.random() * (max - min) + min; }
export function generatePoints(side) {
  let points = [];
  let half = planeSize/2;
  let cnt = side - 1;
  let step = planeSize/cnt;
  // generate points
  for(let i = 0; i <= cnt; i ++)
    for(let j = 0; j <= cnt; j ++) {
      // skipp middle
      if(i == cnt/2 && j == cnt/2) continue;
      points.push([i*step - half,j*step - half])
    }

  // randomize
  for(let point in points) {
    points[point][0] += randomBetween(-step/cnt, step/cnt);
    points[point][1] += randomBetween(-step/cnt, step/cnt);
  }

  return points;
}

export function distance2D(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

export function map(value, start1, stop1, start2, stop2) {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export function middlePoint(x1,y1,x2,y2) {
  return [x1+(x2-x1)*0.8, y1+(y2-y1)*0.8]
}
