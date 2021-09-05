let A: f32 = 2.51;
let B: f32 = 0.03;
let C: f32 = 2.43;
let D: f32 = 0.59;
let E: f32 = 0.14;	

fn acesToneMapping(color: vec3<f32>) -> vec3<f32> {
  return (color * (A * color + B)) / (color * (C * color + D) + E); 
}

fn gammaCorrect(color: vec3<f32>, gamma: f32) -> vec3<f32> {
  return pow(color, vec3<f32>(1. / gamma));
}
