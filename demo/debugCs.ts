/**
 * @File   : debugCS.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/26/2021, 7:40:32 PM
 */
import * as H from '../src';

export class DebugInfo {
  protected _cpu: Float32Array;
  protected _gpu: GPUBuffer;
  protected _view: GPUBuffer;
  protected _size: number;

  constructor() {
    const {renderEnv} = H;
    const size = this._size = 4 * 5;

    this._cpu = new Float32Array(size * renderEnv.width * renderEnv.height);
    this._gpu = H.createGPUBuffer(this._cpu, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC);
    this._view = H.createGPUBufferBySize(size * renderEnv.width * renderEnv.height * 4, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST);
  }

  public setup(rtUnit: H.ComputeUnit) {
    rtUnit.setUniform('u_debugInfo', this._cpu, this._gpu)
  }

  public run(scene: H.Scene) {
    scene.copyBuffer(this._gpu, this._view, this._cpu.byteLength);
  }

  public async showDebugInfo(start: number, end: number): Promise<{origin: Float32Array, dir: Float32Array}[]> {
    await this._view.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(this._view.getMappedRange());
    const rays = this._decodeDebugInfo(data, start, end);
    console.log(rays);

    return rays;
  }

  protected _decodeDebugInfo(view: Float32Array, start: number, end: number) {
    const res: {origin: Float32Array, dir: Float32Array}[] = [];

    for (let index = start; index < end; index += 1) {
      const offset = index * this._size;
      res.push({
        origin: view.slice(offset, offset + 3),
        dir: view.slice(offset + 4, offset + 7),
        normal: view.slice(offset + 8, offset + 11),
        preOrigin: view.slice(offset + 12, offset + 15),
        preDir: view.slice(offset + 16, offset + 19)
      } as any);

      if (view[offset + 3] !== 0) {
        console.log('not hited', index, view[offset + 3]);
      }
    }

    return res;
  }
}

export function debugRay(rayInfo: {origin: Float32Array, dir: Float32Array}, bvh: H.BVH, positions: Float32Array) {
  const ray: Ray = {
    origin: rayInfo.origin,
    dir: rayInfo.dir,
    invDir: new Float32Array(3)
  };
  H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);

  console.log('ray', ray);

  const hitedNode = hitTest(bvh, ray);
  console.log(hitedNode);

  if (!hitedNode) {
    return;
  }

  if (hitedNode.isChild0Leaf) {
    console.log(leafHitTest(bvh, ray, positions, hitedNode.child0Offset));
    return;
  }

  if (hitedNode.isChild1Leaf) {
    console.log(leafHitTest(bvh, ray, positions, hitedNode.child1Offset));
  }
}

export function debugCamera(camera: H.Camera, bvh: H.BVH, positions: Float32Array) {
  for (let i = 0; i < 10; i += 1) {
    const uv = new Float32Array([Math.random() / 2, Math.random() / 2]);
    const ssPos = new Float32Array([uv[0] * 2 - 1, 1 - uv[1] * 2, 0, 1]);
    const worldPos = H.math.vec4.transformMat4(new Float32Array(4), ssPos, camera.invProjMat);
    H.math.vec4.transformMat4(worldPos, worldPos, camera.invViewMat);
    console.log(worldPos)
    H.math.vec4.scale(worldPos, worldPos, 1 / worldPos[3]);
    const dir = H.math.vec3.sub(new Float32Array(3), worldPos.slice(0, 3) as Float32Array, camera.pos) as Float32Array;
    H.math.vec3.normalize(dir, dir);

    console.log('uv, ssPos, worldPos', uv, ssPos, worldPos);

    const ray: Ray = {
      origin: camera.pos,
      dir,
      invDir: new Float32Array(3)
    };
    H.math.vec3.div(ray.invDir, new Float32Array([1, 1, 1]), ray.dir);

    const hitedNode = hitTest(bvh, ray);
    console.log(hitedNode);

    if (!hitedNode) {
      continue;
    }

    if (hitedNode.isChild0Leaf) {
      console.log(leafHitTest(bvh, ray, positions, hitedNode.child0Offset));
      continue;
    }

    if (hitedNode.isChild1Leaf) {
      console.log(leafHitTest(bvh, ray, positions, hitedNode.child1Offset));
    }
  }
}

const FLOAT_ZERO = -0.005;

interface Ray {
  origin: Float32Array;
  dir: Float32Array;
  invDir: Float32Array;
};


interface BVHNode {
  isChild0Leaf: boolean;
  isChild1Leaf: boolean;
  child0Offset: number;
  child1Offset: number;
  max: Float32Array;
  min: Float32Array;
};

interface BVHLeaf {
  primitives: number;
  indexes: Uint32Array;
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

  console.log('box hit test', max, min, t1, t2, tvmax, tvmin, tmax, tmin);

  if (tmax - tmin < FLOAT_ZERO || tmin > 9999) {
    return -1.;
  }

  if (tmin > FLOAT_ZERO) {
    return tmin - FLOAT_ZERO;
  }

  return tmax - FLOAT_ZERO;
}

function getBVHNodeInfo(bvh: H.BVH, index: number): BVHNode {
  let realOffset = index * 4;
  let data0 = bvh.buffer.slice(realOffset, realOffset + 4);
  let data1 = bvh.buffer.slice(realOffset + 4, realOffset + 8);
  let child0 = new Uint32Array(data0.buffer, 0, 1)[0];
  let child1 = new Uint32Array(data1.buffer, 0, 1)[0];

  return {
    isChild0Leaf: (child0 >> 31) !== 0,
    isChild1Leaf: (child1 >> 31) !== 0,
    child0Offset: (child0 << 1) >> 1,
    child1Offset: (child1 << 1) >> 1,
    min: data0.slice(1),
    max: data1.slice(1)
  };
}

function hitTest(bvh: H.BVH, ray: Ray): BVHNode {
  let node: BVHNode = getBVHNodeInfo(bvh, 0);
  let hited = boxHitTest(ray, node.max, node.min);
  console.log('start', node, hited);

  if (hited <= 0.) {
    return null;
  }

  for (let i = 0; i < bvh.maxDepth; i = i + 1) {
    if (node.isChild0Leaf) {
      break;
    }

    if (node.isChild1Leaf) {
      break;
    }

    let child0Offset = node.child0Offset;
    let child1Offset = node.child1Offset;

    node = getBVHNodeInfo(bvh, child0Offset);
    hited = boxHitTest(ray, node.max, node.min);

    console.log('child0', node, hited);

    if (hited > 0) {
      continue;
    }

    node = getBVHNodeInfo(bvh, child1Offset);
    hited = boxHitTest(ray, node.max, node.min);

    console.log('child1', node, hited);

    if (hited < 0) {
      return null;
    }
  }

  return node;
}

function getBVHLeafInfo(bvh: H.BVH, offset: number): BVHLeaf {
  let realOffset = offset * 4;
  let data = new Uint32Array(bvh.buffer.buffer, realOffset * 4, 4);

  return {
    primitives: data[0],
    indexes: data.slice(1)
  };
}

function triangleHitTest(ray: Ray, leaf: BVHLeaf, positions: Float32Array): boolean {
  let indexes = leaf.indexes;
  let p0 = positions.slice(indexes[0] * 3, indexes[0] * 3 + 3);
  let p1 = positions.slice(indexes[1] * 3, indexes[1] * 3 + 3);
  let p2 = positions.slice(indexes[2] * 3, indexes[2] * 3 + 3);

  let e0 = H.math.vec3.sub(new Float32Array(3), p1, p0);
  let e1 = H.math.vec3.sub(new Float32Array(3), p2, p0);
  let p = H.math.vec3.cross(new Float32Array(3), ray.dir, e1);
  let det = H.math.vec3.dot(e0, p);
  let t = H.math.vec3.sub(new Float32Array(3), ray.origin, p0);

  console.log('triangle hit test', p0, p1, p2, e0, e1, p, det, t);

  if (det < 0.) {
    H.math.vec3.scale(t, t, -1);
    det = -det;
  }

  if (det < 0.0001) {
    return false;
  }

  let u = H.math.vec3.dot(t, p);

  if (u < 0. || u > det) {
    return false;
  }

  let q = H.math.vec3.cross(new Float32Array(3), t, e0);
  let v = H.math.vec3.dot(ray.dir, q);

  if (v < 0. || v + u > det) {
    return false;
  }

  let lt = H.math.vec3.dot(e1, q);
  let invDet = 1. / det;
  let hitPoint = H.math.vec3.add(
    new Float32Array(3), ray.origin,
    H.math.vec3.scale(new Float32Array(3), ray.dir, lt * invDet)
  );
  let weights = H.math.vec3.scale(new Float32Array(3), new Float32Array([0., u, v]), invDet);
  weights[0] = 1. - weights[1] - weights[2];

  console.log('hitPoint, weights', hitPoint, weights);

  return true;
}

function leafHitTest(bvh: H.BVH, ray: Ray, positions: Float32Array, offset: number): BVHLeaf {
  var leaf: BVHLeaf = getBVHLeafInfo(bvh, offset);

  for (var i: number = 0; i < leaf.primitives; i = i + 1) {
    if (triangleHitTest(ray, leaf, positions)) {
      return leaf;
    }

    leaf = getBVHLeafInfo(bvh, offset + i);
  }

  return null;
}
