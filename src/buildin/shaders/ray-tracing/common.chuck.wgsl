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

fn getSpecular(factor: vec3<f32>, textureId: i32, uv: vec2<f32>) -> f32 {
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
