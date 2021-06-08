/**
 * @File   : Mesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午7:25:05
 */
import Node from './Node';
import Geometry from './Geometry';
import Material from './Material';
import renderEnv from './renderEnv';

declare type Camera = import('./Camera').default;

export default class Mesh extends Node {
  public static  CLASS_NAME: string = 'Mesh';
  public isMesh: boolean = true;

  public sortZ: number = 0;

  protected _pipeline: GPURenderPipeline;

  constructor(
    protected _geometry: Geometry,
    protected _material: Material
  ) {
    super();

    const {device, swapChainFormat} = renderEnv;

    this._pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: [
        _material.effect.uniformLayout
      ]}),
  
      vertex: {
        module: _material.effect.vs,
        entryPoint: "main",
        buffers: [_geometry.vertexLayout]
      },
  
      fragment: {
        module: _material.effect.fs,
        targets: [
          {format: swapChainFormat}
        ],
        entryPoint: "main"
      },
  
      primitive: {
        topology: 'triangle-list'
      }
    });
  }

  public render(pass: GPURenderPassEncoder, camera: Camera) {
    const {_geometry, _material} = this;

    _material.setUniform('u_vp', camera.vpMat);
    _material.setUniform('u_world', this._worldMat);

    pass.setVertexBuffer(0, _geometry.vertexes);
    pass.setIndexBuffer(_geometry.indexes, 'uint16');
    pass.setBindGroup(0, _material.bindingGroup);
    pass.setPipeline(this._pipeline);
    pass.drawIndexed(_geometry.count, 1, 0, 0, 0);
  }
}
