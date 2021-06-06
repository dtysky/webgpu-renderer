struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_uv: vec2<f32>;
};

[[group(0), binding(1)]] var u_sampler: sampler;
[[group(0), binding(2)]] var u_texture: texture_2d<f32>;

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  return textureSample(u_texture, u_sampler, vo.v_uv);
}
