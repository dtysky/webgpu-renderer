/**
 * @File   : webpack-glslang-loader.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午3:53:15
 */
const glslang = require('@webgpu/glslang')();
const path = require('path');

module.exports = async function GLSLangLoader(source) {
  const context = this;
  context.cacheable();
  const callback = context.async();

  try {
    const {resourcePath} = context;
    const ext = path.extname(resourcePath);
    let code;

    if (ext === '.vert') {
      code = glslang.compileGLSL(source, 'vertex');
    } else if (ext === '.frag') {
      code = glslang.compileGLSL(source, 'fragment');
    } else if (ext === 'comp') {
      code = glslang.compileGLSL(source, 'compute');
    } else {
      throw new Error('GLSLangLoader does not support format: ', ext);
    }

    callback(null, `module.exports = ${code}`);
  } catch (error) {
    callback(error);
  }
}
