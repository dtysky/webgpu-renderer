struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

let A: f32 = 2.51;
let B: f32 = 0.03;
let C: f32 = 2.43;
let D: f32 = 0.59;
let E: f32 = 0.14;	

fn acesToneMapping(color: vec3<f32>) -> vec3<f32> {
  return (color * (A * color + B)) / (color * (C * color + D) + E); 
}

fn gammaCorrect(color: vec3<f32>) -> vec3<f32> {
  return pow(color, vec3<f32>(0.45454545454545453));
}

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  let gamma: f32 = 2.2;
  let hdrColor: vec4<f32> = textureSample(u_texture, u_sampler, vo.uv);
  var color = acesToneMapping(hdrColor.rgb);

  return vec4<f32>(color, hdrColor.a);
}
