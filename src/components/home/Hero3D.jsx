/**
 * Full-screen hero 3D scene — a stylised floating stethoscope shot like a film.
 *
 * The whole scroll is treated as ONE choreographed take: a keyframe rig drives
 * camera position / look-at / field-of-view / roll, the model's rotation and
 * drift, and the light grade, all from a single eased scroll time base (see
 * src/utils/keyframes.js). Fast scrolling adds a velocity kick — the lens
 * widens and the camera whips slightly — so the shot feels handheld rather
 * than mechanical.
 *
 * Deliberately built from primitives (no model download) so the first paint is
 * instant and the bundle stays small. Lazy-loaded from Home.jsx and only
 * mounted on capable devices (see useShouldLoad3D). Rendering pauses entirely
 * while the hero is off screen (see useSceneActive).
 */

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import GradientEnvironment from '../../three/GradientEnvironment';
import { useSceneActive } from '../../hooks/useMotion';
import { sampleNumber, sampleVector, clamp01, damp } from '../../utils/keyframes';

/* ------------------------------------------------------------------ */
/* The shot list — every channel shares the same 0 → 1 scroll time base */
/* ------------------------------------------------------------------ */

/** Camera: establish → push in low on the chest piece → crane/orbit → pull back. */
const CAM = {
  pos: [
    { t: 0, v: [0, 0.4, 7.4] },
    { t: 0.32, v: [-1.9, -1.1, 5.0] },
    { t: 0.64, v: [3.0, 1.5, 5.6] },
    { t: 1, v: [0, 0.6, 11.0] },
  ],
  look: [
    { t: 0, v: [0, 0.1, 0] },
    { t: 0.32, v: [0.3, -2.0, 0.2] },
    { t: 0.64, v: [0, -0.3, 0] },
    { t: 1, v: [0, 0.4, 0] },
  ],
  fov: [
    { t: 0, v: 42 },
    { t: 0.32, v: 52 },
    { t: 0.64, v: 45 },
    { t: 1, v: 32 },
  ],
  roll: [
    { t: 0, v: 0 },
    { t: 0.32, v: 0.06 },
    { t: 0.64, v: -0.08 },
    { t: 1, v: 0 },
  ],
};

/** The stethoscope's own performance, keyed off the same time base. */
const MODEL = {
  rotY: [
    { t: 0, v: 0 },
    { t: 0.32, v: 1.7 },
    { t: 0.64, v: 3.6 },
    { t: 1, v: 5.4 },
  ],
  rotX: [
    { t: 0, v: -0.1 },
    { t: 0.32, v: 0.3 },
    { t: 0.64, v: -0.15 },
    { t: 1, v: 0.1 },
  ],
  posY: [
    { t: 0, v: 0 },
    { t: 0.32, v: -0.5 },
    { t: 0.64, v: 0.6 },
    { t: 1, v: 0.3 },
  ],
  posZ: [
    { t: 0, v: 0 },
    { t: 0.32, v: -0.4 },
    { t: 0.64, v: -1.2 },
    { t: 1, v: -3.4 },
  ],
  scale: [
    { t: 0, v: 1.05 },
    { t: 0.32, v: 1.18 },
    { t: 0.64, v: 1.0 },
    { t: 1, v: 0.85 },
  ],
};

/** Light grade: clean clinic white → moody amber rim → balanced wide. */
const LIGHT = {
  key: [
    { t: 0, v: 1.6 },
    { t: 0.32, v: 1.0 },
    { t: 0.64, v: 1.8 },
    { t: 1, v: 1.35 },
  ],
  teal: [
    { t: 0, v: 22 },
    { t: 0.32, v: 34 },
    { t: 0.64, v: 14 },
    { t: 1, v: 26 },
  ],
  amber: [
    { t: 0, v: 16 },
    { t: 0.32, v: 7 },
    { t: 0.64, v: 32 },
    { t: 1, v: 20 },
  ],
};

/**
 * Every channel above can be overridden from outside via the `animation` prop
 * (see HERO_ANIMATION in src/pages/Home.jsx) — tune the take without editing
 * this file. Unspecified channels fall back to the defaults here.
 */
export const DEFAULT_HERO_ANIMATION = { camera: CAM, model: MODEL, light: LIGHT };

/** Merge caller overrides onto the default keyframe channels (per group). */
export function resolveHeroAnimation(override) {
  const merge = (defaults, over) => {
    if (!over) return defaults;
    return { ...defaults, ...over };
  };
  return {
    camera: merge(CAM, override?.camera),
    model: merge(MODEL, override?.model),
    light: merge(LIGHT, override?.light),
  };
}

/**
 * Per-frame damped copy of the raw scroll progress. Every scene element samples
 * its channel from this, so camera, model and lights glide even when the
 * scrollbar is yanked.
 */
function useSmoothProgress(progressRef) {
  const ref = useRef(0);
  useFrame((_, dt) => {
    ref.current = damp(ref.current, progressRef.current, 6, dt);
  });
  return ref;
}

/* ------------------------------------------------------------------ */
/* Geometry & materials                                                */
/* ------------------------------------------------------------------ */

/** Tube path for one arm of the stethoscope (from ear tip to the junction). */
function useBranch(sign) {
  return useMemo(() => {
    const pts = [
      new THREE.Vector3(1.62 * sign, 2.05, -0.15),
      new THREE.Vector3(1.78 * sign, 1.45, -0.05),
      new THREE.Vector3(1.62 * sign, 0.75, 0.1),
      new THREE.Vector3(1.15 * sign, 0.1, 0.25),
      new THREE.Vector3(0.5 * sign, -0.35, 0.32),
      new THREE.Vector3(0, -0.5, 0.34),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
    return new THREE.TubeGeometry(curve, 64, 0.075, 12, false);
  }, [sign]);
}

/* ------------------------------------------------------------------ */
/* Camera rig                                                          */
/* ------------------------------------------------------------------ */

const _pos = [0, 0, 0];
const _look = [0, 0, 0];
const _lookVec = new THREE.Vector3();

function CameraRig({ progressRef, pointerRef, anim }) {
  const { camera } = useThree();
  const smooth = useSmoothProgress(progressRef);

  // Damped rig state — the camera never snaps.
  const px = useRef(0);
  const py = useRef(0.4);
  const pz = useRef(7.4);
  const lx = useRef(0);
  const ly = useRef(0.1);
  const lz = useRef(0);
  const fov = useRef(42);
  const roll = useRef(0);

  // Scroll velocity (viewport-heights per second, damped) for the lens kick.
  const vel = useRef(0);
  const prev = useRef(0);

  useFrame((_, dt) => {
    const p = smooth.current;
    const step = Math.min(dt, 0.1);

    sampleVector(anim.camera.pos, p, _pos);
    sampleVector(anim.camera.look, p, _look);

    // Instantaneous velocity of the shot, then a smoothed version for effects.
    const inst = step > 0 ? (p - prev.current) / step : 0;
    prev.current = p;
    vel.current = damp(vel.current, inst, 8, dt);
    const speed = Math.min(1, Math.abs(vel.current) / 1.4);

    px.current = damp(px.current, _pos[0], 7, dt);
    py.current = damp(py.current, _pos[1], 7, dt);
    pz.current = damp(pz.current, _pos[2], 7, dt);
    lx.current = damp(lx.current, _look[0], 7, dt);
    ly.current = damp(ly.current, _look[1], 7, dt);
    lz.current = damp(lz.current, _look[2], 7, dt);
    fov.current = damp(fov.current, sampleNumber(anim.camera.fov, p), 7, dt);
    roll.current = damp(roll.current, sampleNumber(anim.camera.roll, p), 7, dt);

    // Pointer parallax (desktop only — pointerRef stays null on touch devices),
    // applied before lookAt so the frame slides around the subject.
    const ptr = pointerRef.current;

    camera.position.set(
      px.current + (ptr ? ptr.x * 0.4 : 0),
      py.current + (ptr ? -ptr.y * 0.25 : 0),
      pz.current
    );

    // Velocity kick: the lens widens and whips slightly on hard scrolls.
    camera.fov = fov.current + speed * 6;
    camera.updateProjectionMatrix();

    _lookVec.set(lx.current, ly.current, lz.current);
    camera.lookAt(_lookVec);
    camera.rotation.z += roll.current + (vel.current >= 0 ? 1 : -1) * speed * 0.03;
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* Light grade                                                         */
/* ------------------------------------------------------------------ */

function LightGrade({ progressRef, anim }) {
  const key = useRef();
  const teal = useRef();
  const amber = useRef();
  const smooth = useSmoothProgress(progressRef);

  useFrame(() => {
    const p = smooth.current;
    if (key.current) key.current.intensity = sampleNumber(anim.light.key, p);
    if (teal.current) teal.current.intensity = sampleNumber(anim.light.teal, p);
    if (amber.current) amber.current.intensity = sampleNumber(anim.light.amber, p);
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight ref={key} position={[4, 6, 6]} intensity={1.6} color="#ffffff" />
      <pointLight ref={teal} position={[-5, -2, 4]} intensity={22} color="#2F835B" />
      <pointLight ref={amber} position={[5, 3, -3]} intensity={16} color="#B4EE1F" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Stethoscope                                                         */
/* ------------------------------------------------------------------ */

function Stethoscope({ progressRef, anim }) {
  const group = useRef();
  const leftBranch = useBranch(-1);
  const rightBranch = useBranch(1);
  const smooth = useSmoothProgress(progressRef);

  const downTube = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, -0.5, 0.34),
      new THREE.Vector3(0.16, -1.0, 0.3),
      new THREE.Vector3(0.3, -1.55, 0.22),
      new THREE.Vector3(0.3, -2.0, 0.16),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
    return new THREE.TubeGeometry(curve, 48, 0.085, 12, false);
  }, []);

  const rubber = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#103627', metalness: 0.35, roughness: 0.35 }),
    []
  );
  const chrome = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#EFF5EE', metalness: 1, roughness: 0.16 }),
    []
  );
  const diaphragm = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#F6F8F2', metalness: 0.2, roughness: 0.6 }),
    []
  );
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#B4EE1F', metalness: 0.9, roughness: 0.28 }),
    []
  );

  // Dispose geometries/materials when the scene unmounts.
  useEffect(
    () => () => {
      leftBranch.dispose();
      rightBranch.dispose();
      downTube.dispose();
      rubber.dispose();
      chrome.dispose();
      diaphragm.dispose();
      gold.dispose();
    },
    [leftBranch, rightBranch, downTube, rubber, chrome, diaphragm, gold]
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = smooth.current;
    const t = state.clock.elapsedTime;

    // Keyframed performance + a gentle idle float on top.
    g.rotation.y = sampleNumber(anim.model.rotY, p) + t * 0.1;
    g.rotation.x = damp(g.rotation.x, sampleNumber(anim.model.rotX, p) + Math.sin(t * 0.6) * 0.05, 6, dt);
    g.position.y = damp(g.position.y, sampleNumber(anim.model.posY, p) + Math.sin(t * 0.8) * 0.1, 6, dt);
    g.position.z = damp(g.position.z, sampleNumber(anim.model.posZ, p), 6, dt);
    const s = damp(g.scale.x, sampleNumber(anim.model.scale, p), 6, dt);
    g.scale.setScalar(s);
  });

  return (
    <group ref={group} scale={1.05}>
      {/* Ear tubes */}
      <mesh geometry={leftBranch} material={rubber} />
      <mesh geometry={rightBranch} material={rubber} />
      {/* Tube down to the chest piece */}
      <mesh geometry={downTube} material={rubber} />

      {/* Ear tips */}
      {[-1, 1].map((s) => (
        <group key={s} position={[1.62 * s, 2.1, -0.15]} rotation={[0.3, 0, s * 0.25]}>
          <mesh material={chrome}>
            <cylinderGeometry args={[0.11, 0.11, 0.26, 24]} />
          </mesh>
          <mesh position={[0, 0.16, 0]} material={gold}>
            <sphereGeometry args={[0.1, 20, 20]} />
          </mesh>
        </group>
      ))}

      {/* Chest piece (diaphragm facing the viewer) */}
      <group position={[0.3, -2.28, 0.2]} rotation={[0.18, 0, 0]}>
        <mesh material={chrome}>
          <cylinderGeometry args={[0.55, 0.5, 0.18, 48]} />
        </mesh>
        {/* cylinder geometry is Y-up: rotate so the flat face looks at the camera */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0.1, 0]} material={diaphragm}>
            <cylinderGeometry args={[0.46, 0.46, 0.04, 48]} />
          </mesh>
          <mesh position={[0, 0.13, 0]} material={gold}>
            <torusGeometry args={[0.5, 0.045, 16, 64]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Particles — depth travel + velocity boost                           */
/* ------------------------------------------------------------------ */

function Particles({ progressRef, count = 70 }) {
  const group = useRef();
  const smooth = useSmoothProgress(progressRef);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!group.current) return;
    // The field drifts toward the lens as the shot travels forward.
    group.current.position.z = smooth.current * 4;
    group.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={group}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#B4EE1F" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

/**
 * @param {object} [props.animation] Optional keyframe overrides, shaped like
 * DEFAULT_HERO_ANIMATION: `{ camera: { pos, look, fov, roll }, model: {…}, light: {…} }`
 * where each value is an array of `{ t: 0→1, v }` keys. Partial overrides merge
 * with the defaults, so you can retune a single channel in one line.
 */
export default function Hero3D({ animation: animationOverride } = {}) {
  const progressRef = useRef(0);
  const pointerRef = useRef(null);
  const wrapRef = useRef(null);
  const active = useSceneActive(wrapRef);
  const anim = useMemo(() => resolveHeroAnimation(animationOverride), [animationOverride]);

  // Scroll progress across the hero, 0 at the top → 1 when it has left view.
  // Slightly longer than one viewport so the final pull-back plays out.
  useEffect(() => {
    const onScroll = () => {
      const runway = Math.max(400, (window.innerHeight || 1) - 96); // 96px header
      progressRef.current = clamp01(window.scrollY / runway);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) {
      const onMove = (e) => {
        pointerRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        };
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        window.removeEventListener('mousemove', onMove);
      };
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className="!absolute inset-0">
      <Canvas
        className="!pointer-events-none !absolute inset-0"
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.4, 7.4], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        frameloop={active ? 'always' : 'never'}
        aria-hidden
      >
        <Suspense fallback={null}>
          <GradientEnvironment />
          <LightGrade progressRef={progressRef} anim={anim} />
          <CameraRig progressRef={progressRef} pointerRef={pointerRef} anim={anim} />
          <Stethoscope progressRef={progressRef} anim={anim} />
          <Particles progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
