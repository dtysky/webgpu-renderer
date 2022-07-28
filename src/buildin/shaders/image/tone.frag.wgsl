struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

#include ../basic/tone.chunk.wgsl;

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let hdrColor: vec4<f32> = textureSample(u_texture, u_sampler, vo.uv);
  var color = acesToneMapping(hdrColor.rgb);

  return vec4<f32>(color, hdrColor.a);
}
