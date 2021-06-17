/**
 * RayTracingApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:56:30 PM
*/
import * as H from '../src/index';

const MODEL_SRC = '/assets/models/simple/scene.gltf';

export default class RayTracingApp {
  private _scene: H.Scene;
  private _camControl: H.NodeControl;
  private _model: H.IGlTFResource;
  private _camera: H.Camera;
  private _gBufferRT: H.RenderTexture;
  protected _bvh: H.BVH;

  public async init() {
    const {renderEnv} = H;

    const _scene = this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();
    this._camControl = new H.NodeControl();

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
        {name: 'colorRough', format: 'rgba16float'},
        {name: 'normalMeshIndex', format: 'rgba8unorm'},
        {name: 'faceNormalMatIndex', format: 'rgba8unorm'}
      ],
      depthStencil: {needStencil: false}
    });

    
    // const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    // if (model.cameras.length) {
    //   this._camera = model.cameras[0];
    // }
    // _scene.rootNode.addChild(model.rootNode);

    const geometry = new H.Geometry(
      [
        {
          layout: {
            arrayStride: 3 * 4,
            attributes: [
              {
                name: 'position',
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3' as GPUVertexFormat
              }
            ]
          },
          data: new Float32Array([
            -1, -1, 0,
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
          ])
        },
        {
          layout: {
            arrayStride: 2 * 4,
            attributes: [
              {
                name: 'texcoord_0',
                shaderLocation: 1,
                offset: 0,
                format: 'float32x2' as GPUVertexFormat
              }
            ]
          },
          data: new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0,
          ])
        },
      ],
      new Uint16Array([0, 1, 2, 2, 1, 3]),
      6
    );

    const m1 = new H.Mesh(geometry, new H.Material(H.buildinEffects.rPBR));
    const m2 = new H.Mesh(geometry, new H.Material(H.buildinEffects.rPBR));
    m2.pos.set(new Float32Array([-1, -1, 0]));
    // _scene.rootNode.addChild(m1);
    _scene.rootNode.addChild(m2);
    
    this._camControl.control(this._camera);

    this._frame();
  }

  public update(dt: number) {
    // this._frame();
  }

  private _frame() {
    const {device} = H.renderEnv;
    const {_scene} = this;

    _scene.startFrame();

    if (!this._bvh) {
      this._bvh = new H.BVH();
      this._bvh.process(this._scene.cullCamera(this._camera));
    }

    this._renderGBuffer();
    // this._renderRTSS();
    _scene.endFrame();
  }

  private _renderGBuffer() {
    // this._scene.renderCamera(this._camera, this._scene.cullCamera(this._camera));
    // this._scene.setRenderTarget(this._gBufferRT);
    this._scene.renderCamera(this._camera, [this._bvh.gBufferMesh]);;
  }

  private _showGBufferResult() {

  }

  protected _renderRTSS() {
    this._scene.setRenderTarget(null);
  }
}
