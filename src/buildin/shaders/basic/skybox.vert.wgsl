struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] cubeUV: vec3<f32>;
};

[[stage(vertex)]]
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  let pos: vec4<f32> = vec4<f32>(attrs.position, 1., 1.);
  output.position = pos;
  let t: vec4<f32> = uniforms.u_skyVP * pos;
  output.cubeUV = normalize(t.xyz / t.w);

  return output;
}