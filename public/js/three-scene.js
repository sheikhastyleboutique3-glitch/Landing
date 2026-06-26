/**
 * Three.js 3D Background - Restaurant / Food Themed
 * Floating steam particles, soft light orbs, and plate/bowl shapes
 * Blue sky color scheme with warm food accents
 */
(function() {
  'use strict';
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ===== STEAM / FOOD AROMA PARTICLES =====
  const steamCount = 400;
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(steamCount * 3);
  const steamSizes = new Float32Array(steamCount);
  const steamSpeeds = new Float32Array(steamCount);
  
  for (let i = 0; i < steamCount; i++) {
    steamPos[i*3] = (Math.random()-0.5)*16;
    steamPos[i*3+1] = (Math.random()-0.5)*16;
    steamPos[i*3+2] = (Math.random()-0.5)*12;
    steamSizes[i] = Math.random()*4+1;
    steamSpeeds[i] = Math.random()*0.3+0.1;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
  steamGeo.setAttribute('size', new THREE.BufferAttribute(steamSizes, 1));

  // Steam shader - soft white/blue rising particles
  const steamMat = new THREE.ShaderMaterial({
    uniforms: { 
      uTime: {value:0}, 
      uColor1: {value: new THREE.Color(0x4da8e8)},  // Sky blue
      uColor2: {value: new THREE.Color(0xffffff)}    // White steam
    },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      varying float vAlpha;
      varying float vMix;
      void main(){
        vec3 p = position;
        // Steam rises upward with gentle sway
        p.y += sin(uTime*0.2 + position.x*0.3) * 0.5 + uTime * 0.05;
        p.y = mod(p.y + 8.0, 16.0) - 8.0; // Loop vertically
        p.x += cos(uTime*0.15 + position.y*0.2) * 0.3;
        p.z += sin(uTime*0.1 + position.x*0.5) * 0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (250.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vAlpha = size / 5.0;
        vMix = sin(position.x + position.y) * 0.5 + 0.5;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uTime;
      varying float vAlpha;
      varying float vMix;
      void main(){
        float d = length(gl_PointCoord - vec2(0.5));
        if(d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.3;
        vec3 c = mix(uColor1, uColor2, vMix + sin(uTime*0.3)*0.2);
        gl_FragColor = vec4(c, a);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const steam = new THREE.Points(steamGeo, steamMat);
  scene.add(steam);

  // ===== FLOATING PLATE / BOWL SHAPES =====
  // Represents dishes and food elements
  const plateGeo = new THREE.TorusGeometry(1.2, 0.15, 8, 40); // Plate rim
  const plateMat = new THREE.MeshBasicMaterial({
    color: 0x4da8e8, wireframe: true, transparent: true, opacity: 0.06
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(3.5, -0.5, -4);
  plate.rotation.x = Math.PI * 0.4;
  scene.add(plate);

  // Bowl shape
  const bowlGeo = new THREE.SphereGeometry(0.9, 16, 12, 0, Math.PI*2, 0, Math.PI*0.6);
  const bowlMat = new THREE.MeshBasicMaterial({
    color: 0x7ec8f8, wireframe: true, transparent: true, opacity: 0.05
  });
  const bowl = new THREE.Mesh(bowlGeo, bowlMat);
  bowl.position.set(-3, 1.5, -3);
  bowl.rotation.x = Math.PI;
  scene.add(bowl);

  // Teapot spout shape (cone)
  const spoutGeo = new THREE.ConeGeometry(0.3, 1.5, 8, 1, true);
  const spoutMat = new THREE.MeshBasicMaterial({
    color: 0x4da8e8, wireframe: true, transparent: true, opacity: 0.04
  });
  const spout = new THREE.Mesh(spoutGeo, spoutMat);
  spout.position.set(-2, -2, -2.5);
  spout.rotation.z = Math.PI * 0.3;
  scene.add(spout);

  // Bread/pastry shape (rounded box)
  const breadGeo = new THREE.DodecahedronGeometry(0.7, 0);
  const breadMat = new THREE.MeshBasicMaterial({
    color: 0x60b5f0, wireframe: true, transparent: true, opacity: 0.04
  });
  const bread = new THREE.Mesh(breadGeo, breadMat);
  bread.position.set(2, 2, -3);
  scene.add(bread);

  // ===== WARM LIGHT ORBS (food warmth) =====
  const orbCount = 50;
  const orbGeo = new THREE.BufferGeometry();
  const orbPos = new Float32Array(orbCount * 3);
  const orbSizes = new Float32Array(orbCount);
  for (let i = 0; i < orbCount; i++) {
    orbPos[i*3] = (Math.random()-0.5)*14;
    orbPos[i*3+1] = (Math.random()-0.5)*14;
    orbPos[i*3+2] = (Math.random()-0.5)*8;
    orbSizes[i] = Math.random()*6+2;
  }
  orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3));
  orbGeo.setAttribute('size', new THREE.BufferAttribute(orbSizes, 1));
  
  const orbMat = new THREE.ShaderMaterial({
    uniforms: { uTime: {value:0} },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      varying float vAlpha;
      void main(){
        vec3 p = position;
        p.y += sin(uTime*0.4 + position.x)*0.3;
        p.x += cos(uTime*0.3 + position.z)*0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (200.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
        vAlpha = size / 8.0;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - vec2(0.5));
        if(d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.15;
        // Warm amber glow (food warmth against blue bg)
        vec3 c = vec3(0.95, 0.75, 0.4);
        gl_FragColor = vec4(c, a);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const orbs = new THREE.Points(orbGeo, orbMat);
  scene.add(orbs);

  // ===== INTERACTION & ANIMATION =====
  let mouseX=0, mouseY=0, targetX=0, targetY=0, scrollY=0;
  document.addEventListener('mousemove', e => { 
    mouseX = (e.clientX/window.innerWidth)*2-1; 
    mouseY = -(e.clientY/window.innerHeight)*2+1; 
  });
  window.addEventListener('scroll', () => { scrollY = window.pageYOffset; });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    
    // Update shaders
    steamMat.uniforms.uTime.value = t;
    orbMat.uniforms.uTime.value = t;
    
    // Mouse follow
    targetX += (mouseX-targetX)*0.02;
    targetY += (mouseY-targetY)*0.02;
    
    // Steam rotation follows mouse gently
    steam.rotation.y = t*0.02 + targetX*0.2;
    steam.rotation.x = targetY*0.1;
    
    // Animate food shapes - gentle floating
    plate.rotation.y = t*0.1;
    plate.rotation.z = Math.sin(t*0.3)*0.1;
    plate.position.y = -0.5 + Math.sin(t*0.4)*0.3;

    bowl.rotation.y = t*-0.08;
    bowl.position.y = 1.5 + Math.cos(t*0.35)*0.3;
    bowl.position.x = -3 + Math.sin(t*0.2)*0.2;

    spout.rotation.y = t*0.12;
    spout.position.y = -2 + Math.sin(t*0.5)*0.2;

    bread.rotation.x = t*0.15;
    bread.rotation.y = t*0.1;
    bread.position.y = 2 + Math.sin(t*0.3)*0.4;

    // Warm orbs gentle rotation
    orbs.rotation.y = t*0.015;
    
    // Scroll-based camera shift
    camera.position.y = -scrollY*0.0005;
    camera.rotation.x = scrollY*0.00005;
    
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.threeScene = { camera, scene, steam, plate, bowl, spout, bread, orbs };
})();
