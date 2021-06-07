/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import Effect, { IUniformBlock } from "./Effect";
import renderEnv from "./renderEnv";
import {TTypedArray} from "./shared";
import Texture from "./Texture";

export default class Material {
  public className: string = 'Material';
  public isMaterial: boolean = true;

  protected _uniformBlock: IUniformBlock;

  get effect() {
    return this._effect;
  }

  get bindingGroup() {
    return this._uniformBlock.bindingGroup;
  }

  constructor(
    protected _effect: Effect
  ) {
    this._uniformBlock = _effect.createDefaultUniformBlock();
  }

  public setUniform(name: string, value: TTypedArray | Texture | GPUSamplerDescriptor) {
    const info = this._effect.uniformsInfo[name];

    if (!info) {
      return;
    }

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
      values.value = value;
    } else if (type === 'sampler') {
      console.warn('Not implemented!');
    } else {
      value = value as Texture;
      console.warn('Not implemented!');
    }
  
  }

  public getUniform(name: string):TTypedArray | Texture | GPUSamplerDescriptor {
    return this._uniformBlock.values[name]?.value;
  }
}
