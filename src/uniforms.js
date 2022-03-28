import * as THREE from 'three'
import { generatePoints } from './utils';
import { planeSizeCoeficient } from './config';

let points = generatePoints();

export const uniforms = {
  u_color_a: { value: new THREE.Color(0xff0000) },
  u_color_b: { value: new THREE.Color(0x00ffff) },
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{
    x: window.innerWidth*planeSizeCoeficient,
    y: window.innerHeight*planeSizeCoeficient }},
  u_points: {
    type: 'v2v',
    value: points },
}
