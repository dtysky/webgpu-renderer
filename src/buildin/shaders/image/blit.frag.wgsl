struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  return textureSample(u_texture, u_sampler, vo.uv);
}
