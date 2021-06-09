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

  effects.cCreateSimpleBlur = (radius: number) => {
    const realKernelSize = Math.pow((radius * 2 + 1), 2);
    const mod = realKernelSize % 4;
    const kernelSize = realKernelSize + (4 - mod);

    return new Effect({
      cs: require('./shaders/compute/blur.comp.wgsl')
        .replace(/\${MARCO_RADIUS}/g, radius)
        .replace(/\${MARCO_WINDOW_SIZE}/g, radius * 2 + 1)
        .replace(/\${TILE_SIZE}/g, radius * 4 + 1),
      uniformDesc: {
        uniforms: [
          {
            name: 'u_kernel',
            type: 'vec4',
            size: kernelSize / 4,
            defaultValue: new Float32Array(kernelSize).fill(1)
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
    })
  };
}
