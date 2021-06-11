/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import HObject from "./HObject";
import Effect, { IUniformBlock, TUniformValue } from "./Effect";
import renderEnv from "./renderEnv";
import {TTypedArray, TUniformTypedArray} from "./shared";
import RenderTexture from "./RenderTexture";
import Texture from "./Texture";

export default class Material extends HObject {
  public static  CLASS_NAME: string = 'Material';
  public isMaterial: boolean = true;
  
  protected _version: number = 0;
  protected _isDirty: boolean = false;
  protected _uniformBlock: IUniformBlock;
  protected _bindingGroup: GPUBindGroup;
  protected _marcos: {[key: string]: number | boolean};

  get effect() {
    return this._effect;
  }

  get marcos() {
    return this._marcos;
  }

  get version() {
    return this._version;
  }

  get bindingGroup() {
    if (this._isDirty) {
      this._bindingGroup = renderEnv.device.createBindGroup({
        layout: this._uniformBlock.layout,
        entries: this._uniformBlock.entries
      });
      this._isDirty = false;
    }

    return this._bindingGroup;
  }

  constructor(
    protected _effect: Effect,
    values?: {[name: string]: TUniformValue},
    marcos?: {[key: string]: number | boolean}
  ) {
    super();

    this._uniformBlock = _effect.createDefaultUniformBlock();

    if (values) {
      Object.keys(values).forEach(name => this.setUniform(name, values[name]));
    }

    this._marcos = marcos || {};

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

    if (!info || value === undefined) {
      return;
    }

    const {entries} = this._uniformBlock;
    const {bindingId, type, offset, realLen, origLen} = info;
    const values = this._uniformBlock.values[name];

    if (type === 'buffer') {
      value = value as TUniformTypedArray;
      const cpuValue = values.value as TUniformTypedArray;
      if (origLen !== realLen) {
        const size = value.length / realLen;

        for (let index = 0; index < size; index += 1) {
          cpuValue.set(
            new (value.constructor as typeof Uint32Array)(value.buffer, origLen * index, origLen * (index + 1)),
            realLen * index
          );
        }
      }

      renderEnv.device.queue.writeBuffer(
        values.gpuValue as GPUBuffer,
        offset * 4,
        cpuValue,
        cpuValue.byteOffset,
        cpuValue.length
      );
    } else if (type === 'sampler') {
      values.value = value;
      console.warn('Not implemented!');
    } else if (RenderTexture.IS(value)) {
      entries[bindingId].resource = values.gpuValue = value.colorView;
      values.value = value;
      this._isDirty = true;
    } else {
      value = value as Texture;
      entries[bindingId].resource = values.gpuValue = value.view;
      values.value = value;
      this._isDirty = true;
      return;
    }

  }

  public getUniform(name: string): TUniformValue {
    return this._uniformBlock.values[name]?.value;
  }

  public setMarcos(marcos: {[key: string]: number | boolean}) {
    Object.assign(this._marcos, marcos);
    this._version += 1;
  }
}
