/**
 * @File   : Scene.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:22
 */
import Camera from './Camera';
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';

export default class Scene {
  public className: string = 'Scene';
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
    camera.render(
      this._command,
      {
        color: renderEnv.swapChain.getCurrentTexture().createView(),
      },
      meshes
    );
  }

  public renderLight() {

  }

  public endFrame() {
    renderEnv.device.queue.submit([this._command.finish()]);
  }
}