import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import {
    OrbitControls,
    Environment,
    PresentationControls,
} from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { getDummyReservas } from './utils'

function WebGL() {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <Canvas
            className="canvas"
            gl={{
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.LinearDisplayP3ColorSpace,
            }}
            camera={{
                position: [0, 18, 25],
            }}
            style={
                isLoading
                    ? { visibility: 'hidden', opacity: '0' }
                    : {
                          visibility: 'visible',
                          opacity: '1',
                      }
            }
            onCreated={() => {
                setIsLoading(false)
            }}
        >
            <Environment
                background={false}
                preset="sunset"
            />

            <color
                args={['#241a1a']}
                attach="background"
            />

            <PresentationControls
                global
                cursor={false}
                zoom={0.8}
                config={{
                    mass: 1,
                    tension: 100,
                }}
            >
                <Experience />
            </PresentationControls>
        </Canvas>
    )
}

export default WebGL
