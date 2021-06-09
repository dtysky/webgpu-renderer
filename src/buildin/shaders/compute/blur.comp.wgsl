let c_radius: i32 = ${MARCO_RADIUS};
let c_windowSize: i32 = ${MARCO_WINDOW_SIZE};

var<workgroup> tileCache: array<array<vec3<f32>, ${TILE_SIZE}>, ${TILE_SIZE}>;

[[stage(compute), workgroup_size(c_windowSize, c_windowSize, 1)]]
fn main(
  [[builtin(workgroup_id)]] workGroupID : vec3<u32>,
  [[builtin(local_invocation_id)]] localInvocationID : vec3<u32>
) {
  let size: vec2<i32> = textureDimensions(u_input, 0);
  let windowSize: vec2<i32> = vec2<i32>(c_windowSize, c_windowSize);
  let groupOffset: vec2<i32> = vec2<i32>(workGroupID.xy) * windowSize;
  let baseIndex: vec2<i32> = groupOffset + vec2<i32>(localInvocationID.xy);
  let baseUV: vec2<f32> = vec2<f32>(baseIndex) / vec2<f32>(size);
  let center: vec2<i32> = vec2<i32>(localInvocationID.xy) + vec2<i32>(c_radius, c_radius);
  var color: vec4<f32> = vec4<f32>(0., 0., 0., 1.);

  if (baseIndex.x < size.x && baseIndex.y < size.y) {
    color = textureSampleLevel(u_input, u_sampler, baseUV, 0.);
    tileCache[center.x][center.y] = color.rgb;
  }

  workgroupBarrier();

  var weightsSum: f32 = 0.;
  var res: vec3<f32>;

  for (var r: i32 = -c_radius; r <= c_radius; r = r + 1) {
    for (var c: i32 = -c_radius; c <= c_radius; c = c + 1) {
      let weightIndex: i32 = (r + c_radius) * c_windowSize + (c + c_radius);
      let weight: f32 = uniforms.u_kernel[weightIndex / 4][weightIndex % 4];
      weightsSum = weightsSum + weight;
      res = res + weight * tileCache[center.x + r][center.y + c];
    }
  }
  res = res / f32(c_windowSize);

  textureStore(u_output, baseIndex, vec4<f32>(res, color.a));
}
