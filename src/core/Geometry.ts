
/**
 * @File   : Geometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
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
      // offset and stride is based 4-bytes
      offset: number, length: number, stride: number, data: TTypedArray
    }
  };
  protected _vBuffers: GPUBuffer[];
  protected _iBuffer: GPUBuffer;
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

  get marcos() {
    return this._marcos;
  }

  constructor(
    protected _vertexes: {
      layout: {
        attributes: (GPUVertexAttribute & {name: string})[],
        arrayStride: number
      },
      data: TTypedArray
    }[],
    protected _indexData: Uint16Array,
    public count: number,
    protected _boundingBox?: IBoundingBox
  ) {
    super();

    this._iBuffer = createGPUBuffer(_indexData, GPUBufferUsage.INDEX);
    this._vBuffers = new Array(_vertexes.length);
    this._vLayouts = new Array(_vertexes.length);
    this._vInfo = {};
    this._marcos = {};
    this._attributesDef = 'struct Attrs {\n';

    _vertexes.forEach(({layout, data}, index) => {
      const vBuffer = createGPUBuffer(data, GPUBufferUsage.VERTEX);

      layout.attributes.forEach((attr) => {
        this._marcos[`USE_${attr.name.toUpperCase()}`] = true;
        this._attributesDef += `  [[location(${attr.shaderLocation})]] ${attr.name}: ${this._convertFormat(attr.format)};\n`;
        this._vInfo[attr.name.toUpperCase()] = {
          data, offset: attr.offset / 4, stride: layout.arrayStride / 4, length: this._getLength(attr.format)
        };
      });

      this._vBuffers[index] = vBuffer;
      this._vLayouts[index] = layout;

      this._vertexCount = data.byteLength / layout.arrayStride;
    })

    this._attributesDef += '};\n\n';
  }

  public computeNormals() {

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
