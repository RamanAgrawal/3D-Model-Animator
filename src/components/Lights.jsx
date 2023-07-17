import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import image from '../assets/sun.jpg'
import earthImg from '../assets/earth.jpg'
import jupiterImg from '../assets/jupiter.jpg'



const Lights = () => {
    const sceneRef = useRef(null)
    const gui = new dat.GUI()

    const size = {
        // width: 400,
        // height: 200
        width: window.innerWidth,
        height: window.innerHeight
    }
    useEffect(() => {
        const scene = new THREE.Scene()
        const parameters = {
            color: 0xff0000,
            spin: () => {
                mainsun.rotation.z += 360
            }
        }
        // camera

        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.5, 1000)
        camera.position.z = 3;
        // camera.position.y=0;
        // camera.position.x=0;
        camera.lookAt(5,2,0)
        gui.add(camera.position,'y',0,10,0.2)


        // renderer

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(size.width, size.height)


        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enabled=false;
        controls.update()

        // adding in dom
        sceneRef.current.appendChild(renderer.domElement);

        // const geometry = new THREE.BoxGeometry(1, 1, 1, 1);
        const sunGeometry = new THREE.SphereBufferGeometry(1, 64, 44)
        const textureLoader = new THREE.TextureLoader();
        const sun = textureLoader.load(image)
        const sunMaterial = new THREE.MeshStandardMaterial({
            map:sun,
            metalness: 0.7,
            roughness: 0.2,
            // wireframe: true
        });
        const mainsun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(mainsun);

        const earthGeometry=new THREE.SphereBufferGeometry(0.2, 64, 44);
        const earthimg=textureLoader.load(earthImg)
        const earthMaterial = new THREE.MeshStandardMaterial({
            map:earthimg,
            metalness: 0.7,
            roughness: 0.2,
            // wireframe: true
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);

        scene.add(earth);
        earth.position.x=2

        const jupiterGeometry=new THREE.SphereBufferGeometry(0.2, 64, 44);
        const jupiterimg=textureLoader.load(jupiterImg)
        const jupiterMaterial = new THREE.MeshStandardMaterial({
            map:jupiterimg,
            metalness: 0.7,
            roughness: 0.2,
            // wireframe: true
        });
        const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

        scene.add(jupiter);
        jupiter.position.x=1.5


        const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Soft white light
        scene.add(ambientLight);
        gui.add(ambientLight,'intensity',1,20,1)
        const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
        directionalLight.position.set(-1, 1, 1);
        // scene.add(directionalLight);
        const hamisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
        scene.add(hamisphereLight)
        gui.add(hamisphereLight, 'intensity', 0, 2, 0.1)

        const spotlight = new THREE.SpotLight(0x00ff00, 1);
        spotlight.position.set(0, 2, 2);
        // scene.add(spotlight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const rectareaLight = new THREE.RectAreaLight(0x4e00ff, 2, 7, 1);
        scene.add(rectareaLight)
        gui.add(rectareaLight, 'intensity', 0, 8, 0.1)


        gui.add(mainsun.position, 'y', -3, 3, 0.01)
        gui.add(mainsun.position, 'z', -3, 3, 0.01)

        gui.addColor(parameters, 'color').onChange(() => {
            material.color.set(parameters.color)
        })
        gui.add(parameters, 'spin')


        // RAycasting

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector3();

        const onMouseMove = (event) => {
            // Calculate mouse position in normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                // If there is an intersection, do something with the object
                console.log('Intersection:', intersects[0].object);
            }
        };

        window.addEventListener('mousemove', onMouseMove, false)

        const animate = () => {
            requestAnimationFrame(animate)
            mainsun.rotation.y += 0.01
            earth.rotation.y += 0.02
            if(earth.position.x<5){

                earth.position.x+=0.1
            }else{
                earth.position.x=-2
            }
            earth.rotation.x += 0.02
            // mainsun.rotation.x += 0.02  
            renderer.render(scene, camera)
        }
        animate()


    }, [])
    return (
        <div ref={sceneRef}></div>
    )
}

export default Lights