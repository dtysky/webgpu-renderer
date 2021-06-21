struct VertexOutput {
  [[builtin(position)]] position: vec4<f32>;
  [[location(0)]] uv: vec2<f32>;
};

[[stage(compute), workgroup_size(16, 16, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  // let size: vec2<i32> = textureDimensions(u_input, 0);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  // let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(size);
  // let center: vec2<i32> = vec2<i32>(localInvocationID.xy) + vec2<i32>(c_radius, c_radius);
  // var color: vec4<f32> = vec4<f32>(0., 0., 0., 1.);

  // textureStore(u_output, baseIndex, uniforms.u_randomSeed);
  textureStore(u_output, baseIndex, vec4<f32>(1., 0., 0., 1.));
}
