
fn getDiffuseProb(hit: HitPoint) -> f32 {
  let lumDiffuse: f32 = max(.01, dot(hit.pbrData.diffuseColor, vec3<f32>(0.2125, 0.7154, 0.0721)));
  let lumSpecular: f32 = max(.01, dot(hit.pbrData.specularColor, vec3<f32>(0.2125, 0.7154, 0.0721)));

  return lumDiffuse / (lumDiffuse + lumSpecular);
}

// https://graphics.pixar.com/library/OrthonormalB/paper.pdf
fn orthonormalBasis(normal: vec3<f32>) -> mat3x3<f32> {
  // sign function return 0 if x is 0
  // let zsign: f32 = sign(normal.z) * 1.;
  var zsign: f32 = 1.;
  if (normal.z < 0.) {
    zsign = -1.;
  }
  let a: f32 = -1.0 / (zsign + normal.z);
  let b: f32 = normal.x * normal.y * a;
  let s: vec3<f32> = vec3<f32>(1.0 + zsign * normal.x * normal.x * a, zsign * b, -zsign * normal.x);
  let t: vec3<f32> = vec3<f32>(b, zsign + normal.y * normal.y * a, -normal.y);

  return mat3x3<f32>(s, t, normal);
}

// http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/2D_Sampling_with_Multidimensional_Transformations.html#SamplingaUnitDisk
fn sampleCircle(pi: vec2<f32>) -> vec2<f32> {
  let p: vec2<f32> = 2.0 * pi - 1.0;
  let greater: bool = abs(p.x) > abs(p.y);
  var r: f32;
  var theta: f32;

  if (greater) {
    r = p.x;
    theta = 0.25 * PI * p.y / p.x;
  } else {
    r = p.y;
    theta = PI * (0.5 - 0.25 * p.x / p.y);
  }

  return r * vec2<f32>(cos(theta), sin(theta));
}

fn fresnelSchlickWeight(cosTheta: f32) -> f32 {
  let w: f32 = 1.0 - cosTheta;

  return (w * w) * (w * w) * w;
}

fn fresnelSchlickTIR(cosTheta: f32, r0: f32, ni: f32) -> f32 {
  // moving from a more dense to a less dense medium
  var cos: f32 = cosTheta;
  if (cosTheta < 0.0) {
    let inv_eta: f32 = ni;
    let SinT2: f32 = inv_eta * inv_eta * (1.0 - cosTheta * cosTheta);
    if (SinT2 > 1.0) {
      return 1.0; // total internal reflection
    }

    cos = sqrt(1. - SinT2);
  }

  return mix(fresnelSchlickWeight(cos), 1.0, r0);
}

// http://www.pbr-book.org/3ed-2018/Monte_Carlo_Integration/2D_Sampling_with_Multidimensional_Transformations.html#Cosine-WeightedHemisphereSampling
fn cosineSampleHemisphere(p: vec2<f32>) -> vec3<f32> {
  let h: vec2<f32> = sampleCircle(p);
  let z: f32 = sqrt(max(0.0, 1.0 - h.x * h.x - h.y * h.y));

  return vec3<f32>(h, z);
}

fn calcDiffuseLightDir(basis: mat3x3<f32>, sign: f32, random: vec2<f32>) -> vec3<f32> {
  return basis * sign * cosineSampleHemisphere(random);
}

// GGX distrubtion
fn calcSpecularLightDir(basis: mat3x3<f32>, ray: Ray, hit: HitPoint, random: vec2<f32>) -> vec3<f32> {
  let phi: f32 = PI * 2. * random.x;
  let alpha: f32 = hit.pbrData.alphaRoughness;
  let cosTheta: f32 = sqrt((1.0 - random.y) / (1.0 + (alpha * alpha - 1.0) * random.y));
  let sinTheta: f32 = sqrt(1.0 - cosTheta * cosTheta);
  let halfVector: vec3<f32> = basis * hit.sign * vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);

  return reflect(ray.dir, halfVector);
}

fn calcBrdfDir(ray: Ray, hit: HitPoint, isDiffuse: bool, random: vec2<f32>) -> vec3<f32> {
  let basis: mat3x3<f32> = orthonormalBasis(hit.normal);

  if (isDiffuse) {
    return calcDiffuseLightDir(basis, hit.sign, random);
  }

  return calcSpecularLightDir(basis, ray, hit, random);
}

struct BSDFDirRes {
  dir: vec3<f32>,
  isBTDF: bool,
}

// dir and (0. is brdf, 1. is btdf)
// we suppose all glass are thick glass
fn calcBsdfDir(ray: Ray, hit: HitPoint, reflectProbability: f32) -> BSDFDirRes {
  const nAir: f32 = 1.;
  let nGlass: f32 = 1. / hit.glass;
  var ior: f32 = nGlass; // backface, nGlass / nAir
  var res: BSDFDirRes;

  if (hit.sign > 0.) {
    ior = hit.glass; // nAir / nGlass
  }

  let cosTheta: f32 = dot(hit.normal, -ray.dir);
  var r0: f32 = (nAir - nGlass) / (nAir + nGlass);
  r0 = r0 * r0;
  let F: f32 = fresnelSchlickTIR(cosTheta, r0, ior);

  //@todo: if backface and not full reflection, force refraction
  if (F > reflectProbability) {
    res.dir = reflect(ray.dir, hit.normal);
    res.isBTDF = false;
  } else {
    res.dir = refract(ray.dir, hit.normal, ior);
    res.isBTDF = true;
  }

  return res;
}
