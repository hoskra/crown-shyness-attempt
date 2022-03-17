import { planeSize } from "./config";

export function randomBetween(min, max) { return Math.random() * (max - min) + min; }
export function generatePoints(side) {
  let points = [];
  let half = planeSize/2;
  let cnt = side - 1;
  let step = planeSize/cnt;
  // generate points
  for(let i = 0; i <= cnt; i ++)
    for(let j = 0; j <= cnt; j ++)
    points.push([i*step - half,j*step - half])

  // randomize
  for(let point in points) {
    points[point][0] += randomBetween(-step/cnt, step/cnt);
    points[point][1] += randomBetween(-step/cnt, step/cnt);
  }

  return points;
}
