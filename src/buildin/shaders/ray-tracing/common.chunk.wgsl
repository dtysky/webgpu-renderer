const MAT_TYPE_METAL_ROUGH: u32 = 0u;
const MAT_TYPE_SPEC_GLOSS: u32 = 1u;
const MAT_TYPE_GLASS_METAL_ROUGH: u32 = 2u;
const MAT_TYPE_GLASS_SPEC_GLOSS: u32 = 3u;
const MAT_TYPE_LIGHT: u32 = 4u;

fn isMatSpecGloss(matType: u32) -> bool {
  return matType == MAT_TYPE_SPEC_GLOSS || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatGlass(matType: u32) -> bool {
  return matType == MAT_TYPE_GLASS_METAL_ROUGH || matType == MAT_TYPE_GLASS_SPEC_GLOSS;
}

fn isMatLight(matType: u32) -> bool {
  return matType == MAT_TYPE_LIGHT;
}

fn getRoughness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).g;
}

fn getMetallic(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).b;
}

fn getSpecular(factor: vec3<f32>, textureId: i32, uv: vec2<f32>) -> vec3<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).rgb;
}

fn getGlossiness(factor: f32, textureId: i32, uv: vec2<f32>) -> f32 {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_metalRoughOrSpecGlossTextures, u_sampler, uv, textureId, 0.).a;
}

fn getBaseColor(factor: vec4<f32>, textureId: i32, uv: vec2<f32>) -> vec4<f32> {
  if (textureId == -1) {
    return factor;
  }

  return factor * textureSampleLevel(u_baseColorTextures, u_sampler, uv, textureId, 0.);
}
