let RADIUS: i32 = 3;
let WINDOW_SIZE: i32 = 7;

fn blur(center: vec2<i32>, size: vec2<i32>) -> vec4<f32> {
  var weightsSum: f32 = 0.;
  var color: vec4<f32> = vec4<f32>(0., 0., 0., 1.);

  for (var r: i32 = -RADIUS; r <= RADIUS; r = r + 1) {
    for (var c: i32 = -RADIUS; c <= RADIUS; c = c + 1) {
      let iuv: vec2<i32> = center + vec2<i32>(r, c);

      if (any(iuv < vec2<i32>(0)) || any(iuv >= size)) {
        continue;
      }

      let weightIndex: i32 = (r + RADIUS) * WINDOW_SIZE + (c + RADIUS);
      // let weight: f32 = material.u_spaceKernel[weightIndex / 4][weightIndex % 4];
      let weight: f32 = 1.;
      // todo: normal weights, meshid weights...
      weightsSum = weightsSum + weight;
      color = color + weight * textureLoad(u_current, iuv);
    }
  }

  return color / f32(weightsSum);
}

[[stage(compute), workgroup_size(16, 16, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_current);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  let pre: vec4<f32> = textureLoad(u_pre, baseIndex);
  var current: vec4<f32>;
  if (baseIndex.x > size.x / 2) {
    current = blur(baseIndex, size);
  } else {
    current = textureLoad(u_current, baseIndex);
  }

  // textureStore(u_output, baseIndex, vec4<f32>(mix(current.rgb, pre.rgb, material.u_preWeight), 1.));
  textureStore(u_output, baseIndex, vec4<f32>(current.rgb, 1.));
}
