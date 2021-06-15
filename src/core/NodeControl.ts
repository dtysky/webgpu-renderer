/**
 * NodeControl.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
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
  protected _touchId: number;
  protected _target: Node;

  constructor() {
    super();

    const {canvas} = renderEnv;

    canvas.addEventListener('mousedown', this._handleStart);
    canvas.addEventListener('mouseup', this._handleEnd);
    canvas.addEventListener('mouseleave', this._handleEnd);
    canvas.addEventListener('mouseout', this._handleEnd);
    canvas.addEventListener('mousemove', this._handleMove);

    canvas.addEventListener('touchstart', this._handleTouchStart);
    canvas.addEventListener('touchend', this._handleEnd);
    canvas.addEventListener('touchcancel', this._handleEnd);
    canvas.addEventListener('touchmove', this._handleTouchMove);
  }

  public control(node: Node) {
    this._target = node;
  }

  protected _handleStart = (event: {clientX: number, clientY: number}) => {
    this._x = event.clientX;
    this._y = event.clientY;
    this._start = true;
  }

  protected _handleEnd = () => {
    this._start = false;
  }

  protected _handleMove = (event: {clientX: number, clientY: number}) => {
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

  protected _handleTouchStart = (event: TouchEvent) => {
    const touch = event.targetTouches[0];
    this._touchId = touch.identifier;
    this._handleStart(touch);
  }

  protected _handleTouchMove = (event: TouchEvent) => {
    if (!this._start) {
      return;
    }

    for (let i = 0; i < event.targetTouches.length; i += 1) {
      const touch = event.targetTouches[i];

      if (touch.identifier === this._touchId) {
        return this._handleMove(touch);
      }
    }

    this._handleEnd();
  }
}
