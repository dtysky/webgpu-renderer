/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import HObject from "./HObject";
import Effect, { IRenderStates, IUniformBlock, TUniformValue } from "./Effect";
import renderEnv from "./renderEnv";
import {createGPUBuffer, TUniformTypedArray} from "./shared";
import RenderTexture from "./RenderTexture";
import Texture from "./Texture";

export default class Material extends HObject {
  public static  CLASS_NAME: string = 'Material';
  public isMaterial: boolean = true;

  protected _version: number = 0;
  protected _isBufferDirty: boolean = false;
  protected _isDirty: boolean = false;
  protected _uniformBlock: IUniformBlock;
  protected _bindingGroup: GPUBindGroup;
  protected _marcos: {[key: string]: number | boolean};
  protected _renderStates: IRenderStates;

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
    if (this._isBufferDirty) {
      renderEnv.device.queue.writeBuffer(
        this._uniformBlock.gpuBuffer as GPUBuffer,
        0,
        this._uniformBlock.cpuBuffer
      );

      this._isBufferDirty = true;
    }

    if (this._isDirty) {
      this._bindingGroup = renderEnv.device.createBindGroup({
        layout: this._uniformBlock.layout,
        entries: this._uniformBlock.entries
      });
      this._isDirty = false;
    }

    return this._bindingGroup;
  }

  get primitiveType() {
    return this._renderStates.primitiveType || this._effect.renderStates.primitiveType;
  }

  get cullMode() {
    return this._renderStates.cullMode || this._effect.renderStates.cullMode;
  }

  constructor(
    protected _effect: Effect,
    values?: {[name: string]: TUniformValue},
    marcos?: {[key: string]: number | boolean},
    renderStates?: IRenderStates
  ) {
    super();

    this._uniformBlock = _effect.createDefaultUniformBlock();

    if (values) {
      Object.keys(values).forEach(name => this.setUniform(name, values[name]));
    }

    this._marcos = marcos || {};
    this._renderStates = renderStates || {};

    this._bindingGroup = renderEnv.device.createBindGroup({
      layout: this._uniformBlock.layout,
      entries: this._uniformBlock.entries
    });
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    const info = this._effect.uniformsInfo[name];

    if (!info || !value) {
      return;
    }

    const {entries} = this._uniformBlock;
    const {bindingId, type, offset, realLen, origLen} = info;
    const values = this._uniformBlock.values[name];

    if (type === 'buffer') {
      value = value as TUniformTypedArray;
      const cpuValue = values.value as TUniformTypedArray;
      if (origLen !== realLen) {
        const size = value.length / origLen;

        for (let index = 0; index < size; index += 1) {
          cpuValue.set(
            new (value.constructor as typeof Uint32Array)(value.buffer, origLen * index * 4, origLen),
            realLen * index
          );
        }
      } else {
        cpuValue.set(value);
      }
      this._isBufferDirty = true;
    } else if (type === 'sampler') {
      values.value = value;
      console.warn('Not implemented!');
    } else if (type === 'storage') {
      values.value = value;
      (entries[bindingId].resource as {buffer: GPUBuffer}).buffer = values.gpuValue = rtSubNameOrGPUBuffer
        ? rtSubNameOrGPUBuffer as GPUBuffer
        : createGPUBuffer(value as TUniformTypedArray, GPUBufferUsage.STORAGE);
      this._isDirty = true;
    } else if (RenderTexture.IS(value)) {
      const view = rtSubNameOrGPUBuffer ? value.getColorViewByName(rtSubNameOrGPUBuffer as string): value.colorView;

      entries[bindingId].resource = values.gpuValue = view;
      values.value = value;
      this._isDirty = true;
      return;
    } else  {
      value = value as Texture;
      if (value.isArray !== (values.value as Texture).isArray) {
        throw new Error('Require texture2d array!');
      }

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
