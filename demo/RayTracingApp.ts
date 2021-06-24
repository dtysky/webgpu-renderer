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
    // this._frame();
  }

  private _frame() {
    const {_scene} = this;

    _scene.startFrame();
    
    if (!this._rtManager) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera), this._rtOutput);
      this._connectGBufferRenderTexture(this._rtManager.rtUnit);
      debugCS(this._camera, this._rtManager.bvh);
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

function debugCS(camera: H.Camera, bvh: H.BVH) {
  const ray: Ray = {
    origin: camera.pos,
    dir: new Float32Array([0, 0, 1]),
    invDir: new Float32Array([0, 0, 1])
  };

  const hited = hitTest(bvh, ray);
  console.log(hited);
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

function boxHitTest(ray: Ray, max: Float32Array, min: Float32Array): number {
  let t1 = H.math.vec3.sub(new Float32Array(3), min, ray.origin);
  H.math.vec3.mul(t1, t1, ray.invDir);
  let t2 = H.math.vec3.sub(new Float32Array(3), max, ray.origin);
  H.math.vec3.mul(t2, t2, ray.invDir);
  let tvmin = H.math.vec3.min(new Float32Array(3), t1, t2);
  let tvmax = H.math.vec3.max(new Float32Array(3), t1, t2);
  let tmin = Math.max(tvmin[0], Math.max(tvmin[1], tvmin[2]));
  let tmax = Math.min(tvmax[0], Math.min(tvmax[1], tvmax[2]));

  if (tmin > tmax || tmin > 9999) {
    return -1.;
  }
  
  if (tmin > 0.) {
    return tmin;
  }

  return tmax;
}

function getBVHNodeInfo(bvh: H.BVH, index: number): BVHNode {
  let realOffset= index * 8;
  let data0 = bvh.buffer.slice(realOffset, realOffset + 4);
  let data1 = bvh.buffer.slice(realOffset + 4, realOffset + 8);
  let child0 = new Uint32Array(data0.buffer, 0, 1)[0];
  let child1 = new Uint32Array(data1.buffer, 0, 1)[0];

  return {
    isChild0Leaf: (child0 >> 31) == 1,
    isChild1Leaf: (child1 >> 31) == 1,
    child0Offset: (child0 << 1) >> 1,
    child1Offset: (child1 << 1) >> 1,
    min: data0.slice(1),
    max: data1.slice(1)
  };
}

function hitTest(bvh: H.BVH, ray: Ray): boolean {
  var node: BVHNode = getBVHNodeInfo(bvh, 0);
  let hited = boxHitTest(ray, node.max, node.min);
  console.log('start', node, hited);

  if (hited <= 0.) {
    return false;
  }

  for (let i = 0; i < bvh.maxDepth; i = i + 1) {
    if (node.isChild0Leaf) {
      console.log(node.child0Offset);
      break;
    }

    if (node.isChild1Leaf) {
      console.log(node.child1Offset);
      break;
    }

    let child0Offset = node.child0Offset;
    let child1Offset = node.child1Offset;

    node = getBVHNodeInfo(bvh, child0Offset);
    hited = boxHitTest(ray, node.max, node.min);
    console.log('child0', node, hited);

    if (hited > 0.) {
      continue;
    }

    node = getBVHNodeInfo(bvh, child1Offset);
    hited = boxHitTest(ray, node.max, node.min);
    console.log('child1', node, hited);

    if (hited <= 0.) {
      return false;
    }
  }

  return true;
}
