/**
 * @File   : BVH.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/15/2021, 11:14:51 PM
 */
import { vec3 } from 'gl-matrix';
import HObject from '../core/HObject';
import { callWithProfile, copyTypedArray, nthElement, partition } from '../core/shared';

enum EAxis {
  X,
  Y, 
  Z
};

class Bounds {
  public max: Float32Array;
  public min: Float32Array;
  
  private _isDirty: boolean = false;
  private _center: Float32Array;
  private _size: Float32Array;

  get center() {
    if (!this._center || this._isDirty) {
      this._updateCenterSize();
    }

    return this._center;
  }

  get size() {
    if (!this._size || this._isDirty) {
      this._updateCenterSize();
    }

    return this._size;
  }

  get maxExtends(): EAxis {
    const size = this.size;
    if (size[0] > size[2]) {
      return size[0] > size[1] ? EAxis.X : EAxis.Y;
    } else {
      return size[1] > size[2] ? EAxis.Z : EAxis.Y;
    }
  }

  get surfaceArea() {
    const {size} = this;

    return 2 * (size[0] * size[2] + size[0] * size[1] + size[2] * size[1]);
  }

  public initEmpty() {
    this.max = new Float32Array([-Infinity, -Infinity, -Infinity]);
    this.min = new Float32Array([Infinity, Infinity, Infinity]);

    return this;
  }

  public fromVertexes(v1: Float32Array, v2: Float32Array, v3: Float32Array) {
    this.max = v1.slice();
    this.min = v1.slice();

    this.update(v2).update(v3);

    return this;
  }

  public update(v: Float32Array) {
    for (let index = 0; index < 3; index += 1) {
      this.max[index] = Math.max(this.max[index], v[index]);
      this.min[index] = Math.min(this.min[index], v[index]);
    }

    this._isDirty = true;
    return this;
  }

  public mergeBounds(bounds: Bounds) {
    const {max, min} = bounds;

    for (let index = 0; index < 3; index += 1) {
      this.max[index] = Math.max(this.max[index], max[index]);
      this.min[index] = Math.min(this.min[index], min[index]);
    }

    this._isDirty = true;
    return this;
  }

  public getOffset(axis: EAxis, v: Float32Array) {
    let offset = v[axis] - this.min[axis];

    if (this.max[axis] > this.min[axis]) {
      offset /= (this.max[axis] - this.min[axis]);
    }

    return offset;
  }

  private _updateCenterSize() {
    if (this._isDirty) {
      this._center = this.max.map((m, i) => (m + this.min[i]) / 2);
      this._size = this.max.map((m, i) => m - this.min[i]);
      this._isDirty = true;
    }
  }
}

export interface IBVHNode {
  axis: EAxis;
  bounds: Bounds;
  child0?: IBVHNode | IBVHLeaf;
  child1?: IBVHNode | IBVHLeaf;
}

export interface IBVHLeaf {
  // three points
  infoStart: number;
  infoEnd: number;
  bounds: Bounds;
}

interface IBoundsInfo {
  indexes: Uint16Array;
  bounds: Bounds;
}

const tmpV1 = new Float32Array(3);
const tmpV2 = new Float32Array(3);
const tmpV3 = new Float32Array(3);

export default class BVH extends HObject {
  public static CLASS_NAME: string = 'BVH';
  public isBVH: boolean = true;

  // protected _bvhGPUBuffer: GPUBuffer;
  protected _rootNode: IBVHNode;
  protected _boundsInfos: IBoundsInfo[];

  public process = (worldPositions: Float32Array, indexes: Uint16Array) => {
    callWithProfile('BVH setup bounds info', this._setupBoundsInfo, [worldPositions, indexes]);
    callWithProfile('BVH build tree', this._buildTree, []);
    callWithProfile('BVH flatten', this._flatten, []);
  }

  protected _setupBoundsInfo = (worldPositions: Float32Array, indexes: Uint16Array) => {
    this._boundsInfos = [];

    for (let i = 0; i < indexes.length; i += 3) {
      const idxes = indexes.slice(i, i + 3);

      copyTypedArray(3, tmpV1, 0, worldPositions, idxes[0] * 3);
      copyTypedArray(3, tmpV2, 0, worldPositions, idxes[1] * 3);
      copyTypedArray(3, tmpV3, 0, worldPositions, idxes[2] * 3);

      const bounds = new Bounds().fromVertexes(tmpV1, tmpV2, tmpV3);

      this._boundsInfos.push({ indexes: idxes, bounds });
    }
  }

  protected _buildTree = () => {
    this._rootNode = this._buildRecursive(0, this._boundsInfos.length) as IBVHNode;
  }

  protected _buildRecursive(start: number, end: number): IBVHNode | IBVHLeaf {
    const {_boundsInfos} = this;

    const bounds = new Bounds().initEmpty();
    for (let i = start; i < end; i += 1) {
      bounds.mergeBounds(_boundsInfos[i].bounds);
    }

    const nPrimitives = end - start;

    if (nPrimitives === 1) {
      return {infoStart: start, infoEnd: end, bounds};
    } else {
      const centroidBounds = new Bounds().initEmpty();
      for (let i = start; i < end; i += 1) {
        centroidBounds.update(_boundsInfos[i].bounds.center);
      }
      const dim = centroidBounds.maxExtends;

      let mid = Math.floor((start + end) / 2);

      // middle split method
      // const dimMid = (centroidBounds.max[dim] + centroidBounds.min[dim]) / 2;
      // mid = partition(primitiveInfo, p => p.center[dim] < dimMid, start, end);

      // if (mid === start || mid === end) {
      //   mid = Math.floor((start + end) / 2);
      //   nthElement(primitiveInfo, (a, b) => a.center[dim] < b.center[dim], start, end, mid);
      // }

      // surface area heuristic method
      if (nPrimitives <= 4) {
        nthElement(_boundsInfos, (a, b) => a.bounds.center[dim] < b.bounds.center[dim], start, end, mid);
      } else if (centroidBounds.max[dim] === centroidBounds.min[dim]) {
        // can't split primitives based on centroid bounds. terminate.
        return {infoStart: start, infoEnd: end, bounds};
      } else {

        const buckets: {bounds: Bounds, count: number}[] = [];
        for (let i = 0; i < 12; i += 1) {
          buckets.push({bounds: new Bounds().initEmpty(), count: 0});
        }

        for (let i = start; i < end; i += 1) {
          let b = Math.floor(buckets.length * centroidBounds.getOffset(dim, _boundsInfos[i].bounds.center));

          if (b === buckets.length) {
            b = buckets.length - 1;
          }

          buckets[b].count += 1;
          buckets[b].bounds.mergeBounds(_boundsInfos[i].bounds);
        }

        const cost = [];

        for (let i = 0; i < buckets.length - 1; i += 1) {
          const b0 = new Bounds().initEmpty();
          const b1 = new Bounds().initEmpty();
          let count0 = 0;
          let count1 = 0;
          for (let j = 0; j <= i; j += 1) {
            b0.mergeBounds(buckets[j].bounds);
            count0 += buckets[j].count;
          }
          for (let j = i + 1; j < buckets.length; j += 1) {
            b1.mergeBounds(buckets[j].bounds);
            count1 += buckets[j].count;
          }

          cost.push(0.1 + (count0 * b0.surfaceArea + count1 * b1.surfaceArea) / bounds.surfaceArea);
        }

        let minCost = cost[0];
        let minCostSplitBucket = 0;
        for (let i = 1; i < cost.length; i += 1) {
          if (cost[i] < minCost) {
            minCost = cost[i];
            minCostSplitBucket = i;
          }
        }

        mid = partition(_boundsInfos, p => {
          let b = Math.floor(buckets.length * centroidBounds.getOffset(dim, p.bounds.center));
          if (b === buckets.length) {
            b = buckets.length - 1;
          }
          return b <= minCostSplitBucket;
        }, start, end);
      }


      const child0 = this._buildRecursive(start, mid);
      const child1 = this._buildRecursive(mid, end);
      return {
        axis: dim,
        bounds: new Bounds().initEmpty().mergeBounds(child0.bounds).mergeBounds(child1.bounds),
        child0,
        child1
      };
    }
  }

  protected _flatten() {

  }
}
