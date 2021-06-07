/**
 * image.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 2021/6/7下午6:33:30
*/
import Effect from '../core/Effect';
import textures from './textures';

const effects: {
  blit: Effect
} = {} as any;

export default effects;

export function init() {
  effects.blit = new Effect(
    require('./shaders/image/image.vert.wgsl'),
    require('./shaders/image/blit.frag.wgsl'),
    {
      uniforms: [],
      textures: [
        {
          name: 'u_texture',
          defaultValue: textures.white
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear'}
        }
      ]
    }
  );
}
