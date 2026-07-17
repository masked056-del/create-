/**
 * AETHELGARD - Cinematic Luxury Engine
 * Powered by WebGL (Three.js), Web Audio API, and GSAP ScrollTrigger
 */

// Global App States
let scene, camera, renderer, starfield, earthMesh, atmosphereMesh, cityGroup, towerMesh, cloudParticles;
let audioCtx, droneOsc, droneFilter, synthInterval;
const container = document.getElementById('canvas-container');

// Simulated Progress and Preload Sequencer
let resourcesLoaded = 0;
const resourcesToLoad = 100;

function updatePreloader() {
    if (resourcesLoaded < resourcesToLoad) {
        resourcesLoaded += 2;
        document.getElementById('load-bar').style.width = `${resourcesLoaded}%`;
        setTimeout(updatePreloader, 30);
    } else {
        document.getElementById('load-status').innerText = "ARCHITECTURAL MATRIX SYNCED";
        const enterBtn = document.getElementById('enter-btn');
        enterBtn.classList.remove('hidden');
        enterBtn.classList.add('animate-pulse');
        enterBtn.addEventListener('click', startCinematicJourney);
    }
}

// Start visual loading bar animation
window.addEventListener('DOMContentLoaded', () => {
    updatePreloader();
});

/**
 * -------------------------------------------------------------
 * 1. DESIGNER SYNTHESIZER (Web Audio API)
 * Generates an organic, cinematic, multi-voice ambient drone
 * -------------------------------------------------------------
 */
function initAmbientSynth() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Master Gain & Limiter
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 4); // Fade in over 4 seconds
    masterGain.connect(audioCtx.destination);

    // Deep Resonant Filter
    droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(140, audioCtx.currentTime);
    droneFilter.Q.setValueAtTime(3.5, audioCtx.currentTime);
    droneFilter.connect(masterGain);

    // Osc Voice 1 (Fundamental root chord base)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55.00, audioCtx.currentTime); // A1
    
    // Osc Voice 2 (Harmonic Fifth)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.41, audioCtx.currentTime); // E2
    
    // Low Frequency Oscillator (LFO) to modulate cutoff frequency
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // Ultra slow sweeps

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(45, audioCtx.currentTime);

    // Connect LFO Modulators
    lfo.connect(lfoGain);
    lfoGain.connect(droneFilter.frequency);
    
    // Connect audio signal chains
    osc1.connect(droneFilter);
    osc2.connect(droneFilter);

    // Run oscillators
    osc1.start();
    osc2.start();
    lfo.start();

    // Procedural chord progression cycles
    const chords = [
        { f1: 55.00, f2: 82.41 },   // Amin (A1, E2)
        { f1: 65.41, f2: 97.99 },   // Cmaj (C2, G2)
        { f1: 51.91, f2: 77.78 },   // Fm   (F1, C2)
        { f1: 58.27, f2: 87.31 }    // Gmaj (G1, D2)
    ];
    let chordIndex = 0;

    synthInterval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        const nextChord = chords[chordIndex];
        osc1.frequency.exponentialRampToValueAtTime(nextChord.f1, audioCtx.currentTime + 6);
        osc2.frequency.exponentialRampToValueAtTime(nextChord.f2, audioCtx.currentTime + 6);
    }, 12000); // Shift sound palette every 12 seconds
}

// Audio Control HUD binding
const muteBtn = document.getElementById('mute-btn');
let isMuted = false;
muteBtn.addEventListener('click', () => {
    if (audioCtx) {
        if (isMuted) {
            audioCtx.resume();
            document.getElementById('audio-icon').innerText = '🔊';
            isMuted = false;
        } else {
            audioCtx.suspend();
            document.getElementById('audio-icon').innerText = '🔇';
            isMuted = true;
        }
    }
});

/**
 * -------------------------------------------------------------
 * 2. WEBGL SCENE ARCHITECTURE (Three.js)
 * -------------------------------------------------------------
 */
function initThreeEngine() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Standard high performance renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Initial Space Camera position (high in orbit)
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070708, 0.015);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 180);

    // Build Scene Elements
    createGalaxyBackground();
    createProceduralEarth();
    createFuturisticCity();
}

/**
 * Procedural Galaxy Structure
 * Generates thousands of stars forming a distant glowing star system
 */
function createGalaxyBackground() {
    const starCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        // Spherical distribution
        const radius = 100 + Math.random() * 300;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i+2] = radius * Math.cos(phi);

        // Warm Gold to Deep Stellar Blue color grading
        const mixRatio = Math.random();
        colors[i] = mixRatio * 1.0 + (1 - mixRatio) * 0.4;     // R
        colors[i+1] = mixRatio * 0.85 + (1 - mixRatio) * 0.5;  // G
        colors[i+2] = mixRatio * 0.6 + (1 - mixRatio) * 1.0;   // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
}

/**
 * Procedural Earth & Atmosphere
 * Dynamic rendering constructed of high-contrast shaders & procedural canvas maps
 */
function createProceduralEarth() {
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -35, 40); // Offset downwards below the primary path

    // Draw realistic high contrast geography on a 2D Canvas to use as texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Deep blue ocean background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Draw highly stylized abstract continent shapes
    ctx.fillStyle = '#101624';
    for (let i = 0; i < 45; i++) {
        ctx.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = 40 + Math.random() * 150;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Convert Canvas to ThreeJS texture
    const earthTexture = new THREE.CanvasTexture(canvas);
    
    // Earth Sphere Geometry
    const geo = new THREE.SphereGeometry(30, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.9,
        metalness: 0.1,
        bumpScale: 0.05
    });

    earthMesh = new THREE.Mesh(geo, mat);
    earthGroup.add(earthMesh);

    // Atmosphere Glow Layer (Slightly larger sphere with gold/cyan transparency)
    const atmosGeo = new THREE.SphereGeometry(30.8, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosphereMesh);

    scene.add(earthGroup);

    // Global illumination setup
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    directionalLight.position.set(100, 50, 100);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x0c0d12, 0.4);
    scene.add(ambientLight);
}

/**
 * Procedural Future Luxury City
 * Renders hundreds of geometric towers, moving traffic, and the master architectural column
 */
function createFuturisticCity() {
    cityGroup = new THREE.Group();
    cityGroup.position.set(0, -100, -120); // Hidden deeper down, accessed during zoom transition

    const blockCount = 350;
    const cityArea = 250;

    for (let i = 0; i < blockCount; i++) {
        // Randomize dimensions representing generic skyscrapers
        const width = 2 + Math.random() * 6;
        const height = 15 + Math.random() * 55;
        const depth = 2 + Math.random() * 6;

        const boxGeo = new THREE.BoxGeometry(width, height, depth);
        
        // Luxury aesthetic design (emissive dark blocks with gold trim borders)
        const boxMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0c,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x050507
        });

        const building = new THREE.Mesh(boxGeo, boxMat);

        // Grid distribution with offsets
        const posX = (Math.random() - 0.5) * cityArea;
        const posZ = (Math.random() - 0.5) * cityArea;
        const posY = height / 2; // Bottom of building sits on ground zero

        building.position.set(posX, posY, posZ);
        cityGroup.add(building);
    }

    // THE MASTER TOWER (Aethelgard) - Centerpiece
    const towerHeight = 110;
    const towerGeo = new THREE.CylinderGeometry(1, 4, towerHeight, 3, 1, false);
    const towerMat = new THREE.MeshStandardMaterial({
        color: 0x0c0c0e,
        roughness: 0.1,
        metalness: 0.95,
        emissive: 0x000000,
        flatShading: true
    });

    towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.set(0, towerHeight / 2, 0); // Rooted in the middle of the scene

    // Decorative Golden Crown rings on top
    const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, towerHeight - 2, 0);
    towerMesh.add(ring);

    // Glowing architectural column
    const glowGeo = new THREE.CylinderGeometry(0.1, 0.1, towerHeight, 8);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.6
    });
    const coreGlow = new THREE.Mesh(glowGeo, glowMat);
    towerMesh.add(coreGlow);

    cityGroup.add(towerMesh);

    // Volumetric Atmospheric Cloud Layer (used as entrance transition buffer)
    const cloudCount = 120;
    const cloudGeo = new THREE.DodecahedronGeometry(8, 1);
    const cloudMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });

    cloudParticles = new THREE.Group();
    for (let c = 0; c < cloudCount; c++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        cloud.position.set(
            (Math.random() - 0.5) * 200,
            towerHeight - 10 + (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 200
        );
        cloudParticles.add(cloud);
    }
    cityGroup.add(cloudParticles);

    scene.add(cityGroup);
}

/**
 * -------------------------------------------------------------
 * 3. THE HOLLYWOOD CINEMATIC INTRO TRANSITION
 * Complete continuous shot timeline
 * -------------------------------------------------------------
 */
function startCinematicJourney() {
    // Play synthesis chord sweeps
    initAmbientSynth();

    // Fade and scale UI screen container layers
    gsap.to('#intro-overlay', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 2.2,
        ease: 'power3.out',
        onComplete: () => {
            document.getElementById('intro-overlay').style.display = 'none';
        }
    });

    // Reveal main landing HUD page overlay
    gsap.to('#smooth-wrapper', { opacity: 1, duration: 4.0, delay: 1.5 });
    gsap.to('#audio-hud', { opacity: 1, duration: 2.0, delay: 2.5 });

    // Cinematic Intro Cam Tracking Animation
    const introTimeline = gsap.timeline({
        onComplete: () => {
            // Activate the interactive ScrollTrigger timeline binding for continuous user navigation
            initScrollCameraBindings();
        }
    });

    // Intro Phase 1: Deep Space Orbit camera pan
    introTimeline.to(camera.position, {
        x: 0,
        y: -10,
        z: 110,
        duration: 6.0,
        ease: 'power1.inOut'
    });

    // Intro Phase 2: Atmosphere orbital dive & zoom through clouds
    introTimeline.to(camera.position, {
        x: 0,
        y: -65,
        z: 45,
        duration: 5.0,
        ease: 'power2.inOut'
    }, "-=1.5");

    // Fade cloud systems into focus as transition shield
    introTimeline.to(scene.fog, {
        density: 0.04,
        duration: 3.0,
        ease: 'power1.in'
    }, "-=4.0");

    // Intro Phase 3: Transition to city view below
    introTimeline.to(camera.position, {
        x: 10,
        y: -35,
        z: -60,
        duration: 5.0,
        ease: 'power3.out',
        onStart: () => {
            // Reposition spatial elements dynamically for close-up framing
            scene.fog.color.setHex(0x070708);
        }
    }, "-=1.0");

    // Disperse heavy transition clouds
    introTimeline.to(scene.fog, {
        density: 0.012,
        duration: 4.0,
        ease: 'power2.out'
    }, "-=3.0");
}

/**
 * -------------------------------------------------------------
 * 4. INTERACTIVE SCROLL-TRIGGER CAMERA BINDINGS
 * Links standard scrolling smoothly with 3D camera sweeps
 * -------------------------------------------------------------
 */
function initScrollCameraBindings() {
    gsap.registerPlugin(ScrollTrigger);

    // Camera scrolling pathway map config
    const camTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, // Butter smooth transition
            invalidateOnRefresh: true
        }
    });

    // Scroll Stage 1: Rise slowly to face Master Tower
    camTimeline.to(camera.position, {
        x: -25,
        y: -12,
        z: -95,
        ease: 'power1.inOut'
    })
    // Scroll Stage 2: Fast cinematic orbit to opposite side
    .to(camera.position, {
        x: 45,
        y: 10,
        z: -110,
        ease: 'power1.inOut'
    })
    // Scroll Stage 3: Close plunge straight down to penthouse deck floor level
    .to(camera.position, {
        x: 2,
        y: 8,
        z: -120,
        ease: 'power2.out'
    })
    // Scroll Stage 4: Enter the luxury glass structural core lobby
    .to(camera.position, {
        x: 0,
        y: 3,
        z: -120,
        ease: 'sine.inOut'
    });
}

/**
 * -------------------------------------------------------------
 * 5. CONSTANT FRAME RENDER LOOP
 * -------------------------------------------------------------
 */
function animateFrame() {
    requestAnimationFrame(animateFrame);

    const time = Date.now() * 0.0005;

    // Subtle background organic space dust rotation
    if (starfield) {
        starfield.rotation.y = time * 0.02;
    }

    // Slow planetary axis rotation
    if (earthMesh) {
        earthMesh.rotation.y = time * 0.04;
    }

    // Soft cloud drift speed simulation
    if (cloudParticles) {
        cloudParticles.children.forEach((cloud, index) => {
            cloud.rotation.y += 0.001 * (index % 2 === 0 ? 1 : -1);
            cloud.position.y += Math.sin(time + index) * 0.002;
        });
    }

    // Always center the camera focus tracking our master architectural tower
    if (towerMesh) {
        const targetVector = new THREE.Vector3();
        towerMesh.getWorldPosition(targetVector);
        // Slowly ease tracking target focus
        camera.lookAt(targetVector.x, targetVector.y + 15, targetVector.z);
    }

    renderer.render(scene, camera);
}

// Window resizing adaptivity
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Kickstart Three.js core instance
initThreeEngine();
animateFrame();
