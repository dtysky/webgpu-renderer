let WINDOW_SIZE: i32 = ${WINDOW_SIZE};

fn calcWeightNumber(params: vec2<f32>, a: f32, b: f32) -> f32 {
  return params.x * exp(params.y * abs(a - b));
}

fn calcWeightVec2(params: vec2<f32>, a: vec2<f32>, b: vec2<f32>) -> f32 {
  return params.x * exp(params.y * length(a - b));
}

fn calcWeightVec3(params: vec2<f32>, a: vec3<f32>, b: vec3<f32>) -> f32 {
  return params.x * exp(params.y * length(a - b));
}

fn blur(center: vec2<i32>, size: vec2<i32>) -> vec4<f32> {
  let radius: i32 = WINDOW_SIZE / 2;
  let zigmaD: vec2<f32> = material.u_filterFactors[0].xy;
  let zigmaC: vec2<f32> = material.u_filterFactors[1].xy;
  let zigmaZ: vec2<f32> = material.u_filterFactors[2].xy;
  let zigmaN: vec2<f32> = material.u_filterFactors[3].xy;
  let centerColor: vec4<f32> = textureLoad(u_current, center);
  let centerPosition = textureLoad(u_gbPositionMetalOrSpec, center, 0).xyz;
  let centerNormal = textureLoad(u_gbNormalGlass, center, 0).xyz;
  // var colors: array<array<vec3<f32>, WINDOW_SIZE>, WINDOW_SIZE>;

  // var max: vec3<f32> = vec3<f32>(0.);
  // var min: vec3<f32> = vec3<f32>(9999.);
  // for (var r: i32 = -radius; r <= radius; r = r + 1) {
  //   for (var c: i32 = -radius; c <= radius; c = c + 1) {
  //     let iuv: vec2<i32> = center + vec2<i32>(r, c);

  //     if (any(iuv < vec2<i32>(0)) || any(iuv >= size)) {
  //       continue;
  //     }

  //     var color: vec3<f32> = textureLoad(u_current, iuv).rgb;
  //     max = max(max, color);
  //     min = min(min, color);
  //   }
  // }

  // let e: vec3<f32> = mix(max, min, vec3<f32>(.5));
  // let s: vec3<f32> = (max - min) * .5;
  // let small = e - s;
  // let large = e + s;

  var weightsSum: f32 = 0.;
  var res: vec3<f32> = vec3<f32>(0., 0., 0.);

  for (var r: i32 = -radius; r <= radius; r = r + 1) {
    for (var c: i32 = -radius; c <= radius; c = c + 1) {
      let iuv: vec2<i32> = center + vec2<i32>(r, c);

      if (any(iuv < vec2<i32>(0)) || any(iuv >= size)) {
        continue;
      }

      var color: vec3<f32> = textureLoad(u_current, iuv).rgb;
      // color = clamp(color, vec3<f32>(0.), large);
      let position: vec4<f32> = textureLoad(u_gbPositionMetalOrSpec, iuv, 0);
      let normal: vec4<f32> = textureLoad(u_gbNormalGlass, iuv, 0);
      let weight: f32 = calcWeightVec2(zigmaD, vec2<f32>(f32(r), f32(c)), vec2<f32>(0.))
        * calcWeightVec3(zigmaC, color.rgb, centerColor.rgb);
        // * calcWeightVec3(zigmaN, normal.xyz, centerNormal.xyz);
        // * calcWeightNumber(zigmaZ, position.z, centerPosition.z);
      weightsSum = weightsSum + weight;
      res = res + weight * color;
    }
  }

  res = res / weightsSum;

  if (any(isNan(res))) {
    res = centerColor.rgb;
  }

  return vec4<f32>(res, centerColor.a);
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
  // if (baseIndex.x > size.x / 2) {
  //   current = blur(baseIndex, size);
  // } else {
  //   current = textureLoad(u_current, baseIndex);
  // }
  current = textureLoad(u_current, baseIndex);

  textureStore(u_output, baseIndex, vec4<f32>(mix(current.rgb, pre.rgb, vec3<f32>(material.u_preWeight)), current.a));
}
