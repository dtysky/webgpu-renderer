const WINDOW_SIZE: i32 = ${WINDOW_SIZE};

fn calcWeightNumber(factor: f32, a: f32, b: f32) -> f32 {
  return exp(factor * (a - b) * (a - b));
}

fn calcWeightVec2(factor: f32, a: vec2<i32>, b: vec2<i32>) -> f32 {
  let diff: vec2<f32> = vec2<f32>(a - b);
  return exp(factor * dot(diff, diff));
}

fn calcWeightVec3(factor: f32, a: vec3<f32>, b: vec3<f32>) -> f32 {
  let diff: vec3<f32> = a - b;
  return exp(factor * dot(diff, diff));
}

fn calcLum(color: vec3<f32>) -> f32 {
  return dot(color, vec3<f32>(0.2125, 0.7154, 0.0721));
}

fn blur(center: vec2<i32>, size: vec2<i32>) -> vec4<f32> {
  let radius: i32 = WINDOW_SIZE / 2;
  let sigmaD: f32 = material.u_filterFactors.x;
  let sigmaC: f32 = material.u_filterFactors.y;
  let sigmaZ: f32 = material.u_filterFactors.z;
  let sigmaN: f32 = material.u_filterFactors.w;
  var centerColor: vec4<f32> = textureLoad(u_preFilter, center, 0);
  let alpha: f32 = centerColor.a;
  let centerPosition = textureLoad(u_gbPositionMetalOrSpec, center, 0).xyz;
  let centerNormal = textureLoad(u_gbNormalGlass, center, 0).xyz;
  var colors: array<array<vec3<f32>, ${WINDOW_SIZE}>, ${WINDOW_SIZE}>;
  var lums: array<array<f32, ${WINDOW_SIZE}>, ${WINDOW_SIZE}>;

  var minUV: vec2<i32> = max(center - vec2<i32>(radius, radius), vec2<i32>(0));
  var maxUV: vec2<i32> = min(center + vec2<i32>(radius, radius), size);
  var localUV: vec2<i32> = vec2<i32>(0, 0);
  var sumLum: f32 = 0.;
  var count: f32 = 0.;

  for (var r: i32 = minUV.x; r <= maxUV.x; r = r + 1) {
    localUV.y = 0;
    for (var c: i32 = minUV.y; c <= maxUV.y; c = c + 1) {
      let iuv: vec2<i32> = vec2<i32>(r, c);
      let color: vec3<f32> = textureLoad(u_preFilter, iuv, 0).rgb;
      let lum: f32 = calcLum(color);
      colors[localUV.x][localUV.y] = color;
      lums[localUV.x][localUV.y] = lum;

      sumLum = sumLum + lum;
      count = count + 1.;
      localUV.y = localUV.y + 1;
    }
    localUV.x = localUV.x + 1;
  }

  let meanLum: f32 = sumLum / count;

  var std: f32 = 0.;
  for (var r: i32 = 0; r < localUV.x; r = r + 1) {
    for (var c: i32 = 0; c < localUV.y; c = c + 1) {
      let lum: f32 = lums[r][c];
      std = std + (lum - meanLum) * (lum - meanLum);
    }
  }
  std = sqrt(std / (count - 1.));

  let largestLum: f32 = max(meanLum + std * 2., 1.);

  var lum: f32 = calcLum(centerColor.rgb);
  if (lum > largestLum) {
    centerColor = centerColor * largestLum / lum;
  }

  localUV = vec2<i32>(0, 0);
  var weightsSum: f32 = 0.;
  var res: vec3<f32> = vec3<f32>(0., 0., 0.);

  for (var r: i32 = minUV.x; r <= maxUV.x; r = r + 1) {
    localUV.y = 0;
    for (var c: i32 = minUV.y; c <= maxUV.y; c = c + 1) {
      var color: vec3<f32> = colors[localUV.x][localUV.y];
      lum = lums[localUV.x][localUV.y];

      if (lum > largestLum) {
        color = color * largestLum / lum;
      }

      let iuv: vec2<i32> = vec2<i32>(r, c);
      let position: vec4<f32> = textureLoad(u_gbPositionMetalOrSpec, iuv, 0);
      let normal: vec4<f32> = textureLoad(u_gbNormalGlass, iuv, 0);
      let weight: f32 = calcWeightVec2(sigmaD, iuv, center)
        * calcWeightVec3(sigmaC, color.rgb, centerColor.rgb)
        * calcWeightVec3(sigmaN, normal.xyz, centerNormal.xyz)
        * calcWeightNumber(sigmaZ, position.z, centerPosition.z);
      weightsSum = weightsSum + weight;
      res = res + weight * color;

      localUV.y = localUV.y + 1;
    }
    localUV.x = localUV.x + 1;
  }

  res = res / weightsSum;

  return vec4<f32>(res, alpha);
}

@compute @workgroup_size(16, 16, 1)
fn main(
  @builtin(workgroup_id) workGroupID : vec3<u32>,
  @builtin(local_invocation_id) localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_preFilter);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * 16;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);

  if (baseIndex.x >= size.x || baseIndex.y >= size.y) {
    return;
  }

  let result: vec4<f32> = blur(baseIndex, size);

  textureStore(u_output, baseIndex, result);
}
