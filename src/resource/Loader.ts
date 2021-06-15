/**
 * Loader.ts
 * 
 * @Author  :dtysky(dtysky@outlook.com)
 * @Date    : 6/9/2021, 6:25:51 PM
*/

import HObject from "../core/HObject";

export default abstract class Loader<IOptions, IResource> extends HObject {
  public static CLASS_NAME: string = 'Loader';
  public isLoader: boolean = true;
  public type: { options: IOptions, resource: IResource };

  public abstract load(src: string, options: IOptions): Promise<IResource>;

  public async request(src: string, type?: 'json' | 'buffer'): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new TypeError(`Network request failed for ${xhr.status}`));
          return;
        }

        //@ts-ignore
        let result = 'response' in xhr ? xhr.response : xhr.responseText;

        if (type === 'json') {
          try {
            result = JSON.parse(result);
          } catch (err) {
            reject(new TypeError('JSON.parse error' + err));
            return;
          }
        }
        resolve(result);
      };

      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = () => {
        reject(new TypeError('Network request timed out'));
      };

      xhr.open('GET', src, true);

      if (type === 'buffer') {
        xhr.responseType = 'arraybuffer';
      }

      xhr.send();
    });
  }
}