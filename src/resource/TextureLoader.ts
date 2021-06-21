/**
 * TextureLoader.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/9/2021, 6:24:02 PM
 */
import Texture from "../core/Texture";
import Loader from "./Loader";

export interface ITextureLoaderOptions {

}

export default class TextureLoader extends Loader<ITextureLoaderOptions, Texture> {
  public static CLASS_NAME: string = 'TextureLoader';
  public isTextureLoader: boolean = true;

  public async load(src: string, options: ITextureLoaderOptions): Promise<Texture> {
    const img = document.createElement('img');
    img.src = src;

    await img.decode();

    const bitmap = await createImageBitmap(img);
    const res = new Texture(img.naturalHeight, img.naturalHeight, bitmap);

    return res;
  }
}
