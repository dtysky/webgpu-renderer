/**
 * Effect.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 2021/6/7下午1:51:11
 */
 import {createGPUBuffer, TTypedArray} from "./shared";
import renderEnv from "./renderEnv";
import RenderTexture from "./RenderTexture";
import Texture from "./Texture";
import HObject from "./HObject";

const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

export type TUniformValue = TTypedArray | Texture | GPUSamplerDescriptor | RenderTexture;

export interface IUniformsDescriptor {
  uniforms: {
    name: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4' | 'mat2x2' | 'mat3x3' | 'mat4x4',
    format?: 'f32' | 'u32' | 'u16' | 'u8' | 'i32' | 'i16',
    size?: number,
    defaultValue: TTypedArray
  }[],
  textures: {
    name: string,
    format?: 'f32' | 'u32' | 'u16' | 'u8' | 'i32' | 'i16' | GPUTextureFormat,
    defaultValue: Texture,
    asOutput?: boolean
  }[],
  samplers: {
    name: string,
    defaultValue: GPUSamplerDescriptor
  }[]
}

export interface IUniformBlock {
  layout: GPUBindGroupLayout;
  entries: GPUBindGroupEntry[];
  values: {
    [name: string]: {
      value: TUniformValue,
      gpuValue: GPUBuffer | GPUSampler | GPUTextureView
    }
  };
}

export interface IEffectOptionsRender {
  vs: string;
  fs: string;
  uniformDesc: IUniformsDescriptor;
  marcos?: {[key: string]: number | boolean};
}
export interface IEffectOptionsCompute {
  cs: string;
  uniformDesc: IUniformsDescriptor;
  marcos?: {[key: string]: number | boolean};
}
export type TEffectOptions = IEffectOptionsRender | IEffectOptionsCompute;

function isComputeOptions(value: TEffectOptions): value is IEffectOptionsCompute {
  return !!(value as IEffectOptionsCompute).cs;
}

export default class Effect extends HObject {
  public static CLASS_NAME: string = 'Effect';
  public isEffect: boolean = true;

  protected _marcos?: {[key: string]: number | boolean};
  protected _marcosRegex: {[key: string]: RegExp};
  protected _vs: string;
  protected _fs: string;
  protected _cs: string;
  protected _shaders: {[hash: number]: {
    vs?: GPUShaderModule,
    fs?: GPUShaderModule,
  }} = {};
  protected _uniformDesc: IUniformsDescriptor;
  protected _shaderPrefix: string;
  protected _csShader: GPUShaderModule;
  protected _csPipeline: GPUComputePipeline;
  protected _uniformLayoutDesc: GPUBindGroupLayoutDescriptor;
  protected _uniformLayout: GPUBindGroupLayout;
  protected _uniformBindDesc: GPUBindGroupDescriptor;
  protected _uniformsBufferDefault: Uint8Array;
  protected _uniformsInfo: {[name: string]: {
    bindingId: number,
    index: number,
    type: 'texture' | 'buffer' | 'sampler',
    byteOffset?: number,
    defaultValue?: TTypedArray | Texture | GPUSamplerDescriptor,
    defaultGpuValue?: GPUSampler | GPUTextureView
  }};

  get computePipeline() {
    return this._csPipeline;
  }

  get uniformLayout() {
    return this._uniformLayout;
  }

  get uniformsInfo() {
    return this._uniformsInfo;
  }

  get cs() {
    return this._csShader;
  }

  constructor(
    private _options: TEffectOptions
  ) {
    super();

    const {device} = renderEnv;
    const options = _options;
    const _uniformDesc = this._uniformDesc = options.uniformDesc;
    const visibility = (options as IEffectOptionsCompute).cs ? GPUShaderStage.COMPUTE : GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT;

    this._marcos = options.marcos || {};
    this._marcosRegex = {};
    for (const key in this._marcos) {
      const value = this._marcos[key];
      if (typeof value === 'number') {
        this._marcosRegex[key] = new RegExp(`\$\{${key}\}`, 'g');
      } else {
        this._marcosRegex[key] = new RegExp(`#if defined\\(${key}\\)([\\s\\S]+?)#endif`, 'g');
      }
    }

    let index: number = 0;
    let bindingId: number = 0;
    this._shaderPrefix = '';
    this._uniformsInfo = {};

    const entries: GPUBindGroupLayoutEntry[] = [];
    
    if (_uniformDesc.uniforms.length) {
      this._shaderPrefix += '[[block]] struct Uniforms {\n';
      entries.push({
        binding: 0,
        visibility,
        buffer: {type: 'uniform' as GPUBufferBindingType}
      });

      let uniformsByteLength: number = 0;
      _uniformDesc.uniforms.forEach((ud) => {
        this._uniformsInfo[ud.name] = {bindingId: 0, index, type: 'buffer', byteOffset: uniformsByteLength, defaultValue: ud.defaultValue};
        uniformsByteLength += ud.defaultValue.byteLength;
        const sym = ud.type === 'number' ? `${ud.format || 'f32'}` : `${ud.type}<${ud.format || 'f32'}>`;
        if (!ud.size) {
          this._shaderPrefix += `  ${ud.name}: ${sym};\n`;
        } else {
          ud.size > 1 && (this._shaderPrefix += `  ${ud.name}: array<${sym}, ${ud.size}>;\n`);
        }
        index += 1;
      });
      this._uniformsBufferDefault = new Uint8Array(uniformsByteLength);
      this._shaderPrefix += `};\n[[binding(0), group(0)]] var<uniform> uniforms: Uniforms;\n`

      bindingId += 1;
    }

    _uniformDesc.textures.forEach((ud) => {
      entries.push({
        binding: bindingId,
        visibility,
        texture: {sampleType: 'float' as GPUTextureSampleType}
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'texture',
        defaultGpuValue: (ud.defaultValue as Texture).view
      };
      if (ud.asOutput) {
        this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_storage_2d<${ud.format || 'rgba8unorm'}, write>;\n`
      } else {
        this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_2d<${ud.format || 'f32'}>;\n`
      }
      bindingId += 1;
      index += 1;
    });

    _uniformDesc.samplers.forEach((ud) => {
      entries.push({
        binding: bindingId,
        visibility,
        sampler: {type: 'filtering'}
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'sampler',
        defaultGpuValue: device.createSampler(ud.defaultValue as GPUSamplerDescriptor)
      };
      this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: sampler;\n`
      bindingId += 1;
      index += 1;
    });
    this._shaderPrefix += '\n';

    _uniformDesc.uniforms.forEach((ud, index) => {
      this._uniformsBufferDefault.set(new Uint8Array(ud.defaultValue.buffer), this._uniformsInfo[ud.name].byteOffset);
    });

    this._uniformLayoutDesc = {entries};

    if (isComputeOptions(options)) {
      this._cs = options.cs
      this._csShader = device.createShaderModule({code: this._shaderPrefix + this._cs});
      this._csPipeline = device.createComputePipeline({
        compute: {
          module: this._csShader,
          entryPoint: 'main'
        }
      });
      this._uniformLayout = this._csPipeline.getBindGroupLayout(0);
    } else {
      this._vs = options.vs;
      this._fs = options.fs;
      this._uniformLayout = device.createBindGroupLayout(this._uniformLayoutDesc);
    }
  }

  public createDefaultUniformBlock(): IUniformBlock {
    const {_uniformDesc, _uniformsInfo, _uniformsBufferDefault} = this;
    const values: IUniformBlock['values'] = {};
    const groupEntries: GPUBindGroupEntry[] = [];

    if (_uniformsBufferDefault) {
      const uniformsBuffer = createGPUBuffer(_uniformsBufferDefault, GPUBufferUsage.UNIFORM);
      groupEntries.push({
        binding: 0,
        resource: {buffer: uniformsBuffer}
      });
      _uniformDesc.uniforms.forEach((ud) => {
        values[ud.name] = {value: ud.defaultValue, gpuValue: uniformsBuffer};
      });
    }

    _uniformDesc.textures.forEach((ud) => {
      const view = _uniformsInfo[ud.name].defaultGpuValue;
      values[ud.name] = {value: ud.defaultValue, gpuValue: view};
      groupEntries.push({
        binding: _uniformsInfo[ud.name].bindingId,
        resource: view
      });
    });
    _uniformDesc.samplers.forEach((ud) => {
      const sampler = _uniformsInfo[ud.name].defaultGpuValue;
      values[ud.name] = {value: ud.defaultValue, gpuValue: sampler};
      groupEntries.push({
        binding: _uniformsInfo[ud.name].bindingId,
        resource: sampler
      });
    });

    return {entries: groupEntries, values, layout: this._uniformLayout};
  }

  public getShader(
    marcos: {[key: string]: number | boolean},
    attributesDef: string
  ) {
    marcos = Object.assign({}, this._marcos, marcos);
    const {device} = renderEnv;
    const hash = this._calcHash(attributesDef, marcos);
    const shaders = this._shaders[hash];

    if (shaders) {
      return shaders;
    }

    const tmp = [this._vs, this._fs];

    for (const key in this._marcos) {
      const value = marcos[key];
      const regex = this._marcosRegex[key];

      tmp.forEach((s, i) => {
        if (!s) {
          return;
        }

        if (typeof value === 'number') {
          tmp[i] = s.replace(regex, `${value}`);
        } else if (!value) {
          tmp[i] = s.replace(regex, '');
        } else {
          tmp[i] = s.replace(regex, '$1');
        }
      });
    }

    const [vs, fs] = tmp;
    const res = this._shaders[hash] = {
      vs: vs && device.createShaderModule({code: attributesDef + this._shaderPrefix + vs}),
      fs: fs && device.createShaderModule({code: this._shaderPrefix + fs})
    };

    return res;
  }

  private _calcHash(def: string, marcos: {[key: string]: number | boolean}): number {
    let hash: number = hashCode(def);

    for (const key in this._marcos) {
      const value = marcos[key];
      const hashValue = typeof value === 'number' ? value : (value ? 1 : 0);
      hash = (hash << 5) - hash + hashValue;
    }

    return hash;
  }
}
