/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/6下午8:56:49
 */
import buildinTextures, {init as initTextures} from './textures';
export {buildinTextures};
import buildinGeometries, {init as initGeometries} from './geometries';
export {buildinGeometries};
import buildinEffects, {init as initEffects} from './effects';
export {buildinEffects};
import buildinUBTemplates, {init as initUBTemplates} from './ubTemplates';
export {buildinUBTemplates};

export async function init() {
  await initTextures();
  initUBTemplates();
  initGeometries();
  initEffects();
}
