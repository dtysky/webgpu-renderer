
/**
 * @File   : RenderTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午11:14:22
 */
import HObject from './HObject';
import Material from './Material';
import renderEnv from './renderEnv';
import { hashCode } from './shared';

export default class RenderTexture extends HObject {
  public static IS(value: any): value is RenderTexture {
    return !!value.isRenderTexture;
  }

  public static CLASS_NAME: string = 'RenderTexture';
  public isRenderTexture: boolean = true;

  protected _colorDesc: GPUTextureDescriptor;
  protected _depthDesc: GPUTextureDescriptor;
  protected _color: GPUTexture;
  protected _colorView: GPUTextureView;
  protected _depthStencil: GPUTexture;
  protected _depthStencilView: GPUTextureView;
  protected _pipelineHash: number;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get pipelineHash() {
    return this._pipelineHash;
  }

  get colorView() {
    return this._colorView;
  }

  get depthStencilView() {
    return this._depthStencilView;
  }

  get colorFormat() {
    return this._colorDesc.format;
  }

  get depthStencilFormat() {
    return this._depthDesc.format;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _asOutput?: boolean,
    protected _format?: GPUTextureFormat,
    protected _needDepthStencil: number = 0
  ) {
    super();

    this._color = renderEnv.device.createTexture(this._colorDesc = {
      label: this.hash,
      size: {width: _width, height: _height},
      format: _format || 'rgba8unorm',
      usage: (
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
      ) | (
        _asOutput ? GPUTextureUsage.STORAGE : 0
      )
    } as GPUTextureDescriptor);
    this._colorView = this._color.createView({label: this.hash});

    if (!_asOutput && _needDepthStencil) {
      this._depthStencil = renderEnv.device.createTexture(this._depthDesc = {
        size: {width: _width, height: _height},
        format: _needDepthStencil === 1 ? 'depth16unorm' : 'depth24plus-stencil8',
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
      } as GPUTextureDescriptor);
      this._depthStencilView = this._depthStencil.createView();
    }

    this._pipelineHash = hashCode(this._colorDesc.format + (this._depthDesc ? this._depthDesc.format : ''));
  }
}
