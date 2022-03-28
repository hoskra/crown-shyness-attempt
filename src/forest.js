import * as THREE from 'three'
import { Delaunay } from 'd3-delaunay'
import { generatePoints, addMesh, getRandomColor, middlePoint, reducePoints } from './utils'
import { planeSizeCoeficient, extrudingOptions } from './config';

class Leaf {
  constructor(mesh) {
    this.mesh = mesh;
  }
  setCoordinates(x,y,z) {
    this.mesh.position.set(x,y,z);
  }
  updateCoordinates(deltaX, deltaY, deltaZ) {
    this.mesh.position.x += deltaX;
    this.mesh.position.y += deltaY;
    this.mesh.position.z += deltaZ;
  }
}


class Tree {
  constructor() {
    this.crown = undefined;
    this.trunk = undefined;
    this.branches = undefined;
    this.leavesMesh = [];

    this.leaf0 = undefined;
    this.leaf1 = undefined;
    this.leaf2 = undefined;
    this.leaf3 = undefined;

    this.treeY = -12;
  }
  disposeGeometries() {
    this.crown.geometry.dispose();
  }
  updateCrownGeometry(p, polygon, update = false) {
    let triangleShape = new THREE.Shape();
    let c1 = p[0];
    let c2 = p[1];
    let x = polygon[0][0];
    let y = polygon[0][1];
    let middle = middlePoint(c1,c2,x,y);
    x = middle[0];
    y = middle[1];
    triangleShape.moveTo(x, y);

    let distances = [];
    let leaves = [];

    polygon.forEach((vertex, index) => {
      if(index) {
        let a = middlePoint(c1,c2,vertex[0],vertex[1]);
        let b = middlePoint(c1,c2,vertex[0],vertex[1], 0.25);
        triangleShape.lineTo(a[0], a[1])
        leaves.push({x: b[0], y: -this.treeY*0.35, z: b[1]});
        distances.push({index:index-1, distance:Math.sqrt(Math.pow(b[0],2) + Math.pow(b[1],2))});
      }
    });

    leaves = reducePoints(leaves, distances, this.treeY);
    if(update) this.updateBranches(leaves)


    let extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudingOptions);
    return extrudedGeometry;
  }

  updateTrunkGeometry(x,y,z) {
    this.trunk.position.set(x,y,z)
  }

  updateBranches(leaves) {
    this.leaf0.setCoordinates(leaves[0].x, leaves[0].y, leaves[0].z);
    this.leaf1.setCoordinates(leaves[1].x, leaves[1].y, leaves[1].z);
    this.leaf2.setCoordinates(leaves[2].x, leaves[2].y, leaves[2].z);
    this.leaf3.setCoordinates(leaves[3].x, leaves[3].y, leaves[3].z);
  }

  updateLeaves(deltaX, deltaZ) {
    this.leaf0.updateCoordinates(deltaX, 0, deltaZ);
    this.leaf1.updateCoordinates(deltaX, 0, deltaZ);
    this.leaf2.updateCoordinates(deltaX, 0, deltaZ);
    this.leaf3.updateCoordinates(deltaX, 0, deltaZ);
  }

  createBranches(scene) {
    this.leaf0 = new Leaf(addMesh(scene, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true })));
    this.leaf1 = new Leaf(addMesh(scene, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true })));
    this.leaf2 = new Leaf(addMesh(scene, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true })));
    this.leaf3 = new Leaf(addMesh(scene, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true })));
  }
}

export class Forest {
  constructor(cnt,noise) {
    this._trees = [];
    this.treeLength = 35;
    this.treeY = -12;
    this.points = generatePoints(cnt);
    this.delaunay = Delaunay.from(this.points);
    this.height = window.innerWidth  * planeSizeCoeficient;
    this.width  = window.innerHeight * planeSizeCoeficient;
    this.voronoi = this.delaunay.voronoi([-this.height , -this.width, this.height , this.width])
    this.trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true });
    this.trunkGeometry = new THREE.CylinderGeometry( 0.1, 1.2, this.treeLength, 6 );
    this.branchGeometry = new THREE.BoxGeometry( 1, 1, 1 )
    this.simplex = noise;
  }

  get trees() { return this._trees; }

  windBlow(time) {
    // new points positions and dispose geometry
    this.points.forEach((p,i) => {
      let deltaX = Math.sin(time/1000)*0.02 + this.simplex.noise2D(p[0], p[1])*0.02;
      p[0] += deltaX;
      let deltaZ = Math.cos(time/1000)*0.02 + this.simplex.noise2D(p[0], p[1])*0.02;
      p[1] += deltaZ;
      this._trees[i].disposeGeometries();
      this._trees[i].updateLeaves(deltaX, deltaZ);
    });

    // recompute voronoi
    this.delaunay = Delaunay.from(this.points);
    this.voronoi = this.delaunay.voronoi([-this.height , -this.width, this.height , this.width])

    // update geometry
    this.points.forEach((p,i) => {
      this._trees[i].crown.geometry = this._trees[i].updateCrownGeometry(p, this.voronoi.cellPolygon(i));
      this._trees[i].updateTrunkGeometry(p[0], this.treeY, p[1]);
    })
  }

  generateTrees(shaderMaterial, scene) {
    for(let i=0; i < this.points.length; i++) {

      let tree = new Tree();
      this._trees.push(tree);
      this._trees[i].createBranches(scene)

      let geo = tree.updateCrownGeometry(this.points[i], this.voronoi.cellPolygon(i), true)

      let polyMaterial;
      if(i%2) { polyMaterial = new THREE.MeshLambertMaterial( { color: getRandomColor() } );
      } else { polyMaterial = shaderMaterial;}

      tree.crown = addMesh(scene, geo, polyMaterial);
      tree.crown.rotation.x = Math.PI/2;

      if(i%2) { tree.crown.position.set(0,6,0)
      } else { tree.crown.position.set(0,5,0) }

      tree.trunk = addMesh(scene, this.trunkGeometry, this.trunkMaterial);
      tree.trunk.position.set(this.points[i][0], this.treeY, this.points[i][1]);
    }
  }
};
