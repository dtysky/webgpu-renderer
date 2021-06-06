// [[block]] struct Uniforms {
  // u_world: mat4x4<f32>;
  // u_vp: mat4x4<f32>;
// };
// [[binding(0), group(0)]] var<uniform> uniforms: Uniforms;

struct VertexOutput {
  [[builtin(position)]] Position: vec4<f32>;
  [[location(0)]] v_uv: vec2<f32>;
};

[[stage(vertex)]]
fn main([[location(0)]] a_position: vec4<f32>, [[location(1)]] a_uv: vec2<f32>) -> VertexOutput {
  var output: VertexOutput;

  // output.Position = uniforms.u_world * a_position;
  output.Position = a_position;
  output.v_uv = a_uv;

  return output;
}

// let pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
//     vec2<f32>(0.0, 0.5),
//     vec2<f32>(-0.5, -0.5),
//     vec2<f32>(0.5, -0.5));

// [[stage(vertex)]]
// fn main([[builtin(vertex_index)]] VertexIndex : u32) -> VertexOutput {
//   var vo: VertexOutput;

//   vo.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);

//   return vo;
// }