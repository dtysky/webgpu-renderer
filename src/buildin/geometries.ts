/**
 * geometries.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/9/2021, 7:16:52 PM
*/
import Geometry from "../core/Geometry";

const geometries: {
  skybox: Geometry,
  discLight: Geometry,
  rectLight: Geometry
} = {} as any;

export default geometries;

export function init() {
  geometries.skybox = new Geometry(
    [
      {
        layout: {
          arrayStride: 8,
          attributes: [
            {
              name: 'position',
              shaderLocation: 0, offset: 0,
              format: 'float32x2' as GPUVertexFormat
            },
          ]
        },
        data: new Float32Array([
          -1.0, -1.0,
          1.0, -1.0,
          -1.0, 1.0,
          -1.0, 1.0,
          1.0, -1.0,
          1.0, 1.0
        ]),
      }
    ],
    new Uint16Array([
      0,1,2,3,4,5,
    ]),
    6
  );

  geometries.rectLight = new Geometry(
    [
      {
        layout: {
          arrayStride: 12,
          attributes: [
            {
              name: 'position',
              shaderLocation: 0, offset: 0,
              format: 'float32x3' as GPUVertexFormat
            },
          ]
        },
        data: new Float32Array([
          -.5, -.5, 0,
          .5, -.5, 0,
          .5, .5, 0,
          -.5, .5, 0
        ]),
      }
    ],
    new Uint16Array([
      0,1,2,2,3,0
    ]),
    6
  );

  const discLightData = createDisc(512);
  geometries.discLight = new Geometry(
    [
      {
        layout: {
          arrayStride: 12,
          attributes: [
            {
              name: 'position',
              shaderLocation: 0, offset: 0,
              format: 'float32x3' as GPUVertexFormat
            },
          ]
        },
        data: discLightData.vertexes,
      }
    ],
    discLightData.indexes,
    discLightData.indexes.length
  );
}

function createDisc(samples: number): {vertexes: Float32Array, indexes: Uint16Array} {
  const step: number = Math.PI * 2 / samples;
  const vertexes: Float32Array = new Float32Array((1 + samples) * 3);
  const indexes: Uint16Array = new Uint16Array(samples * 3);
  vertexes.set([0, 0, 0]);

  let theta: number = 0;
  for (let index = 0; index < samples; index += 1) {
    vertexes[(index + 1) * 3] = Math.cos(theta);
    vertexes[(index + 1) * 3 + 1] = Math.sin(theta);
    vertexes[(index + 1) * 3 + 2] = 0;

    indexes[index * 3] = 0;
    indexes[index * 3 + 1] = index + 2;
    indexes[index * 3 + 2] = index + 1;

    theta += step;
  }

  return {vertexes, indexes};
}
