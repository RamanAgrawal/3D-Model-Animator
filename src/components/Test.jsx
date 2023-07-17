import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const GLTFModel = () => {
    const gltfContainerRef = useRef();
    const mixerRef = useRef();

    useEffect(() => {

        let scene, camera, renderer, controls, model;
        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(5, 0, 55);
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            gltfContainerRef.current.appendChild(renderer.domElement);

            new GLTFLoader()
            .setMeshoptDecoder(MeshoptDecoder)
            .load('test.gltf', gltf => {
                model = gltf.scene;
                console.log(gltf.animations);
                scene.add(model);
                const clips = gltf.animations;
                mixerRef.current=new THREE.AnimationMixer(model);
                // mixerRef.current.clipAction(gltf.animations[0]).play();
                // if (clips && clips.length > 0) {
                //     mixerRef.current = new THREE.AnimationMixer(model);
                //     console.log(clips);
                //     clips.forEach((animation) => {
                //         const channels = animation.channels;
                //         const samplers = animation.samplers;
                //         if (channels && channels.length > 0) {
                //             channels.forEach((channel, index) => {
                //                 const sampler = samplers[channel.sampler];
                //                 const targetNode = gltf.nodes[channel.target.node];
                //                 const targetProperty = channel.target.path; ``

                //                 const inputAccessor = gltf.accessors[sampler.input];
                //                 const outputAccessor = gltf.accessors[sampler.output];

                //                 const inputData = inputAccessor.array;
                //                 const outputData = outputAccessor.array;

                //                 // Create the animation curve using input and output data
                //                 const times = Array.from(inputData);
                //                 const values = Array.from(outputData);

                //                 // Create a keyframe track for the target property
                //                 const trackName = `${targetNode.name}.${targetProperty}`;
                //                 const track = new THREE.KeyframeTrack(trackName, times, values);

                //                 // Create the animation action and add it to the mixer
                //                 const animationAction = mixerRef.current.clipAction(THREE.AnimationClip(animation.name, -1, [track]));
                //                 animationAction.play();
                //             });
                //         }
                //     });


                // }

                // const clip = THREE.AnimationClip.findByName(clips, 'CameraAction.005');
                // const action = mixerRef.current.clipAction(clip);
                // action.reset().play();
                clips.forEach(animation => {
                    const action = mixerRef.current.clipAction(animation);
                    action.play();
                  });


                controls = new OrbitControls(camera, renderer.domElement);
                animate();
            })
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
        };

        const clock = new THREE.Clock()
        const animate = () => {
            requestAnimationFrame(animate)
            // camera.update()
            mixerRef.current.update(clock.getDelta())
            renderer.render(scene, camera);
        }
        // animate()
        init()
    }, ['test.gltf']);

    return <div ref={gltfContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default GLTFModel;