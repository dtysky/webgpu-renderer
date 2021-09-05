/**
 * @File   : debugCS.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/26/2021, 7:40:32 PM
 */
import { vec3 } from 'gl-matrix';
import * as H from '../src';
import { Bounds } from '../src/extension/BVH';

interface IDebugPixel {
  preOrigin: Float32Array;
  preDir: Float32Array;
  origin: Float32Array;
  dir: Float32Array;
  nextOrigin: Float32Array;
  nextDir: Float32Array;
  normal: Float32Array;
}

export class DebugInfo {
  protected _cpu: Float32Array;
  protected _gpu: GPUBuffer;
  protected _view: GPUBuffer;
  protected _size: number;
  protected _rtManager: H.RayTracingManager

  public setup(rtManager: H.RayTracingManager) {
    const {renderEnv} = H;
    const size = this._size = 4 * 7;

    this._cpu = new Float32Array(size * renderEnv.width * renderEnv.height);
    this._gpu = H.createGPUBuffer(this._cpu, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    this._view = H.createGPUBufferBySize(size * renderEnv.width * renderEnv.height * 4, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);

    this._rtManager = rtManager;
    this._rtManager.rtUnit.setUniform('u_debugInfo', this._cpu, this._gpu)
  }

  public run(scene: H.Scene) {
    scene.copyBuffer(this._gpu, this._view, this._cpu.byteLength);
  }

  public async showDebugInfo(
    point1: [number, number],
    len: [number, number],
    step: [number, number]
  ): Promise<{
    rays: IDebugPixel[],
    mesh: H.Mesh
  }> {
    await this._view.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(this._view.getMappedRange());
    const rays = this._decodeDebugInfo(data, point1, len, step);

    const positions = new Float32Array(rays.length * 6 * 3);
    const colors = new Float32Array(rays.length * 6 * 3);
    const indexes = new Uint32Array(rays.length * 6);

    rays.forEach(({preOrigin, preDir, origin, dir, nextOrigin, nextDir}, index) => {
      const po = index * 3 * 6;
      const io = index * 6;

      positions.set(preOrigin.slice(0, 3), po);
      positions.set(preDir.slice(0, 3), po + 3);
      colors.set([1, 0, 0], po);
      colors.set([1, 0, 0], po + 3);
      positions.set(origin.slice(0, 3), po + 6);
      positions.set(dir.slice(0, 3), po + 9);
      colors.set([0, 1, 0], po + 6);
      colors.set([0, 1, 0], po + 9);
      positions.set(nextOrigin.slice(0, 3), po + 12);
      positions.set(nextDir.slice(0, 3), po + 15);
      colors.set([0, 0, 1], po + 12);
      colors.set([0, 0, 1], po + 15);
      indexes.set([index * 3, index * 3 + 1, index * 3 + 2, index * 3 + 3, index * 3 + 4, index * 3 + 5], io);
    });

    const geometry = new H.Geometry(
      [
        {
          layout: {
            arrayStride: 3 * 4,
            attributes: [{
              name: 'position',
              shaderLocation: 0,
              offset: 0,
              format: 'float32x3'
            }],
          },
          data: positions
        },
        {
          layout: {
            arrayStride: 3 * 4,
            attributes: [{
              name: 'color_0',
              shaderLocation: 1,
              offset: 0,
              format: 'float32x3'
            }],
          },
          data: colors
        }
      ],
      indexes,
      rays.length * 6
    );
    const material = new H.Material(
      H.buildinEffects.rColor,
      {u_color: new Float32Array([1, 1, 1])},
      undefined,
      {cullMode: 'none', primitiveType: 'line-list', depthCompare: 'always'}
    );
    const mesh = new H.Mesh(geometry, material);

    this._view.unmap();

    return {rays, mesh};
  }

  protected _decodeDebugInfo(
    view: Float32Array,
    point1: [number, number],
    len: [number, number],
    step: [number, number]
  ) {
    const res: IDebugPixel[] = [];
    const logs = [];

    for (let y = point1[1]; y < point1[1] + len[1] * step[1]; y += step[1]) {
      for (let x = point1[0]; x <  point1[0] + len[0] * step[0]; x += step[0]) {
        const index = y * H.renderEnv.width + x;
        const offset = index * this._size;
        res.push({
          preOrigin: view.slice(offset, offset + 4),
          preDir: view.slice(offset + 4, offset + 8),
          origin: view.slice(offset + 8, offset + 12),
          dir: view.slice(offset + 12, offset + 16),
          nextOrigin: view.slice(offset + 16, offset + 20),
          nextDir: view.slice(offset + 20, offset + 24),
          normal: view.slice(offset + 24, offset + 28)
        } as IDebugPixel);
  
        // if (view[offset + 3]) {
        //   logs.push(`'hited', ${[x, y]}, ${[view[offset + 19], view[offset + 23]]}, ${this._rtManager.meshes[view[offset + 11]].name}, ${view[offset + 15]}, ${this._rtManager.meshes[view[offset + 19]].name}, ${view[offset + 23]}, ${view.slice(offset + 16, offset + 19)}`);
        // } else {
        //   logs.push(`'not hited', ${[x, y]}, ${[view[offset + 19], view[offset + 23]]}, ${view[offset + 7]}`);
        // }
      }
    }

    console.log(logs.join('\n'));

    return res;
  }
}

let plotS: string[] = [];

export function debugRay(rayInfo: {origin: Float32Array, dir: Float32Array}, bvh: H.BVH, positions: Float32Array) {
  const ray: Ray = {
    origin: rayInfo.origin,
    dir: rayInfo.dir,
    invDir: new Float32Array(3)
  };
  H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);

  console.log('ray info', rayInfo);
  console.log('ray', ray);

  const fragInfo = hitTest(bvh, ray, positions);
  console.log(fragInfo);
}

export function debugRayShadows(
  rayInfos: {origin: Float32Array, dir: Float32Array, preOrigin: Float32Array}[], bvh: H.BVH, positions: Float32Array
) {
  plotS = [];
  rayInfos.forEach(ray => debugRayShadow(ray, bvh, positions));
  console.log('Show[\n' + plotS.join(',\n') + '\n]');
}

export function debugRayShadow(rayInfo: {origin: Float32Array, dir: Float32Array, preOrigin: Float32Array}, bvh: H.BVH, positions: Float32Array) {
  const ray: Ray = {
    origin: rayInfo.origin,
    dir: rayInfo.dir,
    invDir: new Float32Array(3)
  };
  H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);

  // function RSI(center: any, radius: number) {
  //   const res: any[] = [];

  //   const psubc = vec3.sub(new Float32Array(3), ray.origin, center);
  //   const ddotpsubc = vec3.dot(ray.dir, psubc);
  //   const det = Math.pow(ddotpsubc, 2) - vec3.dot(psubc, psubc) + radius * radius;

  //   if (det < 0) {
  //     return res;
  //   }

  //   const d = vec3.length(ray.dir) * vec3.length(ray.dir);

  //   const ts = [(-ddotpsubc + Math.sqrt(det)) / d, (-ddotpsubc - Math.sqrt(det)) / d];

  //   ts.forEach(t => {
  //     res.push(t, vec3.scaleAndAdd(new Float32Array(3), ray.origin, ray.dir, t));
  //   })

  //   return res;
  // }

  // const rsiPoints = RSI([1.71, 1, 6.09], 1);
  // console.log(rsiPoints);
  // plotS.push(`Graphics3D[{Red, PointSize[0.1], Point[{${rsiPoints[1].join(',')}}]}]`);

  const maxT = rayInfo.dir[3];
  console.log('rayInfo', rayInfo);
  console.log('ray maxT', ray, maxT);
  console.log(ray.origin.map((v, i) => v + ray.dir[i] * maxT));

  plotS.push(`ParametricPlot3D[{${ray.dir[0]}t + ${ray.origin[0]}, ${ray.dir[1]}t + ${ray.origin[1]}, ${ray.dir[2]}t + ${ray.origin[2]}}, {t, 0, ${maxT}}]`);
  const fragInfo = hitTestShadow(bvh, ray, rayInfo.preOrigin[0], positions);
  console.log(fragInfo);
}

export function sampleCircle(pi: Float32Array) {
  let p = [2.0 * pi[0] - 1.0, 2.0 * pi[1] - 1.0, ];
  console.log('start', pi.slice(0, 2), p);
  let greater = Math.abs(p[0]) > Math.abs(p[1]);
  let r: number;
  let theta: number;

  if (greater) {
    r = p[0];
    theta = 0.25 * Math.PI * p[1] / p[0];
  } else {
    r = p[1];
    theta = Math.PI * (0.5 - 0.25 * p[0] / p[1]);
  }

  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  console.log(r, theta, Math.cos(theta), Math.sin(theta));
  console.log(x, y, Math.sqrt(1 - x * x - y * y));
}

// export function debugCamera(camera: H.Camera, bvh: H.BVH, positions: Float32Array) {
//   for (let i = 0; i < 10; i += 1) {
//     const uv = new Float32Array([Math.random() / 2, Math.random() / 2]);
//     const ssPos = new Float32Array([uv[0] * 2 - 1, 1 - uv[1] * 2, 0, 1]);
//     const worldPos = H.math.vec4.transformMat4(new Float32Array(4), ssPos, camera.invProjMat);
//     H.math.vec4.transformMat4(worldPos, worldPos, camera.invViewMat);
//     console.log(worldPos)
//     H.math.vec4.scale(worldPos, worldPos, 1 / worldPos[3]);
//     const dir = H.math.vec3.sub(new Float32Array(3), worldPos.slice(0, 3) as Float32Array, camera.pos) as Float32Array;
//     H.math.vec3.normalize(dir, dir);

//     console.log('uv, ssPos, worldPos', uv, ssPos, worldPos);

//     const ray: Ray = {
//       origin: camera.pos,
//       dir,
//       invDir: new Float32Array(3)
//     };
//     H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);

//     const hitedNode = hitTest(bvh, ray);
//     console.log(hitedNode);

//     if (!hitedNode) {
//       continue;
//     }

//     if (hitedNode.isChild0Leaf) {
//       console.log(leafHitTest(bvh, ray, positions, hitedNode.child0Offset));
//       continue;
//     }

//     if (hitedNode.isChild1Leaf) {
//       console.log(leafHitTest(bvh, ray, positions, hitedNode.child1Offset));
//     }
//   }
// }

const EPS = 0.005;

interface Ray {
  origin: Float32Array;
  dir: Float32Array;
  invDir: Float32Array;
};


interface BVHNode {
  child0Index: number;
  child1Index: number;
  max: Float32Array;
  min: Float32Array;
};

interface BVHLeaf {
  primitives: number;
  indexes: Uint32Array;
};

interface FragmentInfo {
  hit: boolean;
  t: number;
  hitPoint: Float32Array;
  // areal coordinates
  weights: Float32Array;
};

function boxHitTest(ray: Ray, max: Float32Array, min: Float32Array): number {
  let t1 = H.math.vec3.sub(new Float32Array(3), min, ray.origin);
  H.math.vec3.mul(t1, t1, ray.invDir);
  let t2 = H.math.vec3.sub(new Float32Array(3), max, ray.origin);
  H.math.vec3.mul(t2, t2, ray.invDir);
  let tvmin = H.math.vec3.min(new Float32Array(3), t1, t2);
  let tvmax = H.math.vec3.max(new Float32Array(3), t1, t2);
  let tmin = Math.max(tvmin[0], Math.max(tvmin[1], tvmin[2]));
  let tmax = Math.min(tvmax[0], Math.min(tvmax[1], tvmax[2]));

  // console.log('box hit test', max, min, t1, t2, tvmax, tvmin, tmax, tmin);

  if (tmax - tmin < -EPS) {
    return -1.;
  }

  if (tmin > -EPS) {
    return tmin + EPS;
  }

  return tmax + EPS;
}

function decodeChild(index: number): {isLeaf: boolean, offset: number} {
  return {
    isLeaf: (index >> 31) !== 0,
    offset: (index << 1) >> 1,
  };
}

function getBVHNodeInfo(bvh: H.BVH, index: number): BVHNode {
  let realOffset = index * 4;
  let data0 = bvh.buffer.slice(realOffset, realOffset + 4);
  let data1 = bvh.buffer.slice(realOffset + 4, realOffset + 8);
  let child0 = new Uint32Array(data0.buffer, 0, 1)[0];
  let child1 = new Uint32Array(data1.buffer, 0, 1)[0];

  return {
    child0Index: child0,
    child1Index: child1,
    min: data0.slice(1),
    max: data1.slice(1)
  };
}

function hitTest(bvh: H.BVH, ray: Ray, positions: Float32Array): FragmentInfo {
  let fragInfo: FragmentInfo = {
    hit: false,
    t: Infinity,
    hitPoint: null,
    weights: null
  };
  let nodeStack: number[] = Array(bvh.maxDepth);
  nodeStack[0] = 0;
  let stackDepth: number = 0;

  while (stackDepth >= 0) {
    const {isLeaf, offset} = decodeChild(nodeStack[stackDepth]);
    stackDepth -= 1;

    if (isLeaf) {
      const info = leafHitTest(bvh, ray, positions, offset);
      console.log('leaf hit', info.hit && info.t < fragInfo.t);

      if (info.hit && info.t < fragInfo.t) {
        fragInfo = info;
      }

      continue;
    }

    const node = getBVHNodeInfo(bvh, offset);
    const hited = boxHitTest(ray, node.max, node.min);
    console.log('box hit', offset, node, hited, !(hited < 0 || hited > fragInfo.t));

    if (hited < 0) {
      continue;
    }

    stackDepth += 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth += 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  return fragInfo;
}

function getBVHLeafInfo(bvh: H.BVH, offset: number): BVHLeaf {
  let realOffset = offset * 4;
  let data = new Uint32Array(bvh.buffer.buffer, realOffset * 4, 4);

  return {
    primitives: data[0],
    indexes: data.slice(1)
  };
}

function triangleHitTest(ray: Ray, leaf: BVHLeaf, positions: Float32Array): FragmentInfo {
  const info: FragmentInfo = {
    hit: false,
    t: Infinity,
    hitPoint: null,
    weights: null
  };
  let indexes = leaf.indexes;
  let p0 = positions.slice(indexes[0] * 4, indexes[0] * 4 + 4);
  let p1 = positions.slice(indexes[1] * 4, indexes[1] * 4 + 4);
  let p2 = positions.slice(indexes[2] * 4, indexes[2] * 4 + 4);

  let e0 = H.math.vec3.sub(new Float32Array(3), p1, p0);
  let e1 = H.math.vec3.sub(new Float32Array(3), p2, p0);
  let p = H.math.vec3.cross(new Float32Array(3), ray.dir, e1);
  let det = H.math.vec3.dot(e0, p);
  let t = H.math.vec3.sub(new Float32Array(3), ray.origin, p0);

  if (det < 0) {
    H.math.vec3.scale(t, t, -1);
    det = -det;
  }

  if (det < 0.0001) {
    return info;
  }

  let u = H.math.vec3.dot(t, p);

  if (u < 0. || u > det) {
    return info;
  }

  let q = H.math.vec3.cross(new Float32Array(3), t, e0);
  let v = H.math.vec3.dot(ray.dir, q);

  // plotS.push(`Graphics3D[Triangle[{{${p0.join(',')}}, {${p1.join(',')}}, {${p2.join(',')}}}]]`);
  // console.log(det, u, v, v + u - det, H.math.vec3.dot(e1, q) / det)

  if (v < 0 || v + u - det > 0) {
    return info;
  }
  
  let lt = H.math.vec3.dot(e1, q);

  if (lt < 0.) {
    return info;
  }

  let invDet = 1. / det;
  let hitPoint = H.math.vec3.add(
    new Float32Array(3), ray.origin,
    H.math.vec3.scale(new Float32Array(3), ray.dir, lt * invDet)
  ) as Float32Array;
  let weights = H.math.vec3.scale(new Float32Array(3), new Float32Array([0., u, v]), invDet) as Float32Array;
  weights[0] = 1. - weights[1] - weights[2];
  
  info.hit = true;
  info.weights = weights;
  info.hitPoint = hitPoint;
  info.t = lt * invDet;

  return info;
}

function leafHitTest(bvh: H.BVH, ray: Ray, positions: Float32Array, offset: number): FragmentInfo {
  let leaf: BVHLeaf = getBVHLeafInfo(bvh, offset);
  let info: FragmentInfo = {
    hit: false,
    t: Infinity,
    hitPoint: null,
    weights: null
  };
  console.log(new Uint32Array([(offset + 0) | 0x80000000])[0], leaf);

  for (let i: number = 0; i < leaf.primitives; i = i + 1) {
    leaf = getBVHLeafInfo(bvh, offset + i);
    let cInfo = triangleHitTest(ray, leaf, positions);
    console.log('triangle hit', new Uint32Array([(offset + i) | 0x80000000])[0], cInfo, cInfo.hit && cInfo.t < info.t);

    if (cInfo.hit && cInfo.t < info.t) {
      info = cInfo;
    }
  }

  return info;
}

function hitTestShadow(bvh: H.BVH, ray: Ray, maxT: number, positions: Float32Array): FragmentInfo {
  let fragInfo: FragmentInfo = {
    hit: false,
    t: maxT,
    hitPoint: null,
    weights: null
  };
  let nodeStack: number[] = Array(bvh.maxDepth);
  nodeStack[0] = 0;
  let stackDepth: number = 0;

  while (stackDepth >= 0) {
    const {isLeaf, offset} = decodeChild(nodeStack[stackDepth]);
    stackDepth -= 1;

    if (isLeaf) {
      const info = leafHitTest(bvh, ray, positions, offset);
      console.log('leaf hit', info.hit);

      if (info.hit && info.t < maxT) {
        return info;
      }

      continue;
    }

    const node = getBVHNodeInfo(bvh, offset);
    const hited = boxHitTest(ray, node.max, node.min);
    // plotS.push(`Graphics3D[Cuboid[{${node.max.join(',')}}, {${node.min.join(',')}}]]`);
    console.log('box hit', offset, node.child0Index, node.child1Index, node.max, node.min, hited);

    if (hited < 0) {
      continue;
    }

    stackDepth += 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth += 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  return fragInfo;
}
