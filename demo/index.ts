/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import {x} from '../src/index';

export const title = 'Hello Triangle';
export const description = 'Shows rendering a basic triangle.';

export async function init(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext('gpupresent');

  const swapChainFormat = "bgra8unorm";

  // @ts-ignore:
  const swapChain: GPUSwapChain = context.configureSwapChain({
    device,
    format: swapChainFormat,
  });

  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [] }),

    vertexStage: {
      module: device.createShaderModule({
        code: require('./assets/shaders/test/vertex.vert'),
      }),
      entryPoint: "main"
    },
    fragmentStage: {
      module: device.createShaderModule({
        code: require('./assets/shaders/test/fragment.frag'),
      }),
      entryPoint: "main"
    },

    primitiveTopology: "triangle-list",

    // colorStates: [{
    //   format: swapChainFormat,
    // }],
  });

  function frame() {
    const commandEncoder = device.createCommandEncoder({});
    const textureView = swapChain.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        attachment: textureView,
        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      }],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.endPass();

    // device.defaultQueue.submit([commandEncoder.finish()]);
  }

  return frame;
}

init(document.querySelector<HTMLCanvasElement>('canvas#mainCanvas'));
