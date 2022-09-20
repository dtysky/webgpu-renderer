/**
 * @File   : Camera.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:24:51
 */
import {mat4, vec3} from 'gl-matrix';
import {buildinGeometries} from '../buildin';
import Material from './Material';
import Mesh from './Mesh';
import Node from './Node';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';

export default class Camera extends Node {
  public static CLASS_NAME: string = 'Node';

  public static IS(value: any): value is Camera {
    return !!(value as Camera).isCamera;
  }

  public isCamera: boolean = true;

  public controlMode: 'free' | 'target' = 'free';
  public target: Node;
  public viewport: { x: number, y: number, w: number, h: number };
  public clearColor: [number, number, number, number];
  public colorOp: GPUStoreOp;
  public clearDepth: number;
  public depthOp: GPUStoreOp;
  public clearStencil: number;
  public stencilOp: GPUStoreOp;
  public drawSkybox: boolean = false;

  protected _skyboxMat: Material;
  protected _skyboxMesh: Mesh;
  protected _near: number;
  protected _far: number;
  protected _fov: number;
  protected _aspect: number;
  protected _sizeX: number;
  protected _sizeY: number;
  protected _isOrth: boolean;
  protected _viewMat: Float32Array;
  protected _projMat: Float32Array;
  protected _projInverseMat: Float32Array;
  protected _vpMat: Float32Array;
  protected _skyVPMat: Float32Array;

  get isOrth() {
    return this._isOrth;
  }

  get skyboxMat() {
    return this._skyboxMat;
  }

  set skyboxMat(value: Material) {
    this._skyboxMat = value;

    if (!this._skyboxMesh) {
      this._skyboxMesh = new Mesh(buildinGeometries.skybox, value);
    } else {
      this._skyboxMesh.material = value;
    }
  }

  get vpMat() {
    return this._vpMat;
  }

  get invViewMat() {
    return this._worldMat;
  }

  get invProjMat() {
    return this._projInverseMat;
  }

  constructor(
    viewOptions: {
      viewport?: { x: number, y: number, w: number, h: number },
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
      isOrth?: boolean,
      sizeX?: number,
      sizeY?: number
    },
    protected _justAsView: boolean = false
  ) {
    super();

    cameraOptions = cameraOptions || {};
    this._near = cameraOptions.near || 0;
    this._far = cameraOptions.far || 1000;
    this._aspect = cameraOptions.aspect || (renderEnv.width / renderEnv.height);

    if (cameraOptions.isOrth) {
      let {sizeX, sizeY} = cameraOptions;

      if (cameraOptions.sizeX > cameraOptions.sizeY) {
        sizeX = sizeY * this._aspect;
      } else {
        sizeY = sizeX / this._aspect;
      }

      this._sizeX = sizeX;
      this._sizeY = sizeY;
      this._isOrth = true;
    } else {
      this._fov = cameraOptions.fov || (Math.PI / 3);
    }

    this.clearColor = viewOptions.clearColor || [0, 0, 0, 1];
    this.clearDepth = viewOptions.clearDepth !== undefined ? viewOptions.clearDepth : 1;
    this.clearStencil = viewOptions.clearStencil || 0;
    this.colorOp = viewOptions.colorOp || 'store';
    this.depthOp = viewOptions.depthOp || 'store';
    this.stencilOp = viewOptions.stencilOp || 'store';
    this.viewport = viewOptions.viewport || { x: 0, y: 0, w: 1, h: 1 };
    this._viewMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._projMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._projInverseMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._vpMat = mat4.identity(new Float32Array(16)) as Float32Array;
    this._skyVPMat = mat4.identity(new Float32Array(16)) as Float32Array;
  }

  public updateMatrix() {
    super.updateMatrix();

    this._updateViewMat();
    this._updateProjMat();
    mat4.multiply(this._vpMat, this._projMat, this._viewMat);

    if (this._skyboxMat) {
      const mat = this._skyVPMat;
      mat.set(this._viewMat);
      const rotation = (this._skyboxMat.getUniform('u_rotation') as Float32Array)[0];
      rotation && mat4.rotateY(mat, mat, -rotation);

      mat[12] = 0;
      mat[13] = 0;
      mat[14] = 0;

      mat4.multiply(mat, this._projMat, mat);
      mat4.invert(mat, mat);
    }

    renderEnv.setUniform('u_vp', this._vpMat);
    renderEnv.setUniform('u_view', this._viewMat);
    renderEnv.setUniform('u_proj', this._projMat);
    renderEnv.setUniform('u_viewInverse', this._worldMat);
    renderEnv.setUniform('u_projInverse', this._projInverseMat);

    if (this._skyboxMat) {
      renderEnv.setUniform('u_skyVP', this._skyVPMat);
      renderEnv.setUniform('u_envTexture', this._skyboxMat.getUniform('u_cubeTexture'));
      renderEnv.setUniform('u_envColor', this._skyboxMat.getUniform('u_color'));
    }
  }

  public render(
    cmd: GPUCommandEncoder,
    rt: RenderTexture,
    meshes: Mesh[],
    clear: boolean = false
  ) {
    const [r, g, b, a] = this.clearColor;
    const { x, y, w, h } = this.viewport;
    const { width, height, colorViews, depthStencilView } = rt;

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: colorViews.map(view => ({
        view,
        loadOp: clear ? 'clear' : 'load' as GPULoadOp,
        storeOp: this.colorOp
      })),
      depthStencilAttachment: depthStencilView && {
        view: depthStencilView,
        depthClearValue: this.clearDepth,
        depthLoadOp: 'clear',
        stencilClearValue: this.clearStencil,
        // stencilLoadOp: clear ? 'clear': "load" as GPULoadOp,
        depthStoreOp: this.depthOp,
        // stencilStoreOp: clear ? this.stencilOp : "discard" as GPUStoreOp
      }
    };

    const pass = cmd.beginRenderPass(renderPassDescriptor);
    pass.setViewport(x * width, y * height, w * width, h * height, 0, 1);
    pass.setBindGroup(0, renderEnv.bindingGroup);

    for (const mesh of meshes) {
      mesh.render(pass, rt);
    }

    if (this.drawSkybox && this._skyboxMesh) {
      this._skyboxMesh.render(pass, rt);
    }

    pass.end();
  }

  public cull(mesh: Mesh): number {
    return 0;
  }

  protected _updateViewMat() {
    const {controlMode, target, _worldMat} = this;

    if (controlMode === 'target' && !target) {
      throw new Error('Camera with control mode "target" must has target!');
    }

    if (controlMode === 'target') {
      const eye = mat4.getTranslation(new Float32Array(3), _worldMat) as Float32Array;
      const center = mat4.getTranslation(new Float32Array(3), target.worldMat) as Float32Array;

      const forward = vec3.sub(new Float32Array(3), center, eye) as Float32Array;
      vec3.normalize(forward, forward);
      const up = this._worldMat.slice(4, 7);
      vec3.normalize(up, up);

      if (vec3.sqrLen(up) === 0) {
        up.set([0, 1, 0]);
      }

      mat4.lookAt(this._viewMat, eye, center, up);
    } else {
      mat4.invert(this._viewMat, this._worldMat);
    }
  }

  protected _updateProjMat() {
    if (this._isOrth) {
      // webgpu has half z
      this._orthHalfZ(this._projMat, -this._sizeX, this._sizeX, -this._sizeY, this._sizeY, this._near, this._far);
    } else {
      mat4.perspective(this._projMat, this._fov, this._aspect, this._near, this._far);
    }
    mat4.invert(this._projInverseMat, this._projMat);
  }

  protected _orthHalfZ(out: Float32Array, left: number, right: number, top: number, bottom: number, near: number, far: number) {
    const w = 1.0 / (right - left);
    const h = 1.0 / (top - bottom);
    const p = 1.0 / (far - near);
  
    const x = (right + left) * w;
    const y = (top + bottom) * h;
    const z = near * p;
  
    out[0] = 2 * w;	out[4] = 0;	out[8] = 0;	out[12] = -x;
    out[1] = 0;	out[5] = 2 * h;	out[9] = 0;	out[13] = -y;
    out[2] = 0;	out[6] = 0;	out[10] = -1 * p;	out[14] = -z;
    out[3] = 0;	out[7] = 0;	out[11] = 0;	out[15] = 1;
  }
}