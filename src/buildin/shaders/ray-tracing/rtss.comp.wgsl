const PI: f32 = 3.14159265358979;
const MAX_LIGHTS_COUNT: u32 = 4u;
const MAX_RAY_LENGTH: f32 = 9999.;
const BVH_DEPTH: i32 = ${BVH_DEPTH};
const EPS: f32 = 0.005;
const RAY_DIR_OFFSET: f32 = .01;
const RAY_NORMAL_OFFSET: f32 = .01;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}


#include ../basic/common.chunk.wgsl;
#include common.chunk.wgsl;
#include ../pbr/common.chunk.wgsl;

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
  // sign: if render back, is -1, or 1
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
  // areal coordinates
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

#include gbInfo.chunk.wgsl;
#include hitTest.chunk.wgsl;
#include sample.chunk.wgsl;
#include lighting.chunk.wgsl;

fn calcLight(ray: Ray, hit: HitPoint, baseUV: vec2<f32>, bounce: i32, isLast: bool, isOut: bool, debugIndex: i32) -> Light {
  var light: Light;
  let random = getRandom(baseUV, bounce);

  if (isOut) {
    // rgbd
    light.color = calcOutColor(ray, hit);
    return light;
  }

  var nextDir: vec3<f32>;
  var isBTDF: bool = false;
  if (hit.isGlass) {
    // bsdf
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
    // brdf
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

  // avoid self intersection
  if (isBTDF) {
    // transmission
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
    // if hit none-glass material, finish tracing
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

  // var hited: f32 = 0.;
  // if (hit.hit) {
  //   hited = 1.;
  // }
  // ray = startRay;
  // hit = gBInfo;
  // light = calcLight(ray, hit, baseUV, 0, false, false, debugIndex);
  // u_debugInfo.rays[debugIndex].preOrigin = vec4<f32>(ray.origin, hit.sign);
  // u_debugInfo.rays[debugIndex].preDir = vec4<f32>(ray.dir, f32(hit.matType));
  // ray = light.next;
  // hit = hitTest(ray);
  // light = calcLight(ray, hit, baseUV, 1, false, false, debugIndex);
  // u_debugInfo.rays[debugIndex].origin = vec4<f32>(ray.origin, hit.sign);
  // u_debugInfo.rays[debugIndex].dir = vec4<f32>(ray.dir, f32(hit.matType));
  // u_debugInfo.rays[debugIndex].normal = vec4<f32>(hit.normal, hit.glass);
  // ray = light.next;
  // hit = hitTest(ray);
  // light = calcLight(ray, hit, baseUV, 2, false, false, debugIndex);
  // u_debugInfo.rays[debugIndex].nextOrigin = vec4<f32>(ray.origin, hit.sign);
  // u_debugInfo.rays[debugIndex].nextDir = vec4<f32>(ray.dir, f32(bounce));

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
    // rgbd
    textureStore(u_output, baseIndex, vec4<f32>(bgColor.rgb / bgColor.a * global.u_envColor.rgb, 1.));
    return;
  }

  let worldRay: Ray = genWorldRayByGBuffer(baseUV, gBInfo);
  let light: vec3<f32> = traceLight(worldRay, gBInfo, baseUV, debugIndex);
  textureStore(u_output, baseIndex, vec4<f32>(light, 1.));
}
