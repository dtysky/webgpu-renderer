/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import * as H from '../src/index';
import SuperSimpleApp from './SuperSimpleApp';
import BasicTestApp from './BasicTestApp';
import RayTracingApp from './RayTracingApp';

const fpsDom = document.createElement('div');
fpsDom.style.position = 'fixed';
fpsDom.style.left = fpsDom.style.top = '0';
fpsDom.style.color = 'red';
fpsDom.style.fontSize = '24px';
document.body.append(fpsDom);

// const app = new SuperSimpleApp();
// const app = new BasicTestApp();
const app = new RayTracingApp();

let preFPS = 0;
async function update(dt: number) {
  await app.update(dt);

  const fps = 1000 / dt;

  if (Math.abs(fps - preFPS) > 2) {
    fpsDom.innerText = `${fps.toFixed(2)}fps`;
  }

  preFPS = fps;
}

async function main() {
  await H.init((document.querySelector<HTMLCanvasElement>('canvas#mainCanvas')!));
  await app.init();
  
  let t = 0;
  async function _loop(ct: number) {
    await update(ct - t);
    t = ct;
    requestAnimationFrame(_loop);
  }

  await _loop(performance.now());
}

main();
