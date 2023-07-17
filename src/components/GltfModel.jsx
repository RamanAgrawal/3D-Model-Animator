import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

const ModelWithProgressBar = () => {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const animationMixerRef = useRef(null);
//   const [progress, setProgress] = useState(0);
const progressRef = useRef(0);

  useEffect(() => {
    let scene, camera, renderer, controls;

    const init = () => {
      // Set up the scene, camera, and renderer
      scene = new THREE.Scene();
      cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      cameraRef.current.position.set(5, 0, 55);
    //   cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //   cameraRef.current.position.set(5, 0, 55);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current.appendChild(renderer.domElement);

      // Load the GLTF model
      new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('test.gltf', gltf => {
        modelRef.current = gltf.scene;
        console.log(gltf.animations);
        scene.add(modelRef.current);

        // Position and scale the model as needed
        modelRef.current.position.set(0, 0, 0);
        modelRef.current.scale.set(1, 1, 1);

        // Create an animation mixer and play the model's animations
        animationMixerRef.current = new THREE.AnimationMixer(modelRef.current);
        gltf.animations.forEach(animation => {
          animationMixerRef.current.clipAction(animation).play();
        });

        // Set up camera controls
        controls = new OrbitControls(cameraRef.current, renderer.domElement);

        // Start the animation loop
        animate();
      });

      // Set up any additional lights, controls, etc.
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Update the animation mixer
      if (animationMixerRef.current) {
        animationMixerRef.current.update(0.016); // Time delta for smooth animation (can be adjusted)
      }

    //   if (cameraRef.current.position.z > 0) {
    //     const progress = progressRef.current;
    //     cameraRef.current.position.z = 15 - (progress * 35);
    //   }

      // Update camera controls
    //   if (controls) {
    //     controls.update();
    //   }

      // Render the scene
      renderer.render(scene, cameraRef.current);
    };

    init();

    // Clean up the scene on unmount
    return () => {
      renderer.dispose();
      canvasRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleProgressBarChange = (event) => {
    const newProgress = parseInt(event.target.value) / 100;
    // setProgress(newProgress);
    progressRef.current = newProgress;
    console.log(newProgress);

    if (animationMixerRef.current) {
      const duration = animationMixerRef.current.timeScale.duration;
      const animationTime = newProgress * duration;
      animationMixerRef.current.time = animationTime;
      animationMixerRef.current.update(0);
    }
  };

  return (
    <div>
      {/* <input type="range" min="0" max="100"  onChange={handleProgressBarChange} /> */}
      <div ref={canvasRef} />
    </div>
  );
};

export default ModelWithProgressBar;
