struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_uv: vec2<f32>;
};

[[stage(vertex)]]
  fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  output.Position = uniforms.u_world * vec4<f32>(attrs.position, 1.);
  output.v_uv = attrs.uv;

  return output;
}
