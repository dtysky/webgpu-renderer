
/**
 * index.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/9/2021, 6:23:33 PM
 */
import HObject from "../core/HObject";
import Loader from "./Loader";
import TextureLoader from "./TextureLoader";
import GlTFLoader from "./GlTFLoader";

export interface IResourceLoader {
  texture: TextureLoader;
  gltf: GlTFLoader;
}

export class Resource extends HObject {
  public static CLASS_NAME: string = 'Resource';
  public isResource: boolean = true;

  private _loaders: {[type: string]: Loader<any, any>} = {};
  private _resources: {[name: string]: any} = {};

  public register<TType extends keyof IResourceLoader>(
    type: TType, loader: IResourceLoader[TType]
  ) {
    this._loaders[type] = loader;
  }

  public async load<TType extends keyof IResourceLoader>(
    info: {type: TType, name: string, src: string},
    options?: IResourceLoader[TType]['type']['options']
  ): Promise<IResourceLoader[TType]['type']['resource']> {
    if (this._resources[info.name]) {
      return this._resources[info.name];
    }

    return this._loaders[info.type].load(info.src, options || {})
      .then(res => {
        this._resources[info.name] = res;
        return res;
      });
  }

  public get<TType extends keyof IResourceLoader>(
    name: string
  ): IResourceLoader[TType]['type']['resource'] | null {
    return this._resources[name];
  }
}

const resource = new Resource();
resource.register('texture', new TextureLoader());
resource.register('gltf', new GlTFLoader());

export default resource;
