/**
 * @File   : Node.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:24:26
 */
import HObject from './HObject';
import {mat4, quat, vec3} from 'gl-matrix';

const VEC3_ONES = new Float32Array([1, 1, 1]);

export default class Node extends HObject {
  public static CLASS_NAME: string = 'Node';
  public isNode: boolean = true;

  public active: boolean = true;

  protected _mem: ArrayBuffer;
  protected _pos: Float32Array;
  protected _scale: Float32Array;
  protected _quat: Float32Array;
  protected _worldMat: Float32Array;
  protected _parent: Node;
  protected _children: Node[] = [];

  get pos() {
    return this._pos;
  }

  get scale() {
    return this._scale;
  }

  get quat() {
    return this._quat;
  }

  get worldMat() {
    return this._worldMat;
  }

  constructor() {
    super();

    this._mem = new ArrayBuffer((3 + 3 + 4 + 16) * 4 * 4);
    this._pos = new Float32Array(this._mem, 0, 3);
    (this._scale = new Float32Array(this._mem, 3 * 4, 3)).set(VEC3_ONES);
    this._quat = quat.identity(new Float32Array(this._mem, 6 * 4, 4)) as Float32Array;
    this._worldMat = mat4.identity(new Float32Array(this._mem, 10 * 4, 16)) as Float32Array;
  }

  public addChild(node: Node) {
    this._children.push(node);
    node._parent = this;
  }

  public removeChild(node: Node) {
    const idx = this._children.indexOf(node);

    if (idx >= 0) {
      this._children.splice(idx, 1);
      node._parent = null;
    }
  }

  public setLocalMat(value: Float32Array) {
    this._updateTRSFromMat(value);
  }

  public updateMatrix() {
    this.updateWorldMatrix();
  }

  public updateWorldMatrix(parent?: Node) {
    mat4.fromRotationTranslationScale(this._worldMat, this._quat, this._pos, this._scale);
    parent = parent || this._parent;

    if (parent) {
      mat4.mul(this._worldMat, parent.worldMat, this._worldMat);
    }
  }

  public dfs<T extends any>(callback: (node: Node, params?: T) => T, defaultParams?: T) {
    const params = callback(this, defaultParams);
    const children: Node[] = this._children;

    for (let index = 0; index < children.length; index += 1) {
      const node = children[index];
      node.active && node.dfs(callback, params);
    }
  }

  public updateSubTree(callback?: (node: Node) => void) {
    if (!this.active) {
      return;
    }

    this.dfs<void>((node: Node) => {
      node.updateMatrix();

      callback && callback(node);
    });
  }

  private _updateTRSFromMat(mat: Float32Array) {
    mat4.getTranslation(this._pos, mat);
    mat4.getRotation(this._quat, mat);
    mat4.getScaling(this._scale, mat);
  }
}
