struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) wPosition: vec4<f32>,
  @location(1) texcoord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) @interpolate(flat) meshMatIndex: vec2<u32>,
}

struct FragmentOutput {
  @location(0) positionMetalOrSpec: vec4<f32>,
  @location(1) baseColorRoughOrGloss: vec4<f32>,
  @location(2) normalGlass: vec4<f32>,
  @location(3) meshIndexMatIndexMatType: vec4<u32>,
}

#include common.chunk.wgsl;

fn getFaceNormal(position: vec3<f32>) -> vec3<f32> {
  return normalize(cross(dpdy(position), dpdx(position)));
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


@fragment
fn main(vo: VertexOutput) -> FragmentOutput {
  var fo: FragmentOutput;

  let meshId: u32 = vo.meshMatIndex[0];
  let matId: u32 = vo.meshMatIndex[1];
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[matId];
  let specularGlossinessFactor: vec4<f32> = material.u_specularGlossinessFactors[matId];
  let textureIds: vec4<i32> = material.u_matId2TexturesId[matId];
  let matType = u32(metallicRoughnessFactorNormalScaleMaterialType[3]);
  let isSpecGloss: bool = isMatSpecGloss(matType);

  fo.positionMetalOrSpec = vec4<f32>(vo.wPosition.xyz, 0.);

  let baseColor: vec4<f32> = getBaseColor(material.u_baseColorFactors[matId], textureIds[0], vo.texcoord_0);
  fo.baseColorRoughOrGloss = vec4<f32>(baseColor.rgb, 0.);

  if (isSpecGloss) {
    fo.positionMetalOrSpec.w = getSpecular(specularGlossinessFactor.xyz, textureIds[2], vo.texcoord_0).r;
    fo.baseColorRoughOrGloss.w = getGlossiness(specularGlossinessFactor[3], textureIds[2], vo.texcoord_0);
  } else {
    fo.positionMetalOrSpec.w = getMetallic(metallicRoughnessFactorNormalScaleMaterialType[0], textureIds[2], vo.texcoord_0);
    fo.baseColorRoughOrGloss.w = getRoughness(metallicRoughnessFactorNormalScaleMaterialType[1], textureIds[2], vo.texcoord_0);
  }

  let faceNormal: vec3<f32> = getFaceNormal(vo.wPosition.xyz);
  fo.normalGlass = vec4<f32>(
    getNormal(vo.normal, vo.wPosition.xyz, faceNormal, textureIds[1], vo.texcoord_0, metallicRoughnessFactorNormalScaleMaterialType[2]),
    baseColor.a
  );

  // alpha is used for judge hited
  fo.meshIndexMatIndexMatType = vec4<u32>(meshId, matId, matType, 2u);

  return fo;
}
