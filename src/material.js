import * as THREE from 'three'
import { uniforms } from './uniforms';
import { fshader, vshader } from './shader';

export const shaderMaterial = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
  side: THREE.DoubleSide
} );
