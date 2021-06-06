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

  get gpuTexture() {
    return this._gpuTexture;
  }

  constructor(
    protected _width: number,
    protected _height: number,
    protected _src: string,
    protected _format: GPUTextureFormat = 'rgba8unorm'
  ) {
    this._gpuTexture = renderEnv.device.createTexture({
      size: {width: this._width, height: this._height, depthOrArrayLayers: 1},
      format: 'rgba8unorm',
      usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    this._loadImg();
  }

  protected async _loadImg() {
    const img = document.createElement('img');
    img.src = this._src;

    await img.decode();
    const bitmap = await createImageBitmap(img);  

    renderEnv.device.queue.copyExternalImageToTexture(
      {source: bitmap},
      {texture: this._gpuTexture},
      {width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1}
    );

    bitmap.close();
  }

  public update() {
    console.warn('Not implemented!');
  }
}