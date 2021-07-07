/**
 * @File   : BVH.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/15/2021, 11:14:51 PM
 */
import { buildinEffects } from '../buildin';
import Geometry from '../core/Geometry';
import HObject from '../core/HObject';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import { callWithProfile, copyTypedArray, nthElement, partition } from '../core/shared';

enum EAxis {
  X,
  Y,
  Z
};

export class Bounds {
  public static BUILD_BOX_MAX_MIN_ORDER = [
    // 0 is min, i is max
    [1, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
    [1, 0, 1],
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 1]
  ];

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
    const { size } = this;

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
    const { max, min } = bounds;

    for (let index = 0; index < 3; index += 1) {
      this.max[index] = Math.max(this.max[index], max[index]);
      this.min[index] = Math.min(this.min[index], min[index]);
    }

    this._isDirty = true;
    return this;
  }

  public pointIn(p: Float32Array): boolean {
    const {max, min} = this;
    return p[0] > min[0] && p[0] < max[0]
      && p[1] > min[1] && p[1] < max[1]
      && p[2] > min[2] && p[2] < max[2];
  }

  public getOffset(axis: EAxis, v: Float32Array) {
    let offset = v[axis] - this.min[axis];

    if (this.max[axis] > this.min[axis]) {
      offset /= (this.max[axis] - this.min[axis]);
    }

    return offset;
  }

  public buildBox(mode: 'lines' | 'triangles'): {positions: number[], indexes: number[]} {
    const {max, min} = this;
    const positions = [];
    
    Bounds.BUILD_BOX_MAX_MIN_ORDER.forEach(order => {
      for (let i = 0; i < 3; i += 1) {
        positions.push(order[i] ? max[i] : min[i])
      }
    });
    
    let indexes: number[];
    if (mode === 'lines') {
      indexes = [
        0, 1, 1, 2, 2, 3, 3, 0,
        4, 5, 5, 6, 6, 7, 7, 4,
        0, 4, 1, 5, 2, 6, 3, 7
      ];
    } else {
      indexes = [
        0, 1, 2, 2, 3, 0,
        4, 5, 6, 6, 7, 4,
        0, 4, 5, 5, 1, 0,
        1, 5, 6, 6, 2, 1,
        3, 2, 6, 6, 7, 3,
        0, 3, 7, 7, 4, 0
      ];
    }

    return {positions, indexes};
  }

  private _updateCenterSize() {
    if (this._isDirty) {
      this._center = this.max.map((m, i) => (m + this.min[i]) / 2);
      this._size = this.max.map((m, i) => m - this.min[i]);
      this._isDirty = false;
    }
  }
}

export interface IBVHNode {
  axis: EAxis;
  bounds: Bounds;
  child0: IBVHNode | IBVHLeaf;
  child1: IBVHNode | IBVHLeaf;
  depth: number;
}

export interface IBVHLeaf {
  // three points
  infoStart: number;
  infoEnd: number;
  bounds: Bounds;
}

interface IBoundsInfo {
  indexes: Uint32Array;
  bounds: Bounds;
}

function isBVHLeaf(value: IBVHNode | IBVHLeaf) : value is IBVHLeaf {
  return (value as IBVHLeaf).infoEnd !== undefined;
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
  protected _bvhMaxDepth: number;
  protected _bvhBuffer: Float32Array;
  protected _bvhNodes: IBVHNode[];
  protected _bvhLeaves: IBVHLeaf[];
  protected _debugMesh: Mesh;

  get maxDepth() {
    return this._bvhMaxDepth;
  }

  /**
   * nodes | leaves
   * nodes: child0 and min3(f32), child1(u32) and max3(f32)
   * leaves: primitives count(u32), indexes3(u32),
   * child info: 1bit type(0 is node, 1 is leaf) and 31bits offset(in vec4)
   */
  get buffer() {
    return this._bvhBuffer;
  }

  get debugMesh() {
    if (!this._debugMesh) {
      this._buildDebugMesh();
    }

    return this._debugMesh;
  }

  get nodesCount() {
    return this._bvhNodes.length;
  }

  get leavesCount() {
    return this._bvhLeaves.length;
  }

  constructor(protected _maxPrimitivesPerLeaf: number) {
    super();
  }

  public process = (worldPositions: Float32Array, indexes: Uint32Array) => {
    callWithProfile('BVH setup bounds info', this._setupBoundsInfo, [worldPositions, indexes]);
    callWithProfile('BVH build tree', this._buildTree, []);
    callWithProfile('BVH flatten', this._flatten, []);

    this._debugMesh = null;
  }

  protected _setupBoundsInfo = (worldPositions: Float32Array, indexes: Uint32Array) => {
    this._boundsInfos = [];

    for (let i = 0; i < indexes.length; i += 3) {
      const idxes = indexes.slice(i, i + 3);

      copyTypedArray(3, tmpV1, 0, worldPositions, idxes[0] * 4);
      copyTypedArray(3, tmpV2, 0, worldPositions, idxes[1] * 4);
      copyTypedArray(3, tmpV3, 0, worldPositions, idxes[2] * 4);

      const bounds = new Bounds().fromVertexes(tmpV1, tmpV2, tmpV3);

      this._boundsInfos.push({indexes: idxes, bounds});
    }
  }

  protected _buildTree = () => {
    this._rootNode = this._buildRecursive(0, this._boundsInfos.length, 0) as IBVHNode;
  }

  protected _buildRecursive(start: number, end: number, depth: number): IBVHNode | IBVHLeaf {
    const {_boundsInfos} = this;

    const bounds = new Bounds().initEmpty();
    for (let i = start; i < end; i += 1) {
      bounds.mergeBounds(_boundsInfos[i].bounds);
    }

    const nPrimitives = end - start;

    if (nPrimitives <= this._maxPrimitivesPerLeaf) {
      return { infoStart: start, infoEnd: end, bounds };
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
        const buckets: { bounds: Bounds, count: number }[] = [];
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

        const cost: number[] = [];

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

      const child0 = this._buildRecursive(start, mid, depth + 1);
      const child1 = this._buildRecursive(mid, end, depth + 1);

      return {
        axis: dim,
        bounds: new Bounds().initEmpty().mergeBounds(child0.bounds).mergeBounds(child1.bounds),
        child0,
        child1,
        depth
      };
    }
  }

  protected _flatten = () => {
    this._bvhLeaves = [];
    this._bvhNodes = [];
    const flatInfo = {maxDepth: 1, nodes: [], leaves: []};
    this._traverseNode(this._rootNode, flatInfo);

    const {maxDepth, nodes, leaves} = flatInfo;
    const buffer = new ArrayBuffer(4 * (nodes.length + leaves.length));
    const f32View = new Float32Array(buffer);
    const u32View = new Uint32Array(buffer);
    const nodesLen = nodes.length;

    this._bvhMaxDepth = maxDepth;
    f32View.set(nodes);
    u32View.set(leaves, nodesLen);

    for (let i = 0; i < nodesLen; i += 8) {
      for (let ci = 0; ci < 8; ci += 4) {
        const offset = i + ci;

        if (nodes[offset] & 0x80000000) {
          // leaf
          u32View[offset] = nodes[offset] + nodesLen / 4;
        } else {
          // node
          u32View[offset] = nodes[offset];
        }
      }
    }

    this._bvhMaxDepth = flatInfo.maxDepth;
    this._bvhBuffer = f32View;
  }

  protected _traverseNode = (
    node: IBVHNode | IBVHLeaf,
    // nodes: 2 children info and 6 float BVHNode bounding info
    // children: use two uint32 store 2 children's info: 1bit type(0 is node, 1 is leaf) + 31bits index offset
    // leaves: BVHLeaf index and length info
    info: {maxDepth: number, nodes: number[], leaves: number[]},
    depth: number = 1,
    parentOffset: number = -1,
    childIndex: number = 0
  ) => {
    info.maxDepth = Math.max(depth, info.maxDepth);
    const {nodes, leaves} = info;
    const {_boundsInfos, _bvhNodes, _bvhLeaves} = this;

    if (isBVHLeaf(node)) {
      _bvhLeaves.push(node);
      if (parentOffset >= 0) {
        nodes[parentOffset * 8 + childIndex] = (1 << 31) | (leaves.length / 4);
      }

      const count = node.infoEnd - node.infoStart;
      for (let i = node.infoStart; i < node.infoEnd; i += 1) {
        const idxes = _boundsInfos[i].indexes;

        leaves.push(count, idxes[0], idxes[1], idxes[2]);
      }
    } else {
      _bvhNodes.push(node);
      const bounds = node.bounds;
      const nodeOffset = nodes.length / 8;

      if (parentOffset >= 0) {
        nodes[parentOffset * 8 + childIndex] = nodeOffset * 2;
      }

      nodes.push(
        0, bounds.min[0], bounds.min[1], bounds.min[2],
        0, bounds.max[0], bounds.max[1], bounds.max[2]
      );

      this._traverseNode(node.child0, info, depth + 1, nodeOffset, 0);
      this._traverseNode(node.child1, info, depth + 1, nodeOffset, 4);
    }
  }

  protected _buildDebugMesh() {
    const {_bvhNodes, _bvhMaxDepth} = this;
    const mode = 'lines' as 'lines' | 'triangles';

    const nodesLen = _bvhNodes.length;
    // per box has 8 vertex
    const positions = new Float32Array(nodesLen * 8 * 3);
    const colors = new Float32Array(nodesLen * 8 * 3);
    let indexes: Uint32Array;
    if (mode === 'lines') {
      indexes = new Uint32Array(nodesLen * 24);
    } else {
      indexes = new Uint32Array(nodesLen * 36);
    }

    const toteLDepthCount: number[] = new Array(_bvhMaxDepth).fill(0);
    const depthCount: number[] = new Array(_bvhMaxDepth).fill(0);
    _bvhNodes.forEach(node => {
      toteLDepthCount[node.depth] += 1;
    });

    let index = 0;
    _bvhNodes.forEach(node => {
      const box = node.bounds.buildBox(mode);
      const offset = index * 8;
      const pOffset = index * 8 * 3;
      const cOffset = index * 8 * 3;
      const iOffset = index * box.indexes.length;

      const color = hslToRgb(
        node.depth / _bvhMaxDepth,
        (depthCount[node.depth] / toteLDepthCount[node.depth]) * 0.7 + 0.3,
        0.5
      );
      for (let ci = 0; ci < 24; ci += 3) {
        colors.set(color, cOffset + ci);
      }
      
      indexes.set(box.indexes.map(v => v + offset), iOffset);
      positions.set(box.positions, pOffset);
      
      index += 1;
      depthCount[node.depth] += 1;
    });

    this._debugMesh = new Mesh(
      new Geometry([
        {
          layout: {
            attributes: [{
              name: 'position',
              shaderLocation: 0,
              format: 'float32x3',
              offset: 0
            }],
            arrayStride: 12
          },
          data: positions
        },
        {
          layout: {
            attributes: [{
              name: 'color_0',
              shaderLocation: 1,
              format: 'float32x3',
              offset: 0
            }],
            arrayStride: 12
          },
          data: colors
        }
      ], indexes, indexes.length),
      new Material(
        buildinEffects.rColor,
        {u_color: new Float32Array([1, 1, 1, .4])},
        undefined,
        {
          primitiveType: mode === 'lines' ? 'line-list' : 'triangle-list',
          cullMode: 'none',
          blendColor: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha'
          },
          blendAlpha: {
            srcFactor: 'zero',
            dstFactor: 'one'
          }
        }
      )
    );
  }
}

function hue2rgb(p: number, q: number, t: number) {
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < 1/6) return p + (q - p) * 6 * t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number){
  let r: number, g: number, b: number;

  if(s == 0){
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
}
