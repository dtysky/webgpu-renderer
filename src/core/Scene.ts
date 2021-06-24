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

  public startFrame() {
    this._meshes = [];
    this._lights = [];

    this._rootNode.updateSubTree(node => {
      if (Mesh.IS(node)) {
        this._meshes.push(node);
      } else if (Light.IS(node)) {
        this._lights.push(node);
      }
    });

    this._command = renderEnv.device.createCommandEncoder();
  }

  public renderCamera(camera: Camera, meshes: Mesh[]) {
    camera.render(
      this._command,
      this._renderTarget,
      meshes
    );
  }

  // public renderLight() {

  // }

  public renderImages(meshes: ImageMesh[]) {
    const view = this._renderTarget.colorView;

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view,
        loadValue: {r: 0, g: 0, b: 0, a: 1},
        storeOp: 'store' as GPUStoreOp
      }]
    };

    const pass = this._command.beginRenderPass(renderPassDescriptor);

    pass.setBindGroup(0, renderEnv.bindingGroup);
    for (const mesh of meshes) {
      mesh.render(pass);
    }

    pass.endPass();
  }

  public computeUnits(units: ComputeUnit[]) {
    const pass = this._command.beginComputePass();

    for (const unit of units) {
      pass.setBindGroup(0, renderEnv.bindingGroup);
      unit.compute(pass);
    }

    pass.endPass();
  }

  public drawSkybox() {

  }

  public endFrame() {
    const view = renderEnv.swapChain.getCurrentTexture().createView();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view,
        loadValue: {r: 0, g: 0, b: 0, a: 1},
        storeOp: 'store' as GPUStoreOp
      }]
    };

    const pass = this._command.beginRenderPass(renderPassDescriptor);
    pass.setBindGroup(0, renderEnv.bindingGroup);
    this._blit.render(pass);
    pass.endPass();

    renderEnv.device.queue.submit([this._command.finish()]);
  }
}