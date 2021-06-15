
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

  protected _vBuffer: GPUBuffer;
  protected _iBuffer: GPUBuffer;
  protected _marcos: {[key: string]: number | boolean};
  protected _attributesDef: string;

  get indexes() {
    return this._iBuffer;
  }

  get vertexes() {
    return this._vBuffer;
  }

  get vertexLayout() {
    return this._vertexLayout;
  }

  get attributesDef() {
    return this._attributesDef;
  }

  get marcos() {
    return this._marcos;
  }

  get vertexData() {
    return this._vertexData;
  }

  constructor(
    protected _vertexLayout: {
      attributes: (GPUVertexAttribute & {name: string})[],
      arrayStride: number
    },
    protected _vertexData: TTypedArray,
    protected _indexData: TTypedArray,
    public count: number,
    protected _boundingBox?: IBoundingBox
  ) {
    super();

    this._vBuffer = createGPUBuffer(_vertexData, GPUBufferUsage.VERTEX);
    this._iBuffer = createGPUBuffer(_indexData, GPUBufferUsage.INDEX);

    this._attributesDef = 'struct Attrs {\n';
    this._marcos = {};
    _vertexLayout.attributes.forEach((attr, index) => {
      this._marcos[`USE_${attr.name.toUpperCase()}`] = true;
      this._attributesDef += `  [[location(${index})]] ${attr.name}: ${this._convertFormat(attr.format)};\n`;
    });
    this._attributesDef += '};\n\n';
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
