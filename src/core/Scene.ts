/**
 * @File   : Scene.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:22
 */
import Camera from './Camera';
import ComputeUnit from './ComputeUnit';
import HObject from './HObject';
import ImageMesh from './ImageMesh';
import Material from './Material';
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';

export default class Scene extends HObject {
  public static CLASS_NAME: string = 'Scene';
  public isScene: boolean = true;

  protected _rootNode: Node;
  protected _command: GPUCommandEncoder;
  protected _renderTarget: RenderTexture | null;

  set rootNode(node: Node) {
    this._rootNode = node;
  }

  get rootNode() {
    return this._rootNode;
  }

  public updateWorld() {
    this._rootNode.updateSubTree();
  }

  public cullCamera(camera: Camera): Mesh[] {
    const meshes: Mesh[] = [];

    this._rootNode.dfs<void>(node => {
      if (node.active && (node as Mesh).isMesh) {
        const mesh = node as Mesh;
        const distance = camera.cull(mesh);

        if (distance >= 0) {
          mesh.sortZ = distance;
          meshes.push(mesh);
        }
      }
    });

    meshes.sort((a, b) => a.sortZ - b.sortZ);

    return meshes;
  }

  public setRenderTarget(target: RenderTexture | null) {
    this._renderTarget = target;
  }

  public startFrame() {
    this.updateWorld();
    this._command = renderEnv.device.createCommandEncoder();
  }

  public renderCamera(camera: Camera, meshes: Mesh[]) {
    const color = this._renderTarget?.colorView || renderEnv.swapChain.getCurrentTexture().createView();
    const depthStencil = this._renderTarget?.depthStencilView || undefined;
    const width = this._renderTarget?.width || renderEnv.width;
    const height = this._renderTarget?.height || renderEnv.height

    camera.render(
      this._command,
      {color, depthStencil, width, height},
      meshes
    );
  }

  public renderLight() {

  }

  public renderImages(meshes: ImageMesh[]) {
    const view = this._renderTarget?.colorView || renderEnv.swapChain.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view,
        loadValue: {r: 0, g: 0, b: 0, a: 1},
        storeOp: 'store' as GPUStoreOp
      }]
    };

    const pass = this._command.beginRenderPass(renderPassDescriptor);

    for (const mesh of meshes) {
      mesh.render(pass);
    }

    pass.endPass();
  }

  public computeUnits(units: ComputeUnit[]) {
    const pass = this._command.beginComputePass();

    for (const unit of units) {
      unit.compute(pass);
    }

    pass.endPass();
  }

  public endFrame() {
    renderEnv.device.queue.submit([this._command.finish()]);
  }
}