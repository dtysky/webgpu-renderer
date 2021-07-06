let PI: f32 = 3.14159265358979;
let MAX_LIGHTS_COUNT: u32 = 1u;
let MAX_TRACE_COUNT: u32 = 1u;
let MAX_RAY_LENGTH: f32 = 9999.;
let BVH_DEPTH: i32 = ${BVH_DEPTH};
let EPS: f32 = 0.005;
let RAY_DIR_OFFSET: f32 = .01;

struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

require('../basic/common.chunk.wgsl');
require('./common.chunk.wgsl');
require('../pbr/common.chunk.wgsl');

struct Ray {
  origin: vec3<f32>;
  dir: vec3<f32>;
  invDir: vec3<f32>;
};

struct HitPoint {
  hit: bool;
  hited: f32;
  position: vec3<f32>;
  baseColor: vec3<f32>;
  metal: f32;
  rough: f32;
  spec: vec3<f32>;
  gloss: f32;
  glass: f32;
  normal: vec3<f32>;
  // sign: if render back, is -1, or 1
  sign: f32;
  meshIndex: u32;
  matIndex: u32;
  isSpecGloss: bool;
  isGlass: bool;
  pbrData: PBRData;
};

struct Light {
  color: vec3<f32>;
  brdf: vec3<f32>;
  next: Ray;
};

struct BVHNode {
  child0Index: u32;
  child1Index: u32;
  max: vec3<f32>;
  min: vec3<f32>;
};

struct BVHLeaf {
  primitives: u32;
  indexes: vec3<u32>;
};

struct FragmentInfo {
  hit: bool;
  hitPoint: vec3<f32>;
  t: f32;
  // areal coordinates
  weights: vec3<f32>;
  p0: vec3<f32>;
  p1: vec3<f32>;
  p2: vec3<f32>;
  uv0: vec2<f32>;
  uv1: vec2<f32>;
  uv2: vec2<f32>;
  n0: vec3<f32>;
  n1: vec3<f32>;
  n2: vec3<f32>;
  meshIndex: u32;
  matIndex: u32;
};

struct Child {
  isLeaf: bool;
  offset: u32;
};

fn getRandom(seeds: vec4<f32>) -> vec4<f32> {
  return fract(sin(seeds * global.u_randomSeed * 10.24));
}

fn genWorldRayByGBuffer(uv: vec2<f32>, gBInfo: HitPoint) -> Ray {
  let pixelSSPos: vec4<f32> = vec4<f32>(uv.x * 2. - 1., 1. - uv.y * 2., 0., 1.);
  var pixelWorldPos: vec4<f32> = global.u_viewInverse * global.u_projInverse * pixelSSPos;
  pixelWorldPos = pixelWorldPos / pixelWorldPos.w;

  var ray: Ray;

  ray.origin = pixelWorldPos.xyz;
  ray.dir = normalize(gBInfo.position - ray.origin);
  ray.invDir = 1. / ray.dir;

  return ray;
};

fn getGBInfo(uv: vec2<f32>) -> HitPoint {
  var info: HitPoint;

  let wPMtl: vec4<f32> = textureSampleLevel(u_gbPositionMetal, u_samplerGB, uv, 0.);
  let dfRghGls: vec4<f32> = textureSampleLevel(u_gbBaseColorRoughOrGloss, u_samplerGB, uv, 0.);
  let nomMeshIdGlass: vec4<f32> = textureSampleLevel(u_gbNormalMeshIndexGlass, u_samplerGB, uv, 0.);
  let specMatIdMatType: vec4<f32> = textureSampleLevel(u_gbSpecMatIndexMatType, u_samplerGB, uv, 0.);

  let meshIndexGlass: u32 = u32(nomMeshIdGlass.w);
  let meshIndex: u32 = meshIndexGlass >> 8u;
  info.hit = meshIndex != 1u;
  info.position = wPMtl.xyz;
  info.metal = wPMtl.w;
  info.baseColor = dfRghGls.xyz;
  info.rough = dfRghGls.w;
  info.spec = specMatIdMatType.xyz;
  info.gloss = dfRghGls.w;
  info.normal = nomMeshIdGlass.xyz;
  info.sign = 1.;
  info.meshIndex = meshIndex - 2u;
  info.glass = f32((meshIndexGlass - meshIndex) >> 8u) / 255.;
  let matIndexMatType: u32 = u32(specMatIdMatType.w);
  let matType: u32 = matIndexMatType >> 12u;
  info.matIndex = matIndexMatType - (matIndexMatType << 12u);
  info.isSpecGloss = isMatSpecGloss(matType);
  info.isGlass = isMatGlass(matType);
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
  leaf.indexes = bitcast<vec3<u32>>(data1.yzw);

  return leaf;
}

fn getFaceNormal(frag: FragmentInfo) -> vec3<f32> {
  return normalize(cross(frag.p1 - frag.p0, frag.p2 - frag.p0));
}

fn getNormal(
  frag: FragmentInfo, faceNormal: vec3<f32>, uv: vec2<f32>,
  textureId: i32, normalScale: f32
) -> vec3<f32> {
  var normal: vec3<f32> = normalize(
    frag.n0 * frag.weights[0] + frag.n0 * frag.weights[1] + frag.n0 * frag.weights[2]
  );
  normal = normal * sign(dot(normal, faceNormal));

  if (textureId == -1) {
    return normal;
  }

  // // http://www.thetenthplanet.de/archives/1180
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

// https://tavianator.com/2011/ray_box.html
fn boxHitTest(ray: Ray, max: vec3<f32>, min: vec3<f32>) -> f32 {
  let t1: vec3<f32> = (min - ray.origin) * ray.invDir;
  let t2: vec3<f32> = (max - ray.origin) * ray.invDir;
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

  if (v < 0. || v + u > det) {
    return info;
  }

  let lt: f32 = dot(e1, q);

  if (lt < 0.) {
    return info;
  }

  let invDet: f32 = 1. / det;

  info.hit = true;
  info.t = lt * invDet;
  info.hitPoint = ray.origin + ray.dir * info.t;
  info.weights = vec3<f32>(0., u, v) * invDet;
  info.weights.x = 1. - info.weights.y - info.weights.z;
  info.uv0 = u_uvs.value[indexes.x];
  info.uv1 = u_uvs.value[indexes.y];
  info.uv2 = u_uvs.value[indexes.z];
  info.n0 = u_normals.value[indexes.x];
  info.n1 = u_normals.value[indexes.y];
  info.n2 = u_normals.value[indexes.z];
  info.meshIndex = u_meshMatIndexes.value[indexes.x].x;
  info.matIndex = u_meshMatIndexes.value[indexes.x].y;

  return info;
}

fn leafHitTest(ray: Ray, offset: u32) -> FragmentInfo {
  var info: FragmentInfo;
  info.t = MAX_RAY_LENGTH;
  var leaf: BVHLeaf = getBVHLeafInfo(offset);
  let primitives: u32 = leaf.primitives;
  
  for (var i: u32 = 0u; i < primitives; i = i + 1u) {
    let cInfo: FragmentInfo = triangleHitTest(ray, leaf);

    if (cInfo.hit && cInfo.t < info.t) {
      info = cInfo;
    }

    leaf = getBVHLeafInfo(offset + i);
  }

  return info;
}

fn fillHitPoint(frag: FragmentInfo, ray: Ray) -> HitPoint {
  var info: HitPoint;

  info.hit = true;
  info.meshIndex = frag.meshIndex;
  info.matIndex = frag.matIndex;
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[frag.matIndex];
  let matType: u32 = bitcast<u32>(metallicRoughnessFactorNormalScaleMaterialType[3]);
  info.position = frag.p0 * frag.weights[0] + frag.p1 * frag.weights[1] + frag.p2 * frag.weights[2];
  let uv: vec2<f32> = frag.uv0 * frag.weights[0] + frag.uv1 * frag.weights[1] + frag.uv2 * frag.weights[2];
  let textureIds: vec4<i32> = material.u_matId2TexturesId[frag.matIndex];  
  let faceNormal: vec3<f32> = getFaceNormal(frag);
  info.normal = getNormal(frag, faceNormal, uv, textureIds[1], metallicRoughnessFactorNormalScaleMaterialType[2]);
  info.sign = sign(dot(faceNormal, -ray.dir));
  let baseColor: vec4<f32> = getBaseColor(material.u_baseColorFactors[frag.matIndex], textureIds[0], uv);
  info.baseColor = baseColor.rgb;
  info.glass = baseColor.a;
  info.isSpecGloss = isMatSpecGloss(matType);
  info.isGlass = isMatGlass(matType);

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
  var nodeStack: array<u32, ${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset);

      if (info.hit && info.t < fragInfo.t) {
        fragInfo = info;
      }

      continue;
    }

    node = getBVHNodeInfo(child.offset);
    let hited: f32 = boxHitTest(ray, node.max, node.min);

    if (hited < 0. || hited > fragInfo.t) {
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
  var nodeStack: array<u32, ${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset);

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

// https://graphics.pixar.com/library/OrthonormalB/paper.pdf
fn orthonormalBasis(normal: vec3<f32>) -> mat3x3<f32> {
  // sign function return 0 if x is 0
  // let zsign: f32 = sign(normal.z) * 1.;
  var zsign: f32 = 1.;
  if (normal.z < 1.) {
    zsign = -1.;
  }
  let a: f32 = -1.0 / (zsign + normal.z);
  let b: f32 = normal.x * normal.y * a;
  let s: vec3<f32> = vec3<f32>(1.0 + zsign * normal.x * normal.x * a, zsign * b, -zsign * normal.x);
  let t: vec3<f32> = vec3<f32>(b, zsign + normal.y * normal.y * a, -normal.y);

  return mat3x3<f32>(s, t, normal);
}

// http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/2D_Sampling_with_Multidimensional_Transformations.html#SamplingaUnitDisk
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

fn calcIndirectLight(ray: Ray, hit: HitPoint, random: vec2<f32>, debugIndex: i32) -> vec3<f32> {
  // sample area lights, get radiance or shadow
  let areaLight: LightInfo = global.u_lightInfos[0];

  // only support one disc area light now
  if (areaLight.lightType != LIGHT_TYPE_AREA) {
    return vec3<f32>(0.);
  }

  let samplePoint2D: vec2<f32> = sampleCircle(random) * areaLight.areaSize.x;
  let samplePoint: vec4<f32> = areaLight.worldTransform * vec4<f32>(samplePoint2D.x, 0., samplePoint2D.y, 1.);
  // let samplePoint: vec3<f32> = vec3<f32>(0., 5.5, 5.);
  var sampleDir: vec3<f32> = samplePoint.xyz - hit.position;
  let maxT: f32 = length(sampleDir);
  sampleDir = normalize(sampleDir);
  let sampleLight: Ray = Ray(hit.position, sampleDir, 1. / sampleDir);
  let shadowInfo: FragmentInfo = hitTestShadow(sampleLight, maxT);

  // var hited: f32 = 0.;
  // if (shadowInfo.hit) {
  //   hited = 1.;
  // }
  // u_debugInfo.rays[debugIndex].origin = vec4<f32>(hit.position, hited);
  // u_debugInfo.rays[debugIndex].dir = vec4<f32>(sampleDir, maxT);

  if (shadowInfo.hit) {
    return vec3<f32>(0.);
  }

  return areaLight.color.rgb * hit.baseColor;
}

fn fresnelSchlickWeight(cosTheta: f32) -> f32 {
  let w: f32 = 1.0 - cosTheta;

  return (w * w) * (w * w) * w;
}

fn fresnelSchlickTIR(cosTheta: f32, r0: f32, ni: f32) -> f32 {
  // moving from a more dense to a less dense medium
  var cos: f32 = cosTheta;
  if (cosTheta < 0.0) {
    let inv_eta: f32 = ni;
    let SinT2: f32 = inv_eta * inv_eta * (1.0 - cosTheta * cosTheta);
    if (SinT2 > 1.0) {
      return 1.0; // total internal reflection
    }

    cos = sqrt(1. - SinT2);
  }

  return mix(fresnelSchlickWeight(cos), 1.0, r0);
}

// http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/2D_Sampling_with_Multidimensional_Transformations.html#Cosine-WeightedHemisphereSampling
fn cosineSampleHemisphere(p: vec2<f32>) -> vec3<f32> {
  let h: vec2<f32> = sampleCircle(p);
  let z: f32 = sqrt(max(0.0, 1.0 - h.x * h.x - h.y * h.y));

  return vec3<f32>(h, z);
}

fn calcDiffuseLightDir(basis: mat3x3<f32>, sign: f32, random: vec2<f32>) -> vec3<f32> {
  return basis * sign * cosineSampleHemisphere(random);
}

// GGX distrubtion
fn calcSpecularLightDir(basis: mat3x3<f32>, ray: Ray, hit: HitPoint, random: vec2<f32>) -> vec3<f32> {
  let phi: f32 = PI * 2. * random.y;
  let alpha: f32 = hit.pbrData.alphaRoughness;
  let cosTheta: f32 = sqrt((1.0 - random.x) / (1.0 + (alpha * alpha - 1.0) * random.x));
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

fn calcBsdfDir(ray: Ray, hit: HitPoint, isReflection: bool) -> vec3<f32> {
  // reflection or refraction
  if (isReflection) {
    return reflect(ray.dir, hit.normal);
  }

  let ior: f32 = 1. / hit.glass;
  var r0: f32 = (1. - ior) / (1. + ior);
  r0 = r0 * r0;
  let cosTheta: f32 = dot(hit.normal, -ray.dir);
  let F: f32 = fresnelSchlickTIR(cosTheta, r0, ior);
  var realIOR: f32;

  if (cosTheta < 0.) {
    realIOR = ior;
  } else {
    realIOR = hit.glass;
  }

  // we suppose all glass are thick glass
  return refract(ray.dir, sign(cosTheta) * hit.normal, realIOR);
}

fn calcLight(ray: Ray, hit: HitPoint, isLastOut: bool, debugIndex: i32) -> Light {
  var light: Light;
  let random = getRandom(vec4<f32>(hit.position, hit.hited));

  if (isLastOut) {
    // rgbd
    let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, ray.dir, 0.);
    light.color = bgColor.rgb / bgColor.a * global.u_envColor.rgb;
    return light;
  }

  if (hit.isGlass) {
    // bsdf
    light.next.dir = calcBsdfDir(ray, hit, random.x < 0.5);
    light.brdf = hit.baseColor;
  } else {
    // brdf
    light.color = calcIndirectLight(ray, hit, random.zw, debugIndex);
    light.next.dir = calcBrdfDir(ray, hit, random.z < mix(.5, 0., hit.metal), random.xy);
    light.brdf = pbrCalculateLo(hit.pbrData, -ray.dir, light.next.dir, hit.normal);
    // light.brdf = vec3<f32>(1.);
  }

  // avoid self intersection
  light.next.origin = hit.position + light.next.dir * RAY_DIR_OFFSET;
  light.next.invDir = 1. / light.next.dir;

  return light;
}

fn traceLight(startRay: Ray, gBInfo: HitPoint, debugIndex: i32) -> vec3<f32> {
  var light: Light = calcLight(startRay, gBInfo, false, debugIndex);
  var brdf: vec3<f32> = light.brdf;
  var lightColor: vec3<f32> = light.color * brdf;
  var hit: HitPoint;
  var ray: Ray = light.next;

  // for (var i: u32 = 0u; i < MAX_TRACE_COUNT; i = i + 1u) {
  //   hit = hitTest(ray);
  //   let isLastOut: bool = !hit.hit;

  //   light = calcLight(ray, hit, isLastOut, debugIndex);
  //   // lightColor = lightColor + light.color * brdf;
  //   brdf = brdf * light.brdf;
  //   ray = light.next;

  //   if (max(brdf.x, max(brdf.y, brdf.z)) < 0.01 || isLastOut) {
  //     break;
  //   }
  // }

  var hited: f32 = 0.;
  if (hit.hit) {
    hited = 1.;
  }
  u_debugInfo.rays[debugIndex].preOrigin = vec4<f32>(brdf, hited);
  u_debugInfo.rays[debugIndex].preDir = vec4<f32>(ray.dir, hit.hited);
  // u_debugInfo.rays[debugIndex].origin = vec4<f32>(basis[0], f32(gBInfo.matIndex));
  // u_debugInfo.rays[debugIndex].dir = vec4<f32>(basis[1], f32(gBInfo.meshIndex));
  // u_debugInfo.rays[debugIndex].nextOrigin = vec4<f32>(basis[2], f32(hit.matIndex));
  // u_debugInfo.rays[debugIndex].nextDir = vec4<f32>(nextLight.reflection.dir, f32(hit.meshIndex));
  u_debugInfo.rays[debugIndex].normal = vec4<f32>(gBInfo.normal, 1.);

  return lightColor;
}

[[stage(compute), workgroup_size(16, 16, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  let screenSize: vec2<i32> = textureDimensions(u_gbPositionMetal, 0);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(screenSize);
  let gBInfo: HitPoint = getGBInfo(baseUV);

  if (!gBInfo.hit) {
    let t: vec4<f32> = global.u_skyVP * vec4<f32>(baseUV.x * 2. - 1., 1. - baseUV.y * 2., 1., 1.);
    let cubeUV: vec3<f32> = normalize(t.xyz / t.w);
    let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, cubeUV, 0.);
    // rgbd
    textureStore(u_output, baseIndex, vec4<f32>(bgColor.rgb / bgColor.a * global.u_envColor.rgb, 1.));
    return;
  }

  let debugIndex: i32 = baseIndex.x + baseIndex.y * screenSize.x;
  let worldRay: Ray = genWorldRayByGBuffer(baseUV, gBInfo);
  let light: vec3<f32> = traceLight(worldRay, gBInfo, debugIndex);

  textureStore(u_output, baseIndex, vec4<f32>(light, 1.));
}
