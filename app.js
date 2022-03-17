import * as THREE from 'three'
import { uniforms } from './src/uniforms';
import { shaderMaterial } from './src/material';
import { Delaunay } from 'd3-delaunay'
import { createGui } from './src/guiControls';
import { setupScene } from './src/sceneSetup';
import { planeSize } from './src/config';
import { generatePoints } from './src/utils'

function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

const { camera, clock, scene, renderer } = setupScene(animation);
const axesHelper = new THREE.AxesHelper( 5 );
// The X axis is red. The Y axis is green. The Z axis is blue.
scene.add( axesHelper );

const geometry = new THREE.BoxGeometry(3,3,1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// const plane = new THREE.BoxGeometry(planeSize,planeSize,1);
// const planeMesh = addMesh(plane, shaderMaterial)
// planeMesh.rotation.x = Math.PI/2
// planeMesh.position.set(0,5,0)

// createGui(a, camera);

let points = generatePoints(4);

// uniforms.u_points = { value: new Float32Array(points.map(d => d[0]).concat(points.map(d => d[1]))) };
// console.log(points)
// console.log(uniforms.u_points.value)

let circles=[]
points.forEach(p => {
	let c = addMesh(new THREE.BoxGeometry(0.4,0.4,0.4),material)
	c.position.set(p[0],0,p[1]);
	circles.push(c);
});

const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([-planeSize/2, -planeSize/2, planeSize/2, planeSize/2])

let polygonObjects = []
for(let i=0;i<points.length;i++) {
	// polygonObjects.push(voronoi.cellPolygon(i))
	let group = [];
	(voronoi.cellPolygon(i)).forEach(vertex => {
		group.push(new THREE.Vector3(vertex[0], 0, vertex[1]));
	});
	let geom = new THREE.ShapeBufferGeometry(new THREE.Shape(group));
	console.log(group)
	polygonObjects.push(addMesh(geom, material));
}

console.log(polygonObjects)
// polygonObjects.forEach(polygon => {

// });




// for(i=0;i<p.length;i++) {
// 	c1=p[i][0]
// 	c2=p[i][1]
// 	poin=[]
// 	for (let vt of voronoi.cellPolygon(i)) {
// 		// vertex(vt[0], vt[1]);
// 		poin.push(middlePoint(c1,c2,vt[0],vt[1])[0], middlePoint(c1,c2,vt[0],vt[1])[1])
// 		circle(m(c1,c2,vt[0],vt[1])[0], m(c1,c2,vt[0],vt[1])[1], 50)
// 	}
// 	polygonPoints.push(poin)
// 	// endShape(CLOSE);
// 	circle(c1, c2, 1)
// }

// for(i=0;i<polygonPoints.length;i++) {
// 	for(j=0;j<polygonPoints[i].length;j+=2) {
// 		vertex(polygonPoints[i][j], polygonPoints[i][j+1])
// 	}
// }


document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
});


function animation( time ) {
	uniforms.u_time.value += clock.getDelta();
	renderer.render( scene, camera );
}
