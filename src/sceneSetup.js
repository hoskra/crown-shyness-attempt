import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function setupScene(animation) {
  let camera, clock, scene, renderer;

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set(0, -20, 0);
  camera.lookAt(new THREE.Vector3(0,1,0))

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animation );

  clock = new THREE.Clock();

  const controls = new OrbitControls(camera, renderer.domElement);
  const gridHelper = new THREE.GridHelper( 20, 20 );

  document.body.appendChild( renderer.domElement );
  scene.add( gridHelper );

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  });

  return { camera, clock, scene, renderer };
}