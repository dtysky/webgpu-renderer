
/**
 * @File   : HObject.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午11:14:22
 */
export default class HObject {
  public static IDS: {[className: string]: number} = {};
  public static CLASS_NAME: string = 'HObject';
  
  public isHObject: boolean = true;
  public name: string;

  protected _id: number;
  protected _hash: string;

  get id() {
    return this._id;
  }
  
  get hash() {
    return this._hash;
  }

  constructor() {
    const className = (this.constructor as typeof HObject).CLASS_NAME;

    if (typeof className !== 'string') {
      throw new Error('Class must has a static member "CLASS_NAME" !');
    }

    HObject.IDS[className] = HObject.IDS[className] || 0;

    this._id = ++HObject.IDS[className];
    this._hash = `${className}_${this._id}`;
  }
}
