/**
 * @File   : ubTemplates.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date    : 6/24/2021, 23:00:55 PM
 */
import {mat4} from 'gl-matrix';
import UBTemplate, { EUBGroup } from "../core/UBTemplate";
import textures from './textures';

const ubTemplates: {
  global: UBTemplate,
  staticMesh: UBTemplate
} = {} as any;

export default ubTemplates;

export function init() {
  ubTemplates.global = new UBTemplate(
    {
      uniforms: [
        {
          name: 'u_vp',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
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
          name: 'u_viewInverse',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_projInverse',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_skyVP',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
        {
          name: 'u_gameTime',
          type: 'number',
          defaultValue: new Float32Array([0])
        },
        {
          name: 'u_envColor',
          type: 'vec4',
          defaultValue: new Float32Array([0, 0, 0, 0])
        },
        {
          // info: bit1(pack (4bits type|4bits mode)|r|g|b), bit2(intensity), bit3/4(areaLightSize.xy)
          name: 'u_lightInfos',
          customType: {
            name: 'LightInfo',
            len: 40,
            code: `
struct LightInfo {
  lightType: u32,
  areaMode: u32,
  areaSize: vec2<f32>,
  color: vec4<f32>,
  worldTransform: mat4x4<f32>,
  worldTransformInverse: mat4x4<f32>,
}`
          },
          type: 'vec4',
          size: 4,
          defaultValue: new Float32Array(40 * 4)
        }
      ],
      textures: [
        {
          name: 'u_envTexture',
          defaultValue: textures.cubeBlack
        }
      ]
    },
    EUBGroup.Global
  );

  ubTemplates.staticMesh = new UBTemplate(
    {
      uniforms: [
        {
          name: 'u_world',
          type: 'mat4x4',
          defaultValue: mat4.identity(new Float32Array(16)) as Float32Array
        },
      ]
    },
    EUBGroup.Mesh
  );
}
