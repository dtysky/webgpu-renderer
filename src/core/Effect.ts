/**
 * Effect.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 2021/6/7下午1:51:11
 */
import {hashCode} from "./shared";
import renderEnv from "./renderEnv";
import HObject from "./HObject";
import UBTemplate, {EUBGroup, IUniformsDescriptor} from "./UBTemplate";

export interface IRenderStates {
  cullMode?: GPUCullMode;
  primitiveType?: GPUPrimitiveTopology;
  blendColor?: GPUBlendComponent;
  blendAlpha?: GPUBlendComponent;
  depthCompare?: GPUCompareFunction;
}

export const DEFAULT_RENDER_STATES: IRenderStates = {
  cullMode: 'back',
  primitiveType: 'triangle-list',
  depthCompare: 'less-equal'
};

export interface IEffectOptionsRender {
  vs: string;
  fs: string;
  uniformDesc: IUniformsDescriptor;
  marcos?: {[key: string]: number | boolean};
  renderState?: IRenderStates;
}
export interface IEffectOptionsCompute {
  cs: string;
  uniformDesc: IUniformsDescriptor;
  marcos?: {[key: string]: number | boolean};
}
export type TEffectOptions = IEffectOptionsRender | IEffectOptionsCompute;

function isComputeOptions(value: TEffectOptions): value is IEffectOptionsCompute {
  return !!(value as IEffectOptionsCompute).cs;
}

export default class Effect extends HObject {
  public static CLASS_NAME: string = 'Effect';
  public isEffect: boolean = true;

  protected _marcos?: {[key: string]: number | boolean};
  protected _renderStates: IRenderStates;
  protected _marcosRegex: {[key: string]: RegExp | {hasElse: RegExp, noElse: RegExp}};
  protected _vs: string;
  protected _fs: string;
  protected _cs: string;
  protected _shaders: {[hash: number]: {
    vs?: GPUShaderModule,
    fs?: GPUShaderModule,
    cs?: GPUShaderModule
  }} = {};
  protected _ubTemplate: UBTemplate;

  get ubTemplate() {
    return this._ubTemplate;
  }

  get uniformLayout() {
    return this._ubTemplate.uniformLayout;
  }

  get renderStates() {
    return this._renderStates;
  }

  get isCompute() {
    return !!this._cs;
  }

  constructor(
    name: string,
    private _options: TEffectOptions
  ) {
    super();

    this.name = name
    const options = _options;
    const visibility = (options as IEffectOptionsCompute).cs ? GPUShaderStage.COMPUTE : GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT;
    this._ubTemplate = new UBTemplate(options.uniformDesc, EUBGroup.Material, visibility);
    this._renderStates = Object.assign({}, DEFAULT_RENDER_STATES, (options as IEffectOptionsRender).renderState || {});

    this._marcos = options.marcos || {};
    this._marcosRegex = {};
    for (const key in this._marcos) {
      const value = this._marcos[key];
      if (typeof value === 'number') {
        this._marcosRegex[key] = new RegExp(`\\\$\\{${key}\\\}`, 'g');
      } else {
        this._marcosRegex[key] = {
          hasElse: new RegExp(`#if *defined\\(${key}\\)([\\s\\S]+?)#else([\\s\\S]+?)#endif`, 'g'),
          noElse: new RegExp(`#if *defined\\(${key}\\)([\\s\\S]+?)#endif`, 'g'),
        };
      }
    }

    if (isComputeOptions(options)) {
      this._cs = options.cs
    } else {
      this._vs = options.vs;
      this._fs = options.fs;
    }
  }

  public createDefaultUniformBlock() {
    return this._ubTemplate.createUniformBlock();
  }

  public getShader(
    marcos: {[key: string]: number | boolean},
    attributesDef: string, globalPrefix: string, objectPrefix: string
  ) {
    marcos = Object.assign({}, this._marcos, marcos);
    const {device} = renderEnv;
    const hash = this._calcHash(attributesDef, globalPrefix, objectPrefix, marcos);
    const shaders = this._shaders[hash];

    if (shaders) {
      return shaders;
    }

    const tmp = [this._vs, this._fs, this._cs];

    for (const key in this._marcos) {
      const value = marcos[key];
      const regex = this._marcosRegex[key];

      tmp.forEach((s, i) => {
        if (!s) {
          return;
        }

        if (typeof value === 'number') {
          tmp[i] = s.replace(regex as RegExp, `${value}`);
        } else {
          const {hasElse, noElse} = regex as {hasElse: RegExp, noElse: RegExp};
          hasElse.lastIndex = 0;
          noElse.lastIndex = 0;

          tmp[i] = s.replace(hasElse, value ? '$1' : '$2');
          tmp[i] = tmp[i].replace(noElse, value ? '$1' : '');
        }
      });
    }

    const prefix = globalPrefix + '\n' + objectPrefix + '\n' + this._ubTemplate.shaderPrefix;
    const [vs, fs, cs] = tmp;
    const res = this._shaders[hash] = {
      vs: vs && device.createShaderModule({code: attributesDef + prefix + vs}),
      fs: fs && device.createShaderModule({code: prefix + fs}),
      cs: cs && device.createShaderModule({code: prefix + cs})
    };

    return res;
  }

  private _calcHash(
    def: string, globalPrefix: string, objectPrefix: string,
    marcos: {[key: string]: number | boolean}
  ): number {
    let hash: number = hashCode(def);
    hash = (hash << 5) - hash + hashCode(globalPrefix);
    hash = (hash << 5) - hash + hashCode(objectPrefix);

    for (const key in this._marcos) {
      const value = marcos[key];
      const hashValue = typeof value === 'number' ? value : (value ? 1 : 0);
      hash = (hash << 5) - hash + hashValue;
    }

    return hash;
  }
}
