import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export function setupScene(animation, debug = false) {
  let camera, clock, scene, renderer;

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set(0, -10, 0);
  camera.lookAt(new THREE.Vector3(0,1,0))

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animation );

  clock = new THREE.Clock();
  // add stats
  const stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  const controls = new OrbitControls(camera, renderer.domElement);

  // add light
  const light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 0, 6, 0 );
  scene.add( light );

  const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
  ambientLight.intensity = 1.3;
  scene.add( ambientLight );

  const sky = new Sky();
  sky.scale.setScalar( 450000 );
  scene.add( sky );
  const sun = new THREE.Vector3();

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 9,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
  };

  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html
  const uniforms = sky.material.uniforms;
  uniforms[ 'turbidity' ].value = effectController.turbidity;
  uniforms[ 'rayleigh' ].value = effectController.rayleigh;
  uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
  uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
  const theta = THREE.MathUtils.degToRad( effectController.azimuth );

  sun.setFromSphericalCoords( 1, phi, theta );

  uniforms[ 'sunPosition' ].value.copy( sun );

  renderer.toneMappingExposure = effectController.exposure;

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