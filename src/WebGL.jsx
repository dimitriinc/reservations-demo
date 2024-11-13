import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import {
    Sky,
    Environment,
    PresentationControls,
    useHelper,
} from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { getDummyReservas } from './utils'

function DirectionalLightWithHelper() {
    const dirLight = useRef()

    // useHelper(dirLight, THREE.DirectionalLightHelper, 5, 'red')

    return (
        <directionalLight
            position={[-10, 20, 4]}
            scale={[5, 5, 5]}
            intensity={0.5}
            ref={dirLight}
        />
    )
}

function WebGL() {
    const [isLoading, setIsLoading] = useState(true)
    const [controlsEnabled, setControlsEnabled] = useState(true)

    function handleControlsEnabled(enabled) {
        setControlsEnabled(enabled)
    }

    return (
        <Canvas
            className="canvas"
            gl={{
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.LinearDisplayP3ColorSpace,
            }}
            camera={{
                position: [8, 18, 25],
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
            {/* <Environment
                background={false}
                preset="sunset"
            /> */}

            <Sky
                position={[0, 0, 0]}
                scale={[60, 60, 60]}
                distance={0}
                sunPosition={[0, 1, 0]} // Position of the sun
                turbidity={0.8} // Makes the sky appear more or less clear
                rayleigh={0.5} // Makes the sky more or less blue
                mieCoefficient={.1} // Scattering factor, affects sky brightness
            />

            <ambientLight intensity={0.25} />

            <DirectionalLightWithHelper />

            {/* <primitive object={new THREE.AxesHelper(15)} /> */}

            <color
                args={['#241a1a']}
                attach="background"
            />

            <PresentationControls
                enabled={controlsEnabled}
                global
                cursor={false}
                zoom={0.8}
                config={{
                    mass: 1,
                    tension: 100,
                }}
            >
                <Experience onControlsEnabled={handleControlsEnabled} />
            </PresentationControls>
        </Canvas>
    )
}

export default WebGL
