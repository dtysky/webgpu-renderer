/**
 * @File   : Camera.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:24:51
 */
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';

export default class Camera extends Node {
  public className: string = 'Node';
  public isCamera: boolean = true;

  public viewport: {x: number, y: number, w: number, h: number};
  public clearColor: [number, number, number, number];
  public colorOp: GPUStoreOp;
  public clearDepth: number;
  public depthOp: GPUStoreOp;
  public clearStencil: number;
  public stencilOp: GPUStoreOp;

  protected _near: number;
  protected _far: number;
  protected _fov: number;
  protected _aspect: number;

  constructor(
    viewOptions: {
      viewport?: {x: number, y: number, w: number, h: number},
      clearColor?: [number, number, number, number],
      colorOp?: GPUStoreOp,
      clearDepth?: number,
      depthOp?: GPUStoreOp,
      clearStencil?: number,
      stencilOp?: GPUStoreOp,
    },
    cameraOptions?: {
      near?: number,
      far?: number,
      fov?: number,
      aspect?: number,
    },
    protected _justAsView: boolean = false
  ) {
    super();

    cameraOptions = cameraOptions || {};
    this._near = cameraOptions.near || 0;
    this._far = cameraOptions.far || 1000;
    this._fov = cameraOptions.fov || (Math.PI / 3);
    this._aspect = cameraOptions.aspect || (renderEnv.width / renderEnv.height);
    this.clearColor = viewOptions.clearColor || [0, 0, 0, 1];
    this.clearDepth = viewOptions.clearDepth !== undefined ? viewOptions.clearDepth : 1;
    this.clearStencil = viewOptions.clearStencil || 0;
    this.colorOp = viewOptions.colorOp || 'clear';
    this.depthOp = viewOptions.depthOp || 'clear';
    this.stencilOp = viewOptions.stencilOp || 'clear';
    this.viewport = viewOptions.viewport || {x: 0, y: 0, w: 1, h: 1};
  }


  public render(cmd: GPUCommandEncoder, target: {color: GPUTextureView, depthStencil?: GPUTextureView}, meshes: Mesh[]) {
    const [r, g, b, a] = this.clearColor;
    const {x, y, w, h} = this.viewport;
    const {width, height} = renderEnv;

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view: target.color,
        loadValue: {r, g, b, a},
        storeOp: this.colorOp
      }],
      depthStencilAttachment: target.depthStencil ? {
        view: target.depthStencil,
        depthLoadValue: this.clearDepth,
        stencilLoadValue: this.clearStencil,
        depthStoreOp: this.depthOp,
        stencilStoreOp: this.stencilOp
      } : undefined
    };

    const pass = cmd.beginRenderPass(renderPassDescriptor);
    pass.setViewport(x * width, y * height, w * width, h * height, 0, 1);

    for (const mesh of meshes) {
      mesh.render(pass);
    }

    pass.endPass();
  }

  public cull(mesh: Mesh): number {
    return 0;
  }
}