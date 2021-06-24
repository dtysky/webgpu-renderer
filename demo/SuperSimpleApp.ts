/**
 * @File   : SuperSimpleApp.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/25/2021, 12:02:19 AM
 */
import * as H from '../src/index';

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
          code: `
struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
};

let pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(
  vec2<f32>(-1.0, -1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(1.0, 1.0)
);

[[stage(vertex)]]
fn main([[builtin(vertex_index)]] VertexIndex : u32) -> VertexOutput {
  var output: VertexOutput;

  output.position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);

  return output;
}
          `,
        }),
        entryPoint: 'main',
      },
      fragment: {
        module: device.createShaderModule({
          code: `${H.renderEnv.shaderPrefix}
  struct VertexOutput {
    [[builtin(position)]] position: vec4<f32>;
  };

  [[block]] struct UB0 {
    color: vec4<f32>;
  };
  [[group(1), binding(0)]] var<uniform> ub0: UB0;

  [[block]] struct UB1 {
    color: vec4<f32>;
  };
  [[group(2), binding(0)]] var<uniform> ub1: UB1;

  [[block]] struct UB2 {
    color: vec4<f32>;
  };
  [[group(3), binding(0)]] var<uniform> ub2: UB2;
  
  [[stage(fragment)]]
  fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
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
    const {device, swapChain} = H.renderEnv;

    const commandEncoder = device.createCommandEncoder();
    const textureView = swapChain.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
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
    passEncoder.endPass();

    device.queue.submit([commandEncoder.finish()]);
  }

  public update(dt: number) {
  }
}
