"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center, Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";

function BalloonText() {
  const groupRef = useRef<Group>(null!);
  const { size } = useThree();
  const responsiveScale = size.width < 680 ? 0.46 : size.width < 980 ? 0.72 : 1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y =
      state.pointer.x * 0.22 + Math.sin(t * 0.35) * 0.055;
    groupRef.current.rotation.x =
      -state.pointer.y * 0.1 + Math.sin(t * 0.28) * 0.03;
  });

  return (
    <group ref={groupRef} scale={responsiveScale}>
      <Float speed={1.4} rotationIntensity={0.06} floatIntensity={0.45}>
        <Center>
          <Text3D
            font="/fonts/pacifico_regular.typeface.json"
            size={2.2}
            height={0.92}
            bevelEnabled
            bevelThickness={0.25}
            bevelSize={0.14}
            bevelSegments={28}
            curveSegments={36}
            letterSpacing={-0.055}
          >
            {"I'm  xian"}
            <MeshTransmissionMaterial
              color="#c4b5fd"
              backside
              samples={4}
              resolution={256}
              transmission={0.62}
              roughness={0.07}
              thickness={2.6}
              ior={1.5}
              chromaticAberration={0.05}
              distortion={0.02}
              temporalDistortion={0.025}
              clearcoat={0.9}
              clearcoatRoughness={0.08}
              attenuationDistance={0.9}
              attenuationColor="#ede9fe"
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}

export function HeroBalloon() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11.8], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.4} color="#f5f0ff" />
        <directionalLight position={[4, 9, 6]} intensity={2.8} color="#ffffff" />
        <pointLight position={[-10, 4, 5]} intensity={2.2} color="#a78bfa" />
        <pointLight position={[9, -5, 4]} intensity={1.4} color="#ede9fe" />
        <pointLight position={[0, 8, 2]} intensity={1.0} color="#ddd6fe" />
        <Environment preset="studio" />
        <BalloonText />
      </Suspense>
    </Canvas>
  );
}
