
/**
 * @File   : RenderTexture.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午11:14:22
 */
import HObject from './HObject';
import renderEnv from './renderEnv';
import {hashCode} from './shared';

export interface IRenderTextureOptions {
  width: number;
  height: number;
  forCompute?: boolean;
  colors: {
    name?: string,
    format?: GPUTextureFormat
  }[];
  depthStencil?: {
    format?: GPUTextureFormat;
    needStencil?: boolean;
  };
}

export default class RenderTexture extends HObject {
  public static IS(value: any): value is RenderTexture {
    return !!value.isRenderTexture;
  }

  public static CLASS_NAME: string = 'RenderTexture';
  public isRenderTexture: boolean = true;

  protected _width: number;
  protected _height: number;
  protected _forCompute: boolean;
  protected _colorDescs: GPUTextureDescriptor[];
  protected _depthDesc: GPUTextureDescriptor;
  protected _colors: GPUTexture[];
  protected _colorViews: GPUTextureView[];
  protected _colorFormats: GPUTextureFormat[];
  protected _depthStencil: GPUTexture;
  protected _depthStencilView: GPUTextureView;
  protected _pipelineHash: number;
  protected _colorNames: {[name: string]: number};

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
    return this._colorViews[0];
  }

  get depthStencilView() {
    return this._depthStencilView;
  }

  get colorFormat() {
    return this._colorDescs[0].format;
  }

  get depthStencilFormat() {
    return this._depthDesc?.format;
  }

  get colorViews() {
    return this._colorViews;
  }

  get colorFormats() {
    return this._colorFormats;
  }

  constructor(protected _options: IRenderTextureOptions) {
    super();

    const {width, height, colors, depthStencil, forCompute} = _options;

    this._width = width;
    this._height = height;

    if (forCompute && depthStencil) {
      throw new Error('RenderTexture with forCompute flag does not support depth!');
    }

    this._colorDescs = new Array(colors.length);
    this._colorViews = new Array(colors.length);
    this._colorFormats = new Array(colors.length);
    this._colorNames = {};

    this._colors = colors.map((info, index) => {
      const color = renderEnv.device.createTexture(this._colorDescs[index] = {
        label: this.hash + '_color_' + (info.name || index),
        size: {width, height},
        format: info.format || (forCompute ? 'rgba8unorm' : renderEnv.swapChainFormat),
        usage: (
          GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
        ) | (
          forCompute ? GPUTextureUsage.STORAGE_BINDING : 0
        )
      } as GPUTextureDescriptor);

      this._colorViews[index] = color.createView({label: color.label});
      this._colorFormats[index] = this._colorDescs[index].format;

      if (info.name) {
        this._colorNames[info.name] = index;
      }

      return color;
    })

    if (depthStencil) {
      this._depthStencil = renderEnv.device.createTexture(this._depthDesc = {
        label: this.hash + '_depth',
        size: {width, height},
        format: depthStencil.format || (!depthStencil.needStencil ? 'depth24plus' : 'depth24plus-stencil8'),
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        
      } as GPUTextureDescriptor);
      this._depthStencilView = this._depthStencil.createView({label: this.hash + '_depth'});
    }

    this._pipelineHash = hashCode(this._colorDescs.map(c => c.format).join('') + (this._depthDesc ? this._depthDesc.format : ''));
  }

  public getColorViewByName(name: string) {
    return this._colorViews[this._colorNames[name]];
  }
}
