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

export function callWithProfile<FN extends (...args: any) => any>(name: string, fn: FN, args: Parameters<FN>) {
  const t = performance.now();
  fn(...args);
  console.log(`Ray Tracing, ${name}: ${(performance.now() - t) / 1000}(s)`);
}

export function copyTypedArray(
  size: number,
  dst: TTypedArray, dstOffset: number,
  src: TTypedArray | number[], srcOffset: number
) {
  for (let index = 0; index < size; index += 1) {
    dst[dstOffset + index] = src[srcOffset + index];
  }
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

  buffer.unmap();

  return buffer;
}

export const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

export function logCanvas(canvas: HTMLCanvasElement, width: number) {
  const height = width * canvas.height / canvas.width;
  const url = canvas.toDataURL();

  /*tslint:disable-next-line */
  console.log('%c+', `font-size: 1px; padding: ${height / 2}px ${width / 2}px; line-height: ${height}px; background: url(${url}); background-size: ${width}px ${height}px; background-repeat: no-repeat; color: transparent;`);
}

// Reorders the elements in the range [first, last) in such a way that
// all elements for which the comparator c returns true
// precede the elements for which comparator c returns false.
export function partition<T>(
  array: Array<T>, compare: (item: T) => boolean,
  left: number = 0, right: number = array.length
) {
  while (left !== right) {
    while (compare(array[left])) {
      left += 1;
      if (left === right) {
        return left;
      }
    }

    do {
      right -= 1;
      if (left === right) {
        return left;
      }
    } while (!compare(array[right]));

    swap(array, left, right);
    left += 1;
  }

  return left;
}

// nth_element is a partial sorting algorithm that rearranges elements in [first, last) such that:
// The element pointed at by nth is changed to whatever element would occur in that position if [first, last) were sorted.
// All of the elements before this new nth element compare to true with elements after the nth element
export function nthElement<T>(
  array: Array<T>, compare: (a: T, b: T) => boolean,
  left: number = 0, right: number = array.length,
  k: number = Math.floor((left + right) / 2)
) {
  for (let i = left; i <= k; i += 1) {
    let minIndex = i;
    let minValue = array[i];

    for (let j = i + 1; j < right; j += 1) {
      if (!compare(minValue, array[j])) {
        minIndex = j;
        minValue = array[j];
        swap(array, i, minIndex);
      }
    }
  }
}

function swap<T>(array: Array<T>, a: number, b: number) {
  const x = array[b];
  array[b] = array[a];
  array[a] = x;
}

export function genFilterParams(sigmas: Float32Array): Float32Array {
  const res = new Float32Array(sigmas.length);

  for (let i: number = 0; i < sigmas.length; i += 1) {
    const s = sigmas[i];
    res[i] = -0.5 * s * s;
  }

  return res;
}
