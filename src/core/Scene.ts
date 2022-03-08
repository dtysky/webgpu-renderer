/**
 * @File   : Scene.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:22
 */
import { buildinEffects } from '../buildin';
import Camera from './Camera';
import ComputeUnit from './ComputeUnit';
import HObject from './HObject';
import ImageMesh from './ImageMesh';
import Light from './Light';
import Material from './Material';
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';

export default class Scene extends HObject {
  public static CLASS_NAME: string = 'Scene';
  public isScene: boolean = true;

  protected _gameTime: number;
  protected _rootNode: Node;
  protected _meshes: Mesh[];
  protected _lights: Light[];
  protected _command: GPUCommandEncoder;
  protected _renderTarget: RenderTexture;
  protected _screen: RenderTexture;
  protected _blit: ImageMesh;

  set rootNode(node: Node) {
    this._rootNode = node;
  }

  get rootNode() {
    return this._rootNode;
  }

  get screen() {
    return this._screen;
  }

  get lights() {
    return this._lights;
  }

  constructor() {
    super();

    this._renderTarget = this._screen = new RenderTexture({width: renderEnv.width, height: renderEnv.height, colors: [{}], depthStencil: {needStencil: true}});
    this._blit = new ImageMesh(new Material(buildinEffects.iBlit, {u_texture: this._screen}));
  }

  public cullCamera(camera: Camera): Mesh[] {
    const meshes: Mesh[] = [];

    this._meshes.forEach(mesh => {
      const distance = camera.cull(mesh);

      if (distance >= 0) {
        mesh.sortZ = distance;
        meshes.push(mesh);
      }
    });

    meshes.sort((a, b) => a.sortZ - b.sortZ);

    return meshes;
  }

  public setRenderTarget(target: RenderTexture | null) {
    this._renderTarget = target ? target : this._screen;
  }

  public startFrame(dt: number) {
    this._gameTime += dt;
    this._meshes = [];
    this._lights = [];

    this._rootNode.updateSubTree(node => {
      if (Mesh.IS(node)) {
        this._meshes.push(node);
      } else if (Light.IS(node)) {
        this._lights.push(node);
      }
    });

    const lightInfos = renderEnv.getUniform('u_lightInfos') as Float32Array;
    if (lightInfos) {
      this._lights.forEach((l, i) => {
        if (i < 4) {
          lightInfos.set(l.ubInfo, i * 16);
        }
      });
      renderEnv.setUniform('u_lightInfos', lightInfos); 
    }

    renderEnv.setUniform('u_gameTime', new Float32Array([this._gameTime / 1000]));
    this._command = renderEnv.device.createCommandEncoder();
  }

  public renderCamera(camera: Camera, meshes: Mesh[], clear: boolean = true) {
    camera.render(
      this._command,
      this._renderTarget,
      meshes,
      clear
    );
  }

  // public renderLight() {

  // }

  public renderImages(meshes: ImageMesh[], clear: boolean = true) {
    const view = this._renderTarget.colorView;

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view,
        loadOp: clear ? 'clear' : 'load',
        storeOp: 'store' as GPUStoreOp
      }]
    };

    const pass = this._command.beginRenderPass(renderPassDescriptor);
    pass.setBindGroup(0, renderEnv.bindingGroup);

    for (const mesh of meshes) {
      mesh.render(pass);
    }

    pass.end();
  }

  public computeUnits(units: ComputeUnit[]) {
    const pass = this._command.beginComputePass();
    pass.setBindGroup(0, renderEnv.bindingGroup);

    for (const unit of units) {
      unit.compute(pass);
    }

    pass.end();
  }

  public copyBuffer(src: GPUBuffer, dst: GPUBuffer, size: number) {
    this._command.copyBufferToBuffer(src, 0, dst, 0, size);
  }

  public endFrame() {
    const view = renderEnv.currentTexture.createView();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view,
        loadOp: 'clear',
        storeOp: 'store' as GPUStoreOp
      }]
    };

    const pass = this._command.beginRenderPass(renderPassDescriptor);
    pass.setBindGroup(0, renderEnv.bindingGroup);
    this._blit.render(pass);
    pass.end();

    renderEnv.device.queue.submit([this._command.finish()]);
  }
}