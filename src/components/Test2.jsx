import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GLTFModel = () => {
    const gltfContainerRef = useRef();
    const mixerRef = useRef();
    const cameraRef = useRef();
    const isPlayingRef = useRef(true);
    const animationProgressRef = useRef(0);
    const speedRef = useRef(0)
    const [speed, setSpeed] = useState(1)
    const [time, setTime] = useState(0)
    const progressBarRef = useRef();
    const animationDurationRef = useRef(0);

    useEffect(() => {
        let scene, renderer, model;

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
                            console.log(animation.duration)
                            // mixerRef.current.setTime(5)
                            action.clampWhenFinished = true
                            if (action) {
                                action.reset().play();
                                const duration = animation.duration !== undefined ? animation.duration : 0;
                                animationDurationRef.current += duration;
                            }

                        });
                    }

                    // Retrieve the camera from the GLTF file
                    if (gltf.cameras && gltf.cameras.length > 0) {
                        cameraRef.current = gltf.cameras[0];
                        // Set initial camera position
                        cameraRef.current.position.set(5, 0, 55);
                        scene.add(cameraRef.current);
                    }

                    // controls = new OrbitControls(cameraRef.current, renderer.domElement);
                    animate();
                });

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
        };

        function convertSecondsToMinutesSeconds(seconds) {
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = seconds % 60;
            return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
        }
        // mixerRef.current.time.se=300;

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            if (isPlayingRef.current) {
                const delta = clock.getDelta();
                // console.log(delta);
                // const playSpeed=speedRef.current.value;
                mixerRef.current.update(delta * speedRef.current.value);
                let duration
                // console.log(mixerRef.current.getClip());
                // if (mixerRef.current.clipAction(0).clip().duration) {

                //     duration = mixerRef.current.clipAction(0).clip().duration;
                // }
                animationProgressRef.current = mixerRef.current.time;
                progressBarRef.current.value = animationProgressRef.current;


                animationProgressRef.current = mixerRef.current.time;
                let time = convertSecondsToMinutesSeconds(Math.floor(animationProgressRef.current))
                setTime(time)
                // console.log(Math.floor(animationProgressRef.current));
            }

            renderer.render(scene, cameraRef.current);
        };

        init();
    }, []);

    if (animationProgressRef.current / 60 === 36) {
        // console.log(animationProgressRef.current);
        isPlayingRef.current = false
    }


    const handlePlayPause = () => {
        isPlayingRef.current = !isPlayingRef.current;
        console.log(speed);
    };
    const handleTime = () => {
        mixerRef.current.update(0)
    }

    document.onkeydown = function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            handlePlayPause();
        }
    };


    const handleProgressBarChange = (e) => {
        const progress = parseFloat(e.target.value);
        animationProgressRef.current = progress;
        const duration = animationDurationRef.current;
        const animationTime = progress * duration;
        // mixerRef.current.setTime(300);
        if (progress === 36) {
            isPlayingRef.current = false;
        } else {
            isPlayingRef.current = true;
        }
    };


    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div ref={gltfContainerRef} style={{ width: '100%', height: '90%' }} />
            {/* <progress value={animationProgressRef.current / 60} max={36} style={{ width: '100%' }} /> */}
            <progress
                ref={progressBarRef}
                value={animationProgressRef.current/60}
                max={36}
                style={{ width: '100%' }}
                onInput={handleProgressBarChange} />
            <p>{time}</p>
            {/* <button onClick={handleTime}>reset</button> */}
            <input type="range" value={speed} min={1} max={10} onChange={(e) => setSpeed(e.target.value)} ref={speedRef} />
            <p>{speed}x</p>
            <button onClick={handlePlayPause}>{isPlayingRef.current ? 'Pause' : 'Play'}</button>
        </div>
    );
};

export default GLTFModel;
