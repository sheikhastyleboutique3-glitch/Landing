/**
 * Three.js 3D Background Scene
 * Creates an immersive particle system with floating golden orbs
 * and subtle geometric shapes for Gaimer W Kahi restaurant
 */

(function() {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Golden Particle System
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        sizes[i] = Math.random() * 3 + 0.5;
        speeds[i] = Math.random() * 0.5 + 0.1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));


    // Custom shader material for golden particles
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(0xd4a853) },
            uColor2: { value: new THREE.Color(0xc9784d) }
        },
        vertexShader: `
            attribute float size;
            uniform float uTime;
            varying float vAlpha;
            void main() {
                vec3 pos = position;
                pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.3;
                pos.x += cos(uTime * 0.2 + position.y * 0.3) * 0.2;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
                vAlpha = size / 3.5;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uTime;
            varying float vAlpha;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * 0.4;
                vec3 color = mix(uColor1, uColor2, sin(uTime * 0.5) * 0.5 + 0.5);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);


    // Floating Torus (represents the circular pastry)
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 50);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4a853,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(3, 0, -3);
    scene.add(torus);

    // Second Torus
    const torus2Geometry = new THREE.TorusGeometry(1, 0.3, 12, 40);
    const torus2Material = new THREE.MeshBasicMaterial({
        color: 0xc9784d,
        wireframe: true,
        transparent: true,
        opacity: 0.06
    });
    const torus2 = new THREE.Mesh(torus2Geometry, torus2Material);
    torus2.position.set(-3, 1, -4);
    scene.add(torus2);

    // Icosahedron (geometric accent)
    const icoGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4a853,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(-2, -2, -2);
    scene.add(ico);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });


    // Scroll interaction
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Update particle shader uniform
        particleMaterial.uniforms.uTime.value = elapsedTime;

        // Smooth mouse follow
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;

        // Rotate particles with mouse and time
        particles.rotation.y = elapsedTime * 0.03 + targetX * 0.3;
        particles.rotation.x = targetY * 0.2;

        // Animate torus
        torus.rotation.x = elapsedTime * 0.1;
        torus.rotation.y = elapsedTime * 0.15;
        torus.position.y = Math.sin(elapsedTime * 0.3) * 0.5;

        torus2.rotation.x = elapsedTime * -0.08;
        torus2.rotation.z = elapsedTime * 0.12;
        torus2.position.y = Math.cos(elapsedTime * 0.4) * 0.3 + 1;

        // Animate icosahedron
        ico.rotation.x = elapsedTime * 0.2;
        ico.rotation.y = elapsedTime * 0.15;
        ico.position.y = Math.sin(elapsedTime * 0.5) * 0.3 - 2;

        // Scroll-based camera movement
        const scrollFactor = scrollY * 0.0003;
        camera.position.y = -scrollFactor * 2;
        camera.rotation.x = scrollFactor * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Expose for scroll animations
    window.threeScene = { camera, scene, particles, torus, torus2, ico };
})();
