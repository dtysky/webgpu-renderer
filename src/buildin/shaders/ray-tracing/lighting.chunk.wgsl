fn calcBrdfDirectOrSpecular(
  pbr: PBRData, normal: vec3<f32>,
  viewDir: vec3<f32>, lightDir: vec3<f32>,
  isDirect: bool, probDiffuse: f32
)-> vec3<f32> {
  let H: vec3<f32> = normalize(lightDir + viewDir);
  let NdotV: f32 = clamp(abs(dot(normal, viewDir)), 0.001, 1.0);
  let NdotL: f32 = clamp(abs(dot(normal, lightDir)), 0.001, 1.0);
  let NdotH: f32 = clamp(abs(dot(normal, H)), 0.0, 1.0);
  let LdotH: f32 = clamp(abs(dot(lightDir, H)), 0.0, 1.0);
  let VdotH: f32 = clamp(dot(viewDir, H), 0.0, 1.0);
  // Calculate the shading terms for the microfacet specular shading model
  let F: vec3<f32> = pbrSpecularReflection(pbr.reflectance0, pbr.reflectance90, VdotH);
  let G: f32 = pbrGeometricOcclusion(NdotL, NdotV, pbr.alphaRoughness);
  let D: f32 = pbrMicrofacetDistribution(pbr.alphaRoughness, NdotH);

  let specular: vec3<f32> = F * G * D / (4.0 * NdotL * NdotV);

  if (isDirect) {
    let diffuse: vec3<f32> = NdotL * 0.3183098861837907 * pbr.diffuseColor;
    return specular + diffuse;
  }

  let specularPdf: f32 = D * NdotH / (4.0 * LdotH);
  return NdotL * specular / (mix(specularPdf, 0., probDiffuse));
}

fn calcDirectColor(ray: Ray, hit: HitPoint, random: vec2<f32>) -> vec3<f32> {
  // sample area lights, get radiance or shadow
  let areaLight: LightInfo = global.u_lightInfos[0];

  // only support one area light now
  if (areaLight.lightType != LIGHT_TYPE_AREA) {
    return vec3<f32>(0.);
  }

  var samplePoint2D: vec2<f32>;
  let normal: vec3<f32> = normalize((areaLight.worldTransform * vec4<f32>(0., 0., -1., 0.)).xyz);
  var area: f32;
  if (areaLight.areaMode == LIGHT_AREA_DISC) {
    samplePoint2D = sampleCircle(random) * areaLight.areaSize.x;
    area = 2. * PI * areaLight.areaSize.x;
  } else {
    samplePoint2D = (random) * areaLight.areaSize;
    area = samplePoint2D.x * samplePoint2D.y;
    samplePoint2D = samplePoint2D * 2. - areaLight.areaSize;
  }

  let samplePoint: vec4<f32> = areaLight.worldTransform * vec4<f32>(samplePoint2D.x, samplePoint2D.y, 0., 1.);
  var sampleDir: vec3<f32> = samplePoint.xyz - hit.position;

  let cosine: f32 = dot(normal, sampleDir);
  if (cosine > 0.) {
    // backface
    return vec3<f32>(0.);
  }

  let maxT: f32 = length(sampleDir);
  sampleDir = normalize(sampleDir);
  let sampleLight: Ray = genRay(hit.position + RAY_DIR_OFFSET * sampleDir + RAY_NORMAL_OFFSET * hit.normal, sampleDir);
  let shadowInfo: FragmentInfo = hitTestShadow(sampleLight, maxT);

  if (shadowInfo.hit) {
    return vec3<f32>(0.);
  }

  let pdf: f32 = maxT * maxT / (area * -cosine);
  let directLight: vec3<f32> = areaLight.color.rgb / pdf;
  let brdf = calcBrdfDirectOrSpecular(hit.pbrData, hit.normal, -ray.dir, sampleDir, true, 0.);

  return directLight * brdf;
}

fn calcDiffuseFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>, probDiffuse: f32) -> vec3<f32> {
  // let diffusePdf: f32 = NdotL * 0.3183098861837907;
  return hit.pbrData.diffuseColor / probDiffuse;
}

fn calcSpecularFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>, probDiffuse: f32) -> vec3<f32> {
  return calcBrdfDirectOrSpecular(hit.pbrData, hit.normal, -ray.dir, nextDir.xyz, false, probDiffuse);
}

fn calcTransmissionFactor(ray: Ray, hit: HitPoint, nextDir: vec3<f32>) -> vec3<f32> {
  return hit.baseColor;
}

fn calcOutColor(ray: Ray, hit: HitPoint) -> vec3<f32> {
  // rgbd
  let bgColor: vec4<f32> = textureSampleLevel(u_envTexture, u_sampler, ray.dir, 0.);
  return bgColor.rgb / bgColor.a * global.u_envColor.rgb;
}
