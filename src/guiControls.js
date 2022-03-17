import * as THREE from 'three'
import { GUI } from 'dat.gui'

export function createGui(cube, camera) {
  const gui = new GUI();

  const cubeFolder = gui.addFolder('Cube')
  cubeFolder.add(cube.position, 'x',   -10, 10)
  cubeFolder.add(cube.position, 'y', -10, 10)
  cubeFolder.add(cube.position, 'z', -10, 10)

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

  cubeFolder.open()
  cameraFolder.open()
  gui.close()
}