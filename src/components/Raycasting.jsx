import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer, raycaster;
        let cube;
        const mouse = new THREE.Vector2();

        const init = () => {
            // Set up the scene, camera, and renderer
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 3;
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            canvasRef.current.appendChild(renderer.domElement);

            // Add objects to the scene
            // const geometry = new THREE.BoxGeometry(1, 1, 1);
            const geometry = new THREE.IcosahedronGeometry( 0.5, 3 );
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            cube = new THREE.InstancedMesh( geometry, material, 4 );
            // cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // Set up the raycaster
            raycaster = new THREE.Raycaster();

            // Add event listener for mouse movement
            window.addEventListener('mousemove', onMouseMove, false);

            function onMouseMove(event) {
                // Calculate mouse position in normalized device coordinates
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }

            // Render the scene
            animate();
        };

        const animate = () => {
            requestAnimationFrame(animate);

            // Update the raycaster with the current mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the raycaster
            const intersects = raycaster.intersectObjects(scene.children);
            // const intersects = raycaster.intersectObjects(cube);

            // Perform actions based on intersections
            let i=0;
            if (intersects.length > 0) {
                // For example, change the color of the intersected object
        

                cube.position.y+=0.1;
                intersects[0].object.material.color.set(0xfff000);
                console.log(intersects,i++);
            } else {
                // Reset the color if no intersection
                cube.material.color.set(0x00ff00);
                cube.position.y=0;
            }

            renderer.render(scene, camera);
        };

        init();

        // Clean up the scene on unmount
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            renderer.dispose();
            canvasRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default ThreeScene;
