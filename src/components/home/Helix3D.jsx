/**
 * DNA helix set piece for the pinned "How we work" chapter.
 *
 * Scroll assembles the helix: the base-pair rungs grow in one by one as the
 * scrub front passes them, the whole strand spins through 2.6 turns, and the
 * camera dollies in while the amber rim light rises — one continuous take.
 * Lazy-loaded from CinemaChapter.jsx, paused while off screen, and only
 * mounted on capable devices (the fallback SVG lives next to the section).
 */

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import GradientEnvironment from '../../three/GradientEnvironment';
import { useSceneActive } from '../../hooks/useMotion';
import { clamp01, damp, sampleNumber, sampleVector } from '../../utils/keyframes';

const TURNS = 3.2;
const RADIUS = 1.15;
const HEIGHT = 6.4;
const RUNGS = 44;

/** Camera dolly-in + slight truck across the chapter. */
const CAM = {
  pos: [
    { t: 0, v: [0.7, 0.3, 7.4] },
    { t: 0.5, v: [-0.5, 0.7, 6.4] },
    { t: 1, v: [0.2, -0.4, 5.6] },
  ],
  look: [
    { t: 0, v: [0, 0, 0] },
    { t: 0.5, v: [0, 0.3, 0] },
    { t: 1, v: [0, -0.3, 0] },
  ],
  amber: [
    { t: 0, v: 8 },
    { t: 0.5, v: 20 },
    { t: 1, v: 34 },
  ],
};

/** Point on one strand at normalised height `t` (phase 0 or π for strand 2). */
function helixPoint(t, phase) {
  const a = t * TURNS * Math.PI * 2 + phase;
  return new THREE.Vector3(Math.cos(a) * RADIUS, (t - 0.5) * HEIGHT, Math.sin(a) * RADIUS);
}

function strandGeometry(phase) {
  const pts = [];
  for (let i = 0; i <= 96; i += 1) pts.push(helixPoint(i / 96, phase));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  return new THREE.TubeGeometry(curve, 180, 0.07, 9, false);
}

const _dir = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _p1 = new THREE.Vector3();
const _p2 = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _q = new THREE.Quaternion();
const _m = new THREE.Matrix4();
const _s = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();

/** Eased 0→1 growth for rung `i` as the reveal front sweeps past it. */
function rungGrow(i, front) {
  const x = clamp01((front - i) / 5);
  return x * x * (3 - 2 * x);
}

function Helix({ progressRef }) {
  const group = useRef();
  const rungs = useRef();
  const amber = useRef();
  const strandA = useMemo(() => strandGeometry(0), []);
  const strandB = useMemo(() => strandGeometry(Math.PI), []);
  const rungGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 1, 8), []);
  const strandMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3C1D94', metalness: 0.45, roughness: 0.3 }),
    []
  );
  const rungMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.55, roughness: 0.35 }),
    []
  );

  // Alternate teal / amber along the ladder — the site's two brand colours.
  useEffect(() => {
    const mesh = rungs.current;
    if (!mesh) return;
    const teal = new THREE.Color('#AC9BFF');
    const amberC = new THREE.Color('#FF7A57');
    for (let i = 0; i < RUNGS; i += 1) mesh.setColorAt(i, i % 4 === 3 ? amberC : teal);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useEffect(
    () => () => {
      strandA.dispose();
      strandB.dispose();
      rungGeo.dispose();
      strandMat.dispose();
      rungMat.dispose();
    },
    [strandA, strandB, rungGeo, strandMat, rungMat]
  );

  useFrame((state, dt) => {
    const p = progressRef.current || 0;
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y = damp(
        group.current.rotation.y,
        p * Math.PI * 2.6 + t * 0.08,
        5,
        dt
      );
      group.current.position.y = damp(group.current.position.y, -0.2 + p * 0.5, 5, dt);
    }

    // Assembly: the reveal front travels the ladder during the first ~55% of
    // the chapter, feathering each rung over 5 slots.
    const mesh = rungs.current;
    if (mesh) {
      const front = (p / 0.55) * (RUNGS + 5);
      for (let i = 0; i < RUNGS; i += 1) {
        const g = rungGrow(i, front);
        _p1.copy(helixPoint(i / (RUNGS - 1), 0));
        _p2.copy(helixPoint(i / (RUNGS - 1), Math.PI));
        _mid.addVectors(_p1, _p2).multiplyScalar(0.5);
        _dir.subVectors(_p2, _p1);
        const len = _dir.length() || 1;
        _dir.divideScalar(len);
        _q.setFromUnitVectors(_up, _dir);
        _s.set(g, len * g, g);
        _m.compose(_mid, _q, _s);
        mesh.setMatrixAt(i, _m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    if (amber.current) amber.current.intensity = sampleNumber(CAM.amber, p);
  });

  return (
    <group ref={group} rotation={[0, 0, 0.14]}>
      <mesh geometry={strandA} material={strandMat} />
      <mesh geometry={strandB} material={strandMat} />
      <instancedMesh ref={rungs} args={[rungGeo, rungMat, RUNGS]} frustumCulled={false} />
    </group>
  );
}

/** Slow dolly-in with a look-at drift, keyed to the same chapter progress. */
function HelixCamera({ progressRef }) {
  const { camera } = useThree();
  const px = useRef(0.7);
  const py = useRef(0.3);
  const pz = useRef(7.4);
  const lx = useRef(0);
  const ly = useRef(0);
  const lz = useRef(0);

  // Reused scratch arrays — sampling stays allocation-free in the frame loop.
  const pos = useMemo(() => [0, 0, 0], []);
  const look = useMemo(() => [0, 0, 0], []);

  useFrame((_, dt) => {
    const p = progressRef.current || 0;
    sampleVector(CAM.pos, p, pos);
    sampleVector(CAM.look, p, look);

    px.current = damp(px.current, pos[0], 6, dt);
    py.current = damp(py.current, pos[1], 6, dt);
    pz.current = damp(pz.current, pos[2], 6, dt);
    lx.current = damp(lx.current, look[0], 6, dt);
    ly.current = damp(ly.current, look[1], 6, dt);
    lz.current = damp(lz.current, look[2], 6, dt);

    camera.position.set(px.current, py.current, pz.current);
    camera.lookAt(lx.current, ly.current, lz.current);
  });

  return null;
}

/** Drifting motes for depth — cheap points, no textures. */
function Motes({ count = 55 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 13;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#AC9BFF" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Helix3D({ progressRef }) {
  const wrapRef = useRef(null);
  const active = useSceneActive(wrapRef);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        className="!pointer-events-none !absolute inset-0"
        dpr={[1, 1.5]}
        camera={{ position: [0.7, 0.3, 7.4], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        frameloop={active ? 'always' : 'never'}
        aria-hidden
      >
        <Suspense fallback={null}>
          <GradientEnvironment />
          <ambientLight intensity={0.65} />
          <directionalLight position={[3, 6, 5]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-4, -2, 4]} intensity={20} color="#6E4BF3" />
          <pointLight position={[4, 2, -3]} intensity={8} color="#FF7A57" />
          <HelixCamera progressRef={progressRef} />
          <Helix progressRef={progressRef} />
          <Motes />
        </Suspense>
      </Canvas>
    </div>
  );
}
