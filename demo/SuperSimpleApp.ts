/**
 * @File   : SuperSimpleApp.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/25/2021, 12:02:19 AM
 */
import * as H from '../src/index';
import simpleVert from './simple.wgsl';

export default class BasicTestApp {
  public pipeline: GPURenderPipeline;
  public bindingLayouts: GPUBindGroupLayout[] = [];
  public bindingGroups: GPUBindGroup[] = [];

  public async init() {
    const {device, swapChainFormat} = H.renderEnv;

    this.bindingLayouts.push(H.renderEnv.uniformLayout);
    this.bindingGroups.push(H.renderEnv.bindingGroup);

    for (let index = 0; index < 3; index += 1) {
      this.bindingLayouts.push(device.createBindGroupLayout({
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {type: 'uniform' as GPUBufferBindingType}
        } as GPUBindGroupLayoutEntry]
      }));

      const buffer = new Float32Array([0, 0, 0, 1].map((v, i) => i === index ? Math.random() : v));
      const gpuBuffer = H.createGPUBuffer(buffer, GPUBufferUsage.UNIFORM);

      this.bindingGroups.push(device.createBindGroup({layout: this.bindingLayouts[index + 1], entries: [{
        binding: 0,
        resource: {buffer: gpuBuffer}
      }]}));
    }
    this.pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({bindGroupLayouts: this.bindingLayouts}),

      vertex: {
        module: device.createShaderModule({
          code: simpleVert,
        }),
        entryPoint: 'main',
      },
      fragment: {
        module: device.createShaderModule({
          code: `${H.renderEnv.shaderPrefix}
  struct VertexOutput {
    @builtin(position) position: vec4<f32>,
  }

  struct UB0 {
    color: vec4<f32>,
  }
  @group(1) @binding(0) var<uniform> ub0: UB0;

  struct UB1 {
    color: vec4<f32>,
  }
  @group(2) @binding(0) var<uniform> ub1: UB1;

  struct UB2 {
    color: vec4<f32>,
  }
  @group(3) @binding(0) var<uniform> ub2: UB2;
  
  @fragment
  fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
    return ub0.color + ub1.color + ub2.color;
  }          
          `,
        }),
        entryPoint: 'main',
        targets: [
          {
            format: swapChainFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    this._test();
  }

  protected _test() {
    const {device, currentTexture} = H.renderEnv;

    const commandEncoder = device.createCommandEncoder();
    const textureView = currentTexture.createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear',
          storeOp: 'store' as GPUStoreOp,
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    this.bindingGroups.forEach((bg, index) => {
      passEncoder.setBindGroup(index, bg);
    });
    passEncoder.setPipeline(this.pipeline);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  public update(dt: number) {
  }
}
