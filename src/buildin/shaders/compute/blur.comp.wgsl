[[override(0)]] let c_radius: i32 = 2;
[[override(1)]] let c_windowSize: i32 = 5;

var<workgroup> tileCache: array<array<vec3<f32>, 9>, 9>;

[[stage(compute), workgroup_size(c_windowSize, c_windowSize, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_input, 0);
  let windowSize: vec2<i32> = vec2<i32>(c_windowSize, c_windowSize);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * windowSize;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let center: vec2<i32> = vec2<i32>(localInvocationID.xy) + vec2<i32>(c_radius, c_radius);
  var color: vec4<f32> = vec4<f32>(0., 0., 0., 1.);

  if (baseIndex.x < size.x && baseIndex.y < size.y) {
    color = textureSampleLevel(u_input, u_sampler, vec2<f32>(baseIndex) / vec2<f32>(size), 0.);
    tileCache[center.x][center.y] = color.rgb;
  }

  workgroupBarrier();

  var res: vec3<f32>;

  for (var r: i32 = -c_radius; r <= c_radius; r = r + 1) {
    for (var c: i32 = -c_radius; c <= c_radius; c = c + 1) {
      res = res + (
        // uniforms.u_kernel[(r + c_radius) * c_windowSize + (c + c_radius)] * tileCache[center.x + r][center.y + c]
        tileCache[center.x + r][center.y + c]
      );
    }
  }
  res = res / f32(c_windowSize);

  textureStore(u_output, baseIndex, vec4<f32>(res, color.a));
}
