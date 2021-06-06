/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import { x } from '../src/index';
import {mat4} from  'gl-matrix';

type TTypedArray = Float32Array | Uint32Array | Uint16Array | Uint8Array;

export async function init(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  function createGPUBuffer(array: TTypedArray, usage: GPUBufferUsageFlags) {
    const buffer = device.createBuffer({
      size: array.byteLength,
      usage: usage | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });

    const view = new (array.constructor as {new(buffer: ArrayBuffer): TTypedArray})(buffer.getMappedRange());
    view.set(array, 0);

    buffer.unmap();

    return buffer;
  }

  async function createGPUTexture(src: string) {
    const img = document.createElement('img');
    img.src = src;
    await img.decode();
    const bitmap = await createImageBitmap(img);
    
    const tex = device.createTexture({
      size: {width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1},
      format: 'rgba8unorm',
      usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.copyExternalImageToTexture(
      {source: bitmap},
      {texture: tex},
      {width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1}
    );

    bitmap.close();

    return tex;
  }

  const context = canvas.getContext('gpupresent');

  const swapChainFormat: GPUTextureFormat = "bgra8unorm";

  const swapChain: GPUSwapChain = context.configureSwapChain({
    device,
    format: swapChainFormat,
  });

  const uniformGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform'
        }
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {
          type: 'filtering'
        }
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      }
    ]
  } as GPUBindGroupLayoutDescriptor);

  const vertexBufferLayouts: GPUVertexBufferLayout[] = [{
    arrayStride: 4 * 5,
    attributes: [
      {
        shaderLocation: 0,
        offset: 0,
        format: 'float32x3' as GPUVertexFormat
      },
      {
        shaderLocation: 1,
        offset: 4 * 3,
        format: 'float32x2' as GPUVertexFormat
      }
    ]
  }]

  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({bindGroupLayouts: [
      uniformGroupLayout
    ]}),

    vertex: {
      module: device.createShaderModule({
        code: require('./assets/shaders/test/vertex.vert.wgsl'),
      }),
      entryPoint: "main",
      buffers: vertexBufferLayouts
    },

    fragment: {
      module: device.createShaderModule({
        code: require('./assets/shaders/test/fragment.frag.wgsl'),
      }),
      targets: [
        {format: swapChainFormat}
      ],
      entryPoint: "main"
    },

    primitive: {
      topology: 'triangle-list'
    }
  });

  const vertexBuffer = createGPUBuffer(new Float32Array([
    -1, -1, 0, 0, 1,
    1, -1, 0, 1, 1, 
    -1, 1, 0, 0, 0,
    1, 1, 0, 1, 0
  ]), GPUBufferUsage.VERTEX);
  const indexBuffer = createGPUBuffer(new Uint16Array([0, 1, 2, 2, 1, 3]), GPUBufferUsage.INDEX);

  const squareMVPMatrix = mat4.multiply(
    new Float32Array(16),
    mat4.perspective(new Float32Array(16), 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100),
    mat4.fromTranslation(new Float32Array(16), [1.5, 0.0, -7.0])
  ) as Float32Array;
  const matUniformBuffer = createGPUBuffer(squareMVPMatrix, GPUBufferUsage.UNIFORM);
  const samplerUniform = device.createSampler({magFilter: 'linear', minFilter: 'linear'});
  const texUniform = await createGPUTexture(require('./assets/textures/uv-debug.jpg'));
  const uniformBindGroup = device.createBindGroup({
    layout: uniformGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {buffer: matUniformBuffer}
      },
      {
        binding: 1,
        resource: samplerUniform
      },
      {
        binding: 2,
        resource: texUniform.createView()
      }
    ]
  });

  function frame() {
    const commandEncoder = device.createCommandEncoder({});
    const textureView = swapChain.getCurrentTexture().createView();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [{
        view: textureView,
        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        storeOp: 'store' as GPUStoreOp
      }],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, 'uint16');
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setPipeline(pipeline);
    passEncoder.drawIndexed(6, 1, 0, 0, 0);
    passEncoder.endPass();

    device.queue.submit([commandEncoder.finish()]);
  }

  return frame;
}

async function main() {
  const frame = await init(document.querySelector<HTMLCanvasElement>('canvas#mainCanvas'));

  function loop() {
    frame();
    requestAnimationFrame(loop);
  }

  loop();
}

main();
