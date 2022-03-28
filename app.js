import * as THREE from 'three'
import SimplexNoise from 'simplex-noise';
import { uniforms } from './src/uniforms';
import { shaderMaterial } from './src/material';
import { setupScene } from './src/sceneSetup';
import { noise, simple_lambert_vertex } from './libs/MyShaderChunks';
import { Forest } from './src/forest';

THREE.ShaderChunk.simple_lambert_vertex  = simple_lambert_vertex;
THREE.ShaderChunk.noise = noise;

const { camera, clock, scene, renderer } = setupScene(animation);
const simplex = new SimplexNoise();

const forest = new Forest(3,simplex);
forest.generateTrees(shaderMaterial, scene);

function animation( time ) {
	forest.windBlow( time );

	uniforms.u_time.value += clock.getDelta();
	renderer.render( scene, camera );
}
