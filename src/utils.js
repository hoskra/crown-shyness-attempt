import * as THREE from 'three'
import { planeSizeCoeficient } from "./config";

export function randomBetween(min, max) { return Math.random() * (max - min) + min; }
export function generatePoints(side) {
  let points = [];
  let planeSize = planeSizeCoeficient*window.innerWidth/2;
  // let planeSize = 20;
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

export function middlePoint(x1,y1,x2,y2, distance = 0.8) {
  return [x1+(x2-x1)*distance, y1+(y2-y1)*distance]
}

export function addMesh(scene, geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

export function reducePoints(array, distances, y) {
  if(array.length == 2) {
    array.push({x: array[0].x*1.1, y: -y*0.35, z: 0.9*array[0].z});
    array.push({x: array[1].x*1.1, y: -y*0.35, z: 0.9*array[1].z});
  } else if(array.length == 3) {
    array.push({
      x: (array[distances[0].index].x + array[distances[1].index].x)/2,
      y: -y*0.35,
      z: (array[distances[0].index].z + array[distances[1].index].z)/2});
  } else if(array.length > 4) {
    distances.sort ((a,b) => {return b.distance - a.distance;});
    let temp = [
      array[distances[0].index],
      array[distances[1].index],
      array[distances[2].index],
      array[distances[3].index]
    ]
    array = temp;
  }
  return array;
}