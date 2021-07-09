/**
 * @File   : Material.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:26:33
 */
import HObject from "./HObject";
import Effect, {IRenderStates} from "./Effect";
import UBTemplate, {IUniformBlock, TUniformValue} from "./UBTemplate";

export default class Material extends HObject {
  public static  CLASS_NAME: string = 'Material';
  public isMaterial: boolean = true;

  protected _version: number = 0;
  protected _isBufferDirty: boolean = false;
  protected _isDirty: boolean = true;
  protected _uniformBlock: IUniformBlock;
  protected _bindingGroup: GPUBindGroup;
  protected _marcos: {[key: string]: number | boolean};
  protected _renderStates: IRenderStates;

  get effect() {
    return this._effect;
  }

  get marcos() {
    return this._marcos;
  }

  get version() {
    return this._version;
  }

  get bindingGroup() {
    this._bindingGroup = this._effect.ubTemplate.getBindingGroup(this._uniformBlock, this._bindingGroup);
    return this._bindingGroup;
  }

  get primitiveType() {
    return this._renderStates.primitiveType || this._effect.renderStates.primitiveType;
  }

  get cullMode() {
    return this._renderStates.cullMode || this._effect.renderStates.cullMode;
  }

  get depthCompare() {
    return this._renderStates.depthCompare || this._effect.renderStates.depthCompare;
  }

  get blendColor() {
    return this._renderStates.blendColor || this._effect.renderStates.blendColor;
  }

  get blendAlpha() {
    return this._renderStates.blendAlpha || this._effect.renderStates.blendAlpha;
  }

  constructor(
    protected _effect: Effect,
    values?: {[name: string]: TUniformValue},
    marcos?: {[key: string]: number | boolean},
    renderStates?: IRenderStates
  ) {
    super();

    this._uniformBlock = _effect.createDefaultUniformBlock();

    if (values) {
      Object.keys(values).forEach(name => this.setUniform(name, values[name]));
    }

    this._marcos = marcos || {};
    this._renderStates = renderStates || {};
  }

  public setUniform(name: string, value: TUniformValue, rtSubNameOrGPUBuffer?: string | GPUBuffer) {
    this._effect.ubTemplate.setUniform(this._uniformBlock, name, value, rtSubNameOrGPUBuffer);
  }

  public getUniform(name: string): TUniformValue {
    return this._effect.ubTemplate.getUniform(this._uniformBlock, name);
  }

  public setMarcos(marcos: {[key: string]: number | boolean}) {
    Object.assign(this._marcos, marcos);
    this._version += 1;
  }
}
