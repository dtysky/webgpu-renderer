struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(1)]] texcoord_0: vec2<f32>;
  [[location(2)]] normal: vec3<f32>;
  [[location(3)]] meshMatIndex: vec2<u32>;
};

struct FragmentOutput {
  [[location(0)]] positionMetal: vec4<f32>;
  // [[location(1)]] colorRough: vec4<f32>;
  // [[location(2)]] normalMeshIndex: vec4<f32>;
  // [[location(3)]] faceNormalMatIndex: vec4<f32>;
};

[[stage(fragment)]]
fn main(vo: VertexOutput) -> [[location(0)]] vec4<f32> {
  // var fo: FragmentOutput;

  // return textureSample(u_baseColorTexture, u_sampler, vo.texcoord_0);
  // return fo;

  return vec4<f32>(1., 0., 0., 1.);
}
