/**
 * @File   : BVH.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/15/2021, 11:14:51 PM
 */
import {buildinEffects} from '../buildin';
import Geometry from '../core/Geometry';
import HObject from '../core/HObject';
import ImageMesh from '../core/ImageMesh';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import {createGPUBufferBySize, TTextureSource, TTypedArray} from '../core/shared';
import Texture from '../core/Texture';

export interface IBVHAttributeValue<TArrayType = Float32Array> {
  value: TArrayType;
  length: number;
  format: GPUVertexFormat;
};

export default class BVH extends HObject {
  public static CLASS_NAME: string = 'BVH';
  public static RESIZE_CANVAS: HTMLCanvasElement;
  public static RESIZE_CTX: CanvasRenderingContext2D;
  public isBVH: boolean = true;

  protected _attributesInfo: {
    position: IBVHAttributeValue,
    texcoord_0: IBVHAttributeValue,
    normal: IBVHAttributeValue,
    meshMatIndex: IBVHAttributeValue<Uint32Array>
  };
  protected _indexInfo: {
    value: Uint16Array
  };
  protected _materials: Material[] = [];
  protected _commonUniforms: {
    matId2TexturesId: Uint32Array;
    worldMatrixes: Float32Array;
    baseColorFactors: Float32Array;
    metallicRoughnessFactors: Float32Array;
    baseColorTextures: Texture;
    normalTextures: Texture;
    metallicRoughnessTextures: Texture;
  };
  // protected _bvhGPUBuffer: GPUBuffer;
  // protected _uniformBuffers: {
  //   position: Float32Array,
  //   texcoord_0: Float32Array,
  //   normal: Float32Array,
  //   tangent: Float32Array
  // };
  protected _gBufferMesh: Mesh;
  protected _rtMesh: ImageMesh;

  get gBufferMesh() {
    return this._gBufferMesh;
  }

  get rtMesh() {
    return this._rtMesh;
  }

  // batch all meshes and build bvh
  public process(meshes: Mesh[]) {
    this._buildAttributeBuffers(meshes);
    this._buildCommonUniforms(this._materials);
    this._buildGBufferMesh();

    this._buildBVH();
  }

  protected _buildAttributeBuffers(meshes: Mesh[]) {
    const {_materials} = this;

    let indexCount: number = 0;
    let vertexCount: number = 0;
    meshes.forEach(mesh => {
      vertexCount += mesh.geometry.vertexCount;
      indexCount += mesh.geometry.count;
    });

    const {value: indexes} = this._indexInfo = {
      value: new Uint16Array(indexCount)
    };

    const {position, texcoord_0, normal, meshMatIndex} = this._attributesInfo = {
      position: {
        value: new Float32Array(vertexCount * 3),
        length: 3,
        format: 'float32x3'
      },
      texcoord_0: {
        value: new Float32Array(vertexCount * 2),
        length: 2,
        format: 'float32x2'
      },
      normal: {
        value: new Float32Array(vertexCount * 3),
        length: 3,
        format: 'float32x3'
      },
      meshMatIndex: {
        value: new Uint32Array(vertexCount * 2),
        length: 2,
        format: 'uint32x2'
      }
    };

    let attrOffset: number = 0;
    let indexOffset: number = 0;
    meshes.forEach(mesh => {
      const {geometry, material} = mesh;
      const {indexData, vertexInfo, vertexCount, count} = geometry;

      let materialIndex = _materials.indexOf(material);
      if (materialIndex < 0) {
        _materials.push(material);
        materialIndex = _materials.length - 1;
      }

      indexData.forEach((value, index) => {
        indexes[index + indexOffset] = value + attrOffset;
      });

      if (!vertexInfo.normal) {
        geometry.calculateNormals();
      }

      for (let index = 0; index < vertexCount; index += 1) {
        this._copyAttribute(vertexInfo.position, position, index);
        this._copyAttribute(vertexInfo.texcoord_0, texcoord_0, index);
        this._copyAttribute(vertexInfo.normal, normal, index);
        
        meshMatIndex.value.set([index, materialIndex], index * meshMatIndex.length);
      }
      
      indexOffset += count;
      attrOffset += vertexCount;
    });
  }

  protected _copyAttribute(
    src: {offset: number, stride: number, data: TTypedArray, length: number},
    dst: IBVHAttributeValue,
    index: number
  ) {
    const srcOffset = src.offset + index * src.stride;

    dst.value.set(
      src.data.slice(srcOffset, srcOffset + src.length),
      index * dst.length
    );
  }

  protected _buildCommonUniforms(materials: Material[]) {
    const matId2TexturesId = new Uint32Array(materials.length * 4);
    const worldMatrixes = new Float32Array(materials.length * 16);
    const baseColorFactors = new Float32Array(materials.length * 4).fill(1);
    const metallicRoughnessFactors = new Float32Array(materials.length * 2).fill(1);
    const baseColorTextures: Texture[] = [];
    const normalTextures: Texture[] = [];
    const metallicRoughnessTextures: Texture[] = [];

    materials.forEach((mat, index) => {
      const worldMatrix = mat.getUniform('u_world') as Float32Array;
      const baseColorFactor = mat.getUniform('u_baseColorFactor') as Float32Array;
      const metallicFactor = mat.getUniform('u_metallicFactor') as Float32Array;
      const roughnessFactor = mat.getUniform('u_roughnessFactor') as Float32Array;
      const baseColorTexture = mat.getUniform('u_baseColorTexture') as Texture;
      const normalTexture = mat.getUniform('u_normalTexture') as Texture;
      const metallicRoughnessTexture = mat.getUniform('u_metallicRoughnessTexture') as Texture;

      worldMatrixes.set(worldMatrix, index * 16);
      baseColorFactor && baseColorFactors.set(baseColorFactor, index * 4);
      metallicFactor !== undefined && metallicRoughnessFactors.set(metallicFactor.slice(0, 1), index * 2);
      roughnessFactor !== undefined && metallicRoughnessFactors.set(roughnessFactor.slice(0, 1), index * 2 + 1);
      
      const mid = index * 4;
      this._setTextures(mid, baseColorTextures, baseColorTexture, matId2TexturesId);
      this._setTextures(mid + 1, normalTextures, normalTexture, matId2TexturesId);
      this._setTextures(mid + 2, metallicRoughnessTextures, metallicRoughnessTexture, matId2TexturesId);
    });

    this._commonUniforms = {
      matId2TexturesId,
      worldMatrixes,
      baseColorFactors,
      metallicRoughnessFactors,
      baseColorTextures: this._generateTextureArray(baseColorTextures),
      normalTextures: this._generateTextureArray(normalTextures),
      metallicRoughnessTextures: this._generateTextureArray(metallicRoughnessTextures)
    };
  }

  protected _generateTextureArray(textures: Texture[]): Texture {
    let width: number = 0;
    let height: number = 0;

    textures.forEach(tex => {
      width = Math.max(width, tex.width);
      height = Math.max(height, tex.height);
    });

    const images = textures.map(tex => {
      if (tex.width === width && tex.height === height) {
        return tex.source as TTextureSource;
      }

      if (!(tex.source instanceof ImageBitmap)) {
        throw new Error('Can only resize image bitmap!');
      }

      if (!BVH.RESIZE_CANVAS) {
        BVH.RESIZE_CANVAS = document.createElement('canvas');
        BVH.RESIZE_CANVAS.width = 2048;
        BVH.RESIZE_CANVAS.width = 2048;
        BVH.RESIZE_CTX = BVH.RESIZE_CANVAS.getContext('2d');
      }

      const ctx = BVH.RESIZE_CTX;
      ctx.drawImage(tex.source as ImageBitmap, 0, 0, width, height);

      return ctx.getImageData(0, 0, width, height).data.buffer;
    })

    return new Texture(
      width, height,
      images,
      textures[0].format
    );
  }

  protected _setTextures(
    offset: number, textures: Texture[], texture: Texture,
    matId2TexturesId: Uint32Array
  ) {
    if (texture) {
      let idx = textures.indexOf(texture);
      if (idx < 0) {
        textures.push(texture);
        idx = textures.length - 1;
      }
      matId2TexturesId[offset] = idx;
    }
  }

  protected _buildGBufferMesh() {
    const {_attributesInfo, _indexInfo, _commonUniforms} = this;

    const geometry = new Geometry(
      Object.keys(_attributesInfo).map((name, index) => {
        const {value, length, format} = (_attributesInfo[name] as any) as IBVHAttributeValue;

        return {
          layout: {
            arrayStride: length * 4,
            attributes: [{
              name, offset: 0, format, shaderLocation: index
            }]
          },
          data: value
        }
      }),
      _indexInfo.value,
      _indexInfo.value.length
    );
    
    const material = new Material(buildinEffects.rRTGBuffer, {
      u_matId2TexturesId: _commonUniforms.matId2TexturesId,
      u_baseColorFactors: _commonUniforms.baseColorFactors,
      u_metallicRoughnessFactors: _commonUniforms.metallicRoughnessFactors,
      u_baseColorTextures: _commonUniforms.baseColorTextures,
      u_normalTextures: _commonUniforms.normalTextures,
      u_metallicRoughnessTextures: _commonUniforms.metallicRoughnessTextures
    });

    this._gBufferMesh = new Mesh(geometry, material);
  }

  protected _buildBVH() {

  }
}
