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
  private _model: H.IGlTFResource;
  private _camera: H.Camera;
  private _gBufferRT: H.RenderTexture;
  private _rtMesh: H.ImageMesh;

  public async init() {
    const {renderEnv} = H;

    const _scene = this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();

    rootNode.addChild(this._camera = new H.Camera(
      {clearColor: [0, 1, 0, 1]},
      {near: 0.01, far: 100, fov: Math.PI / 3}
    ));
    this._camera.pos.set([0, 0, 6]);

    this._gBufferRT = new H.RenderTexture({
      width: renderEnv.width,
      height: renderEnv.height,
      colors: [
        {}
      ],
      depthStencil: {needStencil: false}
    });

    this._rtMesh = new H.ImageMesh(new H.Material(H.buildinEffects.rRTSS));

    const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    if (model.cameras.length) {
      this._camera = model.cameras[0];
    }
    _scene.rootNode.addChild(model.rootNode);

    this._frame();
  }

  public update(dt: number) {

  }

  private _frame() {
    const {device} = H.renderEnv;
    const {_scene} = this;

    _scene.startFrame();
    // _scene.renderCamera(this._camera, _scene.cullCamera(this._camera));
    this._renderRTSS();
    _scene.endFrame();
  }

  private _renderGBuffer(meshes: H.Mesh[]) {

  }

  private _showGBufferResult() {

  }

  protected _renderRTSS() {
    this._scene.renderImages([this._rtMesh]);
  }
}
