/**
 * @File   : Texture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午9:10:44
 */
import renderEnv from './renderEnv';

export default class Texture {
  public className: string = 'Texture';
  public isTexture: boolean = true;

  protected _bitmap: ImageBitmap;
  protected _gpuTexture: GPUTexture;
  protected _gpuTextureView: GPUTextureView;

  get gpuTexture() {
    return this._gpuTexture;
  }

  get view() {
    return this._gpuTextureView;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _src: string | ArrayBuffer,
    protected _format: GPUTextureFormat = 'rgba8unorm'
  ) {
    this._gpuTexture = renderEnv.device.createTexture({
      size: {width: this._width, height: this._height, depthOrArrayLayers: 1},
      format: 'rgba8unorm',
      usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this._gpuTextureView = this._gpuTexture.createView();

    if (typeof _src === 'string') {
      this._loadImg();
    } else {
      this._loadBuffer();
    }
  }

  protected async _loadImg() {
    const img = document.createElement('img');
    img.src = this._src as string;

    await img.decode();
    const bitmap = await createImageBitmap(img);  

    renderEnv.device.queue.copyExternalImageToTexture(
      {source: bitmap},
      {texture: this._gpuTexture},
      {width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1}
    );

    bitmap.close();
  }

  protected async _loadBuffer() {
    // const bitmap = await createImageBitmap(
    //   new ImageData(new Uint8ClampedArray(this._src as ArrayBuffer), this._width, this._height)
    // );

    // renderEnv.device.queue.copyExternalImageToTexture(
    //   {source: bitmap},
    //   {texture: this._gpuTexture},
    //   {width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1}
    // );

    // bitmap.close();
    renderEnv.device.queue.writeTexture(
      {texture: this._gpuTexture},
      this._src as ArrayBuffer,
      {},
      {width: this._width, height: this._height}
    );
  }

  public update() {
    console.warn('Not implemented!');
  }
}