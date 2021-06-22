let MAX_TRACE_COUNT: u32 = 1u;
let BVH_DEPTH: i32 = ${BVH_DEPTH};

struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

struct Ray {
  origin: vec3<f32>;
  dir: vec3<f32>;
  invDir: vec3<f32>;
};

struct HitPoint {
  position: vec3<f32>;
  metal: f32;
  diffuse: vec3<f32>;
  rough: f32;
  normal: vec3<f32>;
  meshIndex: u32;
  faceNormal: vec3<f32>;
  matIndex: u32;
  hit: bool;
};

struct Light {
  color: vec3<f32>;
  energy: f32;
};

fn genWorldRayByGBuffer(uv: vec2<f32>, gBInfo: HitPoint) -> Ray {
  let pixelSSPos: vec4<f32> = vec4<f32>(uv.x * 2. - 1., 1. - uv.y * 2., 0., 1.);
  let pixelWorldPos: vec4<f32> = uniforms.u_projInverse * uniforms.u_viewInverse * pixelSSPos;

  var ray: Ray;

  ray.origin = pixelWorldPos.xyz;
  ray.dir = normalize(gBInfo.position - pixelWorldPos.xyz);
  ray.invDir = 1. / ray.dir;

  return ray;
};

fn getGBInfo(uv: vec2<f32>) -> HitPoint {
  var info: HitPoint;

  let wPMtl: vec4<f32> = textureSampleLevel(u_gbPositionMetal, u_samplerGB, uv, 0.);
  let dfRgh: vec4<f32> = textureSampleLevel(u_gbDiffuseRough, u_samplerGB, uv, 0.);
  let nomMesh: vec4<f32> = textureSampleLevel(u_gbNormalMeshIndex, u_samplerGB, uv, 0.);
  let fnomMat: vec4<f32> = textureSampleLevel(u_gbFaceNormalMatIndex, u_samplerGB, uv, 0.);

  info.hit = u32(nomMesh.w) != 1u;
  info.position = wPMtl.xyz;
  info.metal = wPMtl.w;
  info.diffuse = dfRgh.xyz;
  info.rough = dfRgh.w;
  info.normal = nomMesh.xyz;
  info.meshIndex = u32(nomMesh.w) - 2u;
  info.faceNormal = fnomMat.xyz;
  info.matIndex = u32(fnomMat.w);

  return info;
};

fn calcLight(preRay: Ray, point: HitPoint) -> Light {
  var light: Light;

  light.color = point.diffuse;
  light.energy = .8;

  return light;
}

fn genRayByHitPoint(preRay: Ray, point: HitPoint) -> Ray {
  var ray: Ray;

  return ray;
}

// https://tavianator.com/2011/ray_box.html
fn boxHitTest(ray: Ray, max: vec3<f32>, min: vec3<f32>) -> float {
  let t1: vec3<f32> = (min - ray.origin) * ray.invDir;
  let t2: vec3<f32> = (max - ray.origin) * ray.invDir;
  let tvmin: vec3<f32> = min(t1, t2);
  let tvmax: vec3<f32> = max(t1, t2);
  let tmin: f32 = max(tvmin.x, max(tvmin.y, tvmin.z));
  let tmax: f32 = min(tvmax.x, min(tvmax.y, tvmax.z));

  if (tmin > tmax || tmin > 9999.) {
    return -1.;
  } else if (tmin > 0.) {
    return tmin;
  }

  return tmax;
}

fn hitTest(ray: Ray) -> HitPoint {
  var hit: HitPoint;

  return hit;
}

fn traceLight(startRay: Ray, gBInfo: HitPoint) -> vec3<f32> {
  var light: Light = calcLight(startRay, gBInfo);
  var energy: f32 = light.energy;
  var lightColor: vec3<f32> = light.color * energy;
  var hit: HitPoint;
  var ray: Ray = startRay;

  for (var i: u32 = 0u; i < MAX_TRACE_COUNT; i = i + 1u) {
    hit = hitTest(ray);
    
    if (!hit.hit) {
      let bgLight: vec3<f32> = textureSampleLevel(u_envTexture, u_sampler, ray.dir, 0.).rgb;
      lightColor =lightColor + bgLight * energy;
      break;
    }

    light = calcLight(ray, hit);
    energy = energy * light.energy;
    lightColor = lightColor + light.color * energy;

    if (energy < 0.01) {
      break;
    }

    ray = genRayByHitPoint(ray, hit);
  }

  return lightColor;
}

fn traceShadow(ray: Ray) -> f32 {
  return 1.;
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
    let t: vec4<f32> = uniforms.u_skyVP * vec4<f32>(baseUV.x * 2. - 1., 1. - baseUV.y * 2., 1., 1.);
    let cubeUV: vec3<f32> = normalize(t.xyz / t.w);
    let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, cubeUV, 0.);
    textureStore(u_output, baseIndex, vec4<f32>(bgColor.rgb * uniforms.u_envColor.rgb, bgColor.a));
    return;
  }

  let worldRay: Ray = genWorldRayByGBuffer(baseUV, gBInfo);
  let light: vec3<f32> = traceLight(worldRay, gBInfo);
  let shadow: f32 = traceShadow(worldRay);

  textureStore(u_output, baseIndex, vec4<f32>(light * shadow, 1.));
}
