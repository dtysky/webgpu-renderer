struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] wPosition: vec4<f32>;
  [[location(1)]] texcoord_0: vec2<f32>;
  [[location(2)]] normal: vec3<f32>;
  [[location(3)]] meshMatIndex: vec2<u32>;
};

struct FragmentOutput {
  [[location(0)]] positionMetal: vec4<f32>;
  [[location(1)]] diffuseRough: vec4<f32>;
  [[location(2)]] normalMeshIndex: vec4<f32>;
  [[location(3)]] faceNormalMatIndex: vec4<f32>;
};

fn getRoughness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSample(u_metallicRoughnessTextures, u_sampler, uv, textureId).g;
}

fn getMetallic(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
if (textureId == -1) {
    return factor;
  }

  return factor * textureSample(u_metallicRoughnessTextures, u_sampler, uv, textureId).b;
}

fn getBaseColor(factor: vec4<f32>, textureId: i32, uv: vec2<f32>) -> vec4<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSample(u_baseColorTextures, u_sampler, uv, textureId);
}

fn getFaceNormal(position: vec3<f32>) -> vec3<f32> {
  return normalize(cross(dpdx(position), dpdy(position)));
}

fn getNormal(
  vNormal: vec3<f32>, position: vec3<f32>, faceNormal: vec3<f32>,
  textureId: i32, uv: vec2<f32>, normalScale: f32
) -> vec3<f32> {
  var normal: vec3<f32> = normalize(vNormal);
  normal = normal * sign(dot(normal, faceNormal));

  if (textureId == -1) {
    return normal;
  }

  // http://www.thetenthplanet.de/archives/1180
  let dp1: vec3<f32> = dpdx(position);
  let dp2: vec3<f32> = dpdy(position);
  let duv1: vec2<f32> = dpdx(uv);
  let duv2: vec2<f32> = dpdy(uv);
  let dp2perp: vec3<f32> = cross(dp2, normal);
  let dp1perp: vec3<f32> = cross(normal, dp1);
  var dpdu: vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
  var dpdv: vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
  let invmax: f32 = inverseSqrt(max(dot(dpdu, dpdu), dot(dpdv, dpdv)));
  dpdu = dpdu * invmax;
  dpdv = dpdv * invmax;
  let tbn: mat3x3<f32> = mat3x3<f32>(dpdu, dpdv, normal);
  var tNormal: vec3<f32> = 2. * textureSample(u_normalTextures, u_sampler, uv, textureId).xyz - 1.;
  tNormal = tNormal * vec3<f32>(normalScale, normalScale, 1.);

  return normalize(tbn * tNormal);
}

[[stage(fragment)]]
fn main(vo: VertexOutput) -> FragmentOutput {
  var fo: FragmentOutput;

  let meshId: u32 = vo.meshMatIndex[0];
  let matId: u32 = vo.meshMatIndex[1];
  let metallicRoughnessFactorNormalScale: vec3<f32> = uniforms.u_metallicRoughnessFactorNormalScales[matId];
  let textureIds: vec4<i32> = uniforms.u_matId2TexturesId[matId];

  fo.positionMetal = vec4<f32>(
    vo.wPosition.xyz,
    getMetallic(metallicRoughnessFactorNormalScale[0], textureIds[2], vo.texcoord_0)
  );

  fo.diffuseRough = vec4<f32>(
    getBaseColor(uniforms.u_baseColorFactors[matId], textureIds[0], vo.texcoord_0).rgb,
    getRoughness(metallicRoughnessFactorNormalScale[1], textureIds[0], vo.texcoord_0)
  );

  let faceNormal: vec3<f32> = getFaceNormal(vo.wPosition.xyz);
  fo.faceNormalMatIndex = vec4<f32>(faceNormal, f32(matId));

  fo.normalMeshIndex = vec4<f32>(
    getNormal(vo.normal, vo.wPosition.xyz, faceNormal, textureIds[1], vo.texcoord_0, metallicRoughnessFactorNormalScale[2]),
    f32(meshId)
  );

  return fo;
}
