/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2021/6/5下午2:44:28
 */
import * as H from '../src/index';

class APP {
  private _scene: H.Scene;
  private _camera: H.Camera;
  private _mesh: H.Mesh;

  public init() {
    this._scene = new H.Scene();
    const rootNode = this._scene.rootNode = new H.Node();

    this._camera = new H.Camera(
      {},
      {near: 0.1, far: 100, fov: Math.PI / 3}
    );
    rootNode.addChild(this._camera);

    const geometry = new H.Geometry(
      {
        arrayStride: 4 * 5,
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3' as GPUVertexFormat
          },
          {
            shaderLocation: 1,
            offset: 4 * 3,
            format: 'float32x2' as GPUVertexFormat
          }
        ]
      },
      new Float32Array([
        -1, -1, 0, 0, 1,
        1, -1, 0, 1, 1, 
        -1, 1, 0, 0, 0,
        1, 1, 0, 1, 0
      ]).buffer,
      new Uint16Array([0, 1, 2, 2, 1, 3]).buffer,
      6
    );
    const material = new H.Material(
      require('./assets/shaders/test/vertex.vert.wgsl'),
      require('./assets/shaders/test/fragment.frag.wgsl'),
      {
        uniforms: [
          // {
          //   name: 'u_world',
          //   type: H.EUniformType.Buffer,
          //   defaultValue: H.math.mat4.identity(new Float32Array(16)) as Float32Array
          // },
          // {
          //   name: 'u_vp',
          //   type: H.EUniformType.Buffer,
          //   defaultValue: H.math.mat4.identity(new Float32Array(16)) as Float32Array
          // },
          {
            name: 'u_sampler',
            type: H.EUniformType.Sampler,
            defaultValue: {magFilter: 'linear', minFilter: 'linear'}
          },
          {
            name: 'u_texture',
            type: H.EUniformType.Texture,
            defaultValue: new H.Texture(256, 256, require('./assets/textures/uv-debug.png'))
          }
        ]
      }
    );
    this._mesh = new H.Mesh(geometry, material);
    this._scene.rootNode.addChild(this._mesh);

    console.log(geometry, material)
  }
  
  public loop(dt: number) {
    const {_scene} = this;

    H.math.vec3.rotateZ(this._mesh.pos, this._mesh.pos, [0, 0, 1], 0.01);

    _scene.startFrame();
    _scene.setRenderTarget(null);
    _scene.renderCamera(this._camera, _scene.cullCamera(this._camera));
    _scene.endFrame();
  }
}


async function main() {
  await H.init(document.querySelector<HTMLCanvasElement>('canvas#mainCanvas'));
  const app = new APP();

  app.init();
  
  let t = 0;
  function _loop(ct: number) {
    app.loop(ct - t);
    t = ct;
    requestAnimationFrame(_loop);
  }

  _loop(performance.now());
}

main();
