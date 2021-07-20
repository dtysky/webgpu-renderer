/**
 * Light.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/11/2021, 9:57:52 PM
*/
import { mat4, vec3 } from 'gl-matrix';
import geometries from '../buildin/geometries';
import Material from './Material';
import Mesh from './Mesh';
import Node from './Node';

export enum ELightType {
  INVALID = 0,
  Area,
  Directional,
  Point,
  Spot
}

export enum EAreaLightMode {
  Rect,
  Disc
}

export interface IDirectionalLightOptions {}

export interface IAreaLightOptions {
  mode: EAreaLightMode;
  size: [number, number];
}

export default class Light extends Node {
  public static CLASS_NAME: string = 'Light';

  public static IS(value: any): value is Light{
    return !!(value as Light).isLight;
  }

  public isLight: boolean = true;

  protected _areaMode: EAreaLightMode;
  protected _areaSize: Float32Array;
  protected _color: Float32Array;
  protected _worldPos: Float32Array = new Float32Array(3);
  protected _worldDir: Float32Array = new Float32Array(3);
  protected _ubInfo: Float32Array;
  protected _mesh: Mesh;

  get ubInfo() {
    return this._ubInfo;
  }

  constructor(
    protected _type: ELightType,
    color: [number, number, number],
    otherOptions: IAreaLightOptions | IDirectionalLightOptions
  ) {
    super();

    this._color = new Float32Array(color);
    this._ubInfo = new Float32Array(40);
    const u32View = new Uint32Array(this._ubInfo.buffer);
    u32View[0] = _type;
    
    if (_type === ELightType.Area) {
      this._areaMode = (otherOptions as IAreaLightOptions).mode;
      this._areaSize = new Float32Array((otherOptions as IAreaLightOptions).size);

      u32View[1] = this._areaMode;
      this._ubInfo.set(this._areaSize, 2);
    }
  }

  public setColor(r: number, g: number, b: number) {
    this._color.set(new Float32Array([r, g, b]));
  }

  public requireLightMesh(material: Material) {
    if (this._type !== ELightType.Area) {
      throw new Error('Light mesh only support area!');
    }

    if (!this._mesh) {
      this._mesh = new Mesh(
        this._areaMode === EAreaLightMode.Rect ? geometries.rectLight : geometries.discLight,
        material
      );
    }

    return this._mesh;
  }

  public updateMatrix() {
    super.updateMatrix();
    
    mat4.getTranslation(this._worldPos, this._worldMat);
    vec3.transformMat4(this._worldDir, [0, 0, 1], this._worldMat);

    if (this._mesh) {
      this._mesh.scale.set(this._areaMode === EAreaLightMode.Disc
        ? [this._areaSize[0], this._areaSize[0], 0]
        : [this._areaSize[0], this._areaSize[1], 0]
      );
      this._mesh.updateWorldMatrix(this);
      this._mesh.material.setUniform('u_lightColor', this._color);
    }

    this._ubInfo.set(this._color, 4);
    this._ubInfo.set(this._worldMat, 8);
    this._ubInfo.set(mat4.invert(new Float32Array(16), this._worldMat), 24);
  }
}
