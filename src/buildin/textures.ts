/**
 * @File   : textures.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import Texture from "../core/Texture";

const textures: {
  white: Texture,
  red: Texture,
  green: Texture,
  blue: Texture
} = {} as any;

export default textures;

export function init() {
  textures.white = new Texture(1, 1, (new Uint8Array([255, 255, 255, 255])).buffer);
  textures.red = new Texture(1, 1, (new Uint8Array([255, 255, 255, 255])).buffer);
  textures.green = new Texture(1, 1, (new Uint8Array([255, 255, 255, 255])).buffer);
  textures.blue = new Texture(1, 1, (new Uint8Array([255, 255, 255, 255])).buffer);
}
