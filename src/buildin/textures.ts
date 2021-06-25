/**
 * @File   : textures.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import CubeTexture from "../core/CubeTexture";
import { isArray } from "../core/shared";
import Texture from "../core/Texture";

const textures: {
  /**
   * A trick for defaultValue
   */
  empty: Texture,
  white: Texture,
  red: Texture,
  green: Texture,
  blue: Texture,
  black: Texture,
  array1white: Texture,
  cubeWhite: CubeTexture,
  cubeBlack: CubeTexture
} = {} as any;

export default textures;

async function createTexture(width: number, height: number, buffer: Uint8ClampedArray | Uint8ClampedArray[]) {
  if (isArray<Uint8ClampedArray>(buffer)) {
    return new Texture(width, height, await Promise.all(buffer.map(async b => {
      return await createImageBitmap(new ImageData(b, width, height));
    })));
  } else {
    return new Texture(width, height, await createImageBitmap(new ImageData(buffer, width, height)));
  }
}

export async function init() {
  textures.empty = await createTexture(1, 1, new Uint8ClampedArray([255, 255, 255, 255]));
  textures.white = await createTexture(1, 1, new Uint8ClampedArray([255, 255, 255, 255]));
  textures.black = await createTexture(1, 1, new Uint8ClampedArray([0, 0, 0, 255]));
  textures.red = await createTexture(1, 1, new Uint8ClampedArray([255, 0, 0, 255]));
  textures.green = await createTexture(1, 1, new Uint8ClampedArray([0, 255, 0, 255]));
  textures.blue = await createTexture(1, 1, new Uint8ClampedArray([0, 0, 255, 255]));
  textures.array1white = await createTexture(1, 1, [
    new Uint8ClampedArray([255, 255, 255, 255]),
    new Uint8ClampedArray([255, 255, 255, 255])
  ]);
  textures.cubeWhite = new CubeTexture(
    1, 1,
    new Array<ArrayBuffer>(6).fill(new Uint8Array([255, 255, 255, 255]).buffer)
  );
  textures.cubeBlack = new CubeTexture(
    1, 1,
    new Array<ArrayBuffer>(6).fill(new Uint8Array([0, 0, 0, 255]).buffer)
  );
}
