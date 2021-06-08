/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import buildinTextures, {init as initTextures} from './textures';
export {buildinTextures};
import buildinEffects, {init as initEffects} from './effects';
export {buildinEffects};

export function init() {
  initTextures();
  initEffects();
}
