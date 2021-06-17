/**
 * @File   : effects.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import {mat4} from 'gl-matrix';
import Effect from '../core/Effect';
import renderEnv from '../core/renderEnv';
import textures from './textures';

const effects: {
  rGreen: Effect,
  rUnlit: Effect,
  rPBR: Effect,
  rSkybox: Effect,
  iBlit: Effect,
  rRTGBuffer: Effect,
  rRTSS: Effect,
  cCreateSimpleBlur: (radius: number) => Effect
} = {} as any;

export default effects;

const commonMarcos = {
  USE_TEXCOORD_0: false,
  USE_NORMAL: false,
  USE_TANGENT: false,
  USE_COLOR_0: false,
  USE_TEXCOORD_1: false
};

export function init() {
  effects.rGreen = new Effect('rGreen', {
    vs: require('./shaders/basic/model.vert.wgsl'),
    fs: require('./shaders/basic/green.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_world',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        }
      ],
      textures: [],
      samplers: []
    },
    marcos: commonMarcos
  });

  effects.rUnlit = new Effect('rUnlit', {
    vs: require('./shaders/basic/model.vert.wgsl'),
    fs: require('./shaders/basic/unlit.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_world',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        }
      ],
      textures: [
        {
          name: 'u_baseColorTexture',
          defaultValue: textures.white
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest'}
        }
      ]
    },
    marcos: commonMarcos
  });

  effects.rPBR = new Effect('rPBR', {
    vs: require('./shaders/basic/model.vert.wgsl'),
    fs: require('./shaders/basic/unlit.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_world',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_baseColorFactor',
          type: 'vec4',
          defaultValue: new Float32Array([1, 1, 1, 1])
        },
        {
          name: 'u_metallicFactor',
          type: 'number',
          defaultValue: new Float32Array([1])
        },
        {
          name: 'u_roughnessFactor',
          type: 'number',
          defaultValue: new Float32Array([1])
        }
      ],
      textures: [
        {
          name: 'u_baseColorTexture',
          defaultValue: textures.white
        },
        {
          name: 'u_normalTexture',
          defaultValue: textures.white
        },
        {
          name: 'u_metallicRoughnessTexture',
          defaultValue: textures.white
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest'}
        }
      ]
    },
    marcos: commonMarcos
  });

  effects.rSkybox = new Effect('rSkybox', {
    vs: require('./shaders/basic/skybox.vert.wgsl'),
    fs: require('./shaders/basic/skybox.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_skyVP',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_color',
          type: 'vec4',
          defaultValue: mat4.identity(new Float32Array(4)) as Float32Array
        },
        {
          name: 'u_factor',
          type: 'number',
          defaultValue: new Float32Array(1)
        },
        {
          name: 'u_rotation',
          type: 'number',
          defaultValue: new Float32Array(1)
        },
        {
          name: 'u_exposure',
          type: 'number',
          defaultValue: new Float32Array(1)
        },
      ],
      textures: [
        {
          name: 'u_cubeTexture',
          defaultValue: textures.cubeWhite
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest'}
        }
      ]
    }
  });

  effects.rRTGBuffer = new Effect('rRTGBuffer', {
    vs: require('./shaders/basic/model.vert.wgsl'),
    fs: require('./shaders/ray-tracing/gbuffer.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_view',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        // support materials up to 128
        {
          name: 'u_matId2TexturesId',
          type: 'vec2',
          format: 'u32',
          size: 128,
          defaultValue: new Uint32Array(2 * 128)
        },
        {
          name: 'u_worlds',
          type: 'mat4x4',
          size: 128,
          defaultValue: mat4.identity(new Float32Array(16 * 128)) as Float32Array
        },
        {
          name: 'u_baseColorFactors',
          type: 'vec4',
          size: 128,
          defaultValue: new Float32Array(4 * 128)
        },
        {
          name: 'u_metallicFactors',
          type: 'number',
          size: 128,
          defaultValue: new Float32Array(128)
        },
        {
          name: 'u_roughnessFactors',
          type: 'number',
          size: 128,
          defaultValue: new Float32Array(128)
        }
      ],
      textures: [
        {
          name: 'u_baseColorTextures',
          defaultValue: textures.array2white
        },
        {
          name: 'u_normalTextures',
          defaultValue: textures.array2white
        },
        {
          name: 'u_metallicRoughnessTextures',
          defaultValue: textures.array2white
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest'}
        }
      ],
    },
    marcos: commonMarcos
  });

  effects.rRTSS = new Effect('rRTSS', {
    vs: require('./shaders/image/image.vert.wgsl'),
    fs: require('./shaders/ray-tracing/rtss.frag.wgsl'),
    uniformDesc: {
      uniforms: [
        {
          name: 'u_screenSize',
          type: 'vec2',
          defaultValue: new Float32Array([renderEnv.width, renderEnv.height])
        },
        {
          name: 'u_randomSeed',
          type: 'vec2',
          defaultValue: new Float32Array([0, 0])
        },
        {
          name: 'u_view',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_proj',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_lightPos',
          type: 'vec3',
          defaultValue: new Float32Array([0, 0, 0])
        },
        {
          name: 'u_lightDir',
          type: 'vec3',
          defaultValue: new Float32Array([0, 0, 0])
        },
        {
          name: 'u_lightColor',
          type: 'vec3',
          defaultValue: new Float32Array([0, 0, 0])
        }
      ],
      textures: [
        {
          name: 'u_baseColorTexture',
          defaultValue: textures.white
        }
      ],
      samplers: [
        {
          name: 'u_sampler',
          defaultValue: {magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'nearest'}
        }
      ]
    },
    marcos: commonMarcos
  })

  effects.iBlit = new Effect('iBlit', {
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

    return new Effect('cSimpleBlur-' + radius, {
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
