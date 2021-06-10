struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_texcoord_0: vec2<f32>;
  [[location(1)]] v_normal: vec3<f32>;
  [[location(2)]] v_tangent: vec4<f32>;
  [[location(3)]] v_color_0: vec3<f32>;
  [[location(4)]] v_texcoord_1: vec2<f32>;
};

[[stage(vertex)]]
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;

  output.Position = uniforms.u_world * vec4<f32>(attrs.position, 1.);

  #if defined(USE_TEXCOORD_0)
    output.v_texcoord_0 = attrs.texcoord_0;
  #endif

  #if defined(USE_NORMAL)
    output.v_normal = attrs.normal;
  #endif

  #if defined(USE_TANGENT)
    output.v_tangent = attrs.tangent;
  #endif

  #if defined(USE_COLOR_0)
    output.v_color_0 = attrs.color_0;
  #endif

  #if defined(USE_TEXCOORD_1)
    output.v_texcoord_1 = attrs.texcoord_1;
  #endif

  return output;
}
