/**
 * @File   : ImageMesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import HObject from './HObject';
import Material from './Material';
import renderEnv from './renderEnv';

export default class ImageMesh extends HObject {
  public static CLASS_NAME: string = 'ImageMesh';
  public isImageMesh: boolean = true;

  protected _pipeline: GPURenderPipeline;
  get material() {
    return this._material;
  }

  constructor(protected _material: Material) {
    super();

    this._createPipeline();
  }

  public render(pass: GPURenderPassEncoder) {
    const {_material} = this;

    pass.setBindGroup(0, _material.bindingGroup);
    pass.setPipeline(this._pipeline);
    pass.draw(6, 1, 0, 0);
  }

  protected _createPipeline() {
    const {device, swapChainFormat} = renderEnv;
    const {_material} = this;
    const {vs, fs} = _material.effect.getShader({}, '');

    this._pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: [
        _material.effect.uniformLayout
      ]}),
  
      vertex: {
        module: vs,
        entryPoint: "main"
      },
  
      fragment: {
        module: fs,
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
}
