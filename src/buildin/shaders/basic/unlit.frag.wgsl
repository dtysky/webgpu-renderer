struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] texcoord_0: vec2<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  return textureSample(u_baseColorTexture, u_sampler, vo.texcoord_0);
}
