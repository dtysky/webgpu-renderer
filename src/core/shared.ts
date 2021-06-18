/**
 * @File   : shared.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:40:46
 */
import renderEnv from './renderEnv';

export type TTypedArray = Float32Array | Uint32Array | Uint16Array | Uint8Array | Int32Array | Int16Array;

export type TUniformTypedArray = Float32Array | Uint32Array | Int32Array;

export type TTextureSource = ImageBitmap | ArrayBuffer;

export function isTextureSourceArray(value: TTextureSource | TTextureSource[]): value is TTextureSource[] {
  return !!(value as TTextureSource[]).push;
}

export function isArray<T>(value: T | T[]): value is Array<T> {
  return !!(value as T[]).push;
}

export function logCanvas(canvas: HTMLCanvasElement, width: number) {
  const height = width * canvas.height / canvas.width;
  const url = canvas.toDataURL();

  /*tslint:disable-next-line */
  console.log('%c+', `font-size: 1px; padding: ${height / 2}px ${width / 2}px; line-height: ${height}px; background: url(${url}); background-size: ${width}px ${height}px; background-repeat: no-repeat; color: transparent;`);
}

export function createGPUBuffer(array: TTypedArray, usage: GPUBufferUsageFlags) {
  const size = array.byteLength + (4 - array.byteLength % 4);
  const buffer = renderEnv.device.createBuffer({
    size,
    usage: usage | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });

  const view = new (array.constructor as {new(buffer: ArrayBuffer): TTypedArray})(buffer.getMappedRange(0, size));
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

  return buffer;
}

export const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
