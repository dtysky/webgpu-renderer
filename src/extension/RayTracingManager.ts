/**
 * @File   : RayTracingManager.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/19/2021, 10:53:21 PM
 */
import { mat4, vec3 } from 'gl-matrix';
import { buildinEffects, buildinTextures } from '../buildin';
import ComputeUnit from '../core/ComputeUnit';
import Geometry from '../core/Geometry';
import HObject from '../core/HObject';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import renderEnv from '../core/renderEnv';
import RenderTexture from '../core/RenderTexture';
import { callWithProfile, TTextureSource, TTypedArray } from '../core/shared';
import Texture from '../core/Texture';
import BVH from './BVH';

export interface IBVHAttributeValue<TArrayType = Float32Array> {
  value: TArrayType;
  length: number;
  format: GPUVertexFormat;
};

export enum EPBRMaterialType {
  METAL_ROUGH,
  SPEC_GLOSS,
  GLASS_METAL_ROUGH,
  GLASS_SPEC_GLOSS
};

export default class RayTracingManager extends HObject {
  public static CLASS_NAME: string = 'RayTracingManager';
  public static RESIZE_CANVAS: HTMLCanvasElement;
  public static RESIZE_CTX: CanvasRenderingContext2D;
  public isRayTracingManager: boolean = true;

  public meshes: Mesh[];
  protected _attributesInfo: {
    position: IBVHAttributeValue,
    texcoord_0: IBVHAttributeValue,
    normal: IBVHAttributeValue,
    meshMatIndex: IBVHAttributeValue<Uint32Array>
  };
  protected _indexInfo: {
    value: Uint32Array
  };
  protected _materials: Material[] = [];
  protected _commonUniforms: {
    matId2TexturesId: Int32Array;
    baseColorFactors: Float32Array;
    metallicRoughnessFactorNormalScaleMaterialTypes: Float32Array;
    specularGlossinessFactors: Float32Array;
    baseColorTextures: Texture;
    normalTextures: Texture;
    metalRoughOrSpecGlossTextures: Texture;
  };
  protected _bvh: BVH;
  protected _gBufferMesh: Mesh;
  protected _rtUnit: ComputeUnit;

  get gBufferMesh() {
    return this._gBufferMesh;
  }

  get rtUnit() {
    return this._rtUnit;
  }

  get bvhDebugMesh() {
    return this._bvh.debugMesh;
  }

  get bvh() {
    return this._bvh;
  }

  constructor(protected _maxPrimitivesPerBVHLeaf: number = 1) {
    super();

    this._bvh = new BVH(_maxPrimitivesPerBVHLeaf);
  }

  // batch all meshes and build bvh
  public process(meshes: Mesh[], output: RenderTexture) {
    this.meshes = meshes;
    callWithProfile('build AttributeBuffers', this._buildAttributeBuffers, [meshes]);
    callWithProfile('build CommonUniforms', this._buildCommonUniforms, [this._materials]);
    callWithProfile('build GBufferMesh', this._buildGBufferMesh, []);
    this._bvh.process(this._attributesInfo.position.value as Float32Array, this._indexInfo.value);
    callWithProfile('build RTUnit', this._buildRTUnit, [output]);

    console.log(`Build done(max primitives per leaf is ${this._maxPrimitivesPerBVHLeaf}): mesh(${meshes.length}), material(${this._materials.length}), vertexes(${this._attributesInfo.position.value.length / 3}), triangles(${this._indexInfo.value.length / 3}), bvhNodes(${this._bvh.nodesCount}), bvhLeaves(${this._bvh.leavesCount}), bvhDepth(${this._bvh.maxDepth})`);
  }

  protected _buildAttributeBuffers = (meshes: Mesh[]) => {
    const { _materials } = this;

    let indexCount: number = 0;
    let vertexCount: number = 0;
    meshes.forEach(mesh => {
      vertexCount += mesh.geometry.vertexCount;
      indexCount += mesh.geometry.count;
    });

    const { value: indexes } = this._indexInfo = {
      value: new Uint32Array(indexCount)
    };

    const { position, texcoord_0, normal, meshMatIndex } = this._attributesInfo = {
      position: {
        // alignment of vec3 is 16bytes!
        value: new Float32Array(vertexCount * 4),
        length: 4,
        format: 'float32x3'
      },
      texcoord_0: {
        value: new Float32Array(vertexCount * 2),
        length: 2,
        format: 'float32x2'
      },
      normal: {
        // alignment of vec3 is 16bytes!
        value: new Float32Array(vertexCount * 4),
        length: 4,
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

    for (let meshIndex = 0; meshIndex < meshes.length; meshIndex += 1) {
      const mesh = meshes[meshIndex];
      const {worldMat} = mesh;
      const quat = mat4.getRotation(new Float32Array(4), worldMat) as Float32Array;
      const { geometry, material } = mesh;
      const { indexData, vertexInfo, vertexCount, count } = geometry;

      if (material.effect.name !== 'rPBR') {
        throw new Error('Only support Effect rPBR!');
      }

      let materialIndex = _materials.indexOf(material);
      if (materialIndex < 0) {
        _materials.push(material);
        materialIndex = _materials.length - 1;
      }

      indexData.forEach((value: number, index: number) => {
        indexes[index + indexOffset] = value + attrOffset;
      });

      if (!vertexInfo.normal) {
        geometry.calculateNormals();
      }

      for (let index = 0; index < vertexCount; index += 1) {
        this._copyAttribute(vertexInfo.position, position, attrOffset, index, worldMat);
        this._copyAttribute(vertexInfo.texcoord_0, texcoord_0, attrOffset, index);
        this._copyAttribute(vertexInfo.normal, normal, attrOffset, index, quat, true);

        meshMatIndex.value.set([meshIndex, materialIndex], (attrOffset + index) * meshMatIndex.length);
      }

      indexOffset += count;
      attrOffset += vertexCount;
    }
  }

  protected _copyAttribute(
    src: { offset: number, stride: number, data: TTypedArray, length: number },
    dst: IBVHAttributeValue, attrOffset: number, index: number,
    transform?: Float32Array, isQuat?: boolean
  ) {
    const srcOffset = src.offset + index * src.stride;
    let srcData = src.data.slice(srcOffset, srcOffset + src.length) as Float32Array;

    transform &&
      (isQuat
        ? vec3.transformQuat(srcData, srcData, transform)
        : vec3.transformMat4(srcData, srcData, transform)
      );

    dst.value.set(
      srcData,
      (attrOffset + index) * dst.length
    );
  }

  protected _buildCommonUniforms = (materials: Material[]) => {
    const matId2TexturesId = new Int32Array(materials.length * 4).fill(-1);
    const baseColorFactors = new Float32Array(materials.length * 4).fill(1);
    const metallicRoughnessFactorNormalScaleMaterialTypes = new Float32Array(materials.length * 4).fill(1);
    const specularGlossinessFactors = new Float32Array(materials.length * 4).fill(1);
    const baseColorTextures: Texture[] = [];
    const normalTextures: Texture[] = [];
    const metalRoughOrSpecGlossTextures: Texture[] = [];

    materials.forEach((mat, index) => {
      const useGlass = mat.marcos['USE_GLASS'];
      const useSpecGloss = mat.marcos['USE_SPEC_GLOSS'];
      const baseColorFactor = mat.getUniform('u_baseColorFactor') as Float32Array;
      const metallicFactor = mat.getUniform('u_metallicFactor') as Float32Array;
      const roughnessFactor = mat.getUniform('u_roughnessFactor') as Float32Array;
      const specularFactor = mat.getUniform('u_specularFactor') as Float32Array;
      const glossinessFactor = mat.getUniform('u_glossinessFactor') as Float32Array;
      const normalScale = mat.getUniform('u_normalTextureScale') as Float32Array;
      const baseColorTexture = mat.getUniform('u_baseColorTexture') as Texture;
      const normalTexture = mat.getUniform('u_normalTexture') as Texture;
      const metallicRoughnessTexture = mat.getUniform('u_metallicRoughnessTexture') as Texture;
      const specularGlossinessTexture = mat.getUniform('u_specularGlossinessTexture') as Texture;

      const mid = index * 4;
      baseColorTexture !== buildinTextures.empty && this._setTextures(mid, baseColorTextures, baseColorTexture, matId2TexturesId);
      normalTexture !== buildinTextures.empty && this._setTextures(mid + 1, normalTextures, normalTexture, matId2TexturesId);
      baseColorFactor && baseColorFactors.set(baseColorFactor, index * 4);
      normalScale !== undefined && metallicRoughnessFactorNormalScaleMaterialTypes.set(normalScale.slice(0, 1), index * 4 + 2);

      if (useSpecGloss) {
        specularFactor !== undefined && specularGlossinessFactors.set(specularFactor.slice(0, 3), index * 4);
        glossinessFactor !== undefined && specularGlossinessFactors.set(glossinessFactor.slice(0, 1), index * 4 + 3);
        specularGlossinessTexture !== buildinTextures.empty && this._setTextures(mid + 2, metalRoughOrSpecGlossTextures, specularGlossinessTexture, matId2TexturesId);
        metallicRoughnessFactorNormalScaleMaterialTypes.set([useGlass ? EPBRMaterialType.GLASS_SPEC_GLOSS : EPBRMaterialType.SPEC_GLOSS], index * 4 + 3);
      } else {
        metallicFactor !== undefined && metallicRoughnessFactorNormalScaleMaterialTypes.set(metallicFactor.slice(0, 1), index * 4);
        roughnessFactor !== undefined && metallicRoughnessFactorNormalScaleMaterialTypes.set(roughnessFactor.slice(0, 1), index * 4 + 1);
        metallicRoughnessTexture !== buildinTextures.empty && this._setTextures(mid + 2, metalRoughOrSpecGlossTextures, metallicRoughnessTexture, matId2TexturesId);
        metallicRoughnessFactorNormalScaleMaterialTypes.set([useGlass ? EPBRMaterialType.GLASS_METAL_ROUGH : EPBRMaterialType.METAL_ROUGH], index * 4 + 3);
      }
    });

    this._commonUniforms = {
      matId2TexturesId,
      baseColorFactors,
      metallicRoughnessFactorNormalScaleMaterialTypes,
      specularGlossinessFactors,
      baseColorTextures: this._generateTextureArray(baseColorTextures),
      normalTextures: this._generateTextureArray(normalTextures),
      metalRoughOrSpecGlossTextures: this._generateTextureArray(metalRoughOrSpecGlossTextures)
    };
  }

  protected _setTextures(
    offset: number, textures: Texture[], texture: Texture,
    matId2TexturesId: Int32Array
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

  protected _generateTextureArray(textures: Texture[]): Texture {
    if (!textures.length) {
      return buildinTextures.array1white;
    }

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

      if (!RayTracingManager.RESIZE_CANVAS) {
        RayTracingManager.RESIZE_CANVAS = document.createElement('canvas');
        RayTracingManager.RESIZE_CANVAS.width = 2048;
        RayTracingManager.RESIZE_CANVAS.height = 2048;
        RayTracingManager.RESIZE_CTX = RayTracingManager.RESIZE_CANVAS.getContext('2d');
      }

      const ctx = RayTracingManager.RESIZE_CTX;
      ctx.drawImage(tex.source as ImageBitmap, 0, 0, width, height);

      return ctx.getImageData(0, 0, width, height).data.buffer;
    })

    return new Texture(
      width, height,
      images,
      textures[0].format
    );
  }

  protected _buildGBufferMesh = () => {
    const { _attributesInfo, _indexInfo, _commonUniforms } = this;

    const geometry = new Geometry(
      Object.keys(_attributesInfo).map((name, index) => {
        const { value, length, format } = (_attributesInfo[name] as any) as IBVHAttributeValue;

        return {
          layout: {
            arrayStride: length * 4,
            attributes: [{
              name, offset: 0, format, shaderLocation: index
            }]
          },
          data: value,
          usage: GPUBufferUsage.STORAGE
        }
      }),
      _indexInfo.value,
      _indexInfo.value.length
    );

    const material = new Material(buildinEffects.rRTGBuffer, {
      u_matId2TexturesId: _commonUniforms.matId2TexturesId,
      u_baseColorFactors: _commonUniforms.baseColorFactors,
      u_metallicRoughnessFactorNormalScaleMaterialTypes: _commonUniforms.metallicRoughnessFactorNormalScaleMaterialTypes,
      u_specularGlossinessFactors: _commonUniforms.specularGlossinessFactors,
      u_baseColorTextures: _commonUniforms.baseColorTextures,
      u_normalTextures: _commonUniforms.normalTextures,
      u_metalRoughOrSpecGlossTextures: _commonUniforms.metalRoughOrSpecGlossTextures
    });

    this._gBufferMesh = new Mesh(geometry, material);
  }

  protected _buildRTUnit = (output: RenderTexture) => {
    const { _gBufferMesh, _commonUniforms, _bvh } = this;
    const { geometry } = _gBufferMesh;

    this._rtUnit = new ComputeUnit(
      buildinEffects.cRTSS,
      { x: Math.ceil(renderEnv.width / 16), y: Math.ceil(renderEnv.height / 16) },
      {
        u_output: output,
        u_matId2TexturesId: _commonUniforms.matId2TexturesId,
        u_baseColorFactors: _commonUniforms.baseColorFactors,
        u_metallicRoughnessFactorNormalScaleMaterialTypes: _commonUniforms.metallicRoughnessFactorNormalScaleMaterialTypes,
        u_specularGlossinessFactors: _commonUniforms.specularGlossinessFactors,
        u_baseColorTextures: _commonUniforms.baseColorTextures,
        u_normalTextures: _commonUniforms.normalTextures,
        u_metalRoughOrSpecGlossTextures: _commonUniforms.metalRoughOrSpecGlossTextures,
        u_bvh: _bvh.buffer,
      },
      {BVH_DEPTH: this._bvh.maxDepth}
    );

    let values = geometry.getValues('position');
    this._rtUnit.setUniform('u_positions', values.cpu as Float32Array, values.gpu);
    values = geometry.getValues('texcoord_0');
    this._rtUnit.setUniform('u_uvs', values.cpu as Float32Array, values.gpu);
    values = geometry.getValues('normal');
    this._rtUnit.setUniform('u_normals', values.cpu as Float32Array, values.gpu);
    values = geometry.getValues('meshmatindex');
    this._rtUnit.setUniform('u_meshMatIndexes', values.cpu as Uint32Array, values.gpu);
    console.log(this._materials)
  }
}
