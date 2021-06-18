struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  let uv: vec2<f32> = vo.uv;

  if (uv.x < .25) {
    return vec4<f32>(textureSample(u_positionMetal, u_sampler, uv).rgb, 1.);
  }
  
  if (uv.x < .5) {
    return vec4<f32>(textureSample(u_diffuseRough, u_sampler, uv).rgb, 1.);
  }
  
  if (uv.x < .75) {
    return vec4<f32>(textureSample(u_normalMeshIndex, u_sampler, uv).rgb, 1.);
  }

  return vec4<f32>(textureSample(u_faceNormalMatIndex, u_sampler, uv).rgb, 1.);
}
