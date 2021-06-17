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
export {default as Light} from './core/Light';
export {default as Geometry} from './core/Geometry';
export {default as Effect, IUniformBlock, IUniformsDescriptor, TEffectOptions, TUniformValue} from './core/Effect';
export {default as Material} from './core/Material';
export {default as Mesh} from './core/Mesh';
export {default as ImageMesh} from './core/ImageMesh';
export {default as ComputeUnit} from './core/ComputeUnit';
export {default as RenderTexture} from './core/RenderTexture';
export {default as Texture} from './core/Texture';
export {default as CubeTexture} from './core/CubeTexture';
export {default as renderEnv} from './core/renderEnv';
export {default as BVH} from './extension/BVH';
export {default as NodeControl} from './extension/NodeControl';

export {default as resource, Resource} from './resource';
export {default as TextureLoader, ITextureLoaderOptions} from './resource/TextureLoader';
export {default as GlTFLoader, IGlTFResource, IGlTFLoaderOptions} from './resource/GlTFLoader';
// export {default as TextureLoader, ITextureLoaderOptions} from './resource/TextureLoader';

import {init as initBuildin} from './buildin';
export * from './buildin';

export async function init(canvas: HTMLCanvasElement) {
  await renderEnv.init(canvas);
  initBuildin();
}

export const math = {
  vec2, vec3, vec4,
  quat, quat2,
  mat2, mat3, mat4
}

//@ts-ignore
window['H'] = this;
