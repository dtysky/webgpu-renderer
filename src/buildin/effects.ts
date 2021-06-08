/**
 * @File   : effects.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import Effect from '../core/Effect';
import textures from './textures';

const effects: {
  rBlit: Effect,
  cCreateSimpleBlur: (radius: number) => Effect
} = {} as any;

export default effects;

export function init() {
  effects.rBlit = new Effect({
    vs: require('./shaders/image/image.vert.wgsl'),
    fs: require('./shaders/image/blit.frag.wgsl'),
    uniformDesc: {
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
  });

  effects.cCreateSimpleBlur = (radius: number) => new Effect({
    cs: require('./shaders/compute/blur.comp.wgsl'),
    uniformDesc: {
      uniforms: [
        // {
        //   name: 'u_radius',
        //   type: 'number',
        //   format: 'i32',
        //   defaultValue: new Int32Array([radius])
        // },
        {
          name: 'u_kernel',
          type: 'number',
          // size: Math.pow((radius * 2 + 1), 2),
          // defaultValue: new Float32Array(Math.pow((radius * 2 + 1), 2)).fill(1)
          size: 4,
          defaultValue: new Float32Array(4).fill(1)
        }
      ],
      textures: [
        {
          name: 'u_input',
          defaultValue: textures.white
        },
        {
          name: 'u_output',
          defaultValue: textures.white,
          asOutput: true
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear'}
        }
      ]
    }
  });
}
