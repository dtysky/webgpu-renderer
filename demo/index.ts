/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import * as H from '../src/index';
import BasicTestApp from './BasicTestApp';
import RayTracingApp from './RayTracingApp';

const app = new BasicTestApp();


async function main() {
  await H.init(document.querySelector<HTMLCanvasElement>('canvas#mainCanvas'));
  await app.init();
  
  let t = 0;
  function _loop(ct: number) {
    app.update(ct - t);
    t = ct;
    requestAnimationFrame(_loop);
  }

  _loop(performance.now());
}

main();
