'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export const GuardianOrb = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.2;
            meshRef.current.rotation.y = time * 0.3;
        }
    });

    return (
        <Float
            speed={4}
            rotationIntensity={1}
            floatIntensity={2}
        >
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color="#3b82f6"
                    speed={2}
                    distort={0.4}
                    radius={1}
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#1e40af"
                    emissiveIntensity={0.5}
                />
            </Sphere>
        </Float>
    );
};
