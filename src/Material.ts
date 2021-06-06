/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import renderEnv from "./renderEnv";
import {createGPUBuffer, TTypedArray} from "./shared";
import Texture from "./Texture";

export enum EUniformType {
  Buffer,
  Sampler,
  Texture
}

export interface IUniformsDescriptor {
  uniforms: {
    name: string,
    type: EUniformType,
    defaultValue: TTypedArray | Texture | GPUSamplerDescriptor
  }[]
}

export default class Material {
  public className: string = 'Material';
  public isMaterial: boolean = true;

  protected _vsShader: GPUShaderModule;
  protected _fsShader: GPUShaderModule;
  protected _uniformLayoutDesc: GPUBindGroupLayoutDescriptor;
  protected _uniformLayout: GPUBindGroupLayout;
  protected _uniformBindDesc: GPUBindGroupDescriptor;
  protected _uniforms: GPUBindGroup;
  protected _uniformIndexes: {[name: string]: {index: number, type: EUniformType}};
  protected _uniformCPUValues: (TTypedArray | Texture | GPUSamplerDescriptor)[];
  protected _uniformValues: (GPUBuffer | GPUSampler | GPUTexture)[];

  get vs() {
    return this._vsShader;
  }

  get fs() {
    return this._fsShader;
  }

  get uniforms() {
    return this._uniforms;
  }

  get uniformLayout() {
    return this._uniformLayout;
  }

  constructor(
    protected _vs: string,
    protected _fs: string,
    protected _uniformDesc: IUniformsDescriptor
  ) {
    const {device} = renderEnv;

    this._vsShader = device.createShaderModule({code: _vs});
    this._fsShader = device.createShaderModule({code: _fs});

    this._uniformIndexes = {};
    this._uniformLayout = device.createBindGroupLayout(this._uniformLayoutDesc = {entries: _uniformDesc.uniforms.map((ud, index) => {
      let res: GPUBindGroupLayoutEntry = {
        binding: index,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      };
      
      if (ud.type === EUniformType.Buffer) {
        res.buffer = {type: 'uniform'};
      } else if (ud.type === EUniformType.Sampler) {
        res.sampler = {type: 'filtering'};
      } else {
        res.texture = {sampleType: 'float'};
      }

      this._uniformIndexes[ud.name] = {index, type: ud.type};

      return res;
    })});

    this._uniformCPUValues = new Array(_uniformDesc.uniforms.length);
    this._uniformValues = new Array(_uniformDesc.uniforms.length);
    this._uniforms = device.createBindGroup(this._uniformBindDesc = {
      layout: this._uniformLayout,
      entries: _uniformDesc.uniforms.map((ud, index) => {
        let value: GPUBuffer | GPUSampler | GPUTexture;
        let resource: GPUBindGroupEntry['resource'];

        if (ud.type === EUniformType.Buffer) {
          value = createGPUBuffer(ud.defaultValue as TTypedArray, GPUBufferUsage.UNIFORM);
          resource = {buffer: value};
        } else if (ud.type === EUniformType.Sampler) {
          value = device.createSampler(ud.defaultValue as GPUSamplerDescriptor);
          resource = value;
        } else {
          value = (ud.defaultValue as Texture).gpuTexture;
          resource = value.createView();
        }

        this._uniformCPUValues[index] = ud.defaultValue;
        this._uniformValues[index] = value;

        return {binding: index, resource};
      })
    });
  }

  public setUniform(name: string, value: TTypedArray | Texture | GPUSamplerDescriptor) {
    const ud = this._uniformIndexes[name];

    if (!ud) {
      return;
    }

    const {index, type} = ud;
    const gpuValue = this._uniformValues[index];

    if (type === EUniformType.Buffer) {
      value = value as TTypedArray;
      renderEnv.device.queue.writeBuffer(
        gpuValue as GPUBuffer,
        0,
        value.buffer,
        value.byteOffset,
        value.byteLength
      );
    } else if (type === EUniformType.Sampler) {
      console.warn('Not implemented!');
    } else {
      console.warn('Not implemented!');
    }
    
    this._uniformCPUValues[index] = value;
  }

  public getUniform(name: string):TTypedArray | Texture | GPUSamplerDescriptor {
    return this._uniformCPUValues[name];
  }
}
