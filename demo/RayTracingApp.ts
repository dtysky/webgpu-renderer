/**
 * RayTracingApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:56:30 PM
*/
import 'select-pure/dist/index.js';
import * as H from '../src/index';
import {DebugInfo, debugRay, debugRayShadow, debugRayShadows, sampleCircle} from './debugCs';

const MODEL_SRC = './demo/assets/models/walls/scene.gltf';
const MAX_SAMPLERS = 256;

function addSelect(onChange: (options: string) => void) {
  const domText = `
<select-pure name="View Mode" id="view-mode" style="position:absolute;right:0;width:128px;">
  <option-pure value="result">Result</option-pure>
  <option-pure value="bvh">Show BVH</option-pure>
  <option-pure value="gbuffer">Show GBuffer</option-pure>
  <option-pure value="origin">Origin</option-pure>
</select-pure>
  `;

  const dom = document.createElement('div');
  dom.innerHTML = domText;
  document.body.appendChild(dom);

  const selectPure = document.querySelector('select-pure') as any;
  selectPure.addEventListener('change', (event: any) => {
    const value: string = event.target.value;
    onChange(value);
  });

  return dom;
}

export default class RayTracingApp {
  private _scene: H.Scene;
  private _camControl: H.NodeControl;
  private _camera: H.Camera;
  private _model: H.IGlTFResource;
  private _noiseTex: H.Texture;
  private _gBufferRT: H.RenderTexture;
  private _gbufferLightMaterial: H.Material;
  private _gBufferDebugMesh: H.ImageMesh;
  private _rtManager: H.RayTracingManager;
  private _rtOutput: H.RenderTexture;
  private _denoiseRTs: {current: H.RenderTexture, pre: H.RenderTexture, final: H.RenderTexture};
  private _denoiseTemporUnit: H.ComputeUnit;
  private _denoiseSpaceUnit: H.ComputeUnit;
  private _rtTone: H.ImageMesh;
  private _rtDebugInfo: DebugInfo;
  private _rtDebugMesh: H.Mesh;
  private _frameCount: number = 0;
  private _viewMode: string = 'result';

  public async init() {
    addSelect((value) => {
      console.log(value)
      this._viewMode = value;
      this._frameCount = 0;
    });

    const {renderEnv} = H;

    const _scene = this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();
    this._camControl = new H.NodeControl('free');

    rootNode.addChild(this._camera = new H.Camera(
      {clearColor: [0, 1, 0, 1]},
      {near: 0.01, far: 100, fov: Math.PI / 3}
    ));
    this._camera.pos.set([0, 0, 6]);

    this._noiseTex = await H.resource.load({type: 'texture', name: 'noise.tex', src: './demo/assets/textures/noise-rgba.webp'});
    const model = this._model = await H.resource.load({type: 'gltf', name: 'scene.gltf', src: MODEL_SRC});
    if (model.cameras.length) {
      this._camera = model.cameras[0];
    }
    _scene.rootNode.addChild(model.rootNode);

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

    this._gbufferLightMaterial = new H.Material(H.buildinEffects.rRTGBufferLight);
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
      }),
      final: new H.RenderTexture({
        width: renderEnv.width,
        height: renderEnv.height,
        forCompute: true,
        colors: [{name: 'color', format: 'rgba16float'}]
      })
    };
    this._denoiseSpaceUnit = new H.ComputeUnit(
      H.buildinEffects.cRTDenoiseSpace,
      {x: Math.ceil(renderEnv.width / 16), y: Math.ceil(renderEnv.height / 16)},
      undefined,
      {WINDOW_SIZE: 7}
    );
    this._denoiseTemporUnit = new H.ComputeUnit(
      H.buildinEffects.cRTDenoiseTempor,
      {x: Math.ceil(renderEnv.width / 16), y: Math.ceil(renderEnv.height / 16)}
    );
    this._connectGBufferRenderTexture(this._denoiseSpaceUnit);

    this._rtTone = new H.ImageMesh(new H.Material(H.buildinEffects.iTone));

    this._rtDebugInfo = new DebugInfo();
    
    this._camControl.control(this._camera, new H.Node());
    this._camControl.onChange = () => {
      this._frameCount = 0;
    };

    await this._frame(16);

    // H.renderEnv.canvas.addEventListener('mouseup', async (e) => {
      // const {clientX, clientY} = e;
      // const {rays, mesh} = await this._rtDebugInfo.showDebugInfo([clientX, clientY], [10, 10], [4, 2]);
      // console.log(rays);
      // this._rtDebugMesh = mesh;
      // await this._frame(16);
      // rays.slice(0, 1).forEach(ray => debugRay(ray, this._rtManager.bvh, this._rtManager.gBufferMesh.geometry.getValues('position').cpu as Float32Array));
    // })

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

    _scene.startFrame(dt);
    
    const first = !this._rtManager;
    if (first) {
      this._rtManager = new H.RayTracingManager();
      this._rtManager.process(this._scene.cullCamera(this._camera), this._rtOutput);
      this._rtManager.rtUnit.setUniform('u_noise', this._noiseTex);
      this._connectGBufferRenderTexture(this._rtManager.rtUnit);
      // this._rtDebugInfo.setup(this._rtManager);
    }

    this._rtManager.rtUnit.setUniform('u_randoms', new Float32Array(16).map(v => Math.random()));
    this._denoiseTemporUnit.setUniform('u_preWeight', new Float32Array([preWeight]));

    if (this._viewMode === 'bvh') {
      this._showBVH();
    } else if (this._viewMode === 'gbuffer') {
      this._renderGBuffer();
      this._showGBufferResult();
    } else {
      this._renderGBuffer();
      this._scene.setRenderTarget(null);  
      this._computeRTSS();

      if (this._viewMode === 'result') {
        this._computeDenoise();
      } else {
        this._rtTone.material.setUniform('u_texture', this._rtOutput);
      }

      this._scene.renderImages([this._rtTone]);
    }
    

    // if (first) {
    //   this._rtDebugInfo.run(_scene);
    // }

    if (this._rtDebugMesh) {
      _scene.renderCamera(this._camera, [this._rtDebugMesh], false);
    }

    _scene.endFrame();
  }

  private _renderGBuffer() {
    this._scene.setRenderTarget(this._gBufferRT);
    const lightMeshes = this._scene.lights.map(light => light.requireLightMesh(this._gbufferLightMaterial)).filter(m => !!m);
    this._scene.renderCamera(this._camera, [
      this._rtManager.gBufferMesh,
      ...lightMeshes
    ]);
  }

  protected _computeRTSS() {
    this._scene.computeUnits([this._rtManager.rtUnit]);
  }

  protected _computeDenoise() {
    const {current, pre, final} = this._denoiseRTs;
    this._denoiseTemporUnit.setUniform('u_pre', pre);
    this._denoiseTemporUnit.setUniform('u_current', this._rtOutput);
    this._denoiseTemporUnit.setUniform('u_output', current);

    this._denoiseSpaceUnit.setUniform('u_preFilter', current);
    this._denoiseSpaceUnit.setUniform('u_output', final);

    this._scene.computeUnits([this._denoiseTemporUnit, this._denoiseSpaceUnit]);

    this._denoiseRTs.pre = final;
    this._denoiseRTs.final = pre;

    this._rtTone.material.setUniform('u_texture', final);
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
