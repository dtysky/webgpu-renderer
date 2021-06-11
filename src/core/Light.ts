/**
 * Light.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 9:57:52 PM
*/
import { mat4, vec3 } from 'gl-matrix';
import Material from './Material';
import Node from './Node';

export default class Light extends Node {
  public static CLASS_NAME: string = 'Light';

  public static IS(value: any): value is Light{
    return !!(value as Light).isLight;
  }

  public isLight: boolean = true;

  protected _color: Float32Array;
  protected _worldPos: Float32Array = new Float32Array(3);
  protected _worldDir: Float32Array = new Float32Array(3);

  constructor(color: [number, number, number]) {
    super();

    this._color = new Float32Array(color);
  }

  public setColor(r: number, g: number, b: number) {
    this._color.set(new Float32Array([r, g, b]));
  }

  public updateMatrix() {
    super.updateMatrix();

    mat4.getTranslation(this._worldPos, this._worldMat);
    vec3.transformMat4(this._worldDir, [0, 0, 1], this._worldMat);
  }

  public fillUniforms(index: number, material: Material) {
    material.setUniform('u_lightPos', this._worldPos);
    material.setUniform('u_lightDir', this._worldDir);
    material.setUniform('u_lightColor', this._color);
  }
}

