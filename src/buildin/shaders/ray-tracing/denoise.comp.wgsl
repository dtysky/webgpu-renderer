[[stage(compute), workgroup_size(16, 16, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  let pre: vec4<f32> = textureLoad(u_pre, baseIndex);
  let current: vec4<f32> = textureLoad(u_current, baseIndex);

  textureStore(u_output, baseIndex, vec4<f32>(mix(current.rgb, pre.rgb, material.u_preWeight), 1.));
}
