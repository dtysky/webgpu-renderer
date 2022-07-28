struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) cubeUV: vec3<f32>,
}

@fragment
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  let tex: vec4<f32> = textureSample(u_cubeTexture, u_sampler, vo.cubeUV);
  return vec4<f32>(tex.rgb * material.u_color.rgb * material.u_exposure * material.u_factor, tex.a);
}
