/**
 * @File   : UBTemplate.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date    : 6/24/2021, 23:00:55 PM
*/
import {createGPUBuffer, hashCode, TTypedArray, TUniformTypedArray} from "./shared";
import renderEnv from "./renderEnv";
import RenderTexture from "./RenderTexture";
import Texture from "./Texture";
import HObject from "./HObject";
import CubeTexture from "./CubeTexture";

export enum EUBGroup {
  Global = 0,
  Material = 1,
  Mesh = 2
}

export type TUniformValue = TUniformTypedArray | Texture | CubeTexture | GPUSamplerDescriptor | RenderTexture;

export interface IUniformsDescriptor {
  uniforms: {
    name: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4' | 'mat2x2' | 'mat3x3' | 'mat4x4',
    format?: 'f32' | 'u32' | 'i32',
    size?: number,
    customType?: {name: string, code: string, len: number},
    defaultValue: TUniformTypedArray
  }[],
  textures?: {
    name: string,
    format?: GPUTextureSampleType,
    defaultValue: Texture | CubeTexture,
    storageAccess?: GPUStorageTextureAccess,
    storageFormat?: GPUTextureFormat
  }[],
  samplers?: {
    name: string,
    defaultValue: GPUSamplerDescriptor
  }[],
  storages?: {
    name: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4',
    format?: 'f32' | 'u32' | 'i32',
    customStruct?: {name: string, code: string},
    writable?: boolean,
    defaultValue: TUniformTypedArray,
    gpuValue?: GPUBuffer
  }[]
}

export interface IUniformBlock {
  isBufferDirty: boolean;
  isDirty: boolean;
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

export default class UBTemplate extends HObject {
  public static CLASS_NAME: string = 'UBTemplate';
  public isUBTemplate: boolean = true;

  protected _shaderPrefix: string;
  protected _uniformLayoutDesc: GPUBindGroupLayoutDescriptor;
  protected _uniformLayout: GPUBindGroupLayout;
  protected _uniformBindDesc: GPUBindGroupDescriptor;
  protected _uniformsBufferDefault: Uint32Array;
  protected _uniformsInfo: {[name: string]: {
    bindingId: number,
    index: number,
    type: 'texture' | 'buffer' | 'sampler' | 'storage',
    defaultValue?: TUniformTypedArray | Texture | GPUSamplerDescriptor,
    defaultGpuValue?: GPUSampler | GPUTextureView | GPUBuffer,
    /* 32bits */
    offset?: number,
    realLen?: number,
    origLen?: number,
    size?: number
  }};

  get groupId() {
    return this._groupId;
  }

  get shaderPrefix() {
    return this._shaderPrefix;
  }

  get uniformLayout() {
    return this._uniformLayout;
  }

  get uniformsInfo() {
    return this._uniformsInfo;
  }

  constructor(
    protected _uniformDesc: IUniformsDescriptor,
    protected _groupId: EUBGroup,
    protected _visibility?: number,
  ) {
    super();

    const {device} = renderEnv;
    const visibility = _visibility === undefined ? GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT : _visibility;
    const ubStruct = _groupId === EUBGroup.Global ? 'UniformsGlobal' : _groupId === EUBGroup.Mesh ? 'UniformsObject' : 'UniformsMaterial';
    const ubName = _groupId === EUBGroup.Global ? 'global' : _groupId === EUBGroup.Mesh ? 'mesh' : 'material';

    let index: number = 0;
    let bindingId: number = 0;
    this._shaderPrefix = '';
    this._uniformsInfo = {};

    const entries: GPUBindGroupLayoutEntry[] = [];
    
    if (_uniformDesc.uniforms.length) {
      _uniformDesc.uniforms.forEach((ud) => {
        if (ud.customType) {
          this._shaderPrefix += ud.customType.code + '\n';    
        }
      });

      this._shaderPrefix += `struct ${ubStruct} {\n`;
      entries.push({
        binding: 0,
        visibility,
        buffer: {type: 'uniform' as GPUBufferBindingType}
      });

      let uniforms32Length: number = 0;
      _uniformDesc.uniforms.forEach((ud) => {
        const {origLen, realLen, defaultValue} = this._getRealLayoutInfo(ud.type, ud.size || 1, ud.defaultValue, ud.customType);

        this._uniformsInfo[ud.name] = {bindingId: 0, index, type: 'buffer', offset: uniforms32Length, defaultValue, origLen, realLen, size: ud.size || 1};
        uniforms32Length += defaultValue.length;
        const sym = ud.customType ? ud.customType.name : ud.type === 'number' ? `${ud.format || 'f32'}` : `${ud.type}<${ud.format || 'f32'}>`;
        const pre = origLen !== realLen ? `@stride(${realLen * 4})` : '';
        if (!ud.size) {
          this._shaderPrefix += `  @align(16) ${ud.name}: ${sym},\n`;
        } else {
          ud.size > 1 && (this._shaderPrefix += ` @align(16) ${ud.name}: ${pre} array<${sym}, ${ud.size}>,\n`);
        }
        index += 1;
      });
      this._uniformsBufferDefault = new Uint32Array(uniforms32Length);
      this._shaderPrefix += `};\n@group(${_groupId}) @binding(0) var<uniform> ${ubName}: ${ubStruct};\n`

      bindingId += 1;
    }

    _uniformDesc.textures && _uniformDesc.textures.forEach((ud) => {
      const isCube = CubeTexture.IS(ud.defaultValue);
      const isArray = (ud.defaultValue as Texture).isArray;
      const viewDimension = isCube ? (isArray ? 'cube-array' : 'cube') : (isArray ? '2d-array' : '2d');

      // read-only storage texture is not supported anymore
      if (ud.storageAccess === 'read-only') {
        ud.storageAccess = undefined;
        ud.format = /uint/.test(ud.storageFormat) ?  'uint' : /sint/.test(ud.storageFormat) ? 'sint' : 'float';
      }

      entries.push({
        binding: bindingId,
        visibility,
        texture: !ud.storageAccess ? {
          sampleType: ud.format || 'float',
          viewDimension
        } : undefined,
        storageTexture: ud.storageAccess === 'write-only' ? Object.assign({
          format: ud.storageFormat || 'rgba8unorm',
          viewDimension,
          access: ud.storageAccess
        }) : undefined
      });

      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'texture',
        defaultGpuValue: (ud.defaultValue as Texture).view
      };

      let texFormat: string = ud.format === 'depth' ? 'depth' : ud.format === 'uint' ? 'u32' : ud.format === 'sint' ? 'i32' : 'f32';

      if (ud.storageAccess) {
        this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var ${ud.name}: texture_storage_2d<${ud.storageFormat || 'rgba8unorm'}, ${ud.storageAccess.replace('-only', '')}>;\n`
      } else if (isCube) {
        this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var ${ud.name}: texture_cube<${texFormat}>;\n`
      } else if ((ud.defaultValue as Texture).isArray) {
        this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var ${ud.name}: texture_2d_array<${texFormat}>;\n`
      } else {
        this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var ${ud.name}: texture_2d<${texFormat}>;\n`
      }
      bindingId += 1;
      index += 1;
    });

    _uniformDesc.samplers && _uniformDesc.samplers.forEach((ud) => {
      entries.push({
        binding: bindingId,
        visibility,
        sampler: {type: 'filtering'}
      });
      this._uniformsInfo[ud.name] = {
        bindingId, index, type: 'sampler',
        defaultGpuValue: device.createSampler(ud.defaultValue as GPUSamplerDescriptor)
      };
      this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var ${ud.name}: sampler;\n`
      bindingId += 1;
      index += 1;
    });
    this._shaderPrefix += '\n';

    _uniformDesc.uniforms.forEach((ud, index) => {
      const info = this._uniformsInfo[ud.name];
      this._uniformsBufferDefault.set(new Uint32Array((info.defaultValue as TUniformTypedArray).buffer), info.offset);
    });

    if (_uniformDesc.storages) {
      const structCache: {[hash: string]: string} = {};

      _uniformDesc.storages.forEach((ud) => {
        entries.push({
          binding: bindingId,
          visibility,
          buffer: {type: ud.writable ? 'storage' : 'read-only-storage' as GPUBufferBindingType}
        });

        let hash = `Storage${ud.type}${ud.format || 'f32'}`;
        if (!ud.customStruct && !structCache[hash]) {
          this._shaderPrefix += (structCache[hash] = structCache[hash] || this._getStorageStruct(hash, ud.type, ud.format || 'f32')) + '\n';
        }
        if (ud.customStruct) {
          hash = ud.customStruct.name;
          this._shaderPrefix += ud.customStruct.code;
        }
        const gpuValue = ud.gpuValue ? ud.gpuValue : createGPUBuffer(ud.defaultValue, GPUBufferUsage.STORAGE);
        this._uniformsInfo[ud.name] = {bindingId, index, type: 'storage', defaultValue: ud.defaultValue, defaultGpuValue: gpuValue};
        this._shaderPrefix += `@group(${_groupId}) @binding(${bindingId}) var<storage, ${ud.writable ? 'read_write' : 'read'}> ${ud.name}: ${hash};\n`

        index += 1;
        bindingId += 1;
      });
    }

    this._uniformLayoutDesc = {entries};
    this._uniformLayout = device.createBindGroupLayout(this._uniformLayoutDesc);
  }

  protected _getRealLayoutInfo(
    type: "number" | "vec2" | "vec3" | "vec4" | "mat2x2" | "mat3x3" | "mat4x4" | 'custom',
    size: number,
    defaultValue: TUniformTypedArray,
    custom?: {name: string, len: number}
  ) {
    if (custom) {
      return {origLen: custom.len, realLen: custom.len, defaultValue};
    }

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
      value.set(defaultValue.slice(index * origLen, (index + 1) * origLen), index * realLen);
    }

    return {
      origLen,
      realLen,
      defaultValue: value
    };
  }

  protected _getStorageStruct(
    hash: string,
    type: 'number' | 'vec2' | 'vec3' | 'vec4',
    format: 'f32' | 'u32' | 'i32'
  ) {
    if (type === 'number') {
      return `struct ${hash} { value: array<${format}>; };`
    }

    if (type === 'vec2' || type === 'vec3' || type === 'vec4') {
      return `struct ${hash} { value: array<${type}<${format}>>, };`
    }

    throw new Error('Not support type!');
  }

  public createUniformBlock(): IUniformBlock {
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

    _uniformDesc.textures && _uniformDesc.textures.forEach((ud) => {
      const view = _uniformsInfo[ud.name].defaultGpuValue;
      values[ud.name] = {value: ud.defaultValue, gpuValue: view};
      groupEntries.push({
        binding: _uniformsInfo[ud.name].bindingId,
        resource: view as GPUTextureView
      });
    });

    _uniformDesc.samplers && _uniformDesc.samplers.forEach((ud) => {
      const sampler = _uniformsInfo[ud.name].defaultGpuValue;
      values[ud.name] = {value: ud.defaultValue, gpuValue: sampler};
      groupEntries.push({
        binding: _uniformsInfo[ud.name].bindingId,
        resource: sampler as GPUSampler
      });
    });

    _uniformDesc.storages && _uniformDesc.storages.forEach((ud) => {
      const buffer = _uniformsInfo[ud.name].defaultGpuValue as GPUBuffer;
      values[ud.name] = {value: ud.defaultValue, gpuValue: buffer};
      groupEntries.push({
        binding: _uniformsInfo[ud.name].bindingId,
        resource: {buffer}
      });
    });

    return {entries: groupEntries, values, layout: this._uniformLayout, cpuBuffer, gpuBuffer, isBufferDirty: false, isDirty: true};
  }

  public setUniform(ub: IUniformBlock, name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    const info = this._uniformsInfo[name];

    if (!info || value === undefined) {
      return;
    }

    const {entries} = ub;
    const {bindingId, type, offset, realLen, origLen} = info;
    const values = ub.values[name];

    if (type === 'buffer') {
      value = value as TUniformTypedArray;
      const cpuValue = values.value as TUniformTypedArray;
      value = (typeof value === 'number' ? [value] : value) as Uint32Array;
      if (origLen !== realLen) {
        const size = value.length / origLen;

        for (let index = 0; index < size; index += 1) {
          cpuValue.set(
            value.slice(origLen * index, origLen * (index + 1)),
            realLen * index
          );
        }
      } else {
        cpuValue.set(value);
      }
      ub.isBufferDirty = true;
    } else if (type === 'sampler') {
      values.value = value;
      console.warn('Not implemented!');
    } else if (type === 'storage') {
      values.value = value;
      (entries[bindingId].resource as {buffer: GPUBuffer}).buffer = values.gpuValue = rtSubNameOrGPUBuffer
        ? rtSubNameOrGPUBuffer as GPUBuffer
        : createGPUBuffer(value as TUniformTypedArray, GPUBufferUsage.STORAGE);
        ub.isDirty = true;
    } else if (RenderTexture.IS(value)) {
      const view = rtSubNameOrGPUBuffer ? value.getColorViewByName(rtSubNameOrGPUBuffer as string): value.colorView;

      entries[bindingId].resource = values.gpuValue = view;
      values.value = value;
      ub.isDirty = true;
      return;
    } else  {
      value = value as Texture;
      if (value.isArray !== (values.value as Texture).isArray) {
        throw new Error('Require texture2d array!');
      }

      entries[bindingId].resource = values.gpuValue = value.view;
      values.value = value;
      ub.isDirty = true;
      return;
    }
  }

  public getUniform(ub: IUniformBlock, name: string) {
    return ub.values[name]?.value;
  }

  public getBindingGroup(ub: IUniformBlock, preGroup: GPUBindGroup) {
    if (ub.isBufferDirty) {
      renderEnv.device.queue.writeBuffer(
        ub.gpuBuffer as GPUBuffer,
        0,
        ub.cpuBuffer
      );

      ub.isBufferDirty = false;
    }

    if (ub.isDirty) {
      preGroup = renderEnv.device.createBindGroup({
        layout: ub.layout,
        entries: ub.entries
      });
      ub.isDirty = false;
    }

    return preGroup;
  }
}
