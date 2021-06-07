/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import { RenderTexture } from "..";
import Effect, { IUniformBlock, TUniformValue } from "./Effect";
import renderEnv from "./renderEnv";
import {TTypedArray} from "./shared";
import Texture from "./Texture";

export default class Material {
  public className: string = 'Material';
  public isMaterial: boolean = true;

  protected _isDirty: boolean = false;
  protected _uniformBlock: IUniformBlock;
  protected _bindingGroup: GPUBindGroup;

  get effect() {
    return this._effect;
  }

  get bindingGroup() {
    if (this._isDirty) {
      this._bindingGroup = renderEnv.device.createBindGroup({
        layout: this._uniformBlock.layout,
        entries: this._uniformBlock.entries
      });
    }

    return this._bindingGroup;
  }

  constructor(
    protected _effect: Effect,
    values?: {
      [name: string]: TUniformValue
    }
  ) {
    this._uniformBlock = _effect.createDefaultUniformBlock();

    if (values) {
      Object.keys(values).forEach(name => this.setUniform(name, values[name]));
    }

    this._bindingGroup = renderEnv.device.createBindGroup({
      layout: this._uniformBlock.layout,
      entries: this._uniformBlock.entries
    });
  }

  public setUniform(
    name: string,
    value: TUniformValue
  ) {
    const info = this._effect.uniformsInfo[name];

    if (!info) {
      return;
    }

    const {entries} = this._uniformBlock;
    const {index, type, byteOffset} = info;
    const values = this._uniformBlock.values[name];

    if (type === 'buffer') {
      value = value as TTypedArray;
      renderEnv.device.queue.writeBuffer(
        values.gpuValue as GPUBuffer,
        byteOffset,
        value.buffer,
        value.byteOffset,
        value.byteLength
      );
    } else if (type === 'sampler') {
      console.warn('Not implemented!');
    } else if (RenderTexture.IS(value)) {
      entries[index].resource = values.gpuValue = value.colorView;
      this._isDirty = true;
    } else {
      value = value as Texture;
      entries[index].resource = values.gpuValue = value.view;
      this._isDirty = true;
      return;
    }

    values.value = value;
  }

  public getUniform(name: string): TUniformValue {
    return this._uniformBlock.values[name]?.value;
  }
}
