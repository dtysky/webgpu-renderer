struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

@vertex
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  output.Position = global.u_vp * mesh.u_world * vec4<f32>(attrs.position, 1.);

  #if defined(USE_TEXCOORD_0)
    output.texcoord_0 = attrs.texcoord_0;
  #endif

  #if defined(USE_NORMAL)
    output.normal = attrs.normal;
  #endif

  #if defined(USE_TANGENT)
    output.tangent = attrs.tangent;
  #endif

  #if defined(USE_COLOR_0)
    output.color_0 = attrs.color_0;
  #endif

  #if defined(USE_TEXCOORD_1)
    output.texcoord_1 = attrs.texcoord_1;
  #endif

  return output;
}
