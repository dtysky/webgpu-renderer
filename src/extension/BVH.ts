/**
 * @File   : BVH.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 6/15/2021, 11:14:51 PM
 */
import Geometry from '../core/Geometry';
import HObject from '../core/HObject';
import ImageMesh from '../core/ImageMesh';
import Material from '../core/Material';
import Mesh from '../core/Mesh';
import Node from '../core/Node';
import {createGPUBufferBySize, TTypedArray} from '../core/shared';

export interface IBVHAttributeValue<TArrayType = Float32Array> {
  value: TArrayType;
  offset: number;
  length: number;
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
    buffer: GPUBuffer
  };
  protected _materials: Material[] = [];
  // protected _bvhGPUBuffer: GPUBuffer;
  // protected _uniformBuffers: {
  //   position: Float32Array,
  //   texcoord_0: Float32Array,
  //   normal: Float32Array,
  //   tangent: Float32Array
  // };
  protected _gBufferMesh: Mesh;
  protected _rtMesh: ImageMesh;

  get rtMesh() {
    return this._rtMesh;
  }

  // batch all meshes and build bvh
  public process(meshes: Mesh[]) {
    this._buildAttributeBuffers(meshes);
    this._batchScene();
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

    const {buffer: indexBuffer} = this._indexInfo = {
      buffer: createGPUBufferBySize(indexCount * 2, GPUBufferUsage.INDEX)
    };
    const attrBuffer = this._attributesGPUBuffer = createGPUBufferBySize(
      vertexCount * (3 + 2 + 3 + 2) * 4,
      GPUBufferUsage.VERTEX | GPUBufferUsage.UNIFORM
    );

    const indexes = new Uint16Array(indexBuffer.getMappedRange(0, indexCount * 2));
    const {position, texcoord_0, normal, meshMatIndex} = this._attributesInfo = {
      position: {
        value: new Float32Array(attrBuffer.getMappedRange(0, vertexCount * 12), 0, vertexCount * 3),
        offset: 0,
        length: vertexCount * 3
      },
      texcoord_0: {
        value: new Float32Array(attrBuffer.getMappedRange(vertexCount * 12, vertexCount * 8), 0, vertexCount * 2),
        offset: vertexCount * 3,
        length: vertexCount * 2
      },
      normal: {
        value: new Float32Array(attrBuffer.getMappedRange(vertexCount * 20, vertexCount * 12), 0, vertexCount * 3),
        offset: vertexCount * 5,
        length: vertexCount * 3
      },
      meshMatIndex: {
        value: new Uint32Array(attrBuffer.getMappedRange(vertexCount * 32, vertexCount * 8), 0, vertexCount * 2),
        offset: vertexCount * 8,
        length: vertexCount * 2
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
        geometry.computeNormals();
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

    indexBuffer.unmap();
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

  protected _computeNormal() {
    return [1, 1, 1];
  }

  protected _batchScene() {

  }

  protected _buildBVH() {

  }
}
