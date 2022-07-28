var $n=Object.defineProperty;var Un=(e,t,r)=>t in e?$n(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>(Un(e,typeof t!="symbol"?t+"":t,r),r);const Gn=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}};Gn();class gr{constructor(){p(this,"isRenderEnv",!0);p(this,"_device");p(this,"_canvas");p(this,"_ctx");p(this,"_swapChainFormat","bgra8unorm");p(this,"_ubTemplate");p(this,"_uniformBlock");p(this,"_bindingGroup")}get canvas(){return this._canvas}get ctx(){return this._ctx}get device(){return this._device}get bindingGroup(){return this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),this._bindingGroup}get shaderPrefix(){return this._ubTemplate.shaderPrefix}get uniformLayout(){return this._ubTemplate.uniformLayout}get width(){return this._canvas.width}get height(){return this._canvas.height}get swapChainFormat(){return this._swapChainFormat}get currentTexture(){return this._ctx.getCurrentTexture()}async init(t){if(!navigator.gpu)throw new Error("WebGPU is not supported!");const r=await navigator.gpu.requestAdapter();if(!r)throw new Error("Require adapter failed!");if(this._device=await r.requestDevice(),!this._device)throw new Error("Require device failed!");this._canvas=t,this._ctx=t.getContext("webgpu")||t.getContext("gpupresent"),this._ctx.configure({device:this._device,format:this._swapChainFormat,alphaMode:"premultiplied"})}async createGlobal(t){this._ubTemplate=t,this._uniformBlock=this._ubTemplate.createUniformBlock()}setUniform(t,r,n){this._ubTemplate.setUniform(this._uniformBlock,t,r,n)}getUniform(t){return this._ubTemplate.getUniform(this._uniformBlock,t)}}p(gr,"CLASS_NAME","RenderEnv");const T=new gr;var S=1e-6,V=typeof Float32Array!="undefined"?Float32Array:Array,J=Math.random;Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function Bn(){var e=new V(4);return V!=Float32Array&&(e[1]=0,e[2]=0),e[0]=1,e[3]=1,e}function Nn(e){var t=new V(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Hn(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function kn(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e}function qn(e,t,r,n){var i=new V(4);return i[0]=e,i[1]=t,i[2]=r,i[3]=n,i}function jn(e,t,r,n,i){return e[0]=t,e[1]=r,e[2]=n,e[3]=i,e}function Yn(e,t){if(e===t){var r=t[1];e[1]=t[2],e[2]=r}else e[0]=t[0],e[1]=t[2],e[2]=t[1],e[3]=t[3];return e}function Wn(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=r*s-i*n;return a?(a=1/a,e[0]=s*a,e[1]=-n*a,e[2]=-i*a,e[3]=r*a,e):null}function Xn(e,t){var r=t[0];return e[0]=t[3],e[1]=-t[1],e[2]=-t[2],e[3]=r,e}function Zn(e){return e[0]*e[3]-e[2]*e[1]}function _r(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[0],l=r[1],c=r[2],f=r[3];return e[0]=n*o+s*l,e[1]=i*o+a*l,e[2]=n*c+s*f,e[3]=i*c+a*f,e}function Qn(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=Math.sin(r),l=Math.cos(r);return e[0]=n*l+s*o,e[1]=i*l+a*o,e[2]=n*-o+s*l,e[3]=i*-o+a*l,e}function Kn(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[0],l=r[1];return e[0]=n*o,e[1]=i*o,e[2]=s*l,e[3]=a*l,e}function Jn(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=-r,e[3]=n,e}function ei(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=t[1],e}function ti(e){return"mat2("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}function ri(e){return Math.hypot(e[0],e[1],e[2],e[3])}function ni(e,t,r,n){return e[2]=n[2]/n[0],r[0]=n[0],r[1]=n[1],r[3]=n[3]-e[2]*r[1],[e,t,r]}function ii(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e}function yr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e}function si(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}function ai(e,t){var r=e[0],n=e[1],i=e[2],s=e[3],a=t[0],o=t[1],l=t[2],c=t[3];return Math.abs(r-a)<=S*Math.max(1,Math.abs(r),Math.abs(a))&&Math.abs(n-o)<=S*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(i-l)<=S*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(s-c)<=S*Math.max(1,Math.abs(s),Math.abs(c))}function oi(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e}function li(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e}var ci=_r,fi=yr,hi=Object.freeze(Object.defineProperty({__proto__:null,create:Bn,clone:Nn,copy:Hn,identity:kn,fromValues:qn,set:jn,transpose:Yn,invert:Wn,adjoint:Xn,determinant:Zn,multiply:_r,rotate:Qn,scale:Kn,fromRotation:Jn,fromScaling:ei,str:ti,frob:ri,LDU:ni,add:ii,subtract:yr,exactEquals:si,equals:ai,multiplyScalar:oi,multiplyScalarAndAdd:li,mul:ci,sub:fi},Symbol.toStringTag,{value:"Module"}));function xr(){var e=new V(9);return V!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function ui(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e}function di(e){var t=new V(9);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function pi(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function mi(e,t,r,n,i,s,a,o,l){var c=new V(9);return c[0]=e,c[1]=t,c[2]=r,c[3]=n,c[4]=i,c[5]=s,c[6]=a,c[7]=o,c[8]=l,c}function vi(e,t,r,n,i,s,a,o,l,c){return e[0]=t,e[1]=r,e[2]=n,e[3]=i,e[4]=s,e[5]=a,e[6]=o,e[7]=l,e[8]=c,e}function gi(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function _i(e,t){if(e===t){var r=t[1],n=t[2],i=t[5];e[1]=t[3],e[2]=t[6],e[3]=r,e[5]=t[7],e[6]=n,e[7]=i}else e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8];return e}function yi(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=f*a-o*c,d=-f*s+o*l,h=c*s-a*l,v=r*u+n*d+i*h;return v?(v=1/v,e[0]=u*v,e[1]=(-f*n+i*c)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(f*r-i*l)*v,e[5]=(-o*r+i*s)*v,e[6]=h*v,e[7]=(-c*r+n*l)*v,e[8]=(a*r-n*s)*v,e):null}function xi(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8];return e[0]=a*f-o*c,e[1]=i*c-n*f,e[2]=n*o-i*a,e[3]=o*l-s*f,e[4]=r*f-i*l,e[5]=i*s-r*o,e[6]=s*c-a*l,e[7]=n*l-r*c,e[8]=r*a-n*s,e}function bi(e){var t=e[0],r=e[1],n=e[2],i=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*(c*s-a*l)+r*(-c*i+a*o)+n*(l*i-s*o)}function br(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=t[8],d=r[0],h=r[1],v=r[2],g=r[3],m=r[4],_=r[5],y=r[6],x=r[7],M=r[8];return e[0]=d*n+h*a+v*c,e[1]=d*i+h*o+v*f,e[2]=d*s+h*l+v*u,e[3]=g*n+m*a+_*c,e[4]=g*i+m*o+_*f,e[5]=g*s+m*l+_*u,e[6]=y*n+x*a+M*c,e[7]=y*i+x*o+M*f,e[8]=y*s+x*l+M*u,e}function Mi(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=t[8],d=r[0],h=r[1];return e[0]=n,e[1]=i,e[2]=s,e[3]=a,e[4]=o,e[5]=l,e[6]=d*n+h*a+c,e[7]=d*i+h*o+f,e[8]=d*s+h*l+u,e}function wi(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=t[8],d=Math.sin(r),h=Math.cos(r);return e[0]=h*n+d*a,e[1]=h*i+d*o,e[2]=h*s+d*l,e[3]=h*a-d*n,e[4]=h*o-d*i,e[5]=h*l-d*s,e[6]=c,e[7]=f,e[8]=u,e}function Si(e,t,r){var n=r[0],i=r[1];return e[0]=n*t[0],e[1]=n*t[1],e[2]=n*t[2],e[3]=i*t[3],e[4]=i*t[4],e[5]=i*t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function Ti(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=t[0],e[7]=t[1],e[8]=1,e}function Ii(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=-r,e[4]=n,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function Ai(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=t[1],e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function Ci(e,t){return e[0]=t[0],e[1]=t[1],e[2]=0,e[3]=t[2],e[4]=t[3],e[5]=0,e[6]=t[4],e[7]=t[5],e[8]=1,e}function Di(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=r+r,o=n+n,l=i+i,c=r*a,f=n*a,u=n*o,d=i*a,h=i*o,v=i*l,g=s*a,m=s*o,_=s*l;return e[0]=1-u-v,e[3]=f-_,e[6]=d+m,e[1]=f+_,e[4]=1-c-v,e[7]=h-g,e[2]=d-m,e[5]=h+g,e[8]=1-c-u,e}function Vi(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=t[9],d=t[10],h=t[11],v=t[12],g=t[13],m=t[14],_=t[15],y=r*o-n*a,x=r*l-i*a,M=r*c-s*a,w=n*l-i*o,b=n*c-s*o,C=i*c-s*l,A=f*g-u*v,L=f*m-d*v,R=f*_-h*v,z=u*m-d*g,O=u*_-h*g,$=d*_-h*m,D=y*$-x*O+M*z+w*R-b*L+C*A;return D?(D=1/D,e[0]=(o*$-l*O+c*z)*D,e[1]=(l*R-a*$-c*L)*D,e[2]=(a*O-o*R+c*A)*D,e[3]=(i*O-n*$-s*z)*D,e[4]=(r*$-i*R+s*L)*D,e[5]=(n*R-r*O-s*A)*D,e[6]=(g*C-m*b+_*w)*D,e[7]=(m*M-v*C-_*x)*D,e[8]=(v*b-g*M+_*y)*D,e):null}function Li(e,t,r){return e[0]=2/t,e[1]=0,e[2]=0,e[3]=0,e[4]=-2/r,e[5]=0,e[6]=-1,e[7]=1,e[8]=1,e}function Ri(e){return"mat3("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+")"}function Ei(e){return Math.hypot(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])}function Oi(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e}function Mr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e}function Fi(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e}function Pi(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e[4]=t[4]+r[4]*n,e[5]=t[5]+r[5]*n,e[6]=t[6]+r[6]*n,e[7]=t[7]+r[7]*n,e[8]=t[8]+r[8]*n,e}function zi(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]}function $i(e,t){var r=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=t[0],d=t[1],h=t[2],v=t[3],g=t[4],m=t[5],_=t[6],y=t[7],x=t[8];return Math.abs(r-u)<=S*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(n-d)<=S*Math.max(1,Math.abs(n),Math.abs(d))&&Math.abs(i-h)<=S*Math.max(1,Math.abs(i),Math.abs(h))&&Math.abs(s-v)<=S*Math.max(1,Math.abs(s),Math.abs(v))&&Math.abs(a-g)<=S*Math.max(1,Math.abs(a),Math.abs(g))&&Math.abs(o-m)<=S*Math.max(1,Math.abs(o),Math.abs(m))&&Math.abs(l-_)<=S*Math.max(1,Math.abs(l),Math.abs(_))&&Math.abs(c-y)<=S*Math.max(1,Math.abs(c),Math.abs(y))&&Math.abs(f-x)<=S*Math.max(1,Math.abs(f),Math.abs(x))}var Ui=br,Gi=Mr,Bi=Object.freeze(Object.defineProperty({__proto__:null,create:xr,fromMat4:ui,clone:di,copy:pi,fromValues:mi,set:vi,identity:gi,transpose:_i,invert:yi,adjoint:xi,determinant:bi,multiply:br,translate:Mi,rotate:wi,scale:Si,fromTranslation:Ti,fromRotation:Ii,fromScaling:Ai,fromMat2d:Ci,fromQuat:Di,normalFromMat4:Vi,projection:Li,str:Ri,frob:Ei,add:Oi,subtract:Mr,multiplyScalar:Fi,multiplyScalarAndAdd:Pi,exactEquals:zi,equals:$i,mul:Ui,sub:Gi},Symbol.toStringTag,{value:"Module"}));function Ni(){var e=new V(16);return V!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Hi(e){var t=new V(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function ki(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function qi(e,t,r,n,i,s,a,o,l,c,f,u,d,h,v,g){var m=new V(16);return m[0]=e,m[1]=t,m[2]=r,m[3]=n,m[4]=i,m[5]=s,m[6]=a,m[7]=o,m[8]=l,m[9]=c,m[10]=f,m[11]=u,m[12]=d,m[13]=h,m[14]=v,m[15]=g,m}function ji(e,t,r,n,i,s,a,o,l,c,f,u,d,h,v,g,m){return e[0]=t,e[1]=r,e[2]=n,e[3]=i,e[4]=s,e[5]=a,e[6]=o,e[7]=l,e[8]=c,e[9]=f,e[10]=u,e[11]=d,e[12]=h,e[13]=v,e[14]=g,e[15]=m,e}function N(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Yi(e,t){if(e===t){var r=t[1],n=t[2],i=t[3],s=t[6],a=t[7],o=t[11];e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=r,e[6]=t[9],e[7]=t[13],e[8]=n,e[9]=s,e[11]=t[14],e[12]=i,e[13]=a,e[14]=o}else e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15];return e}function Ce(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=t[9],d=t[10],h=t[11],v=t[12],g=t[13],m=t[14],_=t[15],y=r*o-n*a,x=r*l-i*a,M=r*c-s*a,w=n*l-i*o,b=n*c-s*o,C=i*c-s*l,A=f*g-u*v,L=f*m-d*v,R=f*_-h*v,z=u*m-d*g,O=u*_-h*g,$=d*_-h*m,D=y*$-x*O+M*z+w*R-b*L+C*A;return D?(D=1/D,e[0]=(o*$-l*O+c*z)*D,e[1]=(i*O-n*$-s*z)*D,e[2]=(g*C-m*b+_*w)*D,e[3]=(d*b-u*C-h*w)*D,e[4]=(l*R-a*$-c*L)*D,e[5]=(r*$-i*R+s*L)*D,e[6]=(m*M-v*C-_*x)*D,e[7]=(f*C-d*M+h*x)*D,e[8]=(a*O-o*R+c*A)*D,e[9]=(n*R-r*O-s*A)*D,e[10]=(v*b-g*M+_*y)*D,e[11]=(u*M-f*b-h*y)*D,e[12]=(o*L-a*z-l*A)*D,e[13]=(r*z-n*L+i*A)*D,e[14]=(g*x-v*w-m*y)*D,e[15]=(f*w-u*x+d*y)*D,e):null}function Wi(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=t[9],d=t[10],h=t[11],v=t[12],g=t[13],m=t[14],_=t[15];return e[0]=o*(d*_-h*m)-u*(l*_-c*m)+g*(l*h-c*d),e[1]=-(n*(d*_-h*m)-u*(i*_-s*m)+g*(i*h-s*d)),e[2]=n*(l*_-c*m)-o*(i*_-s*m)+g*(i*c-s*l),e[3]=-(n*(l*h-c*d)-o*(i*h-s*d)+u*(i*c-s*l)),e[4]=-(a*(d*_-h*m)-f*(l*_-c*m)+v*(l*h-c*d)),e[5]=r*(d*_-h*m)-f*(i*_-s*m)+v*(i*h-s*d),e[6]=-(r*(l*_-c*m)-a*(i*_-s*m)+v*(i*c-s*l)),e[7]=r*(l*h-c*d)-a*(i*h-s*d)+f*(i*c-s*l),e[8]=a*(u*_-h*g)-f*(o*_-c*g)+v*(o*h-c*u),e[9]=-(r*(u*_-h*g)-f*(n*_-s*g)+v*(n*h-s*u)),e[10]=r*(o*_-c*g)-a*(n*_-s*g)+v*(n*c-s*o),e[11]=-(r*(o*h-c*u)-a*(n*h-s*u)+f*(n*c-s*o)),e[12]=-(a*(u*m-d*g)-f*(o*m-l*g)+v*(o*d-l*u)),e[13]=r*(u*m-d*g)-f*(n*m-i*g)+v*(n*d-i*u),e[14]=-(r*(o*m-l*g)-a*(n*m-i*g)+v*(n*l-i*o)),e[15]=r*(o*d-l*u)-a*(n*d-i*u)+f*(n*l-i*o),e}function Xi(e){var t=e[0],r=e[1],n=e[2],i=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],f=e[9],u=e[10],d=e[11],h=e[12],v=e[13],g=e[14],m=e[15],_=t*a-r*s,y=t*o-n*s,x=t*l-i*s,M=r*o-n*a,w=r*l-i*a,b=n*l-i*o,C=c*v-f*h,A=c*g-u*h,L=c*m-d*h,R=f*g-u*v,z=f*m-d*v,O=u*m-d*g;return _*O-y*z+x*R+M*L-w*A+b*C}function je(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=t[8],d=t[9],h=t[10],v=t[11],g=t[12],m=t[13],_=t[14],y=t[15],x=r[0],M=r[1],w=r[2],b=r[3];return e[0]=x*n+M*o+w*u+b*g,e[1]=x*i+M*l+w*d+b*m,e[2]=x*s+M*c+w*h+b*_,e[3]=x*a+M*f+w*v+b*y,x=r[4],M=r[5],w=r[6],b=r[7],e[4]=x*n+M*o+w*u+b*g,e[5]=x*i+M*l+w*d+b*m,e[6]=x*s+M*c+w*h+b*_,e[7]=x*a+M*f+w*v+b*y,x=r[8],M=r[9],w=r[10],b=r[11],e[8]=x*n+M*o+w*u+b*g,e[9]=x*i+M*l+w*d+b*m,e[10]=x*s+M*c+w*h+b*_,e[11]=x*a+M*f+w*v+b*y,x=r[12],M=r[13],w=r[14],b=r[15],e[12]=x*n+M*o+w*u+b*g,e[13]=x*i+M*l+w*d+b*m,e[14]=x*s+M*c+w*h+b*_,e[15]=x*a+M*f+w*v+b*y,e}function Zi(e,t,r){var n=r[0],i=r[1],s=r[2],a,o,l,c,f,u,d,h,v,g,m,_;return t===e?(e[12]=t[0]*n+t[4]*i+t[8]*s+t[12],e[13]=t[1]*n+t[5]*i+t[9]*s+t[13],e[14]=t[2]*n+t[6]*i+t[10]*s+t[14],e[15]=t[3]*n+t[7]*i+t[11]*s+t[15]):(a=t[0],o=t[1],l=t[2],c=t[3],f=t[4],u=t[5],d=t[6],h=t[7],v=t[8],g=t[9],m=t[10],_=t[11],e[0]=a,e[1]=o,e[2]=l,e[3]=c,e[4]=f,e[5]=u,e[6]=d,e[7]=h,e[8]=v,e[9]=g,e[10]=m,e[11]=_,e[12]=a*n+f*i+v*s+t[12],e[13]=o*n+u*i+g*s+t[13],e[14]=l*n+d*i+m*s+t[14],e[15]=c*n+h*i+_*s+t[15]),e}function Qi(e,t,r){var n=r[0],i=r[1],s=r[2];return e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n,e[3]=t[3]*n,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*s,e[9]=t[9]*s,e[10]=t[10]*s,e[11]=t[11]*s,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Ki(e,t,r,n){var i=n[0],s=n[1],a=n[2],o=Math.hypot(i,s,a),l,c,f,u,d,h,v,g,m,_,y,x,M,w,b,C,A,L,R,z,O,$,D,W;return o<S?null:(o=1/o,i*=o,s*=o,a*=o,l=Math.sin(r),c=Math.cos(r),f=1-c,u=t[0],d=t[1],h=t[2],v=t[3],g=t[4],m=t[5],_=t[6],y=t[7],x=t[8],M=t[9],w=t[10],b=t[11],C=i*i*f+c,A=s*i*f+a*l,L=a*i*f-s*l,R=i*s*f-a*l,z=s*s*f+c,O=a*s*f+i*l,$=i*a*f+s*l,D=s*a*f-i*l,W=a*a*f+c,e[0]=u*C+g*A+x*L,e[1]=d*C+m*A+M*L,e[2]=h*C+_*A+w*L,e[3]=v*C+y*A+b*L,e[4]=u*R+g*z+x*O,e[5]=d*R+m*z+M*O,e[6]=h*R+_*z+w*O,e[7]=v*R+y*z+b*O,e[8]=u*$+g*D+x*W,e[9]=d*$+m*D+M*W,e[10]=h*$+_*D+w*W,e[11]=v*$+y*D+b*W,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function Ji(e,t,r){var n=Math.sin(r),i=Math.cos(r),s=t[4],a=t[5],o=t[6],l=t[7],c=t[8],f=t[9],u=t[10],d=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=s*i+c*n,e[5]=a*i+f*n,e[6]=o*i+u*n,e[7]=l*i+d*n,e[8]=c*i-s*n,e[9]=f*i-a*n,e[10]=u*i-o*n,e[11]=d*i-l*n,e}function wr(e,t,r){var n=Math.sin(r),i=Math.cos(r),s=t[0],a=t[1],o=t[2],l=t[3],c=t[8],f=t[9],u=t[10],d=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*i-c*n,e[1]=a*i-f*n,e[2]=o*i-u*n,e[3]=l*i-d*n,e[8]=s*n+c*i,e[9]=a*n+f*i,e[10]=o*n+u*i,e[11]=l*n+d*i,e}function es(e,t,r){var n=Math.sin(r),i=Math.cos(r),s=t[0],a=t[1],o=t[2],l=t[3],c=t[4],f=t[5],u=t[6],d=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*i+c*n,e[1]=a*i+f*n,e[2]=o*i+u*n,e[3]=l*i+d*n,e[4]=c*i-s*n,e[5]=f*i-a*n,e[6]=u*i-o*n,e[7]=d*i-l*n,e}function ts(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function rs(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ns(e,t,r){var n=r[0],i=r[1],s=r[2],a=Math.hypot(n,i,s),o,l,c;return a<S?null:(a=1/a,n*=a,i*=a,s*=a,o=Math.sin(t),l=Math.cos(t),c=1-l,e[0]=n*n*c+l,e[1]=i*n*c+s*o,e[2]=s*n*c-i*o,e[3]=0,e[4]=n*i*c-s*o,e[5]=i*i*c+l,e[6]=s*i*c+n*o,e[7]=0,e[8]=n*s*c+i*o,e[9]=i*s*c-n*o,e[10]=s*s*c+l,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e)}function is(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ss(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function as(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Sr(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=n+n,l=i+i,c=s+s,f=n*o,u=n*l,d=n*c,h=i*l,v=i*c,g=s*c,m=a*o,_=a*l,y=a*c;return e[0]=1-(h+g),e[1]=u+y,e[2]=d-_,e[3]=0,e[4]=u-y,e[5]=1-(f+g),e[6]=v+m,e[7]=0,e[8]=d+_,e[9]=v-m,e[10]=1-(f+h),e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function os(e,t){var r=new V(3),n=-t[0],i=-t[1],s=-t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=n*n+i*i+s*s+a*a;return u>0?(r[0]=(o*a+f*n+l*s-c*i)*2/u,r[1]=(l*a+f*i+c*n-o*s)*2/u,r[2]=(c*a+f*s+o*i-l*n)*2/u):(r[0]=(o*a+f*n+l*s-c*i)*2,r[1]=(l*a+f*i+c*n-o*s)*2,r[2]=(c*a+f*s+o*i-l*n)*2),Sr(e,t,r),e}function j(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function gt(e,t){var r=t[0],n=t[1],i=t[2],s=t[4],a=t[5],o=t[6],l=t[8],c=t[9],f=t[10];return e[0]=Math.hypot(r,n,i),e[1]=Math.hypot(s,a,o),e[2]=Math.hypot(l,c,f),e}function Ge(e,t){var r=new V(3);gt(r,t);var n=1/r[0],i=1/r[1],s=1/r[2],a=t[0]*n,o=t[1]*i,l=t[2]*s,c=t[4]*n,f=t[5]*i,u=t[6]*s,d=t[8]*n,h=t[9]*i,v=t[10]*s,g=a+f+v,m=0;return g>0?(m=Math.sqrt(g+1)*2,e[3]=.25*m,e[0]=(u-h)/m,e[1]=(d-l)/m,e[2]=(o-c)/m):a>f&&a>v?(m=Math.sqrt(1+a-f-v)*2,e[3]=(u-h)/m,e[0]=.25*m,e[1]=(o+c)/m,e[2]=(d+l)/m):f>v?(m=Math.sqrt(1+f-a-v)*2,e[3]=(d-l)/m,e[0]=(o+c)/m,e[1]=.25*m,e[2]=(u+h)/m):(m=Math.sqrt(1+v-a-f)*2,e[3]=(o-c)/m,e[0]=(d+l)/m,e[1]=(u+h)/m,e[2]=.25*m),e}function Tr(e,t,r,n){var i=t[0],s=t[1],a=t[2],o=t[3],l=i+i,c=s+s,f=a+a,u=i*l,d=i*c,h=i*f,v=s*c,g=s*f,m=a*f,_=o*l,y=o*c,x=o*f,M=n[0],w=n[1],b=n[2];return e[0]=(1-(v+m))*M,e[1]=(d+x)*M,e[2]=(h-y)*M,e[3]=0,e[4]=(d-x)*w,e[5]=(1-(u+m))*w,e[6]=(g+_)*w,e[7]=0,e[8]=(h+y)*b,e[9]=(g-_)*b,e[10]=(1-(u+v))*b,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function ls(e,t,r,n,i){var s=t[0],a=t[1],o=t[2],l=t[3],c=s+s,f=a+a,u=o+o,d=s*c,h=s*f,v=s*u,g=a*f,m=a*u,_=o*u,y=l*c,x=l*f,M=l*u,w=n[0],b=n[1],C=n[2],A=i[0],L=i[1],R=i[2],z=(1-(g+_))*w,O=(h+M)*w,$=(v-x)*w,D=(h-M)*b,W=(1-(d+_))*b,we=(m+y)*b,Se=(v+x)*C,kt=(m-y)*C,qt=(1-(d+g))*C;return e[0]=z,e[1]=O,e[2]=$,e[3]=0,e[4]=D,e[5]=W,e[6]=we,e[7]=0,e[8]=Se,e[9]=kt,e[10]=qt,e[11]=0,e[12]=r[0]+A-(z*A+D*L+Se*R),e[13]=r[1]+L-(O*A+W*L+kt*R),e[14]=r[2]+R-($*A+we*L+qt*R),e[15]=1,e}function cs(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=r+r,o=n+n,l=i+i,c=r*a,f=n*a,u=n*o,d=i*a,h=i*o,v=i*l,g=s*a,m=s*o,_=s*l;return e[0]=1-u-v,e[1]=f+_,e[2]=d-m,e[3]=0,e[4]=f-_,e[5]=1-c-v,e[6]=h+g,e[7]=0,e[8]=d+m,e[9]=h-g,e[10]=1-c-u,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function fs(e,t,r,n,i,s,a){var o=1/(r-t),l=1/(i-n),c=1/(s-a);return e[0]=s*2*o,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s*2*l,e[6]=0,e[7]=0,e[8]=(r+t)*o,e[9]=(i+n)*l,e[10]=(a+s)*c,e[11]=-1,e[12]=0,e[13]=0,e[14]=a*s*2*c,e[15]=0,e}function Ir(e,t,r,n,i){var s=1/Math.tan(t/2),a;return e[0]=s/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(a=1/(n-i),e[10]=(i+n)*a,e[14]=2*i*n*a):(e[10]=-1,e[14]=-2*n),e}var Ar=Ir;function hs(e,t,r,n,i){var s=1/Math.tan(t/2),a;return e[0]=s/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(a=1/(n-i),e[10]=i*a,e[14]=i*n*a):(e[10]=-1,e[14]=-n),e}function us(e,t,r,n){var i=Math.tan(t.upDegrees*Math.PI/180),s=Math.tan(t.downDegrees*Math.PI/180),a=Math.tan(t.leftDegrees*Math.PI/180),o=Math.tan(t.rightDegrees*Math.PI/180),l=2/(a+o),c=2/(i+s);return e[0]=l,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=c,e[6]=0,e[7]=0,e[8]=-((a-o)*l*.5),e[9]=(i-s)*c*.5,e[10]=n/(r-n),e[11]=-1,e[12]=0,e[13]=0,e[14]=n*r/(r-n),e[15]=0,e}function Cr(e,t,r,n,i,s,a){var o=1/(t-r),l=1/(n-i),c=1/(s-a);return e[0]=-2*o,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*c,e[11]=0,e[12]=(t+r)*o,e[13]=(i+n)*l,e[14]=(a+s)*c,e[15]=1,e}var ds=Cr;function ps(e,t,r,n,i,s,a){var o=1/(t-r),l=1/(n-i),c=1/(s-a);return e[0]=-2*o,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=c,e[11]=0,e[12]=(t+r)*o,e[13]=(i+n)*l,e[14]=s*c,e[15]=1,e}function _t(e,t,r,n){var i,s,a,o,l,c,f,u,d,h,v=t[0],g=t[1],m=t[2],_=n[0],y=n[1],x=n[2],M=r[0],w=r[1],b=r[2];return Math.abs(v-M)<S&&Math.abs(g-w)<S&&Math.abs(m-b)<S?N(e):(f=v-M,u=g-w,d=m-b,h=1/Math.hypot(f,u,d),f*=h,u*=h,d*=h,i=y*d-x*u,s=x*f-_*d,a=_*u-y*f,h=Math.hypot(i,s,a),h?(h=1/h,i*=h,s*=h,a*=h):(i=0,s=0,a=0),o=u*a-d*s,l=d*i-f*a,c=f*s-u*i,h=Math.hypot(o,l,c),h?(h=1/h,o*=h,l*=h,c*=h):(o=0,l=0,c=0),e[0]=i,e[1]=o,e[2]=f,e[3]=0,e[4]=s,e[5]=l,e[6]=u,e[7]=0,e[8]=a,e[9]=c,e[10]=d,e[11]=0,e[12]=-(i*v+s*g+a*m),e[13]=-(o*v+l*g+c*m),e[14]=-(f*v+u*g+d*m),e[15]=1,e)}function ms(e,t,r,n){var i=t[0],s=t[1],a=t[2],o=n[0],l=n[1],c=n[2],f=i-r[0],u=s-r[1],d=a-r[2],h=f*f+u*u+d*d;h>0&&(h=1/Math.sqrt(h),f*=h,u*=h,d*=h);var v=l*d-c*u,g=c*f-o*d,m=o*u-l*f;return h=v*v+g*g+m*m,h>0&&(h=1/Math.sqrt(h),v*=h,g*=h,m*=h),e[0]=v,e[1]=g,e[2]=m,e[3]=0,e[4]=u*m-d*g,e[5]=d*v-f*m,e[6]=f*g-u*v,e[7]=0,e[8]=f,e[9]=u,e[10]=d,e[11]=0,e[12]=i,e[13]=s,e[14]=a,e[15]=1,e}function vs(e){return"mat4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+")"}function gs(e){return Math.hypot(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15])}function _s(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e[9]=t[9]+r[9],e[10]=t[10]+r[10],e[11]=t[11]+r[11],e[12]=t[12]+r[12],e[13]=t[13]+r[13],e[14]=t[14]+r[14],e[15]=t[15]+r[15],e}function Dr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e[9]=t[9]-r[9],e[10]=t[10]-r[10],e[11]=t[11]-r[11],e[12]=t[12]-r[12],e[13]=t[13]-r[13],e[14]=t[14]-r[14],e[15]=t[15]-r[15],e}function ys(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e[9]=t[9]*r,e[10]=t[10]*r,e[11]=t[11]*r,e[12]=t[12]*r,e[13]=t[13]*r,e[14]=t[14]*r,e[15]=t[15]*r,e}function xs(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e[4]=t[4]+r[4]*n,e[5]=t[5]+r[5]*n,e[6]=t[6]+r[6]*n,e[7]=t[7]+r[7]*n,e[8]=t[8]+r[8]*n,e[9]=t[9]+r[9]*n,e[10]=t[10]+r[10]*n,e[11]=t[11]+r[11]*n,e[12]=t[12]+r[12]*n,e[13]=t[13]+r[13]*n,e[14]=t[14]+r[14]*n,e[15]=t[15]+r[15]*n,e}function bs(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]&&e[9]===t[9]&&e[10]===t[10]&&e[11]===t[11]&&e[12]===t[12]&&e[13]===t[13]&&e[14]===t[14]&&e[15]===t[15]}function Ms(e,t){var r=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],u=e[9],d=e[10],h=e[11],v=e[12],g=e[13],m=e[14],_=e[15],y=t[0],x=t[1],M=t[2],w=t[3],b=t[4],C=t[5],A=t[6],L=t[7],R=t[8],z=t[9],O=t[10],$=t[11],D=t[12],W=t[13],we=t[14],Se=t[15];return Math.abs(r-y)<=S*Math.max(1,Math.abs(r),Math.abs(y))&&Math.abs(n-x)<=S*Math.max(1,Math.abs(n),Math.abs(x))&&Math.abs(i-M)<=S*Math.max(1,Math.abs(i),Math.abs(M))&&Math.abs(s-w)<=S*Math.max(1,Math.abs(s),Math.abs(w))&&Math.abs(a-b)<=S*Math.max(1,Math.abs(a),Math.abs(b))&&Math.abs(o-C)<=S*Math.max(1,Math.abs(o),Math.abs(C))&&Math.abs(l-A)<=S*Math.max(1,Math.abs(l),Math.abs(A))&&Math.abs(c-L)<=S*Math.max(1,Math.abs(c),Math.abs(L))&&Math.abs(f-R)<=S*Math.max(1,Math.abs(f),Math.abs(R))&&Math.abs(u-z)<=S*Math.max(1,Math.abs(u),Math.abs(z))&&Math.abs(d-O)<=S*Math.max(1,Math.abs(d),Math.abs(O))&&Math.abs(h-$)<=S*Math.max(1,Math.abs(h),Math.abs($))&&Math.abs(v-D)<=S*Math.max(1,Math.abs(v),Math.abs(D))&&Math.abs(g-W)<=S*Math.max(1,Math.abs(g),Math.abs(W))&&Math.abs(m-we)<=S*Math.max(1,Math.abs(m),Math.abs(we))&&Math.abs(_-Se)<=S*Math.max(1,Math.abs(_),Math.abs(Se))}var Vr=je,ws=Dr,Ss=Object.freeze(Object.defineProperty({__proto__:null,create:Ni,clone:Hi,copy:ki,fromValues:qi,set:ji,identity:N,transpose:Yi,invert:Ce,adjoint:Wi,determinant:Xi,multiply:je,translate:Zi,scale:Qi,rotate:Ki,rotateX:Ji,rotateY:wr,rotateZ:es,fromTranslation:ts,fromScaling:rs,fromRotation:ns,fromXRotation:is,fromYRotation:ss,fromZRotation:as,fromRotationTranslation:Sr,fromQuat2:os,getTranslation:j,getScaling:gt,getRotation:Ge,fromRotationTranslationScale:Tr,fromRotationTranslationScaleOrigin:ls,fromQuat:cs,frustum:fs,perspectiveNO:Ir,perspective:Ar,perspectiveZO:hs,perspectiveFromFieldOfView:us,orthoNO:Cr,ortho:ds,orthoZO:ps,lookAt:_t,targetTo:ms,str:vs,frob:gs,add:_s,subtract:Dr,multiplyScalar:ys,multiplyScalarAndAdd:xs,exactEquals:bs,equals:Ms,mul:Vr,sub:ws},Symbol.toStringTag,{value:"Module"}));function yt(){var e=new V(3);return V!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function Ts(e){var t=new V(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function Lr(e){var t=e[0],r=e[1],n=e[2];return Math.hypot(t,r,n)}function ut(e,t,r){var n=new V(3);return n[0]=e,n[1]=t,n[2]=r,n}function Is(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function As(e,t,r,n){return e[0]=t,e[1]=r,e[2]=n,e}function Ye(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e}function Rr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e}function Er(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e}function Or(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e}function Cs(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e}function Ds(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e}function Vs(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e}function Ls(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e}function Rs(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e}function Le(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e}function Es(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e}function xt(e,t){var r=t[0]-e[0],n=t[1]-e[1],i=t[2]-e[2];return Math.hypot(r,n,i)}function Fr(e,t){var r=t[0]-e[0],n=t[1]-e[1],i=t[2]-e[2];return r*r+n*n+i*i}function Pr(e){var t=e[0],r=e[1],n=e[2];return t*t+r*r+n*n}function Os(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e}function Fs(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e}function ge(e,t){var r=t[0],n=t[1],i=t[2],s=r*r+n*n+i*i;return s>0&&(s=1/Math.sqrt(s)),e[0]=t[0]*s,e[1]=t[1]*s,e[2]=t[2]*s,e}function bt(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function De(e,t,r){var n=t[0],i=t[1],s=t[2],a=r[0],o=r[1],l=r[2];return e[0]=i*l-s*o,e[1]=s*a-n*l,e[2]=n*o-i*a,e}function Ps(e,t,r,n){var i=t[0],s=t[1],a=t[2];return e[0]=i+n*(r[0]-i),e[1]=s+n*(r[1]-s),e[2]=a+n*(r[2]-a),e}function zs(e,t,r,n,i,s){var a=s*s,o=a*(2*s-3)+1,l=a*(s-2)+s,c=a*(s-1),f=a*(3-2*s);return e[0]=t[0]*o+r[0]*l+n[0]*c+i[0]*f,e[1]=t[1]*o+r[1]*l+n[1]*c+i[1]*f,e[2]=t[2]*o+r[2]*l+n[2]*c+i[2]*f,e}function $s(e,t,r,n,i,s){var a=1-s,o=a*a,l=s*s,c=o*a,f=3*s*o,u=3*l*a,d=l*s;return e[0]=t[0]*c+r[0]*f+n[0]*u+i[0]*d,e[1]=t[1]*c+r[1]*f+n[1]*u+i[1]*d,e[2]=t[2]*c+r[2]*f+n[2]*u+i[2]*d,e}function Us(e,t){t=t||1;var r=J()*2*Math.PI,n=J()*2-1,i=Math.sqrt(1-n*n)*t;return e[0]=Math.cos(r)*i,e[1]=Math.sin(r)*i,e[2]=n*t,e}function Mt(e,t,r){var n=t[0],i=t[1],s=t[2],a=r[3]*n+r[7]*i+r[11]*s+r[15];return a=a||1,e[0]=(r[0]*n+r[4]*i+r[8]*s+r[12])/a,e[1]=(r[1]*n+r[5]*i+r[9]*s+r[13])/a,e[2]=(r[2]*n+r[6]*i+r[10]*s+r[14])/a,e}function Gs(e,t,r){var n=t[0],i=t[1],s=t[2];return e[0]=n*r[0]+i*r[3]+s*r[6],e[1]=n*r[1]+i*r[4]+s*r[7],e[2]=n*r[2]+i*r[5]+s*r[8],e}function wt(e,t,r){var n=r[0],i=r[1],s=r[2],a=r[3],o=t[0],l=t[1],c=t[2],f=i*c-s*l,u=s*o-n*c,d=n*l-i*o,h=i*d-s*u,v=s*f-n*d,g=n*u-i*f,m=a*2;return f*=m,u*=m,d*=m,h*=2,v*=2,g*=2,e[0]=o+f+h,e[1]=l+u+v,e[2]=c+d+g,e}function Bs(e,t,r,n){var i=[],s=[];return i[0]=t[0]-r[0],i[1]=t[1]-r[1],i[2]=t[2]-r[2],s[0]=i[0],s[1]=i[1]*Math.cos(n)-i[2]*Math.sin(n),s[2]=i[1]*Math.sin(n)+i[2]*Math.cos(n),e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function Ns(e,t,r,n){var i=[],s=[];return i[0]=t[0]-r[0],i[1]=t[1]-r[1],i[2]=t[2]-r[2],s[0]=i[2]*Math.sin(n)+i[0]*Math.cos(n),s[1]=i[1],s[2]=i[2]*Math.cos(n)-i[0]*Math.sin(n),e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function Hs(e,t,r,n){var i=[],s=[];return i[0]=t[0]-r[0],i[1]=t[1]-r[1],i[2]=t[2]-r[2],s[0]=i[0]*Math.cos(n)-i[1]*Math.sin(n),s[1]=i[0]*Math.sin(n)+i[1]*Math.cos(n),s[2]=i[2],e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function ks(e,t){var r=e[0],n=e[1],i=e[2],s=t[0],a=t[1],o=t[2],l=Math.sqrt(r*r+n*n+i*i),c=Math.sqrt(s*s+a*a+o*o),f=l*c,u=f&&bt(e,t)/f;return Math.acos(Math.min(Math.max(u,-1),1))}function qs(e){return e[0]=0,e[1]=0,e[2]=0,e}function js(e){return"vec3("+e[0]+", "+e[1]+", "+e[2]+")"}function Ys(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function Ws(e,t){var r=e[0],n=e[1],i=e[2],s=t[0],a=t[1],o=t[2];return Math.abs(r-s)<=S*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(n-a)<=S*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-o)<=S*Math.max(1,Math.abs(i),Math.abs(o))}var _e=Rr,Xs=Er,Zs=Or,Qs=xt,Ks=Fr,zr=Lr,$r=Pr,Js=function(){var e=yt();return function(t,r,n,i,s,a){var o,l;for(r||(r=3),n||(n=0),i?l=Math.min(i*r+n,t.length):l=t.length,o=n;o<l;o+=r)e[0]=t[o],e[1]=t[o+1],e[2]=t[o+2],s(e,e,a),t[o]=e[0],t[o+1]=e[1],t[o+2]=e[2];return t}}(),ea=Object.freeze(Object.defineProperty({__proto__:null,create:yt,clone:Ts,length:Lr,fromValues:ut,copy:Is,set:As,add:Ye,subtract:Rr,multiply:Er,divide:Or,ceil:Cs,floor:Ds,min:Vs,max:Ls,round:Rs,scale:Le,scaleAndAdd:Es,distance:xt,squaredDistance:Fr,squaredLength:Pr,negate:Os,inverse:Fs,normalize:ge,dot:bt,cross:De,lerp:Ps,hermite:zs,bezier:$s,random:Us,transformMat4:Mt,transformMat3:Gs,transformQuat:wt,rotateX:Bs,rotateY:Ns,rotateZ:Hs,angle:ks,zero:qs,str:js,exactEquals:Ys,equals:Ws,sub:_e,mul:Xs,div:Zs,dist:Qs,sqrDist:Ks,len:zr,sqrLen:$r,forEach:Js},Symbol.toStringTag,{value:"Module"}));function Ur(){var e=new V(4);return V!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Gr(e){var t=new V(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Br(e,t,r,n){var i=new V(4);return i[0]=e,i[1]=t,i[2]=r,i[3]=n,i}function Nr(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function Hr(e,t,r,n,i){return e[0]=t,e[1]=r,e[2]=n,e[3]=i,e}function kr(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e}function qr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e}function jr(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e[3]=t[3]*r[3],e}function Yr(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e[3]=t[3]/r[3],e}function ta(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e[3]=Math.ceil(t[3]),e}function ra(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e[3]=Math.floor(t[3]),e}function na(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e[3]=Math.min(t[3],r[3]),e}function ia(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e[3]=Math.max(t[3],r[3]),e}function sa(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e[3]=Math.round(t[3]),e}function Wr(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e}function aa(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e}function Xr(e,t){var r=t[0]-e[0],n=t[1]-e[1],i=t[2]-e[2],s=t[3]-e[3];return Math.hypot(r,n,i,s)}function Zr(e,t){var r=t[0]-e[0],n=t[1]-e[1],i=t[2]-e[2],s=t[3]-e[3];return r*r+n*n+i*i+s*s}function St(e){var t=e[0],r=e[1],n=e[2],i=e[3];return Math.hypot(t,r,n,i)}function Tt(e){var t=e[0],r=e[1],n=e[2],i=e[3];return t*t+r*r+n*n+i*i}function oa(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e}function la(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e[3]=1/t[3],e}function Qr(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=r*r+n*n+i*i+s*s;return a>0&&(a=1/Math.sqrt(a)),e[0]=r*a,e[1]=n*a,e[2]=i*a,e[3]=s*a,e}function Kr(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}function ca(e,t,r,n){var i=r[0]*n[1]-r[1]*n[0],s=r[0]*n[2]-r[2]*n[0],a=r[0]*n[3]-r[3]*n[0],o=r[1]*n[2]-r[2]*n[1],l=r[1]*n[3]-r[3]*n[1],c=r[2]*n[3]-r[3]*n[2],f=t[0],u=t[1],d=t[2],h=t[3];return e[0]=u*c-d*l+h*o,e[1]=-(f*c)+d*a-h*s,e[2]=f*l-u*a+h*i,e[3]=-(f*o)+u*s-d*i,e}function Jr(e,t,r,n){var i=t[0],s=t[1],a=t[2],o=t[3];return e[0]=i+n*(r[0]-i),e[1]=s+n*(r[1]-s),e[2]=a+n*(r[2]-a),e[3]=o+n*(r[3]-o),e}function fa(e,t){t=t||1;var r,n,i,s,a,o;do r=J()*2-1,n=J()*2-1,a=r*r+n*n;while(a>=1);do i=J()*2-1,s=J()*2-1,o=i*i+s*s;while(o>=1);var l=Math.sqrt((1-a)/o);return e[0]=t*r,e[1]=t*n,e[2]=t*i*l,e[3]=t*s*l,e}function ha(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3];return e[0]=r[0]*n+r[4]*i+r[8]*s+r[12]*a,e[1]=r[1]*n+r[5]*i+r[9]*s+r[13]*a,e[2]=r[2]*n+r[6]*i+r[10]*s+r[14]*a,e[3]=r[3]*n+r[7]*i+r[11]*s+r[15]*a,e}function ua(e,t,r){var n=t[0],i=t[1],s=t[2],a=r[0],o=r[1],l=r[2],c=r[3],f=c*n+o*s-l*i,u=c*i+l*n-a*s,d=c*s+a*i-o*n,h=-a*n-o*i-l*s;return e[0]=f*c+h*-a+u*-l-d*-o,e[1]=u*c+h*-o+d*-a-f*-l,e[2]=d*c+h*-l+f*-o-u*-a,e[3]=t[3],e}function da(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e}function pa(e){return"vec4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}function en(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}function tn(e,t){var r=e[0],n=e[1],i=e[2],s=e[3],a=t[0],o=t[1],l=t[2],c=t[3];return Math.abs(r-a)<=S*Math.max(1,Math.abs(r),Math.abs(a))&&Math.abs(n-o)<=S*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(i-l)<=S*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(s-c)<=S*Math.max(1,Math.abs(s),Math.abs(c))}var ma=qr,va=jr,ga=Yr,_a=Xr,ya=Zr,xa=St,ba=Tt,Ma=function(){var e=Ur();return function(t,r,n,i,s,a){var o,l;for(r||(r=4),n||(n=0),i?l=Math.min(i*r+n,t.length):l=t.length,o=n;o<l;o+=r)e[0]=t[o],e[1]=t[o+1],e[2]=t[o+2],e[3]=t[o+3],s(e,e,a),t[o]=e[0],t[o+1]=e[1],t[o+2]=e[2],t[o+3]=e[3];return t}}(),wa=Object.freeze(Object.defineProperty({__proto__:null,create:Ur,clone:Gr,fromValues:Br,copy:Nr,set:Hr,add:kr,subtract:qr,multiply:jr,divide:Yr,ceil:ta,floor:ra,min:na,max:ia,round:sa,scale:Wr,scaleAndAdd:aa,distance:Xr,squaredDistance:Zr,length:St,squaredLength:Tt,negate:oa,inverse:la,normalize:Qr,dot:Kr,cross:ca,lerp:Jr,random:fa,transformMat4:ha,transformQuat:ua,zero:da,str:pa,exactEquals:en,equals:tn,sub:ma,mul:va,div:ga,dist:_a,sqrDist:ya,len:xa,sqrLen:ba,forEach:Ma},Symbol.toStringTag,{value:"Module"}));function We(){var e=new V(4);return V!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function rn(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function It(e,t,r){r=r*.5;var n=Math.sin(r);return e[0]=n*t[0],e[1]=n*t[1],e[2]=n*t[2],e[3]=Math.cos(r),e}function Sa(e,t){var r=Math.acos(t[3])*2,n=Math.sin(r/2);return n>S?(e[0]=t[0]/n,e[1]=t[1]/n,e[2]=t[2]/n):(e[0]=1,e[1]=0,e[2]=0),r}function Ta(e,t){var r=Vt(e,t);return Math.acos(2*r*r-1)}function At(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[0],l=r[1],c=r[2],f=r[3];return e[0]=n*f+a*o+i*c-s*l,e[1]=i*f+a*l+s*o-n*c,e[2]=s*f+a*c+n*l-i*o,e[3]=a*f-n*o-i*l-s*c,e}function Ct(e,t,r){r*=.5;var n=t[0],i=t[1],s=t[2],a=t[3],o=Math.sin(r),l=Math.cos(r);return e[0]=n*l+a*o,e[1]=i*l+s*o,e[2]=s*l-i*o,e[3]=a*l-n*o,e}function nn(e,t,r){r*=.5;var n=t[0],i=t[1],s=t[2],a=t[3],o=Math.sin(r),l=Math.cos(r);return e[0]=n*l-s*o,e[1]=i*l+a*o,e[2]=s*l+n*o,e[3]=a*l-i*o,e}function sn(e,t,r){r*=.5;var n=t[0],i=t[1],s=t[2],a=t[3],o=Math.sin(r),l=Math.cos(r);return e[0]=n*l+i*o,e[1]=i*l-n*o,e[2]=s*l+a*o,e[3]=a*l-s*o,e}function Ia(e,t){var r=t[0],n=t[1],i=t[2];return e[0]=r,e[1]=n,e[2]=i,e[3]=Math.sqrt(Math.abs(1-r*r-n*n-i*i)),e}function an(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=Math.sqrt(r*r+n*n+i*i),o=Math.exp(s),l=a>0?o*Math.sin(a)/a:0;return e[0]=r*l,e[1]=n*l,e[2]=i*l,e[3]=o*Math.cos(a),e}function on(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=Math.sqrt(r*r+n*n+i*i),o=a>0?Math.atan2(a,s)/a:0;return e[0]=r*o,e[1]=n*o,e[2]=i*o,e[3]=.5*Math.log(r*r+n*n+i*i+s*s),e}function Aa(e,t,r){return on(e,t),fn(e,e,r),an(e,e),e}function ke(e,t,r,n){var i=t[0],s=t[1],a=t[2],o=t[3],l=r[0],c=r[1],f=r[2],u=r[3],d,h,v,g,m;return h=i*l+s*c+a*f+o*u,h<0&&(h=-h,l=-l,c=-c,f=-f,u=-u),1-h>S?(d=Math.acos(h),v=Math.sin(d),g=Math.sin((1-n)*d)/v,m=Math.sin(n*d)/v):(g=1-n,m=n),e[0]=g*i+m*l,e[1]=g*s+m*c,e[2]=g*a+m*f,e[3]=g*o+m*u,e}function Ca(e){var t=J(),r=J(),n=J(),i=Math.sqrt(1-t),s=Math.sqrt(t);return e[0]=i*Math.sin(2*Math.PI*r),e[1]=i*Math.cos(2*Math.PI*r),e[2]=s*Math.sin(2*Math.PI*n),e[3]=s*Math.cos(2*Math.PI*n),e}function ln(e,t){var r=t[0],n=t[1],i=t[2],s=t[3],a=r*r+n*n+i*i+s*s,o=a?1/a:0;return e[0]=-r*o,e[1]=-n*o,e[2]=-i*o,e[3]=s*o,e}function Da(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e}function cn(e,t){var r=t[0]+t[4]+t[8],n;if(r>0)n=Math.sqrt(r+1),e[3]=.5*n,n=.5/n,e[0]=(t[5]-t[7])*n,e[1]=(t[6]-t[2])*n,e[2]=(t[1]-t[3])*n;else{var i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);var s=(i+1)%3,a=(i+2)%3;n=Math.sqrt(t[i*3+i]-t[s*3+s]-t[a*3+a]+1),e[i]=.5*n,n=.5/n,e[3]=(t[s*3+a]-t[a*3+s])*n,e[s]=(t[s*3+i]+t[i*3+s])*n,e[a]=(t[a*3+i]+t[i*3+a])*n}return e}function Va(e,t,r,n){var i=.5*Math.PI/180;t*=i,r*=i,n*=i;var s=Math.sin(t),a=Math.cos(t),o=Math.sin(r),l=Math.cos(r),c=Math.sin(n),f=Math.cos(n);return e[0]=s*l*f-a*o*c,e[1]=a*o*f+s*l*c,e[2]=a*l*c-s*o*f,e[3]=a*l*f+s*o*c,e}function La(e){return"quat("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}var Ra=Gr,Ea=Br,Dt=Nr,Oa=Hr,Fa=kr,Pa=At,fn=Wr,Vt=Kr,za=Jr,Lt=St,$a=Lt,Rt=Tt,Ua=Rt,Et=Qr,Ga=en,Ba=tn,Na=function(){var e=yt(),t=ut(1,0,0),r=ut(0,1,0);return function(n,i,s){var a=bt(i,s);return a<-.999999?(De(e,t,i),zr(e)<1e-6&&De(e,r,i),ge(e,e),It(n,e,Math.PI),n):a>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(De(e,i,s),n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=1+a,Et(n,n))}}(),Ha=function(){var e=We(),t=We();return function(r,n,i,s,a,o){return ke(e,n,a,o),ke(t,i,s,o),ke(r,e,t,2*o*(1-o)),r}}(),ka=function(){var e=xr();return function(t,r,n,i){return e[0]=n[0],e[3]=n[1],e[6]=n[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-r[0],e[5]=-r[1],e[8]=-r[2],Et(t,cn(t,e))}}(),qa=Object.freeze(Object.defineProperty({__proto__:null,create:We,identity:rn,setAxisAngle:It,getAxisAngle:Sa,getAngle:Ta,multiply:At,rotateX:Ct,rotateY:nn,rotateZ:sn,calculateW:Ia,exp:an,ln:on,pow:Aa,slerp:ke,random:Ca,invert:ln,conjugate:Da,fromMat3:cn,fromEuler:Va,str:La,clone:Ra,fromValues:Ea,copy:Dt,set:Oa,add:Fa,mul:Pa,scale:fn,dot:Vt,lerp:za,length:Lt,len:$a,squaredLength:Rt,sqrLen:Ua,normalize:Et,exactEquals:Ga,equals:Ba,rotationTo:Na,sqlerp:Ha,setAxes:ka},Symbol.toStringTag,{value:"Module"}));function ja(){var e=new V(8);return V!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0),e[3]=1,e}function Ya(e){var t=new V(8);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t}function Wa(e,t,r,n,i,s,a,o){var l=new V(8);return l[0]=e,l[1]=t,l[2]=r,l[3]=n,l[4]=i,l[5]=s,l[6]=a,l[7]=o,l}function Xa(e,t,r,n,i,s,a){var o=new V(8);o[0]=e,o[1]=t,o[2]=r,o[3]=n;var l=i*.5,c=s*.5,f=a*.5;return o[4]=l*n+c*r-f*t,o[5]=c*n+f*e-l*r,o[6]=f*n+l*t-c*e,o[7]=-l*e-c*t-f*r,o}function hn(e,t,r){var n=r[0]*.5,i=r[1]*.5,s=r[2]*.5,a=t[0],o=t[1],l=t[2],c=t[3];return e[0]=a,e[1]=o,e[2]=l,e[3]=c,e[4]=n*c+i*l-s*o,e[5]=i*c+s*a-n*l,e[6]=s*c+n*o-i*a,e[7]=-n*a-i*o-s*l,e}function Za(e,t){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e[4]=t[0]*.5,e[5]=t[1]*.5,e[6]=t[2]*.5,e[7]=0,e}function Qa(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=0,e[5]=0,e[6]=0,e[7]=0,e}function Ka(e,t){var r=We();Ge(r,t);var n=new V(3);return j(n,t),hn(e,r,n),e}function un(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e}function Ja(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e}function eo(e,t,r,n,i,s,a,o,l){return e[0]=t,e[1]=r,e[2]=n,e[3]=i,e[4]=s,e[5]=a,e[6]=o,e[7]=l,e}var to=Dt;function ro(e,t){return e[0]=t[4],e[1]=t[5],e[2]=t[6],e[3]=t[7],e}var no=Dt;function io(e,t){return e[4]=t[0],e[5]=t[1],e[6]=t[2],e[7]=t[3],e}function so(e,t){var r=t[4],n=t[5],i=t[6],s=t[7],a=-t[0],o=-t[1],l=-t[2],c=t[3];return e[0]=(r*c+s*a+n*l-i*o)*2,e[1]=(n*c+s*o+i*a-r*l)*2,e[2]=(i*c+s*l+r*o-n*a)*2,e}function ao(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[0]*.5,l=r[1]*.5,c=r[2]*.5,f=t[4],u=t[5],d=t[6],h=t[7];return e[0]=n,e[1]=i,e[2]=s,e[3]=a,e[4]=a*o+i*c-s*l+f,e[5]=a*l+s*o-n*c+u,e[6]=a*c+n*l-i*o+d,e[7]=-n*o-i*l-s*c+h,e}function oo(e,t,r){var n=-t[0],i=-t[1],s=-t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=o*a+f*n+l*s-c*i,d=l*a+f*i+c*n-o*s,h=c*a+f*s+o*i-l*n,v=f*a-o*n-l*i-c*s;return Ct(e,t,r),n=e[0],i=e[1],s=e[2],a=e[3],e[4]=u*a+v*n+d*s-h*i,e[5]=d*a+v*i+h*n-u*s,e[6]=h*a+v*s+u*i-d*n,e[7]=v*a-u*n-d*i-h*s,e}function lo(e,t,r){var n=-t[0],i=-t[1],s=-t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=o*a+f*n+l*s-c*i,d=l*a+f*i+c*n-o*s,h=c*a+f*s+o*i-l*n,v=f*a-o*n-l*i-c*s;return nn(e,t,r),n=e[0],i=e[1],s=e[2],a=e[3],e[4]=u*a+v*n+d*s-h*i,e[5]=d*a+v*i+h*n-u*s,e[6]=h*a+v*s+u*i-d*n,e[7]=v*a-u*n-d*i-h*s,e}function co(e,t,r){var n=-t[0],i=-t[1],s=-t[2],a=t[3],o=t[4],l=t[5],c=t[6],f=t[7],u=o*a+f*n+l*s-c*i,d=l*a+f*i+c*n-o*s,h=c*a+f*s+o*i-l*n,v=f*a-o*n-l*i-c*s;return sn(e,t,r),n=e[0],i=e[1],s=e[2],a=e[3],e[4]=u*a+v*n+d*s-h*i,e[5]=d*a+v*i+h*n-u*s,e[6]=h*a+v*s+u*i-d*n,e[7]=v*a-u*n-d*i-h*s,e}function fo(e,t,r){var n=r[0],i=r[1],s=r[2],a=r[3],o=t[0],l=t[1],c=t[2],f=t[3];return e[0]=o*a+f*n+l*s-c*i,e[1]=l*a+f*i+c*n-o*s,e[2]=c*a+f*s+o*i-l*n,e[3]=f*a-o*n-l*i-c*s,o=t[4],l=t[5],c=t[6],f=t[7],e[4]=o*a+f*n+l*s-c*i,e[5]=l*a+f*i+c*n-o*s,e[6]=c*a+f*s+o*i-l*n,e[7]=f*a-o*n-l*i-c*s,e}function ho(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[0],l=r[1],c=r[2],f=r[3];return e[0]=n*f+a*o+i*c-s*l,e[1]=i*f+a*l+s*o-n*c,e[2]=s*f+a*c+n*l-i*o,e[3]=a*f-n*o-i*l-s*c,o=r[4],l=r[5],c=r[6],f=r[7],e[4]=n*f+a*o+i*c-s*l,e[5]=i*f+a*l+s*o-n*c,e[6]=s*f+a*c+n*l-i*o,e[7]=a*f-n*o-i*l-s*c,e}function uo(e,t,r,n){if(Math.abs(n)<S)return un(e,t);var i=Math.hypot(r[0],r[1],r[2]);n=n*.5;var s=Math.sin(n),a=s*r[0]/i,o=s*r[1]/i,l=s*r[2]/i,c=Math.cos(n),f=t[0],u=t[1],d=t[2],h=t[3];e[0]=f*c+h*a+u*l-d*o,e[1]=u*c+h*o+d*a-f*l,e[2]=d*c+h*l+f*o-u*a,e[3]=h*c-f*a-u*o-d*l;var v=t[4],g=t[5],m=t[6],_=t[7];return e[4]=v*c+_*a+g*l-m*o,e[5]=g*c+_*o+m*a-v*l,e[6]=m*c+_*l+v*o-g*a,e[7]=_*c-v*a-g*o-m*l,e}function po(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e}function dn(e,t,r){var n=t[0],i=t[1],s=t[2],a=t[3],o=r[4],l=r[5],c=r[6],f=r[7],u=t[4],d=t[5],h=t[6],v=t[7],g=r[0],m=r[1],_=r[2],y=r[3];return e[0]=n*y+a*g+i*_-s*m,e[1]=i*y+a*m+s*g-n*_,e[2]=s*y+a*_+n*m-i*g,e[3]=a*y-n*g-i*m-s*_,e[4]=n*f+a*o+i*c-s*l+u*y+v*g+d*_-h*m,e[5]=i*f+a*l+s*o-n*c+d*y+v*m+h*g-u*_,e[6]=s*f+a*c+n*l-i*o+h*y+v*_+u*m-d*g,e[7]=a*f-n*o-i*l-s*c+v*y-u*g-d*m-h*_,e}var mo=dn;function vo(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e}var pn=Vt;function go(e,t,r,n){var i=1-n;return pn(t,r)<0&&(n=-n),e[0]=t[0]*i+r[0]*n,e[1]=t[1]*i+r[1]*n,e[2]=t[2]*i+r[2]*n,e[3]=t[3]*i+r[3]*n,e[4]=t[4]*i+r[4]*n,e[5]=t[5]*i+r[5]*n,e[6]=t[6]*i+r[6]*n,e[7]=t[7]*i+r[7]*n,e}function _o(e,t){var r=Ke(t);return e[0]=-t[0]/r,e[1]=-t[1]/r,e[2]=-t[2]/r,e[3]=t[3]/r,e[4]=-t[4]/r,e[5]=-t[5]/r,e[6]=-t[6]/r,e[7]=t[7]/r,e}function yo(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=t[7],e}var mn=Lt,xo=mn,Ke=Rt,bo=Ke;function Mo(e,t){var r=Ke(t);if(r>0){r=Math.sqrt(r);var n=t[0]/r,i=t[1]/r,s=t[2]/r,a=t[3]/r,o=t[4],l=t[5],c=t[6],f=t[7],u=n*o+i*l+s*c+a*f;e[0]=n,e[1]=i,e[2]=s,e[3]=a,e[4]=(o-n*u)/r,e[5]=(l-i*u)/r,e[6]=(c-s*u)/r,e[7]=(f-a*u)/r}return e}function wo(e){return"quat2("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+")"}function So(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]}function To(e,t){var r=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=t[0],u=t[1],d=t[2],h=t[3],v=t[4],g=t[5],m=t[6],_=t[7];return Math.abs(r-f)<=S*Math.max(1,Math.abs(r),Math.abs(f))&&Math.abs(n-u)<=S*Math.max(1,Math.abs(n),Math.abs(u))&&Math.abs(i-d)<=S*Math.max(1,Math.abs(i),Math.abs(d))&&Math.abs(s-h)<=S*Math.max(1,Math.abs(s),Math.abs(h))&&Math.abs(a-v)<=S*Math.max(1,Math.abs(a),Math.abs(v))&&Math.abs(o-g)<=S*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(l-m)<=S*Math.max(1,Math.abs(l),Math.abs(m))&&Math.abs(c-_)<=S*Math.max(1,Math.abs(c),Math.abs(_))}var Io=Object.freeze(Object.defineProperty({__proto__:null,create:ja,clone:Ya,fromValues:Wa,fromRotationTranslationValues:Xa,fromRotationTranslation:hn,fromTranslation:Za,fromRotation:Qa,fromMat4:Ka,copy:un,identity:Ja,set:eo,getReal:to,getDual:ro,setReal:no,setDual:io,getTranslation:so,translate:ao,rotateX:oo,rotateY:lo,rotateZ:co,rotateByQuatAppend:fo,rotateByQuatPrepend:ho,rotateAroundAxis:uo,add:po,multiply:dn,mul:mo,scale:vo,dot:pn,lerp:go,invert:_o,conjugate:yo,length:mn,len:xo,squaredLength:Ke,sqrLen:bo,normalize:Mo,str:wo,exactEquals:So,equals:To},Symbol.toStringTag,{value:"Module"}));function vn(){var e=new V(2);return V!=Float32Array&&(e[0]=0,e[1]=0),e}function Ao(e){var t=new V(2);return t[0]=e[0],t[1]=e[1],t}function Co(e,t){var r=new V(2);return r[0]=e,r[1]=t,r}function Do(e,t){return e[0]=t[0],e[1]=t[1],e}function Vo(e,t,r){return e[0]=t,e[1]=r,e}function Lo(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e}function gn(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e}function _n(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e}function yn(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e}function Ro(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e}function Eo(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e}function Oo(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e}function Fo(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e}function Po(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e}function zo(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e}function $o(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e}function xn(e,t){var r=t[0]-e[0],n=t[1]-e[1];return Math.hypot(r,n)}function bn(e,t){var r=t[0]-e[0],n=t[1]-e[1];return r*r+n*n}function Mn(e){var t=e[0],r=e[1];return Math.hypot(t,r)}function wn(e){var t=e[0],r=e[1];return t*t+r*r}function Uo(e,t){return e[0]=-t[0],e[1]=-t[1],e}function Go(e,t){return e[0]=1/t[0],e[1]=1/t[1],e}function Bo(e,t){var r=t[0],n=t[1],i=r*r+n*n;return i>0&&(i=1/Math.sqrt(i)),e[0]=t[0]*i,e[1]=t[1]*i,e}function No(e,t){return e[0]*t[0]+e[1]*t[1]}function Ho(e,t,r){var n=t[0]*r[1]-t[1]*r[0];return e[0]=e[1]=0,e[2]=n,e}function ko(e,t,r,n){var i=t[0],s=t[1];return e[0]=i+n*(r[0]-i),e[1]=s+n*(r[1]-s),e}function qo(e,t){t=t||1;var r=J()*2*Math.PI;return e[0]=Math.cos(r)*t,e[1]=Math.sin(r)*t,e}function jo(e,t,r){var n=t[0],i=t[1];return e[0]=r[0]*n+r[2]*i,e[1]=r[1]*n+r[3]*i,e}function Yo(e,t,r){var n=t[0],i=t[1];return e[0]=r[0]*n+r[2]*i+r[4],e[1]=r[1]*n+r[3]*i+r[5],e}function Wo(e,t,r){var n=t[0],i=t[1];return e[0]=r[0]*n+r[3]*i+r[6],e[1]=r[1]*n+r[4]*i+r[7],e}function Xo(e,t,r){var n=t[0],i=t[1];return e[0]=r[0]*n+r[4]*i+r[12],e[1]=r[1]*n+r[5]*i+r[13],e}function Zo(e,t,r,n){var i=t[0]-r[0],s=t[1]-r[1],a=Math.sin(n),o=Math.cos(n);return e[0]=i*o-s*a+r[0],e[1]=i*a+s*o+r[1],e}function Qo(e,t){var r=e[0],n=e[1],i=t[0],s=t[1],a=Math.sqrt(r*r+n*n)*Math.sqrt(i*i+s*s),o=a&&(r*i+n*s)/a;return Math.acos(Math.min(Math.max(o,-1),1))}function Ko(e){return e[0]=0,e[1]=0,e}function Jo(e){return"vec2("+e[0]+", "+e[1]+")"}function el(e,t){return e[0]===t[0]&&e[1]===t[1]}function tl(e,t){var r=e[0],n=e[1],i=t[0],s=t[1];return Math.abs(r-i)<=S*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(n-s)<=S*Math.max(1,Math.abs(n),Math.abs(s))}var rl=Mn,nl=gn,il=_n,sl=yn,al=xn,ol=bn,ll=wn,cl=function(){var e=vn();return function(t,r,n,i,s,a){var o,l;for(r||(r=2),n||(n=0),i?l=Math.min(i*r+n,t.length):l=t.length,o=n;o<l;o+=r)e[0]=t[o],e[1]=t[o+1],s(e,e,a),t[o]=e[0],t[o+1]=e[1];return t}}(),fl=Object.freeze(Object.defineProperty({__proto__:null,create:vn,clone:Ao,fromValues:Co,copy:Do,set:Vo,add:Lo,subtract:gn,multiply:_n,divide:yn,ceil:Ro,floor:Eo,min:Oo,max:Fo,round:Po,scale:zo,scaleAndAdd:$o,distance:xn,squaredDistance:bn,length:Mn,squaredLength:wn,negate:Uo,inverse:Go,normalize:Bo,dot:No,cross:Ho,lerp:ko,random:qo,transformMat2:jo,transformMat2d:Yo,transformMat3:Wo,transformMat4:Xo,rotate:Zo,angle:Qo,zero:Ko,str:Jo,exactEquals:el,equals:tl,len:rl,sub:nl,mul:il,div:sl,dist:al,sqrDist:ol,sqrLen:ll,forEach:cl},Symbol.toStringTag,{value:"Module"}));const Ve=class{constructor(){p(this,"isHObject",!0);p(this,"name");p(this,"_id");p(this,"_hash");const t=this.constructor.CLASS_NAME;if(typeof t!="string")throw new Error('Class must has a static member "CLASS_NAME" !');Ve.IDS[t]=Ve.IDS[t]||0,this._id=++Ve.IDS[t],this._hash=`${t}_${this._id}`}get id(){return this._id}get hash(){return this._hash}};let U=Ve;p(U,"IDS",{}),p(U,"CLASS_NAME","HObject");class ye extends U{constructor(r,n,i,s="rgba8unorm"){super();p(this,"isCubeTexture",!0);p(this,"_gpuTexture");p(this,"_view");if(this._width=r,this._height=n,this._src=i,this._format=s,i.length<6)throw new Error("CubeTexture must has 6 slice");this._gpuTexture=T.device.createTexture({size:{width:r,height:n,depthOrArrayLayers:6},format:s,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this._view=this._gpuTexture.createView({dimension:"cube"}),i[0]instanceof ImageBitmap?this._loadImg():this._loadBuffer()}static IS(r){return!!r.isCubeTexture}get view(){return this._view}_loadImg(){this._src.forEach((r,n)=>{T.device.queue.copyExternalImageToTexture({source:r},{texture:this._gpuTexture,origin:{x:0,y:0,z:n}},{width:this._width,height:this._height,depthOrArrayLayers:1})})}_loadBuffer(){this._src.forEach((r,n)=>{T.device.queue.writeTexture({texture:this._gpuTexture,origin:{x:0,y:0,z:n}},r,{},{width:this._width,height:this._height,depthOrArrayLayers:1})})}}p(ye,"CLASS_NAME","CubeTexture");function jt(e){return!!e.push}function hl(e){return!!e.push}function fe(e,t,r){const n=performance.now();t(...r),console.log(`Ray Tracing, ${e}: ${(performance.now()-n)/1e3}(s)`)}function tt(e,t,r,n,i){for(let s=0;s<e;s+=1)t[r+s]=n[i+s]}function se(e,t){const r=e.byteLength+(4-e.byteLength%4),n=T.device.createBuffer({size:r,usage:t|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return new e.constructor(n.getMappedRange(0,r)).set(e,0),n.unmap(),n}function Sn(e,t){const r=T.device.createBuffer({size:e,usage:t|GPUBufferUsage.COPY_DST,mappedAtCreation:!0});return r.unmap(),r}const qe=e=>e.split("").reduce((t,r)=>(t=(t<<5)-t+r.charCodeAt(0),t&t),0);function ul(e,t,r=0,n=e.length){for(;r!==n;){for(;t(e[r]);)if(r+=1,r===n)return r;do if(n-=1,r===n)return r;while(!t(e[n]));Tn(e,r,n),r+=1}return r}function dl(e,t,r=0,n=e.length,i=Math.floor((r+n)/2)){for(let s=r;s<=i;s+=1){let a=s,o=e[s];for(let l=s+1;l<n;l+=1)t(o,e[l])||(a=l,o=e[l],Tn(e,s,a))}}function Tn(e,t,r){const n=e[r];e[r]=e[t],e[t]=n}function pl(e){const t=new Float32Array(e.length);for(let r=0;r<e.length;r+=1){const n=e[r];t[r]=-.5*n*n}return t}class ue extends U{constructor(r,n,i,s="rgba8unorm"){super();p(this,"isTexture",!0);p(this,"_bitmap");p(this,"_isArray");p(this,"_arrayCount");p(this,"_gpuTexture");p(this,"_gpuTextureView");this._width=r,this._height=n,this._src=i,this._format=s,jt(i)?(this._isArray=!0,this._arrayCount=i.length):(this._isArray=!1,this._arrayCount=1),this._gpuTexture=T.device.createTexture({label:this.hash,size:{width:this._width,height:this._height,depthOrArrayLayers:this._arrayCount},format:s||"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),jt(i)?(i.forEach((a,o)=>this._load(a,o)),this._gpuTextureView=this._gpuTexture.createView({dimension:"2d-array",arrayLayerCount:this._arrayCount})):(this._load(i),this._gpuTextureView=this._gpuTexture.createView())}get width(){return this._width}get height(){return this._height}get format(){return this._format}get source(){return this._src}get gpuTexture(){return this._gpuTexture}get view(){return this._gpuTextureView}get isArray(){return this._isArray}_load(r,n=0){r instanceof ImageBitmap?this._loadImg(r,n):this._loadBuffer(r,n)}_loadImg(r,n){T.device.queue.copyExternalImageToTexture({source:r},{texture:this._gpuTexture,origin:this._isArray?{x:0,y:0,z:n}:void 0},{width:this._width,height:this._height,depthOrArrayLayers:1})}_loadBuffer(r,n){T.device.queue.writeTexture({texture:this._gpuTexture,origin:this._isArray?{x:0,y:0,z:n}:void 0},r,{bytesPerRow:this._width*4},{width:this._width,height:this._height,depthOrArrayLayers:1})}updateImg(r,n=0){console.warn("Not implemented!")}}p(ue,"CLASS_NAME","Texture");const I={};async function ae(e,t,r){return hl(r)?new ue(e,t,await Promise.all(r.map(async n=>await createImageBitmap(new ImageData(n,e,t))))):new ue(e,t,await createImageBitmap(new ImageData(r,e,t)))}async function ml(){I.empty=await ae(1,1,new Uint8ClampedArray([255,255,255,255])),I.white=await ae(1,1,new Uint8ClampedArray([255,255,255,255])),I.black=await ae(1,1,new Uint8ClampedArray([0,0,0,255])),I.red=await ae(1,1,new Uint8ClampedArray([255,0,0,255])),I.green=await ae(1,1,new Uint8ClampedArray([0,255,0,255])),I.blue=await ae(1,1,new Uint8ClampedArray([0,0,255,255])),I.array1white=await ae(1,1,[new Uint8ClampedArray([255,255,255,255]),new Uint8ClampedArray([255,255,255,255])]),I.cubeWhite=new ye(1,1,new Array(6).fill(new Uint8Array([255,255,255,255]).buffer)),I.cubeBlack=new ye(1,1,new Array(6).fill(new Uint8Array([0,0,0,255]).buffer))}class ne extends U{constructor(r,n,i,s){super();p(this,"isGeometry",!0);p(this,"_vLayouts");p(this,"_vInfo");p(this,"_vBuffers");p(this,"_iBuffer");p(this,"_indexFormat");p(this,"_vertexCount");p(this,"_marcos");p(this,"_attributesDef");this._vertexes=r,this._indexData=n,this.count=i,this._boundingBox=s,this._iBuffer=se(n,GPUBufferUsage.INDEX),this._vBuffers=new Array(r.length),this._vLayouts=new Array(r.length),this._indexFormat=n instanceof Uint16Array?"uint16":"uint32",this._vInfo={},this._marcos={},this._attributesDef=`struct Attrs {
`,r.forEach(({layout:a,data:o,usage:l},c)=>{const f=se(o,GPUBufferUsage.VERTEX|(l|0));a.attributes.forEach(u=>{this._marcos[`USE_${u.name.toUpperCase()}`]=!0,this._attributesDef+=`  @location(${u.shaderLocation}) ${u.name}: ${this._convertFormat(u.format)},
`,this._vInfo[u.name.toLowerCase()]={data:o,index:c,offset:u.offset/4,stride:a.arrayStride/4,length:this._getLength(u.format)}}),this._vBuffers[c]=f,this._vLayouts[c]=a,this._vertexCount=o.byteLength/a.arrayStride}),this._attributesDef+=`};

`}get indexes(){return this._iBuffer}get indexData(){return this._indexData}get vertexes(){return this._vBuffers}get vertexLayouts(){return this._vLayouts}get vertexCount(){return this._vertexCount}get vertexInfo(){return this._vInfo}get attributesDef(){return this._attributesDef}get indexFormat(){return this._indexFormat}get marcos(){return this._marcos}calculateNormals(){const{_vInfo:r,_vertexCount:n,_indexData:i,count:s}=this;if(r.normal)return;const a=r.position,o=new Float32Array(n*3);let l,c;const f=!this._boundingBox;f&&(c=[-1/0,-1/0,-1/0],l=[1/0,1/0,1/0]);const u=new Uint8Array(n);let d,h,v,g;for(let m=0;m<s;m+=1){g=a.offset+i[m]*a.stride,d=a.data.slice(g,g+a.length),g=a.offset+i[m+1]*a.stride,h=a.data.slice(g,g+a.length),g=a.offset+i[m+2]*a.stride,v=a.data.slice(g,g+a.length),f&&(this._calcBonding(c,l,d),this._calcBonding(c,l,h),this._calcBonding(c,l,v)),_e(h,h,d),_e(v,v,d),De(h,h,v);for(let _=0;_<3;_+=1){const y=i[m+_];if(u[y]){const x=new Float32Array(o.buffer,y*3*4,3);Le(x,x,u[y]),Ye(x,x,h),Le(x,x,1/(u[m]+1))}else o.set(h,y*3);u[y]+=1}}r.normal={offset:0,length:3,stride:3,data:o,index:0},f&&(this._boundingBox={start:l,center:c.map((m,_)=>(m+l[_])/2),size:c.map((m,_)=>m-l[_])})}getValues(r){return{cpu:this._vInfo[r].data,gpu:this._vBuffers[this._vInfo[r].index]}}_calcBonding(r,n,i){for(let s=0;s<3;s+=1)r[s]=Math.max(r[s],i[s]),n[s]=Math.min(n[s],i[s])}_convertFormat(r){switch(r){case"float32":return"f32";case"float32x2":return"vec2<f32>";case"float32x3":return"vec3<f32>";case"float32x4":return"vec4<f32>";case"uint32":return"u32";case"uint32x2":return"vec2<u32>";case"uint32x3":return"vec3<u32>";case"uint32x4":return"vec4<u32>"}throw new Error(`Not support format ${r}!`)}_getLength(r){switch(r){case"float32":case"uint32":return 1;case"float32x2":case"uint32x2":return 2;case"float32x3":case"uint32x3":return 3;case"float32x4":case"uint32x4":return 4}throw new Error(`Not support format ${r}!`)}updateVertexes(){console.warn("Not implemented!")}updateIndexes(){console.warn("Not implemented!")}}p(ne,"CLASS_NAME","Geometry");const he={};function vl(){he.skybox=new ne([{layout:{arrayStride:8,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x2"}]},data:new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1])}],new Uint16Array([0,1,2,3,4,5]),6),he.rectLight=new ne([{layout:{arrayStride:12,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0])}],new Uint16Array([0,1,2,2,3,0]),6);const e=gl(512);he.discLight=new ne([{layout:{arrayStride:12,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:e.vertexes}],e.indexes,e.indexes.length)}function gl(e){const t=Math.PI*2/e,r=new Float32Array((1+e)*3),n=new Uint16Array(e*3);r.set([0,0,0]);let i=0;for(let s=0;s<e;s+=1)r[(s+1)*3]=Math.cos(i),r[(s+1)*3+1]=Math.sin(i),r[(s+1)*3+2]=0,n[s*3]=0,n[s*3+1]=s+2,n[s*3+2]=s+1,i+=t;return{vertexes:r,indexes:n}}class re extends U{constructor(r){super();p(this,"isRenderTexture",!0);p(this,"_width");p(this,"_height");p(this,"_forCompute");p(this,"_colorDescs");p(this,"_depthDesc");p(this,"_colors");p(this,"_colorViews");p(this,"_colorFormats");p(this,"_depthStencil");p(this,"_depthStencilView");p(this,"_pipelineHash");p(this,"_colorNames");this._options=r;const{width:n,height:i,colors:s,depthStencil:a,forCompute:o}=r;if(this._width=n,this._height=i,o&&a)throw new Error("RenderTexture with forCompute flag does not support depth!");this._colorDescs=new Array(s.length),this._colorViews=new Array(s.length),this._colorFormats=new Array(s.length),this._colorNames={},this._colors=s.map((l,c)=>{const f=T.device.createTexture(this._colorDescs[c]={label:this.hash+"_color_"+(l.name||c),size:{width:n,height:i},format:l.format||(o?"rgba8unorm":T.swapChainFormat),usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|(o?GPUTextureUsage.STORAGE_BINDING:0)});return this._colorViews[c]=f.createView({label:f.label}),this._colorFormats[c]=this._colorDescs[c].format,l.name&&(this._colorNames[l.name]=c),f}),a&&(this._depthStencil=T.device.createTexture(this._depthDesc={label:this.hash+"_depth",size:{width:n,height:i},format:a.format||(a.needStencil?"depth24plus-stencil8":"depth24plus"),usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this._depthStencilView=this._depthStencil.createView({label:this.hash+"_depth"})),this._pipelineHash=qe(this._colorDescs.map(l=>l.format).join("")+(this._depthDesc?this._depthDesc.format:""))}static IS(r){return!!r.isRenderTexture}get width(){return this._width}get height(){return this._height}get pipelineHash(){return this._pipelineHash}get colorView(){return this._colorViews[0]}get depthStencilView(){return this._depthStencilView}get colorFormat(){return this._colorDescs[0].format}get depthStencilFormat(){var r;return(r=this._depthDesc)==null?void 0:r.format}get colorViews(){return this._colorViews}get colorFormats(){return this._colorFormats}getColorViewByName(r){return this._colorViews[this._colorNames[r]]}}p(re,"CLASS_NAME","RenderTexture");var Xe=(e=>(e[e.Global=0]="Global",e[e.Material=1]="Material",e[e.Mesh=2]="Mesh",e))(Xe||{});class Re extends U{constructor(r,n,i){super();p(this,"isUBTemplate",!0);p(this,"_shaderPrefix");p(this,"_uniformLayoutDesc");p(this,"_uniformLayout");p(this,"_uniformBindDesc");p(this,"_uniformsBufferDefault");p(this,"_uniformsInfo");this._uniformDesc=r,this._groupId=n,this._visibility=i;const{device:s}=T,a=i===void 0?GPUShaderStage.COMPUTE|GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT:i,o=n===0?"UniformsGlobal":n===2?"UniformsObject":"UniformsMaterial",l=n===0?"global":n===2?"mesh":"material";let c=0,f=0;this._shaderPrefix="",this._uniformsInfo={};const u=[];if(r.uniforms.length){r.uniforms.forEach(h=>{h.customType&&(this._shaderPrefix+=h.customType.code+`
`)}),this._shaderPrefix+=`struct ${o} {
`,u.push({binding:0,visibility:a,buffer:{type:"uniform"}});let d=0;r.uniforms.forEach(h=>{const{origLen:v,realLen:g,defaultValue:m}=this._getRealLayoutInfo(h.type,h.size||1,h.defaultValue,h.customType);this._uniformsInfo[h.name]={bindingId:0,index:c,type:"buffer",offset:d,defaultValue:m,origLen:v,realLen:g,size:h.size||1},d+=m.length;const _=h.customType?h.customType.name:h.type==="number"?`${h.format||"f32"}`:`${h.type}<${h.format||"f32"}>`,y=v!==g?`@stride(${g*4})`:"";h.size?h.size>1&&(this._shaderPrefix+=` @align(16) ${h.name}: ${y} array<${_}, ${h.size}>,
`):this._shaderPrefix+=`  @align(16) ${h.name}: ${_},
`,c+=1}),this._uniformsBufferDefault=new Uint32Array(d),this._shaderPrefix+=`};
@group(${n}) @binding(0) var<uniform> ${l}: ${o};
`,f+=1}if(r.textures&&r.textures.forEach(d=>{const h=ye.IS(d.defaultValue),v=d.defaultValue.isArray,g=h?v?"cube-array":"cube":v?"2d-array":"2d";d.storageAccess==="read-only"&&(d.storageAccess=void 0,d.format=/uint/.test(d.storageFormat)?"uint":/sint/.test(d.storageFormat)?"sint":"float"),u.push({binding:f,visibility:a,texture:d.storageAccess?void 0:{sampleType:d.format||"float",viewDimension:g},storageTexture:d.storageAccess==="write-only"?Object.assign({format:d.storageFormat||"rgba8unorm",viewDimension:g,access:d.storageAccess}):void 0}),this._uniformsInfo[d.name]={bindingId:f,index:c,type:"texture",defaultGpuValue:d.defaultValue.view};let m=d.format==="depth"?"depth":d.format==="uint"?"u32":d.format==="sint"?"i32":"f32";d.storageAccess?this._shaderPrefix+=`@group(${n}) @binding(${f}) var ${d.name}: texture_storage_2d<${d.storageFormat||"rgba8unorm"}, ${d.storageAccess.replace("-only","")}>;
`:h?this._shaderPrefix+=`@group(${n}) @binding(${f}) var ${d.name}: texture_cube<${m}>;
`:d.defaultValue.isArray?this._shaderPrefix+=`@group(${n}) @binding(${f}) var ${d.name}: texture_2d_array<${m}>;
`:this._shaderPrefix+=`@group(${n}) @binding(${f}) var ${d.name}: texture_2d<${m}>;
`,f+=1,c+=1}),r.samplers&&r.samplers.forEach(d=>{u.push({binding:f,visibility:a,sampler:{type:"filtering"}}),this._uniformsInfo[d.name]={bindingId:f,index:c,type:"sampler",defaultGpuValue:s.createSampler(d.defaultValue)},this._shaderPrefix+=`@group(${n}) @binding(${f}) var ${d.name}: sampler;
`,f+=1,c+=1}),this._shaderPrefix+=`
`,r.uniforms.forEach((d,h)=>{const v=this._uniformsInfo[d.name];this._uniformsBufferDefault.set(new Uint32Array(v.defaultValue.buffer),v.offset)}),r.storages){const d={};r.storages.forEach(h=>{u.push({binding:f,visibility:a,buffer:{type:h.writable?"storage":"read-only-storage"}});let v=`Storage${h.type}${h.format||"f32"}`;!h.customStruct&&!d[v]&&(this._shaderPrefix+=(d[v]=d[v]||this._getStorageStruct(v,h.type,h.format||"f32"))+`
`),h.customStruct&&(v=h.customStruct.name,this._shaderPrefix+=h.customStruct.code);const g=h.gpuValue?h.gpuValue:se(h.defaultValue,GPUBufferUsage.STORAGE);this._uniformsInfo[h.name]={bindingId:f,index:c,type:"storage",defaultValue:h.defaultValue,defaultGpuValue:g},this._shaderPrefix+=`@group(${n}) @binding(${f}) var<storage, ${h.writable?"read_write":"read"}> ${h.name}: ${v};
`,c+=1,f+=1})}this._uniformLayoutDesc={entries:u},this._uniformLayout=s.createBindGroupLayout(this._uniformLayoutDesc)}get groupId(){return this._groupId}get shaderPrefix(){return this._shaderPrefix}get uniformLayout(){return this._uniformLayout}get uniformsInfo(){return this._uniformsInfo}_getRealLayoutInfo(r,n,i,s){if(s)return{origLen:s.len,realLen:s.len,defaultValue:i};let a,o;switch(r){case"number":a=1,o=4;break;case"vec2":a=2,o=4;break;case"vec3":a=3,o=4;break;case"vec4":case"mat2x2":a=4,o=4;break;case"mat3x3":a=9,o=12;break;case"mat4x4":a=16,o=16;break}const l=i.constructor,c=new l(o*n);for(let f=0;f<n;f+=1)c.set(i.slice(f*a,(f+1)*a),f*o);return{origLen:a,realLen:o,defaultValue:c}}_getStorageStruct(r,n,i){if(n==="number")return`struct ${r} { value: array<${i}>; };`;if(n==="vec2"||n==="vec3"||n==="vec4")return`struct ${r} { value: array<${n}<${i}>>, };`;throw new Error("Not support type!")}createUniformBlock(){const{_uniformDesc:r,_uniformsInfo:n,_uniformsBufferDefault:i}=this,s={},a=[];let o,l;return i&&(l=se(i,GPUBufferUsage.UNIFORM),o=i.slice(),a.push({binding:0,resource:{buffer:l}}),r.uniforms.forEach(c=>{const f=this._uniformsInfo[c.name];s[c.name]={value:new this._uniformsInfo[c.name].defaultValue.constructor(o.buffer,f.offset*4,f.realLen*f.size),gpuValue:l}})),r.textures&&r.textures.forEach(c=>{const f=n[c.name].defaultGpuValue;s[c.name]={value:c.defaultValue,gpuValue:f},a.push({binding:n[c.name].bindingId,resource:f})}),r.samplers&&r.samplers.forEach(c=>{const f=n[c.name].defaultGpuValue;s[c.name]={value:c.defaultValue,gpuValue:f},a.push({binding:n[c.name].bindingId,resource:f})}),r.storages&&r.storages.forEach(c=>{const f=n[c.name].defaultGpuValue;s[c.name]={value:c.defaultValue,gpuValue:f},a.push({binding:n[c.name].bindingId,resource:{buffer:f}})}),{entries:a,values:s,layout:this._uniformLayout,cpuBuffer:o,gpuBuffer:l,isBufferDirty:!1,isDirty:!0}}setUniform(r,n,i,s){const a=this._uniformsInfo[n];if(!a||i===void 0)return;const{entries:o}=r,{bindingId:l,type:c,offset:f,realLen:u,origLen:d}=a,h=r.values[n];if(c==="buffer"){i=i;const v=h.value;if(i=typeof i=="number"?[i]:i,d!==u){const g=i.length/d;for(let m=0;m<g;m+=1)v.set(i.slice(d*m,d*(m+1)),u*m)}else v.set(i);r.isBufferDirty=!0}else if(c==="sampler")h.value=i,console.warn("Not implemented!");else if(c==="storage")h.value=i,o[l].resource.buffer=h.gpuValue=s||se(i,GPUBufferUsage.STORAGE),r.isDirty=!0;else if(re.IS(i)){const v=s?i.getColorViewByName(s):i.colorView;o[l].resource=h.gpuValue=v,h.value=i,r.isDirty=!0;return}else{if(i=i,i.isArray!==h.value.isArray)throw new Error("Require texture2d array!");o[l].resource=h.gpuValue=i.view,h.value=i,r.isDirty=!0;return}}getUniform(r,n){var i;return(i=r.values[n])==null?void 0:i.value}getBindingGroup(r,n){return r.isBufferDirty&&(T.device.queue.writeBuffer(r.gpuBuffer,0,r.cpuBuffer),r.isBufferDirty=!1),r.isDirty&&(n=T.device.createBindGroup({layout:r.layout,entries:r.entries}),r.isDirty=!1),n}}p(Re,"CLASS_NAME","UBTemplate");const _l={cullMode:"back",primitiveType:"triangle-list",depthCompare:"less-equal"};function yl(e){return!!e.cs}class H extends U{constructor(r,n){super();p(this,"isEffect",!0);p(this,"_marcos");p(this,"_renderStates");p(this,"_marcosRegex");p(this,"_vs");p(this,"_fs");p(this,"_cs");p(this,"_shaders",{});p(this,"_ubTemplate");this._options=n,this.name=r;const i=n,s=i.cs?GPUShaderStage.COMPUTE:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT;this._ubTemplate=new Re(i.uniformDesc,Xe.Material,s),this._renderStates=Object.assign({},_l,i.renderState||{}),this._marcos=i.marcos||{},this._marcosRegex={};for(const a in this._marcos)typeof this._marcos[a]=="number"?this._marcosRegex[a]=new RegExp(`\\$\\{${a}\\}`,"g"):this._marcosRegex[a]={hasElse:new RegExp(`#if *defined\\(${a}\\)([\\s\\S]+?)#else([\\s\\S]+?)#endif`,"g"),noElse:new RegExp(`#if *defined\\(${a}\\)([\\s\\S]+?)#endif`,"g")};yl(i)?this._cs=i.cs:(this._vs=i.vs,this._fs=i.fs)}get ubTemplate(){return this._ubTemplate}get uniformLayout(){return this._ubTemplate.uniformLayout}get renderStates(){return this._renderStates}get isCompute(){return!!this._cs}createDefaultUniformBlock(){return this._ubTemplate.createUniformBlock()}getShader(r,n,i,s){r=Object.assign({},this._marcos,r);const{device:a}=T,o=this._calcHash(n,i,s,r),l=this._shaders[o];if(l)return l;const c=[this._vs,this._fs,this._cs];for(const g in this._marcos){const m=r[g],_=this._marcosRegex[g];c.forEach((y,x)=>{if(!!y)if(typeof m=="number")c[x]=y.replace(_,`${m}`);else{const{hasElse:M,noElse:w}=_;M.lastIndex=0,w.lastIndex=0,c[x]=y.replace(M,m?"$1":"$2"),c[x]=c[x].replace(w,m?"$1":"")}})}const f=i+`
`+s+`
`+this._ubTemplate.shaderPrefix,[u,d,h]=c;return this._shaders[o]={vs:u&&a.createShaderModule({code:n+f+u}),fs:d&&a.createShaderModule({code:f+d}),cs:h&&a.createShaderModule({code:f+h})}}_calcHash(r,n,i,s){let a=qe(r);a=(a<<5)-a+qe(n),a=(a<<5)-a+qe(i);for(const o in this._marcos){const l=s[o],c=typeof l=="number"?l:l?1:0;a=(a<<5)-a+c}return a}}p(H,"CLASS_NAME","Effect");var xl=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@stage(fragment)
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  var color: vec4<f32> = material.u_color;

  #if defined(USE_COLOR_0)
    color = color * vec4<f32>(vo.color_0, 1.);
  #endif

  return color;
}`,Ne=`struct VertexOutput {
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
}`,bl=`struct VertexOutput {
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
}`,Ml=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) cubeUV: vec3<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let tex: vec4<f32> = textureSample(u_cubeTexture, u_sampler, vo.cubeUV);
  return vec4<f32>(tex.rgb * material.u_color.rgb * material.u_exposure * material.u_factor, tex.a);
}`,Yt=`struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@stage(fragment)
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  return material.u_baseColorFactor * textureSample(u_baseColorTexture, u_sampler, vo.texcoord_0);
}`,wl=`const c_radius: i32 = \${RADIUS};
const c_windowSize: i32 = \${WINDOW_SIZE};

@compute @workgroup_size(c_windowSize, c_windowSize, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_input, 0);
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
}`,Sl=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  return textureSample(u_texture, u_sampler, vo.uv);
}`,rt=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

var<private> pos: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
  vec2<f32>(-1.0, -1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(-1.0, 1.0),
  vec2<f32>(1.0, -1.0),
  vec2<f32>(1.0, 1.0)
);
var<private> uv: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
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
}`,Tl=`struct VertexOutput {
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
}`,Il=`const WINDOW_SIZE: i32 = \${WINDOW_SIZE};

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

  var std: f32 = 0.;
  for (var r: i32 = 0; r < localUV.x; r = r + 1) {
    for (var c: i32 = 0; c < localUV.y; c = c + 1) {
      let lum: f32 = lums[r][c];
      std = std + (lum - meanLum) * (lum - meanLum);
    }
  }
  std = sqrt(std / (count - 1.));

  let largestLum: f32 = max(meanLum + std * 2., 1.);

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
  let size: vec2<i32> = textureDimensions(u_preFilter);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  if (baseIndex.x >= size.x || baseIndex.y >= size.y) {
    return;
  }

  let result: vec4<f32> = blur(baseIndex, size);

  textureStore(u_output, baseIndex, result);
}`,Al=`@compute @workgroup_size(16, 16, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_current);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  let pre: vec4<f32> = textureLoad(u_pre, baseIndex, 0);
  let current: vec4<f32> = textureLoad(u_current, baseIndex, 0);
  let mixed: vec4<f32> = vec4<f32>(mix(current.rgb, pre.rgb, vec3<f32>(material.u_preWeight)), current.a);

  textureStore(u_output, baseIndex, mixed);
}`,Cl=`struct VertexOutput {
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

  if (textureId == -1) {
    return normal;
  }

  
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
}`,Dl=`struct VertexOutput {
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
}`,Vl=`struct VertexOutput {
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
}`,Ll=`struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let uv: vec2<f32> = vo.uv;

  if (uv.x < .33) {
    return vec4<f32>(textureSample(u_gbPositionMetalOrSpec, u_sampler, uv).rgb, 1.);
  }
  
  if (uv.x < .66) {
    return vec4<f32>(textureSample(u_gbBaseColorRoughOrGloss, u_sampler, uv).rgb, 1.);
  }
  
  return vec4<f32>(textureSample(u_gbNormalGlass, u_sampler, uv).rgb, 1.);
}`,Rl=`const PI: f32 = 3.14159265358979;
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
  let screenSize: vec2<i32> = textureDimensions(u_gbPositionMetalOrSpec, 0);
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
}`;const E={},Te={USE_TEXCOORD_0:!1,USE_NORMAL:!1,USE_TANGENT:!1,USE_COLOR_0:!1,USE_TEXCOORD_1:!1};function El(){const e={value:new Float32Array(4),gpuValue:se(new Float32Array(4),GPUBufferUsage.STORAGE)};E.rColor=new H("rColor",{vs:Ne,fs:xl,uniformDesc:{uniforms:[{name:"u_color",type:"vec4",defaultValue:new Float32Array([1,0,0,1])}]},marcos:Te}),E.rUnlit=new H("rUnlit",{vs:Ne,fs:Yt,uniformDesc:{uniforms:[{name:"u_baseColorFactor",type:"vec4",defaultValue:new Float32Array([1,1,1,1])}],textures:[{name:"u_baseColorTexture",defaultValue:I.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:Te}),E.rPBR=new H("rPBR",{vs:Ne,fs:Yt,uniformDesc:{uniforms:[{name:"u_baseColorFactor",type:"vec4",defaultValue:new Float32Array([1,1,1,1])},{name:"u_normalTextureScale",type:"number",defaultValue:new Float32Array([1])},{name:"u_metallicFactor",type:"number",defaultValue:new Float32Array([1])},{name:"u_roughnessFactor",type:"number",defaultValue:new Float32Array([1])},{name:"u_specularFactor",type:"vec3",defaultValue:new Float32Array([3])},{name:"u_glossinessFactor",type:"number",defaultValue:new Float32Array([1])}],textures:[{name:"u_baseColorTexture",defaultValue:I.empty},{name:"u_normalTexture",defaultValue:I.empty},{name:"u_metallicRoughnessTexture",defaultValue:I.empty},{name:"u_specularGlossinessTexture",defaultValue:I.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:Object.assign({},Te,{USE_SPEC_GLOSS:!1,USE_GLASS:!1})}),E.rSkybox=new H("rSkybox",{vs:bl,fs:Ml,uniformDesc:{uniforms:[{name:"u_color",type:"vec4",defaultValue:N(new Float32Array(4))},{name:"u_factor",type:"number",defaultValue:new Float32Array(1)},{name:"u_rotation",type:"number",defaultValue:new Float32Array(1)},{name:"u_exposure",type:"number",defaultValue:new Float32Array(1)}],textures:[{name:"u_cubeTexture",defaultValue:I.cubeWhite}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]}}),E.rRTGBuffer=new H("rRTGBuffer",{vs:Dl,fs:Cl,uniformDesc:{uniforms:[{name:"u_matId2TexturesId",type:"vec4",format:"i32",size:128,defaultValue:new Int32Array(2*128)},{name:"u_baseColorFactors",type:"vec4",size:128,defaultValue:new Float32Array(4*128)},{name:"u_metallicRoughnessFactorNormalScaleMaterialTypes",type:"vec4",size:128,defaultValue:new Float32Array(128)},{name:"u_specularGlossinessFactors",type:"vec4",size:128,defaultValue:new Float32Array(128)}],textures:[{name:"u_baseColorTextures",defaultValue:I.array1white},{name:"u_normalTextures",defaultValue:I.array1white},{name:"u_metalRoughOrSpecGlossTextures",defaultValue:I.array1white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:Te}),E.rRTGBufferLight=new H("rRTGBufferLight",{vs:Ne,fs:Vl,uniformDesc:{uniforms:[{name:"u_lightColor",type:"vec4",defaultValue:new Float32Array(4)}],textures:[],samplers:[]},marcos:Te}),E.cRTSS=new H("cRTSS",{cs:Rl,uniformDesc:{uniforms:[{name:"u_randoms",type:"vec4",size:4,defaultValue:new Float32Array(16)},{name:"u_matId2TexturesId",type:"vec4",format:"i32",size:128,defaultValue:new Int32Array(2*128)},{name:"u_baseColorFactors",type:"vec4",size:128,defaultValue:new Float32Array(4*128)},{name:"u_metallicRoughnessFactorNormalScaleMaterialTypes",type:"vec4",size:128,defaultValue:new Float32Array(128)},{name:"u_specularGlossinessFactors",type:"vec4",size:128,defaultValue:new Float32Array(128)}],storages:[{name:"u_positions",type:"vec3",defaultValue:e.value,gpuValue:e.gpuValue},{name:"u_normals",type:"vec3",defaultValue:e.value,gpuValue:e.gpuValue},{name:"u_uvs",type:"vec2",defaultValue:e.value,gpuValue:e.gpuValue},{name:"u_meshMatIndexes",type:"vec2",format:"u32",defaultValue:e.value,gpuValue:e.gpuValue},{name:"u_bvh",type:"vec4",defaultValue:e.value,gpuValue:e.gpuValue},{name:"u_debugInfo",type:"number",customStruct:{name:"DebugInfo",code:`
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
}`},writable:!0,defaultValue:e.value,gpuValue:e.gpuValue}],textures:[{name:"u_output",defaultValue:I.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_noise",defaultValue:I.empty},{name:"u_gbPositionMetalOrSpec",defaultValue:I.empty},{name:"u_gbBaseColorRoughOrGloss",defaultValue:I.empty},{name:"u_gbNormalGlass",defaultValue:I.empty},{name:"u_gbMeshIndexMatIndexMatType",format:"uint",defaultValue:I.empty},{name:"u_baseColorTextures",defaultValue:I.array1white},{name:"u_normalTextures",defaultValue:I.array1white},{name:"u_metalRoughOrSpecGlossTextures",defaultValue:I.array1white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}},{name:"u_samplerGB",defaultValue:{magFilter:"nearest",minFilter:"nearest"}}]},marcos:{BVH_DEPTH:0}}),E.cRTDenoiseTempor=new H("cRTDenoiseTempor",{cs:Al,uniformDesc:{uniforms:[{name:"u_preWeight",type:"number",format:"f32",defaultValue:new Float32Array([1])}],textures:[{name:"u_output",defaultValue:I.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_pre",defaultValue:I.empty,storageFormat:"rgba16float"},{name:"u_current",defaultValue:I.empty,storageFormat:"rgba16float"}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]}}),E.cRTDenoiseSpace=new H("cRTDenoiseSpace",{cs:Il,uniformDesc:{uniforms:[{name:"u_filterFactors",type:"vec4",defaultValue:pl(new Float32Array([3,.1,2,.1]))}],textures:[{name:"u_output",defaultValue:I.empty,storageAccess:"write-only",storageFormat:"rgba16float"},{name:"u_preFilter",defaultValue:I.empty,storageFormat:"rgba16float"},{name:"u_gbPositionMetalOrSpec",defaultValue:I.empty},{name:"u_gbNormalGlass",defaultValue:I.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear",mipmapFilter:"nearest"}}]},marcos:{WINDOW_SIZE:7}}),E.iRTGShow=new H("iRTGShow",{vs:rt,fs:Ll,uniformDesc:{uniforms:[],textures:[{name:"u_gbPositionMetalOrSpec",defaultValue:I.empty},{name:"u_gbBaseColorRoughOrGloss",defaultValue:I.empty},{name:"u_gbNormalGlass",defaultValue:I.empty},{name:"u_gbMeshIndexMatIndexMatType",format:"uint",defaultValue:I.empty}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),E.iBlit=new H("iBlit",{vs:rt,fs:Sl,uniformDesc:{uniforms:[],textures:[{name:"u_texture",defaultValue:I.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),E.iTone=new H("iTone",{vs:rt,fs:Tl,uniformDesc:{uniforms:[],textures:[{name:"u_texture",defaultValue:I.white}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{FLIP:!1}}),E.cCreateSimpleBlur=t=>{const r=Math.pow(t*2+1,2),n=r%4,i=r+(4-n);return new H("cSimpleBlur-"+t,{cs:wl,uniformDesc:{uniforms:[{name:"u_kernel",type:"vec4",size:i/4,defaultValue:new Float32Array(i).fill(1)}],textures:[{name:"u_input",defaultValue:I.white},{name:"u_output",defaultValue:I.white,storageAccess:"write-only"}],samplers:[{name:"u_sampler",defaultValue:{magFilter:"linear",minFilter:"linear"}}]},marcos:{RADIUS:t,WINDOW_SIZE:t*2+1,TILE_SIZE:t*4+1}})}}const Ee={};function Ol(){Ee.global=new Re({uniforms:[{name:"u_vp",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_view",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_proj",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_viewInverse",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_projInverse",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_skyVP",type:"mat4x4",defaultValue:N(new Float32Array(16))},{name:"u_gameTime",type:"number",defaultValue:new Float32Array([0])},{name:"u_envColor",type:"vec4",defaultValue:new Float32Array([0,0,0,0])},{name:"u_lightInfos",customType:{name:"LightInfo",len:40,code:`
struct LightInfo {
  lightType: u32,
  areaMode: u32,
  areaSize: vec2<f32>,
  color: vec4<f32>,
  worldTransform: mat4x4<f32>,
  worldTransformInverse: mat4x4<f32>,
}`},type:"vec4",size:4,defaultValue:new Float32Array(40*4)}],textures:[{name:"u_envTexture",defaultValue:I.cubeBlack}]},Xe.Global),Ee.staticMesh=new Re({uniforms:[{name:"u_world",type:"mat4x4",defaultValue:N(new Float32Array(16))}]},Xe.Mesh)}async function Fl(){await ml(),Ol(),vl(),El()}class Oe extends U{constructor(r){super();p(this,"isImageMesh",!0);p(this,"_pipeline");this._material=r}get material(){return this._material}set material(r){this._material=r,this._pipeline=null}render(r){const{_material:n}=this;!this._pipeline&&this._createPipeline(),r.setBindGroup(1,n.bindingGroup),r.setPipeline(this._pipeline),r.draw(6,1,0,0)}_createPipeline(){const{device:r,swapChainFormat:n}=T,{_material:i}=this,{vs:s,fs:a}=i.effect.getShader(i.marcos,"",T.shaderPrefix,"");this._pipeline=r.createRenderPipeline({layout:r.createPipelineLayout({bindGroupLayouts:[T.uniformLayout,i.effect.uniformLayout]}),vertex:{module:s,entryPoint:"main"},fragment:{module:a,targets:[{format:n}],entryPoint:"main"},primitive:{topology:"triangle-list"}})}}p(Oe,"CLASS_NAME","ImageMesh");const Pl=new Float32Array([1,1,1]);class ee extends U{constructor(){super();p(this,"isNode",!0);p(this,"active",!0);p(this,"_mem");p(this,"_pos");p(this,"_scale");p(this,"_quat");p(this,"_worldMat");p(this,"_parent");p(this,"_children",[]);this._mem=new ArrayBuffer((3+3+4+16)*4*4),this._pos=new Float32Array(this._mem,0,3),(this._scale=new Float32Array(this._mem,3*4,3)).set(Pl),this._quat=rn(new Float32Array(this._mem,6*4,4)),this._worldMat=N(new Float32Array(this._mem,10*4,16))}get pos(){return this._pos}get scale(){return this._scale}get quat(){return this._quat}get worldMat(){return this._worldMat}addChild(r){this._children.push(r),r._parent=this}removeChild(r){const n=this._children.indexOf(r);n>=0&&(this._children.splice(n,1),r._parent=null)}setLocalMat(r){this._updateTRSFromMat(r)}updateMatrix(){this.updateWorldMatrix()}updateWorldMatrix(r){Tr(this._worldMat,this._quat,this._pos,this._scale),r=r||this._parent,r&&Vr(this._worldMat,r.worldMat,this._worldMat)}dfs(r,n){const i=r(this,n),s=this._children;for(let a=0;a<s.length;a+=1){const o=s[a];o.active&&o.dfs(r,i)}}updateSubTree(r){!this.active||this.dfs(n=>{n.updateMatrix(),r&&r(n)})}_updateTRSFromMat(r){j(this._pos,r),Ge(this._quat,r),gt(this._scale,r)}}p(ee,"CLASS_NAME","Node");const Nt=class extends ee{constructor(r,n){super();p(this,"isMesh",!0);p(this,"sortZ",0);p(this,"_pipelines",{});p(this,"_matVersion",-1);p(this,"_ubTemplate");p(this,"_uniformBlock");p(this,"_bindingGroup");this._geometry=r,this._material=n,this._ubTemplate=Ee.staticMesh,this._uniformBlock=this._ubTemplate.createUniformBlock()}static IS(r){return!!r.isMesh}get geometry(){return this._geometry}get material(){return this._material}set material(r){this._material=r,this._pipelines={}}clone(){const r=new Nt(this._geometry,this._material);return r.pos.set(this.pos),r.quat.set(this.quat),r.scale.set(this.scale),r}render(r,n){const{_geometry:i,_material:s}=this;(s.version!==this._matVersion||!this._pipelines[n.pipelineHash])&&(this._createPipeline(n),this._matVersion=s.version),this.setUniform("u_world",this._worldMat),this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),i.vertexes.forEach((a,o)=>{r.setVertexBuffer(o,a)}),r.setIndexBuffer(i.indexes,i.indexFormat),r.setBindGroup(1,s.bindingGroup),r.setBindGroup(2,this._bindingGroup),r.setPipeline(this._pipelines[n.pipelineHash]),r.drawIndexed(i.count,1,0,0,0)}setUniform(r,n,i){this._ubTemplate.setUniform(this._uniformBlock,r,n,i)}getUniform(r){return this._ubTemplate.getUniform(this._uniformBlock,r)}_createPipeline(r){const{device:n}=T,{_geometry:i,_material:s,_ubTemplate:a}=this;this._bindingGroup=this._ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup);const o=Object.assign({},i.marcos,s.marcos),{vs:l,fs:c}=s.effect.getShader(o,i.attributesDef,T.shaderPrefix,a.shaderPrefix);this._pipelines[r.pipelineHash]=n.createRenderPipeline({layout:n.createPipelineLayout({bindGroupLayouts:[T.uniformLayout,s.effect.uniformLayout,a.uniformLayout]}),vertex:{module:l,entryPoint:"main",buffers:i.vertexLayouts},fragment:{module:c,targets:r.colorFormats.map(f=>({format:f,blend:s.blendColor?{color:s.blendColor,alpha:s.blendAlpha}:void 0})),entryPoint:"main"},primitive:{topology:s.primitiveType,cullMode:s.cullMode},depthStencil:r.depthStencilFormat&&{format:r.depthStencilFormat,depthWriteEnabled:!0,depthCompare:s.depthCompare}})}};let Z=Nt;p(Z,"CLASS_NAME","Mesh");var dt=(e=>(e[e.INVALID=0]="INVALID",e[e.Area=1]="Area",e[e.Directional=2]="Directional",e[e.Point=3]="Point",e[e.Spot=4]="Spot",e))(dt||{}),pt=(e=>(e[e.Rect=0]="Rect",e[e.Disc=1]="Disc",e))(pt||{});class Je extends ee{constructor(r,n,i){super();p(this,"isLight",!0);p(this,"_areaMode");p(this,"_areaSize");p(this,"_color");p(this,"_worldPos",new Float32Array(3));p(this,"_worldDir",new Float32Array(3));p(this,"_ubInfo");p(this,"_mesh");this._type=r,this._color=new Float32Array(n),this._ubInfo=new Float32Array(40);const s=new Uint32Array(this._ubInfo.buffer);s[0]=r,r===1&&(this._areaMode=i.mode,this._areaSize=new Float32Array(i.size),s[1]=this._areaMode,this._ubInfo.set(this._areaSize,2))}static IS(r){return!!r.isLight}get ubInfo(){return this._ubInfo}setColor(r,n,i){this._color.set(new Float32Array([r,n,i]))}requireLightMesh(r){if(this._type!==1)throw new Error("Light mesh only support area!");return this._mesh||(this._mesh=new Z(this._areaMode===0?he.rectLight:he.discLight,r)),this._mesh}updateMatrix(){super.updateMatrix(),j(this._worldPos,this._worldMat),Mt(this._worldDir,[0,0,1],this._worldMat),this._mesh&&(this._mesh.scale.set(this._areaMode===1?[this._areaSize[0],this._areaSize[0],0]:[this._areaSize[0],this._areaSize[1],0]),this._mesh.updateWorldMatrix(this),this._mesh.material.setUniform("u_lightColor",this._color)),this._ubInfo.set(this._color,4),this._ubInfo.set(this._worldMat,8),this._ubInfo.set(Ce(new Float32Array(16),this._worldMat),24)}}p(Je,"CLASS_NAME","Light");class Y extends U{constructor(r,n,i,s){super();p(this,"isMaterial",!0);p(this,"_version",0);p(this,"_isBufferDirty",!1);p(this,"_isDirty",!0);p(this,"_uniformBlock");p(this,"_bindingGroup");p(this,"_marcos");p(this,"_renderStates");this._effect=r,this._uniformBlock=r.createDefaultUniformBlock(),n&&Object.keys(n).forEach(a=>this.setUniform(a,n[a])),this._marcos=i||{},this._renderStates=s||{}}get effect(){return this._effect}get marcos(){return this._marcos}get version(){return this._version}get bindingGroup(){return this._bindingGroup=this._effect.ubTemplate.getBindingGroup(this._uniformBlock,this._bindingGroup),this._bindingGroup}get primitiveType(){return this._renderStates.primitiveType||this._effect.renderStates.primitiveType}get cullMode(){return this._renderStates.cullMode||this._effect.renderStates.cullMode}get depthCompare(){return this._renderStates.depthCompare||this._effect.renderStates.depthCompare}get blendColor(){return this._renderStates.blendColor||this._effect.renderStates.blendColor}get blendAlpha(){return this._renderStates.blendAlpha||this._effect.renderStates.blendAlpha}setUniform(r,n,i){this._effect.ubTemplate.setUniform(this._uniformBlock,r,n,i)}getUniform(r){return this._effect.ubTemplate.getUniform(this._uniformBlock,r)}setMarcos(r){Object.assign(this._marcos,r),this._version+=1}}p(Y,"CLASS_NAME","Material");class Ot extends U{constructor(){super();p(this,"isScene",!0);p(this,"_gameTime");p(this,"_rootNode");p(this,"_meshes");p(this,"_lights");p(this,"_command");p(this,"_renderTarget");p(this,"_screen");p(this,"_blit");this._renderTarget=this._screen=new re({width:T.width,height:T.height,colors:[{}],depthStencil:{needStencil:!0}}),this._blit=new Oe(new Y(E.iBlit,{u_texture:this._screen}))}set rootNode(r){this._rootNode=r}get rootNode(){return this._rootNode}get screen(){return this._screen}get lights(){return this._lights}cullCamera(r){const n=[];return this._meshes.forEach(i=>{const s=r.cull(i);s>=0&&(i.sortZ=s,n.push(i))}),n.sort((i,s)=>i.sortZ-s.sortZ),n}setRenderTarget(r){this._renderTarget=r||this._screen}startFrame(r){this._gameTime+=r,this._meshes=[],this._lights=[],this._rootNode.updateSubTree(i=>{Z.IS(i)?this._meshes.push(i):Je.IS(i)&&this._lights.push(i)});const n=T.getUniform("u_lightInfos");n&&(this._lights.forEach((i,s)=>{s<4&&n.set(i.ubInfo,s*16)}),T.setUniform("u_lightInfos",n)),T.setUniform("u_gameTime",new Float32Array([this._gameTime/1e3])),this._command=T.device.createCommandEncoder()}renderCamera(r,n,i=!0){r.render(this._command,this._renderTarget,n,i)}renderImages(r,n=!0){const s={colorAttachments:[{view:this._renderTarget.colorView,loadOp:n?"clear":"load",storeOp:"store"}]},a=this._command.beginRenderPass(s);a.setBindGroup(0,T.bindingGroup);for(const o of r)o.render(a);a.end()}computeUnits(r){const n=this._command.beginComputePass();n.setBindGroup(0,T.bindingGroup);for(const i of r)i.compute(n);n.end()}copyBuffer(r,n,i){this._command.copyBufferToBuffer(r,0,n,0,i)}endFrame(){const n={colorAttachments:[{view:T.currentTexture.createView(),loadOp:"clear",storeOp:"store"}]},i=this._command.beginRenderPass(n);i.setBindGroup(0,T.bindingGroup),this._blit.render(i),i.end(),T.device.queue.submit([this._command.finish()])}}p(Ot,"CLASS_NAME","Scene");class Fe extends ee{constructor(r,n,i=!1){super();p(this,"isCamera",!0);p(this,"controlMode","free");p(this,"target");p(this,"viewport");p(this,"clearColor");p(this,"colorOp");p(this,"clearDepth");p(this,"depthOp");p(this,"clearStencil");p(this,"stencilOp");p(this,"drawSkybox",!1);p(this,"_skyboxMat");p(this,"_skyboxMesh");p(this,"_near");p(this,"_far");p(this,"_fov");p(this,"_aspect");p(this,"_sizeX");p(this,"_sizeY");p(this,"_isOrth");p(this,"_viewMat");p(this,"_projMat");p(this,"_projInverseMat");p(this,"_vpMat");p(this,"_skyVPMat");if(this._justAsView=i,n=n||{},this._near=n.near||0,this._far=n.far||1e3,this._aspect=n.aspect||T.width/T.height,n.isOrth){let{sizeX:s,sizeY:a}=n;n.sizeX>n.sizeY?s=a*this._aspect:a=s/this._aspect,this._sizeX=s,this._sizeY=a,this._isOrth=!0}else this._fov=n.fov||Math.PI/3;this.clearColor=r.clearColor||[0,0,0,1],this.clearDepth=r.clearDepth!==void 0?r.clearDepth:1,this.clearStencil=r.clearStencil||0,this.colorOp=r.colorOp||"store",this.depthOp=r.depthOp||"store",this.stencilOp=r.stencilOp||"store",this.viewport=r.viewport||{x:0,y:0,w:1,h:1},this._viewMat=N(new Float32Array(16)),this._projMat=N(new Float32Array(16)),this._projInverseMat=N(new Float32Array(16)),this._vpMat=N(new Float32Array(16)),this._skyVPMat=N(new Float32Array(16))}static IS(r){return!!r.isCamera}get isOrth(){return this._isOrth}get skyboxMat(){return this._skyboxMat}set skyboxMat(r){this._skyboxMat=r,this._skyboxMesh?this._skyboxMesh.material=r:this._skyboxMesh=new Z(he.skybox,r)}get vpMat(){return this._vpMat}get invViewMat(){return this._worldMat}get invProjMat(){return this._projInverseMat}updateMatrix(){if(super.updateMatrix(),this._updateViewMat(),this._updateProjMat(),je(this._vpMat,this._projMat,this._viewMat),this._skyboxMat){const r=this._skyVPMat;r.set(this._viewMat);const n=this._skyboxMat.getUniform("u_rotation")[0];n&&wr(r,r,-n),r[12]=0,r[13]=0,r[14]=0,je(r,this._projMat,r),Ce(r,r)}T.setUniform("u_vp",this._vpMat),T.setUniform("u_view",this._viewMat),T.setUniform("u_proj",this._projMat),T.setUniform("u_viewInverse",this._worldMat),T.setUniform("u_projInverse",this._projInverseMat),this._skyboxMat&&(T.setUniform("u_skyVP",this._skyVPMat),T.setUniform("u_envTexture",this._skyboxMat.getUniform("u_cubeTexture")),T.setUniform("u_envColor",this._skyboxMat.getUniform("u_color")))}render(r,n,i,s=!1){this.clearColor;const{x:a,y:o,w:l,h:c}=this.viewport,{width:f,height:u,colorViews:d,depthStencilView:h}=n,v={colorAttachments:d.map(m=>({view:m,loadOp:s?"clear":"load",storeOp:this.colorOp})),depthStencilAttachment:h&&{view:h,depthClearValue:this.clearDepth,depthLoadOp:"clear",stencilClearValue:this.clearStencil,depthStoreOp:this.depthOp}},g=r.beginRenderPass(v);g.setViewport(a*f,o*u,l*f,c*u,0,1),g.setBindGroup(0,T.bindingGroup);for(const m of i)m.render(g,n);this.drawSkybox&&this._skyboxMesh&&this._skyboxMesh.render(g,n),g.end()}cull(r){return 0}_updateViewMat(){const{controlMode:r,target:n,_worldMat:i}=this;if(r==="target"&&!n)throw new Error('Camera with control mode "target" must has target!');if(r==="target"){const s=j(new Float32Array(3),i),a=j(new Float32Array(3),n.worldMat),o=_e(new Float32Array(3),a,s);ge(o,o);const l=this._worldMat.slice(4,7);ge(l,l),$r(l)===0&&l.set([0,1,0]),_t(this._viewMat,s,a,l)}else Ce(this._viewMat,this._worldMat)}_updateProjMat(){this._isOrth?this._orthHalfZ(this._projMat,-this._sizeX,this._sizeX,-this._sizeY,this._sizeY,this._near,this._far):Ar(this._projMat,this._fov,this._aspect,this._near,this._far),Ce(this._projInverseMat,this._projMat)}_orthHalfZ(r,n,i,s,a,o,l){const c=1/(i-n),f=1/(s-a),u=1/(l-o),d=(i+n)*c,h=(s+a)*f,v=o*u;r[0]=2*c,r[4]=0,r[8]=0,r[12]=-d,r[1]=0,r[5]=2*f,r[9]=0,r[13]=-h,r[2]=0,r[6]=0,r[10]=-1*u,r[14]=-v,r[3]=0,r[7]=0,r[11]=0,r[15]=1}}p(Fe,"CLASS_NAME","Node");class Pe extends U{constructor(r,n,i,s){super();p(this,"isComputeUnite",!0);p(this,"_material");p(this,"_matVersion",-1);p(this,"_pipeline");if(this._effect=r,this._groups=n,!r.isCompute)throw new Error("ComputeUnit can only receive effect has compute shader!");this._material=new Y(r,i,s)}get groups(){return this._groups}compute(r){const{_material:n,_groups:i}=this;n.version!==this._matVersion&&(this._createPipeline(),this._matVersion=n.version),r.setPipeline(this._pipeline),r.setBindGroup(1,n.bindingGroup),r.dispatchWorkgroups(i.x,i.y,i.z)}setUniform(r,n,i){this._material.setUniform(r,n,i)}getUniform(r){return this._material.getUniform(r)}setGroups(r,n,i){this._groups={x:r,y:n,z:i}}_createPipeline(){const{device:r}=T,{_material:n}=this,i=Object.assign({},n.marcos),{cs:s}=n.effect.getShader(i,"",T.shaderPrefix,"");this._pipeline=r.createComputePipeline({layout:r.createPipelineLayout({bindGroupLayouts:[T.uniformLayout,n.effect.uniformLayout]}),compute:{module:s,entryPoint:"main"}})}}p(Pe,"CLASS_NAME","ComputeUnit");const Ht=class{constructor(){p(this,"max");p(this,"min");p(this,"_isDirty",!1);p(this,"_center");p(this,"_size")}get center(){return(!this._center||this._isDirty)&&this._updateCenterSize(),this._center}get size(){return(!this._size||this._isDirty)&&this._updateCenterSize(),this._size}get maxExtends(){const t=this.size;return t[0]>t[2]?t[0]>t[1]?0:1:t[1]>t[2]?2:1}get surfaceArea(){const{size:t}=this;return 2*(t[0]*t[2]+t[0]*t[1]+t[2]*t[1])}initEmpty(){return this.max=new Float32Array([-1/0,-1/0,-1/0]),this.min=new Float32Array([1/0,1/0,1/0]),this}fromVertexes(t,r,n){return this.max=t.slice(),this.min=t.slice(),this.update(r).update(n),this}update(t){for(let r=0;r<3;r+=1)this.max[r]=Math.max(this.max[r],t[r]),this.min[r]=Math.min(this.min[r],t[r]);return this._isDirty=!0,this}mergeBounds(t){const{max:r,min:n}=t;for(let i=0;i<3;i+=1)this.max[i]=Math.max(this.max[i],r[i]),this.min[i]=Math.min(this.min[i],n[i]);return this._isDirty=!0,this}pointIn(t){const{max:r,min:n}=this;return t[0]>n[0]&&t[0]<r[0]&&t[1]>n[1]&&t[1]<r[1]&&t[2]>n[2]&&t[2]<r[2]}getOffset(t,r){let n=r[t]-this.min[t];return this.max[t]>this.min[t]&&(n/=this.max[t]-this.min[t]),n}buildBox(t){const{max:r,min:n}=this,i=[];Ht.BUILD_BOX_MAX_MIN_ORDER.forEach(a=>{for(let o=0;o<3;o+=1)i.push(a[o]?r[o]:n[o])});let s;return t==="lines"?s=[0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]:s=[0,1,2,2,3,0,4,5,6,6,7,4,0,4,5,5,1,0,1,5,6,6,2,1,3,2,6,6,7,3,0,3,7,7,4,0],{positions:i,indexes:s}}_updateCenterSize(){this._isDirty&&(this._center=this.max.map((t,r)=>(t+this.min[r])/2),this._size=this.max.map((t,r)=>t-this.min[r]),this._isDirty=!1)}};let K=Ht;p(K,"BUILD_BOX_MAX_MIN_ORDER",[[1,1,1],[1,1,0],[0,1,0],[0,1,1],[1,0,1],[1,0,0],[0,0,0],[0,0,1]]);function zl(e){return e.infoEnd!==void 0}const Wt=new Float32Array(3),Xt=new Float32Array(3),Zt=new Float32Array(3);class Ft extends U{constructor(r){super();p(this,"isBVH",!0);p(this,"_rootNode");p(this,"_boundsInfos");p(this,"_bvhMaxDepth");p(this,"_bvhBuffer");p(this,"_bvhNodes");p(this,"_bvhLeaves");p(this,"_debugMesh");p(this,"process",(r,n)=>{fe("BVH setup bounds info",this._setupBoundsInfo,[r,n]),fe("BVH build tree",this._buildTree,[]),fe("BVH flatten",this._flatten,[]),this._debugMesh=null});p(this,"_setupBoundsInfo",(r,n)=>{this._boundsInfos=[];for(let i=0;i<n.length;i+=3){const s=n.slice(i,i+3);tt(3,Wt,0,r,s[0]*4),tt(3,Xt,0,r,s[1]*4),tt(3,Zt,0,r,s[2]*4);const a=new K().fromVertexes(Wt,Xt,Zt);this._boundsInfos.push({indexes:s,bounds:a})}});p(this,"_buildTree",()=>{this._rootNode=this._buildRecursive(0,this._boundsInfos.length,0)});p(this,"_flatten",()=>{this._bvhLeaves=[],this._bvhNodes=[];const r={maxDepth:1,nodes:[],leaves:[]};this._traverseNode(this._rootNode,r);const{maxDepth:n,nodes:i,leaves:s}=r,a=new ArrayBuffer(4*(i.length+s.length)),o=new Float32Array(a),l=new Uint32Array(a),c=i.length;this._bvhMaxDepth=n,o.set(i),l.set(s,c);for(let f=0;f<c;f+=8)for(let u=0;u<8;u+=4){const d=f+u;i[d]&2147483648?l[d]=i[d]+c/4:l[d]=i[d]}this._bvhMaxDepth=r.maxDepth,this._bvhBuffer=o});p(this,"_traverseNode",(r,n,i=1,s=-1,a=0)=>{n.maxDepth=Math.max(i,n.maxDepth);const{nodes:o,leaves:l}=n,{_boundsInfos:c,_bvhNodes:f,_bvhLeaves:u}=this;if(zl(r)){u.push(r),s>=0&&(o[s*8+a]=1<<31|l.length/4);const d=r.infoEnd-r.infoStart;for(let h=r.infoStart;h<r.infoEnd;h+=1){const v=c[h].indexes;l.push(d,v[0],v[1],v[2])}}else{f.push(r);const d=r.bounds,h=o.length/8;s>=0&&(o[s*8+a]=h*2),o.push(0,d.min[0],d.min[1],d.min[2],0,d.max[0],d.max[1],d.max[2]),this._traverseNode(r.child0,n,i+1,h,0),this._traverseNode(r.child1,n,i+1,h,4)}});this._maxPrimitivesPerLeaf=r}get maxDepth(){return this._bvhMaxDepth}get buffer(){return this._bvhBuffer}get debugMesh(){return this._debugMesh||this._buildDebugMesh(),this._debugMesh}get nodesCount(){return this._bvhNodes.length}get leavesCount(){return this._bvhLeaves.length}_buildRecursive(r,n,i){const{_boundsInfos:s}=this,a=new K().initEmpty();for(let l=r;l<n;l+=1)a.mergeBounds(s[l].bounds);const o=n-r;if(o<=this._maxPrimitivesPerLeaf)return{infoStart:r,infoEnd:n,bounds:a};{const l=new K().initEmpty();for(let h=r;h<n;h+=1)l.update(s[h].bounds.center);const c=l.maxExtends;let f=Math.floor((r+n)/2);if(o<=4)dl(s,(h,v)=>h.bounds.center[c]<v.bounds.center[c],r,n,f);else{if(l.max[c]===l.min[c])return{infoStart:r,infoEnd:n,bounds:a};{const h=[];for(let _=0;_<12;_+=1)h.push({bounds:new K().initEmpty(),count:0});for(let _=r;_<n;_+=1){let y=Math.floor(h.length*l.getOffset(c,s[_].bounds.center));y===h.length&&(y=h.length-1),h[y].count+=1,h[y].bounds.mergeBounds(s[_].bounds)}const v=[];for(let _=0;_<h.length-1;_+=1){const y=new K().initEmpty(),x=new K().initEmpty();let M=0,w=0;for(let b=0;b<=_;b+=1)y.mergeBounds(h[b].bounds),M+=h[b].count;for(let b=_+1;b<h.length;b+=1)x.mergeBounds(h[b].bounds),w+=h[b].count;v.push(.1+(M*y.surfaceArea+w*x.surfaceArea)/a.surfaceArea)}let g=v[0],m=0;for(let _=1;_<v.length;_+=1)v[_]<g&&(g=v[_],m=_);f=ul(s,_=>{let y=Math.floor(h.length*l.getOffset(c,_.bounds.center));return y===h.length&&(y=h.length-1),y<=m},r,n)}}const u=this._buildRecursive(r,f,i+1),d=this._buildRecursive(f,n,i+1);return{axis:c,bounds:new K().initEmpty().mergeBounds(u.bounds).mergeBounds(d.bounds),child0:u,child1:d,depth:i}}}_buildDebugMesh(){const{_bvhNodes:r,_bvhMaxDepth:n}=this,i="lines",s=r.length,a=new Float32Array(s*8*3),o=new Float32Array(s*8*3);let l;l=new Uint32Array(s*24);const c=new Array(n).fill(0),f=new Array(n).fill(0);r.forEach(d=>{c[d.depth]+=1});let u=0;r.forEach(d=>{const h=d.bounds.buildBox(i),v=u*8,g=u*8*3,m=u*8*3,_=u*h.indexes.length,y=$l(d.depth/n,f[d.depth]/c[d.depth]*.7+.3,.5);for(let x=0;x<24;x+=3)o.set(y,m+x);l.set(h.indexes.map(x=>x+v),_),a.set(h.positions,g),u+=1,f[d.depth]+=1}),this._debugMesh=new Z(new ne([{layout:{attributes:[{name:"position",shaderLocation:0,format:"float32x3",offset:0}],arrayStride:12},data:a},{layout:{attributes:[{name:"color_0",shaderLocation:1,format:"float32x3",offset:0}],arrayStride:12},data:o}],l,l.length),new Y(E.rColor,{u_color:new Float32Array([1,1,1,.4])},void 0,{primitiveType:"line-list",cullMode:"none",blendColor:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},blendAlpha:{srcFactor:"zero",dstFactor:"one"}}))}}p(Ft,"CLASS_NAME","BVH");function nt(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+(t-e)*6*r:r<1/2?t:r<2/3?e+(t-e)*(2/3-r)*6:e}function $l(e,t,r){let n,i,s;if(t==0)n=i=s=r;else{var a=r<.5?r*(1+t):r+t-r*t,o=2*r-a;n=nt(o,a,e+1/3),i=nt(o,a,e),s=nt(o,a,e-1/3)}return[n,i,s]}const te=class extends U{constructor(r=1){super();p(this,"isRayTracingManager",!0);p(this,"meshes");p(this,"_attributesInfo");p(this,"_indexInfo");p(this,"_materials",[]);p(this,"_commonUniforms");p(this,"_bvh");p(this,"_gBufferMesh");p(this,"_rtUnit");p(this,"_buildAttributeBuffers",r=>{const{_materials:n}=this;let i=0,s=0;r.forEach(h=>{s+=h.geometry.vertexCount,i+=h.geometry.count});const{value:a}=this._indexInfo={value:new Uint32Array(i)},{position:o,texcoord_0:l,normal:c,meshMatIndex:f}=this._attributesInfo={position:{value:new Float32Array(s*4),length:4,format:"float32x3"},texcoord_0:{value:new Float32Array(s*2),length:2,format:"float32x2"},normal:{value:new Float32Array(s*4),length:4,format:"float32x3"},meshMatIndex:{value:new Uint32Array(s*2),length:2,format:"uint32x2"}};let u=0,d=0;for(let h=0;h<r.length;h+=1){const v=r[h],{worldMat:g}=v,m=Ge(new Float32Array(4),g),{geometry:_,material:y}=v,{indexData:x,vertexInfo:M,vertexCount:w,count:b}=_;if(y.effect.name!=="rPBR")throw new Error("Only support Effect rPBR!");let C=n.indexOf(y);C<0&&(n.push(y),C=n.length-1),x.forEach((A,L)=>{a[L+d]=A+u}),M.normal||_.calculateNormals();for(let A=0;A<w;A+=1)this._copyAttribute(M.position,o,u,A,g),this._copyAttribute(M.texcoord_0,l,u,A),this._copyAttribute(M.normal,c,u,A,m,!0),f.value.set([h,C],(u+A)*f.length);d+=b,u+=w}});p(this,"_buildCommonUniforms",r=>{const n=new Int32Array(r.length*4).fill(-1),i=new Float32Array(r.length*4).fill(1),s=new Float32Array(r.length*4).fill(1),a=new Float32Array(r.length*4).fill(1),o=[],l=[],c=[];r.forEach((f,u)=>{const d=f.marcos.USE_GLASS,h=f.marcos.USE_SPEC_GLOSS,v=f.getUniform("u_baseColorFactor"),g=f.getUniform("u_metallicFactor"),m=f.getUniform("u_roughnessFactor"),_=f.getUniform("u_specularFactor"),y=f.getUniform("u_glossinessFactor"),x=f.getUniform("u_normalTextureScale"),M=f.getUniform("u_baseColorTexture"),w=f.getUniform("u_normalTexture"),b=f.getUniform("u_metallicRoughnessTexture"),C=f.getUniform("u_specularGlossinessTexture"),A=u*4;M!==I.empty&&this._setTextures(A,o,M,n),w!==I.empty&&this._setTextures(A+1,l,w,n),v&&i.set(v,u*4),x!==void 0&&s.set(x.slice(0,1),u*4+2),h?(_!==void 0&&a.set(_.slice(0,3),u*4),y!==void 0&&a.set(y.slice(0,1),u*4+3),C!==I.empty&&this._setTextures(A+2,c,C,n),s.set([d?3:1],u*4+3)):(g!==void 0&&s.set(g.slice(0,1),u*4),m!==void 0&&s.set(m.slice(0,1),u*4+1),b!==I.empty&&this._setTextures(A+2,c,b,n),s.set([d?2:0],u*4+3))}),this._commonUniforms={matId2TexturesId:n,baseColorFactors:i,metallicRoughnessFactorNormalScaleMaterialTypes:s,specularGlossinessFactors:a,baseColorTextures:this._generateTextureArray(o),normalTextures:this._generateTextureArray(l),metalRoughOrSpecGlossTextures:this._generateTextureArray(c)}});p(this,"_buildGBufferMesh",()=>{const{_attributesInfo:r,_indexInfo:n,_commonUniforms:i}=this,s=new ne(Object.keys(r).map((o,l)=>{const{value:c,length:f,format:u}=r[o];return{layout:{arrayStride:f*4,attributes:[{name:o,offset:0,format:u,shaderLocation:l}]},data:c,usage:GPUBufferUsage.STORAGE}}),n.value,n.value.length),a=new Y(E.rRTGBuffer,{u_matId2TexturesId:i.matId2TexturesId,u_baseColorFactors:i.baseColorFactors,u_metallicRoughnessFactorNormalScaleMaterialTypes:i.metallicRoughnessFactorNormalScaleMaterialTypes,u_specularGlossinessFactors:i.specularGlossinessFactors,u_baseColorTextures:i.baseColorTextures,u_normalTextures:i.normalTextures,u_metalRoughOrSpecGlossTextures:i.metalRoughOrSpecGlossTextures});this._gBufferMesh=new Z(s,a)});p(this,"_buildRTUnit",r=>{const{_gBufferMesh:n,_commonUniforms:i,_bvh:s}=this,{geometry:a}=n;this._rtUnit=new Pe(E.cRTSS,{x:Math.ceil(T.width/16),y:Math.ceil(T.height/16)},{u_output:r,u_matId2TexturesId:i.matId2TexturesId,u_baseColorFactors:i.baseColorFactors,u_metallicRoughnessFactorNormalScaleMaterialTypes:i.metallicRoughnessFactorNormalScaleMaterialTypes,u_specularGlossinessFactors:i.specularGlossinessFactors,u_baseColorTextures:i.baseColorTextures,u_normalTextures:i.normalTextures,u_metalRoughOrSpecGlossTextures:i.metalRoughOrSpecGlossTextures,u_bvh:s.buffer},{BVH_DEPTH:this._bvh.maxDepth});let o=a.getValues("position");this._rtUnit.setUniform("u_positions",o.cpu,o.gpu),o=a.getValues("texcoord_0"),this._rtUnit.setUniform("u_uvs",o.cpu,o.gpu),o=a.getValues("normal"),this._rtUnit.setUniform("u_normals",o.cpu,o.gpu),o=a.getValues("meshmatindex"),this._rtUnit.setUniform("u_meshMatIndexes",o.cpu,o.gpu),console.log(this._materials)});this._maxPrimitivesPerBVHLeaf=r,this._bvh=new Ft(r)}get gBufferMesh(){return this._gBufferMesh}get rtUnit(){return this._rtUnit}get bvhDebugMesh(){return this._bvh.debugMesh}get bvh(){return this._bvh}process(r,n){this.meshes=r,fe("build AttributeBuffers",this._buildAttributeBuffers,[r]),fe("build CommonUniforms",this._buildCommonUniforms,[this._materials]),fe("build GBufferMesh",this._buildGBufferMesh,[]),this._bvh.process(this._attributesInfo.position.value,this._indexInfo.value),fe("build RTUnit",this._buildRTUnit,[n]),console.log(`Build done(max primitives per leaf is ${this._maxPrimitivesPerBVHLeaf}): mesh(${r.length}), material(${this._materials.length}), vertexes(${this._attributesInfo.position.value.length/3}), triangles(${this._indexInfo.value.length/3}), bvhNodes(${this._bvh.nodesCount}), bvhLeaves(${this._bvh.leavesCount}), bvhDepth(${this._bvh.maxDepth})`)}_copyAttribute(r,n,i,s,a,o){const l=r.offset+s*r.stride;let c=r.data.slice(l,l+r.length);a&&(o?wt(c,c,a):Mt(c,c,a)),n.value.set(c,(i+s)*n.length)}_setTextures(r,n,i,s){if(i){let a=n.indexOf(i);a<0&&(n.push(i),a=n.length-1),s[r]=a}}_generateTextureArray(r){if(!r.length)return I.array1white;let n=0,i=0;r.forEach(a=>{n=Math.max(n,a.width),i=Math.max(i,a.height)});const s=r.map(a=>{if(a.width===n&&a.height===i)return a.source;if(!(a.source instanceof ImageBitmap))throw new Error("Can only resize image bitmap!");te.RESIZE_CANVAS||(te.RESIZE_CANVAS=document.createElement("canvas"),te.RESIZE_CANVAS.width=2048,te.RESIZE_CANVAS.height=2048,te.RESIZE_CTX=te.RESIZE_CANVAS.getContext("2d"));const o=te.RESIZE_CTX;return o.drawImage(a.source,0,0,n,i),o.getImageData(0,0,n,i).data.buffer});return new ue(n,i,s,r[0].format)}};let ce=te;p(ce,"CLASS_NAME","RayTracingManager"),p(ce,"RESIZE_CANVAS"),p(ce,"RESIZE_CTX");const oe=new Float32Array(3),Q=new Float32Array(3),Ul=new Float32Array(3),He=new Float32Array(4),Qt=new Float32Array(16),Gl=new Float32Array([0,1,0]);class Pt extends U{constructor(r="free"){super();p(this,"isNodeControl",!0);p(this,"onChange");p(this,"_start",!1);p(this,"_x");p(this,"_y");p(this,"_touchId");p(this,"_node");p(this,"_target");p(this,"_arcRadius");p(this,"_handleStart",r=>{this._x=r.clientX,this._y=r.clientY,this._mode==="arc"&&(this._arcRadius=xt(j(oe,this._target.worldMat),j(Q,this._node.worldMat))),this._start=!0});p(this,"_handleEnd",()=>{this._start=!1});p(this,"_handleMove",r=>{const{_start:n,_node:i,_x:s,_y:a}=this;if(!n||!i)return;const{clientX:o,clientY:l}=r,c=(o-s)/200,f=(l-a)/200;if(this._mode==="free"){Ct(i.quat,i.quat,f),ln(He,i.quat);const u=new Float32Array([0,1,0]);wt(u,u,He),It(He,u,c),At(i.quat,i.quat,He)}else{j(oe,this._target.worldMat),j(Q,this._node.worldMat),Q[0]+=c*2,Q[1]+=f*2;const u=_e(Ul,oe,Q);ge(u,u),Le(u,u,-this._arcRadius),Ye(Q,oe,u),_t(Qt,Q,oe,Gl),this._node.pos.set(Q),Ge(this._node.quat,Qt)}this._x=o,this._y=l,this.onChange&&this.onChange()});p(this,"_handleZoom",r=>{const{worldMat:n,pos:i}=this._node;let s=r.deltaY/200,a=n.slice(8,12);this._mode==="arc"&&(j(oe,this._target.worldMat),j(Q,this._node.worldMat),_e(a,oe,Q),s=-s),ge(a,a),Le(a,a,s),Ye(i,i,a),this._mode==="arc"&&(this._arcRadius+=s),this.onChange&&this.onChange()});p(this,"_handleTouchStart",r=>{const n=r.targetTouches[0];this._touchId=n.identifier,this._handleStart(n)});p(this,"_handleTouchMove",r=>{if(!!this._start){for(let n=0;n<r.targetTouches.length;n+=1){const i=r.targetTouches[n];if(i.identifier===this._touchId)return this._handleMove(i)}this._handleEnd()}});this._mode=r;const{canvas:n}=T;n.addEventListener("mousedown",this._handleStart),n.addEventListener("mouseup",this._handleEnd),n.addEventListener("mouseleave",this._handleEnd),n.addEventListener("mouseout",this._handleEnd),n.addEventListener("mousemove",this._handleMove),n.addEventListener("wheel",this._handleZoom),n.addEventListener("touchstart",this._handleTouchStart),n.addEventListener("touchend",this._handleEnd),n.addEventListener("touchcancel",this._handleEnd),n.addEventListener("touchmove",this._handleTouchMove)}control(r,n){if(this._node=r,this._target=n,!n&&this._mode==="arc")throw new Error("Mode arc must be given target!")}}p(Pt,"CLASS_NAME","NodeControl");class zt extends U{constructor(){super(...arguments);p(this,"isLoader",!0);p(this,"type")}async request(r,n){return new Promise((i,s)=>{const a=new XMLHttpRequest;a.onload=()=>{if(a.status<200||a.status>=300){s(new TypeError(`Network request failed for ${a.status}`));return}let o="response"in a?a.response:a.responseText;if(n==="json")try{o=JSON.parse(o)}catch(l){s(new TypeError("JSON.parse error"+l));return}i(o)},a.onerror=()=>{s(new TypeError("Network request failed"))},a.ontimeout=()=>{s(new TypeError("Network request timed out"))},a.open("GET",r,!0),n==="buffer"&&(a.responseType="arraybuffer"),a.send()})}}p(zt,"CLASS_NAME","Loader");class $t extends zt{constructor(){super(...arguments);p(this,"isTextureLoader",!0)}async load(r,n){const i=document.createElement("img");i.src=r,await i.decode();const s=await createImageBitmap(i);return new ue(i.naturalHeight,i.naturalHeight,s)}}p($t,"CLASS_NAME","TextureLoader");class Ut extends zt{constructor(){super(...arguments);p(this,"isGlTFLoader",!0);p(this,"_baseUri");p(this,"_json");p(this,"_buffers",[]);p(this,"_res")}async load(r,n){const i=r.split("/");return i.pop(),this._baseUri=i.join("/"),this._json=await this.request(r,"json"),await this._loadBuffers(),this._res={rootNode:new ee,nodes:[],meshes:[],images:[],textures:[],cubeTextures:[],materials:[],cameras:[],lights:[]},await this._loadImages(),await this._loadTextures(),await this._loadCubeTextures(),await this._loadMaterials(),await this._loadMeshes(),await this._loadCameras(),await this._loadLights(),await this._loadNodes(),this._res}async _loadBuffers(){const{buffers:r}=this._json;for(const{uri:n}of r)this._buffers.push(await this.request(this._baseUri+"/"+n,"buffer"))}async _loadImages(){const{images:r}=this._json,{images:n}=this._res;if(!!r)for(const{uri:i}of r){const s=await this._loadImage(this._baseUri+"/"+i),a=await createImageBitmap(s);n.push(a)}}async _loadTextures(){var a,o,l;const{textures:r,images:n}=this._json,{images:i,textures:s}=this._res;if(!!r)for(const{source:c}of r){const f=i[c],u=new ue(f.width,f.height,f);((a=n.extras)==null?void 0:a.type)==="HDR"&&((o=n.extras)==null||o.format),(l=n.extras)!=null&&l.isNormalMap,s.push(u)}}async _loadCubeTextures(){var s,a;const r=(a=(s=this._json.extensions)==null?void 0:s.Sein_cubeTexture)==null?void 0:a.textures,{images:n,cubeTextures:i}=this._res;if(!!r)for(const{images:o}of r){const c=await Promise.all(o.map(u=>createImageBitmap(n[u]))),f=new ye(c[0].width,c[1].width,c);c.forEach(u=>u.close()),i.push(f)}}async _loadMaterials(){const{materials:r}=this._json,{materials:n,textures:i}=this._res;for(const{name:s,pbrMetallicRoughness:a,normalTexture:o,alphaMode:l,extensions:c}of r){const f=E.rPBR,u={},d={};if(o&&(u.u_normalTexture=i[o.index],u.u_normalTextureScale=o.scale),a){const{baseColorTexture:v,metallicFactor:g,baseColorFactor:m,roughnessFactor:_,metallicRoughnessTexture:y}=a;v&&(u.u_baseColorTexture=i[v.index]),y&&(u.u_metallicRoughnessTexture=i[y.index]),u.u_baseColorFactor=m,u.u_metallicFactor=g,u.u_roughnessFactor=_}if(c!=null&&c.KHR_materials_pbrSpecularGlossiness){const{diffuseFactor:v,diffuseTexture:g,specularFactor:m,glossinessFactor:_,specularGlossinessTexture:y}=c==null?void 0:c.KHR_materials_pbrSpecularGlossiness;d.USE_SPEC_GLOSS=!0,g&&(u.u_baseColorTexture=i[g.index]),y&&(u.u_specularGlossinessTexture=i[y.index]),u.u_baseColorFactor=v,u.u_specularFactor=m,u.u_glossinessFactor=_}l==="BLEND"&&(d.USE_GLASS=!0);const h=new Y(f,u,d);h.name=s,n.push(h)}}async _loadMeshes(){const{meshes:r}=this._json,{meshes:n}=this._res;for(const{primitives:i,name:s}of r){if(i.length===1){const o=await this._createMesh(i[0]);o.name=s,n.push(o);continue}const a=new ee;a.name=s;for(let o of i)a.addChild(await this._createMesh(o));n.push(a)}}async _loadCameras(){const{cameras:r}=this._json,{cameras:n,cubeTextures:i}=this._res;if(!!r)for(const{perspective:s,orthographic:a,type:o,name:l,extensions:c}of r){let f;o==="perspective"?f=new Fe({},{near:s.znear,far:s.zfar,fov:1/s.yfov}):f=new Fe({},{isOrth:!0,near:a.znear,far:a.zfar,sizeX:a.xmag,sizeY:a.ymag}),f.name=l;const u=c&&c.Sein_skybox;if(u)if(u.type!=="Cube")console.warn("Only support cube texture skybox now!");else{const d=new Y(E.rSkybox,{u_factor:new Float32Array([u.factor]),u_color:new Float32Array(u.color),u_cubeTexture:i[u.texture.index],u_rotation:new Float32Array([u.rotation]),u_exposure:new Float32Array([u.exposure])});f.skyboxMat=d}n.push(f)}}async _loadLights(){var i,s;if(!this._json.extensions)return;const r=(s=(i=this._json.extensions)==null?void 0:i.KHR_lights_punctual)==null?void 0:s.lights,{lights:n}=this._res;if(r)for(const{name:a,type:o,intensity:l,color:c,mode:f,size:u}of r){if(o!=="directional"&&o!=="area")throw new Error("Only support directional and area light now!");const d=new Je(o==="directional"?dt.Directional:dt.Area,c.map(h=>h*l),o==="directional"?{}:{mode:f==="rect"?pt.Rect:pt.Disc,size:u});d.name=a,n.push(d)}}async _loadNodes(){const{nodes:r,scenes:n}=this._json,{rootNode:i,nodes:s,meshes:a,cameras:o,lights:l}=this._res;for(const{matrix:f,name:u,extensions:d,mesh:h,camera:v}of r){let g;h!==void 0?g=a[h].clone():v!==void 0?g=o[v]:d!=null&&d.KHR_lights_punctual?g=l[d.KHR_lights_punctual.light]:g=new ee,g.name=u,f&&g.setLocalMat(f),s.push(g)}let c=0;for(const f of s){const{children:u}=r[c];if(u)for(const d of u)f.addChild(s[d]);c+=1}for(let f of n[0].nodes)i.addChild(s[f])}async _createMesh(r){const{_buffers:n}=this,{accessors:i,bufferViews:s}=this._json,{materials:a}=this._res,o=[];let l=0,c=0,f,u;for(const _ in r.attributes){const{bufferView:y,byteOffset:x,componentType:M,type:w,max:b,min:C}=i[r.attributes[_]],A=s[y],[L,R]=this._convertVertexFormat(w,M);l+=R,f=f||new Float32Array(n[A.buffer],A.byteOffset||0,A.byteLength/4),_==="POSITION"&&(b==null?void 0:b.length)===3&&(C==null?void 0:C.length)===3&&(u=this._getBoundingBox(b,C)),o.push({name:_.toLowerCase(),format:L,offset:x||0,shaderLocation:c}),c+=1}const d=i[r.indices],h=s[d.bufferView],v=new Uint16Array(n[h.buffer],h.byteOffset,h.byteLength/2),g=new ne([{layout:{arrayStride:l,attributes:o},data:f}],v,d.count,u),m=a[r.material];return new Z(g,m)}_convertVertexFormat(r,n){if(n!==5126)throw new Error("Only support componentType float!");switch(r){case"SCALE":return["float32",4];case"VEC2":return["float32x2",8];case"VEC3":return["float32x3",12];case"VEC4":return["float32x4",16]}throw new Error(`Not support type ${r}!`)}_getBoundingBox(r,n){return{start:n,center:r.map((i,s)=>(i+n[s])/2),size:r.map((i,s)=>i-n[s])}}async _loadImage(r){const n=document.createElement("img");return n.src=r,await n.decode(),n}}p(Ut,"CLASS_NAME","GlTFLoader");class Gt extends U{constructor(){super(...arguments);p(this,"isResource",!0);p(this,"_loaders",{});p(this,"_resources",{})}register(r,n){this._loaders[r]=n}async load(r,n){return this._resources[r.name]?this._resources[r.name]:this._loaders[r.type].load(r.src,n||{}).then(i=>(this._resources[r.name]=i,i))}get(r){return this._resources[r]}}p(Gt,"CLASS_NAME","Resource");const ze=new Gt;ze.register("texture",new $t);ze.register("gltf",new Ut);async function In(e){await T.init(e),await Fl(),await T.createGlobal(Ee.global)}const Bl={vec2:fl,vec3:ea,vec4:wa,quat:qa,quat2:Io,mat2:hi,mat3:Bi,mat4:Ss};window.H=void 0;var An=Object.freeze(Object.defineProperty({__proto__:null,init:In,math:Bl,Scene:Ot,Node:ee,Camera:Fe,Light:Je,Geometry:ne,UBTemplate:Re,Effect:H,Material:Y,Mesh:Z,ImageMesh:Oe,ComputeUnit:Pe,RenderTexture:re,Texture:ue,CubeTexture:ye,renderEnv:T,RayTracingManager:ce,BVH:Ft,NodeControl:Pt,resource:ze,Resource:Gt,TextureLoader:$t,GlTFLoader:Ut,createGPUBuffer:se,createGPUBufferBySize:Sn,buildinTextures:I,buildinGeometries:he,buildinEffects:E,buildinUBTemplates:Ee},Symbol.toStringTag,{value:"Module"}));function Cn(e){return(Cn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function k(e,t,r){var n=r.value;if(typeof n!="function")throw new TypeError("@boundMethod decorator can only be applied to methods not: ".concat(Cn(n)));var i=!1;return{configurable:!0,get:function(){if(i||this===e.prototype||this.hasOwnProperty(t)||typeof n!="function")return n;var s=n.bind(this);return i=!0,Object.defineProperty(this,t,{configurable:!0,get:function(){return s},set:function(a){n=a,delete this[t]}}),i=!1,s},set:function(s){n=s}}}var Kt,it,st,Jt;const Ze=globalThis.trustedTypes,er=Ze?Ze.createPolicy("lit-html",{createHTML:e=>e}):void 0,ie=`lit$${(Math.random()+"").slice(9)}$`,Dn="?"+ie,Nl=`<${Dn}>`,xe=document,$e=(e="")=>xe.createComment(e),Qe=e=>e===null||typeof e!="object"&&typeof e!="function",tr=Array.isArray,Ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rr=/-->/g,nr=/>/g,le=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,ir=/'/g,sr=/"/g,ar=/^(?:script|style|textarea)$/i,Ae=(e=>(t,...r)=>({_$litType$:e,strings:t,values:r}))(1),be=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),or=new WeakMap,ve=xe.createTreeWalker(xe,129,null,!1);class Ue{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let s=0,a=0;const o=t.length-1,l=this.parts,[c,f]=((u,d)=>{const h=u.length-1,v=[];let g,m=d===2?"<svg>":"",_=Ie;for(let x=0;x<h;x++){const M=u[x];let w,b,C=-1,A=0;for(;A<M.length&&(_.lastIndex=A,b=_.exec(M),b!==null);)A=_.lastIndex,_===Ie?b[1]==="!--"?_=rr:b[1]!==void 0?_=nr:b[2]!==void 0?(ar.test(b[2])&&(g=RegExp("</"+b[2],"g")),_=le):b[3]!==void 0&&(_=le):_===le?b[0]===">"?(_=g!=null?g:Ie,C=-1):b[1]===void 0?C=-2:(C=_.lastIndex-b[2].length,w=b[1],_=b[3]===void 0?le:b[3]==='"'?sr:ir):_===sr||_===ir?_=le:_===rr||_===nr?_=Ie:(_=le,g=void 0);const L=_===le&&u[x+1].startsWith("/>")?" ":"";m+=_===Ie?M+Nl:C>=0?(v.push(w),M.slice(0,C)+"$lit$"+M.slice(C)+ie+L):M+ie+(C===-2?(v.push(void 0),x):L)}const y=m+(u[h]||"<?>")+(d===2?"</svg>":"");return[er!==void 0?er.createHTML(y):y,v]})(t,r);if(this.el=Ue.createElement(c,n),ve.currentNode=this.el.content,r===2){const u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(i=ve.nextNode())!==null&&l.length<o;){if(i.nodeType===1){if(i.hasAttributes()){const u=[];for(const d of i.getAttributeNames())if(d.endsWith("$lit$")||d.startsWith(ie)){const h=f[a++];if(u.push(d),h!==void 0){const v=i.getAttribute(h.toLowerCase()+"$lit$").split(ie),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:s,name:g[2],strings:v,ctor:g[1]==="."?kl:g[1]==="?"?ql:g[1]==="@"?jl:et})}else l.push({type:6,index:s})}for(const d of u)i.removeAttribute(d)}if(ar.test(i.tagName)){const u=i.textContent.split(ie),d=u.length-1;if(d>0){i.textContent=Ze?Ze.emptyScript:"";for(let h=0;h<d;h++)i.append(u[h],$e()),ve.nextNode(),l.push({type:2,index:++s});i.append(u[d],$e())}}}else if(i.nodeType===8)if(i.data===Dn)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(ie,u+1))!==-1;)l.push({type:7,index:s}),u+=ie.length-1}s++}}static createElement(t,r){const n=xe.createElement("template");return n.innerHTML=t,n}}function Me(e,t,r=e,n){var i,s,a,o;if(t===be)return t;let l=n!==void 0?(i=r.\u03A3i)===null||i===void 0?void 0:i[n]:r.\u03A3o;const c=Qe(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==c&&((s=l==null?void 0:l.O)===null||s===void 0||s.call(l,!1),c===void 0?l=void 0:(l=new c(e),l.T(e,r,n)),n!==void 0?((a=(o=r).\u03A3i)!==null&&a!==void 0?a:o.\u03A3i=[])[n]=l:r.\u03A3o=l),l!==void 0&&(t=Me(e,l.S(e,t.values),l,n)),t}class Hl{constructor(t,r){this.l=[],this.N=void 0,this.D=t,this.M=r}u(t){var r;const{el:{content:n},parts:i}=this.D,s=((r=t==null?void 0:t.creationScope)!==null&&r!==void 0?r:xe).importNode(n,!0);ve.currentNode=s;let a=ve.nextNode(),o=0,l=0,c=i[0];for(;c!==void 0;){if(o===c.index){let f;c.type===2?f=new Be(a,a.nextSibling,this,t):c.type===1?f=new c.ctor(a,c.name,c.strings,this,t):c.type===6&&(f=new Yl(a,this,t)),this.l.push(f),c=i[++l]}o!==(c==null?void 0:c.index)&&(a=ve.nextNode(),o++)}return s}v(t){let r=0;for(const n of this.l)n!==void 0&&(n.strings!==void 0?(n.I(t,n,r),r+=n.strings.length-2):n.I(t[r])),r++}}class Be{constructor(t,r,n,i){this.type=2,this.N=void 0,this.A=t,this.B=r,this.M=n,this.options=i}setConnected(t){var r;(r=this.P)===null||r===void 0||r.call(this,t)}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(t,r=this){t=Me(this,t,r),Qe(t)?t===B||t==null||t===""?(this.H!==B&&this.R(),this.H=B):t!==this.H&&t!==be&&this.m(t):t._$litType$!==void 0?this._(t):t.nodeType!==void 0?this.$(t):(n=>{var i;return tr(n)||typeof((i=n)===null||i===void 0?void 0:i[Symbol.iterator])=="function"})(t)?this.g(t):this.m(t)}k(t,r=this.B){return this.A.parentNode.insertBefore(t,r)}$(t){this.H!==t&&(this.R(),this.H=this.k(t))}m(t){const r=this.A.nextSibling;r!==null&&r.nodeType===3&&(this.B===null?r.nextSibling===null:r===this.B.previousSibling)?r.data=t:this.$(xe.createTextNode(t)),this.H=t}_(t){var r;const{values:n,_$litType$:i}=t,s=typeof i=="number"?this.C(t):(i.el===void 0&&(i.el=Ue.createElement(i.h,this.options)),i);if(((r=this.H)===null||r===void 0?void 0:r.D)===s)this.H.v(n);else{const a=new Hl(s,this),o=a.u(this.options);a.v(n),this.$(o),this.H=a}}C(t){let r=or.get(t.strings);return r===void 0&&or.set(t.strings,r=new Ue(t)),r}g(t){tr(this.H)||(this.H=[],this.R());const r=this.H;let n,i=0;for(const s of t)i===r.length?r.push(n=new Be(this.k($e()),this.k($e()),this,this.options)):n=r[i],n.I(s),i++;i<r.length&&(this.R(n&&n.B.nextSibling,i),r.length=i)}R(t=this.A.nextSibling,r){var n;for((n=this.P)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this.B;){const i=t.nextSibling;t.remove(),t=i}}}class et{constructor(t,r,n,i,s){this.type=1,this.H=B,this.N=void 0,this.V=void 0,this.element=t,this.name=r,this.M=i,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this.H=Array(n.length-1).fill(B),this.strings=n):this.H=B}get tagName(){return this.element.tagName}I(t,r=this,n,i){const s=this.strings;let a=!1;if(s===void 0)t=Me(this,t,r,0),a=!Qe(t)||t!==this.H&&t!==be,a&&(this.H=t);else{const o=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Me(this,o[n+l],r,l),c===be&&(c=this.H[l]),a||(a=!Qe(c)||c!==this.H[l]),c===B?t=B:t!==B&&(t+=(c!=null?c:"")+s[l+1]),this.H[l]=c}a&&!i&&this.W(t)}W(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class kl extends et{constructor(){super(...arguments),this.type=3}W(t){this.element[this.name]=t===B?void 0:t}}class ql extends et{constructor(){super(...arguments),this.type=4}W(t){t&&t!==B?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)}}class jl extends et{constructor(){super(...arguments),this.type=5}I(t,r=this){var n;if((t=(n=Me(this,t,r,0))!==null&&n!==void 0?n:B)===be)return;const i=this.H,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this.H=t}handleEvent(t){var r,n;typeof this.H=="function"?this.H.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this.H.handleEvent(t)}}class Yl{constructor(t,r,n){this.element=t,this.type=6,this.N=void 0,this.V=void 0,this.M=r,this.options=n}I(t){Me(this,t)}}(it=(Kt=globalThis).litHtmlPlatformSupport)===null||it===void 0||it.call(Kt,Ue,Be),((st=(Jt=globalThis).litHtmlVersions)!==null&&st!==void 0?st:Jt.litHtmlVersions=[]).push("2.0.0-rc.3");const Bt=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Vn=Symbol();class Ln{constructor(t,r){if(r!==Vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return Bt&&this.t===void 0&&(this.t=new CSSStyleSheet,this.t.replaceSync(this.cssText)),this.t}toString(){return this.cssText}}const lr=new Map,Rn=e=>{let t=lr.get(e);return t===void 0&&lr.set(e,t=new Ln(e,Vn)),t},En=(e,...t)=>{const r=e.length===1?e[0]:t.reduce((n,i,s)=>n+(a=>{if(a instanceof Ln)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return Rn(r)},Wl=(e,t)=>{Bt?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{const n=document.createElement("style");n.textContent=r.cssText,e.appendChild(n)})},cr=Bt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(const n of t.cssRules)r+=n.cssText;return(n=>Rn(typeof n=="string"?n:n+""))(r)})(e):e;var fr,at,ot,hr;const mt={toAttribute(e,t){switch(t){case Boolean:e=e?"":null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},On=(e,t)=>t!==e&&(t==t||e==e),lt={attribute:!0,type:String,converter:mt,reflect:!1,hasChanged:On};class pe extends HTMLElement{constructor(){super(),this.\u03A0i=new Map,this.\u03A0o=void 0,this.\u03A0l=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.\u03A0h=null,this.u()}static addInitializer(t){var r;(r=this.v)!==null&&r!==void 0||(this.v=[]),this.v.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((r,n)=>{const i=this.\u03A0p(n,r);i!==void 0&&(this.\u03A0m.set(i,n),t.push(i))}),t}static createProperty(t,r=lt){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){const n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){const s=this[t];this[r]=i,this.requestUpdate(t,s,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||lt}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this.\u03A0m=new Map,this.hasOwnProperty("properties")){const r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(const i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const r=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const i of n)r.unshift(cr(i))}else t!==void 0&&r.push(cr(t));return r}static \u03A0p(t,r){const n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}u(){var t;this.\u03A0g=new Promise(r=>this.enableUpdating=r),this.L=new Map,this.\u03A0_(),this.requestUpdate(),(t=this.constructor.v)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this.\u03A0U)!==null&&r!==void 0?r:this.\u03A0U=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this.\u03A0U)===null||r===void 0||r.splice(this.\u03A0U.indexOf(t)>>>0,1)}\u03A0_(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this.\u03A0i.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;const r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Wl(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this.\u03A0U)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)}),this.\u03A0l&&(this.\u03A0l(),this.\u03A0o=this.\u03A0l=void 0)}enableUpdating(t){}disconnectedCallback(){var t;(t=this.\u03A0U)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)}),this.\u03A0o=new Promise(r=>this.\u03A0l=r)}attributeChangedCallback(t,r,n){this.K(t,n)}\u03A0j(t,r,n=lt){var i,s;const a=this.constructor.\u03A0p(t,n);if(a!==void 0&&n.reflect===!0){const o=((s=(i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==null&&s!==void 0?s:mt.toAttribute)(r,n.type);this.\u03A0h=t,o==null?this.removeAttribute(a):this.setAttribute(a,o),this.\u03A0h=null}}K(t,r){var n,i,s;const a=this.constructor,o=a.\u03A0m.get(t);if(o!==void 0&&this.\u03A0h!==o){const l=a.getPropertyOptions(o),c=l.converter,f=(s=(i=(n=c)===null||n===void 0?void 0:n.fromAttribute)!==null&&i!==void 0?i:typeof c=="function"?c:null)!==null&&s!==void 0?s:mt.fromAttribute;this.\u03A0h=o,this[o]=f(r,l.type),this.\u03A0h=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||On)(this[t],r)?(this.L.has(t)||this.L.set(t,r),n.reflect===!0&&this.\u03A0h!==t&&(this.\u03A0k===void 0&&(this.\u03A0k=new Map),this.\u03A0k.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this.\u03A0g=this.\u03A0q())}async \u03A0q(){this.isUpdatePending=!0;try{for(await this.\u03A0g;this.\u03A0o;)await this.\u03A0o}catch(r){Promise.reject(r)}const t=this.performUpdate();return t!=null&&await t,!this.isUpdatePending}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this.\u03A0i&&(this.\u03A0i.forEach((i,s)=>this[s]=i),this.\u03A0i=void 0);let r=!1;const n=this.L;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this.\u03A0U)===null||t===void 0||t.forEach(i=>{var s;return(s=i.hostUpdate)===null||s===void 0?void 0:s.call(i)}),this.update(n)):this.\u03A0$()}catch(i){throw r=!1,this.\u03A0$(),i}r&&this.E(n)}willUpdate(t){}E(t){var r;(r=this.\u03A0U)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}\u03A0$(){this.L=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.\u03A0g}shouldUpdate(t){return!0}update(t){this.\u03A0k!==void 0&&(this.\u03A0k.forEach((r,n)=>this.\u03A0j(n,this[n],r)),this.\u03A0k=void 0),this.\u03A0$()}updated(t){}firstUpdated(t){}}var ct,ur,ft,dr,ht,pr;pe.finalized=!0,pe.elementProperties=new Map,pe.elementStyles=[],pe.shadowRootOptions={mode:"open"},(at=(fr=globalThis).reactiveElementPlatformSupport)===null||at===void 0||at.call(fr,{ReactiveElement:pe}),((ot=(hr=globalThis).reactiveElementVersions)!==null&&ot!==void 0?ot:hr.reactiveElementVersions=[]).push("1.0.0-rc.2"),((ct=(pr=globalThis).litElementVersions)!==null&&ct!==void 0?ct:pr.litElementVersions=[]).push("3.0.0-rc.2");class me extends pe{constructor(){super(...arguments),this.renderOptions={host:this},this.\u03A6t=void 0}createRenderRoot(){var t,r;const n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){const r=this.render();super.update(t),this.\u03A6t=((n,i,s)=>{var a,o;const l=(a=s==null?void 0:s.renderBefore)!==null&&a!==void 0?a:i;let c=l._$litPart$;if(c===void 0){const f=(o=s==null?void 0:s.renderBefore)!==null&&o!==void 0?o:null;l._$litPart$=c=new Be(i.insertBefore($e(),f),f,void 0,s)}return c.I(n),c})(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.\u03A6t)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.\u03A6t)===null||t===void 0||t.setConnected(!1)}render(){return be}}me.finalized=!0,me._$litElement$=!0,(ft=(ur=globalThis).litElementHydrateSupport)===null||ft===void 0||ft.call(ur,{LitElement:me}),(ht=(dr=globalThis).litElementPlatformSupport)===null||ht===void 0||ht.call(dr,{LitElement:me});const vt=e=>e!=null?e:B,Fn=e=>t=>typeof t=="function"?((r,n)=>(window.customElements.define(r,n),n))(e,t):((r,n)=>{const{kind:i,elements:s}=n;return{kind:i,elements:s,finisher(a){window.customElements.define(r,a)}}})(e,t),Xl=(e,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,e)}};function G(e){return(t,r)=>r!==void 0?((n,i,s)=>{i.constructor.createProperty(s,n)})(e,t,r):Xl(e,t)}const Pn="Enter",Zl="Tab",mr=()=>{},Ql={label:"",value:"",select:mr,unselect:mr,disabled:!1,hidden:!1,selected:!1},Kl=En`.select-wrapper{position:relative}.select{bottom:0;display:flex;flex-wrap:wrap;left:0;position:absolute;right:0;top:0;width:var(--select-width,100%)}.label:focus{outline:var(--select-outline,2px solid #e3e3e3)}.label:after{border-bottom:1px solid var(--color,#000);border-right:1px solid var(--color,#000);box-sizing:border-box;content:"";display:block;height:10px;margin-top:-2px;transform:rotate(45deg);transition:.2s ease-in-out;width:10px}.label.visible:after{margin-bottom:-4px;margin-top:0;transform:rotate(225deg)}select{-webkit-appearance:none;-moz-appearance:none;appearance:none;position:relative;opacity:0}select[multiple]{z-index:0}.label,select{align-items:center;background-color:var(--background-color,#fff);border-radius:var(--border-radius,4px);border:var(--border-width,1px) solid var(--border-color,#000);box-sizing:border-box;color:var(--color,#000);cursor:pointer;display:flex;font-family:var(--font-family,inherit);font-size:var(--font-size,14px);font-weight:var(--font-weight,400);min-height:var(--select-height,44px);justify-content:space-between;padding:var(--padding,0 10px);width:100%;z-index:1}@media only screen and (hover:none) and (pointer:coarse){select{z-index:2}}.dropdown{background-color:var(--border-color,#000);border-radius:var(--border-radius,4px);border:var(--border-width,1px) solid var(--border-color,#000);display:none;flex-direction:column;gap:var(--border-width,1px);justify-content:space-between;max-height:calc(var(--select-height,44px) * var(--dropdown-items,4) + var(--border-width,1px) * calc(var(--dropdown-items,4) - 1));overflow-y:scroll;position:absolute;top:calc(var(--select-height,44px) + var(--dropdown-gap,0px));width:calc(100% - var(--border-width,1px) * 2);z-index:var(--dropdown-z-index,2)}.dropdown.visible{display:flex;z-index:100}.disabled{background-color:var(--disabled-background-color,#bdc3c7);color:var(--disabled-color,#ecf0f1);cursor:default}.multi-selected{background-color:var(--selected-background-color,#e3e3e3);border-radius:var(--border-radius,4px);color:var(--selected-color,#000);display:flex;gap:8px;justify-content:space-between;padding:2px 4px}.multi-selected-wrapper{display:flex;flex-wrap:wrap;gap:4px;width:calc(100% - 30px)}.cross:after{content:'\\00d7';display:inline-block;height:100%;text-align:center;width:12px}`,Jl=En`.option{align-items:center;background-color:var(--background-color,#fff);box-sizing:border-box;color:var(--color,#000);cursor:pointer;display:flex;font-family:var(--font-family,inherit);font-size:var(--font-size,14px);font-weight:var(--font-weight,400);height:var(--select-height,44px);height:var(--select-height,44px);justify-content:flex-start;padding:var(--padding,0 10px);width:100%}.option:not(.disabled):focus,.option:not(.disabled):not(.selected):hover{background-color:var(--hover-background-color,#e3e3e3);color:var(--hover-color,#000)}.selected{background-color:var(--selected-background-color,#e3e3e3);color:var(--selected-color,#000)}.disabled{background-color:var(--disabled-background-color,#e3e3e3);color:var(--disabled-color,#000);cursor:default}`;var X=function(e,t,r,n){var i,s=arguments.length,a=s<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,r):n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(e,t,r,n);else for(var o=e.length-1;o>=0;o--)(i=e[o])&&(a=(s<3?i(a):s>3?i(t,r,a):i(t,r))||a);return s>3&&a&&Object.defineProperty(t,r,a),a};let q=class extends me{constructor(){super(...arguments),this.isSelected=!1,this.isDisabled=!1,this.isHidden=!1,this.optionValue="",this.displayedLabel="",this.optionIndex=-1}static get styles(){return Jl}connectedCallback(){super.connectedCallback(),this.isSelected=this.getAttribute("selected")!==null,this.isDisabled=this.getAttribute("disabled")!==null,this.isHidden=this.getAttribute("hidden")!==null,this.optionValue=this.getAttribute("value")||"",this.assignDisplayedLabel(),this.fireOnReadyCallback()}getOption(){return{label:this.displayedLabel,value:this.optionValue,select:this.select,unselect:this.unselect,selected:this.isSelected,disabled:this.isDisabled,hidden:this.isHidden}}select(){this.isSelected=!0,this.setAttribute("selected","")}unselect(){this.isSelected=!1,this.removeAttribute("selected")}setOnReadyCallback(e,t){this.onReady=e,this.optionIndex=t}setOnSelectCallback(e){this.onSelect=e}render(){const e=["option"];return this.isSelected&&e.push("selected"),this.isDisabled&&e.push("disabled"),Ae`<div class="${e.join(" ")}" @click="${this.fireOnSelectCallback}" @keydown="${this.fireOnSelectIfEnterPressed}" tabindex="${vt(this.isDisabled?void 0:"0")}"><slot hidden @slotchange="${this.assignDisplayedLabel}"></slot>${this.displayedLabel}</div>`}assignDisplayedLabel(){this.textContent?this.displayedLabel=this.textContent:this.getAttribute("label")&&(this.displayedLabel=this.getAttribute("label")||"")}fireOnReadyCallback(){this.onReady&&this.onReady(this.getOption(),this.optionIndex)}fireOnSelectCallback(e){e.stopPropagation(),this.onSelect&&!this.isDisabled&&this.onSelect(this.optionValue)}fireOnSelectIfEnterPressed(e){e.key===Pn&&this.fireOnSelectCallback(e)}};X([G()],q.prototype,"isSelected",void 0),X([G()],q.prototype,"isDisabled",void 0),X([G()],q.prototype,"isHidden",void 0),X([G()],q.prototype,"optionValue",void 0),X([G()],q.prototype,"displayedLabel",void 0),X([G()],q.prototype,"optionIndex",void 0),X([k],q.prototype,"getOption",null),X([k],q.prototype,"select",null),X([k],q.prototype,"unselect",null),X([k],q.prototype,"fireOnReadyCallback",null),q=X([Fn("option-pure")],q);var P=function(e,t,r,n){var i,s=arguments.length,a=s<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,r):n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(e,t,r,n);else for(var o=e.length-1;o>=0;o--)(i=e[o])&&(a=(s<3?i(a):s>3?i(t,r,a):i(t,r))||a);return s>3&&a&&Object.defineProperty(t,r,a),a};let F=class extends me{constructor(){super(...arguments),this.options=[],this.visible=!1,this.selectedOption=Ql,this._selectedOptions=[],this.disabled=!1,this.isMultipleSelect=!1,this.name="",this._id="",this.formName="",this.value="",this.values=[],this.defaultLabel="",this.totalRenderedChildOptions=-1,this.form=null,this.hiddenInput=null}static get styles(){return Kl}connectedCallback(){super.connectedCallback(),this.disabled=this.getAttribute("disabled")!==null,this.isMultipleSelect=this.getAttribute("multiple")!==null,this.name=this.getAttribute("name")||"",this._id=this.getAttribute("id")||"",this.formName=this.name||this.id,this.defaultLabel=this.getAttribute("default-label")||""}open(){this.disabled||(this.visible=!0,this.removeEventListeners(),document.body.addEventListener("click",this.close,!0))}close(e){e&&this.contains(e.target)||(this.visible=!1,this.removeEventListeners())}enable(){this.disabled=!1}disable(){this.disabled=!0}get selectedIndex(){var e;return(e=this.nativeSelect)===null||e===void 0?void 0:e.selectedIndex}set selectedIndex(e){(e||e===0)&&this.selectOptionByValue(this.options[e].value)}get selectedOptions(){var e;return(e=this.nativeSelect)===null||e===void 0?void 0:e.selectedOptions}render(){const e=["label"];return this.disabled&&e.push("disabled"),this.visible&&e.push("visible"),Ae`<div class="select-wrapper"><select @change="${this.handleNativeSelectChange}" ?disabled="${this.disabled}" ?multiple="${this.isMultipleSelect}" name="${vt(this.name||void 0)}" id="${vt(this.id||void 0)}" size="1">${this.getNativeOptionsHtml()}</select><div class="select"><div class="${e.join(" ")}" @click="${this.visible?this.close:this.open}" @keydown="${this.openDropdownIfProperKeyIsPressed}" tabindex="0">${this.getDisplayedLabel()}</div><div class="dropdown${this.visible?" visible":""}"><slot @slotchange="${this.initializeSelect}"></slot></div></div></div>`}handleNativeSelectChange(){var e;this.selectedIndex=(e=this.nativeSelect)===null||e===void 0?void 0:e.selectedIndex}getNativeOptionsHtml(){return this.options.map(this.getSingleNativeOptionHtml)}getSingleNativeOptionHtml({value:e,label:t,hidden:r,disabled:n}){return Ae`<option value="${e}" ?selected="${this.isOptionSelected(e)}" ?hidden="${r}" ?disabled="${n}">${t}</option>`}isOptionSelected(e){let t=this.selectedOption.value===e;return this.isMultipleSelect&&(t=Boolean(this._selectedOptions.find(r=>r.value===e))),t}openDropdownIfProperKeyIsPressed(e){e.key!==Pn&&e.key!==Zl||this.open()}getDisplayedLabel(){return this.isMultipleSelect&&this._selectedOptions.length?this.getMultiSelectLabelHtml():this.selectedOption.label||this.defaultLabel}getMultiSelectLabelHtml(){return Ae`<div class="multi-selected-wrapper">${this._selectedOptions.map(this.getMultiSelectSelectedOptionHtml)}</div>`}getMultiSelectSelectedOptionHtml({label:e,value:t}){return Ae`<span class="multi-selected">${e} <span class="cross" @click="${r=>this.fireOnSelectCallback(r,t)}"></span></span>`}fireOnSelectCallback(e,t){e.stopPropagation(),this.selectOptionByValue(t)}initializeSelect(){this.processChildOptions(),this.selectDefaultOptionIfNoneSelected(),this.appendHiddenInputToClosestForm()}processChildOptions(){const e=this.querySelectorAll("option-pure");this.totalRenderedChildOptions=e.length;for(let t=0;t<e.length;t++)this.initializeSingleOption(e[t],t)}selectDefaultOptionIfNoneSelected(){!this.selectedOption.value&&!this.isMultipleSelect&&this.options.length&&this.selectOptionByValue(this.options[0].value)}initializeSingleOption(e,t){e.setOnSelectCallback(this.selectOptionByValue),this.options[t]=e.getOption(),this.options[t].selected&&this.selectOptionByValue(this.options[t].value)}removeEventListeners(){document.body.removeEventListener("click",this.close)}appendHiddenInputToClosestForm(){this.form=this.closest("form"),this.form&&!this.hiddenInput&&(this.hiddenInput=document.createElement("input"),this.hiddenInput.setAttribute("type","hidden"),this.hiddenInput.setAttribute("name",this.formName),this.form.appendChild(this.hiddenInput))}unselectAllOptions(){for(let e=0;e<this.options.length;e++)this.options[e].unselect()}selectOptionByValue(e){const t=this.options.find(({value:r})=>r===e);t&&this.setSelectValue(t)}setSelectValue(e){this.isMultipleSelect?this.setMultiSelectValue(e):this.setSingleSelectValue(e),this.updateHiddenInputInForm(),this.dispatchChangeEvent()}dispatchChangeEvent(){this.dispatchEvent(new Event("change"))}setMultiSelectValue(e){const t=this._selectedOptions.indexOf(e);t!==-1?(this.values.splice(t,1),this._selectedOptions.splice(t,1),e.unselect()):(this.values.push(e.value),this._selectedOptions.push(e),e.select()),this.requestUpdate()}setSingleSelectValue(e){this.unselectAllOptions(),this.close(),this.selectedOption=e,this.value=e.value,e.select()}updateHiddenInputInForm(){if(!this.form||!this.hiddenInput)return;this.hiddenInput.value=this.isMultipleSelect?this.values.join(","):this.value;const e=new Event("change",{bubbles:!0});this.hiddenInput.dispatchEvent(e)}};P([G()],F.prototype,"options",void 0),P([G()],F.prototype,"visible",void 0),P([G()],F.prototype,"selectedOption",void 0),P([G()],F.prototype,"_selectedOptions",void 0),P([G()],F.prototype,"disabled",void 0),P([G()],F.prototype,"isMultipleSelect",void 0),P([G()],F.prototype,"name",void 0),P([G()],F.prototype,"_id",void 0),P([G()],F.prototype,"formName",void 0),P([G()],F.prototype,"value",void 0),P([G()],F.prototype,"values",void 0),P([G()],F.prototype,"defaultLabel",void 0),P([G()],F.prototype,"totalRenderedChildOptions",void 0),P([function(e,t){return(({finisher:r,descriptor:n})=>(i,s)=>{var a;if(s===void 0){const o=(a=i.originalKey)!==null&&a!==void 0?a:i.key,l=n!=null?{kind:"method",placement:"prototype",key:o,descriptor:n(i.key)}:{...i,key:o};return r!=null&&(l.finisher=function(c){r(c,o)}),l}{const o=i.constructor;n!==void 0&&Object.defineProperty(i,s,n(s)),r==null||r(o,s)}})({descriptor:r=>{const n={get(){var i;return(i=this.renderRoot)===null||i===void 0?void 0:i.querySelector(e)},enumerable:!0,configurable:!0};if(t){const i=typeof r=="symbol"?Symbol():"__"+r;n.get=function(){var s;return this[i]===void 0&&(this[i]=(s=this.renderRoot)===null||s===void 0?void 0:s.querySelector(e)),this[i]}}return n}})}("select")],F.prototype,"nativeSelect",void 0),P([k],F.prototype,"close",null),P([k],F.prototype,"getSingleNativeOptionHtml",null),P([k],F.prototype,"getMultiSelectLabelHtml",null),P([k],F.prototype,"getMultiSelectSelectedOptionHtml",null),P([k],F.prototype,"initializeSelect",null),P([k],F.prototype,"initializeSingleOption",null),P([k],F.prototype,"removeEventListeners",null),P([k],F.prototype,"appendHiddenInputToClosestForm",null),P([k],F.prototype,"selectOptionByValue",null),F=P([Fn("select-pure")],F);class ec{constructor(){p(this,"_cpu");p(this,"_gpu");p(this,"_view");p(this,"_size");p(this,"_rtManager")}setup(t){const{renderEnv:r}=An,n=this._size=4*7;this._cpu=new Float32Array(n*r.width*r.height),this._gpu=se(this._cpu,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC),this._view=Sn(n*r.width*r.height*4,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST),this._rtManager=t,this._rtManager.rtUnit.setUniform("u_debugInfo",this._cpu,this._gpu)}run(t){t.copyBuffer(this._gpu,this._view,this._cpu.byteLength)}async showDebugInfo(t,r,n){await this._view.mapAsync(GPUMapMode.READ);const i=new Float32Array(this._view.getMappedRange()),s=this._decodeDebugInfo(i,t,r,n),a=new Float32Array(s.length*6*3),o=new Float32Array(s.length*6*3),l=new Uint32Array(s.length*6);s.forEach(({preOrigin:d,preDir:h,origin:v,dir:g,nextOrigin:m,nextDir:_},y)=>{const x=y*3*6,M=y*6;a.set(d.slice(0,3),x),a.set(h.slice(0,3),x+3),o.set([1,0,0],x),o.set([1,0,0],x+3),a.set(v.slice(0,3),x+6),a.set(g.slice(0,3),x+9),o.set([0,1,0],x+6),o.set([0,1,0],x+9),a.set(m.slice(0,3),x+12),a.set(_.slice(0,3),x+15),o.set([0,0,1],x+12),o.set([0,0,1],x+15),l.set([y*3,y*3+1,y*3+2,y*3+3,y*3+4,y*3+5],M)});const c=new ne([{layout:{arrayStride:3*4,attributes:[{name:"position",shaderLocation:0,offset:0,format:"float32x3"}]},data:a},{layout:{arrayStride:3*4,attributes:[{name:"color_0",shaderLocation:1,offset:0,format:"float32x3"}]},data:o}],l,s.length*6),f=new Y(E.rColor,{u_color:new Float32Array([1,1,1])},void 0,{cullMode:"none",primitiveType:"line-list",depthCompare:"always"}),u=new Z(c,f);return this._view.unmap(),{rays:s,mesh:u}}_decodeDebugInfo(t,r,n,i){const s=[],a=[];for(let o=r[1];o<r[1]+n[1]*i[1];o+=i[1])for(let l=r[0];l<r[0]+n[0]*i[0];l+=i[0]){const f=(o*T.width+l)*this._size;s.push({preOrigin:t.slice(f,f+4),preDir:t.slice(f+4,f+8),origin:t.slice(f+8,f+12),dir:t.slice(f+12,f+16),nextOrigin:t.slice(f+16,f+20),nextDir:t.slice(f+20,f+24),normal:t.slice(f+24,f+28)})}return console.log(a.join(`
`)),s}}const tc="./demo/assets/models/walls/scene.gltf";function rc(e){const t=`
<select-pure name="View Mode" id="view-mode" style="position:absolute;right:0;width:128px;">
  <option-pure value="result">Result</option-pure>
  <option-pure value="bvh">Show BVH</option-pure>
  <option-pure value="gbuffer">Show GBuffer</option-pure>
  <option-pure value="origin">Origin</option-pure>
</select-pure>
  `,r=document.createElement("div");return r.innerHTML=t,document.body.appendChild(r),document.querySelector("select-pure").addEventListener("change",i=>{const s=i.target.value;e(s)}),r}class nc{constructor(){p(this,"_scene");p(this,"_camControl");p(this,"_camera");p(this,"_model");p(this,"_noiseTex");p(this,"_gBufferRT");p(this,"_gbufferLightMaterial");p(this,"_gBufferDebugMesh");p(this,"_rtManager");p(this,"_rtOutput");p(this,"_denoiseRTs");p(this,"_denoiseTemporUnit");p(this,"_denoiseSpaceUnit");p(this,"_rtTone");p(this,"_rtDebugInfo");p(this,"_rtDebugMesh");p(this,"_frameCount",0);p(this,"_viewMode","result")}async init(){rc(s=>{console.log(s),this._viewMode=s,this._frameCount=0});const{renderEnv:t}=An,r=this._scene=new Ot,n=this._scene.rootNode=new ee;this._camControl=new Pt("free"),n.addChild(this._camera=new Fe({clearColor:[0,1,0,1]},{near:.01,far:100,fov:Math.PI/3})),this._camera.pos.set([0,0,6]),this._noiseTex=await ze.load({type:"texture",name:"noise.tex",src:"./demo/assets/textures/noise-rgba.webp"});const i=this._model=await ze.load({type:"gltf",name:"scene.gltf",src:tc});i.cameras.length&&(this._camera=i.cameras[0]),r.rootNode.addChild(i.rootNode),this._gBufferRT=new re({width:t.width,height:t.height,colors:[{name:"positionMetalOrSpec",format:"rgba16float"},{name:"baseColorRoughOrGloss",format:"rgba16float"},{name:"normalGlass",format:"rgba16float"},{name:"meshIndexMatIndexMatType",format:"rgba8uint"}],depthStencil:{needStencil:!1}}),this._gbufferLightMaterial=new Y(E.rRTGBufferLight),this._gBufferDebugMesh=new Oe(new Y(E.iRTGShow)),this._connectGBufferRenderTexture(this._gBufferDebugMesh.material),this._rtOutput=new re({width:t.width,height:t.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),this._denoiseRTs={current:new re({width:t.width,height:t.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),pre:new re({width:t.width,height:t.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]}),final:new re({width:t.width,height:t.height,forCompute:!0,colors:[{name:"color",format:"rgba16float"}]})},this._denoiseSpaceUnit=new Pe(E.cRTDenoiseSpace,{x:Math.ceil(t.width/16),y:Math.ceil(t.height/16)},void 0,{WINDOW_SIZE:7}),this._denoiseTemporUnit=new Pe(E.cRTDenoiseTempor,{x:Math.ceil(t.width/16),y:Math.ceil(t.height/16)}),this._connectGBufferRenderTexture(this._denoiseSpaceUnit),this._rtTone=new Oe(new Y(E.iTone)),this._rtDebugInfo=new ec,this._camControl.control(this._camera,new ee),this._camControl.onChange=()=>{this._frameCount=0},await this._frame(16)}async update(t){await this._frame(t)}async _frame(t){const{_scene:r}=this;this._frameCount+=1;const n=(this._frameCount-1)/this._frameCount;if(n>.999)return;r.startFrame(t),!this._rtManager&&(this._rtManager=new ce,this._rtManager.process(this._scene.cullCamera(this._camera),this._rtOutput),this._rtManager.rtUnit.setUniform("u_noise",this._noiseTex),this._connectGBufferRenderTexture(this._rtManager.rtUnit)),this._rtManager.rtUnit.setUniform("u_randoms",new Float32Array(16).map(s=>Math.random())),this._denoiseTemporUnit.setUniform("u_preWeight",new Float32Array([n])),this._viewMode==="bvh"?this._showBVH():this._viewMode==="gbuffer"?(this._renderGBuffer(),this._showGBufferResult()):(this._renderGBuffer(),this._scene.setRenderTarget(null),this._computeRTSS(),this._viewMode==="result"?this._computeDenoise():this._rtTone.material.setUniform("u_texture",this._rtOutput),this._scene.renderImages([this._rtTone])),this._rtDebugMesh&&r.renderCamera(this._camera,[this._rtDebugMesh],!1),r.endFrame()}_renderGBuffer(){this._scene.setRenderTarget(this._gBufferRT);const t=this._scene.lights.map(r=>r.requireLightMesh(this._gbufferLightMaterial)).filter(r=>!!r);this._scene.renderCamera(this._camera,[this._rtManager.gBufferMesh,...t])}_computeRTSS(){this._scene.computeUnits([this._rtManager.rtUnit])}_computeDenoise(){const{current:t,pre:r,final:n}=this._denoiseRTs;this._denoiseTemporUnit.setUniform("u_pre",r),this._denoiseTemporUnit.setUniform("u_current",this._rtOutput),this._denoiseTemporUnit.setUniform("u_output",t),this._denoiseSpaceUnit.setUniform("u_preFilter",t),this._denoiseSpaceUnit.setUniform("u_output",n),this._scene.computeUnits([this._denoiseTemporUnit,this._denoiseSpaceUnit]),this._denoiseRTs.pre=n,this._denoiseRTs.final=r,this._rtTone.material.setUniform("u_texture",n)}_showGBufferResult(){this._scene.setRenderTarget(null),this._scene.renderImages([this._gBufferDebugMesh])}_showBVH(){this._scene.setRenderTarget(null),this._scene.renderCamera(this._camera,[...this._scene.cullCamera(this._camera),this._rtManager.bvhDebugMesh])}_connectGBufferRenderTexture(t){t.setUniform("u_gbPositionMetalOrSpec",this._gBufferRT,"positionMetalOrSpec"),t.setUniform("u_gbBaseColorRoughOrGloss",this._gBufferRT,"baseColorRoughOrGloss"),t.setUniform("u_gbNormalGlass",this._gBufferRT,"normalGlass"),t.setUniform("u_gbMeshIndexMatIndexMatType",this._gBufferRT,"meshIndexMatIndexMatType")}}const de=document.createElement("div");de.style.position="fixed";de.style.left=de.style.top="0";de.style.color="red";de.style.fontSize="24px";document.body.append(de);const zn=new nc;let vr=0;async function ic(e){await zn.update(e);const t=1e3/e;Math.abs(t-vr)>2&&(de.innerText=`${t.toFixed(2)}fps`),vr=t}async function sc(){await In(document.querySelector("canvas#mainCanvas")),await zn.init();let e=0;async function t(r){await ic(r-e),e=r,requestAnimationFrame(t)}await t(performance.now())}sc();
