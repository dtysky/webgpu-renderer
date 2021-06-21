/**
 * geometries.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/9/2021, 7:16:52 PM
*/
import Geometry from "../core/Geometry";

const geometries: {
  skybox: Geometry
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
}
