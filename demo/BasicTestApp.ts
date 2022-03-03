/**
 * BasicTestApp.ts
 * 
 * @Author  : hikaridai(hikaridai@tencent.com)
 * @Date    : 6/11/2021, 5:53:03 PM
*/
import * as H from '../src/index';

export default class BasicTestApp {
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
      // {near: 0.01, far: 100, fov: Math.PI / 3}
      {near: 0.01, far: 100, isOrth: true, sizeX: 4, sizeY: 4}
    );
    rootNode.addChild(this._camera);
    this._camera.pos.set([0, 0, 6]);
    console.log(this._camera)

    // const geometry = new H.Geometry(
    //   [
    //     {
    //       layout: {
    //         arrayStride: 3 * 4,
    //         attributes: [
    //           {
    //             name: 'position',
    //             shaderLocation: 0,
    //             offset: 0,
    //             format: 'float32x3' as GPUVertexFormat
    //           }
    //         ]
    //       },
    //       data: new Float32Array([
    //         -1, -1, 0,
    //         1, -1, 0,
    //         -1, 1, 0,
    //         1, 1, 0,
    //       ])
    //     },
    //     {
    //       layout: {
    //         arrayStride: 2 * 4,
    //         attributes: [
    //           {
    //             name: 'texcoord_0',
    //             shaderLocation: 1,
    //             offset: 0,
    //             format: 'float32x2' as GPUVertexFormat
    //           }
    //         ]
    //       },
    //       data: new Float32Array([
    //         0, 1,
    //         1, 1,
    //         0, 0,
    //         1, 0,
    //       ])
    //     },
    //   ],
    //   new Uint16Array([0, 1, 2, 2, 1, 3]),
    //   6
    // );
    const texture = await H.resource.load({type: 'texture', name: 'uv-debug.tex', src: './demo/assets/textures/uv-debug.png'});
    // const effect = new H.Effect('test', {
    //   vs: require('./assets/shaders/test/vertex.vert.wgsl'),
    //   fs: require('./assets/shaders/test/fragment.frag.wgsl'),
    //   uniformDesc: {
    //     uniforms: [
    //       {
    //         name: 'u_color',
    //         type: 'vec3',
    //         defaultValue: new Float32Array([1., .1, .1]) as Float32Array
    //       }
    //     ],
    //     textures: [
    //       {
    //         name: 'u_texture',
    //         defaultValue: texture
    //       }
    //     ],
    //     samplers: [
    //       {
    //         name: 'u_sampler',
    //         defaultValue: {magFilter: 'linear', minFilter: 'linear'}
    //       }
    //     ]
    //   },
    //   marcos: {
    //     USE_TEXCOORD_0: false,
    //     USE_NORMAL: false,
    //     USE_TANGENT: false,
    //     USE_COLOR_0: false,
    //     USE_TEXCOORD_1: false
    //   }
    // });
    // const material = new H.Material(effect);
    // this._mesh = new H.Mesh(geometry, material);
    // _scene.rootNode.addChild(this._mesh);

    // this._rt = new H.RenderTexture({
    //   width: H.renderEnv.width,
    //   height: H.renderEnv.height,
    //   colors: [{}]
    // });

    this._csRT = new H.RenderTexture({width: H.renderEnv.width, height: H.renderEnv.height, forCompute: true, colors: [{}]});
    this._blurUnit = new H.ComputeUnit(
      H.buildinEffects.cCreateSimpleBlur(2),
      {x: Math.ceil(H.renderEnv.width / 5), y: Math.ceil(H.renderEnv.height / 5)},
      {
        u_input: texture,
        u_output: this._csRT,
        // u_kernel: new Float32Array([1])
      }
    );
    this._imageMesh = new H.ImageMesh(new H.Material(H.buildinEffects.iBlit, {u_texture: this._csRT}));

    // const model = await H.resource.load({type: 'gltf', name: 'soda.gltf', src: '/assets/models/soda/scene.gltf'});
    // if (model.cameras.length) {
    //   this._camera = model.cameras[0];
    // }
    // _scene.rootNode.addChild(model.rootNode);
    // console.log(model);

    this._test(0);
  }

  protected _test(dt: number) {
    const {device} = H.renderEnv;
    const {_scene} = this;

    _scene.startFrame(dt);
    // _scene.renderCamera(this._camera, _scene.cullCamera(this._camera));
    _scene.computeUnits([this._blurUnit]);
    _scene.renderImages([this._imageMesh]);
    _scene.endFrame();
  }
  
  public async update(dt: number) {
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
