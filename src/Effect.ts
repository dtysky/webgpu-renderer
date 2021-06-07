/**
 * Effect.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 2021/6/7下午1:51:11
*/
import renderEnv from "./renderEnv";
import {createGPUBuffer, TTypedArray} from "./shared";
import Texture from "./Texture";

export interface IUniformsDescriptor {
  uniforms: {
    name: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4' | 'mat2x2' | 'mat3x3' | 'mat4x4',
    format?: 'f32' | 'u32' | 'u16' | 'u8' | 'i32' | 'i16',
    defaultValue: TTypedArray
  }[],
  textures: {
    name: string,
    format?: 'f32' | 'u32' | 'u16' | 'u8' | 'i32' | 'i16',
    defaultValue: Texture
  }[],
  samplers: {
    name: string,
    defaultValue: GPUSamplerDescriptor
  }[]
}

export interface IUniformBlock {
  bindingGroup: GPUBindGroup;
  values: {
    [name: string]: {
      value: TTypedArray | Texture | GPUSamplerDescriptor,
      gpuValue: GPUBuffer | GPUSampler | GPUTextureView
    }
  };
}

export default class Effect {
  public className: string = 'Effect';
  public isEffect: boolean = true;

  protected _shaderPrefix: string;
  protected _vsShader: GPUShaderModule;
  protected _fsShader: GPUShaderModule;
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

  get vs() {
    return this._vsShader;
  }

  get fs() {
    return this._fsShader;
  }

  get uniformLayout() {
    return this._uniformLayout;
  }

  get uniformsInfo() {
    return this._uniformsInfo;
  }

  constructor(
    protected _vs: string,
    protected _fs: string,
    protected _uniformDesc: IUniformsDescriptor
  ) {
    const {device} = renderEnv;

    this._shaderPrefix = '[[block]] struct Uniforms {\n';
    this._uniformsInfo = {};

    const entries: GPUBindGroupLayoutEntry[] = [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: {type: 'uniform' as GPUBufferBindingType}
    }];

    let uniformsByteLength: number = 0;
    _uniformDesc.uniforms.forEach((ud, index) => {
      this._uniformsInfo[ud.name] = {bindingId: 0, index, type: 'buffer', byteOffset: uniformsByteLength, defaultValue: ud.defaultValue};
      uniformsByteLength += ud.defaultValue.byteLength;
      this._shaderPrefix += `  ${ud.name}: ${ud.type}<${ud.format || 'f32'}>;\n`
    });
    this._uniformsBufferDefault = new Uint8Array(uniformsByteLength);
    this._shaderPrefix += `};\n[[binding(0), group(0)]] var<uniform> uniforms: Uniforms;\n`

    let bindingId = 1;
    _uniformDesc.textures.forEach((ud, index) => {
      entries.push({
        binding: bindingId,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        texture: {sampleType: 'float' as GPUTextureSampleType}
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'texture',
        defaultGpuValue: (ud.defaultValue as Texture).view
      };
      this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: texture_2d<${ud.format || 'f32'}>;\n`
      bindingId += 1;
    });

    _uniformDesc.samplers.forEach((ud, index) => {
      entries.push({
        binding: bindingId,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        sampler: {type: 'filtering'}
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'sampler',
        defaultGpuValue: device.createSampler(ud.defaultValue as GPUSamplerDescriptor)
      };
      this._shaderPrefix += `[[group(0), binding(${bindingId})]] var ${ud.name}: sampler;\n`
      bindingId += 1;
    });
    this._uniformLayoutDesc = {entries};
    this._uniformLayout = device.createBindGroupLayout(this._uniformLayoutDesc);
    this._shaderPrefix += '\n';

    _uniformDesc.uniforms.forEach((ud, index) => {
      this._uniformsBufferDefault.set(new Uint8Array(ud.defaultValue.buffer), this._uniformsInfo[ud.name].byteOffset);
    });

    this._vsShader = device.createShaderModule({code: this._shaderPrefix + _vs});
    this._fsShader = device.createShaderModule({code: this._shaderPrefix + _fs});
  }

  public createDefaultUniformBlock(): IUniformBlock {
    const {_uniformDesc, _uniformsInfo, _uniformsBufferDefault} = this;
    const values: IUniformBlock['values'] = {};

    const uniformsBuffer = createGPUBuffer(_uniformsBufferDefault, GPUBufferUsage.UNIFORM);
    const groupEntries: GPUBindGroupEntry[] = [{
      binding: 0,
      resource: {buffer: uniformsBuffer}
    }];
    _uniformDesc.uniforms.forEach((ud) => {
      values[ud.name] = {value: ud.defaultValue, gpuValue: uniformsBuffer};
    });
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
    const bindingGroup = renderEnv.device.createBindGroup({
      layout: this._uniformLayout,
      entries: groupEntries
    });

    return {bindingGroup, values};
  }
}
