
/**
 * @File   : RenderTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午11:14:22
 */
import renderEnv from './renderEnv';

export default class RenderTexture {
  public static IS(value: any): value is RenderTexture {
    return !!value.isRenderTexture;
  }

  public className: string = 'RenderTexture';
  public isRenderTexture: boolean = true;

  protected _color: GPUTexture;
  protected _colorView: GPUTextureView;
  protected _depthStencil: GPUTexture;
  protected _depthStencilView: GPUTextureView;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get colorView() {
    return this._colorView;
  }

  get depthStencilView() {
    return this._depthStencilView;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _format?: GPUTextureFormat,
    protected _needDepthStencil: number = 0
  ) {
    this._color = renderEnv.device.createTexture({
      size: {width: _width, height: _height},
      format: _format || 'bgra8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_SRC
    } as GPUTextureDescriptor);
    this._colorView = this._color.createView();

    if (_needDepthStencil) {
      this._color = renderEnv.device.createTexture({
        size: {width: _width, height: _height},
        format: _needDepthStencil === 1 ? 'depth16unorm' : 'depth24unorm-stencil8',
        usage: GPUTextureUsage.STORAGE | GPUTextureUsage.COPY_DST
      } as GPUTextureDescriptor);
      this._depthStencilView = this._depthStencil.createView();
    }
  }
}
