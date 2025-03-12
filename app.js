    // Initialize 3D sphere
    const container = document.getElementById('sphere-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xFF4800, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const blueLight = new THREE.PointLight(0x00FFFF, 0.5);
    blueLight.position.set(-2, 1, 3);
    scene.add(blueLight);

    // Create sphere with wireframe and inner glow
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.4 });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0x0077FF,
      emissive: 0x001133,
      transparent: true,
      opacity: 0.2,
      shininess: 100
    });
    
    const sphere = new THREE.Mesh(geometry, innerMaterial);
    sphere.scale.set(0.95, 0.95, 0.95);

    const sphereGroup = new THREE.Group();
    sphereGroup.add(wireframeMesh);
    sphereGroup.add(sphere);

    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 5;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x00FFFF, size: 0.05, transparent: true });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);

    scene.add(sphereGroup);

    // Animation function
    function animate() {
      requestAnimationFrame(animate);
      sphereGroup.rotation.x += 0.002;
      sphereGroup.rotation.y += 0.004;
      const pulseScale = 0.95 + 0.03 * Math.sin(Date.now() * 0.001);
      sphere.scale.set(pulseScale, pulseScale, pulseScale);
      if (Math.random() > 0.98) {
        lineMaterial.opacity = 0.1 + Math.random() * 0.5;
      }
      renderer.render(scene, camera);
    }
    animate();

	    // Grid lines
		const gridLines = document.querySelector('.grid-lines');
		for (let i = 1; i < 10; i++) {
		  const hLine = document.createElement('div');
		  hLine.classList.add('h-line');
		  hLine.style.top = `${i * 10}%`;
		  gridLines.appendChild(hLine);
		  const vLine = document.createElement('div');
		  vLine.classList.add('v-line');
		  vLine.style.left = `${i * 10}%`;
		  gridLines.appendChild(vLine);
		}

// Resize Handler
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});

// Audio Handling
const backgroundAudio = document.getElementById('background-audio');
backgroundAudio.play();

// Command Handling
const commandInput = document.querySelector('.command-input');
commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = commandInput.value.trim().toUpperCase();
    handleCommand(command);
    commandInput.value = '';
  }
});

function handleCommand(command) {
  switch (command) {
    case 'STATUS':
      updateStatus('SYSTEM STATUS: OPERATIONAL');
      break;
    case 'CHANGE COLOR':
      changeSphereColor(0xFF0000);
      break;
    case 'RESET':
      updateStatus('SYSTEM STATUS: NORMAL');
      changeSphereColor(0x0077FF);
      break;
    case 'ABOUT':
      scrollToSection('about');
      break;
    case 'PROJECTS':
      scrollToSection('projects');
      break;
    case 'SKILLS':
      scrollToSection('skills');
      break;
    case 'CONTACT':
      scrollToSection('contact');
      break;
    case 'EVA LAUNCH':
      backgroundAudio.pause();
      const evaAudio = document.getElementById('cmd-eva');
      evaAudio.play();
      evaAudio.onended = () => backgroundAudio.play();
      updateStatus('EVA UNIT-01 LAUNCHED');
      changeSphereColor(0x800080);
      break;
    case 'ANGEL ALERT':
      backgroundAudio.pause();
      const angelAudio = document.getElementById('cmd-angel');
      angelAudio.play();
      angelAudio.onended = () => backgroundAudio.play();
      updateStatus('ALERT: ANGEL DETECTED');
      changeSphereColor(0xFF0000);
      break;
    case 'TOGGLE PARTICLES':
      backgroundAudio.pause();
      const toggleAudio = document.getElementById('cmd-toggle');
      toggleAudio.play();
      toggleAudio.onended = () => backgroundAudio.play();
      particles.visible = !particles.visible;
      break;
    case 'MAN':
      alert('Available commands: STATUS, CHANGE COLOR, RESET, ABOUT, PROJECTS, SKILLS, CONTACT, EVA LAUNCH, ANGEL ALERT, TOGGLE PARTICLES, MAN');
      break;
    default:
      alert('Command not recognized. Type MAN for available commands.');
  }
}

function updateStatus(newStatus) {
  document.querySelector('.status').textContent = newStatus;
}

function changeSphereColor(color) {
  sphere.material.color.setHex(color);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const dataPanel = document.querySelector('.data-panel');
  dataPanel.scrollTo({
    top: section.offsetTop,
    behavior: 'smooth'
  });
}

// Navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('href').substring(1);
    scrollToSection(sectionId);
  });
});

document.querySelector('.cmd-link').addEventListener('click', () => {
	const cmdFooter = document.querySelector('.cmd-footer');
	cmdFooter.scrollIntoView({ behavior: 'smooth' });
	commandInput.focus();
  });