/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import * as H from '../src/index';
const {math} = H;

class APP {
  private _scene: H.Scene;
  private _camera: H.Camera;
  private _mesh: H.Mesh;
  private _rt: H.RenderTexture;
  private _csRT: H.RenderTexture;
  private _imageMesh: H.ImageMesh;
  private _blurUnit: H.ComputeUnit;

  public async init() {
    const _scene = this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();

    this._camera = new H.Camera(
      {clearColor: [0, 1, 0, 1]},
      {near: 0.01, far: 100, fov: Math.PI / 3}
    );
    rootNode.addChild(this._camera);
    this._camera.pos.set([0, 0, 10]);

    const geometry = new H.Geometry(
      {
        arrayStride: 4 * 8,
        attributes: [
          {
            name: 'position',
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3' as GPUVertexFormat
          },
          {
            name: 'texcoord_0',
            shaderLocation: 1,
            offset: 4 * 3,
            format: 'float32x2' as GPUVertexFormat
          },
          {
            name: 'normal',
            shaderLocation: 2,
            offset: 4 * 5,
            format: 'float32x3' as GPUVertexFormat
          }
        ]
      },
      new Float32Array([
        -1, -1, 0, 0, 1, 0, 0, 0,
        1, -1, 0, 1, 1, 0, 0, 0,
        -1, 1, 0, 0, 0, 0, 0, 0,
        1, 1, 0, 1, 0, 0, 0, 0,
      ]),
      new Uint16Array([0, 1, 2, 2, 1, 3]),
      6
    );
    const texture = await H.resource.load({type: 'texture', name: 'uv-debug.tex', src: require('./assets/textures/uv-debug.png')});
    const effect = new H.Effect({
      vs: require('./assets/shaders/test/vertex.vert.wgsl'),
      fs: require('./assets/shaders/test/fragment.frag.wgsl'),
      uniformDesc: {
        uniforms: [
          {
            name: 'u_world',
            type: 'mat4x4',
            defaultValue: H.math.mat4.identity(new Float32Array(16)) as Float32Array
          },
          {
            name: 'u_vp',
            type: 'mat4x4',
            defaultValue: H.math.mat4.identity(new Float32Array(16)) as Float32Array
          }
        ],
        textures: [
          {
            name: 'u_texture',
            defaultValue: texture
          }
        ],
        samplers: [
          {
            name: 'u_sampler',
            defaultValue: {magFilter: 'linear', minFilter: 'linear'}
          }
        ]
      },
      marcos: {
        USE_TEXCOORD_0: false,
        USE_NORMAL: false,
        USE_TANGENT: false,
        USE_COLOR_0: false,
        USE_TEXCOORD_1: false
      }
    });
    const material = new H.Material(effect);
    this._mesh = new H.Mesh(geometry, material);
    _scene.rootNode.addChild(this._mesh);

    this._rt = new H.RenderTexture(H.renderEnv.width, H.renderEnv.height);
    // this._csRT = new H.RenderTexture(H.renderEnv.width, H.renderEnv.height, true);
    // this._blurUnit = new H.ComputeUnit(
    //   H.buildinEffects.cCreateSimpleBlur(2),
    //   {x: Math.ceil(H.renderEnv.width / 5), y: Math.ceil(H.renderEnv.height / 5)},
    //   {
    //     u_input: this._rt,
    //     u_output: this._csRT,
    //     // u_kernel: new Float32Array([1])
    //   }
    // );
    // this._imageMesh = new H.ImageMesh(new H.Material(H.buildinEffects.iBlit, {u_texture: this._csRT}));

    const model = await H.resource.load({type: 'gltf', name: 'soda.gltf', src: '/assets/models/soda/scene.gltf'});
    _scene.rootNode.addChild(model.rootNode);
    console.log(model);

    this._test();
  }

  protected _test() {
    const {device} = H.renderEnv;
    const {_scene} = this;

    _scene.startFrame();
    _scene.renderCamera(this._camera, _scene.cullCamera(this._camera));
    _scene.endFrame();
  }
  
  public loop(dt: number) {
    const {_scene} = this;

    // H.math.quat.rotateZ(this._mesh.quat, this._mesh.quat, 0.01);

    // _scene.startFrame();
    // _scene.setRenderTarget(this._rt);
    // _scene.renderCamera(this._camera, _scene.cullCamera(this._camera));
    // _scene.computeUnits([this._blurUnit]);
    // _scene.setRenderTarget(null);
    // _scene.renderImages([this._imageMesh]);
    // _scene.endFrame();
  }
}


async function main() {
  await H.init(document.querySelector<HTMLCanvasElement>('canvas#mainCanvas'));
  const app = new APP();

  await app.init();
  
  let t = 0;
  function _loop(ct: number) {
    app.loop(ct - t);
    t = ct;
    requestAnimationFrame(_loop);
  }

  _loop(performance.now());
}

main();
