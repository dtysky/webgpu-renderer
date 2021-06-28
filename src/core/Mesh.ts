/**
 * @File   : Mesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:05
 */
import Node from './Node';
import Geometry from './Geometry';
import Material from './Material';
import renderEnv from './renderEnv';
import RenderTexture from './RenderTexture';
import Light from './Light';
import UBTemplate, { IUniformBlock, TUniformValue } from './UBTemplate';
import { buildinUBTemplates } from '../buildin';

declare type Camera = import('./Camera').default;

export default class Mesh extends Node {
  public static  CLASS_NAME: string = 'Mesh';

  public static IS(value: any): value is Mesh{
    return !!(value as Mesh).isMesh;
  }

  public isMesh: boolean = true;
  public sortZ: number = 0;

  protected _pipelines: {[hash: number]: GPURenderPipeline} = {};
  protected _matVersion: number = -1;
  protected _ubTemplate: UBTemplate;
  protected _uniformBlock: IUniformBlock;
  protected _bindingGroup: GPUBindGroup;

  get geometry() {
    return this._geometry;
  }

  get material() {
    return this._material;
  }

  set material(value: Material) {
    this._material = value;
    this._pipelines = {};
  }

  constructor(
    protected _geometry: Geometry,
    protected _material: Material
  ) {
    super();

    this._ubTemplate = buildinUBTemplates.staticMesh;
    this._uniformBlock = this._ubTemplate.createUniformBlock();
  }

  public clone(): Mesh {
    const mesh = new Mesh(this._geometry, this._material);
    mesh.pos.set(this.pos);
    mesh.quat.set(this.quat);
    mesh.scale.set(this.scale);

    return mesh;
  }

  public render(
    pass: GPURenderPassEncoder,
    rt: RenderTexture
  ) {
    const {_geometry, _material} = this;

    if (_material.version !== this._matVersion || !this._pipelines[rt.pipelineHash]) {
      this._createPipeline(rt);
      this._matVersion = _material.version;
    }

    this.setUniform('u_world', this._worldMat);
    this._bindingGroup = this._ubTemplate.getBindingGroup(this._uniformBlock, this._bindingGroup);

    _geometry.vertexes.forEach((vertex, index) => {
      pass.setVertexBuffer(index, vertex);
    });
    pass.setIndexBuffer(_geometry.indexes, _geometry.indexFormat);
    pass.setBindGroup(1, _material.bindingGroup);
    pass.setBindGroup(2, this._bindingGroup);
    pass.setPipeline(this._pipelines[rt.pipelineHash]);
    pass.drawIndexed(_geometry.count, 1, 0, 0, 0);
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    this._ubTemplate.setUniform(this._uniformBlock, name, value, rtSubNameOrGPUBuffer);
  }

  public getUniform(name: string): TUniformValue {
    return this._ubTemplate.getUniform(this._uniformBlock, name);
  }

  protected _createPipeline(rt: RenderTexture) {
    const {device} = renderEnv;
    const {_geometry, _material, _ubTemplate} = this;
    
    this._bindingGroup = this._ubTemplate.getBindingGroup(this._uniformBlock, this._bindingGroup);
    const marcos = Object.assign({}, _geometry.marcos, _material.marcos);
    const {vs, fs} = _material.effect.getShader(marcos, _geometry.attributesDef, renderEnv.shaderPrefix, _ubTemplate.shaderPrefix);

    this._pipelines[rt.pipelineHash] = device.createRenderPipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: [
        renderEnv.uniformLayout,
        _material.effect.uniformLayout,
        _ubTemplate.uniformLayout
      ]}),
  
      vertex: {
        module: vs,
        entryPoint: "main",
        buffers: _geometry.vertexLayouts
      },
  
      fragment: {
        module: fs,
        targets: rt.colorFormats.map(format => ({
          format,
          blend: _material.blendColor ? {
            color: _material.blendColor,
            alpha: _material.blendAlpha
          } : undefined
        })),
        entryPoint: "main"
      },
  
      primitive: {
        topology: _material.primitiveType,
        cullMode: _material.cullMode
      },

      depthStencil: rt.depthStencilFormat && {
        format: rt.depthStencilFormat,
        depthWriteEnabled: true,
        depthCompare: _material.depthCompare
      }
    });
  }
}
