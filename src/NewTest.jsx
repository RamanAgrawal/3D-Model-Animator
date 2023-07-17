import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GLTFModel = () => {
  const gltfContainerRef = useRef();
  const mixerRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    let scene, renderer, controls, model;

    const init = () => {
      scene = new THREE.Scene();
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      gltfContainerRef.current.appendChild(renderer.domElement);

      new GLTFLoader()
        .setMeshoptDecoder(MeshoptDecoder)
        .load('test.gltf', (gltf) => {
          model = gltf.scene;
          scene.add(model);

          const clips = gltf.animations;
          mixerRef.current = new THREE.AnimationMixer(model);

          if (clips && clips.length > 0) {
            clips.forEach((animation) => {
              const action = mixerRef.current.clipAction(animation);
              action.reset().play();
            });
          }

          // Retrieve the camera from the GLTF file
          if (gltf.cameras && gltf.cameras.length > 0) {
            cameraRef.current = gltf.cameras[0];
            // Set initial camera position
            cameraRef.current.position.set(5, 0, 55);
            scene.add(cameraRef.current);
          }

          controls = new OrbitControls(cameraRef.current, renderer.domElement);
          animate();
        });

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
    };

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      mixerRef.current.update(clock.getDelta());
      renderer.render(scene, cameraRef.current);
    };

    init();
  }, []);

  return <div ref={gltfContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default GLTFModel;
