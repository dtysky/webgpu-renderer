/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:06
 */
import renderEnv from './core/renderEnv';
import {vec2, vec3, vec4, quat, quat2, mat2, mat3, mat4} from 'gl-matrix';

export {TTypedArray} from './core/shared';
export {default as Scene} from './core/Scene';
export {default as Node} from './core/Node';
export {default as Camera} from './core/Camera';
export {default as Geometry} from './core/Geometry';
export {default as Effect, IUniformBlock, IUniformsDescriptor} from './core/Effect';
export {default as Material} from './core/Material';
export {default as Mesh} from './core/Mesh';
export {default as ImageMesh} from './core/ImageMesh';
export {default as RenderTexture} from './core/RenderTexture';
export {default as Texture} from './core/Texture';
export {default as renderEnv} from './core/renderEnv';

import {init as initBuildin} from './buildin';
export {buildinEffects, buildinTextures} from './buildin';

export async function init(canvas: HTMLCanvasElement) {
  await renderEnv.init(canvas);
  initBuildin();
}

export const math = {
  vec2, vec3, vec4,
  quat, quat2,
  mat2, mat3, mat4
}

window['H'] = this;
