import * as THREE from 'three';
import { Model3DPreset, MaterialFinish } from '../../types';

export interface ExplodablePart {
  mesh: THREE.Object3D;
  initialPos: THREE.Vector3;
  explodeDirection: THREE.Vector3;
  explodeDistance: number;
}

export interface BuiltModel {
  group: THREE.Group;
  parts: ExplodablePart[];
  materials: THREE.Material[];
  dispose: () => void;
  updateExplode: (factor: number) => void;
  setMaterialFinish: (finish: MaterialFinish) => void;
  setWireframe: (enabled: boolean) => void;
  setSliceProgress: (progress: number) => void;
}

export function createPBRMaterial(finish: MaterialFinish, isWireframe: boolean = false): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    wireframe: isWireframe,
  });

  switch (finish) {
    case 'vibrant_gloss':
      mat.color = new THREE.Color(0xf59e0b); // Vibrant amber/golden gloss
      mat.roughness = 0.2;
      mat.metalness = 0.15;
      break;

    case 'gold_bronze':
      mat.color = new THREE.Color(0xd4af37); // Rich antique brass/gold
      mat.roughness = 0.28;
      mat.metalness = 0.88;
      break;

    case 'tough_resin':
      mat.color = new THREE.Color(0x38bdf8); // Translucent sky cyan
      mat.roughness = 0.15;
      mat.metalness = 0.05;
      mat.transparent = true;
      mat.opacity = 0.9;
      break;

    case 'carbon_fiber':
      mat.color = new THREE.Color(0x181a1d); // Deep textured matte carbon
      mat.roughness = 0.55;
      mat.metalness = 0.3;
      break;

    case 'titanium':
      mat.color = new THREE.Color(0x94a3b8); // Slate aerospace titanium
      mat.roughness = 0.22;
      mat.metalness = 0.92;
      break;

    default:
      mat.color = new THREE.Color(0x06b6d4);
      mat.roughness = 0.3;
      mat.metalness = 0.5;
  }

  return mat;
}

function registerPart(
  parts: ExplodablePart[],
  obj: THREE.Object3D,
  dir: THREE.Vector3,
  distance: number
): void {
  parts.push({
    mesh: obj,
    initialPos: obj.position.clone(),
    explodeDirection: dir.clone().normalize(),
    explodeDistance: distance,
  });
}

export function buildProceduralModel(preset: Model3DPreset, finish: MaterialFinish): BuiltModel {
  const group = new THREE.Group();
  const parts: ExplodablePart[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const mainMat = createPBRMaterial(finish);
  materials.push(mainMat);

  const accentMat = new THREE.MeshStandardMaterial({
    color: finish === 'gold_bronze' ? 0xb45309 : 0x0284c7,
    roughness: 0.25,
    metalness: 0.8,
  });
  materials.push(accentMat);

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.95,
  });
  materials.push(hardwareMat);

  if (preset === 'anime_keychain') {
    // 1. Chibi Hero Head / Mask
    const headGeo = new THREE.SphereGeometry(0.75, 32, 24);
    geometries.push(headGeo);
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.set(0, 0.2, 0);
    head.castShadow = true;
    group.add(head);
    registerPart(parts, head, new THREE.Vector3(0, 0, 0), 0);

    // 2. Spiky Anime Hair Tufts (3 angled spikes)
    for (let i = -1; i <= 1; i++) {
      const hairGeo = new THREE.ConeGeometry(0.3, 0.9, 16);
      geometries.push(hairGeo);
      const hair = new THREE.Mesh(hairGeo, accentMat);
      hair.position.set(i * 0.45, 0.9, 0);
      hair.rotation.z = -i * 0.4;
      head.add(hair);
    }

    // 3. Anime Mask / Eyes Visor
    const maskGeo = new THREE.BoxGeometry(0.85, 0.22, 0.4);
    geometries.push(maskGeo);
    const mask = new THREE.Mesh(maskGeo, hardwareMat);
    mask.position.set(0, 0.25, 0.55);
    group.add(mask);
    registerPart(parts, mask, new THREE.Vector3(0, 0, 1), 0.8);

    // 4. Torso with Robe / Outfit Collar
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.65, 16);
    geometries.push(bodyGeo);
    const body = new THREE.Mesh(bodyGeo, accentMat);
    body.position.set(0, -0.55, 0);
    body.castShadow = true;
    group.add(body);
    registerPart(parts, body, new THREE.Vector3(0, -1, 0), 0.7);

    // 5. Metal Key Chain Links (3 oval rings)
    for (let j = 0; j < 3; j++) {
      const linkGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16);
      geometries.push(linkGeo);
      const link = new THREE.Mesh(linkGeo, hardwareMat);
      link.position.set(0, 1.45 + j * 0.22, 0);
      link.rotation.y = j % 2 === 0 ? 0 : Math.PI / 2;
      group.add(link);
      registerPart(parts, link, new THREE.Vector3(0, 1, 0), 0.5 + j * 0.3);
    }

    // 6. Split Steel Key Ring at Top
    const ringGeo = new THREE.TorusGeometry(0.45, 0.06, 12, 32);
    geometries.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, hardwareMat);
    ring.position.set(0, 2.35, 0);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    registerPart(parts, ring, new THREE.Vector3(0, 1.2, 0), 1.6);

  } else if (preset === 'photo_to_3d') {
    // 1. Curved Lithophane Translucent Frame
    const plaqueGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.8, 32, 1, true, -Math.PI / 4, Math.PI / 2);
    geometries.push(plaqueGeo);
    const lithoMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffbeb,
      roughness: 0.35,
      metalness: 0.05,
      transmission: 0.65,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    materials.push(lithoMat);
    const plaque = new THREE.Mesh(plaqueGeo, lithoMat);
    plaque.position.set(0, 0.4, -0.6);
    plaque.castShadow = true;
    group.add(plaque);
    registerPart(parts, plaque, new THREE.Vector3(0, 0, 1), 0.8);

    // 2. Beveled Wooden LED Light Plinth Base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.35, 32);
    geometries.push(baseGeo);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Warm Teak Wood
      roughness: 0.7,
      metalness: 0.1,
    });
    materials.push(woodMat);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.set(0, -0.7, 0);
    base.castShadow = true;
    group.add(base);
    registerPart(parts, base, new THREE.Vector3(0, -1, 0), 0.8);

    // 3. Internal Warm LED Glow Cylinder
    const ledGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16);
    geometries.push(ledGeo);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.5,
      roughness: 0.2,
    });
    materials.push(ledMat);
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, -0.3, 0);
    group.add(led);
    registerPart(parts, led, new THREE.Vector3(0, 0.5, 0), 0.4);

    // 4. Personalized Custom Brass Nameplate on base
    const tagGeo = new THREE.BoxGeometry(0.8, 0.14, 0.04);
    geometries.push(tagGeo);
    const tag = new THREE.Mesh(tagGeo, hardwareMat);
    tag.position.set(0, -0.68, 1.25);
    group.add(tag);
    registerPart(parts, tag, new THREE.Vector3(0, 0, 1), 1.2);

  } else if (preset === 'gods_idol') {
    // 1. Ornate Octagonal Sacred Lotus Pedestal
    const lotusGeo = new THREE.CylinderGeometry(1.1, 1.3, 0.4, 8);
    geometries.push(lotusGeo);
    const lotus = new THREE.Mesh(lotusGeo, mainMat);
    lotus.position.set(0, -0.8, 0);
    lotus.castShadow = true;
    group.add(lotus);
    registerPart(parts, lotus, new THREE.Vector3(0, -1, 0), 0.7);

    // 2. Central Devotional Idol Torso & Robes
    const idolGeo = new THREE.CylinderGeometry(0.55, 0.8, 0.9, 24);
    geometries.push(idolGeo);
    const idol = new THREE.Mesh(idolGeo, mainMat);
    idol.position.set(0, -0.1, 0);
    idol.castShadow = true;
    group.add(idol);
    registerPart(parts, idol, new THREE.Vector3(0, 0, 0), 0);

    // 3. Sacred Head with Crown (Mukut)
    const crownGeo = new THREE.ConeGeometry(0.4, 0.75, 16);
    geometries.push(crownGeo);
    const crown = new THREE.Mesh(crownGeo, mainMat);
    crown.position.set(0, 0.8, 0);
    crown.castShadow = true;
    group.add(crown);
    registerPart(parts, crown, new THREE.Vector3(0, 1, 0), 1.0);

    // 4. Ornate Aura Arch (Prabhavali Halo behind the deity)
    const haloGeo = new THREE.TorusGeometry(1.0, 0.08, 16, 32, Math.PI * 1.2);
    geometries.push(haloGeo);
    const halo = new THREE.Mesh(haloGeo, accentMat);
    halo.position.set(0, 0.3, -0.35);
    halo.rotation.z = -Math.PI * 0.1;
    group.add(halo);
    registerPart(parts, halo, new THREE.Vector3(0, 0, -1), 1.1);

    // 5. Modak & Mushika Emblem at feet
    const modakGeo = new THREE.SphereGeometry(0.18, 16, 16);
    geometries.push(modakGeo);
    const modak = new THREE.Mesh(modakGeo, hardwareMat);
    modak.position.set(0.4, -0.5, 0.55);
    group.add(modak);
    registerPart(parts, modak, new THREE.Vector3(0.5, 0, 1), 1.3);

  } else if (preset === 'bike_car_model') {
    // 1. Cruiser Bike Fuel Tank & Main Frame
    const tankGeo = new THREE.BoxGeometry(1.6, 0.45, 0.65);
    geometries.push(tankGeo);
    const tank = new THREE.Mesh(tankGeo, mainMat);
    tank.position.set(0, 0.2, 0);
    tank.castShadow = true;
    group.add(tank);
    registerPart(parts, tank, new THREE.Vector3(0, 0.3, 0), 0.5);

    // 2. Engine Block & Transmission Fin Casing
    const engineGeo = new THREE.BoxGeometry(0.7, 0.6, 0.55);
    geometries.push(engineGeo);
    const engine = new THREE.Mesh(engineGeo, hardwareMat);
    engine.position.set(-0.1, -0.25, 0);
    group.add(engine);
    registerPart(parts, engine, new THREE.Vector3(0, -0.5, 0), 0.6);

    // 3. Spoked Front & Rear Wheels (Torus + Hubs)
    const wheelPositions = [-0.95, 0.95];
    for (const wx of wheelPositions) {
      const tireGeo = new THREE.TorusGeometry(0.45, 0.14, 16, 24);
      geometries.push(tireGeo);
      const tire = new THREE.Mesh(tireGeo, accentMat);
      tire.position.set(wx, -0.4, 0);
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      group.add(tire);

      const radDir = new THREE.Vector3(wx > 0 ? 1 : -1, 0, 0);
      registerPart(parts, tire, radDir, 1.2);
    }

    // 4. Chrome Upswept Exhaust Pipe
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);
    geometries.push(exhaustGeo);
    const exhaust = new THREE.Mesh(exhaustGeo, hardwareMat);
    exhaust.position.set(-0.2, -0.35, 0.38);
    exhaust.rotation.z = Math.PI / 2 - 0.2;
    group.add(exhaust);
    registerPart(parts, exhaust, new THREE.Vector3(0, 0, 1), 1.0);

    // 5. Handlebars & Headlamp
    const barGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.1, 12);
    geometries.push(barGeo);
    const bar = new THREE.Mesh(barGeo, hardwareMat);
    bar.position.set(0.65, 0.65, 0);
    bar.rotation.x = Math.PI / 2;
    group.add(bar);
    registerPart(parts, bar, new THREE.Vector3(1, 1, 0), 1.4);

  } else if (preset === 'phone_case') {
    // 1. Main Armor Phone Shell
    const caseGeo = new THREE.BoxGeometry(1.4, 2.6, 0.22);
    geometries.push(caseGeo);
    const phoneCase = new THREE.Mesh(caseGeo, mainMat);
    phoneCase.castShadow = true;
    group.add(phoneCase);
    registerPart(parts, phoneCase, new THREE.Vector3(0, 0, 0), 0);

    // 2. Raised Camera Island Bezel Ring
    const camGeo = new THREE.BoxGeometry(0.55, 0.65, 0.12);
    geometries.push(camGeo);
    const camRing = new THREE.Mesh(camGeo, accentMat);
    camRing.position.set(0.35, 0.85, 0.15);
    group.add(camRing);
    registerPart(parts, camRing, new THREE.Vector3(0.5, 0.5, 1), 0.9);

    // 3. Hexagonal Grip Pattern Inlay on Back
    for (let h = -0.6; h <= 0.4; h += 0.35) {
      const hexGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 6);
      geometries.push(hexGeo);
      const hex = new THREE.Mesh(hexGeo, hardwareMat);
      hex.position.set(-0.2, h, 0.12);
      hex.rotation.x = Math.PI / 2;
      phoneCase.add(hex);
    }

    // 4. Drop-Proof Corner Air Bumpers (4 corners)
    const corners = [
      [-0.7, -1.3],
      [0.7, -1.3],
      [-0.7, 1.3],
      [0.7, 1.3],
    ];
    for (const [cx, cy] of corners) {
      const bumpGeo = new THREE.SphereGeometry(0.12, 12, 12);
      geometries.push(bumpGeo);
      const bump = new THREE.Mesh(bumpGeo, accentMat);
      bump.position.set(cx, cy, 0);
      group.add(bump);
      registerPart(parts, bump, new THREE.Vector3(cx > 0 ? 1 : -1, cy > 0 ? 1 : -1, 0), 0.8);
    }

  } else if (preset === 'business_gapfiller') {
    // 1. Flanged Mechanical Spacer / Gap Filler Hub
    const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 24);
    geometries.push(hubGeo);
    const hub = new THREE.Mesh(hubGeo, mainMat);
    hub.castShadow = true;
    group.add(hub);
    registerPart(parts, hub, new THREE.Vector3(0, 0, 0), 0);

    // 2. Mounting Ears with Bolt Holes
    const earGeo = new THREE.BoxGeometry(2.2, 0.18, 0.6);
    geometries.push(earGeo);
    const ear = new THREE.Mesh(earGeo, mainMat);
    ear.position.set(0, -0.12, 0);
    group.add(ear);
    registerPart(parts, ear, new THREE.Vector3(0, -0.5, 0), 0.4);

    // 3. Brass Threaded Bushings inserted into ears
    for (const bx of [-0.85, 0.85]) {
      const bushGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.28, 16);
      geometries.push(bushGeo);
      const bush = new THREE.Mesh(bushGeo, hardwareMat);
      bush.position.set(bx, -0.12, 0);
      group.add(bush);
      registerPart(parts, bush, new THREE.Vector3(bx > 0 ? 0.8 : -0.8, 0.5, 0), 1.2);
    }

    // 4. Internal D-Shaft Keyed Sleeve
    const sleeveGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.65, 20);
    geometries.push(sleeveGeo);
    const sleeve = new THREE.Mesh(sleeveGeo, hardwareMat);
    group.add(sleeve);
    registerPart(parts, sleeve, new THREE.Vector3(0, 1, 0), 1.1);

  } else {
    // corporate_display: 3D Company Logo & Nameplate Plinth
    // 1. Beveled Dual-Tone Display Plinth Base
    const plinthGeo = new THREE.BoxGeometry(2.4, 0.25, 1.0);
    geometries.push(plinthGeo);
    const plinth = new THREE.Mesh(plinthGeo, mainMat);
    plinth.position.set(0, -0.5, 0);
    plinth.castShadow = true;
    group.add(plinth);
    registerPart(parts, plinth, new THREE.Vector3(0, -1, 0), 0.7);

    // 2. 3D Embossed Geometric Monogram Insignia
    const logoGeo = new THREE.BoxGeometry(0.7, 0.7, 0.2);
    geometries.push(logoGeo);
    const logo = new THREE.Mesh(logoGeo, accentMat);
    logo.position.set(-0.7, 0.1, 0);
    logo.rotation.z = Math.PI / 4;
    group.add(logo);
    registerPart(parts, logo, new THREE.Vector3(-1, 0.5, 0.5), 1.1);

    // 3. Raised 3D Lettering Bars (simulating typography)
    for (let r = 0; r < 2; r++) {
      const lineGeo = new THREE.BoxGeometry(1.1, 0.15, 0.12);
      geometries.push(lineGeo);
      const line = new THREE.Mesh(lineGeo, hardwareMat);
      line.position.set(0.4, 0.2 - r * 0.3, 0);
      group.add(line);
      registerPart(parts, line, new THREE.Vector3(1, 0, 0.8), 0.9 + r * 0.4);
    }
  }

  group.position.set(0, 0, 0);

  const slicePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.5);

  const updateExplode = (factor: number) => {
    parts.forEach((p) => {
      const offset = p.explodeDirection.clone().multiplyScalar(p.explodeDistance * factor);
      p.mesh.position.copy(p.initialPos).add(offset);
    });
  };

  const setMaterialFinish = (newFinish: MaterialFinish) => {
    const updatedMat = createPBRMaterial(newFinish);
    mainMat.color.copy(updatedMat.color);
    mainMat.roughness = updatedMat.roughness;
    mainMat.metalness = updatedMat.metalness;
    mainMat.transparent = updatedMat.transparent;
    mainMat.opacity = updatedMat.opacity;
    mainMat.needsUpdate = true;
  };

  const setWireframe = (enabled: boolean) => {
    materials.forEach((m) => {
      m.wireframe = enabled;
      m.needsUpdate = true;
    });
  };

  const setSliceProgress = (progress: number) => {
    const height = -1.2 + progress * 2.6;
    slicePlane.constant = height;
    materials.forEach((m) => {
      if (progress < 0.999) {
        m.clippingPlanes = [slicePlane];
        m.clipShadows = true;
      } else {
        m.clippingPlanes = [];
      }
      m.needsUpdate = true;
    });
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
  };

  return {
    group,
    parts,
    materials,
    dispose,
    updateExplode,
    setMaterialFinish,
    setWireframe,
    setSliceProgress,
  };
}
