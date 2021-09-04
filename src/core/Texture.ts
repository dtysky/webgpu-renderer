/**
 * @File   : Texture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午9:10:44
 */
import HObject from './HObject';
import renderEnv from './renderEnv';
import {TTextureSource, isTextureSourceArray} from './shared';

export default class Texture extends HObject {
  public static  CLASS_NAME: string = 'Texture';
  public isTexture: boolean = true;

  protected _bitmap: ImageBitmap;
  protected _isArray: boolean;
  protected _arrayCount: number;
  protected _gpuTexture: GPUTexture;
  protected _gpuTextureView: GPUTextureView;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get format() {
    return this._format;
  }

  get source() {
    return this._src;
  }

  get gpuTexture() {
    return this._gpuTexture;
  }

  get view() {
    return this._gpuTextureView;
  }

  get isArray() {
    return this._isArray;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _src: TTextureSource | TTextureSource[],
    protected _format: GPUTextureFormat = 'rgba8unorm'
  ) {
    super();

    if (isTextureSourceArray(_src)) {
      this._isArray = true;
      this._arrayCount = _src.length;
    } else {
      this._isArray = false;
      this._arrayCount = 1;
    }

    this._gpuTexture = renderEnv.device.createTexture({
      label: this.hash,
      size: {width: this._width, height: this._height, depthOrArrayLayers: this._arrayCount},
      format: _format || 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    if (isTextureSourceArray(_src)) {
      _src.forEach((src, index) => this._load(src, index));
      this._gpuTextureView = this._gpuTexture.createView({dimension: '2d-array', arrayLayerCount: this._arrayCount});
    } else {
      this._load(_src);
      this._gpuTextureView = this._gpuTexture.createView();
    }
  }

  protected _load(src: TTextureSource, layer: number = 0) {
    if (src instanceof ImageBitmap) {
      this._loadImg(src, layer);
    } else {
      this._loadBuffer(src, layer);
    }
  }

  protected _loadImg(img: ImageBitmap, layer: number) {
    renderEnv.device.queue.copyExternalImageToTexture(
      {source: img},
      {texture: this._gpuTexture, origin: this._isArray ? {x: 0, y: 0, z: layer} : undefined},
      {width: this._width, height: this._height, depthOrArrayLayers: 1}
    );
  }

  protected _loadBuffer(buffer: ArrayBuffer, layer: number) {
    renderEnv.device.queue.writeTexture(
      {texture: this._gpuTexture, origin: this._isArray ? {x: 0, y: 0, z: layer} : undefined},
      buffer as ArrayBuffer,
      {bytesPerRow: this._width * 4},
      {width: this._width, height: this._height, depthOrArrayLayers: 1}
    );
  }

  public updateImg(src: ImageBitmap, layer: number = 0) {
    console.warn('Not implemented!');
  }
}