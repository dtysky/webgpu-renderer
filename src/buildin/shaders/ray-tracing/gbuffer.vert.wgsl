struct VertexOutput {
  @location(0) wPosition: vec4<f32>,
  @location(1) texcoord_0: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) @interpolate(flat) meshMatIndex: vec2<u32>,
  @builtin(position) Position: vec4<f32>,
}

@vertex
fn main(attrs: Attrs) -> VertexOutput {
  var output: VertexOutput;
  
  let wPosition: vec4<f32> = vec4<f32>(attrs.position, 1.);
  
  output.Position = global.u_vp * wPosition;
  output.wPosition = wPosition;
  output.texcoord_0 = attrs.texcoord_0;
  output.normal = attrs.normal;
  output.meshMatIndex.x = attrs.meshMatIndex.x;
  output.meshMatIndex.y = attrs.meshMatIndex.y;

  return output;
}
