struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) texcoord_0: vec2<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) tangent: vec4<f32>,
  @location(3) color_0: vec3<f32>,
  @location(4) texcoord_1: vec2<f32>,
}

struct FragmentOutput {
  @location(0) positionMetalOrSpec: vec4<f32>,
  @location(1) baseColorRoughOrGloss: vec4<f32>,
  @location(2) normalGlass: vec4<f32>,
  @location(3) meshIndexMatIndexMatType: vec4<u32>,
}

@fragment
fn main(vo: VertexOutput) -> FragmentOutput {
  var fo: FragmentOutput;

  fo.baseColorRoughOrGloss = vec4<f32>(material.u_lightColor.rgb, 0.);
  fo.meshIndexMatIndexMatType = vec4<u32>(0u, 0u, 4u, 2u);

  return fo;
}
