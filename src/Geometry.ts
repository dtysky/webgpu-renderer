
/**
 * @File   : Geometry.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import {createGPUBuffer} from './shared';

export default class Geometry {
  public className: string = 'Geometry';
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
    this._vBuffer = createGPUBuffer(new Float32Array(_vertexData), GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST);
    this._iBuffer = createGPUBuffer(new Uint16Array(_indexData), GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST);
  }

  public updateVertexes() {
    console.warn('Not implemented!');
  }

  public updateIndexes() {
    console.warn('Not implemented!');
  }
}
