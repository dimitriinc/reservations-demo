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

function WebGL({ date, part }) {
    const [isLoading, setIsLoading] = useState(true)
    const [dummyReservas, setDummyReservas] = useState([])

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const reservasString = await getDummyReservas(date, part)
                setDummyReservas(JSON.parse(reservasString))
            } catch (error) {
                console.log(error)
            }
        }
        fetchReservas()
    }, [])

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
        >
            <Environment
                background={false}
                preset="sunset"
            />
            {/* <OrbitControls
                                    minPolarAngle={0}
                                    maxPolarAngle={Math.PI / 2.8}
                                    // maxDistance={40}
                                    // minDistance={15}
                                    enableDamping
                                    dampingFactor={0.03}
                                    rotateSpeed={0.7}
                                /> */}
            <color
                args={['#241a1a']}
                attach="background"
            />
            {/* <ambientLight intensity={0.3} /> */}

            <PresentationControls
                global
                cursor={false}
                zoom={0.8}
                config={{
                    mass: 1,
                    tension: 100,
                }}
            >
                <Experience
                    reservedTables={dummyReservas.map(
                        (reserva) => reserva.table
                    )}
                />
            </PresentationControls>
        </Canvas>
    )
}

export default WebGL
