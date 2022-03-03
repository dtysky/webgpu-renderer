fn decodeChild(index: u32) -> Child {
  return Child((index >> 31u) != 0u, (index << 1u) >> 1u);
}

fn getBVHNodeInfo(offset: u32) -> BVHNode {
  var node: BVHNode;
  let data0: vec4<f32> = u_bvh.value[offset];
  let data1: vec4<f32> = u_bvh.value[offset + 1u];
  node.child0Index = bitcast<u32>(data0[0]);
  node.child1Index = bitcast<u32>(data1[0]);
  node.min = data0.yzw;
  node.max = data1.yzw;

  return node;
}

fn getBVHLeafInfo(offset: u32) -> BVHLeaf {
  var leaf: BVHLeaf;
  let data1: vec4<f32> = u_bvh.value[offset];
  leaf.primitives = bitcast<u32>(data1.x);
  leaf.indexes.x = bitcast<u32>(data1.y);
  leaf.indexes.y = bitcast<u32>(data1.z);
  leaf.indexes.z = bitcast<u32>(data1.w);

  return leaf;
}

fn getFaceNormal(frag: FragmentInfo) -> vec3<f32> {
  return normalize(cross(frag.p1 - frag.p0, frag.p2 - frag.p0));
}

fn getNormal(
  frag: FragmentInfo, uv: vec2<f32>,
  textureId: i32, normalScale: f32
) -> vec3<f32> {
  var normal: vec3<f32> = normalize(
    frag.n0 * frag.weights[0] + frag.n0 * frag.weights[1] + frag.n0 * frag.weights[2]
  );
  normal = normal;

  if (textureId == -1) {
    return normal;
  }

  // // http://www.thetenthplanet.de/archives/1180
  let dp1: vec3<f32> = frag.p1 - frag.p0;
  let dp2: vec3<f32> = frag.p2 - frag.p0;
  let duv1: vec2<f32> = frag.uv2 - frag.uv0;
  let duv2: vec2<f32> = frag.uv1 - frag.uv0;
  let dp2perp: vec3<f32> = cross(dp2, normal);
  let dp1perp: vec3<f32> = cross(normal, dp1);
  var dpdu: vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
  var dpdv: vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
  let invmax: f32 = inverseSqrt(max(dot(dpdu, dpdu), dot(dpdv, dpdv)));
  dpdu = dpdu * invmax;
  dpdv = dpdv * invmax;
  let tbn: mat3x3<f32> = mat3x3<f32>(dpdu, dpdv, normal);
  var tNormal: vec3<f32> = 2. * textureSampleLevel(u_normalTextures, u_sampler, uv, textureId, 0.).xyz - 1.;
  tNormal = tNormal * vec3<f32>(normalScale, normalScale, 1.);

  return normalize(tbn * tNormal);
}

// https://tavianator.com/2011/ray_box.html
fn boxHitTest(ray: Ray, maxVal: vec3<f32>, minVal: vec3<f32>) -> f32 {
  let t1: vec3<f32> = (minVal - ray.origin) * ray.invDir;
  let t2: vec3<f32> = (maxVal - ray.origin) * ray.invDir;
  let tvmin: vec3<f32> = min(t1, t2);
  let tvmax: vec3<f32> = max(t1, t2);
  let tmin: f32 = max(tvmin.x, max(tvmin.y, tvmin.z));
  let tmax: f32 = min(tvmax.x, min(tvmax.y, tvmax.z));

  if (tmax - tmin < 0.) {
    return -1.;
  }
  
  if (tmin > 0.) {
    return tmin;
  }

  return tmax;
}

fn triangleHitTest(ray: Ray, leaf: BVHLeaf) -> FragmentInfo {
  var info: FragmentInfo;
  let indexes: vec3<u32> = leaf.indexes;
  info.p0 = u_positions.value[indexes[0]];
  info.p1 = u_positions.value[indexes[1]];
  info.p2 = u_positions.value[indexes[2]];

  // if ray is very near to its egde, test will be failed, especially when trangle is very small
  let e0: vec3<f32> = info.p1 - info.p0;
  let e1: vec3<f32> = info.p2 - info.p0;
  let p: vec3<f32> = cross(ray.dir, e1);
  var det: f32 = dot(e0, p);
  var t: vec3<f32> = ray.origin - info.p0;

  if (det < 0.) {
    t = -t;
    det = -det;
  }

  if (det < 0.0001) {
    return info;
  }

  let u: f32 = dot(t, p);

  if (u < 0. || u > det) {
    return info;
  }

  let q: vec3<f32> = cross(t, e0);
  let v: f32 = dot(ray.dir, q);

  if (v < 0. || v + u - det > 0.) {
    return info;
  }

  let lt: f32 = dot(e1, q);

  if (lt < 0.) {
    return info;
  }

  let invDet: f32 = 1. / det;
  info.weights = vec3<f32>(0., u, v) * invDet;
  info.weights.x = 1. - info.weights.y - info.weights.z;

  info.hit = true;
  info.t = lt * invDet;
  info.hitPoint = ray.origin + ray.dir * info.t;
  info.uv0 = u_uvs.value[indexes.x];
  info.uv1 = u_uvs.value[indexes.y];
  info.uv2 = u_uvs.value[indexes.z];
  info.n0 = u_normals.value[indexes.x];
  info.n1 = u_normals.value[indexes.y];
  info.n2 = u_normals.value[indexes.z];
  info.meshIndex = u_meshMatIndexes.value[indexes.x].x;
  info.matIndex = u_meshMatIndexes.value[indexes.x].y;
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[info.matIndex];
  info.matType = u32(metallicRoughnessFactorNormalScaleMaterialType[3]);

  return info;
}

fn leafHitTest(ray: Ray, offset: u32, ignoreGlass: bool) -> FragmentInfo {
  var info: FragmentInfo;
  info.t = MAX_RAY_LENGTH;
  var leaf: BVHLeaf = getBVHLeafInfo(offset);
  let primitives: u32 = leaf.primitives;
  
  for (var i: u32 = 0u; i < primitives; i = i + 1u) {
    leaf = getBVHLeafInfo(offset + i);
    let cInfo: FragmentInfo = triangleHitTest(ray, leaf);

    if (ignoreGlass && isMatGlass(cInfo.matType)) {
      continue;
    }

    if (cInfo.hit && cInfo.t < info.t) {
      info = cInfo;
    }
  }

  return info;
}

fn fillHitPoint(frag: FragmentInfo, ray: Ray) -> HitPoint {
  var info: HitPoint;

  info.hit = true;
  info.hited = frag.t;
  info.meshIndex = frag.meshIndex;
  info.matIndex = frag.matIndex;
  let metallicRoughnessFactorNormalScaleMaterialType: vec4<f32> = material.u_metallicRoughnessFactorNormalScaleMaterialTypes[frag.matIndex];
  info.position = frag.p0 * frag.weights[0] + frag.p1 * frag.weights[1] + frag.p2 * frag.weights[2];
  let uv: vec2<f32> = frag.uv0 * frag.weights[0] + frag.uv1 * frag.weights[1] + frag.uv2 * frag.weights[2];
  let textureIds: vec4<i32> = material.u_matId2TexturesId[frag.matIndex];  
  let faceNormal: vec3<f32> = getFaceNormal(frag);
  info.sign = sign(dot(faceNormal, -ray.dir));
  info.normal = info.sign * getNormal(frag, uv, textureIds[1], metallicRoughnessFactorNormalScaleMaterialType[2]);
  let baseColor: vec4<f32> = getBaseColor(material.u_baseColorFactors[frag.matIndex], textureIds[0], uv);
  info.baseColor = baseColor.rgb;
  info.glass = baseColor.a;
  info.matType = frag.matType;
  info.isSpecGloss = isMatSpecGloss(frag.matType);
  info.isGlass = isMatGlass(frag.matType);

  if (info.isSpecGloss) {
    let specularGlossinessFactors: vec4<f32> = material.u_specularGlossinessFactors[frag.matIndex];
    info.spec = getSpecular(specularGlossinessFactors.xyz, textureIds[2], uv).rgb;
    info.gloss = getGlossiness(specularGlossinessFactors[3], textureIds[2], uv);
  } else {
    info.metal = getMetallic(metallicRoughnessFactorNormalScaleMaterialType[0], textureIds[2], uv);
    info.rough = getRoughness(metallicRoughnessFactorNormalScaleMaterialType[1], textureIds[2], uv);
  }

  info.pbrData = pbrPrepareData(info.isSpecGloss, info.baseColor, info.metal, info.rough, info.spec, info.gloss);

  return info;
}

fn hitTest(ray: Ray) -> HitPoint {
  var hit: HitPoint;
  var fragInfo: FragmentInfo;
  fragInfo.t = MAX_RAY_LENGTH;
  var node: BVHNode;
  var nodeStack: array<u32, ${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset, false);

      if (info.hit && info.t < fragInfo.t) {
        fragInfo = info;
      }

      continue;
    }

    node = getBVHNodeInfo(child.offset);
    let hited: f32 = boxHitTest(ray, node.max, node.min);

    // if ray.origin is in bvh box, the minT may be less than zero, hited will be maxT
    // if (hited < 0. || hited > fragInfo.t) {
    if (hited < 0.) {
      continue;
    }

    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  if (fragInfo.hit) {
    hit = fillHitPoint(fragInfo, ray);
  }

  return hit;
}

fn hitTestShadow(ray: Ray, maxT: f32) -> FragmentInfo {
  var fragInfo: FragmentInfo;
  var node: BVHNode;
  var nodeStack: array<u32, ${BVH_DEPTH}>;
  nodeStack[0] = 0u;
  var stackDepth: i32 = 0;
  
  loop {
     if (stackDepth < 0) {
       break;
     }

    let child = decodeChild(nodeStack[stackDepth]);
    stackDepth = stackDepth - 1;

    if (child.isLeaf) {
      let info: FragmentInfo = leafHitTest(ray, child.offset, true);

      if (info.hit && info.t < maxT && info.t > EPS) {
        return info;
      }

      continue;
    }

    node = getBVHNodeInfo(child.offset);
    let hited: f32 = boxHitTest(ray, node.max, node.min);

    if (hited < 0.) {
      continue;
    }

    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child0Index;
    stackDepth = stackDepth + 1;
    nodeStack[stackDepth] = node.child1Index;
  }

  return fragInfo;
}

fn hitTestXZPlane(ray: Ray, inverseMat: mat4x4<f32>) -> vec3<f32> {
  let invDir: vec3<f32> = normalize((inverseMat * vec4<f32>(ray.dir, 0.)).xyz);
  let normal: vec3<f32> = vec3<f32>(0., 0., 1.);
  let dotVal: f32 = dot(invDir, normal);

  if (abs(dotVal) < EPS) {
    return vec3<f32>(MAX_RAY_LENGTH, MAX_RAY_LENGTH, MAX_RAY_LENGTH);
  }
  
  let invOrigin: vec3<f32> = (inverseMat * vec4<f32>(ray.origin, 1.)).xyz;
  let t: f32 = dot(-invOrigin, normal) / dotVal;

  if (t < EPS) {
    return vec3<f32>(MAX_RAY_LENGTH, MAX_RAY_LENGTH, MAX_RAY_LENGTH);
  }

  return vec3<f32>(invOrigin.xy + t * invDir.xy, t);
}

fn hitTestLights(ray: Ray) -> vec4<f32> {
  let areaLight: LightInfo = global.u_lightInfos[0];
  var res: vec4<f32> = vec4<f32>(areaLight.color.rgb, MAX_RAY_LENGTH);
  // only support one area light now
  if (areaLight.lightType != LIGHT_TYPE_AREA) {
    return res;
  }

  let xyt: vec3<f32> = hitTestXZPlane(ray, areaLight.worldTransformInverse);

  var hit: bool = false;
  if (areaLight.areaMode == LIGHT_AREA_DISC) {
    hit = length(xyt.xy) < areaLight.areaSize.x;
  } else {
    hit = all(abs(xyt.xy) < areaLight.areaSize / 2.);
  }

  if (hit) {
    res.a = xyt.z;
  }

  return res;
}
