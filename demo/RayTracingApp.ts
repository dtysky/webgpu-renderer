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
  private _gBufferDebugMesh: H.ImageMesh;
  protected _rtManager: H.RayTracingManager;

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
        {name: 'diffuseRough', format: 'rgba16float'},
        {name: 'normalMeshIndex', format: 'rgba16float'},
        {name: 'faceNormalMatIndex', format: 'rgba16float'}
      ],
      depthStencil: {needStencil: false}
    });

    const {material: gsMat} = this._gBufferDebugMesh = new H.ImageMesh(new H.Material(H.buildinEffects.iRTGShow));
    gsMat.setUniform('u_positionMetal', this._gBufferRT, 'positionMetal');
    gsMat.setUniform('u_diffuseRough', this._gBufferRT, 'diffuseRough');
    gsMat.setUniform('u_normalMeshIndex', this._gBufferRT, 'normalMeshIndex');
    gsMat.setUniform('u_faceNormalMatIndex', this._gBufferRT, 'faceNormalMatIndex');
    
    const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    if (model.cameras.length) {
      this._camera = model.cameras[0];
    }
    _scene.rootNode.addChild(model.rootNode);
    
    // this._camera.drawSkybox = true;
    this._camControl.control(this._camera);

    this._frame();
  }

  public update(dt: number) {
    this._frame();
  }

  private _frame() {
    const {device} = H.renderEnv;
    const {_scene} = this;

    _scene.startFrame();
    
    if (!this._rtManager) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera));
    }
    
    this._showBVH();
    // this._renderGBuffer();
    // this._showGBufferResult();
    // this._renderRTSS();
    _scene.endFrame();
  }

  private _renderGBuffer() {
    this._scene.setRenderTarget(this._gBufferRT);
    this._scene.renderCamera(this._camera, [this._rtManager.gBufferMesh]);
  }

  private _showGBufferResult() {
    this._scene.setRenderTarget(null);
    this._scene.renderImages([this._gBufferDebugMesh], this._camera);
  }

  private _showBVH() {
    this._scene.setRenderTarget(null);
    this._scene.renderCamera(this._camera, [
      ...this._scene.cullCamera(this._camera),
      this._rtManager.bvhDebugMesh
    ]);
  }

  protected _renderRTSS() {
    this._scene.setRenderTarget(null);
  }
}
