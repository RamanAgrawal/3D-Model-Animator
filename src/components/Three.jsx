import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


const ThreeScene = () => {

  const sceneRef = useRef(null);
  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight
      // 800/600
      , 0.5, 1000)
    camera.position.z = 4;
    camera.position.x = 1;
    camera.position.y = 1;

   
//camera.lookAt(0.5,0,0)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    sceneRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.SphereBufferGeometry(1, 4, 94)
    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      metalness: 0.7
    })
    material.color = new THREE.Color(0xff0000)
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    const axixhelper = new THREE.AxesHelper(3)
    scene.add(axixhelper)

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(-1, 1, 2);
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x+=0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera)
    }

    animate()

  }, [])


  return <div style={{
    border:'2px solid red'
  }} ref={sceneRef}></div>
}

export default ThreeScene