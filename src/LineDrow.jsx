import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const LineDrow = () => {

    const sceneRef = useRef(null)

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 20

        const renderer = new THREE.WebGL1Renderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        sceneRef.current.appendChild(renderer.domElement)

        const material = new THREE.LineBasicMaterial({ color: 'red' });
        const points = [];
        points.push(new THREE.Vector3(10, 0, 0));
        points.push(new THREE.Vector3(30, 0, 0));
        // points.push(new THREE.Vector3(0,0,0));
        points.push(new THREE.Vector3(0, 10, 0));
        points.push(new THREE.Vector3(10, 0, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material)
        scene.add(line);
        const animate = () => {
            requestAnimationFrame(animate)
            line.rotation.x += 0.05
            // line.rotation.y += 0.1
            renderer.render(scene, camera)
        }

        animate()

    }, [])

    return (
        <div ref={sceneRef}></div>
    )
}

export default LineDrow