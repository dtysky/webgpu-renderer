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
  offset: number;
  length: number;
  format: GPUVertexFormat;
};

export default class BVH extends HObject {
  public static CLASS_NAME: string = 'BVH';
  public isBVH: boolean = true;

  protected _attributesGPUBuffer: GPUBuffer;
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
    metallicFactors: Float32Array;
    roughnessFactors: Float32Array;
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
    const gpuBufferSize = vertexCount * (3 + 2 + 3 + 2) * 4;
    const attrBuffer = this._attributesGPUBuffer = createGPUBufferBySize(
      gpuBufferSize,
      GPUBufferUsage.VERTEX | GPUBufferUsage.UNIFORM
    );
    const mappedBuffer = attrBuffer.getMappedRange(0, gpuBufferSize);
    const f32View = new Float32Array(mappedBuffer);
    const v32View = new Uint32Array(mappedBuffer);

    const {position, texcoord_0, normal, meshMatIndex} = this._attributesInfo = {
      position: {
        value: f32View,
        offset: 0,
        length: 3,
        format: 'float32x3'
      },
      texcoord_0: {
        value: f32View,
        offset: vertexCount * 3,
        length: 2,
        format: 'float32x2'
      },
      normal: {
        value: f32View,
        offset: vertexCount * 5,
        length: 3,
        format: 'float32x3'
      },
      meshMatIndex: {
        value: v32View,
        offset: vertexCount * 8,
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
        
        meshMatIndex.value.set([index, materialIndex], meshMatIndex.offset + index * meshMatIndex.length);
      }
      
      indexOffset += count;
      attrOffset += vertexCount;
    });

    attrBuffer.unmap();
  }

  protected _copyAttribute(
    src: {offset: number, stride: number, data: TTypedArray, length: number},
    dst: IBVHAttributeValue,
    index: number
  ) {
    const srcOffset = src.offset + index * src.stride;

    dst.value.set(
      src.data.slice(srcOffset, srcOffset + src.length),
      dst.offset + index * dst.length
    );
  }

  protected _buildCommonUniforms(materials: Material[]) {
    const matId2TexturesId = new Uint32Array(materials.length * 4);
    const worldMatrixes = new Float32Array(materials.length * 16);
    const baseColorFactors = new Float32Array(materials.length * 4).fill(1);
    const metallicFactors = new Float32Array(materials.length).fill(1);
    const roughnessFactors = new Float32Array(materials.length).fill(1);
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
      metallicFactor !== undefined && metallicFactors.set(metallicFactor, index);
      roughnessFactor !== undefined && roughnessFactors.set(roughnessFactor, index);
      
      const mid = index * 4;
      this._setTextures(mid, baseColorTextures, baseColorTexture, matId2TexturesId);
      this._setTextures(mid + 1, normalTextures, normalTexture, matId2TexturesId);
      this._setTextures(mid + 2, metallicRoughnessTextures, metallicRoughnessTexture, matId2TexturesId);
    });

    this._commonUniforms = {
      matId2TexturesId,
      worldMatrixes,
      baseColorFactors,
      metallicFactors,
      roughnessFactors,
      baseColorTextures: new Texture(
        baseColorTextures[0].width, baseColorTextures[0].height,
        baseColorTextures.map(tex => tex.source as TTextureSource),
        baseColorTextures[0].format,
      ),
      normalTextures: new Texture(
        normalTextures[0].width, normalTextures[0].height,
        normalTextures.map(tex => tex.source as TTextureSource),
        normalTextures[0].format,
      ),
      metallicRoughnessTextures: new Texture(
        metallicRoughnessTextures[0].width, metallicRoughnessTextures[0].height,
        metallicRoughnessTextures.map(tex => tex.source as TTextureSource),
        metallicRoughnessTextures[0].format,
      )
    };
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
    const {_attributesGPUBuffer, _attributesInfo, _indexInfo, _commonUniforms} = this;

    const geometry = new Geometry(
      Object.keys(_attributesInfo).map((name, index) => {
        const {value, offset, length, format} = (_attributesInfo[name] as any) as IBVHAttributeValue;

        return {
          layout: {
            arrayStride: length * 4,
            attributes: [{
              name, offset: offset * 4, format, shaderLocation: index
            }]
          },
          data: value,
          gpuData: _attributesGPUBuffer
        }
      }),
      _indexInfo.value,
      _indexInfo.value.length
    );
    
    const material = new Material(buildinEffects.rRTGBuffer, {
      u_matId2TexturesId: _commonUniforms.matId2TexturesId,
      u_baseColorFactors: _commonUniforms.baseColorFactors,
      u_metallicFactors: _commonUniforms.metallicFactors,
      u_roughnessFactors: _commonUniforms.roughnessFactors,
      u_baseColorTextures: _commonUniforms.baseColorTextures,
      u_normalTextures: _commonUniforms.normalTextures,
      u_metallicRoughnessTextures: _commonUniforms.metallicRoughnessTextures
    });

    this._gBufferMesh = new Mesh(geometry, material);
  }

  protected _buildBVH() {

  }
}
