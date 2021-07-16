/**
 * NodeControl.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/13/2021, 8:47:22 PM
*/
import { mat4, quat, vec3 } from 'gl-matrix';
import renderEnv from '../core/renderEnv';
import HObject from '../core/HObject';
import Node from '../core/Node';

const tmpV0 = new Float32Array(3);
const tmpV1 = new Float32Array(3);
const tmpV2 = new Float32Array(3);
const tmpQ1 = new Float32Array(4);
const tmpMat = new Float32Array(16);
const UP = new Float32Array([0, 1, 0]);

export default class NodeControl extends HObject {
  public static CLASS_NAME: string = 'NodeControl';
  public isNodeControl: boolean = true;
  public onChange: () => void;

  protected _start: boolean = false;
  protected _x: number;
  protected _y: number;
  protected _touchId: number;
  protected _node: Node;
  protected _target: Node;
  protected _arcRadius: number;

  constructor(protected _mode: 'free' | 'arc' = 'free') {
    super();

    const {canvas} = renderEnv;

    canvas.addEventListener('mousedown', this._handleStart);
    canvas.addEventListener('mouseup', this._handleEnd);
    canvas.addEventListener('mouseleave', this._handleEnd);
    canvas.addEventListener('mouseout', this._handleEnd);
    canvas.addEventListener('mousemove', this._handleMove);
    canvas.addEventListener('wheel', this._handleZoom);

    canvas.addEventListener('touchstart', this._handleTouchStart);
    canvas.addEventListener('touchend', this._handleEnd);
    canvas.addEventListener('touchcancel', this._handleEnd);
    canvas.addEventListener('touchmove', this._handleTouchMove);
  }

  public control(node: Node, target?: Node) {
    this._node = node;
    this._target = target;

    if (!target && this._mode === 'arc') {
      throw new Error('Mode arc must be given target!');
    }
  }

  protected _handleStart = (event: {clientX: number, clientY: number}) => {
    this._x = event.clientX;
    this._y = event.clientY;

    if (this._mode === 'arc') {
      this._arcRadius = vec3.distance(
        mat4.getTranslation(tmpV0, this._target.worldMat),
        mat4.getTranslation(tmpV1, this._node.worldMat)
      );
    }

    this._start = true;
  }

  protected _handleEnd = () => {
    this._start = false;
  }

  protected _handleMove = (event: {clientX: number, clientY: number}) => {
    const {_start, _node, _x, _y} = this;

    if (!_start || !_node) {
      return;
    }

    const {clientX, clientY} = event;
    const dy = (clientX - _x) / 200;
    const dx = (clientY - _y) / 200;

    if (this._mode === 'free') {
      quat.rotateX(_node.quat, _node.quat, dx);
      quat.invert(tmpQ1, _node.quat);
      const up = new Float32Array([0, 1, 0]);
      vec3.transformQuat(up, up, tmpQ1);
      quat.setAxisAngle(tmpQ1, up, dy);
      quat.multiply(_node.quat, _node.quat, tmpQ1);
    } else {
      mat4.getTranslation(tmpV0, this._target.worldMat);
      mat4.getTranslation(tmpV1, this._node.worldMat);
      tmpV1[0] += dy * 2;
      tmpV1[1] += dx * 2;
      const forward = vec3.sub(tmpV2, tmpV0, tmpV1);
      vec3.normalize(forward, forward);
      vec3.scale(forward, forward, -this._arcRadius);
      vec3.add(tmpV1, tmpV0, forward);
      mat4.lookAt(tmpMat, tmpV1, tmpV0, UP);
      this._node.pos.set(tmpV1);
      mat4.getRotation(this._node.quat, tmpMat);
    }

    this._x = clientX;
    this._y = clientY;

    this.onChange && this.onChange()
  }

  protected _handleZoom = (event: WheelEvent) => {
    const {worldMat, pos} = this._node;
    let delta = event.deltaY / 200;
    let forward = worldMat.slice(8, 12);

    if (this._mode === 'arc') {
      mat4.getTranslation(tmpV0, this._target.worldMat);
      mat4.getTranslation(tmpV1, this._node.worldMat);
      vec3.sub(forward, tmpV0, tmpV1);
      delta = -delta;
    }

    vec3.normalize(forward, forward);
    vec3.scale(forward, forward, delta);
    vec3.add(pos, pos, forward);

    if (this._mode === 'arc') {
      this._arcRadius += delta;
    }

    this.onChange && this.onChange()
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
