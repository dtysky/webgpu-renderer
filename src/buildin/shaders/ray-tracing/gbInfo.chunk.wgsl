fn genWorldRayByGBuffer(uv: vec2<f32>, gBInfo: HitPoint) -> Ray {
  let pixelSSPos: vec4<f32> = vec4<f32>(uv.x * 2. - 1., 1. - uv.y * 2., 0., 1.);
  var pixelWorldPos: vec4<f32> = global.u_viewInverse * global.u_projInverse * pixelSSPos;
  pixelWorldPos = pixelWorldPos / pixelWorldPos.w;

  return genRay(pixelWorldPos.xyz, normalize(gBInfo.position - pixelWorldPos.xyz));
};

fn getGBInfo(index: vec2<i32>) -> HitPoint {
  var info: HitPoint;

  let wPMtlSpec: vec4<f32> = textureLoad(u_gbPositionMetalOrSpec, index, 0);
  let dfRghGls: vec4<f32> = textureLoad(u_gbBaseColorRoughOrGloss, index, 0);
  let nomGlass: vec4<f32> = textureLoad(u_gbNormalGlass, index, 0);
  let meshIdMatIdMatType: vec4<u32> = textureLoad(u_gbMeshIndexMatIndexMatType, index, 0);

  info.position = wPMtlSpec.xyz;
  info.metal = wPMtlSpec.w;
  info.baseColor = dfRghGls.xyz;
  info.rough = dfRghGls.w;
  info.spec = vec3<f32>(wPMtlSpec.w);
  info.gloss = dfRghGls.w;
  info.normal = nomGlass.xyz;
  info.sign = 1.;
  info.glass = nomGlass.w;
  info.meshIndex = meshIdMatIdMatType.x;
  info.matIndex = meshIdMatIdMatType.y;
  let matType: u32 = meshIdMatIdMatType.z;
  info.hit = meshIdMatIdMatType.w == 2u;
  info.hited = f32(meshIdMatIdMatType.w);
  info.isSpecGloss = isMatSpecGloss(matType);
  info.isGlass = isMatGlass(matType);
  info.isLight = info.hit && isMatLight(matType);
  info.matType = matType;
  info.pbrData = pbrPrepareData(info.isSpecGloss, info.baseColor, info.metal, info.rough, info.spec, info.gloss);

  return info;
};
