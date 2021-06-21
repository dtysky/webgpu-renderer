struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] wPosition: vec4<f32>;
  [[location(1)]] texcoord_0: vec2<f32>;
  [[location(2)]] normal: vec3<f32>;
  [[location(3)]] meshMatIndex: vec2<u32>;
};

[[stage(vertex)]]
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;
  
  let wPosition: vec4<f32> = vec4<f32>(attrs.position, 1.);
  
  output.position = uniforms.u_vp * wPosition;
  output.wPosition = wPosition;
  output.texcoord_0 = attrs.texcoord_0;
  output.normal = attrs.normal;
  // meshIndex will be stored in normalMeshIndex.a, a of clearColor is 1
  output.meshMatIndex.x = attrs.meshMatIndex.x + 2u;
  output.meshMatIndex.y = attrs.meshMatIndex.y;

  return output;
}
