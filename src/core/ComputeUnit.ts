/**
 * @File   : ComputeUnit.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */

import HObject from "./HObject";
import Effect, { TUniformValue } from "./Effect";
import Material from "./Material";

export default class ComputeUnit extends HObject {
  public static CLASS_NAME = 'ComputeUnit';
  public isComputeUnite: boolean = true;

  protected _material: Material;

  get groups() {
    return this._groups;
  }

  constructor(
    protected _effect: Effect,
    protected _groups: {x: number, y?: number, z?: number},
    values?: {[name: string]: TUniformValue}
  ) {
    super();

    if (!_effect.cs) {
      throw new Error('ComputeUnit can only receive effect has compute shader!');
    }

    this._material = new Material(_effect, values);
  }

  public compute(pass: GPUComputePassEncoder) {
    const {_material, _groups} = this;

    pass.setPipeline(_material.effect.computePipeline);
    pass.setBindGroup(0, _material.bindingGroup);
    pass.dispatch(_groups.x, _groups.y, _groups.z);
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    this._material.setUniform(name, value, rtSubNameOrGPUBuffer);
  }

  public setGroups(x: number, y?: number, z?: number) {
    this._groups = {x, y, z};
  }
}
