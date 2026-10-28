import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Soft studio reflections from a tiny generated gradient — no HDR download.
 * Shared by every scene (hero stethoscope, helix chapter) so all 3D surfaces
 * pick up the same teal/amber grade as the rest of the site.
 */
export default function GradientEnvironment() {
  const { scene } = useThree();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.45, '#dff3f0');
    gradient.addColorStop(1, '#0b3b37');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = texture;

    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [scene]);

  return null;
}
