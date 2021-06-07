/**
 * index.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 2021/6/7下午7:27:01
*/
import buildinTextures, {init as initTextures} from './textures';
export {buildinTextures};
import buildinEffects, {init as initEffects} from './effects';
export {buildinEffects};

export function init() {
  initTextures();
  initEffects();
}
