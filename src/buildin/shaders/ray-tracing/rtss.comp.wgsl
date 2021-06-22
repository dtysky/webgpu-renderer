struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

struct Ray {
  origin: vec3<f32>;
  dir: vec3<f32>;
};

struct HitPoint {
  position: vec3<f32>;
  metal: f32;
  diffuse: vec3<f32>;
  rough: f32;
  normal: vec3<f32>;
  meshIndex: f32;
  faceNormal: vec3<f32>;
  matIndex: f32;
  hit: bool;
};

fn genWorldRayByGBuffer(uv: vec2<f32>, gBInfo: HitPoint) -> Ray {
  let pixelSSPos: vec4<f32> = vec4<f32>(uv.x * 2. - 1., 1. - uv.y * 2., 0., 1.);
  let pixelWorldPos: vec4<f32> = uniforms.u_projInverse * uniforms.u_viewInverse * pixelSSPos;

  var ray: Ray;

  ray.origin = pixelWorldPos.xyz;
  ray.dir = normalize(gBInfo.position - pixelWorldPos.xyz);

  return ray;
};

fn getGBInfo(uv: vec2<f32>) -> HitPoint {
  var info: HitPoint;

  let wPMtl: vec4<f32> = textureSampleLevel(u_gbPositionMetal, u_samplerGB, uv, 0.);
  let dfRgh: vec4<f32> = textureSampleLevel(u_gbDiffuseRough, u_samplerGB, uv, 0.);
  let nomMesh: vec4<f32> = textureSampleLevel(u_gbNormalMeshIndex, u_samplerGB, uv, 0.);
  let fnomMat: vec4<f32> = textureSampleLevel(u_gbFaceNormalMatIndex, u_samplerGB, uv, 0.);

  info.hit = u32(nomMesh.w) == 1u;
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

  textureStore(u_output, baseIndex, vec4<f32>(worldRay.dir, 1.));
}
