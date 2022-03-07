import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
import { uniforms } from './src/uniforms';
import { shaderMaterial } from './src/material';

const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 20 );

// side
camera.position.set(10, 0, 0);
camera.lookAt(new THREE.Vector3(0,0,1))

// down
camera.position.set(0, 10, 0);
camera.lookAt(new THREE.Vector3(0,0,1))

// up
camera.position.set(0, -5, 0);
camera.lookAt(new THREE.Vector3(0,1,0))



// camera.lookAt(new THREE.Vector3(0,1,0)) // from up
// camera.lookAt(new THREE.Vector3(0,-1,0)) // from up

function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

let clock = new THREE.Clock();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(3,3,1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const controls = new OrbitControls(camera, renderer.domElement);

const gridHelper = new THREE.GridHelper( 20, 20 );
scene.add( gridHelper );

let a = addMesh(geometry, material)
a.position.set(0,3,0)



const plane = new THREE.BoxGeometry(40,40,1);
const planeMesh = addMesh(plane, shaderMaterial)
planeMesh.rotation.x = Math.PI/2
planeMesh.position.set(0,10,0)




const gui = new GUI();
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(a.position, 'x',   -10, 10)
cubeFolder.add(a.position, 'y', -10, 10)
cubeFolder.add(a.position, 'z', -10, 10)
cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', 0, 10)
cameraFolder.add(camera.position, 'y', 0, 10)
cameraFolder.add(camera.position, 'z', 0, 10)

cameraFolder.add({lookUp:function(){
	camera.lookAt(new THREE.Vector3(0,1,0));
	camera.position.set(0, -5, 0);
	camera.updateProjectionMatrix()
}}, 'lookUp')
cameraFolder.add({lookDown:function(){
	camera.lookAt(new THREE.Vector3(0,-1,0));
	camera.position.set(0, 5, 0);
	camera.updateProjectionMatrix()
}}, 'lookDown')
cameraFolder.add({lookSide:function(){
	camera.lookAt(new THREE.Vector3(0,0,1));
	camera.position.set(10, 0, 0);
	camera.updateProjectionMatrix()
}}, 'lookSide')


// cameraFolder.add(lookSide, 'lookSide')

cameraFolder.open()

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
});


function animation( time ) {

	uniforms.u_time.value += clock.getDelta();
	renderer.render( scene, camera );
}
