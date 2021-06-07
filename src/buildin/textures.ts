
/**
 * textures.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 2021/6/7下午7:04:03
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
