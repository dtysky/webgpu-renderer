struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  var ndcLightPos = uniforms.u_vp * vec4<f32>(uniforms.u_lightPos, 1.);
  ndcLightPos = ndcLightPos / ndcLightPos.w;
  let ndcPos = vo.position.xy / vo.position.w;

  // return vec4<f32>(ssLightPos.xy - vo.position.xy / vo.position.w, 0., 1.);
  return vec4<f32>(ndcPos.xy - ndcLightPos.xy, 0., 1.);
  // return vec4<f32>(1., 0., 0., 1.);
}
