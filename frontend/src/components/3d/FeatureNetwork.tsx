'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

export const FeatureNetwork = () => {
    const pointsRef = useRef<THREE.Points>(null!);

    const count = 500;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.05;
            pointsRef.current.rotation.x = time * 0.02;
        }
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3}>
                <PointMaterial
                    transparent
                    color="#60a5fa"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Some larger nodes for accent */}
            {Array.from({ length: 15 }).map((_, i) => (
                <LargeNode key={i} />
            ))}
        </group>
    );
};

const LargeNode = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const pos = useMemo(() => [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    ] as [number, number, number], []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(time + pos[0]) * 0.002;
        }
    });

    return (
        <mesh ref={meshRef} position={pos}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
        </mesh>
    );
};
