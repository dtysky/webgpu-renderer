/**
 * Loader.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/9/2021, 6:25:51 PM
*/

import HObject from "../core/HObject";

export default abstract class Loader<IOptions, IResource> extends HObject {
  public static CLASS_NAME: string = 'Loader';
  public isLoader: boolean = true;
  public type: {options: IOptions, resource: IResource};

  public abstract load(src: string, options: IOptions): Promise<IResource>;
}