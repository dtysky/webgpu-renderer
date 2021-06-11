/**
 * @File   : Camera.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:24:51
 */
import {mat4} from 'gl-matrix';
import Light from './Light';
import Material from './Material';
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';

export default class Camera extends Node {
  public static CLASS_NAME: string = 'Node';

  public static IS(value: any): value is Camera{
    return !!(value as Camera).isCamera;
  }

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
  protected _viewMat: Float32Array;
  protected _projMat: Float32Array;
  protected _vpMat: Float32Array;

  get vpMat() {
    return this._vpMat;
  }

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
    this.colorOp = viewOptions.colorOp || 'store';
    this.depthOp = viewOptions.depthOp || 'store';
    this.stencilOp = viewOptions.stencilOp || 'store';
    this.viewport = viewOptions.viewport || {x: 0, y: 0, w: 1, h: 1};
    this._viewMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._projMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._vpMat = mat4.identity(new Float32Array(16)) as Float32Array;
  }

  public updateMatrix() {
    super.updateMatrix();

    mat4.invert(this._viewMat, this._worldMat);
    mat4.perspective(this._projMat, this._fov, this._aspect, this._near, this._far);
    mat4.multiply(this._vpMat, this._projMat, this._viewMat);
  }

  public fillUniforms(material: Material) {
    material.setUniform('u_vp', this._vpMat);
    material.setUniform('u_view', this._viewMat);
    material.setUniform('u_proj', this._projMat);
  }

  public render(
    cmd: GPUCommandEncoder,
    rt: RenderTexture,
    lights: Light[],
    meshes: Mesh[]
  ) {
    const [r, g, b, a] = this.clearColor;
    const {x, y, w, h} = this.viewport;
    const {width, height, colorViews, depthStencilView} = rt;

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: colorViews.map(view => ({
        view,
        loadValue: {r, g, b, a},
        storeOp: this.colorOp
      })),
      depthStencilAttachment: depthStencilView && {
        view: depthStencilView,
        depthLoadValue: this.clearDepth,
        stencilLoadValue: this.clearStencil,
        depthStoreOp: this.depthOp,
        stencilStoreOp: this.stencilOp
      }
    };

    const pass = cmd.beginRenderPass(renderPassDescriptor);
    pass.setViewport(x * width, y * height, w * width, h * height, 0, 1);

    for (const mesh of meshes) {
      mesh.render(pass, this, rt, lights);
    }

    pass.endPass();
  }

  public cull(mesh: Mesh): number {
    return 0;
  }
}