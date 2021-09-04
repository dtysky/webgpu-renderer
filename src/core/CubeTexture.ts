/**
 * CubeTexture.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/13/2021, 12:10:07 AM
*/
import HObject from './HObject';
import renderEnv from './renderEnv';

export default class CubeTexture extends HObject {
  public static CLASS_NAME: string = 'CubeTexture';
  public isCubeTexture: boolean = true;

  public static IS(value: any): value is CubeTexture {
    return !!(value as CubeTexture).isCubeTexture;
  }

  protected _gpuTexture: GPUTexture;
  protected _view: GPUTextureView;

  get view() {
    return this._view;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _src: ArrayBuffer[] | ImageBitmap[],
    protected _format: GPUTextureFormat = 'rgba8unorm'
  ) {
    super();

    if (_src.length < 6) {
      throw new Error('CubeTexture must has 6 slice');
    }

    this._gpuTexture = renderEnv.device.createTexture({
      size: {width: _width, height: _height, depthOrArrayLayers: 6},
      format: _format,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    this._view = this._gpuTexture.createView({
      dimension: 'cube'
    });

    if (_src[0] instanceof ImageBitmap) {
      this._loadImg();
    } else {
      this._loadBuffer();
    }
  }

  protected _loadImg() {
    (this._src as ImageBitmap[]).forEach((img, index) => {
      renderEnv.device.queue.copyExternalImageToTexture(
        {source: img},
        {texture: this._gpuTexture, origin: {x: 0, y: 0, z: index}},
        {width: this._width, height: this._height, depthOrArrayLayers: 1}
      );
    })
  }

  protected _loadBuffer() {
    (this._src as ArrayBuffer[]).forEach((img, index) => {
      renderEnv.device.queue.writeTexture(
        {texture: this._gpuTexture, origin: {x: 0, y: 0, z: index}},
        img,
        {},
        {width: this._width, height: this._height, depthOrArrayLayers: 1}
      );
    })
  }
}