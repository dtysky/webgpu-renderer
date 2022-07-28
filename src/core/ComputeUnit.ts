/**
 * @File   : ComputeUnit.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */

import HObject from "./HObject";
import Effect from "./Effect";
import Material from "./Material";
import renderEnv from "./renderEnv";
import { TUniformValue } from "./UBTemplate";

export default class ComputeUnit extends HObject {
  public static CLASS_NAME = 'ComputeUnit';
  public isComputeUnite: boolean = true;

  protected _material: Material;
  protected _matVersion: number = -1;
  protected _pipeline: GPUComputePipeline;

  get groups() {
    return this._groups;
  }

  constructor(
    protected _effect: Effect,
    protected _groups: {x: number, y?: number, z?: number},
    values?: {[name: string]: TUniformValue},
    marcos?: {[name: string]: number | boolean}
  ) {
    super();

    if (!_effect.isCompute) {
      throw new Error('ComputeUnit can only receive effect has compute shader!');
    }

    this._material = new Material(_effect, values, marcos);
  }

  public compute(pass: GPUComputePassEncoder) {
    const {_material, _groups} = this;

    if (_material.version !== this._matVersion) {
      this._createPipeline();
      this._matVersion = _material.version;
    }

    pass.setPipeline(this._pipeline);
    pass.setBindGroup(1, _material.bindingGroup);
    pass.dispatchWorkgroups(_groups.x, _groups.y, _groups.z);
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    this._material.setUniform(name, value, rtSubNameOrGPUBuffer);
  }

  public getUniform(name: string): TUniformValue {
    return this._material.getUniform(name);
  }

  public setGroups(x: number, y?: number, z?: number) {
    this._groups = {x, y, z};
  }

  protected _createPipeline() {
    const {device} = renderEnv;
    const {_material} = this;
    
    const marcos = Object.assign({}, _material.marcos);
    const {cs} = _material.effect.getShader(marcos, '', renderEnv.shaderPrefix, '');

    this._pipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: [
        renderEnv.uniformLayout,
        _material.effect.uniformLayout
      ]}),
  
      compute: {
        module: cs,
        entryPoint: "main"
      }
    });
  }
}
