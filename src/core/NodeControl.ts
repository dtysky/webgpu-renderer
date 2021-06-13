/**
 * NodeControl.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/13/2021, 8:47:22 PM
*/
import { quat, vec3 } from 'gl-matrix';
import HObject from './HObject';
import Node from './Node';
import renderEnv from './renderEnv';

export default class NodeControl extends HObject {
  public static CLASS_NAME: string = 'NodeControl';
  public isNodeControl: boolean = true;

  protected _start: boolean = false;
  protected _x: number;
  protected _y: number;
  protected _target: Node;

  constructor() {
    super();

    const {canvas} = renderEnv;

    canvas.addEventListener('mousedown', this._handleStart);
    canvas.addEventListener('mouseup', this._handleEnd);
    canvas.addEventListener('mouseleave', this._handleEnd);
    canvas.addEventListener('mouseout', this._handleEnd);
    canvas.addEventListener('mousemove', this._handleMove);
  }

  public control(node: Node) {
    this._target = node;
  }

  protected _handleStart = (event: MouseEvent) => {
    this._x = event.clientX;
    this._y = event.clientY;
    this._start = true;
  }

  protected _handleEnd = (event: MouseEvent) => {
    this._start = false;
  }

  protected _handleMove = (event: MouseEvent) => {
    const {_start, _target, _x, _y} = this;

    if (!_start || !_target) {
      return;
    }

    const {clientX, clientY} = event;
    const dy = (clientX - _x) / 200;
    const dx = (clientY - _y) / 200;

    quat.rotateX(_target.quat, _target.quat, dx);
    const tmpQuat = quat.invert(new Float32Array(4), _target.quat);
    const up = new Float32Array([0, 1, 0]);
    vec3.transformQuat(up, up, tmpQuat);
    quat.setAxisAngle(tmpQuat, up, dy);
    quat.multiply(_target.quat, _target.quat, tmpQuat);

    this._x = clientX;
    this._y = clientY;
  }
}
