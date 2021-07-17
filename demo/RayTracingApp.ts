/**
 * RayTracingApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:56:30 PM
*/
import * as H from '../src/index';
import {DebugInfo, debugRay, debugRayShadow, debugRayShadows, sampleCircle} from './debugCs';

const MODEL_SRC = '/assets/models/walls/scene.gltf';
const MAX_SAMPLERS = 256;

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
  protected _frameCount: number = 0;

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
        {name: 'positionMetalOrSpec', format: 'rgba16float'},
        {name: 'baseColorRoughOrGloss', format: 'rgba16float'},
        {name: 'normalGlass', format: 'rgba16float'},
        {name: 'meshIndexMatIndexMatType', format: 'rgba8uint'}
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
      {x: Math.ceil(renderEnv.width / 16), y: Math.ceil(renderEnv.height / 16)},
      undefined,
      {WINDOW_SIZE: 7}
    );
    this._connectGBufferRenderTexture(this._denoiseUnit);

    this._rtBlit = new H.ImageMesh(new H.Material(H.buildinEffects.iBlit, {u_texture: this._rtOutput}));

    this._rtDebugInfo = new DebugInfo();

    if (this._camera.isOrth) {
      this._rtBlit.material.setMarcos({FLIP: true});
    }
    
    this._camControl.control(this._camera, new H.Node());
    this._camControl.onChange = () => {
      this._frameCount = 0;
    };

    await this._frame(0);

    H.renderEnv.canvas.addEventListener('mouseup', async (e) => {
      const {clientX, clientY} = e;
      const {rays, mesh} = await this._rtDebugInfo.showDebugInfo([clientX, clientY], [clientX + 10, clientY + 10]);
      console.log(rays);
    })
    
    // setTimeout(async () => {
    //   const {rays, mesh} = await this._rtDebugInfo.showDebugInfo([610, 250], [620, 260]);
    //   console.log(rays)
    // }, 1000);
    // debugRayShadows(rays.filter(ray => ray.origin[3]).slice(0, 1), this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array);
    // const {rays, mesh} = await this._rtDebugInfo.showDebugInfo([160, 360], [200, 400]);
    // console.log(rays)
    // debugRayShadows(rays.filter(ray => ray.origin[3]).slice(0, 1), this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array);
    // this._rtDebugMesh = mesh;
    // rays.forEach(ray => debugRay(ray, this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array));
    // await this._frame();

    // await this._frame(16);
  }

  public async update(dt: number) {
    await this._frame(dt);
  }

  private async _frame(dt: number) {
    const {_scene} = this;
    this._frameCount += 1;
    const preWeight = (this._frameCount - 1) / this._frameCount;

    if (preWeight > .999) {
      return;
    }
    // console.log(preWeight)

    _scene.startFrame(dt);
    
    const first = !this._rtManager;
    if (first) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera), this._rtOutput);
      this._rtManager.rtUnit.setUniform('u_noise', this._noiseTex);
      this._connectGBufferRenderTexture(this._rtManager.rtUnit);
      this._rtDebugInfo.setup(this._rtManager);
    }

    this._rtManager.rtUnit.setUniform('u_randoms', new Float32Array(16).map(v => Math.random()));
    this._denoiseUnit.setUniform('u_preWeight', new Float32Array([preWeight]));

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
    material.setUniform('u_gbPositionMetalOrSpec', this._gBufferRT, 'positionMetalOrSpec');
    material.setUniform('u_gbBaseColorRoughOrGloss', this._gBufferRT, 'baseColorRoughOrGloss');
    material.setUniform('u_gbNormalGlass', this._gBufferRT, 'normalGlass');
    material.setUniform('u_gbMeshIndexMatIndexMatType', this._gBufferRT, 'meshIndexMatIndexMatType');
  }
}
