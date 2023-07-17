import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
const GLTFModel = () => {
    const gltfContainerRef = useRef();
    const mixerRef = useRef();
    const cameraRef = useRef();
    const isPlayingRef = useRef(true);
    const animationProgressRef = useRef(0);
    const speedRef = useRef(0);
    const [speed, setSpeed] = useState(1);
    const [time, setTime] = useState(0);
    const [progress, setProgress] = useState(0);

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
                            action.clampWhenFinished = true;
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
                    animate();
                });
            //adding lights
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


        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            if (isPlayingRef.current) {
                const delta = clock.getDelta();
                mixerRef.current.update(delta * speedRef.current.value);//+Playback speed
                animationProgressRef.current = mixerRef.current.time;
                setProgress(mixerRef.current.time)
                let time = convertSecondsToMinutesSeconds(Math.floor(animationProgressRef.current))
                setTime(time)

                // last frame
                if (mixerRef.current.time >= 36 * 60) {
                    isPlayingRef.current = false;
                }
            }

            renderer.render(scene, cameraRef.current);
        };

        init();
    }, []);

    const handlePlayPause = () => {
        if (mixerRef.current.time >= 36 * 60) {
            mixerRef.current.time = 0;
        }
        isPlayingRef.current = !isPlayingRef.current;
    };

    //on space bar click
    document.onkeydown = function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            handlePlayPause();
        }
    };

    const seekTo = (time) => {
        mixerRef.current.setTime(time);
    };

    const handleProgressBarChange = (e) => {
        e.preventDefault();
        const progress = e.target.value;
        setProgress(progress * 60)
        const animationTime = progress * 60;
        seekTo(animationTime);
    };

    return (
        <div
            style={{ width: '100%', height: '100%' }}>
            <div
                ref={gltfContainerRef}
                style={
                    {
                        width: '100%',
                        height: '90%'
                    }}
            />
             {/* progress bar */}
            <input type="range"
                value={progress / 60}
                max={36}
                style={{ width: '100%' }}
                step={1 / 60}
                onChange={handleProgressBarChange}
            />
            <p>{time}</p>

            {/* playback speed  */}
            <input type="range"
                value={speed}
                min={1} 
                max={10}
                onChange={(e) => setSpeed(e.target.value)}
                ref={speedRef} />
            <p>{speed}x</p>

            <button
                onClick={handlePlayPause}>
                {isPlayingRef.current ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default GLTFModel;
