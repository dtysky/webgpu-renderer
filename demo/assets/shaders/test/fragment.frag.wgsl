struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) v_texcoord_0: vec2<f32>,
  @location(1) testOrth: vec4<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let color: vec4<f32> = textureSample(u_texture, u_sampler, vo.v_texcoord_0.xy);
  return vec4<f32>(color.rgb * material.u_color, color.a);
}
