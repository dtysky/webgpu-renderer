struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  let gamma: f32 = 2.2;
  let hdrColor: vec4<f32> = textureSample(u_texture, u_sampler, vo.uv);

  // var mapped: vec3<f32> = hdrColor.rgb / (hdrColor.rgb + vec3<f32>(1.0));
  // mapped = pow(mapped, vec3<f32>(1.0 / gamma));

  // if (vo.uv.x < 0.5) {
  //   mapped = hdrColor.rgb;
  // }

  // return vec4<f32>(mapped, hdrColor.a);
  return hdrColor;
}
