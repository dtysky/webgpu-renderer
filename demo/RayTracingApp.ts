/**
 * RayTracingApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:56:30 PM
*/
import * as H from '../src/index';
import {DebugInfo, debugRay, debugRayShadow, debugRayShadows, sampleCircle} from './debugCs';

const MODEL_SRC = '/assets/models/walls/scene.gltf';

export default class RayTracingApp {
  private _scene: H.Scene;
  private _camControl: H.NodeControl;
  private _camera: H.Camera;
  private _model: H.IGlTFResource;
  private _noiseTex: H.Texture;
  private _gBufferRT: H.RenderTexture;
  private _gBufferDebugMesh: H.ImageMesh;
  protected _rtManager: H.RayTracingManager;
  protected _rtOutput: H.RenderTexture;
  protected _denoiseRTs: {current: H.RenderTexture, pre: H.RenderTexture};
  protected _denoiseUnit: H.ComputeUnit;
  protected _rtBlit: H.ImageMesh;
  protected _rtDebugInfo: DebugInfo;
  protected _rtDebugMesh: H.Mesh;

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

    this._noiseTex = await H.resource.load({type: 'texture', name: 'noise.tex', src: '/assets/textures/noise-rgba.webp'});
    const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    if (model.cameras.length) {
      this._camera = model.cameras[0];
    }
    _scene.rootNode.addChild(model.rootNode);
    console.log(model);

    this._gBufferRT = new H.RenderTexture({
      width: renderEnv.width,
      height: renderEnv.height,
      colors: [
        {name: 'positionMetal', format: 'rgba16float'},
        {name: 'baseColorRoughOrGloss', format: 'rgba16float'},
        {name: 'normalMeshIndexGlass', format: 'rgba16float'},
        {name: 'specMatIndexMatType', format: 'rgba16float'}
      ],
      depthStencil: {needStencil: false}
    });

    this._gBufferDebugMesh = new H.ImageMesh(new H.Material(H.buildinEffects.iRTGShow));
    this._connectGBufferRenderTexture(this._gBufferDebugMesh.material);

    this._rtOutput = new H.RenderTexture({
      width: renderEnv.width,
      height: renderEnv.height,
      forCompute: true,
      colors: [{name: 'color', format: 'rgba16float'}]
    });

    this._denoiseRTs = {
      current: new H.RenderTexture({
        width: renderEnv.width,
        height: renderEnv.height,
        forCompute: true,
        colors: [{name: 'color', format: 'rgba16float'}]
      }),
      pre: new H.RenderTexture({
        width: renderEnv.width,
        height: renderEnv.height,
        forCompute: true,
        colors: [{name: 'color', format: 'rgba16float'}]
      })
    };
    this._denoiseUnit = new H.ComputeUnit(
      H.buildinEffects.cRTDenoise,
      {x: Math.ceil(renderEnv.width / 16), y: Math.ceil(renderEnv.height / 16)}
    );

    this._rtBlit = new H.ImageMesh(new H.Material(H.buildinEffects.iBlit, {u_texture: this._rtOutput}));

    this._rtDebugInfo = new DebugInfo();

    if (this._camera.isOrth) {
      this._rtBlit.material.setMarcos({FLIP: true});
    }
    
    this._camControl.control(this._camera, new H.Node());

    await this._frame();
    // const {rays, mesh} = await this._rtDebugInfo.showDebugInfo([100, 100], [110, 110]);
    // console.log(rays)
    // rays.slice(52, 58).forEach(ray => sampleCircle(ray.dir));
    // debugRayShadows(rays.filter(ray => !ray.origin[3]).slice(0, 1), this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array);
    // this._rtDebugMesh = mesh;
    // rays.forEach(ray => debugRay(ray, this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array));
    // await this._frame();
  }

  public async update(dt: number) {
    await this._frame();
  }

  private async _frame() {
    const {_scene} = this;

    H.renderEnv.setUniform('u_randomSeed', new Float32Array(4).fill(Math.random()));
    _scene.startFrame();
    
    const first = !this._rtManager;
    if (first) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera), this._rtOutput);
      this._rtManager.rtUnit.setUniform('u_noise', this._noiseTex);
      this._connectGBufferRenderTexture(this._rtManager.rtUnit);
      this._rtDebugInfo.setup(this._rtManager);
    }

    // this._showBVH();
    this._renderGBuffer();
    // this._showGBufferResult();
    this._scene.setRenderTarget(null);
    this._computeRTSS();
    this._computeDenoise();
    this._scene.renderImages([this._rtBlit]);

    if (first) {
      this._rtDebugInfo.run(_scene);
    }

    // const {mesh} = await this._rtDebugInfo.showDebugInfo([2000, 400], [2001, 401]);
    // this._rtDebugMesh = mesh;

    if (this._rtDebugMesh) {
      _scene.renderCamera(this._camera, [this._rtDebugMesh], false);
    }

    _scene.endFrame();
  }

  private _renderGBuffer() {
    this._scene.setRenderTarget(this._gBufferRT);
    this._scene.renderCamera(this._camera, [this._rtManager.gBufferMesh]);
  }

  protected _computeRTSS() {
    this._scene.computeUnits([this._rtManager.rtUnit]);
  }

  protected _computeDenoise() {
    const {current, pre} = this._denoiseRTs;
    this._denoiseUnit.setUniform('u_output', current);
    this._denoiseUnit.setUniform('u_pre', pre);
    this._denoiseUnit.setUniform('u_current', this._rtOutput);

    this._scene.computeUnits([this._denoiseUnit]);

    this._rtBlit.material.setUniform('u_texture', current);

    this._denoiseRTs.current = pre;
    this._denoiseRTs.pre = current;
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
    material.setUniform('u_gbBaseColorRoughOrGloss', this._gBufferRT, 'baseColorRoughOrGloss');
    material.setUniform('u_gbNormalMeshIndexGlass', this._gBufferRT, 'normalMeshIndexGlass');
    material.setUniform('u_gbSpecMatIndexMatType', this._gBufferRT, 'specMatIndexMatType');
  }
}
