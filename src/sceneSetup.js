import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function setupScene(animation, debug = false) {
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

  // add light
  const light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 0, 6, 0 );
  scene.add( light );

  const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
  ambientLight.intensity = 1.3;
  scene.add( ambientLight );


  if(debug) {
    // The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper = new THREE.AxesHelper( 5 );
    const gridHelper = new THREE.GridHelper( 20, 20 );

    scene.add( axesHelper );
    scene.add( gridHelper );
  }

  document.body.appendChild( renderer.domElement );
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  });

  return { camera, clock, scene, renderer };
}