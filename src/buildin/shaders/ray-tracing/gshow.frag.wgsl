struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let uv: vec2<f32> = vo.uv;

  if (uv.x < .33) {
    return vec4<f32>(textureSample(u_gbPositionMetalOrSpec, u_sampler, uv).rgb, 1.);
  }
  
  if (uv.x < .66) {
    return vec4<f32>(textureSample(u_gbBaseColorRoughOrGloss, u_sampler, uv).rgb, 1.);
  }
  
  return vec4<f32>(textureSample(u_gbNormalGlass, u_sampler, uv).rgb, 1.);
}
