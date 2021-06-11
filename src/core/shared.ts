/**
 * @File   : shared.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:40:46
 */
import renderEnv from './renderEnv';

export type TTypedArray = Float32Array | Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array;

export type TUniformTypedArray = Float32Array | Uint32Array | Int32Array;

export function createGPUBuffer(array: TTypedArray, usage: GPUBufferUsageFlags) {
  const buffer = renderEnv.device.createBuffer({
    size: array.byteLength,
    usage: usage | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });

  const view = new (array.constructor as {new(buffer: ArrayBuffer): TTypedArray})(buffer.getMappedRange(0, array.byteLength));
  view.set(array, 0);

  buffer.unmap();

  return buffer;
}

export function createGPUBufferBySize(size: number, usage: GPUBufferUsageFlags) {
  const buffer = renderEnv.device.createBuffer({
    size: size,
    usage: usage | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });

  buffer.unmap();

  return buffer;
}

export const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
