/**
 * @File   : ImageMesh.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import Camera from './Camera';
import HObject from './HObject';
import Light from './Light';
import Material from './Material';
import renderEnv from './renderEnv';

export default class ImageMesh extends HObject {
  public static CLASS_NAME: string = 'ImageMesh';
  public isImageMesh: boolean = true;

  protected _pipeline: GPURenderPipeline;

  get material() {
    return this._material;
  }

  set material(value: Material) {
    this._material = value;
    this._pipeline = null;
  }

  constructor(protected _material: Material) {
    super();
  }

  public render(pass: GPURenderPassEncoder) {
    const {_material} = this;

    !this._pipeline && this._createPipeline();

    pass.setBindGroup(1, _material.bindingGroup);
    pass.setPipeline(this._pipeline);
    pass.draw(6, 1, 0, 0);
  }

  protected _createPipeline() {
    const {device, swapChainFormat} = renderEnv;
    const {_material} = this;
    const {vs, fs} = _material.effect.getShader(_material.marcos, '', renderEnv.shaderPrefix, '');

    this._pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: [
        renderEnv.uniformLayout,
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
