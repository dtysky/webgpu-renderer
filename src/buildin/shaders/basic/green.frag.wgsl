struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  return vec4<f32>(0., 1., 0., 1.);
}
