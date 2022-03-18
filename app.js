import * as THREE from 'three'
import SimplexNoise from 'simplex-noise';
import { uniforms } from './src/uniforms';
import { shaderMaterial } from './src/material';
import { Delaunay } from 'd3-delaunay'
import { createGui } from './src/guiControls';
import { setupScene } from './src/sceneSetup';
import { planeSize } from './src/config';
import { generatePoints, getRandomColor, middlePoint, map, distance2D } from './src/utils'
import { noise, simple_lambert_vertex } from './libs/MyShaderChunks';

THREE.ShaderChunk.simple_lambert_vertex  = simple_lambert_vertex;
THREE.ShaderChunk.noise = noise;

function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

const { camera, clock, scene, renderer } = setupScene(animation);

const simplex = new SimplexNoise();

let points = generatePoints(3);
const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([-planeSize, -planeSize, planeSize, planeSize])

let polygonObjects = []
for(let i=0; i<points.length; i++) {
	let triangleShape = new THREE.Shape();
	triangleShape.moveTo(voronoi.cellPolygon(i)[0][0], voronoi.cellPolygon(i)[0][1]);

	(voronoi.cellPolygon(i)).forEach((vertex, i) => {
		if(i) triangleShape.lineTo(vertex[0], vertex[1]);
	});

	let extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {steps:0, depth: 1, bevelEnabled: false});
  let polyMaterial;
	if(i%2) polyMaterial = new THREE.MeshLambertMaterial( { color: getRandomColor() } );
	else polyMaterial = shaderMaterial;

	polygonObjects.push(addMesh(extrudedGeometry, polyMaterial));
	polygonObjects[i].rotation.x = Math.PI/2;
	if(i%2) polygonObjects[i].position.set(0,6,0)
	else polygonObjects[i].position.set(0,5,0)
}

let treeLength = 35;
let treeY = -10;


let circlesGeo = new THREE.CylinderGeometry( 0.1, 1.2, treeLength, 6 );
const lambertMat = new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true });
let circles=[]
points.forEach((p,i) => {
	circles.push(addMesh(circlesGeo,lambertMat));
	circles[i].position.set(p[0],treeY,p[1])
});

function animation( time ) {
	points.forEach((p,i) => {
		points[i][0] += Math.sin(time/1000)*0.02 + simplex.noise2D(p[0], p[1])*0.02;
		points[i][1] += Math.cos(time/1000)*0.02 + simplex.noise2D(p[0], p[1])*0.02;

		polygonObjects[i].geometry.dispose();
	});

	const delaunay = Delaunay.from(points);
	const voronoi = delaunay.voronoi([-window.innerWidth/2, -window.innerHeight/2, +window.innerWidth/2, +window.innerHeight/2])

	points.forEach((p,i) => {
		let triangleShape = new THREE.Shape();
		let c1 = p[0]
    let c2 = p[1]
		let x = voronoi.cellPolygon(i)[0][0];
		let y = voronoi.cellPolygon(i)[0][1];
		let middle = middlePoint(c1,c2,x,y);
		x = middle[0];
		y = middle[1];
		triangleShape.moveTo(x, y);
		(voronoi.cellPolygon(i)).forEach((vertex, i) => {
			if(i)
			triangleShape.lineTo(middlePoint(c1,c2,vertex[0],vertex[1])[0], middlePoint(c1,c2,vertex[0],vertex[1])[1])
			// triangleShape.lineTo(vertex[0], vertex[1]);
		});

		let extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {
			steps: 1,
			depth: 1,
			bevelThickness: 3,
			bevelSize: 1,
			bevelOffset: -1,
			bevelEnabled: true
		});
		polygonObjects[i].geometry = extrudedGeometry;

		circles[i].position.set(p[0],treeY,p[1])

	});


	uniforms.u_time.value += clock.getDelta();

	// setTimeout( function() {

	// 		requestAnimationFrame( animation );

	// }, 1000 / 30 );

	renderer.render( scene, camera );
}
