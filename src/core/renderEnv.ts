/**
 * @File   : renderEnv.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:59:05
 */
declare type UBTemplate = import('./UBTemplate').default;
declare type IUniformBlock = import('./UBTemplate').IUniformBlock;
declare type TUniformValue = import('./UBTemplate').TUniformValue;

export class RenderEnv {
  public static  CLASS_NAME: string = 'RenderEnv';
  public isRenderEnv: boolean = true;

  private _device: GPUDevice;
  private _canvas: HTMLCanvasElement;
  private _ctx: GPUCanvasContext;
  private _swapChainFormat: GPUTextureFormat = 'bgra8unorm';
  private _ubTemplate: UBTemplate;
  private _uniformBlock: IUniformBlock;
  private _bindingGroup: GPUBindGroup;

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._ctx;
  }

  get device() {
    return this._device;
  }

  get bindingGroup() {
    this._bindingGroup = this._ubTemplate.getBindingGroup(this._uniformBlock, this._bindingGroup);
    return this._bindingGroup;
  }

  get shaderPrefix() {
    return this._ubTemplate.shaderPrefix;
  }

  get uniformLayout() {
    return this._ubTemplate.uniformLayout;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get swapChainFormat(): GPUTextureFormat {
    return this._swapChainFormat;
  }

  get currentTexture() {
    return this._ctx.getCurrentTexture();
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
    this._ctx = (canvas.getContext('webgpu') as any || canvas.getContext('gpupresent')) as GPUCanvasContext;

    this._ctx.configure({
      device: this._device,
      format: this._swapChainFormat,
      alphaMode: 'premultiplied',
    });
  }

  public async createGlobal(ubTemplate: UBTemplate) {
    this._ubTemplate = ubTemplate;
    this._uniformBlock = this._ubTemplate.createUniformBlock();
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    this._ubTemplate.setUniform(this._uniformBlock, name, value, rtSubNameOrGPUBuffer);
  }

  public getUniform(name: string): TUniformValue {
    return this._ubTemplate.getUniform(this._uniformBlock, name);
  }
}

const renderEnv = new RenderEnv();
export default renderEnv;
