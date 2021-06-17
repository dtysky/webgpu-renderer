/**
 * Effect.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 2021/6/7下午1:51:11
 */
 import {createGPUBuffer, hashCode, TUniformTypedArray} from "./shared";
import renderEnv from "./renderEnv";
import RenderTexture from "./RenderTexture";
import Texture from "./Texture";
import HObject from "./HObject";
import CubeTexture from "./CubeTexture";

export type TUniformValue = TUniformTypedArray | Texture | CubeTexture | GPUSamplerDescriptor | RenderTexture;

export interface IUniformsDescriptor {
  uniforms: {
    name: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4' | 'mat2x2' | 'mat3x3' | 'mat4x4',
    format?: 'f32' | 'u32' | 'i32',
    size?: number,
    defaultValue: TUniformTypedArray
  }[],
  textures: {
    name: string,
    format?: GPUTextureFormat,
    defaultValue: Texture | CubeTexture,
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
  cpuBuffer: Uint32Array;
  gpuBuffer: GPUBuffer;
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
  protected _uniformsBufferDefault: Uint32Array;
  protected _uniformsInfo: {[name: string]: {
    bindingId: number,
    index: number,
    type: 'texture' | 'buffer' | 'sampler',
    defaultValue?: TUniformTypedArray | Texture | GPUSamplerDescriptor,
    defaultGpuValue?: GPUSampler | GPUTextureView,
    /* 32bits */
    offset?: number,
    realLen?: number,
    origLen?: number,
    size?: number
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
    name: string,
    private _options: TEffectOptions
  ) {
    super();

    this.name = name
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

      let uniforms32Length: number = 0;
      _uniformDesc.uniforms.forEach((ud) => {
        const {origLen, realLen, defaultValue} = this._getRealLayoutInfo(ud.type, ud.size || 1, ud.defaultValue);

        this._uniformsInfo[ud.name] = {bindingId: 0, index, type: 'buffer', offset: uniforms32Length, defaultValue, origLen, realLen, size: ud.size || 1};
        uniforms32Length += defaultValue.length;
        const sym = ud.type === 'number' ? `${ud.format || 'f32'}` : `${ud.type}<${ud.format || 'f32'}>`;
        const pre = origLen !== realLen ? `[[stride(${realLen * 4})]]` : '';
        if (!ud.size) {
          this._shaderPrefix += `  [[align(16)]] ${ud.name}: ${sym};\n`;
        } else {
          ud.size > 1 && (this._shaderPrefix += ` [[align(16)]] ${ud.name}: ${pre} array<${sym}, ${ud.size}>;\n`);
        }
        index += 1;
      });
      this._uniformsBufferDefault = new Uint32Array(uniforms32Length);
      this._shaderPrefix += `};\n[[binding(0), group(0)]] var<uniform> uniforms: Uniforms;\n`

      bindingId += 1;
    }

    _uniformDesc.textures.forEach((ud) => {
      const isCube = CubeTexture.IS(ud.defaultValue);
      const isArray = (ud.defaultValue as Texture).isArray;

      entries.push({
        binding: bindingId,
        visibility,
        texture: {
          sampleType: 'float' as GPUTextureSampleType,
          viewDimension: isCube ? (isArray ? 'cube-array' : 'cube') : (isArray ? '2d-array' : '2d')
        }
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'texture',
        defaultGpuValue: (ud.defaultValue as Texture).view
      };
      if (ud.asOutput) {
        this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_storage_2d<${ud.format || 'rgba8unorm'}, write>;\n`
      } else if (isCube) {
        this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_cube<${ud.format || 'f32'}>;\n`
      } else if ((ud.defaultValue as Texture).isArray) {
        this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_2d_array<${ud.format || 'f32'}>;\n`
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
      this._uniformsBufferDefault.set(new Uint32Array(ud.defaultValue.buffer), this._uniformsInfo[ud.name].offset);
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

  protected _getRealLayoutInfo(
    type: "number" | "vec2" | "vec3" | "vec4" | "mat2x2" | "mat3x3" | "mat4x4",
    size: number,
    defaultValue: TUniformTypedArray
  ) {
    let origLen: number;
    let realLen: number;

    switch (type) {
      case 'number':
        origLen = 1;
        realLen = 4;
        break;
      case 'vec2':
        origLen = 2;
        realLen = 4;
        break;
      case 'vec3':
        origLen = 3;
        realLen = 4;
        break;
      case 'vec4':
      case 'mat2x2':
        origLen = 4;
        realLen = 4;
        break;
      case 'mat3x3':
        origLen = 9;
        realLen = 12;
        break;
      case 'mat4x4':
        origLen = 16;
        realLen = 16;
        break;
    }

    const constructor = defaultValue.constructor as any;
    const value = new constructor(realLen * size) as typeof defaultValue;

    for (let index = 0; index < size; index += 1) {
      value.set(defaultValue.slice(index * origLen, (index + 1) * origLen));
    }

    return {
      origLen,
      realLen,
      defaultValue: value
    };
  }

  public createDefaultUniformBlock(): IUniformBlock {
    const {_uniformDesc, _uniformsInfo, _uniformsBufferDefault} = this;
    const values: IUniformBlock['values'] = {};
    const groupEntries: GPUBindGroupEntry[] = []; 

    let cpuBuffer: Uint32Array;
    let gpuBuffer: GPUBuffer;
    if (_uniformsBufferDefault) {
      gpuBuffer = createGPUBuffer(_uniformsBufferDefault, GPUBufferUsage.UNIFORM);
      cpuBuffer = _uniformsBufferDefault.slice();
      groupEntries.push({
        binding: 0,
        resource: {buffer: gpuBuffer}
      });
      _uniformDesc.uniforms.forEach((ud) => {
        const info = this._uniformsInfo[ud.name];
        values[ud.name] = {
          value: new (this._uniformsInfo[ud.name].defaultValue.constructor as typeof Float32Array)(
            cpuBuffer.buffer, info.offset * 4, info.realLen * info.size
          ),
          gpuValue: gpuBuffer
        };
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

    return {entries: groupEntries, values, layout: this._uniformLayout, cpuBuffer, gpuBuffer};
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
