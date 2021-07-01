/**
 * @File   : webpack-glslang-loader.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午3:53:15
 */
const path = require('path');
const fs = require('fs');

module.exports = async function WGSLLoader(source) {
  const context = this;
  context.cacheable();
  const callback = context.async();
  const pairs = [];
  const regex = /require\('(.+?)'\)/g; 

  let res;
  while (res !== null) {
    res = regex.exec(source);

    if (res) {
      pairs.push({def: res[0], path: res[1]});
    }
  }

  pairs.forEach(pair => {
    const def = pair.def;
    const fp = path.join(context.context, pair.path);

    context.addDependency(fp);

    if (fs.existsSync(fp)) {
      const content = fs.readFileSync(fp);
      
      source = source.replace(def, `//from require ${fp}\n` + content + '\n//require end\n');
    }
  });

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  callback(null, `module.exports = ${json}`);
}
