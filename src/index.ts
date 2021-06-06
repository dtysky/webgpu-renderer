/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:06
 */
import renderEnv from './renderEnv';
import {vec2, vec3, vec4, quat, quat2, mat2, mat3, mat4} from 'gl-matrix';

export {TTypedArray} from './shared';
export {default as Scene} from './Scene';
export {default as Node} from './Node';
export {default as Camera} from './Camera';
export {default as Geometry} from './Geometry';
export {default as Material, EUniformType, IUniformsDescriptor} from './Material';
export {default as Mesh} from './Mesh';
export {default as RenderTexture} from './RenderTexture';
export {default as Texture} from './Texture';

export async function init(canvas: HTMLCanvasElement) {
  await renderEnv.init(canvas);
}

export const math = {
  vec2, vec3, vec4,
  quat, quat2,
  mat2, mat3, mat4
}
