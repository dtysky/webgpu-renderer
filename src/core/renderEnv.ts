/**
 * @File   : renderEnv.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:59:05
 */
class RenderEnv {
  public static  CLASS_NAME: string = 'RenderEnv';
  public isRenderEnv: boolean = true;

  private _device: GPUDevice;
  private _canvas: HTMLCanvasElement;
  private _ctx: GPUCanvasContext;
  private _swapChainFormat: GPUTextureFormat = 'bgra8unorm';
  private _swapChain: GPUSwapChain;

  get ctx() {
    return this._ctx;
  }

  get device() {
    return this._device;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get swapChainFormat() {
    return this._swapChainFormat;
  }

  get swapChain() {
    return this._swapChain;
  }

  public async init(canvas: HTMLCanvasElement) {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported!');
    }

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      throw new Error('Require adapter failed!');
    }

    this._device = await adapter.requestDevice();

    if (!this._device) {
      throw new Error('Require device failed!');
    }

    this._canvas = canvas;
    this._ctx = canvas.getContext('gpupresent');

    this._swapChain = this._ctx.configureSwapChain({
      device: this._device,
      format: this._swapChainFormat,
    });
  }
}

const renderEnv = new RenderEnv();
export default renderEnv;
