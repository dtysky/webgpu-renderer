/**
 * @File   : Mesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:05
 */
import Node from './Node';
import Geometry from './Geometry';
import Material from './Material';

export default class Mesh extends Node {
  public className: string = 'Mesh';
  public isMesh: boolean = true;

  public sortZ: number = 0;

  constructor(
    protected _geometry: Geometry,
    protected _material: Material
  ) {
    super();
  }
}
