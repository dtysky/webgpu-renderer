
/**
 * @File   : Geometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import { vec3 } from 'gl-matrix';
import HObject from './HObject';
import {createGPUBuffer, TTypedArray} from './shared';

export interface IBoundingBox {
  start: [number, number, number];
  center: [number, number, number];
  size: [number, number,  number];
}

export default class Geometry extends HObject {
  public static CLASS_NAME: string = 'Geometry';
  public isGeometry: boolean = true;

  protected _vLayouts: {
    attributes: (GPUVertexAttribute & {name: string})[],
    arrayStride: number
  }[];
  protected _vInfo: {
    [name: string]: {
      data: TTypedArray, index: number,
      // offset and stride is based 4-bytes
      offset: number, length: number, stride: number
    }
  };
  protected _vBuffers: GPUBuffer[];
  protected _iBuffer: GPUBuffer;
  protected _indexFormat: GPUIndexFormat;
  protected _vertexCount: number;
  protected _marcos: {[key: string]: number | boolean};
  protected _attributesDef: string;

  get indexes() {
    return this._iBuffer;
  }

  get indexData() {
    return this._indexData;
  }

  get vertexes() {
    return this._vBuffers;
  }

  get vertexLayouts() {
    return this._vLayouts;
  }

  get vertexCount() {
    return this._vertexCount;
  }

  get vertexInfo() {
    return this._vInfo;
  }

  get attributesDef() {
    return this._attributesDef;
  }

  get indexFormat(): GPUIndexFormat {
    return this._indexFormat;
  }

  get marcos() {
    return this._marcos;
  }

  constructor(
    protected _vertexes: {
      layout: {
        attributes: (GPUVertexAttribute & {name: string})[],
        arrayStride: number
      },
      data: TTypedArray,
      usage?: number
    }[],
    protected _indexData: Uint16Array | Uint32Array,
    public count: number,
    protected _boundingBox?: IBoundingBox
  ) {
    super();

    this._iBuffer = createGPUBuffer(_indexData, GPUBufferUsage.INDEX);
    this._vBuffers = new Array(_vertexes.length);
    this._vLayouts = new Array(_vertexes.length);
    this._indexFormat = _indexData instanceof Uint16Array ? 'uint16' : 'uint32';
    this._vInfo = {};
    this._marcos = {};
    this._attributesDef = 'struct Attrs {\n';

    _vertexes.forEach(({layout, data, usage}, index) => {
      const vBuffer = createGPUBuffer(data, GPUBufferUsage.VERTEX | (usage | 0));

      layout.attributes.forEach((attr) => {
        this._marcos[`USE_${attr.name.toUpperCase()}`] = true;
        this._attributesDef += `  @location(${attr.shaderLocation}) ${attr.name}: ${this._convertFormat(attr.format)},\n`;
        this._vInfo[attr.name.toLowerCase()] = {
          data, index,
          offset: attr.offset / 4, stride: layout.arrayStride / 4, length: this._getLength(attr.format)
        };
      });

      this._vBuffers[index] = vBuffer;
      this._vLayouts[index] = layout;

      this._vertexCount = data.byteLength / layout.arrayStride;
    });

    this._attributesDef += '};\n\n';
  }

  public calculateNormals() {
    const {_vInfo, _vertexCount, _indexData, count} = this;

    if (_vInfo.normal) {
      return;
    }

    const position = _vInfo.position;
    const data = new Float32Array(_vertexCount * 3);

    let boundingMin: [number, number, number];
    let boundingMax: [number, number, number];
    const calcBounding = !this._boundingBox;
    if (calcBounding) {
      boundingMax = [-Infinity, -Infinity, -Infinity];
      boundingMin = [Infinity, Infinity, Infinity];
    }

    const vMultiFaceCount = new Uint8Array(_vertexCount);
    let v31: Float32Array;
    let v32: Float32Array;
    let v33: Float32Array;
    let offset: number;
    for (let i = 0; i < count; i += 1) {
      offset = position.offset + _indexData[i] * position.stride;
      v31 = position.data.slice(offset, offset + position.length) as Float32Array;
      offset = position.offset + _indexData[i + 1] * position.stride;
      v32 = position.data.slice(offset, offset + position.length) as Float32Array;
      offset = position.offset + _indexData[i + 2] * position.stride;
      v33 = position.data.slice(offset, offset + position.length) as Float32Array;

      if (calcBounding) {
        this._calcBonding(boundingMax, boundingMin, v31);
        this._calcBonding(boundingMax, boundingMin, v32);
        this._calcBonding(boundingMax, boundingMin, v33);
      }

      vec3.sub(v32, v32, v31);
      vec3.sub(v33, v33, v31);
      vec3.cross(v32, v32, v33);

      for (let vi = 0; vi < 3; vi += 1) {
        const index = _indexData[i + vi];

        if (vMultiFaceCount[index]) {
          const oldData = new Float32Array(data.buffer, index * 3 * 4, 3);
          vec3.scale(oldData, oldData, vMultiFaceCount[index]);
          vec3.add(oldData, oldData, v32);
          vec3.scale(oldData, oldData, 1 / (vMultiFaceCount[i] + 1));
        } else {
          data.set(v32, index * 3);
        }

        vMultiFaceCount[index] += 1;
      }
    }

    // todo: index
    _vInfo.normal = {offset: 0, length: 3, stride: 3, data, index: 0};
    if (calcBounding) {
      this._boundingBox = {
        start: boundingMin,
        center: boundingMax.map((v, i) => (v + boundingMin[i]) / 2) as [number, number, number],
        size: boundingMax.map((v, i) => v - boundingMin[i]) as [number, number, number]
      };
    }
  }

  public getValues(name: string) {
    return {
      cpu: this._vInfo[name].data,
      gpu: this._vBuffers[this._vInfo[name].index]
    };
  }

  protected _calcBonding(max: number[], min: number[], p: ArrayLike<number>) {
    for (let index = 0; index < 3; index += 1) {
      max[index] = Math.max(max[index], p[index]);
      min[index] = Math.min(min[index], p[index]);
    }
  }

  protected _convertFormat(f: GPUVertexFormat) {
    switch (f) {
      case 'float32':
        return 'f32';
      case 'float32x2':
        return 'vec2<f32>';
      case 'float32x3':
        return 'vec3<f32>';
      case 'float32x4':
        return 'vec4<f32>';
      case 'uint32':
        return 'u32';
      case 'uint32x2':
        return 'vec2<u32>';
      case 'uint32x3':
        return 'vec3<u32>';
      case 'uint32x4':
        return 'vec4<u32>';
    }

    throw new Error(`Not support format ${f}!`)
  }

  protected _getLength(f: GPUVertexFormat) {
    switch (f) {
      case 'float32':
      case 'uint32':
        return 1;
      case 'float32x2':
      case 'uint32x2':
        return 2;
      case 'float32x3':
      case 'uint32x3':
        return 3;
      case 'float32x4':
      case 'uint32x4':
        return 4;
    }

    throw new Error(`Not support format ${f}!`)
  }

  public updateVertexes() {
    console.warn('Not implemented!');
  }

  public updateIndexes() {
    console.warn('Not implemented!');
  }
}
