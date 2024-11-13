import {
    Effects,
    useGLTF,
    useTexture,
    useProgress,
    Html,
} from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { Color, DoubleSide } from 'three'
import { colors, glassTables } from './utils.js'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'

const smallPax = [1, 2, 3]
const bigPax = [3, 4, 5, 6]

let leafIndex = 0

function getLeafColor() {
    const index = leafIndex
    if (leafIndex === colors.length - 1) leafIndex = 0
    else leafIndex++
    return colors[index]
}

function getRandomLeafColor(colors) {
    const index = Math.floor(Math.random() * colors.length)
    return colors[index]
}

export default function Experience({ onControlsEnabled }) {
    leafIndex = 0

    const sceneRef = useRef()
    const reservadoRefs = useRef({})

    // const [chosenTables, setChosenTables] = useState([])
    const [unavailableTables, setUnavailableTables] = useState([
        '05',
        '10',
        '08',
        '02',
    ])
    const [selectedTable, setSelectedTable] = useState('')
    const [selectedSmallPax, setSelectedSmallPax] = useState(2)
    const [selectedBigPax, setSelectedBigPax] = useState(4)

    const baked = useGLTF('/models/baked.glb')
    const normal = useGLTF('/models/normal.glb')
    const tables = useGLTF('/models/tables.glb')

    const baseTexture = useTexture('./textures/base.jpg')
    baseTexture.flipY = false
    const wallsTexture = useTexture('./textures/walls.jpg')
    wallsTexture.flipY = false

    const promoTexture = useTexture('./textures/promo.jpg')
    promoTexture.flipY = false
    const bottlesTexture = useTexture('./textures/bottles.jpg')
    bottlesTexture.flipY = false

    const tablesTexture = useTexture('./textures/tables.jpg')
    tablesTexture.flipY = false
    const reservadoTexture = useTexture('./textures/reservado.jpg')
    reservadoTexture.flipY = false

    const alphaMap = useTexture('./textures/alpha.png')

    useEffect(() => {
        unavailableTables.forEach((tableNumber) => {
            reservadoRefs.current[tableNumber] = React.createRef()
        })
    }, [])

    useFrame((_, delta) => {
        Object.values(reservadoRefs.current).forEach((ref) => {
            if (ref.current) ref.current.rotation.y += delta / 3
        })
    })

    function handleTableClick(tableObj) {
        if (selectedTable) {
            setSelectedTable('')
            return
        }
        onControlsEnabled(false)
        setSelectedTable(tableObj.name)
        setSelectedBigPax(4)
        setSelectedSmallPax(2)
    }

    function handleConfirmar() {
        setUnavailableTables((prev) => [...prev, selectedTable])
        setSelectedTable('')
        setSelectedBigPax(4)
        setSelectedSmallPax(2)
        onControlsEnabled(true)
    }

    function handleDialogExit() {
        if (selectedTable) {
            setSelectedTable('')
            onControlsEnabled(true)
        }
    }

    return (
        <>
            <group
                ref={sceneRef}
                position={[0, 0, -8]}
                rotation-y={-Math.PI / 2.5}
                onClick={handleDialogExit}
            >
                <mesh
                    geometry={baked.nodes.master.geometry}
                    position={baked.nodes.master.position}
                    rotation={baked.nodes.master.rotation}
                >
                    <meshBasicMaterial map={baseTexture} />
                </mesh>
                <mesh
                    geometry={baked.nodes.walls.geometry}
                    position={baked.nodes.walls.position}
                    rotation={baked.nodes.walls.rotation}
                >
                    <meshBasicMaterial map={wallsTexture} />
                </mesh>
                <mesh
                    geometry={baked.nodes.promoBooth.geometry}
                    position={baked.nodes.promoBooth.position}
                    rotation={baked.nodes.promoBooth.rotation}
                >
                    <meshBasicMaterial map={promoTexture} />
                </mesh>
                <mesh
                    geometry={baked.nodes.bottles.geometry}
                    position={baked.nodes.bottles.position}
                    rotation={baked.nodes.bottles.rotation}
                >
                    <meshBasicMaterial map={bottlesTexture} />
                </mesh>

                {Object.values(tables.nodes).map((node) => {
                    if (glassTables.includes(node.name)) {
                        if (unavailableTables.includes(node.name)) {
                            const child = tables.scene.getObjectByName(
                                'reservado' + node.name
                            )
                            return (
                                <>
                                    <mesh
                                        geometry={node.geometry}
                                        position={node.position}
                                        rotation={node.rotation}
                                        scale={node.scale}
                                        key={node.uuid}
                                    >
                                        <meshPhysicalMaterial
                                            depthWrite={false}
                                            color="#ddd"
                                            transmission={1}
                                            opacity={0.6}
                                            transparent={true}
                                            roughness={0.2}
                                            metalness={0.1}
                                            reflectivity={1}
                                            clearcoat={1}
                                            clearcoatRoughness={0}
                                        />
                                    </mesh>
                                    <mesh
                                        ref={reservadoRefs.current[node.name]}
                                        geometry={child.geometry}
                                        position={child.position}
                                        rotation={child.rotation}
                                        scale={child.scale}
                                        key={child.uuid}
                                    >
                                        <meshBasicMaterial
                                            map={reservadoTexture}
                                        />
                                    </mesh>
                                </>
                            )
                        } else {
                            const cta = tables.scene.getObjectByName(
                                'cta' + node.name
                            )
                            return (
                                <>
                                    <mesh
                                        geometry={node.geometry}
                                        position={node.position}
                                        rotation={node.rotation}
                                        scale={node.scale}
                                        key={node.uuid}
                                        onClick={() => handleTableClick(node)}
                                        onPointerEnter={() =>
                                            (document.body.style.cursor =
                                                'pointer')
                                        }
                                        onPointerLeave={() =>
                                            (document.body.style.cursor =
                                                'default')
                                        }
                                    >
                                        <meshPhysicalMaterial
                                            depthWrite={false}
                                            color="#ddd"
                                            transmission={1}
                                            opacity={0.6}
                                            transparent={true}
                                            roughness={0.2}
                                            metalness={0.1}
                                            reflectivity={1}
                                            clearcoat={1}
                                            clearcoatRoughness={0}
                                        />
                                        {node.name === selectedTable ? (
                                            <Html position={[4, 4, 4]}>
                                                <div className="gl-dialog">
                                                    <p>Personas</p>
                                                    <select
                                                        value={selectedSmallPax}
                                                        onChange={(event) =>
                                                            setSelectedSmallPax(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        {smallPax.map((v) => (
                                                            <option value={v}>
                                                                {v}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div
                                                        className="gl-dialog-btn"
                                                        onClick={
                                                            handleConfirmar
                                                        }
                                                    >
                                                        Confirmar
                                                    </div>
                                                </div>
                                            </Html>
                                        ) : null}
                                    </mesh>
                                    <mesh
                                        geometry={cta.geometry}
                                        position={
                                            selectedTable === node.name
                                                ? cta.position
                                                : cta.position
                                        }
                                        rotation={cta.rotation}
                                        scale={
                                            selectedTable === node.name
                                                ? cta.scale
                                                : cta.scale
                                        }
                                        key={cta.uuid}
                                    >
                                        <meshStandardMaterial
                                            emissive={ selectedTable === node.name ? new Color('red') : new Color('#09ff9c')}
                                            emissiveIntensity={3}
                                        />
                                    </mesh>
                                </>
                            )
                        }
                    } else {
                        if (
                            node.name.startsWith('reservado') ||
                            node.name.startsWith('cta')
                        )
                            return
                        if (node.name.endsWith('leg')) {
                            return (
                                <mesh
                                    geometry={node.geometry}
                                    position={node.position}
                                    rotation={node.rotation}
                                    scale={node.scale}
                                    key={node.uuid}
                                >
                                    <meshBasicMaterial map={tablesTexture} />
                                </mesh>
                            )
                        }
                        if (unavailableTables.includes(node.name)) {
                            const child = tables.scene.getObjectByName(
                                'reservado' + node.name
                            )
                            return (
                                <>
                                    <mesh
                                        geometry={node.geometry}
                                        position={node.position}
                                        rotation={node.rotation}
                                        scale={node.scale}
                                        key={node.uuid}
                                    >
                                        <meshBasicMaterial
                                            map={tablesTexture}
                                        />
                                    </mesh>
                                    <mesh
                                        ref={reservadoRefs.current[node.name]}
                                        geometry={child.geometry}
                                        position={child.position}
                                        rotation={child.rotation}
                                        scale={child.scale}
                                        key={child.uuid}
                                    >
                                        <meshBasicMaterial
                                            map={reservadoTexture}
                                        />
                                    </mesh>
                                </>
                            )
                        } else {
                            const cta = tables.scene.getObjectByName(
                                'cta' + node.name
                            )
                            if (!cta) return
                            return (
                                <>
                                    <mesh
                                        geometry={node.geometry}
                                        position={node.position}
                                        rotation={node.rotation}
                                        scale={node.scale}
                                        key={node.uuid}
                                        onClick={() => handleTableClick(node)}
                                        onPointerEnter={() =>
                                            (document.body.style.cursor =
                                                'pointer')
                                        }
                                        onPointerLeave={() =>
                                            (document.body.style.cursor =
                                                'default')
                                        }
                                    >
                                        <meshBasicMaterial
                                            map={tablesTexture}
                                        />
                                        {node.name === selectedTable ? (
                                            <Html position={[4, 4, 4]}>
                                                <div className="gl-dialog">
                                                    <p>Personas</p>
                                                    {node.name === '05' ||
                                                    node.name === '11' ? (
                                                        <select
                                                            value={
                                                                selectedBigPax
                                                            }
                                                            onChange={(event) =>
                                                                setSelectedBigPax(
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            {bigPax.map((v) => (
                                                                <option
                                                                    value={v}
                                                                >
                                                                    {v}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <select
                                                            value={
                                                                selectedSmallPax
                                                            }
                                                            onChange={(event) =>
                                                                setSelectedSmallPax(
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            {smallPax.map(
                                                                (v) => (
                                                                    <option
                                                                        value={
                                                                            v
                                                                        }
                                                                    >
                                                                        {v}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    )}

                                                    <div
                                                        className="gl-dialog-btn"
                                                        onClick={
                                                            handleConfirmar
                                                        }
                                                    >
                                                        Confirmar
                                                    </div>
                                                </div>
                                            </Html>
                                        ) : null}
                                    </mesh>
                                    <mesh
                                        geometry={cta.geometry}
                                        position={cta.position}
                                        rotation={cta.rotation}
                                        scale={cta.scale}
                                        key={cta.uuid}
                                    >
                                        <meshStandardMaterial
                                            emissive={ selectedTable === node.name ? new Color('red') : new Color('#09ff9c')}
                                            emissiveIntensity={3}
                                        />
                                    </mesh>
                                </>
                            )
                        }
                    }
                })}

                {Object.values(normal.nodes).map((node) => {
                    if (node.name.startsWith('emissive')) {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                            >
                                <meshBasicMaterial color={'#ffffe5'} />
                            </mesh>
                        )
                    }

                    if (node.name.startsWith('glass')) {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                scale={node.scale}
                                key={node.uuid}
                            >
                                <meshPhysicalMaterial
                                    depthWrite={false}
                                    color="white"
                                    transmission={1} // For glass transparency
                                    opacity={0.5} // Adjust transparency level
                                    transparent={true} // Allow transparency
                                    roughness={0} // Smooth surface
                                    metalness={0.1} // Slight metallic sheen
                                    reflectivity={1} // Reflectivity for glass-like effect
                                    clearcoat={1} // Extra layer on top for shine
                                    clearcoatRoughness={0}
                                    side={DoubleSide}
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'mirror') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshPhysicalMaterial
                                    // depthWrite={false}
                                    color="#fff"
                                    transmission={1} // For glass transparency
                                    opacity={0.9} // Adjust transparency level
                                    transparent={true} // Allow transparency
                                    roughness={0.9} // Smooth surface
                                    metalness={0.1} // Slight metallic sheen
                                    reflectivity={1} // Reflectivity for glass-like effect
                                    clearcoat={1} // Extra layer on top for shine
                                    clearcoatRoughness={0}
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'whiteMetal') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    metalness={0.5}
                                    roughness={0.2}
                                    color="#ddd"
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'black') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    metalness={0.6}
                                    roughness={0.9}
                                    color="#333"
                                />
                            </mesh>
                        )
                    }

                    if (node.name.startsWith('leaves')) {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    color={getLeafColor()}
                                    side={DoubleSide}
                                    roughness={1}
                                />
                            </mesh>
                        )
                    }

                    if (node.name.startsWith('trunk')) {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    color={'#554c3a'}
                                    roughness={0.9}
                                    side={DoubleSide}
                                />
                            </mesh>
                        )
                    }

                    if (node.name.startsWith('column')) {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                {/* <primitive attach='material' object={new GradientMaterial()}/> */}
                                <meshStandardMaterial
                                    depthWrite={false}
                                    color={'#983B16'}
                                    roughness={0.9}
                                    transparent={true}
                                    alphaMap={alphaMap}
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'toldoBase') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    depthWrite={false}
                                    color={'#983B16'}
                                    roughness={0.9}
                                    transparent={true}
                                    opacity={0.2}
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'toldoRoof') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    depthWrite={false}
                                    color={'#bbb'}
                                    roughness={0.9}
                                    side={DoubleSide}
                                    transparent={true}
                                    opacity={0.2}
                                />
                            </mesh>
                        )
                    }

                    if (node.name === 'cords') {
                        return (
                            <mesh
                                geometry={node.geometry}
                                position={node.position}
                                rotation={node.rotation}
                                key={node.uuid}
                                scale={node.scale}
                            >
                                <meshStandardMaterial
                                    depthWrite={false}
                                    color={'#333'}
                                    roughness={0.9}
                                    transparent={true}
                                    alphaMap={alphaMap}
                                />
                            </mesh>
                        )
                    }
                })}
            </group>
        </>
    )
}
