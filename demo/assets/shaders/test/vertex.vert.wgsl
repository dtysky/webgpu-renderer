struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_uv: vec2<f32>;
};

[[stage(vertex)]]
fn main([[location(0)]] a_position: vec4<f32>, [[location(1)]] a_uv: vec2<f32>) -> VertexOutput {
  var output: VertexOutput;

  output.Position = uniforms.u_world * a_position;
  // output.Position = a_position;
  output.v_uv = a_uv;

  return output;
}
