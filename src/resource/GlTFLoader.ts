/**
 * GlTFLoader.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/9/2021, 6:24:15 PM
*/
import Texture from "../core/Texture";
import Loader from "./Loader";

export interface IGlTFLoaderOptions {

}

export interface IGlTFResource {
  
}

export default class GlTFLoader extends Loader<IGlTFLoaderOptions, IGlTFResource> {
  public static CLASS_NAME: string = 'GlTFLoader';
  public isGlTFLoader: boolean = true;

  public async load(src: string, options: IGlTFLoaderOptions): Promise<IGlTFResource> {

  }
}
