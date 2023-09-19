var je=Object.defineProperty;var We=(o,e,t)=>e in o?je(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var s=(o,e,t)=>(We(o,typeof e!="symbol"?e+"":e,t),t);import{s as K,c as Xe,a as le,b as _e,i as C,d as Ze,f as Ke,m as Je,g as R,e as xe,h as Qe,t as Pe,j as ie,k as Ce,r as et,n as ue,l as tt,o as Be,p as nt,q as Ne,u as rt,v as at,w as st,x as it,y as ot,z as lt,A as ut,B as ct,C as ft,D as ht,E as mt,F as dt,G as pt}from"./vendor.e42bd8e3.js";const _t=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerpolicy&&(r.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?r.credentials="include":a.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}};_t();class Oe{constructor(){s(this,"isRenderEnv",!0);s(this,"_device");s(this,"_canvas");s(this,"_ctx");s(this,"_swapChainFormat","bgra8unorm");s(this,"_ubTemplate");s(this,"_uniformBlock");s(this,"_bindingGroup")}get canvas(){return this._canvas}get ctx(){return this._ctx}get device(){return this._device}get bindingGroup(){return this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),this._bindingGroup}get shaderPrefix(){return this._ubTemplate.shaderPrefix}get uniformLayout(){return this._ubTemplate.uniformLayout}get width(){return this._canvas.width}get height(){return this._canvas.height}get swapChainFormat(){return this._swapChainFormat}get currentTexture(){return this._ctx.getCurrentTexture()}async init(e){if(!navigator.gpu)throw new Error("WebGPU is not supported!");const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Require adapter failed!");if(this._device=await t.requestDevice(),!this._device)throw new Error("Require device failed!");this._canvas=e,this._ctx=e.getContext("webgpu")||e.getContext("gpupresent"),this._ctx.configure({device:this._device,format:this._swapChainFormat,alphaMode:"premultiplied"})}async createGlobal(e){this._ubTemplate=e,this._uniformBlock=this._ubTemplate.createUniformBlock()}setUniform(e,t,n){this._ubTemplate.setUniform(this._uniformBlock,e,t,n)}getUniform(e){return this._ubTemplate.getUniform(this._uniformBlock,e)}}s(Oe,"CLASS_NAME","RenderEnv");const v=new Oe,Z=class{constructor(){s(this,"isHObject",!0);s(this,"name");s(this,"_id");s(this,"_hash");const e=this.constructor.CLASS_NAME;if(typeof e!="string")throw new Error('Class must has a static member "CLASS_NAME" !');Z.IDS[e]=Z.IDS[e]||0,this._id=++Z.IDS[e],this._hash=`${e}_${this._id}`}get id(){return this._id}get hash(){return this._hash}};let I=Z;s(I,"IDS",{}),s(I,"CLASS_NAME","HObject");class W extends I{constructor(e,t,n,a="rgba8unorm"){super();s(this,"isCubeTexture",!0);s(this,"_gpuTexture");s(this,"_view");if(this._width=e,this._height=t,this._src=n,this._format=a,n.length<6)throw new Error("CubeTexture must has 6 slice");this._gpuTexture=v.device.createTexture({size:{width:e,height:t,depthOrArrayLayers:6},format:a,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this._view=this._gpuTexture.createView({dimension:"cube"}),n[0]instanceof ImageBitmap?this._loadImg():this._loadBuffer()}static IS(e){return!!e.isCubeTexture}get view(){return this._view}_loadImg(){this._src.forEach((e,t)=>{v.device.queue.copyExternalImageToTexture({source:e},{texture:this._gpuTexture,origin:{x:0,y:0,z:t}},{width:this._width,height:this._height,depthOrArrayLayers:1})})}_loadBuffer(){this._src.forEach((e,t)=>{v.device.queue.writeTexture({texture:this._gpuTexture,origin:{x:0,y:0,z:t}},e,{},{width:this._width,height:this._height,depthOrArrayLayers:1})})}}s(W,"CLASS_NAME","CubeTexture");function Ve(o){return!!o.push}function gt(o){return!!o.push}function k(o,e,t){const n=performance.now();e(...t),console.log(`Ray Tracing, ${o}: ${(performance.now()-n)/1e3}(s)`)}function me(o,e,t,n,a){for(let r=0;r<o;r+=1)e[t+r]=n[a+r]}function O(o,e){const t=o.byteLength+(4-o.byteLength%4),n=v.device.createBuffer({size:t,usage:e|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return new o.constructor(n.getMappedRange(0,t)).set(o,0),n.unmap(),n}function ze(o,e){const t=v.device.createBuffer({size:o,usage:e|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return t.unmap(),t}const oe=o=>o.split("").reduce((e,t)=>(e=(e<<5)-e+t.charCodeAt(0),e&e),0);function vt(o,e,t=0,n=o.length){for(;t!==n;){for(;e(o[t]);)if(t+=1,t===n)return t;do if(n-=1,t===n)return t;while(!e(o[n]));He(o,t,n),t+=1}return t}function xt(o,e,t=0,n=o.length,a=Math.floor((t+n)/2)){for(let r=t;r<=a;r+=1){let i=r,c=o[r];for(let l=r+1;l<n;l+=1)e(c,o[l])||(i=l,c=o[l],He(o,r,i))}}function He(o,e,t){const n=o[t];o[t]=o[e],o[e]=n}function yt(o){const e=new Float32Array(o.length);for(let t=0;t<o.length;t+=1){const n=o[t];e[t]=-.5*n*n}return e}class Y extends I{constructor(e,t,n,a="rgba8unorm"){super();s(this,"isTexture",!0);s(this,"_bitmap");s(this,"_isArray");s(this,"_arrayCount");s(this,"_gpuTexture");s(this,"_gpuTextureView");this._width=e,this._height=t,this._src=n,this._format=a,Ve(n)?(this._isArray=!0,this._arrayCount=n.length):(this._isArray=!1,this._arrayCount=1),this._gpuTexture=v.device.createTexture({label:this.hash,size:{width:this._width,height:this._height,depthOrArrayLayers:this._arrayCount},format:a||"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),Ve(n)?(n.forEach((r,i)=>this._load(r,i)),this._gpuTextureView=this._gpuTexture.createView({dimension:"2d-array",arrayLayerCount:this._arrayCount})):(this._load(n),this._gpuTextureView=this._gpuTexture.createView())}get width(){return this._width}get height(){return this._height}get format(){return this._format}get source(){return this._src}get gpuTexture(){return this._gpuTexture}get view(){return this._gpuTextureView}get isArray(){return this._isArray}_load(e,t=0){e instanceof ImageBitmap?this._loadImg(e,t):this._loadBuffer(e,t)}_loadImg(e,t){v.device.queue.copyExternalImageToTexture({source:e},{texture:this._gpuTexture,origin:this._isArray?{x:0,y:0,z:t}:void 0},{width:this._width,height:this._height,depthOrArrayLayers:1})}_loadBuffer(e,t){v.device.queue.writeTexture({texture:this._gpuTexture,origin:this._isArray?{x:0,y:0,z:t}:void 0},e,{bytesPerRow:this._width*4},{width:this._width,height:this._height,depthOrArrayLayers:1})}updateImg(e,t=0){console.warn("Not implemented!")}}s(Y,"CLASS_NAME","Texture");const x={};async function z(o,e,t){return gt(t)?new Y(o,e,await Promise.all(t.map(async n=>await createImageBitmap(new ImageData(n,o,e))))):new Y(o,e,await createImageBitmap(new ImageData(t,o,e)))}async function bt(){x.empty=await z(1,1,new Uint8ClampedArray([255,255,255,255])),x.white=await z(1,1,new Uint8ClampedArray([255,255,255,255])),x.black=await z(1,1,new Uint8ClampedArray([0,0,0,255])),x.red=await z(1,1,new Uint8ClampedArray([255,0,0,255])),x.green=await z(1,1,new Uint8ClampedArray([0,255,0,255])),x.blue=await z(1,1,new Uint8ClampedArray([0,0,255,255])),x.array1white=await z(1,1,[new Uint8ClampedArray([255,255,255,255]),new Uint8ClampedArray([255,255,255,255])]),x.cubeWhite=new W(1,1,new Array(6).fill(new Uint8Array([255,255,255,255]).buffer)),x.cubeBlack=new W(1,1,new Array(6).fill(new Uint8Array([0,0,0,255]).buffer))}class N extends I{constructor(e,t,n,a){super();s(this,"isGeometry",!0);s(this,"_vLayouts");s(this,"_vInfo");s(this,"_vBuffers");s(this,"_iBuffer");s(this,"_indexFormat");s(this,"_vertexCount");s(this,"_marcos");s(this,"_attributesDef");this._vertexes=e,this._indexData=t,this.count=n,this._boundingBox=a,this._iBuffer=O(t,GPUBufferUsage.INDEX),this._vBuffers=new Array(e.length),this._vLayouts=new Array(e.length),this._indexFormat=t instanceof Uint16Array?"uint16":"uint32",this._vInfo={},this._marcos={},this._attributesDef=`struct Attrs {
`,e.forEach(({layout:r,data:i,usage:c},l)=>{const h=O(i,GPUBufferUsage.VERTEX|(c|0));r.attributes.forEach(u=>{this._marcos[`USE_${u.name.toUpperCase()}`]=!0,this._attributesDef+=`  @location(${u.shaderLocation}) ${u.name}: ${this._convertFormat(u.format)},
`,this._vInfo[u.name.toLowerCase()]={data:i,index:l,offset:u.offset/4,stride:r.arrayStride/4,length:this._getLength(u.format)}}),this._vBuffers[l]=h,this._vLayouts[l]=r,this._vertexCount=i.byteLength/r.arrayStride}),this._attributesDef+=`};

`}get indexes(){return this._iBuffer}get indexData(){return this._indexData}get vertexes(){return this._vBuffers}get vertexLayouts(){return this._vLayouts}get vertexCount(){return this._vertexCount}get vertexInfo(){return this._vInfo}get attributesDef(){return this._attributesDef}get indexFormat(){return this._indexFormat}get marcos(){return this._marcos}calculateNormals(){const{_vInfo:e,_vertexCount:t,_indexData:n,count:a}=this;if(e.normal)return;const r=e.position,i=new Float32Array(t*3);let c,l;const h=!this._boundingBox;h&&(l=[-1/0,-1/0,-1/0],c=[1/0,1/0,1/0]);const u=new Uint8Array(t);let m,f,d,_;for(let g=0;g<a;g+=1){_=r.offset+n[g]*r.stride,m=r.data.slice(_,_+r.length),_=r.offset+n[g+1]*r.stride,f=r.data.slice(_,_+r.length),_=r.offset+n[g+2]*r.stride,d=r.data.slice(_,_+r.length),h&&(this._calcBonding(l,c,m),this._calcBonding(l,c,f),this._calcBonding(l,c,d)),K(f,f,m),K(d,d,m),Xe(f,f,d);for(let p=0;p<3;p+=1){const y=n[g+p];if(u[y]){const b=new Float32Array(i.buffer,y*3*4,3);le(b,b,u[y]),_e(b,b,f),le(b,b,1/(u[g]+1))}else i.set(f,y*3);u[y]+=1}}e.normal={offset:0,length:3,stride:3,data:i,index:0},h&&(this._boundingBox={start:c,center:l.map((g,p)=>(g+c[p])/2),size:l.map((g,p)=>g-c[p])})}getValues(e){return{cpu:this._vInfo[e].data,gpu:this._vBuffers[this._vInfo[e].index]}}_calcBonding(e,t,n){for(let a=0;a<3;a+=1)e[a]=Math.max(e[a],n[a]),t[a]=Math.min(t[a],n[a])}_convertFormat(e){switch(e){case"float32":return"f32";case"float32x2":return"vec2<f32>";case"float32x3":return"vec3<f32>";case"float32x4":return"vec4<f32>";case"uint32":return"u32";case"uint32x2":return"vec2<u32>";case"uint32x3":return"vec3<u32>";case"uint32x4":return"vec4<u32>"}throw new Error(`Not support format ${e}!`)}_getLength(e){switch(e){case"float32":case"uint32":return 1;case"float32x2":case"uint32x2":return 2;case"float32x3":case"uint32x3":return 3;case"float32x4":case"uint32x4":return 4}throw new Error(`Not support format ${e}!`)}updateVertexes(){console.warn("Not implemented!")}updateIndexes(){console.warn("Not implemented!")}}s(N,"CLASS_NAME","Geometry");const $={};function wt(){$.skybox=new N([{layout:{arrayStride:8,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x2"}]},data:new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])}],new Uint16Array([0,1,2,3,4,5]),6),$.rectLight=new N([{layout:{arrayStride:12,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0])}],new Uint16Array([0,1,2,2,3,0]),6);const o=Tt(512);$.discLight=new N([{layout:{arrayStride:12,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:o.vertexes}],o.indexes,o.indexes.length)}function Tt(o){const e=Math.PI*2/o,t=new Float32Array((1+o)*3),n=new Uint16Array(o*3);t.set([0,0,0]);let a=0;for(let r=0;r<o;r+=1)t[(r+1)*3]=Math.cos(a),t[(r+1)*3+1]=Math.sin(a),t[(r+1)*3+2]=0,n[r*3]=0,n[r*3+1]=r+2,n[r*3+2]=r+1,a+=e;return{vertexes:t,indexes:n}}class B extends I{constructor(e){super();s(this,"isRenderTexture",!0);s(this,"_width");s(this,"_height");s(this,"_forCompute");s(this,"_colorDescs");s(this,"_depthDesc");s(this,"_colors");s(this,"_colorViews");s(this,"_colorFormats");s(this,"_depthStencil");s(this,"_depthStencilView");s(this,"_pipelineHash");s(this,"_colorNames");this._options=e;const{width:t,height:n,colors:a,depthStencil:r,forCompute:i}=e;if(this._width=t,this._height=n,i&&r)throw new Error("RenderTexture with forCompute flag does not support depth!");this._colorDescs=new Array(a.length),this._colorViews=new Array(a.length),this._colorFormats=new Array(a.length),this._colorNames={},this._colors=a.map((c,l)=>{const h=v.device.createTexture(this._colorDescs[l]={label:this.hash+"_color_"+(c.name||l),size:{width:t,height:n},format:c.format||(i?"rgba8unorm":v.swapChainFormat),usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|(i?GPUTextureUsage.STORAGE_BINDING:0)});return this._colorViews[l]=h.createView({label:h.label}),this._colorFormats[l]=this._colorDescs[l].format,c.name&&(this._colorNames[c.name]=l),h}),r&&(this._depthStencil=v.device.createTexture(this._depthDesc={label:this.hash+"_depth",size:{width:t,height:n},format:r.format||(r.needStencil?"depth24plus-stencil8":"depth24plus"),usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this._depthStencilView=this._depthStencil.createView({label:this.hash+"_depth"})),this._pipelineHash=oe(this._colorDescs.map(c=>c.format).join("")+(this._depthDesc?this._depthDesc.format:""))}static IS(e){return!!e.isRenderTexture}get width(){return this._width}get height(){return this._height}get pipelineHash(){return this._pipelineHash}get colorView(){return this._colorViews[0]}get depthStencilView(){return this._depthStencilView}get colorFormat(){return this._colorDescs[0].format}get depthStencilFormat(){var e;return(e=this._depthDesc)==null?void 0:e.format}get colorViews(){return this._colorViews}get colorFormats(){return this._colorFormats}get hasStencil(){var e;return!!((e=this._options.depthStencil)!=null&&e.needStencil)}getColorViewByName(e){return this._colorViews[this._colorNames[e]]}}s(B,"CLASS_NAME","RenderTexture");var ce=(o=>(o[o.Global=0]="Global",o[o.Material=1]="Material",o[o.Mesh=2]="Mesh",o))(ce||{});class J extends I{constructor(e,t,n){super();s(this,"isUBTemplate",!0);s(this,"_shaderPrefix");s(this,"_uniformLayoutDesc");s(this,"_uniformLayout");s(this,"_uniformBindDesc");s(this,"_uniformsBufferDefault");s(this,"_uniformsInfo");this._uniformDesc=e,this._groupId=t,this._visibility=n;const{device:a}=v,r=n===void 0?GPUShaderStage.COMPUTE|GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT:n,i=t===0?"UniformsGlobal":t===2?"UniformsObject":"UniformsMaterial",c=t===0?"global":t===2?"mesh":"material";let l=0,h=0;this._shaderPrefix="",this._uniformsInfo={};const u=[];if(e.uniforms.length){e.uniforms.forEach(f=>{f.customType&&(this._shaderPrefix+=f.customType.code+`
`)}),this._shaderPrefix+=`struct ${i} {
`,u.push({binding:0,visibility:r,buffer:{type:"uniform"}});let m=0;e.uniforms.forEach(f=>{const{origLen:d,realLen:_,defaultValue:g}=this._getRealLayoutInfo(f.type,f.size||1,f.defaultValue,f.customType);this._uniformsInfo[f.name]={bindingId:0,index:l,type:"buffer",offset:m,defaultValue:g,origLen:d,realLen:_,size:f.size||1},m+=g.length;const p=f.customType?f.customType.name:f.type==="number"?`${f.format||"f32"}`:`${f.type}<${f.format||"f32"}>`,y=d!==_?`@stride(${_*4})`:"";f.size?f.size>1&&(this._shaderPrefix+=` @align(16) ${f.name}: ${y} array<${p}, ${f.size}>,
`):this._shaderPrefix+=`  @align(16) ${f.name}: ${p},
`,l+=1}),this._uniformsBufferDefault=new Uint32Array(m),this._shaderPrefix+=`};
@group(${t}) @binding(0) var<uniform> ${c}: ${i};
`,h+=1}if(e.textures&&e.textures.forEach(m=>{const f=W.IS(m.defaultValue),d=m.defaultValue.isArray,_=f?d?"cube-array":"cube":d?"2d-array":"2d";m.storageAccess==="read-only"&&(m.storageAccess=void 0,m.format=/uint/.test(m.storageFormat)?"uint":/sint/.test(m.storageFormat)?"sint":"float"),u.push({binding:h,visibility:r,texture:m.storageAccess?void 0:{sampleType:m.format||"float",viewDimension:_},storageTexture:m.storageAccess==="write-only"?Object.assign({format:m.storageFormat||"rgba8unorm",viewDimension:_,access:m.storageAccess}):void 0}),this._uniformsInfo[m.name]={bindingId:h,index:l,type:"texture",defaultGpuValue:m.defaultValue.view};let g=m.format==="depth"?"depth":m.format==="uint"?"u32":m.format==="sint"?"i32":"f32";m.storageAccess?this._shaderPrefix+=`@group(${t}) @binding(${h}) var ${m.name}: texture_storage_2d<${m.storageFormat||"rgba8unorm"}, ${m.storageAccess.replace("-only","")}>;
`:f?this._shaderPrefix+=`@group(${t}) @binding(${h}) var ${m.name}: texture_cube<${g}>;
`:m.defaultValue.isArray?this._shaderPrefix+=`@group(${t}) @binding(${h}) var ${m.name}: texture_2d_array<${g}>;
`:this._shaderPrefix+=`@group(${t}) @binding(${h}) var ${m.name}: texture_2d<${g}>;
`,h+=1,l+=1}),e.samplers&&e.samplers.forEach(m=>{u.push({binding:h,visibility:r,sampler:{type:"filtering"}}),this._uniformsInfo[m.name]={bindingId:h,index:l,type:"sampler",defaultGpuValue:a.createSampler(m.defaultValue)},this._shaderPrefix+=`@group(${t}) @binding(${h}) var ${m.name}: sampler;
`,h+=1,l+=1}),this._shaderPrefix+=`
`,e.uniforms.forEach((m,f)=>{const d=this._uniformsInfo[m.name];this._uniformsBufferDefault.set(new Uint32Array(d.defaultValue.buffer),d.offset)}),e.storages){const m={};e.storages.forEach(f=>{u.push({binding:h,visibility:r,buffer:{type:f.writable?"storage":"read-only-storage"}});let d=`Storage${f.type}${f.format||"f32"}`;!f.customStruct&&!m[d]&&(this._shaderPrefix+=(m[d]=m[d]||this._getStorageStruct(d,f.type,f.format||"f32"))+`
`),f.customStruct&&(d=f.customStruct.name,this._shaderPrefix+=f.customStruct.code);const _=f.gpuValue?f.gpuValue:O(f.defaultValue,GPUBufferUsage.STORAGE);this._uniformsInfo[f.name]={bindingId:h,index:l,type:"storage",defaultValue:f.defaultValue,defaultGpuValue:_},this._shaderPrefix+=`@group(${t}) @binding(${h}) var<storage, ${f.writable?"read_write":"read"}> ${f.name}: ${d};
`,l+=1,h+=1})}this._uniformLayoutDesc={entries:u},this._uniformLayout=a.createBindGroupLayout(this._uniformLayoutDesc)}get groupId(){return this._groupId}get shaderPrefix(){return this._shaderPrefix}get uniformLayout(){return this._uniformLayout}get uniformsInfo(){return this._uniformsInfo}_getRealLayoutInfo(e,t,n,a){if(a)return{origLen:a.len,realLen:a.len,defaultValue:n};let r,i;switch(e){case"number":r=1,i=4;break;case"vec2":r=2,i=4;break;case"vec3":r=3,i=4;break;case"vec4":case"mat2x2":r=4,i=4;break;case"mat3x3":r=9,i=12;break;case"mat4x4":r=16,i=16;break}const c=n.constructor,l=new c(i*t);for(let h=0;h<t;h+=1)l.set(n.slice(h*r,(h+1)*r),h*i);return{origLen:r,realLen:i,defaultValue:l}}_getStorageStruct(e,t,n){if(t==="number")return`struct ${e} { value: array<${n}>; };`;if(t==="vec2"||t==="vec3"||t==="vec4")return`struct ${e} { value: array<${t}<${n}>>, };`;throw new Error("Not support type!")}createUniformBlock(){const{_uniformDesc:e,_uniformsInfo:t,_uniformsBufferDefault:n}=this,a={},r=[];let i,c;return n&&(c=O(n,GPUBufferUsage.UNIFORM),i=n.slice(),r.push({binding:0,resource:{buffer:c}}),e.uniforms.forEach(l=>{const h=this._uniformsInfo[l.name];a[l.name]={value:new this._uniformsInfo[l.name].defaultValue.constructor(i.buffer,h.offset*4,h.realLen*h.size),gpuValue:c}})),e.textures&&e.textures.forEach(l=>{const h=t[l.name].defaultGpuValue;a[l.name]={value:l.defaultValue,gpuValue:h},r.push({binding:t[l.name].bindingId,resource:h})}),e.samplers&&e.samplers.forEach(l=>{const h=t[l.name].defaultGpuValue;a[l.name]={value:l.defaultValue,gpuValue:h},r.push({binding:t[l.name].bindingId,resource:h})}),e.storages&&e.storages.forEach(l=>{const h=t[l.name].defaultGpuValue;a[l.name]={value:l.defaultValue,gpuValue:h},r.push({binding:t[l.name].bindingId,resource:{buffer:h}})}),{entries:r,values:a,layout:this._uniformLayout,cpuBuffer:i,gpuBuffer:c,isBufferDirty:!1,isDirty:!0}}setUniform(e,t,n,a){const r=this._uniformsInfo[t];if(!r||n===void 0)return;const{entries:i}=e,{bindingId:c,type:l,offset:h,realLen:u,origLen:m}=r,f=e.values[t];if(l==="buffer"){n=n;const d=f.value;if(n=typeof n=="number"?[n]:n,m!==u){const _=n.length/m;for(let g=0;g<_;g+=1)d.set(n.slice(m*g,m*(g+1)),u*g)}else d.set(n);e.isBufferDirty=!0}else if(l==="sampler")f.value=n,console.warn("Not implemented!");else if(l==="storage")f.value=n,i[c].resource.buffer=f.gpuValue=a||O(n,GPUBufferUsage.STORAGE),e.isDirty=!0;else if(B.IS(n)){const d=a?n.getColorViewByName(a):n.colorView;i[c].resource=f.gpuValue=d,f.value=n,e.isDirty=!0;return}else{if(n=n,n.isArray!==f.value.isArray)throw new Error("Require texture2d array!");i[c].resource=f.gpuValue=n.view,f.value=n,e.isDirty=!0;return}}getUniform(e,t){var n;return(n=e.values[t])==null?void 0:n.value}getBindingGroup(e,t){return e.isBufferDirty&&(v.device.queue.writeBuffer(e.gpuBuffer,0,e.cpuBuffer),e.isBufferDirty=!1),e.isDirty&&(t=v.device.createBindGroup({layout:e.layout,entries:e.entries}),e.isDirty=!1),t}}s(J,"CLASS_NAME","UBTemplate");const St={cullMode:"back",primitiveType:"triangle-list",depthCompare:"less-equal"};function It(o){return!!o.cs}class D extends I{constructor(e,t){super();s(this,"isEffect",!0);s(this,"_marcos");s(this,"_renderStates");s(this,"_marcosRegex");s(this,"_vs");s(this,"_fs");s(this,"_cs");s(this,"_shaders",{});s(this,"_ubTemplate");this._options=t,this.name=e;const n=t,a=n.cs?GPUShaderStage.COMPUTE:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT;this._ubTemplate=new J(n.uniformDesc,ce.Material,a),this._renderStates=Object.assign({},St,n.renderState||{}),this._marcos=n.marcos||{},this._marcosRegex={};for(const r in this._marcos)typeof this._marcos[r]=="number"?this._marcosRegex[r]=new RegExp(`\\$\\{${r}\\}`,"g"):this._marcosRegex[r]={hasElse:new RegExp(`#if *defined\\(${r}\\)([\\s\\S]+?)#else([\\s\\S]+?)#endif`,"g"),noElse:new RegExp(`#if *defined\\(${r}\\)([\\s\\S]+?)#endif`,"g")};It(n)?this._cs=n.cs:(this._vs=n.vs,this._fs=n.fs)}get ubTemplate(){return this._ubTemplate}get uniformLayout(){return this._ubTemplate.uniformLayout}get renderStates(){return this._renderStates}get isCompute(){return!!this._cs}createDefaultUniformBlock(){return this._ubTemplate.createUniformBlock()}getShader(e,t,n,a){e=Object.assign({},this._marcos,e);const{device:r}=v,i=this._calcHash(t,n,a,e),c=this._shaders[i];if(c)return c;const l=[this._vs,this._fs,this._cs];for(const _ in this._marcos){const g=e[_],p=this._marcosRegex[_];l.forEach((y,b)=>{if(!!y)if(typeof g=="number")l[b]=y.replace(p,`${g}`);else{const{hasElse:w,noElse:A}=p;w.lastIndex=0,A.lastIndex=0,l[b]=y.replace(w,g?"$1":"$2"),l[b]=l[b].replace(A,g?"$1":"")}})}const h=n+`
`+a+`
`+this._ubTemplate.shaderPrefix,[u,m,f]=l;return this._shaders[i]={vs:u&&r.createShaderModule({code:t+h+u}),fs:m&&r.createShaderModule({code:h+m}),cs:f&&r.createShaderModule({code:h+f})}}_calcHash(e,t,n,a){let r=oe(e);r=(r<<5)-r+oe(t),r=(r<<5)-r+oe(n);for(const i in this._marcos){const c=a[i],l=typeof c=="number"?c:c?1:0;r=(r<<5)-r+l}return r}}s(D,"CLASS_NAME","Effect");var Mt=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  var color: vec4<f32> = material.u_color;

  #if defined(USE_COLOR_0)
    color = color * vec4<f32>(vo.color_0, 1.);
  #endif

  return color;
}`,ae=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@vertex
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  output.Position = global.u_vp * mesh.u_world * vec4<f32>(attrs.position, 1.);

  #if defined(USE_TEXCOORD_0)
    output.texcoord_0 = attrs.texcoord_0;
  #endif

  #if defined(USE_NORMAL)
    output.normal = attrs.normal;
  #endif

  #if defined(USE_TANGENT)
    output.tangent = attrs.tangent;
  #endif

  #if defined(USE_COLOR_0)
    output.color_0 = attrs.color_0;
  #endif

  #if defined(USE_TEXCOORD_1)
    output.texcoord_1 = attrs.texcoord_1;
  #endif

  return output;
}`,At=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) cubeUV: vec3<f32>,
}

@vertex
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  let pos: vec4<f32> = vec4<f32>(attrs.position, 1., 1.);
  output.position = pos;
  let t: vec4<f32> = global.u_skyVP * pos;
  output.cubeUV = normalize(t.xyz / t.w);

  return output;
}`,Dt=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) cubeUV: vec3<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let tex: vec4<f32> = textureSample(u_cubeTexture, u_sampler, vo.cubeUV);
  return vec4<f32>(tex.rgb * material.u_color.rgb * material.u_exposure * material.u_factor, tex.a);
}`,Le=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  return material.u_baseColorFactor * textureSample(u_baseColorTexture, u_sampler, vo.texcoord_0);
}`,Ct=`const c_radius: i32 = \${RADIUS};
const c_windowSize: i32 = \${WINDOW_SIZE};

@compute @workgroup_size(c_windowSize, c_windowSize, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = vec2<i32>(textureDimensions(u_input, 0));
  let windowSize: vec2<i32> = vec2<i32>(c_windowSize, c_windowSize);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * windowSize;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(size);

  var weightsSum: f32 = 0.;
  var res: vec4<f32> = vec4<f32>(0., 0., 0., 1.);
  for (var r: i32 = -c_radius; r <= c_radius; r = r + 1) {
    for (var c: i32 = -c_radius; c <= c_radius; c = c + 1) {
      let iuv: vec2<i32> = baseIndex + vec2<i32>(r, c);

      if (any(iuv < vec2<i32>(0)) || any(iuv >= size)) {
        continue;
      }

      let weightIndex: i32 = (r + c_radius) * c_windowSize + (c + c_radius);
      let weight: f32 = material.u_kernel[weightIndex / 4][weightIndex % 4];
      weightsSum = weightsSum + weight;
      res = res + weight * textureLoad(u_input, iuv, 0);
    }
  }
  res = res / f32(weightsSum);

  textureStore(u_output, baseIndex, res);
}`,Vt=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  return textureSample(u_texture, u_sampler, vo.uv);
}`,de=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

const pos: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
  vec2<f32>(-1.0, -1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(1.0, 1.0)
);
const uv: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
  vec2<f32>(0.0, 1.0),
  vec2<f32>(1.0, 1.0),
  vec2<f32>(0.0, 0.0),
  vec2<f32>(0.0, 0.0),
  vec2<f32>(1.0, 1.0),
  vec2<f32>(1.0, 0.0)
);

@vertex
fn main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
  var output: VertexOutput;

  output.position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  output.uv = uv[VertexIndex];

  #if defined(FLIP)
    output.uv.y = 1. - output.uv.y;
  #endif

  return output;
}`,Lt=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

const A: f32 = 2.51;
const B: f32 = 0.03;
const C: f32 = 2.43;
const D: f32 = 0.59;
const E: f32 = 0.14;	

fn acesToneMapping(color: vec3<f32>) -> vec3<f32> {
  return (color * (A * color + B)) / (color * (C * color + D) + E); 
}

fn gammaCorrect(color: vec3<f32>, gamma: f32) -> vec3<f32> {
  return pow(color, vec3<f32>(1. / gamma));
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let hdrColor: vec4<f32> = textureSample(u_texture, u_sampler, vo.uv);
  var color = acesToneMapping(hdrColor.rgb);

  return vec4<f32>(color, hdrColor.a);
}`,Ft=`const WINDOW_SIZE: i32 = \${WINDOW_SIZE};

fn calcWeightNumber(factor: f32, a: f32, b: f32) -> f32 {
  return exp(factor * (a - b) * (a - b));
}

fn calcWeightVec2(factor: f32, a: vec2<i32>, b: vec2<i32>) -> f32 {
  let diff: vec2<f32> = vec2<f32>(a - b);
  return exp(factor * dot(diff, diff));
}

fn calcWeightVec3(factor: f32, a: vec3<f32>, b: vec3<f32>) -> f32 {
  let diff: vec3<f32> = a - b;
  return exp(factor * dot(diff, diff));
}

fn calcLum(color: vec3<f32>) -> f32 {
  return dot(color, vec3<f32>(0.2125, 0.7154, 0.0721));
}

fn blur(center: vec2<i32>, size: vec2<i32>) -> vec4<f32> {
  let radius: i32 = WINDOW_SIZE / 2;
  let sigmaD: f32 = material.u_filterFactors.x;
  let sigmaC: f32 = material.u_filterFactors.y;
  let sigmaZ: f32 = material.u_filterFactors.z;
  let sigmaN: f32 = material.u_filterFactors.w;
  var centerColor: vec4<f32> = textureLoad(u_preFilter, center, 0);
  let alpha: f32 = centerColor.a;
  let centerPosition = textureLoad(u_gbPositionMetalOrSpec, center, 0).xyz;
  let centerNormal = textureLoad(u_gbNormalGlass, center, 0).xyz;
  var colors: array<array<vec3<f32>, \${WINDOW_SIZE}>, \${WINDOW_SIZE}>;
  var lums: array<array<f32, \${WINDOW_SIZE}>, \${WINDOW_SIZE}>;

  var minUV: vec2<i32> = max(center - vec2<i32>(radius, radius), vec2<i32>(0));
  var maxUV: vec2<i32> = min(center + vec2<i32>(radius, radius), size);
  var localUV: vec2<i32> = vec2<i32>(0, 0);
  var sumLum: f32 = 0.;
  var count: f32 = 0.;

  for (var r: i32 = minUV.x; r <= maxUV.x; r = r + 1) {
    localUV.y = 0;
    for (var c: i32 = minUV.y; c <= maxUV.y; c = c + 1) {
      let iuv: vec2<i32> = vec2<i32>(r, c);
      let color: vec3<f32> = textureLoad(u_preFilter, iuv, 0).rgb;
      let lum: f32 = calcLum(color);
      colors[localUV.x][localUV.y] = color;
      lums[localUV.x][localUV.y] = lum;

      sumLum = sumLum + lum;
      count = count + 1.;
      localUV.y = localUV.y + 1;
    }
    localUV.x = localUV.x + 1;
  }

  let meanLum: f32 = sumLum / count;

  var stdx: f32 = 0.;
  for (var r: i32 = 0; r < localUV.x; r = r + 1) {
    for (var c: i32 = 0; c < localUV.y; c = c + 1) {
      let lum: f32 = lums[r][c];
      stdx = stdx + (lum - meanLum) * (lum - meanLum);
    }
  }
  stdx = sqrt(stdx / (count - 1.));

  let largestLum: f32 = max(meanLum + stdx * 2., 1.);

  var lum: f32 = calcLum(centerColor.rgb);
  if (lum > largestLum) {
    centerColor = centerColor * largestLum / lum;
  }

  localUV = vec2<i32>(0, 0);
  var weightsSum: f32 = 0.;
  var res: vec3<f32> = vec3<f32>(0., 0., 0.);

  for (var r: i32 = minUV.x; r <= maxUV.x; r = r + 1) {
    localUV.y = 0;
    for (var c: i32 = minUV.y; c <= maxUV.y; c = c + 1) {
      var color: vec3<f32> = colors[localUV.x][localUV.y];
      lum = lums[localUV.x][localUV.y];

      if (lum > largestLum) {
        color = color * largestLum / lum;
      }

      let iuv: vec2<i32> = vec2<i32>(r, c);
      let position: vec4<f32> = textureLoad(u_gbPositionMetalOrSpec, iuv, 0);
      let normal: vec4<f32> = textureLoad(u_gbNormalGlass, iuv, 0);
      let weight: f32 = calcWeightVec2(sigmaD, iuv, center)
        * calcWeightVec3(sigmaC, color.rgb, centerColor.rgb)
        * calcWeightVec3(sigmaN, normal.xyz, centerNormal.xyz)
        * calcWeightNumber(sigmaZ, position.z, centerPosition.z);
      weightsSum = weightsSum + weight;
      res = res + weight * color;

      localUV.y = localUV.y + 1;
    }
    localUV.x = localUV.x + 1;
  }

  res = res / weightsSum;

  return vec4<f32>(res, alpha);
}

@compute @workgroup_size(16, 16, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = vec2<i32>(textureDimensions(u_preFilter));
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  if (baseIndex.x >= size.x || baseIndex.y >= size.y) {
    return;
  }

  let result: vec4<f32> = blur(baseIndex, size);

  textureStore(u_output, baseIndex, result);
}`,Rt=`@compute @workgroup_size(16, 16, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = vec2<i32>(textureDimensions(u_current));
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  let pre: vec4<f32> = textureLoad(u_pre, baseIndex, 0);
  let current: vec4<f32> = textureLoad(u_current, baseIndex, 0);
  let mixed: vec4<f32> = vec4<f32>(mix(current.rgb, pre.rgb, vec3<f32>(material.u_preWeight)), current.a);

  textureStore(u_output, baseIndex, mixed);
}`,Et=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) wPosition: vec4<f32>,
  @location(1) texcoord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) @interpolate(flat) meshMatIndex: vec2<u32>,
}

struct FragmentOutput {
  @location(0) positionMetalOrSpec: vec4<f32>,
  @location(1) baseColorRoughOrGloss: vec4<f32>,
  @location(2) normalGlass: vec4<f32>,
  @location(3) meshIndexMatIndexMatType: vec4<u32>,
}

const MAT_TYPE_METAL_ROUGH: u32 = 0u;
const MAT_TYPE_SPEC_GLOSS: u32 = 1u;
const MAT_TYPE_GLASS_METAL_ROUGH: u32 = 2u;
const MAT_TYPE_GLASS_SPEC_GLOSS: u32 = 3u;
const MAT_TYPE_LIGHT: u32 = 4u;

fn isMatSpecGloss(matType: u32) -> bool {
  return matType == MAT_TYPE_SPEC_GLOSS || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatGlass(matType: u32) -> bool {
  return matType == MAT_TYPE_GLASS_METAL_ROUGH || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatLight(matType: u32) -> bool {
  return matType == MAT_TYPE_LIGHT;
}

fn getRoughness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).g;
}

fn getMetallic(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).b;
}

fn getSpecular(factor: vec3<f32>, textureId: i32, uv: vec2<f32>) -> vec3<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).rgb;
}

fn getGlossiness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).a;
}

fn getBaseColor(factor: vec4<f32>, textureId: i32, uv: vec2<f32>) -> vec4<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_baseColorTextures, u_sampler, uv, textureId, 0.);
}

fn getFaceNormal(position: vec3<f32>) -> vec3<f32> {
  return normalize(cross(dpdy(position), dpdx(position)));
}

fn getNormal(
  vNormal: vec3<f32>, position: vec3<f32>, faceNormal: vec3<f32>,
  textureId: i32, uv: vec2<f32>, normalScale: f32
) -> vec3<f32> {
  var normal: vec3<f32> = normalize(vNormal);
  normal = normal * sign(dot(normal, faceNormal));

  
  let dp1: vec3<f32> = dpdx(position);
  let dp2: vec3<f32> = dpdy(position);
  let duv1: vec2<f32> = dpdx(uv);
  let duv2: vec2<f32> = dpdy(uv);
  let dp2perp: vec3<f32> = cross(dp2, normal);
  let dp1perp: vec3<f32> = cross(normal, dp1);
  var dpdu: vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
  var dpdv: vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
  let invmax: f32 = inverseSqrt(max(dot(dpdu, dpdu), dot(dpdv, dpdv)));
  dpdu = dpdu * invmax;
  dpdv = dpdv * invmax;
  let tbn: mat3x3<f32> = mat3x3<f32>(dpdu, dpdv, normal);
  var tNormal: vec3<f32> = 2. * textureSample(u_normalTextures, u_sampler, uv, textureId).xyz - 1.;
  tNormal = tNormal * vec3<f32>(normalScale, normalScale, 1.);

  if (textureId == -1) {
    return normal;
  }

  return normalize(tbn * tNormal);
}

@fragment
fn main(vo: VertexOutput) -> FragmentOutput {
  var fo: FragmentOutput;

  let meshId: u32 = vo.meshMatIndex[0];
  let matId: u32 = vo.meshMatIndex[1];
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[matId];
  let specularGlossinessFactor: vec4<f32> = material.u_specularGlossinessFactors[matId];
  let textureIds: vec4<i32> = material.u_matId2TexturesId[matId];
  let matType = u32(metallicRoughnessFactorNormalScaleMaterialType[3]);
  let isSpecGloss: bool = isMatSpecGloss(matType);

  fo.positionMetalOrSpec = vec4<f32>(vo.wPosition.xyz, 0.);

  let baseColor: vec4<f32> = getBaseColor(material.u_baseColorFactors[matId], textureIds[0], vo.texcoord_0);
  fo.baseColorRoughOrGloss = vec4<f32>(baseColor.rgb, 0.);

  if (isSpecGloss) {
    fo.positionMetalOrSpec.w = getSpecular(specularGlossinessFactor.xyz, textureIds[2], vo.texcoord_0).r;
    fo.baseColorRoughOrGloss.w = getGlossiness(specularGlossinessFactor[3], textureIds[2], vo.texcoord_0);
  } else {
    fo.positionMetalOrSpec.w = getMetallic(metallicRoughnessFactorNormalScaleMaterialType[0], textureIds[2], vo.texcoord_0);
    fo.baseColorRoughOrGloss.w = getRoughness(metallicRoughnessFactorNormalScaleMaterialType[1], textureIds[2], vo.texcoord_0);
  }

  let faceNormal: vec3<f32> = getFaceNormal(vo.wPosition.xyz);
  fo.normalGlass = vec4<f32>(
    getNormal(vo.normal, vo.wPosition.xyz, faceNormal, textureIds[1], vo.texcoord_0, metallicRoughnessFactorNormalScaleMaterialType[2]),
    baseColor.a
  );

  
  fo.meshIndexMatIndexMatType = vec4<u32>(meshId, matId, matType, 2u);

  return fo;
}`,Gt=`struct VertexOutput {
  @location(0) wPosition: vec4<f32>,
  @location(1) texcoord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) @interpolate(flat) meshMatIndex: vec2<u32>,
  @builtin(position) Position: vec4<f32>,
}

@vertex
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;
  
  let wPosition: vec4<f32> = vec4<f32>(attrs.position, 1.);
  
  output.Position = global.u_vp * wPosition;
  output.wPosition = wPosition;
  output.texcoord_0 = attrs.texcoord_0;
  output.normal = attrs.normal;
  output.meshMatIndex.x = attrs.meshMatIndex.x;
  output.meshMatIndex.y = attrs.meshMatIndex.y;

  return output;
}`,Ut=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

struct FragmentOutput {
  @location(0) positionMetalOrSpec: vec4<f32>,
  @location(1) baseColorRoughOrGloss: vec4<f32>,
  @location(2) normalGlass: vec4<f32>,
  @location(3) meshIndexMatIndexMatType: vec4<u32>,
}

@fragment
fn main(vo: VertexOutput) -> FragmentOutput {
  var fo: FragmentOutput;

  fo.baseColorRoughOrGloss = vec4<f32>(material.u_lightColor.rgb, 0.);
  fo.meshIndexMatIndexMatType = vec4<u32>(0u, 0u, 4u, 2u);

  return fo;
}`,Pt=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let uv: vec2<f32> = vo.uv;
  var res: vec4<f32>;

  if (uv.x < .33) {
    res = vec4<f32>(textureSample(u_gbPositionMetalOrSpec, u_sampler, uv).rgb, 1.);
  }
  
  if (uv.x < .66) {
    res = vec4<f32>(textureSample(u_gbBaseColorRoughOrGloss, u_sampler, uv).rgb, 1.);
  }
  
  res = vec4<f32>(textureSample(u_gbNormalGlass, u_sampler, uv).rgb, 1.);

  return res;
}`,Bt=`const PI: f32 = 3.14159265358979;
const MAX_LIGHTS_COUNT: u32 = 4u;
const MAX_RAY_LENGTH: f32 = 9999.;
const BVH_DEPTH: i32 = \${BVH_DEPTH};
const EPS: f32 = 0.005;
const RAY_DIR_OFFSET: f32 = .01;
const RAY_NORMAL_OFFSET: f32 = .01;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

const LIGHT_TYPE_INVALID: u32 = 0u;
const LIGHT_TYPE_AREA: u32 = 1u;
const LIGHT_TYPE_DIRECTIONAL: u32 = 2u;
const LIGHT_TYPE_POINT: u32 = 3u;
const LIGHT_TYPE_SPOT: u32 = 4u;

const LIGHT_AREA_RRCT: u32 = 0u;
const LIGHT_AREA_DISC: u32 = 1u;
const MAT_TYPE_METAL_ROUGH: u32 = 0u;
const MAT_TYPE_SPEC_GLOSS: u32 = 1u;
const MAT_TYPE_GLASS_METAL_ROUGH: u32 = 2u;
const MAT_TYPE_GLASS_SPEC_GLOSS: u32 = 3u;
const MAT_TYPE_LIGHT: u32 = 4u;

fn isMatSpecGloss(matType: u32) -> bool {
  return matType == MAT_TYPE_SPEC_GLOSS || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatGlass(matType: u32) -> bool {
  return matType == MAT_TYPE_GLASS_METAL_ROUGH || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatLight(matType: u32) -> bool {
  return matType == MAT_TYPE_LIGHT;
}

fn getRoughness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).g;
}

fn getMetallic(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).b;
}

fn getSpecular(factor: vec3<f32>, textureId: i32, uv: vec2<f32>) -> vec3<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).rgb;
}

fn getGlossiness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).a;
}

fn getBaseColor(factor: vec4<f32>, textureId: i32, uv: vec2<f32>) -> vec4<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_baseColorTextures, u_sampler, uv, textureId, 0.);
}
struct PBRData {
  reflectance0: vec3<f32>,
  reflectance90: vec3<f32>,
  alphaRoughness: f32,
  diffuseColor: vec3<f32>,
  specularColor: vec3<f32>,
  baseColor: vec3<f32>,
  ao: vec3<f32>,
  roughness: f32,
}

fn pbrSpecularReflection(reflectance0: vec3<f32>, reflectance90: vec3<f32>, VdotH: f32)-> vec3<f32> {
  return reflectance0 + (reflectance90 - reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

fn pbrGeometricOcclusion(NdotL: f32, NdotV: f32, alphaRoughness: f32)-> f32 {
  let r: f32 = alphaRoughness * alphaRoughness;

  let attenuationL: f32 = 2.0 * NdotL / (NdotL + sqrt(r + (1.0 - r) * (NdotL * NdotL)));
  let attenuationV: f32 = 2.0 * NdotV / (NdotV + sqrt(r + (1.0 - r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

fn pbrMicrofacetDistribution(alphaRoughness: f32, NdotH: f32)-> f32 {
  let roughnessSq: f32 = alphaRoughness * alphaRoughness;
  let f: f32 = NdotH * NdotH * (roughnessSq - NdotH) + 1.0;
  return roughnessSq * 0.3183098861837907 / (f * f);
}

fn pbrPrepareData(
  isSpecGloss: bool,
  baseColor: vec3<f32>,
  metal: f32, rough: f32,
  spec: vec3<f32>, gloss: f32
) -> PBRData {
  var pbr: PBRData;

  var specularColor: vec3<f32>;
  var roughness: f32;

  
  if (!isSpecGloss) {
    roughness = clamp(rough, 0.04, 1.0);
    let metallic: f32 = clamp(metal, 0.0, 1.0);
    let f0: vec3<f32> = vec3<f32>(0.04, 0.04, 0.04);

    specularColor = mix(f0, baseColor, vec3<f32>(metallic));
    pbr.diffuseColor = (1.0 - metallic) * (baseColor * (vec3<f32>(1.0, 1.0, 1.0) - f0));
  }
  else {
  
    roughness = 1.0 - gloss;
    specularColor = spec;
    pbr.diffuseColor = baseColor * (1.0 - max(max(specularColor.r, specularColor.g), specularColor.b));
  }
  
  pbr.baseColor = baseColor;
  pbr.specularColor = specularColor;
  pbr.roughness = roughness;
  
  let reflectance: f32 = max(max(specularColor.r, specularColor.g), specularColor.b);
  pbr.reflectance90 = vec3<f32>(clamp(reflectance * 25.0, 0.0, 1.0));
  pbr.reflectance0 = specularColor.rgb;
  pbr.alphaRoughness = roughness * roughness;

  return pbr;
}

fn pbrCalculateLo(
  pbr: PBRData, normal: vec3<f32>,
  viewDir: vec3<f32>, lightDir: vec3<f32>
)-> vec3<f32> {
  let H: vec3<f32> = normalize(lightDir + viewDir);
  let NdotV: f32 = clamp(abs(dot(normal, viewDir)), 0.001, 1.0);
  let NdotL: f32 = clamp(dot(normal, lightDir), 0.001, 1.0);
  let NdotH: f32 = clamp(dot(normal, H), 0.0, 1.0);
  let LdotH: f32 = clamp(abs(dot(lightDir, H)), 0.0, 1.0);
  let VdotH: f32 = clamp(dot(viewDir, H), 0.0, 1.0);
  
  let F: vec3<f32> = pbrSpecularReflection(pbr.reflectance0, pbr.reflectance90, VdotH);
  let G: f32 = pbrGeometricOcclusion(NdotL, NdotV, pbr.alphaRoughness);
  let D: f32 = pbrMicrofacetDistribution(pbr.alphaRoughness, NdotH);

  let specContrib: vec3<f32> = F * G * D / (4.0 * NdotL * NdotV);
  
  return NdotL * specContrib;
}

struct Ray {
  origin: vec3<f32>,
  dir: vec3<f32>,
  invDir: vec3<f32>,
}

struct HitPoint {
  hit: bool,
  hited: f32,
  position: vec3<f32>,
  baseColor: vec3<f32>,
  metal: f32,
  rough: f32,
  spec: vec3<f32>,
  gloss: f32,
  glass: f32,
  normal: vec3<f32>,
  
  sign: f32,
  meshIndex: u32,
  matIndex: u32,
  isSpecGloss: bool,
  isGlass: bool,
  isLight: bool,
  matType: u32,
  pbrData: PBRData,
}

struct Light {
  color: vec3<f32>,
  throughEng: vec3<f32>,
  next: Ray,
}

struct BVHNode {
  child0Index: u32,
  child1Index: u32,
  max: vec3<f32>,
  min: vec3<f32>,
}

struct BVHLeaf {
  primitives: u32,
  indexes: vec3<u32>,
}

struct FragmentInfo {
  hit: bool,
  hitPoint: vec3<f32>,
  t: f32,
  
  weights: vec3<f32>,
  p0: vec3<f32>,
  p1: vec3<f32>,
  p2: vec3<f32>,
  uv0: vec2<f32>,
  uv1: vec2<f32>,
  uv2: vec2<f32>,
  n0: vec3<f32>,
  n1: vec3<f32>,
  n2: vec3<f32>,
  meshIndex: u32,
  matIndex: u32,
  matType: u32,
}

struct Child {
  isLeaf: bool,
  offset: u32,
}

fn getRandom(uv: vec2<f32>, i: i32) -> vec4<f32> {
  let noise: vec4<f32> = textureSampleLevel(u_noise, u_sampler, uv, 0.);

  return fract(material.u_randoms[i] + noise);
}

fn genRay(origin: vec3<f32>, dir: vec3<f32>) -> Ray {
  var ray: Ray;
  ray.origin = origin;
  ray.dir = dir;
  ray.invDir = 1. / ray.dir;

  return ray;
}

fn genWorldRayByGBuffer(uv: vec2<f32>, gBInfo: HitPoint) -> Ray {
  let pixelSSPos: vec4<f32> = vec4<f32>(uv.x * 2. - 1., 1. - uv.y * 2., 0., 1.);
  var pixelWorldPos: vec4<f32> = global.u_viewInverse * global.u_projInverse * pixelSSPos;
  pixelWorldPos = pixelWorldPos / pixelWorldPos.w;

  return genRay(pixelWorldPos.xyz, normalize(gBInfo.position - pixelWorldPos.xyz));
};

fn getGBInfo(index: vec2<i32>) -> HitPoint {
  var info: HitPoint;

  let wPMtlSpec: vec4<f32> = textureLoad(u_gbPositionMetalOrSpec, index, 0);
  let dfRghGls: vec4<f32> = textureLoad(u_gbBaseColorRoughOrGloss, index, 0);
  let nomGlass: vec4<f32> = textureLoad(u_gbNormalGlass, index, 0);
  let meshIdMatIdMatType: vec4<u32> = textureLoad(u_gbMeshIndexMatIndexMatType, index, 0);

  info.position = wPMtlSpec.xyz;
  info.metal = wPMtlSpec.w;
  info.baseColor = dfRghGls.xyz;
  info.rough = dfRghGls.w;
  info.spec = vec3<f32>(wPMtlSpec.w);
  info.gloss = dfRghGls.w;
  info.normal = nomGlass.xyz;
  info.sign = 1.;
  info.glass = nomGlass.w;
  info.meshIndex = meshIdMatIdMatType.x;
  info.matIndex = meshIdMatIdMatType.y;
  let matType: u32 = meshIdMatIdMatType.z;
  info.hit = meshIdMatIdMatType.w == 2u;
  info.hited = f32(meshIdMatIdMatType.w);
  info.isSpecGloss = isMatSpecGloss(matType);
  info.isGlass = isMatGlass(matType);
  info.isLight = info.hit && isMatLight(matType);
  info.matType = matType;
  info.pbrData = pbrPrepareData(info.isSpecGloss, info.baseColor, info.metal, info.rough, info.spec, info.gloss);

  return info;
};
fn decodeChild(index: u32) -> Child {
  return Child((index >> 31u) != 0u, (index << 1u) >> 1u);
}

fn getBVHNodeInfo(offset: u32) -> BVHNode {
  var node: BVHNode;
  let data0: vec4<f32> = u_bvh.value[offset];
  let data1: vec4<f32> = u_bvh.value[offset + 1u];
  node.child0Index = bitcast<u32>(data0[0]);
  node.child1Index = bitcast<u32>(data1[0]);
  node.min = data0.yzw;
  node.max = data1.yzw;

  return node;
}

fn getBVHLeafInfo(offset: u32) -> BVHLeaf {
  var leaf: BVHLeaf;
  let data1: vec4<f32> = u_bvh.value[offset];
  leaf.primitives = bitcast<u32>(data1.x);
  leaf.indexes.x = bitcast<u32>(data1.y);
  leaf.indexes.y = bitcast<u32>(data1.z);
  leaf.indexes.z = bitcast<u32>(data1.w);

  return leaf;
}

fn getFaceNormal(frag: FragmentInfo) -> vec3<f32> {
  return normalize(cross(frag.p1 - frag.p0, frag.p2 - frag.p0));
}

fn getNormal(
  frag: FragmentInfo, uv: vec2<f32>,
  textureId: i32, normalScale: f32
) -> vec3<f32> {
  var normal: vec3<f32> = normalize(
    frag.n0 * frag.weights[0] + frag.n0 * frag.weights[1] + frag.n0 * frag.weights[2]
  );
  normal = normal;

  if (textureId == -1) {
    return normal;
  }

  
  let dp1: vec3<f32> = frag.p1 - frag.p0;
  let dp2: vec3<f32> = frag.p2 - frag.p0;
  let duv1: vec2<f32> = frag.uv2 - frag.uv0;
  let duv2: vec2<f32> = frag.uv1 - frag.uv0;
  let dp2perp: vec3<f32> = cross(dp2, normal);
  let dp1perp: vec3<f32> = cross(normal, dp1);
  var dpdu: vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
  var dpdv: vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
  let invmax: f32 = inverseSqrt(max(dot(dpdu, dpdu), dot(dpdv, dpdv)));
  dpdu = dpdu * invmax;
  dpdv = dpdv * invmax;
  let tbn: mat3x3<f32> = mat3x3<f32>(dpdu, dpdv, normal);
  var tNormal: vec3<f32> = 2. * textureSampleLevel(u_normalTextures, u_sampler, uv, textureId, 0.).xyz - 1.;
  tNormal = tNormal * vec3<f32>(normalScale, normalScale, 1.);

  return normalize(tbn * tNormal);
}

fn boxHitTest(ray: Ray, maxVal: vec3<f32>, minVal: vec3<f32>) -> f32 {
  let t1: vec3<f32> = (minVal - ray.origin) * ray.invDir;
  let t2: vec3<f32> = (maxVal - ray.origin) * ray.invDir;
  let tvmin: vec3<f32> = min(t1, t2);
  let tvmax: vec3<f32> = max(t1, t2);
  let tmin: f32 = max(tvmin.x, max(tvmin.y, tvmin.z));
  let tmax: f32 = min(tvmax.x, min(tvmax.y, tvmax.z));

  if (tmax - tmin < 0.) {
    return -1.;
  }
  
  if (tmin > 0.) {
    return tmin;
  }

  return tmax;
}

fn triangleHitTest(ray: Ray, leaf: BVHLeaf) -> FragmentInfo {
  var info: FragmentInfo;
  let indexes: vec3<u32> = leaf.indexes;
  info.p0 = u_positions.value[indexes[0]];
  info.p1 = u_positions.value[indexes[1]];
  info.p2 = u_positions.value[indexes[2]];

  
  let e0: vec3<f32> = info.p1 - info.p0;
  let e1: vec3<f32> = info.p2 - info.p0;
  let p: vec3<f32> = cross(ray.dir, e1);
  var det: f32 = dot(e0, p);
  var t: vec3<f32> = ray.origin - info.p0;

  if (det < 0.) {
    t = -t;
    det = -det;
  }

  if (det < 0.0001) {
    return info;
  }

  let u: f32 = dot(t, p);

  if (u < 0. || u > det) {
    return info;
  }

  let q: vec3<f32> = cross(t, e0);
  let v: f32 = dot(ray.dir, q);

  if (v < 0. || v + u - det > 0.) {
    return info;
  }

  let lt: f32 = dot(e1, q);

  if (lt < 0.) {
    return info;
  }

  let invDet: f32 = 1. / det;
  info.weights = vec3<f32>(0., u, v) * invDet;
  info.weights.x = 1. - info.weights.y - info.weights.z;

  info.hit = true;
  info.t = lt * invDet;
  info.hitPoint = ray.origin + ray.dir * info.t;
  info.uv0 = u_uvs.value[indexes.x];
  info.uv1 = u_uvs.value[indexes.y];
  info.uv2 = u_uvs.value[indexes.z];
  info.n0 = u_normals.value[indexes.x];
  info.n1 = u_normals.value[indexes.y];
  info.n2 = u_normals.value[indexes.z];
  info.meshIndex = u_meshMatIndexes.value[indexes.x].x;
  info.matIndex = u_meshMatIndexes.value[indexes.x].y;
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[info.matIndex];
  info.matType = u32(metallicRoughnessFactorNormalScaleMaterialType[3]);

  return info;
}

fn leafHitTest(ray: Ray, offset: u32, ignoreGlass: bool) -> FragmentInfo {
  var info: FragmentInfo;
  info.t = MAX_RAY_LENGTH;
  var leaf: BVHLeaf = getBVHLeafInfo(offset);
  let primitives: u32 = leaf.primitives;
  
  for (var i: u32 = 0u; i < primitives; i = i + 1u) {
    leaf = getBVHLeafInfo(offset + i);
    let cInfo: FragmentInfo = triangleHitTest(ray, leaf);

    if (ignoreGlass && isMatGlass(cInfo.matType)) {
      continue;
    }

    if (cInfo.hit && cInfo.t < info.t) {
      info = cInfo;
    }
  }

  return info;
}

fn fillHitPoint(frag: FragmentInfo, ray: Ray) -> HitPoint {
  var info: HitPoint;

  info.hit = true;
  info.hited = frag.t;
  info.meshIndex = frag.meshIndex;
  info.matIndex = frag.matIndex;
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[frag.matIndex];
  info.position = frag.p0 * frag.weights[0] + frag.p1 * frag.weights[1] + frag.p2 * frag.weights[2];
  let uv: vec2<f32> = frag.uv0 * frag.weights[0] + frag.uv1 * frag.weights[1] + frag.uv2 * frag.weights[2];
  let textureIds: vec4<i32> = material.u_matId2TexturesId[frag.matIndex];  
  let faceNormal: vec3<f32> = getFaceNormal(frag);
  info.sign = sign(dot(faceNormal, -ray.dir));
  info.normal = info.sign * getNormal(frag, uv, textureIds[1], metallicRoughnessFactorNormalScaleMaterialType[2]);
  let baseColor: vec4<f32> = getBaseColor(material.u_baseColorFactors[frag.matIndex], textureIds[0], uv);
  info.baseColor = baseColor.rgb;
  info.glass = baseColor.a;
  info.matType = frag.matType;
  info.isSpecGloss = isMatSpecGloss(frag.matType);
  info.isGlass = isMatGlass(frag.matType);

  if (info.isSpecGloss) {
    let specularGlossinessFactors: vec4<f32> = material.u_specularGlossinessFactors[frag.matIndex];
    info.spec = getSpecular(specularGlossinessFactors.xyz, textureIds[2], uv).rgb;
    info.gloss = getGlossiness(specularGlossinessFactors[3], textureIds[2], uv);
  } else {
    info.metal = getMetallic(metallicRoughnessFactorNormalScaleMaterialType[0], textureIds[2], uv);
    info.rough = getRoughness(metallicRoughnessFactorNormalScaleMaterialType[1], textureIds[2], uv);
  }

  info.pbrData = pbrPrepareData(info.isSpecGloss, info.baseColor, info.metal, info.rough, info.spec, info.gloss);

  return info;
}

fn hitTest(ray: Ray) -> HitPoint {
  var hit: HitPoint;
  var fragInfo: FragmentInfo;
  fragInfo.t = MAX_RAY_LENGTH;
  var node: BVHNode;
  var nodeStack: array<u32, \${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset, false);

      if (info.hit && info.t < fragInfo.t) {
        fragInfo = info;
      }

      continue;
    }

    node = getBVHNodeInfo(child.offset);
    let hited: f32 = boxHitTest(ray, node.max, node.min);

    
    
    if (hited < 0.) {
      continue;
    }

    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  if (fragInfo.hit) {
    hit = fillHitPoint(fragInfo, ray);
  }

  return hit;
}

fn hitTestShadow(ray: Ray, maxT: f32) -> FragmentInfo {
  var fragInfo: FragmentInfo;
  var node: BVHNode;
  var nodeStack: array<u32, \${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset, true);

      if (info.hit && info.t < maxT && info.t > EPS) {
        return info;
      }

      continue;
    }

    node = getBVHNodeInfo(child.offset);
    let hited: f32 = boxHitTest(ray, node.max, node.min);

    if (hited < 0.) {
      continue;
    }

    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  return fragInfo;
}

fn hitTestXZPlane(ray: Ray, inverseMat: mat4x4<f32>) -> vec3<f32> {
  let invDir: vec3<f32> = normalize((inverseMat * vec4<f32>(ray.dir, 0.)).xyz);
  let normal: vec3<f32> = vec3<f32>(0., 0., 1.);
  let dotVal: f32 = dot(invDir, normal);

  if (abs(dotVal) < EPS) {
    return vec3<f32>(MAX_RAY_LENGTH, MAX_RAY_LENGTH, MAX_RAY_LENGTH);
  }
  
  let invOrigin: vec3<f32> = (inverseMat * vec4<f32>(ray.origin, 1.)).xyz;
  let t: f32 = dot(-invOrigin, normal) / dotVal;

  if (t < EPS) {
    return vec3<f32>(MAX_RAY_LENGTH, MAX_RAY_LENGTH, MAX_RAY_LENGTH);
  }

  return vec3<f32>(invOrigin.xy + t * invDir.xy, t);
}

fn hitTestLights(ray: Ray) -> vec4<f32> {
  let areaLight: LightInfo = global.u_lightInfos[0];
  var res: vec4<f32> = vec4<f32>(areaLight.color.rgb, MAX_RAY_LENGTH);
  
  if (areaLight.lightType != LIGHT_TYPE_AREA) {
    return res;
  }

  let xyt: vec3<f32> = hitTestXZPlane(ray, areaLight.worldTransformInverse);

  var hit: bool = false;
  if (areaLight.areaMode == LIGHT_AREA_DISC) {
    hit = length(xyt.xy) < areaLight.areaSize.x;
  } else {
    hit = all(abs(xyt.xy) < areaLight.areaSize / 2.);
  }

  if (hit) {
    res.a = xyt.z;
  }

  return res;
}
fn getDiffuseProb(hit: HitPoint) -> f32 {
  let lumDiffuse: f32 = max(.01, dot(hit.pbrData.diffuseColor, vec3<f32>(0.2125, 0.7154, 0.0721)));
  let lumSpecular: f32 = max(.01, dot(hit.pbrData.specularColor, vec3<f32>(0.2125, 0.7154, 0.0721)));

  return lumDiffuse / (lumDiffuse + lumSpecular);
}

fn orthonormalBasis(normal: vec3<f32>) -> mat3x3<f32> {
  
  
  var zsign: f32 = 1.;
  if (normal.z < 0.) {
    zsign = -1.;
  }
  let a: f32 = -1.0 / (zsign + normal.z);
  let b: f32 = normal.x * normal.y * a;
  let s: vec3<f32> = vec3<f32>(1.0 + zsign * normal.x * normal.x * a, zsign * b, -zsign * normal.x);
  let t: vec3<f32> = vec3<f32>(b, zsign + normal.y * normal.y * a, -normal.y);

  return mat3x3<f32>(s, t, normal);
}

fn sampleCircle(pi: vec2<f32>) -> vec2<f32> {
  let p: vec2<f32> = 2.0 * pi - 1.0;
  let greater: bool = abs(p.x) > abs(p.y);
  var r: f32;
  var theta: f32;

  if (greater) {
    r = p.x;
    theta = 0.25 * PI * p.y / p.x;
  } else {
    r = p.y;
    theta = PI * (0.5 - 0.25 * p.x / p.y);
  }

  return r * vec2<f32>(cos(theta), sin(theta));
}

fn fresnelSchlickWeight(cosTheta: f32) -> f32 {
  let w: f32 = 1.0 - cosTheta;

  return (w * w) * (w * w) * w;
}

fn fresnelSchlickTIR(cosTheta: f32, r0: f32, ni: f32) -> f32 {
  
  var cos: f32 = cosTheta;
  if (cosTheta < 0.0) {
    let inv_eta: f32 = ni;
    let SinT2: f32 = inv_eta * inv_eta * (1.0 - cosTheta * cosTheta);
    if (SinT2 > 1.0) {
      return 1.0; 
    }

    cos = sqrt(1. - SinT2);
  }

  return mix(fresnelSchlickWeight(cos), 1.0, r0);
}

fn cosineSampleHemisphere(p: vec2<f32>) -> vec3<f32> {
  let h: vec2<f32> = sampleCircle(p);
  let z: f32 = sqrt(max(0.0, 1.0 - h.x * h.x - h.y * h.y));

  return vec3<f32>(h, z);
}

fn calcDiffuseLightDir(basis: mat3x3<f32>, sign: f32, random: vec2<f32>) -> vec3<f32> {
  return basis * sign * cosineSampleHemisphere(random);
}

fn calcSpecularLightDir(basis: mat3x3<f32>, ray: Ray, hit: HitPoint, random: vec2<f32>) -> vec3<f32> {
  let phi: f32 = PI * 2. * random.x;
  let alpha: f32 = hit.pbrData.alphaRoughness;
  let cosTheta: f32 = sqrt((1.0 - random.y) / (1.0 + (alpha * alpha - 1.0) * random.y));
  let sinTheta: f32 = sqrt(1.0 - cosTheta * cosTheta);
  let halfVector: vec3<f32> = basis * hit.sign * vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);

  return reflect(ray.dir, halfVector);
}

fn calcBrdfDir(ray: Ray, hit: HitPoint, isDiffuse: bool, random: vec2<f32>) -> vec3<f32> {
  let basis: mat3x3<f32> = orthonormalBasis(hit.normal);

  if (isDiffuse) {
    return calcDiffuseLightDir(basis, hit.sign, random);
  }

  return calcSpecularLightDir(basis, ray, hit, random);
}

struct BSDFDirRes {
  dir: vec3<f32>,
  isBTDF: bool,
}

fn calcBsdfDir(ray: Ray, hit: HitPoint, reflectProbability: f32) -> BSDFDirRes {
  const nAir: f32 = 1.;
  let nGlass: f32 = 1. / hit.glass;
  var ior: f32 = nGlass; 
  var res: BSDFDirRes;

  if (hit.sign > 0.) {
    ior = hit.glass; 
  }

  let cosTheta: f32 = dot(hit.normal, -ray.dir);
  var r0: f32 = (nAir - nGlass) / (nAir + nGlass);
  r0 = r0 * r0;
  let F: f32 = fresnelSchlickTIR(cosTheta, r0, ior);

  
  if (F > reflectProbability) {
    res.dir = reflect(ray.dir, hit.normal);
    res.isBTDF = false;
  } else {
    res.dir = refract(ray.dir, hit.normal, ior);
    res.isBTDF = true;
  }

  return res;
}
fn calcBrdfDirectOrSpecular(
  pbr: PBRData, normal: vec3<f32>,
  viewDir: vec3<f32>, lightDir: vec3<f32>,
  isDirect: bool, probDiffuse: f32
)-> vec3<f32> {
  let H: vec3<f32> = normalize(lightDir + viewDir);
  let NdotV: f32 = clamp(abs(dot(normal, viewDir)), 0.001, 1.0);
  let NdotL: f32 = clamp(abs(dot(normal, lightDir)), 0.001, 1.0);
  let NdotH: f32 = clamp(abs(dot(normal, H)), 0.0, 1.0);
  let LdotH: f32 = clamp(abs(dot(lightDir, H)), 0.0, 1.0);
  let VdotH: f32 = clamp(dot(viewDir, H), 0.0, 1.0);
  
  let F: vec3<f32> = pbrSpecularReflection(pbr.reflectance0, pbr.reflectance90, VdotH);
  let G: f32 = pbrGeometricOcclusion(NdotL, NdotV, pbr.alphaRoughness);
  let D: f32 = pbrMicrofacetDistribution(pbr.alphaRoughness, NdotH);

  let specular: vec3<f32> = F * G * D / (4.0 * NdotL * NdotV);

  if (isDirect) {
    let diffuse: vec3<f32> = NdotL * 0.3183098861837907 * pbr.diffuseColor;
    return specular + diffuse;
  }

  let specularPdf: f32 = D * NdotH / (4.0 * LdotH);
  return NdotL * specular / (mix(specularPdf, 0., probDiffuse));
}

fn calcDirectColor(ray: Ray, hit: HitPoint, random: vec2<f32>) -> vec3<f32> {
  
  let areaLight: LightInfo = global.u_lightInfos[0];

  
  if (areaLight.lightType != LIGHT_TYPE_AREA) {
    return vec3<f32>(0.);
  }

  var samplePoint2D: vec2<f32>;
  let normal: vec3<f32> = normalize((areaLight.worldTransform * vec4<f32>(0., 0., -1., 0.)).xyz);
  var area: f32;
  if (areaLight.areaMode == LIGHT_AREA_DISC) {
    samplePoint2D = sampleCircle(random) * areaLight.areaSize.x;
    area = 2. * PI * areaLight.areaSize.x;
  } else {
    samplePoint2D = (random) * areaLight.areaSize;
    area = samplePoint2D.x * samplePoint2D.y;
    samplePoint2D = samplePoint2D * 2. - areaLight.areaSize;
  }

  let samplePoint: vec4<f32> = areaLight.worldTransform * vec4<f32>(samplePoint2D.x, samplePoint2D.y, 0., 1.);
  var sampleDir: vec3<f32> = samplePoint.xyz - hit.position;

  let cosine: f32 = dot(normal, sampleDir);
  if (cosine > 0.) {
    
    return vec3<f32>(0.);
  }

  let maxT: f32 = length(sampleDir);
  sampleDir = normalize(sampleDir);
  let sampleLight: Ray = genRay(hit.position + RAY_DIR_OFFSET * sampleDir + RAY_NORMAL_OFFSET * hit.normal, sampleDir);
  let shadowInfo: FragmentInfo = hitTestShadow(sampleLight, maxT);

  if (shadowInfo.hit) {
    return vec3<f32>(0.);
  }

  let pdf: f32 = maxT * maxT / (area * -cosine);
  let directLight: vec3<f32> = areaLight.color.rgb / pdf;
  let brdf = calcBrdfDirectOrSpecular(hit.pbrData, hit.normal, -ray.dir, sampleDir, true, 0.);

  return directLight * brdf;
}

fn calcDiffuseFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>, probDiffuse: f32) -> vec3<f32> {
  
  return hit.pbrData.diffuseColor / probDiffuse;
}

fn calcSpecularFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>, probDiffuse: f32) -> vec3<f32> {
  return calcBrdfDirectOrSpecular(hit.pbrData, hit.normal, -ray.dir, nextDir.xyz, false, probDiffuse);
}

fn calcTransmissionFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>) -> vec3<f32> {
  return hit.baseColor;
}

fn calcOutColor(ray: Ray, hit: HitPoint) -> vec3<f32> {
  
  let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, ray.dir, 0.);
  return bgColor.rgb / bgColor.a * global.u_envColor.rgb;
}

fn calcLight(ray: Ray, hit: HitPoint, baseUV: vec2<f32>, bounce: i32, isLast: bool, isOut: bool, debugIndex: i32) -> Light {
  var light: Light;
  let random = getRandom(baseUV, bounce);

  if (isOut) {
    
    light.color = calcOutColor(ray, hit);
    return light;
  }

  var nextDir: vec3<f32>;
  var isBTDF: bool = false;
  if (hit.isGlass) {
    
    if (isLast) {
      return light;
    }
    
    let next: BSDFDirRes = calcBsdfDir(ray, hit, random.x);
    nextDir = next.dir;
    isBTDF = next.isBTDF;

    if (isBTDF) {
      light.throughEng = calcTransmissionFactor(ray, hit, nextDir.xyz);
    } else {
      light.throughEng = calcSpecularFactor(ray, hit, nextDir.xyz, 0.);
    }
  } else {
    
    light.color = calcDirectColor(ray, hit, random.zw);

    if (isLast) {
      return light;
    }

    let probDiffuse: f32 = getDiffuseProb(hit);
    let isDiffuse: bool = random.z < probDiffuse;
    nextDir = calcBrdfDir(ray, hit, isDiffuse, random.xy);

    if (isDiffuse) {
      light.throughEng = calcDiffuseFactor(ray, hit, nextDir.xyz, probDiffuse);
    } else {
      light.throughEng = calcSpecularFactor(ray, hit, nextDir.xyz, probDiffuse);
    }
  }

  
  if (isBTDF) {
    
    light.next = genRay(hit.position + light.next.dir * RAY_DIR_OFFSET - RAY_NORMAL_OFFSET * hit.normal, nextDir.xyz);
  } else {
    light.next = genRay(hit.position + light.next.dir * RAY_DIR_OFFSET + RAY_NORMAL_OFFSET * hit.normal, nextDir.xyz);
  }

  return light;
}

fn traceLight(startRay: Ray, gBInfo: HitPoint, baseUV: vec2<f32>, debugIndex: i32) -> vec3<f32> {
  var light: Light = calcLight(startRay, gBInfo, baseUV, 0, false, false, debugIndex);
  var lightColor: vec3<f32> = light.color;
  var throughEng: vec3<f32> = light.throughEng;
  var hit: HitPoint;
  var ray: Ray = light.next;
  var lightHited: vec4<f32>;
  var bounce: i32 = 0;

  loop {
    let preIsGlass = hit.isGlass;
    lightHited = hitTestLights(ray);
    hit = hitTest(ray);
    let isHitLight: bool = lightHited.a <= hit.hited;
    let isOut: bool = !hit.hit || isHitLight;
    
    let isLast: bool = !hit.isGlass;

    if (preIsGlass && isHitLight) {
      light.color = lightHited.rgb;
    } else {
      light = calcLight(ray, hit, baseUV, bounce, isLast, isOut, debugIndex);
      ray = light.next;
    }

    lightColor = lightColor + light.color * throughEng;
    throughEng = throughEng * light.throughEng;
    bounce = bounce + 1;

    if (max(throughEng.x, max(throughEng.y, throughEng.z)) < 0.01 || isOut) {
      break;
    }
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  return lightColor;
}

@compute @workgroup_size(16, 16, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let screenSize: vec2<i32> = vec2<i32>(textureDimensions(u_gbPositionMetalOrSpec, 0));
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(screenSize);
  let gBInfo: HitPoint = getGBInfo(baseIndex);
  let debugIndex: i32 = baseIndex.x + baseIndex.y * screenSize.x;

  if (gBInfo.isLight) {
    textureStore(u_output, baseIndex, vec4<f32>(gBInfo.baseColor, 1.));
    return;
  }

  if (!gBInfo.hit) {
    let t: vec4<f32> = global.u_skyVP * vec4<f32>(baseUV.x * 2. - 1., 1. - baseUV.y * 2., 1., 1.);
    let cubeUV: vec3<f32> = normalize(t.xyz / t.w);
    let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, cubeUV, 0.);
    
    textureStore(u_output, baseIndex, vec4<f32>(bgColor.rgb / bgColor.a * global.u_envColor.rgb, 1.));
    return;
  }

  let worldRay: Ray = genWorldRayByGBuffer(baseUV, gBInfo);
  let light: vec3<f32> = traceLight(worldRay, gBInfo, baseUV, debugIndex);
  textureStore(u_output, baseIndex, vec4<f32>(light, 1.));
}`;const T={},X={USE_TEXCOORD_0:!1,USE_NORMAL:!1,USE_TANGENT:!1,USE_COLOR_0:!1,USE_TEXCOORD_1:!1};function Nt(){const o={value:new Float32Array(4),gpuValue:O(new Float32Array(4),GPUBufferUsage.STORAGE)};T.rColor=new D("rColor",{vs:ae,fs:Mt,uniformDesc:{uniforms:[{name:"u_color",type:"vec4",defaultValue:new Float32Array([1,0,0,1])}]},marcos:X}),T.rUnlit=new D("rUnlit",{vs:ae,fs:Le,uniformDesc:{uniforms:[{name:"u_baseColorFactor",type:"vec4",defaultValue:new Float32Array([1,1,1,1])}],textures:[{name:"u_baseColorTexture",defaultValue:x.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:X}),T.rPBR=new D("rPBR",{vs:ae,fs:Le,uniformDesc:{uniforms:[{name:"u_baseColorFactor",type:"vec4",defaultValue:new Float32Array([1,1,1,1])},{name:"u_normalTextureScale",type:"number",defaultValue:new Float32Array([1])},{name:"u_metallicFactor",type:"number",defaultValue:new Float32Array([1])},{name:"u_roughnessFactor",type:"number",defaultValue:new Float32Array([1])},{name:"u_specularFactor",type:"vec3",defaultValue:new Float32Array([3])},{name:"u_glossinessFactor",type:"number",defaultValue:new Float32Array([1])}],textures:[{name:"u_baseColorTexture",defaultValue:x.empty},{name:"u_normalTexture",defaultValue:x.empty},{name:"u_metallicRoughnessTexture",defaultValue:x.empty},{name:"u_specularGlossinessTexture",defaultValue:x.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:Object.assign({},X,{USE_SPEC_GLOSS:!1,USE_GLASS:!1})}),T.rSkybox=new D("rSkybox",{vs:At,fs:Dt,uniformDesc:{uniforms:[{name:"u_color",type:"vec4",defaultValue:C(new Float32Array(4))},{name:"u_factor",type:"number",defaultValue:new Float32Array(1)},{name:"u_rotation",type:"number",defaultValue:new Float32Array(1)},{name:"u_exposure",type:"number",defaultValue:new Float32Array(1)}],textures:[{name:"u_cubeTexture",defaultValue:x.cubeWhite}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]}}),T.rRTGBuffer=new D("rRTGBuffer",{vs:Gt,fs:Et,uniformDesc:{uniforms:[{name:"u_matId2TexturesId",type:"vec4",format:"i32",size:128,defaultValue:new Int32Array(2*128)},{name:"u_baseColorFactors",type:"vec4",size:128,defaultValue:new Float32Array(4*128)},{name:"u_metallicRoughnessFactorNormalScaleMaterialTypes",type:"vec4",size:128,defaultValue:new Float32Array(128)},{name:"u_specularGlossinessFactors",type:"vec4",size:128,defaultValue:new Float32Array(128)}],textures:[{name:"u_baseColorTextures",defaultValue:x.array1white},{name:"u_normalTextures",defaultValue:x.array1white},{name:"u_metalRoughOrSpecGlossTextures",defaultValue:x.array1white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:X}),T.rRTGBufferLight=new D("rRTGBufferLight",{vs:ae,fs:Ut,uniformDesc:{uniforms:[{name:"u_lightColor",type:"vec4",defaultValue:new Float32Array(4)}],textures:[],samplers:[]},marcos:X}),T.cRTSS=new D("cRTSS",{cs:Bt,uniformDesc:{uniforms:[{name:"u_randoms",type:"vec4",size:4,defaultValue:new Float32Array(16)},{name:"u_matId2TexturesId",type:"vec4",format:"i32",size:128,defaultValue:new Int32Array(2*128)},{name:"u_baseColorFactors",type:"vec4",size:128,defaultValue:new Float32Array(4*128)},{name:"u_metallicRoughnessFactorNormalScaleMaterialTypes",type:"vec4",size:128,defaultValue:new Float32Array(128)},{name:"u_specularGlossinessFactors",type:"vec4",size:128,defaultValue:new Float32Array(128)}],storages:[{name:"u_positions",type:"vec3",defaultValue:o.value,gpuValue:o.gpuValue},{name:"u_normals",type:"vec3",defaultValue:o.value,gpuValue:o.gpuValue},{name:"u_uvs",type:"vec2",defaultValue:o.value,gpuValue:o.gpuValue},{name:"u_meshMatIndexes",type:"vec2",format:"u32",defaultValue:o.value,gpuValue:o.gpuValue},{name:"u_bvh",type:"vec4",defaultValue:o.value,gpuValue:o.gpuValue},{name:"u_debugInfo",type:"number",customStruct:{name:"DebugInfo",code:`
struct DebugRay {
  preOrigin: vec4<f32>,
  preDir: vec4<f32>,
  origin: vec4<f32>,
  dir: vec4<f32>,
  nextOrigin: vec4<f32>,
  nextDir: vec4<f32>,
  normal: vec4<f32>,
}

struct DebugInfo {
  rays: array<DebugRay>,
}`},writable:!0,defaultValue:o.value,gpuValue:o.gpuValue}],textures:[{name:"u_output",defaultValue:x.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_noise",defaultValue:x.empty},{name:"u_gbPositionMetalOrSpec",defaultValue:x.empty},{name:"u_gbBaseColorRoughOrGloss",defaultValue:x.empty},{name:"u_gbNormalGlass",defaultValue:x.empty},{name:"u_gbMeshIndexMatIndexMatType",format:"uint",defaultValue:x.empty},{name:"u_baseColorTextures",defaultValue:x.array1white},{name:"u_normalTextures",defaultValue:x.array1white},{name:"u_metalRoughOrSpecGlossTextures",defaultValue:x.array1white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}},{name:"u_samplerGB",defaultValue:{magFilter:"nearest",minFilter:"nearest"}}]},marcos:{BVH_DEPTH:0}}),T.cRTDenoiseTempor=new D("cRTDenoiseTempor",{cs:Rt,uniformDesc:{uniforms:[{name:"u_preWeight",type:"number",format:"f32",defaultValue:new Float32Array([1])}],textures:[{name:"u_output",defaultValue:x.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_pre",defaultValue:x.empty,storageFormat:"rgba16float"},{name:"u_current",defaultValue:x.empty,storageFormat:"rgba16float"}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]}}),T.cRTDenoiseSpace=new D("cRTDenoiseSpace",{cs:Ft,uniformDesc:{uniforms:[{name:"u_filterFactors",type:"vec4",defaultValue:yt(new Float32Array([3,.1,2,.1]))}],textures:[{name:"u_output",defaultValue:x.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_preFilter",defaultValue:x.empty,storageFormat:"rgba16float"},{name:"u_gbPositionMetalOrSpec",defaultValue:x.empty},{name:"u_gbNormalGlass",defaultValue:x.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:{WINDOW_SIZE:7}}),T.iRTGShow=new D("iRTGShow",{vs:de,fs:Pt,uniformDesc:{uniforms:[],textures:[{name:"u_gbPositionMetalOrSpec",defaultValue:x.empty},{name:"u_gbBaseColorRoughOrGloss",defaultValue:x.empty},{name:"u_gbNormalGlass",defaultValue:x.empty},{name:"u_gbMeshIndexMatIndexMatType",format:"uint",defaultValue:x.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),T.iBlit=new D("iBlit",{vs:de,fs:Vt,uniformDesc:{uniforms:[],textures:[{name:"u_texture",defaultValue:x.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),T.iTone=new D("iTone",{vs:de,fs:Lt,uniformDesc:{uniforms:[],textures:[{name:"u_texture",defaultValue:x.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),T.cCreateSimpleBlur=e=>{const t=Math.pow(e*2+1,2),n=t%4,a=t+(4-n);return new D("cSimpleBlur-"+e,{cs:Ct,uniformDesc:{uniforms:[{name:"u_kernel",type:"vec4",size:a/4,defaultValue:new Float32Array(a).fill(1)}],textures:[{name:"u_input",defaultValue:x.white},{name:"u_output",defaultValue:x.white,storageAccess:"write-only"}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{RADIUS:e,WINDOW_SIZE:e*2+1,TILE_SIZE:e*4+1}})}}const Q={};function Ot(){Q.global=new J({uniforms:[{name:"u_vp",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_view",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_proj",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_viewInverse",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_projInverse",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_skyVP",type:"mat4x4",defaultValue:C(new Float32Array(16))},{name:"u_gameTime",type:"number",defaultValue:new Float32Array([0])},{name:"u_envColor",type:"vec4",defaultValue:new Float32Array([0,0,0,0])},{name:"u_lightInfos",customType:{name:"LightInfo",len:40,code:`
struct LightInfo {
  lightType: u32,
  areaMode: u32,
  areaSize: vec2<f32>,
  color: vec4<f32>,
  worldTransform: mat4x4<f32>,
  worldTransformInverse: mat4x4<f32>,
}`},type:"vec4",size:4,defaultValue:new Float32Array(40*4)}],textures:[{name:"u_envTexture",defaultValue:x.cubeBlack}]},ce.Global),Q.staticMesh=new J({uniforms:[{name:"u_world",type:"mat4x4",defaultValue:C(new Float32Array(16))}]},ce.Mesh)}async function zt(){await bt(),Ot(),wt(),Nt()}class ee extends I{constructor(e){super();s(this,"isImageMesh",!0);s(this,"_pipeline");this._material=e}get material(){return this._material}set material(e){this._material=e,this._pipeline=null}render(e){const{_material:t}=this;!this._pipeline&&this._createPipeline(),e.setBindGroup(1,t.bindingGroup),e.setPipeline(this._pipeline),e.draw(6,1,0,0)}_createPipeline(){const{device:e,swapChainFormat:t}=v,{_material:n}=this,{vs:a,fs:r}=n.effect.getShader(n.marcos,"",v.shaderPrefix,"");this._pipeline=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[v.uniformLayout,n.effect.uniformLayout]}),vertex:{module:a,entryPoint:"main"},fragment:{module:r,targets:[{format:t}],entryPoint:"main"},primitive:{topology:"triangle-list"}})}}s(ee,"CLASS_NAME","ImageMesh");const Ht=new Float32Array([1,1,1]);class E extends I{constructor(){super();s(this,"isNode",!0);s(this,"active",!0);s(this,"_mem");s(this,"_pos");s(this,"_scale");s(this,"_quat");s(this,"_worldMat");s(this,"_parent");s(this,"_children",[]);this._mem=new ArrayBuffer((3+3+4+16)*4*4),this._pos=new Float32Array(this._mem,0,3),(this._scale=new Float32Array(this._mem,3*4,3)).set(Ht),this._quat=Ze(new Float32Array(this._mem,6*4,4)),this._worldMat=C(new Float32Array(this._mem,10*4,16))}get pos(){return this._pos}get scale(){return this._scale}get quat(){return this._quat}get worldMat(){return this._worldMat}addChild(e){this._children.push(e),e._parent=this}removeChild(e){const t=this._children.indexOf(e);t>=0&&(this._children.splice(t,1),e._parent=null)}setLocalMat(e){this._updateTRSFromMat(e)}updateMatrix(){this.updateWorldMatrix()}updateWorldMatrix(e){Ke(this._worldMat,this._quat,this._pos,this._scale),e=e||this._parent,e&&Je(this._worldMat,e.worldMat,this._worldMat)}dfs(e,t){const n=e(this,t),a=this._children;for(let r=0;r<a.length;r+=1){const i=a[r];i.active&&i.dfs(e,n)}}updateSubTree(e){!this.active||this.dfs(t=>{t.updateMatrix(),e&&e(t)})}_updateTRSFromMat(e){R(this._pos,e),xe(this._quat,e),Qe(this._scale,e)}}s(E,"CLASS_NAME","Node");const Ae=class extends E{constructor(e,t){super();s(this,"isMesh",!0);s(this,"sortZ",0);s(this,"_pipelines",{});s(this,"_matVersion",-1);s(this,"_ubTemplate");s(this,"_uniformBlock");s(this,"_bindingGroup");this._geometry=e,this._material=t,this._ubTemplate=Q.staticMesh,this._uniformBlock=this._ubTemplate.createUniformBlock()}static IS(e){return!!e.isMesh}get geometry(){return this._geometry}get material(){return this._material}set material(e){this._material=e,this._pipelines={}}clone(){const e=new Ae(this._geometry,this._material);return e.pos.set(this.pos),e.quat.set(this.quat),e.scale.set(this.scale),e}render(e,t){const{_geometry:n,_material:a}=this;(a.version!==this._matVersion||!this._pipelines[t.pipelineHash])&&(this._createPipeline(t),this._matVersion=a.version),this.setUniform("u_world",this._worldMat),this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),n.vertexes.forEach((r,i)=>{e.setVertexBuffer(i,r)}),e.setIndexBuffer(n.indexes,n.indexFormat),e.setBindGroup(1,a.bindingGroup),e.setBindGroup(2,this._bindingGroup),e.setPipeline(this._pipelines[t.pipelineHash]),e.drawIndexed(n.count,1,0,0,0)}setUniform(e,t,n){this._ubTemplate.setUniform(this._uniformBlock,e,t,n)}getUniform(e){return this._ubTemplate.getUniform(this._uniformBlock,e)}_createPipeline(e){const{device:t}=v,{_geometry:n,_material:a,_ubTemplate:r}=this;this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup);const i=Object.assign({},n.marcos,a.marcos),{vs:c,fs:l}=a.effect.getShader(i,n.attributesDef,v.shaderPrefix,r.shaderPrefix);this._pipelines[e.pipelineHash]=t.createRenderPipeline({layout:t.createPipelineLayout({bindGroupLayouts:[v.uniformLayout,a.effect.uniformLayout,r.uniformLayout]}),vertex:{module:c,entryPoint:"main",buffers:n.vertexLayouts},fragment:{module:l,targets:e.colorFormats.map(h=>({format:h,blend:a.blendColor?{color:a.blendColor,alpha:a.blendAlpha}:void 0})),entryPoint:"main"},primitive:{topology:a.primitiveType,cullMode:a.cullMode},depthStencil:e.depthStencilFormat&&{format:e.depthStencilFormat,depthWriteEnabled:!0,depthCompare:a.depthCompare}})}};let G=Ae;s(G,"CLASS_NAME","Mesh");var ge=(o=>(o[o.INVALID=0]="INVALID",o[o.Area=1]="Area",o[o.Directional=2]="Directional",o[o.Point=3]="Point",o[o.Spot=4]="Spot",o))(ge||{}),ve=(o=>(o[o.Rect=0]="Rect",o[o.Disc=1]="Disc",o))(ve||{});class fe extends E{constructor(e,t,n){super();s(this,"isLight",!0);s(this,"_areaMode");s(this,"_areaSize");s(this,"_color");s(this,"_worldPos",new Float32Array(3));s(this,"_worldDir",new Float32Array(3));s(this,"_ubInfo");s(this,"_mesh");this._type=e,this._color=new Float32Array(t),this._ubInfo=new Float32Array(40);const a=new Uint32Array(this._ubInfo.buffer);a[0]=e,e===1&&(this._areaMode=n.mode,this._areaSize=new Float32Array(n.size),a[1]=this._areaMode,this._ubInfo.set(this._areaSize,2))}static IS(e){return!!e.isLight}get ubInfo(){return this._ubInfo}setColor(e,t,n){this._color.set(new Float32Array([e,t,n]))}requireLightMesh(e){if(this._type!==1)throw new Error("Light mesh only support area!");return this._mesh||(this._mesh=new G(this._areaMode===0?$.rectLight:$.discLight,e)),this._mesh}updateMatrix(){super.updateMatrix(),R(this._worldPos,this._worldMat),Pe(this._worldDir,[0,0,1],this._worldMat),this._mesh&&(this._mesh.scale.set(this._areaMode===1?[this._areaSize[0],this._areaSize[0],0]:[this._areaSize[0],this._areaSize[1],0]),this._mesh.updateWorldMatrix(this),this._mesh.material.setUniform("u_lightColor",this._color)),this._ubInfo.set(this._color,4),this._ubInfo.set(this._worldMat,8),this._ubInfo.set(ie(new Float32Array(16),this._worldMat),24)}}s(fe,"CLASS_NAME","Light");class V extends I{constructor(e,t,n,a){super();s(this,"isMaterial",!0);s(this,"_version",0);s(this,"_isBufferDirty",!1);s(this,"_isDirty",!0);s(this,"_uniformBlock");s(this,"_bindingGroup");s(this,"_marcos");s(this,"_renderStates");this._effect=e,this._uniformBlock=e.createDefaultUniformBlock(),t&&Object.keys(t).forEach(r=>this.setUniform(r,t[r])),this._marcos=n||{},this._renderStates=a||{}}get effect(){return this._effect}get marcos(){return this._marcos}get version(){return this._version}get bindingGroup(){return this._bindingGroup=this._effect.ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),this._bindingGroup}get primitiveType(){return this._renderStates.primitiveType||this._effect.renderStates.primitiveType}get cullMode(){return this._renderStates.cullMode||this._effect.renderStates.cullMode}get depthCompare(){return this._renderStates.depthCompare||this._effect.renderStates.depthCompare}get blendColor(){return this._renderStates.blendColor||this._effect.renderStates.blendColor}get blendAlpha(){return this._renderStates.blendAlpha||this._effect.renderStates.blendAlpha}setUniform(e,t,n){this._effect.ubTemplate.setUniform(this._uniformBlock,e,t,n)}getUniform(e){return this._effect.ubTemplate.getUniform(this._uniformBlock,e)}setMarcos(e){Object.assign(this._marcos,e),this._version+=1}}s(V,"CLASS_NAME","Material");class ye extends I{constructor(){super();s(this,"isScene",!0);s(this,"_gameTime");s(this,"_rootNode");s(this,"_meshes");s(this,"_lights");s(this,"_command");s(this,"_renderTarget");s(this,"_screen");s(this,"_blit");this._renderTarget=this._screen=new B({width:v.width,height:v.height,colors:[{}],depthStencil:{needStencil:!0}}),this._blit=new ee(new V(T.iBlit,{u_texture:this._screen}))}set rootNode(e){this._rootNode=e}get rootNode(){return this._rootNode}get screen(){return this._screen}get lights(){return this._lights}cullCamera(e){const t=[];return this._meshes.forEach(n=>{const a=e.cull(n);a>=0&&(n.sortZ=a,t.push(n))}),t.sort((n,a)=>n.sortZ-a.sortZ),t}setRenderTarget(e){this._renderTarget=e||this._screen}startFrame(e){this._gameTime+=e,this._meshes=[],this._lights=[],this._rootNode.updateSubTree(n=>{G.IS(n)?this._meshes.push(n):fe.IS(n)&&this._lights.push(n)});const t=v.getUniform("u_lightInfos");t&&(this._lights.forEach((n,a)=>{a<4&&t.set(n.ubInfo,a*16)}),v.setUniform("u_lightInfos",t)),v.setUniform("u_gameTime",new Float32Array([this._gameTime/1e3])),this._command=v.device.createCommandEncoder()}renderCamera(e,t,n=!0){e.render(this._command,this._renderTarget,t,n)}renderImages(e,t=!0){const a={colorAttachments:[{view:this._renderTarget.colorView,loadOp:t?"clear":"load",storeOp:"store"}]},r=this._command.beginRenderPass(a);r.setBindGroup(0,v.bindingGroup);for(const i of e)i.render(r);r.end()}computeUnits(e){const t=this._command.beginComputePass();t.setBindGroup(0,v.bindingGroup);for(const n of e)n.compute(t);t.end()}copyBuffer(e,t,n){this._command.copyBufferToBuffer(e,0,t,0,n)}endFrame(){const t={colorAttachments:[{view:v.currentTexture.createView(),loadOp:"clear",storeOp:"store"}]},n=this._command.beginRenderPass(t);n.setBindGroup(0,v.bindingGroup),this._blit.render(n),n.end(),v.device.queue.submit([this._command.finish()])}}s(ye,"CLASS_NAME","Scene");class te extends E{constructor(e,t,n=!1){super();s(this,"isCamera",!0);s(this,"controlMode","free");s(this,"target");s(this,"viewport");s(this,"clearColor");s(this,"colorOp");s(this,"clearDepth");s(this,"depthOp");s(this,"clearStencil");s(this,"stencilOp");s(this,"drawSkybox",!1);s(this,"_skyboxMat");s(this,"_skyboxMesh");s(this,"_near");s(this,"_far");s(this,"_fov");s(this,"_aspect");s(this,"_sizeX");s(this,"_sizeY");s(this,"_isOrth");s(this,"_viewMat");s(this,"_projMat");s(this,"_projInverseMat");s(this,"_vpMat");s(this,"_skyVPMat");if(this._justAsView=n,t=t||{},this._near=t.near||0,this._far=t.far||1e3,this._aspect=t.aspect||v.width/v.height,t.isOrth){let{sizeX:a,sizeY:r}=t;t.sizeX>t.sizeY?a=r*this._aspect:r=a/this._aspect,this._sizeX=a,this._sizeY=r,this._isOrth=!0}else this._fov=t.fov||Math.PI/3;this.clearColor=e.clearColor||[0,0,0,1],this.clearDepth=e.clearDepth!==void 0?e.clearDepth:1,this.clearStencil=e.clearStencil||0,this.colorOp=e.colorOp||"store",this.depthOp=e.depthOp||"store",this.stencilOp=e.stencilOp||"store",this.viewport=e.viewport||{x:0,y:0,w:1,h:1},this._viewMat=C(new Float32Array(16)),this._projMat=C(new Float32Array(16)),this._projInverseMat=C(new Float32Array(16)),this._vpMat=C(new Float32Array(16)),this._skyVPMat=C(new Float32Array(16))}static IS(e){return!!e.isCamera}get isOrth(){return this._isOrth}get skyboxMat(){return this._skyboxMat}set skyboxMat(e){this._skyboxMat=e,this._skyboxMesh?this._skyboxMesh.material=e:this._skyboxMesh=new G($.skybox,e)}get vpMat(){return this._vpMat}get invViewMat(){return this._worldMat}get invProjMat(){return this._projInverseMat}updateMatrix(){if(super.updateMatrix(),this._updateViewMat(),this._updateProjMat(),Ce(this._vpMat,this._projMat,this._viewMat),this._skyboxMat){const e=this._skyVPMat;e.set(this._viewMat);const t=this._skyboxMat.getUniform("u_rotation")[0];t&&et(e,e,-t),e[12]=0,e[13]=0,e[14]=0,Ce(e,this._projMat,e),ie(e,e)}v.setUniform("u_vp",this._vpMat),v.setUniform("u_view",this._viewMat),v.setUniform("u_proj",this._projMat),v.setUniform("u_viewInverse",this._worldMat),v.setUniform("u_projInverse",this._projInverseMat),this._skyboxMat&&(v.setUniform("u_skyVP",this._skyVPMat),v.setUniform("u_envTexture",this._skyboxMat.getUniform("u_cubeTexture")),v.setUniform("u_envColor",this._skyboxMat.getUniform("u_color")))}render(e,t,n,a=!1){this.clearColor;const{x:r,y:i,w:c,h:l}=this.viewport,{width:h,height:u,colorViews:m,depthStencilView:f,hasStencil:d}=t,_={colorAttachments:m.map(p=>({view:p,loadOp:a?"clear":"load",storeOp:this.colorOp})),depthStencilAttachment:f&&{view:f,depthClearValue:this.clearDepth,depthLoadOp:"clear",depthStoreOp:this.depthOp,stencilClearValue:this.clearStencil,stencilReadOnly:!d,stencilLoadOp:d?a?"clear":"load":void 0,stencilStoreOp:d?a?this.stencilOp:"discard":void 0}},g=e.beginRenderPass(_);g.setViewport(r*h,i*u,c*h,l*u,0,1),g.setBindGroup(0,v.bindingGroup);for(const p of n)p.render(g,t);this.drawSkybox&&this._skyboxMesh&&this._skyboxMesh.render(g,t),g.end()}cull(e){return 0}_updateViewMat(){const{controlMode:e,target:t,_worldMat:n}=this;if(e==="target"&&!t)throw new Error('Camera with control mode "target" must has target!');if(e==="target"){const a=R(new Float32Array(3),n),r=R(new Float32Array(3),t.worldMat),i=K(new Float32Array(3),r,a);ue(i,i);const c=this._worldMat.slice(4,7);ue(c,c),tt(c)===0&&c.set([0,1,0]),Be(this._viewMat,a,r,c)}else ie(this._viewMat,this._worldMat)}_updateProjMat(){this._isOrth?this._orthHalfZ(this._projMat,-this._sizeX,this._sizeX,-this._sizeY,this._sizeY,this._near,this._far):nt(this._projMat,this._fov,this._aspect,this._near,this._far),ie(this._projInverseMat,this._projMat)}_orthHalfZ(e,t,n,a,r,i,c){const l=1/(n-t),h=1/(a-r),u=1/(c-i),m=(n+t)*l,f=(a+r)*h,d=i*u;e[0]=2*l,e[4]=0,e[8]=0,e[12]=-m,e[1]=0,e[5]=2*h,e[9]=0,e[13]=-f,e[2]=0,e[6]=0,e[10]=-1*u,e[14]=-d,e[3]=0,e[7]=0,e[11]=0,e[15]=1}}s(te,"CLASS_NAME","Node");class ne extends I{constructor(e,t,n,a){super();s(this,"isComputeUnite",!0);s(this,"_material");s(this,"_matVersion",-1);s(this,"_pipeline");if(this._effect=e,this._groups=t,!e.isCompute)throw new Error("ComputeUnit can only receive effect has compute shader!");this._material=new V(e,n,a)}get groups(){return this._groups}compute(e){const{_material:t,_groups:n}=this;t.version!==this._matVersion&&(this._createPipeline(),this._matVersion=t.version),e.setPipeline(this._pipeline),e.setBindGroup(1,t.bindingGroup),e.dispatchWorkgroups(n.x,n.y,n.z)}setUniform(e,t,n){this._material.setUniform(e,t,n)}getUniform(e){return this._material.getUniform(e)}setGroups(e,t,n){this._groups={x:e,y:t,z:n}}_createPipeline(){const{device:e}=v,{_material:t}=this,n=Object.assign({},t.marcos),{cs:a}=t.effect.getShader(n,"",v.shaderPrefix,"");this._pipeline=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[v.uniformLayout,t.effect.uniformLayout]}),compute:{module:a,entryPoint:"main"}})}}s(ne,"CLASS_NAME","ComputeUnit");const De=class{constructor(){s(this,"max");s(this,"min");s(this,"_isDirty",!1);s(this,"_center");s(this,"_size")}get center(){return(!this._center||this._isDirty)&&this._updateCenterSize(),this._center}get size(){return(!this._size||this._isDirty)&&this._updateCenterSize(),this._size}get maxExtends(){const e=this.size;return e[0]>e[2]?e[0]>e[1]?0:1:e[1]>e[2]?2:1}get surfaceArea(){const{size:e}=this;return 2*(e[0]*e[2]+e[0]*e[1]+e[2]*e[1])}initEmpty(){return this.max=new Float32Array([-1/0,-1/0,-1/0]),this.min=new Float32Array([1/0,1/0,1/0]),this}fromVertexes(e,t,n){return this.max=e.slice(),this.min=e.slice(),this.update(t).update(n),this}update(e){for(let t=0;t<3;t+=1)this.max[t]=Math.max(this.max[t],e[t]),this.min[t]=Math.min(this.min[t],e[t]);return this._isDirty=!0,this}mergeBounds(e){const{max:t,min:n}=e;for(let a=0;a<3;a+=1)this.max[a]=Math.max(this.max[a],t[a]),this.min[a]=Math.min(this.min[a],n[a]);return this._isDirty=!0,this}pointIn(e){const{max:t,min:n}=this;return e[0]>n[0]&&e[0]<t[0]&&e[1]>n[1]&&e[1]<t[1]&&e[2]>n[2]&&e[2]<t[2]}getOffset(e,t){let n=t[e]-this.min[e];return this.max[e]>this.min[e]&&(n/=this.max[e]-this.min[e]),n}buildBox(e){const{max:t,min:n}=this,a=[];De.BUILD_BOX_MAX_MIN_ORDER.forEach(i=>{for(let c=0;c<3;c+=1)a.push(i[c]?t[c]:n[c])});let r;return e==="lines"?r=[0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]:r=[0,1,2,2,3,0,4,5,6,6,7,4,0,4,5,5,1,0,1,5,6,6,2,1,3,2,6,6,7,3,0,3,7,7,4,0],{positions:a,indexes:r}}_updateCenterSize(){this._isDirty&&(this._center=this.max.map((e,t)=>(e+this.min[t])/2),this._size=this.max.map((e,t)=>e-this.min[t]),this._isDirty=!1)}};let U=De;s(U,"BUILD_BOX_MAX_MIN_ORDER",[[1,1,1],[1,1,0],[0,1,0],[0,1,1],[1,0,1],[1,0,0],[0,0,0],[0,0,1]]);function kt(o){return o.infoEnd!==void 0}const Fe=new Float32Array(3),Re=new Float32Array(3),Ee=new Float32Array(3);class be extends I{constructor(e){super();s(this,"isBVH",!0);s(this,"_rootNode");s(this,"_boundsInfos");s(this,"_bvhMaxDepth");s(this,"_bvhBuffer");s(this,"_bvhNodes");s(this,"_bvhLeaves");s(this,"_debugMesh");s(this,"process",(e,t)=>{k("BVH setup bounds info",this._setupBoundsInfo,[e,t]),k("BVH build tree",this._buildTree,[]),k("BVH flatten",this._flatten,[]),this._debugMesh=null});s(this,"_setupBoundsInfo",(e,t)=>{this._boundsInfos=[];for(let n=0;n<t.length;n+=3){const a=t.slice(n,n+3);me(3,Fe,0,e,a[0]*4),me(3,Re,0,e,a[1]*4),me(3,Ee,0,e,a[2]*4);const r=new U().fromVertexes(Fe,Re,Ee);this._boundsInfos.push({indexes:a,bounds:r})}});s(this,"_buildTree",()=>{this._rootNode=this._buildRecursive(0,this._boundsInfos.length,0)});s(this,"_flatten",()=>{this._bvhLeaves=[],this._bvhNodes=[];const e={maxDepth:1,nodes:[],leaves:[]};this._traverseNode(this._rootNode,e);const{maxDepth:t,nodes:n,leaves:a}=e,r=new ArrayBuffer(4*(n.length+a.length)),i=new Float32Array(r),c=new Uint32Array(r),l=n.length;this._bvhMaxDepth=t,i.set(n),c.set(a,l);for(let h=0;h<l;h+=8)for(let u=0;u<8;u+=4){const m=h+u;n[m]&2147483648?c[m]=n[m]+l/4:c[m]=n[m]}this._bvhMaxDepth=e.maxDepth,this._bvhBuffer=i});s(this,"_traverseNode",(e,t,n=1,a=-1,r=0)=>{t.maxDepth=Math.max(n,t.maxDepth);const{nodes:i,leaves:c}=t,{_boundsInfos:l,_bvhNodes:h,_bvhLeaves:u}=this;if(kt(e)){u.push(e),a>=0&&(i[a*8+r]=1<<31|c.length/4);const m=e.infoEnd-e.infoStart;for(let f=e.infoStart;f<e.infoEnd;f+=1){const d=l[f].indexes;c.push(m,d[0],d[1],d[2])}}else{h.push(e);const m=e.bounds,f=i.length/8;a>=0&&(i[a*8+r]=f*2),i.push(0,m.min[0],m.min[1],m.min[2],0,m.max[0],m.max[1],m.max[2]),this._traverseNode(e.child0,t,n+1,f,0),this._traverseNode(e.child1,t,n+1,f,4)}});this._maxPrimitivesPerLeaf=e}get maxDepth(){return this._bvhMaxDepth}get buffer(){return this._bvhBuffer}get debugMesh(){return this._debugMesh||this._buildDebugMesh(),this._debugMesh}get nodesCount(){return this._bvhNodes.length}get leavesCount(){return this._bvhLeaves.length}_buildRecursive(e,t,n){const{_boundsInfos:a}=this,r=new U().initEmpty();for(let c=e;c<t;c+=1)r.mergeBounds(a[c].bounds);const i=t-e;if(i<=this._maxPrimitivesPerLeaf)return{infoStart:e,infoEnd:t,bounds:r};{const c=new U().initEmpty();for(let f=e;f<t;f+=1)c.update(a[f].bounds.center);const l=c.maxExtends;let h=Math.floor((e+t)/2);if(i<=4)xt(a,(f,d)=>f.bounds.center[l]<d.bounds.center[l],e,t,h);else{if(c.max[l]===c.min[l])return{infoStart:e,infoEnd:t,bounds:r};{const f=[];for(let p=0;p<12;p+=1)f.push({bounds:new U().initEmpty(),count:0});for(let p=e;p<t;p+=1){let y=Math.floor(f.length*c.getOffset(l,a[p].bounds.center));y===f.length&&(y=f.length-1),f[y].count+=1,f[y].bounds.mergeBounds(a[p].bounds)}const d=[];for(let p=0;p<f.length-1;p+=1){const y=new U().initEmpty(),b=new U().initEmpty();let w=0,A=0;for(let S=0;S<=p;S+=1)y.mergeBounds(f[S].bounds),w+=f[S].count;for(let S=p+1;S<f.length;S+=1)b.mergeBounds(f[S].bounds),A+=f[S].count;d.push(.1+(w*y.surfaceArea+A*b.surfaceArea)/r.surfaceArea)}let _=d[0],g=0;for(let p=1;p<d.length;p+=1)d[p]<_&&(_=d[p],g=p);h=vt(a,p=>{let y=Math.floor(f.length*c.getOffset(l,p.bounds.center));return y===f.length&&(y=f.length-1),y<=g},e,t)}}const u=this._buildRecursive(e,h,n+1),m=this._buildRecursive(h,t,n+1);return{axis:l,bounds:new U().initEmpty().mergeBounds(u.bounds).mergeBounds(m.bounds),child0:u,child1:m,depth:n}}}_buildDebugMesh(){const{_bvhNodes:e,_bvhMaxDepth:t}=this,n="lines",a=e.length,r=new Float32Array(a*8*3),i=new Float32Array(a*8*3);let c;c=new Uint32Array(a*24);const l=new Array(t).fill(0),h=new Array(t).fill(0);e.forEach(m=>{l[m.depth]+=1});let u=0;e.forEach(m=>{const f=m.bounds.buildBox(n),d=u*8,_=u*8*3,g=u*8*3,p=u*f.indexes.length,y=$t(m.depth/t,h[m.depth]/l[m.depth]*.7+.3,.5);for(let b=0;b<24;b+=3)i.set(y,g+b);c.set(f.indexes.map(b=>b+d),p),r.set(f.positions,_),u+=1,h[m.depth]+=1}),this._debugMesh=new G(new N([{layout:{attributes:[{name:"position",shaderLocation:0,format:"float32x3",offset:0}],arrayStride:12},data:r},{layout:{attributes:[{name:"color_0",shaderLocation:1,format:"float32x3",offset:0}],arrayStride:12},data:i}],c,c.length),new V(T.rColor,{u_color:new Float32Array([1,1,1,.4])},void 0,{primitiveType:"line-list",cullMode:"none",blendColor:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},blendAlpha:{srcFactor:"zero",dstFactor:"one"}}))}}s(be,"CLASS_NAME","BVH");function pe(o,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?o+(e-o)*6*t:t<1/2?e:t<2/3?o+(e-o)*(2/3-t)*6:o}function $t(o,e,t){let n,a,r;if(e==0)n=a=r=t;else{var i=t<.5?t*(1+e):t+e-t*e,c=2*t-i;n=pe(c,i,o+1/3),a=pe(c,i,o),r=pe(c,i,o-1/3)}return[n,a,r]}const P=class extends I{constructor(e=1){super();s(this,"isRayTracingManager",!0);s(this,"meshes");s(this,"_attributesInfo");s(this,"_indexInfo");s(this,"_materials",[]);s(this,"_commonUniforms");s(this,"_bvh");s(this,"_gBufferMesh");s(this,"_rtUnit");s(this,"_buildAttributeBuffers",e=>{const{_materials:t}=this;let n=0,a=0;e.forEach(f=>{a+=f.geometry.vertexCount,n+=f.geometry.count});const{value:r}=this._indexInfo={value:new Uint32Array(n)},{position:i,texcoord_0:c,normal:l,meshMatIndex:h}=this._attributesInfo={position:{value:new Float32Array(a*4),length:4,format:"float32x3"},texcoord_0:{value:new Float32Array(a*2),length:2,format:"float32x2"},normal:{value:new Float32Array(a*4),length:4,format:"float32x3"},meshMatIndex:{value:new Uint32Array(a*2),length:2,format:"uint32x2"}};let u=0,m=0;for(let f=0;f<e.length;f+=1){const d=e[f],{worldMat:_}=d,g=xe(new Float32Array(4),_),{geometry:p,material:y}=d,{indexData:b,vertexInfo:w,vertexCount:A,count:S}=p;if(y.effect.name!=="rPBR")throw new Error("Only support Effect rPBR!");let L=t.indexOf(y);L<0&&(t.push(y),L=t.length-1),b.forEach((M,he)=>{r[he+m]=M+u}),w.normal||p.calculateNormals();for(let M=0;M<A;M+=1)this._copyAttribute(w.position,i,u,M,_),this._copyAttribute(w.texcoord_0,c,u,M),this._copyAttribute(w.normal,l,u,M,g,!0),h.value.set([f,L],(u+M)*h.length);m+=S,u+=A}});s(this,"_buildCommonUniforms",e=>{const t=new Int32Array(e.length*4).fill(-1),n=new Float32Array(e.length*4).fill(1),a=new Float32Array(e.length*4).fill(1),r=new Float32Array(e.length*4).fill(1),i=[],c=[],l=[];e.forEach((h,u)=>{const m=h.marcos.USE_GLASS,f=h.marcos.USE_SPEC_GLOSS,d=h.getUniform("u_baseColorFactor"),_=h.getUniform("u_metallicFactor"),g=h.getUniform("u_roughnessFactor"),p=h.getUniform("u_specularFactor"),y=h.getUniform("u_glossinessFactor"),b=h.getUniform("u_normalTextureScale"),w=h.getUniform("u_baseColorTexture"),A=h.getUniform("u_normalTexture"),S=h.getUniform("u_metallicRoughnessTexture"),L=h.getUniform("u_specularGlossinessTexture"),M=u*4;w!==x.empty&&this._setTextures(M,i,w,t),A!==x.empty&&this._setTextures(M+1,c,A,t),d&&n.set(d,u*4),b!==void 0&&a.set(b.slice(0,1),u*4+2),f?(p!==void 0&&r.set(p.slice(0,3),u*4),y!==void 0&&r.set(y.slice(0,1),u*4+3),L!==x.empty&&this._setTextures(M+2,l,L,t),a.set([m?3:1],u*4+3)):(_!==void 0&&a.set(_.slice(0,1),u*4),g!==void 0&&a.set(g.slice(0,1),u*4+1),S!==x.empty&&this._setTextures(M+2,l,S,t),a.set([m?2:0],u*4+3))}),this._commonUniforms={matId2TexturesId:t,baseColorFactors:n,metallicRoughnessFactorNormalScaleMaterialTypes:a,specularGlossinessFactors:r,baseColorTextures:this._generateTextureArray(i),normalTextures:this._generateTextureArray(c),metalRoughOrSpecGlossTextures:this._generateTextureArray(l)}});s(this,"_buildGBufferMesh",()=>{const{_attributesInfo:e,_indexInfo:t,_commonUniforms:n}=this,a=new N(Object.keys(e).map((i,c)=>{const{value:l,length:h,format:u}=e[i];return{layout:{arrayStride:h*4,attributes:[{name:i,offset:0,format:u,shaderLocation:c}]},data:l,usage:GPUBufferUsage.STORAGE}}),t.value,t.value.length),r=new V(T.rRTGBuffer,{u_matId2TexturesId:n.matId2TexturesId,u_baseColorFactors:n.baseColorFactors,u_metallicRoughnessFactorNormalScaleMaterialTypes:n.metallicRoughnessFactorNormalScaleMaterialTypes,u_specularGlossinessFactors:n.specularGlossinessFactors,u_baseColorTextures:n.baseColorTextures,u_normalTextures:n.normalTextures,u_metalRoughOrSpecGlossTextures:n.metalRoughOrSpecGlossTextures});this._gBufferMesh=new G(a,r)});s(this,"_buildRTUnit",e=>{const{_gBufferMesh:t,_commonUniforms:n,_bvh:a}=this,{geometry:r}=t;this._rtUnit=new ne(T.cRTSS,{x:Math.ceil(v.width/16),y:Math.ceil(v.height/16)},{u_output:e,u_matId2TexturesId:n.matId2TexturesId,u_baseColorFactors:n.baseColorFactors,u_metallicRoughnessFactorNormalScaleMaterialTypes:n.metallicRoughnessFactorNormalScaleMaterialTypes,u_specularGlossinessFactors:n.specularGlossinessFactors,u_baseColorTextures:n.baseColorTextures,u_normalTextures:n.normalTextures,u_metalRoughOrSpecGlossTextures:n.metalRoughOrSpecGlossTextures,u_bvh:a.buffer},{BVH_DEPTH:this._bvh.maxDepth});let i=r.getValues("position");this._rtUnit.setUniform("u_positions",i.cpu,i.gpu),i=r.getValues("texcoord_0"),this._rtUnit.setUniform("u_uvs",i.cpu,i.gpu),i=r.getValues("normal"),this._rtUnit.setUniform("u_normals",i.cpu,i.gpu),i=r.getValues("meshmatindex"),this._rtUnit.setUniform("u_meshMatIndexes",i.cpu,i.gpu),console.log(this._materials)});this._maxPrimitivesPerBVHLeaf=e,this._bvh=new be(e)}get gBufferMesh(){return this._gBufferMesh}get rtUnit(){return this._rtUnit}get bvhDebugMesh(){return this._bvh.debugMesh}get bvh(){return this._bvh}process(e,t){this.meshes=e,k("build AttributeBuffers",this._buildAttributeBuffers,[e]),k("build CommonUniforms",this._buildCommonUniforms,[this._materials]),k("build GBufferMesh",this._buildGBufferMesh,[]),this._bvh.process(this._attributesInfo.position.value,this._indexInfo.value),k("build RTUnit",this._buildRTUnit,[t]),console.log(`Build done(max primitives per leaf is ${this._maxPrimitivesPerBVHLeaf}): mesh(${e.length}), material(${this._materials.length}), vertexes(${this._attributesInfo.position.value.length/3}), triangles(${this._indexInfo.value.length/3}), bvhNodes(${this._bvh.nodesCount}), bvhLeaves(${this._bvh.leavesCount}), bvhDepth(${this._bvh.maxDepth})`)}_copyAttribute(e,t,n,a,r,i){const c=e.offset+a*e.stride;let l=e.data.slice(c,c+e.length);r&&(i?Ne(l,l,r):Pe(l,l,r)),t.value.set(l,(n+a)*t.length)}_setTextures(e,t,n,a){if(n){let r=t.indexOf(n);r<0&&(t.push(n),r=t.length-1),a[e]=r}}_generateTextureArray(e){if(!e.length)return x.array1white;let t=0,n=0;e.forEach(r=>{t=Math.max(t,r.width),n=Math.max(n,r.height)});const a=e.map(r=>{if(r.width===t&&r.height===n)return r.source;if(!(r.source instanceof ImageBitmap))throw new Error("Can only resize image bitmap!");P.RESIZE_CANVAS||(P.RESIZE_CANVAS=document.createElement("canvas"),P.RESIZE_CANVAS.width=2048,P.RESIZE_CANVAS.height=2048,P.RESIZE_CTX=P.RESIZE_CANVAS.getContext("2d"));const i=P.RESIZE_CTX;return i.drawImage(r.source,0,0,t,n),i.getImageData(0,0,t,n).data.buffer});return new Y(t,n,a,e[0].format)}};let j=P;s(j,"CLASS_NAME","RayTracingManager"),s(j,"RESIZE_CANVAS"),s(j,"RESIZE_CTX");const H=new Float32Array(3),F=new Float32Array(3),Yt=new Float32Array(3),se=new Float32Array(4),Ge=new Float32Array(16),qt=new Float32Array([0,1,0]);class we extends I{constructor(e="free"){super();s(this,"isNodeControl",!0);s(this,"onChange");s(this,"_start",!1);s(this,"_x");s(this,"_y");s(this,"_touchId");s(this,"_node");s(this,"_target");s(this,"_arcRadius");s(this,"_handleStart",e=>{this._x=e.clientX,this._y=e.clientY,this._mode==="arc"&&(this._arcRadius=rt(R(H,this._target.worldMat),R(F,this._node.worldMat))),this._start=!0});s(this,"_handleEnd",()=>{this._start=!1});s(this,"_handleMove",e=>{const{_start:t,_node:n,_x:a,_y:r}=this;if(!t||!n)return;const{clientX:i,clientY:c}=e,l=(i-a)/200,h=(c-r)/200;if(this._mode==="free"){at(n.quat,n.quat,h),st(se,n.quat);const u=new Float32Array([0,1,0]);Ne(u,u,se),it(se,u,l),ot(n.quat,n.quat,se)}else{R(H,this._target.worldMat),R(F,this._node.worldMat),F[0]+=l*2,F[1]+=h*2;const u=K(Yt,H,F);ue(u,u),le(u,u,-this._arcRadius),_e(F,H,u),Be(Ge,F,H,qt),this._node.pos.set(F),xe(this._node.quat,Ge)}this._x=i,this._y=c,this.onChange&&this.onChange()});s(this,"_handleZoom",e=>{const{worldMat:t,pos:n}=this._node;let a=e.deltaY/200,r=t.slice(8,12);this._mode==="arc"&&(R(H,this._target.worldMat),R(F,this._node.worldMat),K(r,H,F),a=-a),ue(r,r),le(r,r,a),_e(n,n,r),this._mode==="arc"&&(this._arcRadius+=a),this.onChange&&this.onChange()});s(this,"_handleTouchStart",e=>{const t=e.targetTouches[0];this._touchId=t.identifier,this._handleStart(t)});s(this,"_handleTouchMove",e=>{if(!!this._start){for(let t=0;t<e.targetTouches.length;t+=1){const n=e.targetTouches[t];if(n.identifier===this._touchId)return this._handleMove(n)}this._handleEnd()}});this._mode=e;const{canvas:t}=v;t.addEventListener("mousedown",this._handleStart),t.addEventListener("mouseup",this._handleEnd),t.addEventListener("mouseleave",this._handleEnd),t.addEventListener("mouseout",this._handleEnd),t.addEventListener("mousemove",this._handleMove),t.addEventListener("wheel",this._handleZoom),t.addEventListener("touchstart",this._handleTouchStart),t.addEventListener("touchend",this._handleEnd),t.addEventListener("touchcancel",this._handleEnd),t.addEventListener("touchmove",this._handleTouchMove)}control(e,t){if(this._node=e,this._target=t,!t&&this._mode==="arc")throw new Error("Mode arc must be given target!")}}s(we,"CLASS_NAME","NodeControl");class Te extends I{constructor(){super(...arguments);s(this,"isLoader",!0);s(this,"type")}async request(e,t){return new Promise((n,a)=>{const r=new XMLHttpRequest;r.onload=()=>{if(r.status<200||r.status>=300){a(new TypeError(`Network request failed for ${r.status}`));return}let i="response"in r?r.response:r.responseText;if(t==="json")try{i=JSON.parse(i)}catch(c){a(new TypeError("JSON.parse error"+c));return}n(i)},r.onerror=()=>{a(new TypeError("Network request failed"))},r.ontimeout=()=>{a(new TypeError("Network request timed out"))},r.open("GET",e,!0),t==="buffer"&&(r.responseType="arraybuffer"),r.send()})}}s(Te,"CLASS_NAME","Loader");class Se extends Te{constructor(){super(...arguments);s(this,"isTextureLoader",!0)}async load(e,t){const n=document.createElement("img");n.src=e,await n.decode();const a=await createImageBitmap(n);return new Y(n.naturalHeight,n.naturalHeight,a)}}s(Se,"CLASS_NAME","TextureLoader");class Ie extends Te{constructor(){super(...arguments);s(this,"isGlTFLoader",!0);s(this,"_baseUri");s(this,"_json");s(this,"_buffers",[]);s(this,"_res")}async load(e,t){const n=e.split("/");return n.pop(),this._baseUri=n.join("/"),this._json=await this.request(e,"json"),await this._loadBuffers(),this._res={rootNode:new E,nodes:[],meshes:[],images:[],textures:[],cubeTextures:[],materials:[],cameras:[],lights:[]},await this._loadImages(),await this._loadTextures(),await this._loadCubeTextures(),await this._loadMaterials(),await this._loadMeshes(),await this._loadCameras(),await this._loadLights(),await this._loadNodes(),this._res}async _loadBuffers(){const{buffers:e}=this._json;for(const{uri:t}of e)this._buffers.push(await this.request(this._baseUri+"/"+t,"buffer"))}async _loadImages(){const{images:e}=this._json,{images:t}=this._res;if(!!e)for(const{uri:n}of e){const a=await this._loadImage(this._baseUri+"/"+n),r=await createImageBitmap(a);t.push(r)}}async _loadTextures(){var r,i,c;const{textures:e,images:t}=this._json,{images:n,textures:a}=this._res;if(!!e)for(const{source:l}of e){const h=n[l],u=new Y(h.width,h.height,h);((r=t.extras)==null?void 0:r.type)==="HDR"&&((i=t.extras)==null||i.format),(c=t.extras)!=null&&c.isNormalMap,a.push(u)}}async _loadCubeTextures(){var a,r;const e=(r=(a=this._json.extensions)==null?void 0:a.Sein_cubeTexture)==null?void 0:r.textures,{images:t,cubeTextures:n}=this._res;if(!!e)for(const{images:i}of e){const l=await Promise.all(i.map(u=>createImageBitmap(t[u]))),h=new W(l[0].width,l[1].width,l);l.forEach(u=>u.close()),n.push(h)}}async _loadMaterials(){const{materials:e}=this._json,{materials:t,textures:n}=this._res;for(const{name:a,pbrMetallicRoughness:r,normalTexture:i,alphaMode:c,extensions:l}of e){const h=T.rPBR,u={},m={};if(i&&(u.u_normalTexture=n[i.index],u.u_normalTextureScale=i.scale),r){const{baseColorTexture:d,metallicFactor:_,baseColorFactor:g,roughnessFactor:p,metallicRoughnessTexture:y}=r;d&&(u.u_baseColorTexture=n[d.index]),y&&(u.u_metallicRoughnessTexture=n[y.index]),u.u_baseColorFactor=g,u.u_metallicFactor=_,u.u_roughnessFactor=p}if(l!=null&&l.KHR_materials_pbrSpecularGlossiness){const{diffuseFactor:d,diffuseTexture:_,specularFactor:g,glossinessFactor:p,specularGlossinessTexture:y}=l==null?void 0:l.KHR_materials_pbrSpecularGlossiness;m.USE_SPEC_GLOSS=!0,_&&(u.u_baseColorTexture=n[_.index]),y&&(u.u_specularGlossinessTexture=n[y.index]),u.u_baseColorFactor=d,u.u_specularFactor=g,u.u_glossinessFactor=p}c==="BLEND"&&(m.USE_GLASS=!0);const f=new V(h,u,m);f.name=a,t.push(f)}}async _loadMeshes(){const{meshes:e}=this._json,{meshes:t}=this._res;for(const{primitives:n,name:a}of e){if(n.length===1){const i=await this._createMesh(n[0]);i.name=a,t.push(i);continue}const r=new E;r.name=a;for(let i of n)r.addChild(await this._createMesh(i));t.push(r)}}async _loadCameras(){const{cameras:e}=this._json,{cameras:t,cubeTextures:n}=this._res;if(!!e)for(const{perspective:a,orthographic:r,type:i,name:c,extensions:l}of e){let h;i==="perspective"?h=new te({},{near:a.znear,far:a.zfar,fov:1/a.yfov}):h=new te({},{isOrth:!0,near:r.znear,far:r.zfar,sizeX:r.xmag,sizeY:r.ymag}),h.name=c;const u=l&&l.Sein_skybox;if(u)if(u.type!=="Cube")console.warn("Only support cube texture skybox now!");else{const m=new V(T.rSkybox,{u_factor:new Float32Array([u.factor]),u_color:new Float32Array(u.color),u_cubeTexture:n[u.texture.index],u_rotation:new Float32Array([u.rotation]),u_exposure:new Float32Array([u.exposure])});h.skyboxMat=m}t.push(h)}}async _loadLights(){var n,a;if(!this._json.extensions)return;const e=(a=(n=this._json.extensions)==null?void 0:n.KHR_lights_punctual)==null?void 0:a.lights,{lights:t}=this._res;if(e)for(const{name:r,type:i,intensity:c,color:l,mode:h,size:u}of e){if(i!=="directional"&&i!=="area")throw new Error("Only support directional and area light now!");const m=new fe(i==="directional"?ge.Directional:ge.Area,l.map(f=>f*c),i==="directional"?{}:{mode:h==="rect"?ve.Rect:ve.Disc,size:u});m.name=r,t.push(m)}}async _loadNodes(){const{nodes:e,scenes:t}=this._json,{rootNode:n,nodes:a,meshes:r,cameras:i,lights:c}=this._res;for(const{matrix:h,name:u,extensions:m,mesh:f,camera:d}of e){let _;f!==void 0?_=r[f].clone():d!==void 0?_=i[d]:m!=null&&m.KHR_lights_punctual?_=c[m.KHR_lights_punctual.light]:_=new E,_.name=u,h&&_.setLocalMat(h),a.push(_)}let l=0;for(const h of a){const{children:u}=e[l];if(u)for(const m of u)h.addChild(a[m]);l+=1}for(let h of t[0].nodes)n.addChild(a[h])}async _createMesh(e){const{_buffers:t}=this,{accessors:n,bufferViews:a}=this._json,{materials:r}=this._res,i=[];let c=0,l=0,h,u;for(const p in e.attributes){const{bufferView:y,byteOffset:b,componentType:w,type:A,max:S,min:L}=n[e.attributes[p]],M=a[y],[he,qe]=this._convertVertexFormat(A,w);c+=qe,h=h||new Float32Array(t[M.buffer],M.byteOffset||0,M.byteLength/4),p==="POSITION"&&(S==null?void 0:S.length)===3&&(L==null?void 0:L.length)===3&&(u=this._getBoundingBox(S,L)),i.push({name:p.toLowerCase(),format:he,offset:b||0,shaderLocation:l}),l+=1}const m=n[e.indices],f=a[m.bufferView],d=new Uint16Array(t[f.buffer],f.byteOffset,f.byteLength/2),_=new N([{layout:{arrayStride:c,attributes:i},data:h}],d,m.count,u),g=r[e.material];return new G(_,g)}_convertVertexFormat(e,t){if(t!==5126)throw new Error("Only support componentType float!");switch(e){case"SCALE":return["float32",4];case"VEC2":return["float32x2",8];case"VEC3":return["float32x3",12];case"VEC4":return["float32x4",16]}throw new Error(`Not support type ${e}!`)}_getBoundingBox(e,t){return{start:t,center:e.map((n,a)=>(n+t[a])/2),size:e.map((n,a)=>n-t[a])}}async _loadImage(e){const t=document.createElement("img");return t.src=e,await t.decode(),t}}s(Ie,"CLASS_NAME","GlTFLoader");class Me extends I{constructor(){super(...arguments);s(this,"isResource",!0);s(this,"_loaders",{});s(this,"_resources",{})}register(e,t){this._loaders[e]=t}async load(e,t){return this._resources[e.name]?this._resources[e.name]:this._loaders[e.type].load(e.src,t||{}).then(n=>(this._resources[e.name]=n,n))}get(e){return this._resources[e]}}s(Me,"CLASS_NAME","Resource");const re=new Me;re.register("texture",new Se);re.register("gltf",new Ie);async function ke(o){await v.init(o),await zt(),await v.createGlobal(Q.global)}const jt={vec2:lt,vec3:ut,vec4:ct,quat:ft,quat2:ht,mat2:mt,mat3:dt,mat4:pt};window.H=globalThis;var $e=Object.freeze(Object.defineProperty({__proto__:null,init:ke,math:jt,Scene:ye,Node:E,Camera:te,Light:fe,Geometry:N,UBTemplate:J,Effect:D,Material:V,Mesh:G,ImageMesh:ee,ComputeUnit:ne,RenderTexture:B,Texture:Y,CubeTexture:W,renderEnv:v,RayTracingManager:j,BVH:be,NodeControl:we,resource:re,Resource:Me,TextureLoader:Se,GlTFLoader:Ie,createGPUBuffer:O,createGPUBufferBySize:ze,buildinTextures:x,buildinGeometries:$,buildinEffects:T,buildinUBTemplates:Q},Symbol.toStringTag,{value:"Module"}));class Wt{constructor(){s(this,"_cpu");s(this,"_gpu");s(this,"_view");s(this,"_size");s(this,"_rtManager")}setup(e){const{renderEnv:t}=$e,n=this._size=4*7;this._cpu=new Float32Array(n*t.width*t.height),this._gpu=O(this._cpu,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC),this._view=ze(n*t.width*t.height*4,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST),this._rtManager=e,this._rtManager.rtUnit.setUniform("u_debugInfo",this._cpu,this._gpu)}run(e){e.copyBuffer(this._gpu,this._view,this._cpu.byteLength)}async showDebugInfo(e,t,n){await this._view.mapAsync(GPUMapMode.READ);const a=new Float32Array(this._view.getMappedRange()),r=this._decodeDebugInfo(a,e,t,n),i=new Float32Array(r.length*6*3),c=new Float32Array(r.length*6*3),l=new Uint32Array(r.length*6);r.forEach(({preOrigin:f,preDir:d,origin:_,dir:g,nextOrigin:p,nextDir:y},b)=>{const w=b*3*6,A=b*6;i.set(f.slice(0,3),w),i.set(d.slice(0,3),w+3),c.set([1,0,0],w),c.set([1,0,0],w+3),i.set(_.slice(0,3),w+6),i.set(g.slice(0,3),w+9),c.set([0,1,0],w+6),c.set([0,1,0],w+9),i.set(p.slice(0,3),w+12),i.set(y.slice(0,3),w+15),c.set([0,0,1],w+12),c.set([0,0,1],w+15),l.set([b*3,b*3+1,b*3+2,b*3+3,b*3+4,b*3+5],A)});const h=new N([{layout:{arrayStride:3*4,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:i},{layout:{arrayStride:3*4,attributes:[{name:"color_0",shaderLocation:1,offset:0,format:"float32x3"}]},data:c}],l,r.length*6),u=new V(T.rColor,{u_color:new Float32Array([1,1,1])},void 0,{cullMode:"none",primitiveType:"line-list",depthCompare:"always"}),m=new G(h,u);return this._view.unmap(),{rays:r,mesh:m}}_decodeDebugInfo(e,t,n,a){const r=[],i=[];for(let c=t[1];c<t[1]+n[1]*a[1];c+=a[1])for(let l=t[0];l<t[0]+n[0]*a[0];l+=a[0]){const u=(c*v.width+l)*this._size;r.push({preOrigin:e.slice(u,u+4),preDir:e.slice(u+4,u+8),origin:e.slice(u+8,u+12),dir:e.slice(u+12,u+16),nextOrigin:e.slice(u+16,u+20),nextDir:e.slice(u+20,u+24),normal:e.slice(u+24,u+28)})}return console.log(i.join(`
`)),r}}const Xt="./demo/assets/models/walls/scene.gltf";function Zt(o){const e=`
<select-pure name="View Mode" id="view-mode" style="position:absolute;right:0;width:128px;">
  <option-pure value="result">Result</option-pure>
  <option-pure value="bvh">Show BVH</option-pure>
  <option-pure value="gbuffer">Show GBuffer</option-pure>
  <option-pure value="origin">Origin</option-pure>
</select-pure>
  `,t=document.createElement("div");return t.innerHTML=e,document.body.appendChild(t),document.querySelector("select-pure").addEventListener("change",a=>{const r=a.target.value;o(r)}),t}class Kt{constructor(){s(this,"_scene");s(this,"_camControl");s(this,"_camera");s(this,"_model");s(this,"_noiseTex");s(this,"_gBufferRT");s(this,"_gbufferLightMaterial");s(this,"_gBufferDebugMesh");s(this,"_rtManager");s(this,"_rtOutput");s(this,"_denoiseRTs");s(this,"_denoiseTemporUnit");s(this,"_denoiseSpaceUnit");s(this,"_rtTone");s(this,"_rtDebugInfo");s(this,"_rtDebugMesh");s(this,"_frameCount",0);s(this,"_viewMode","result")}async init(){Zt(r=>{console.log(r),this._viewMode=r,this._frameCount=0});const{renderEnv:e}=$e,t=this._scene=new ye,n=this._scene.rootNode=new E;this._camControl=new we("free"),n.addChild(this._camera=new te({clearColor:[0,1,0,1]},{near:.01,far:100,fov:Math.PI/3})),this._camera.pos.set([0,0,6]),this._noiseTex=await re.load({type:"texture",name:"noise.tex",src:"./demo/assets/textures/noise-rgba.webp"});const a=this._model=await re.load({type:"gltf",name:"scene.gltf",src:Xt});a.cameras.length&&(this._camera=a.cameras[0]),t.rootNode.addChild(a.rootNode),this._gBufferRT=new B({width:e.width,height:e.height,colors:[{name:"positionMetalOrSpec",format:"rgba16float"},{name:"baseColorRoughOrGloss",format:"rgba16float"},{name:"normalGlass",format:"rgba16float"},{name:"meshIndexMatIndexMatType",format:"rgba8uint"}],depthStencil:{needStencil:!1}}),this._gbufferLightMaterial=new V(T.rRTGBufferLight),this._gBufferDebugMesh=new ee(new V(T.iRTGShow)),this._connectGBufferRenderTexture(this._gBufferDebugMesh.material),this._rtOutput=new B({width:e.width,height:e.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),this._denoiseRTs={current:new B({width:e.width,height:e.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),pre:new B({width:e.width,height:e.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),final:new B({width:e.width,height:e.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]})},this._denoiseSpaceUnit=new ne(T.cRTDenoiseSpace,{x:Math.ceil(e.width/16),y:Math.ceil(e.height/16)},void 0,{WINDOW_SIZE:7}),this._denoiseTemporUnit=new ne(T.cRTDenoiseTempor,{x:Math.ceil(e.width/16),y:Math.ceil(e.height/16)}),this._connectGBufferRenderTexture(this._denoiseSpaceUnit),this._rtTone=new ee(new V(T.iTone)),this._rtDebugInfo=new Wt,this._camControl.control(this._camera,new E),this._camControl.onChange=()=>{this._frameCount=0},await this._frame(16)}async update(e){await this._frame(e)}async _frame(e){const{_scene:t}=this;this._frameCount+=1;const n=(this._frameCount-1)/this._frameCount;if(n>.999)return;t.startFrame(e),!this._rtManager&&(this._rtManager=new j,this._rtManager.process(this._scene.cullCamera(this._camera),this._rtOutput),this._rtManager.rtUnit.setUniform("u_noise",this._noiseTex),this._connectGBufferRenderTexture(this._rtManager.rtUnit)),this._rtManager.rtUnit.setUniform("u_randoms",new Float32Array(16).map(r=>Math.random())),this._denoiseTemporUnit.setUniform("u_preWeight",new Float32Array([n])),this._viewMode==="bvh"?this._showBVH():this._viewMode==="gbuffer"?(this._renderGBuffer(),this._showGBufferResult()):(this._renderGBuffer(),this._scene.setRenderTarget(null),this._computeRTSS(),this._viewMode==="result"?this._computeDenoise():this._rtTone.material.setUniform("u_texture",this._rtOutput),this._scene.renderImages([this._rtTone])),this._rtDebugMesh&&t.renderCamera(this._camera,[this._rtDebugMesh],!1),t.endFrame()}_renderGBuffer(){this._scene.setRenderTarget(this._gBufferRT);const e=this._scene.lights.map(t=>t.requireLightMesh(this._gbufferLightMaterial)).filter(t=>!!t);this._scene.renderCamera(this._camera,[this._rtManager.gBufferMesh,...e])}_computeRTSS(){this._scene.computeUnits([this._rtManager.rtUnit])}_computeDenoise(){const{current:e,pre:t,final:n}=this._denoiseRTs;this._denoiseTemporUnit.setUniform("u_pre",t),this._denoiseTemporUnit.setUniform("u_current",this._rtOutput),this._denoiseTemporUnit.setUniform("u_output",e),this._denoiseSpaceUnit.setUniform("u_preFilter",e),this._denoiseSpaceUnit.setUniform("u_output",n),this._scene.computeUnits([this._denoiseTemporUnit,this._denoiseSpaceUnit]),this._denoiseRTs.pre=n,this._denoiseRTs.final=t,this._rtTone.material.setUniform("u_texture",n)}_showGBufferResult(){this._scene.setRenderTarget(null),this._scene.renderImages([this._gBufferDebugMesh])}_showBVH(){this._scene.setRenderTarget(null),this._scene.renderCamera(this._camera,[...this._scene.cullCamera(this._camera),this._rtManager.bvhDebugMesh])}_connectGBufferRenderTexture(e){e.setUniform("u_gbPositionMetalOrSpec",this._gBufferRT,"positionMetalOrSpec"),e.setUniform("u_gbBaseColorRoughOrGloss",this._gBufferRT,"baseColorRoughOrGloss"),e.setUniform("u_gbNormalGlass",this._gBufferRT,"normalGlass"),e.setUniform("u_gbMeshIndexMatIndexMatType",this._gBufferRT,"meshIndexMatIndexMatType")}}const q=document.createElement("div");q.style.position="fixed";q.style.left=q.style.top="0";q.style.color="red";q.style.fontSize="24px";document.body.append(q);const Ye=new Kt;let Ue=0;async function Jt(o){await Ye.update(o);const e=1e3/o;Math.abs(e-Ue)>2&&(q.innerText=`${e.toFixed(2)}fps`),Ue=e}async function Qt(){await ke(document.querySelector("canvas#mainCanvas")),await Ye.init();let o=0;async function e(t){await Jt(t-o),o=t,requestAnimationFrame(e)}await e(performance.now())}Qt();
