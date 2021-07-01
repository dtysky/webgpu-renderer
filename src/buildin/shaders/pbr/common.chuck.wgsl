struct PBRData {
  N: vec3<f32>;
  V: vec3<f32>;
  L: vec3<f32>;
  reflectance0: vec3<f32>;
  reflectance90: vec3<f32>;
  alphaRoughness: f32;
  diffuseColor: vec3<f32>;
  specularColor: vec3<f32>;
  ao: vec3<f32>;
  roughness: f32;
  NdotV: f32;
};

fn pbrDiffuse(diffuseColor: vec3<f32>)-> vec3<f32> {
  return diffuseColor * 0.3183098861837907;
}

fn pbrSpecularReflection(reflectance0: vec3<f32>, reflectance90: vec3<f32>, VdotH: f32)-> vec3<f32> {
  return reflectance0 + (reflectance90 - reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

fn pbrGeometricOcclusion(NdotL: f32, NdotV: f32, alphaRoughness: f32)-> f32 {
  let r: f32 = alphaRoughness * alphaRoughness;

  let attenuationL: f32 = 2.0 * NdotL / (NdotL + sqrt(r + (1.0 - r) * (NdotL * NdotL)));
  let attenuationV: f32 = 2.0 * NdotV / (NdotV + sqrt(r + (1.0 - r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

fn pbrMicrofacetDistribution(alphaRoughness: f32, NdotH: f32)-> f32 {
  let roughnessSq: f32 = alphaRoughness * alphaRoughness;
  let f: f32 = (NdotH * roughnessSq - NdotH) * NdotH + 1.0;
  return roughnessSq * 0.3183098861837907 / (f * f);
}

fn preparePBR(
  isSpecGloss: bool, baseColor: vec4<f32>,
  view: vec3<f32>, normal: vec3<f32>,
  metal: f32, rough: f32,
  spec: vec3<f32>, gloss: f32
) -> PBRData {
  var pbr: PBRData;

  pbr.N = normal;
  pbr.V = view;
  
  var specularColor: vec3<f32>;
  var diffuseColor: vec3<f32>;
  var roughness: f32;

  // metallic roughness
  if (!isSpecGloss) {
    roughness = clamp(rough, 0.04, 1.0);
    let metallic: f32 = clamp(metal, 0.0, 1.0);
    let f0: vec3<f32> = vec3<f32>(0.04, 0.04, 0.04);

    diffuseColor = (1.0 - metallic) * (baseColor.rgb * (vec3<f32>(1.0, 1.0, 1.0) - f0));
    specularColor = mix(f0, baseColor.rgb, vec3<f32>(metallic));
  }
  else {
  // specular glossiness
    let specular: vec3<f32> = spec.rgb;

    roughness = 1.0 - gloss;
    diffuseColor = baseColor.rgb * (1.0 - max(max(specular.r, specular.g), specular.b));
    specularColor = specular;
  }
  
  pbr.roughness = roughness;
  pbr.specularColor = specularColor;
  
  let reflectance: f32 = max(max(specularColor.r, specularColor.g), specularColor.b);
  let reflectance90: f32 = clamp(reflectance * 25.0, 0.0, 1.0);
  pbr.reflectance0 = specularColor.rgb;
  pbr.reflectance90 = vec3<f32>(1.0, 1.0, 1.0) * reflectance90;

  pbr.NdotV = clamp(abs(dot(pbr.N, pbr.V)), 0.001, 1.0);
  pbr.alphaRoughness = roughness * roughness;

  return pbr;
}

fn pbrCalculateLo(pbr: PBRData, lightDir: vec3<f32>, radiance: vec3<f32>)-> vec3<f32> {
  let H: vec3<f32> = normalize(lightDir + pbr.V);
  let NdotL: f32 = clamp(dot(pbr.N, lightDir), 0.001, 1.0);
  let NdotH: f32 = clamp(dot(pbr.N, H), 0.0, 1.0);
  let LdotH: f32 = clamp(dot(lightDir, H), 0.0, 1.0);
  let VdotH: f32 = clamp(dot(pbr.V, H), 0.0, 1.0);
  // Calculate the shading terms for the microfacet specular shading model
  let F: vec3<f32> = pbrSpecularReflection(pbr.reflectance0, pbr.reflectance90, VdotH);
  let G: f32 = pbrGeometricOcclusion(NdotL, pbr.NdotV, pbr.alphaRoughness);
  let D: f32 = pbrMicrofacetDistribution(pbr.alphaRoughness, NdotH);

  let specContrib: vec3<f32> = F * G * D / (4.0 * NdotL * pbr.NdotV);
  // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
  return radiance * NdotL * specContrib;
}
