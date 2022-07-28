struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@stage(fragment)
fn main(vo: VertexOutput) -> @location(0) vec4<f32> {
  var color: vec4<f32> = material.u_color;

  #if defined(USE_COLOR_0)
    color = color * vec4<f32>(vo.color_0, 1.);
  #endif

  return color;
}
