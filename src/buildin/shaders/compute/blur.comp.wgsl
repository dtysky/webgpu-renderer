const c_radius: i32 = ${RADIUS};
const c_windowSize: i32 = ${WINDOW_SIZE};

@compute @workgroup_size(c_windowSize, c_windowSize, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_input, 0);
  let windowSize: vec2<i32> = vec2<i32>(c_windowSize, c_windowSize);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * windowSize;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(size);

  var weightsSum: f32 = 0.;
  var res: vec4<f32> = vec4<f32>(0., 0., 0., 1.);
  for (var r: i32 = -c_radius; r <= c_radius; r = r + 1) {
    for (var c: i32 = -c_radius; c <= c_radius; c = c + 1) {
      let iuv: vec2<i32> = baseIndex + vec2<i32>(r, c);

      if (any(iuv < vec2<i32>(0)) || any(iuv >= size)) {
        continue;
      }

      let weightIndex: i32 = (r + c_radius) * c_windowSize + (c + c_radius);
      let weight: f32 = material.u_kernel[weightIndex / 4][weightIndex % 4];
      weightsSum = weightsSum + weight;
      res = res + weight * textureLoad(u_input, iuv, 0);
    }
  }
  res = res / f32(weightsSum);

  textureStore(u_output, baseIndex, res);
}
