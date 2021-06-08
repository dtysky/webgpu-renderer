
/**
 * @File   : Geometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import HObject from './HObject';
import {createGPUBuffer} from './shared';

export default class Geometry extends HObject {
  public static CLASS_NAME: string = 'Geometry';
  public isGeometry: boolean = true;

  protected _vBuffer: GPUBuffer;
  protected _iBuffer: GPUBuffer;

  get indexes() {
    return this._iBuffer;
  }

  get vertexes() {
    return this._vBuffer;
  }

  get vertexLayout() {
    return this._vertexLayout;
  }

  constructor(
    protected _vertexLayout: GPUVertexBufferLayout,
    protected _vertexData: ArrayBuffer,
    protected _indexData: ArrayBuffer,
    public count: number
  ) {
    super();

    this._vBuffer = createGPUBuffer(new Float32Array(_vertexData), GPUBufferUsage.VERTEX);
    this._iBuffer = createGPUBuffer(new Uint16Array(_indexData), GPUBufferUsage.INDEX);
  }

  public updateVertexes() {
    console.warn('Not implemented!');
  }

  public updateIndexes() {
    console.warn('Not implemented!');
  }
}
