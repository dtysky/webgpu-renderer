/**
 * RayTracingApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:56:30 PM
*/
import * as H from '../src/index';

const MODEL_SRC = '/assets/models/walls/scene.gltf';

export default class RayTracingApp {
  private _scene: H.Scene;
  private _camControl: H.NodeControl;
  private _model: H.IGlTFResource;
  private _lights: H.Light[];
  private _camera: H.Camera;
  private _gBufferRT: H.RenderTexture;
  private _gBufferDebugMesh: H.ImageMesh;
  protected _rtManager: H.RayTracingManager;
  protected _rtOutput: H.RenderTexture;
  protected _rtBlit: H.ImageMesh;

  public async init() {
    const {renderEnv} = H;

    const _scene = this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();
    this._camControl = new H.NodeControl('free');

    rootNode.addChild(this._camera = new H.Camera(
      {clearColor: [0, 1, 0, 1]},
      {near: 0.01, far: 100, fov: Math.PI / 3}
    ));
    this._camera.pos.set([0, 0, 6]);

    this._gBufferRT = new H.RenderTexture({
      width: renderEnv.width,
      height: renderEnv.height,
      colors: [
        {name: 'positionMetal', format: 'rgba16float'},
        {name: 'diffuseRough', format: 'rgba16float'},
        {name: 'normalMeshIndex', format: 'rgba16float'},
        {name: 'faceNormalMatIndex', format: 'rgba16float'}
      ],
      depthStencil: {needStencil: false}
    });

    this._gBufferDebugMesh = new H.ImageMesh(new H.Material(H.buildinEffects.iRTGShow));
    this._connectGBufferRenderTexture(this._gBufferDebugMesh.material);

    this._rtOutput = new H.RenderTexture({
      width: renderEnv.width,
      height: renderEnv.height,
      forCompute: true,
      colors: [{name: 'color', format: 'rgba8unorm'}]
    });
    this._rtBlit = new H.ImageMesh(new H.Material(H.buildinEffects.iBlit, {u_texture: this._rtOutput}));
    
    const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    if (model.cameras.length) {
      this._camera = model.cameras[0];
    }
    this._lights = model.lights;
    _scene.rootNode.addChild(model.rootNode);
    
    this._camControl.control(this._camera, new H.Node());
    console.log(model)

    this._frame();
  }

  public update(dt: number) {
    this._frame();
  }

  private _frame() {
    const {_scene} = this;

    _scene.startFrame();
    
    if (!this._rtManager) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera), this._rtOutput);
      this._connectGBufferRenderTexture(this._rtManager.rtUnit);
      debugCS(this._camera, this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array);
    }

    // this._showBVH();
    this._renderGBuffer();
    // this._showGBufferResult();
    this._computeRTSS();
    _scene.endFrame();
  }

  private _renderGBuffer() {
    this._scene.setRenderTarget(this._gBufferRT);
    this._scene.renderCamera(this._camera, [this._rtManager.gBufferMesh]);
  }

  protected _computeRTSS() {
    this._scene.setRenderTarget(null);
    this._scene.computeUnits([this._rtManager.rtUnit]);
    this._scene.renderImages([this._rtBlit]);
  }

  private _showGBufferResult() {
    this._scene.setRenderTarget(null);
    this._scene.renderImages([this._gBufferDebugMesh]);
  }

  private _showBVH() {
    this._scene.setRenderTarget(null);
    this._scene.renderCamera(this._camera, [
      ...this._scene.cullCamera(this._camera),
      this._rtManager.bvhDebugMesh
    ]);
  }

  private _connectGBufferRenderTexture(material: H.Material | H.ComputeUnit) {
    material.setUniform('u_gbPositionMetal', this._gBufferRT, 'positionMetal');
    material.setUniform('u_gbDiffuseRough', this._gBufferRT, 'diffuseRough');
    material.setUniform('u_gbNormalMeshIndex', this._gBufferRT, 'normalMeshIndex');
    material.setUniform('u_gbFaceNormalMatIndex', this._gBufferRT, 'faceNormalMatIndex');
  }
}

function debugCS(camera: H.Camera, bvh: H.BVH, positions: Float32Array) {
  for (let i = 0; i < 1; i += 1) {
    // const uv = new Float32Array([Math.random() / 2, Math.random() / 2]);
    const uv = new Float32Array([0, 0]);
    const ssPos = new Float32Array([uv[0] * 2 - 1, 1 - uv[1] * 2, 0, 1]);
    const worldPos = H.math.vec4.transformMat4(new Float32Array(4), ssPos, camera.invProjMat);
    H.math.vec4.transformMat4(worldPos, worldPos, camera.invViewMat);
    console.log(worldPos)
    H.math.vec4.scale(worldPos, worldPos, 1 / worldPos[3]);
    const dir = H.math.vec3.sub(new Float32Array(3), worldPos.slice(0, 3) as Float32Array, camera.pos) as Float32Array;
    H.math.vec3.normalize(dir, dir);

    console.log('uv, ssPos, worldPos', uv, ssPos, worldPos);
  
    const ray: Ray = {
      origin: camera.pos,
      dir,
      invDir: new Float32Array(3)
    };
    H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);
  
    const hitedNode = hitTest(bvh, ray);
    console.log(hitedNode);
  
    if (!hitedNode) {
      continue;
    }
  
    if (hitedNode.isChild0Leaf) {
      console.log(leafHitTest(bvh, ray, positions, hitedNode.child0Offset));
      continue;
    }
  
    if (hitedNode.isChild1Leaf) {
      console.log(leafHitTest(bvh, ray, positions, hitedNode.child1Offset));
    }
  }
}

interface Ray {
  origin: Float32Array;
  dir: Float32Array;
  invDir: Float32Array;
};


interface BVHNode {
  isChild0Leaf: boolean;
  isChild1Leaf: boolean;
  child0Offset: number;
  child1Offset: number;
  max: Float32Array;
  min: Float32Array;
};

interface BVHLeaf {
  primitives: number;
  indexes: Uint32Array;
};

function boxHitTest(ray: Ray, max: Float32Array, min: Float32Array): number {
  let t1 = H.math.vec3.sub(new Float32Array(3), min, ray.origin);
  H.math.vec3.mul(t1, t1, ray.invDir);
  let t2 = H.math.vec3.sub(new Float32Array(3), max, ray.origin);
  H.math.vec3.mul(t2, t2, ray.invDir);
  let tvmin = H.math.vec3.min(new Float32Array(3), t1, t2);
  let tvmax = H.math.vec3.max(new Float32Array(3), t1, t2);
  let tmin = Math.max(tvmin[0], Math.max(tvmin[1], tvmin[2]));
  let tmax = Math.min(tvmax[0], Math.min(tvmax[1], tvmax[2]));

  // console.log('hit test', max, min, t1, t2, tvmax, tvmin, tmax, tmin);

  if (tmin > tmax || tmin > 9999) {
    return -1.;
  }
  
  if (tmin > 0.) {
    return tmin;
  }

  return tmax;
}

function getBVHNodeInfo(bvh: H.BVH, index: number): BVHNode {
  let realOffset= index * 4;
  let data0 = bvh.buffer.slice(realOffset, realOffset + 4);
  let data1 = bvh.buffer.slice(realOffset + 4, realOffset + 8);
  let child0 = new Uint32Array(data0.buffer, 0, 1)[0];
  let child1 = new Uint32Array(data1.buffer, 0, 1)[0];

  return {
    isChild0Leaf: (child0 >> 31) !== 0,
    isChild1Leaf: (child1 >> 31) !== 0,
    child0Offset: (child0 << 1) >> 1,
    child1Offset: (child1 << 1) >> 1,
    min: data0.slice(1),
    max: data1.slice(1)
  };
}

function hitTest(bvh: H.BVH, ray: Ray): BVHNode {
  console.log(ray);
  let node: BVHNode = getBVHNodeInfo(bvh, 0);
  let hited = boxHitTest(ray, node.max, node.min);

  if (hited <= 0.) {
    return null;
  }

  for (let i = 0; i < bvh.maxDepth; i = i + 1) {
    if (node.isChild0Leaf) {
      break;
    }

    if (node.isChild1Leaf) {
      break;
    }

    let child0Offset = node.child0Offset;
    let child1Offset = node.child1Offset;

    node = getBVHNodeInfo(bvh, child0Offset);
    hited = boxHitTest(ray, node.max, node.min);

    if (hited > 0.) {
      continue;
    }

    node = getBVHNodeInfo(bvh, child1Offset);
    hited = boxHitTest(ray, node.max, node.min);

    if (hited <= 0.) {
      return null;
    }
  }

  return node;
}

function getBVHLeafInfo(bvh: H.BVH, offset: number): BVHLeaf {
  let realOffset = offset * 4;
  let data = new Uint32Array(bvh.buffer.buffer, realOffset * 4, 4);

  return {
    primitives: data[0],
    indexes: data.slice(1)
  };
}

function triangleHitTest(ray: Ray, leaf: BVHLeaf, positions: Float32Array): boolean {
  let indexes = leaf.indexes;
  let p0 = positions.slice(indexes[0] * 3, indexes[0] * 3 + 3);
  let p1 = positions.slice(indexes[1] * 3, indexes[1] * 3 + 3);
  let p2 = positions.slice(indexes[2] * 3, indexes[2] * 3 + 3);

  let e0 = H.math.vec3.sub(new Float32Array(3), p1, p0);
  let e1 = H.math.vec3.sub(new Float32Array(3), p2, p0);
  let p = H.math.vec3.cross(new Float32Array(3), ray.dir, e1);
  let det = H.math.vec3.dot(e0, p);
  let t = H.math.vec3.sub(new Float32Array(3), ray.origin, p0);

  if (det < 0.) {
    H.math.vec3.scale(t, t, -1);
    det = -det;
  }

  if (det < 0.0001) {
    return false;
  }

  let u = H.math.vec3.dot(t, p);

  if (u < 0. || u > det) {
    return false;
  }

  let q = H.math.vec3.cross(new Float32Array(3), t, e0);
  let v = H.math.vec3.dot(ray.dir, q);

  if (v < 0. || v + u > det) {
    return false;
  }

  let lt = H.math.vec3.dot(e1, q);
  let invDet = 1. / det;
  let hitPoint = H.math.vec3.add(
    new Float32Array(3), ray.origin,
    H.math.vec3.scale(new Float32Array(3), ray.dir, lt * invDet)
  );
  let weights = H.math.vec3.scale(new Float32Array(3), new Float32Array([0., u, v]), invDet);
  weights[0] = 1. - weights[1] - weights[2];

  console.log('xxxx', hitPoint, weights);

  return true;
}

function leafHitTest(bvh: H.BVH, ray: Ray, positions: Float32Array, offset: number): BVHLeaf {
  var leaf: BVHLeaf = getBVHLeafInfo(bvh, offset);
  
  for (var i: number = 0; i < leaf.primitives; i = i + 1) {
    if (triangleHitTest(ray, leaf, positions)) {
      return leaf;
    }

    leaf = getBVHLeafInfo(bvh, offset + i);
  }

  return null;
}
