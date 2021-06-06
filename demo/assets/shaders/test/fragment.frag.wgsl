struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_uv: vec2<f32>;
};

[[group(0), binding(0)]] var u_sampler: sampler;
[[group(0), binding(1)]] var u_texture: texture_2d<f32>;

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  return textureSample(u_texture, u_sampler, vo.v_uv);
  // return vec4<f32>(vo.v_uv.x, vo.v_uv.y, 0., 1.);
}
