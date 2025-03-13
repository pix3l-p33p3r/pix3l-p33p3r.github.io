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

// Timer Functionality
setInterval(() => {
  const timeDisplay = document.querySelector('.time');
  const currentTime = timeDisplay.textContent;
  const timeParts = currentTime.replace('T-MINUS ', '').split(':');
  let hours = parseInt(timeParts[0]);
  let mins = parseInt(timeParts[1]);
  let secs = parseInt(timeParts[2]);
  
  secs -= 1;
  if (secs < 0) {
    secs = 59;
    mins -= 1;
    if (mins < 0) {
      mins = 59;
      hours -= 1;
      if (hours < 0) {
        hours = 24;
        mins = 0;
        secs = 0;
      }
    }
  }
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  timeDisplay.textContent = `T-MINUS ${formattedTime}`;
}, 1000);

// Dynamic Time Overlay
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('current-time').textContent = `Current Time: ${timeString}`;
}
setInterval(updateTime, 1000);
updateTime(); // Initial call

function handleCommand(command) {
  switch (command) {
    case 'STATUS':
      updateStatus('SYSTEM STATUS: OPERATIONAL');
      document.getElementById('system-status').querySelector('p').textContent = 'Operational';
      break;
    case 'CHANGE COLOR':
      changeSphereColor(0xFF0000);
      break;
    case 'RESET':
      updateStatus('SYSTEM STATUS: NORMAL');
      changeSphereColor(0x0077FF);
      document.getElementById('system-status').querySelector('p').textContent = 'Normal';
      break;
    case 'EVA LAUNCH':
      backgroundAudio.pause();
      const evaAudio = document.getElementById('cmd-eva');
      evaAudio.play();
      evaAudio.onended = () => backgroundAudio.play();
      updateStatus('EVA UNIT-01 LAUNCHED');
      changeSphereColor(0x800080);
      document.getElementById('float-1').style.animation = 'launch 2s';
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
    //case 'MAP':
    //  const mapPanel = document.createElement('div');
    //  mapPanel.classList.add('holo-panel');
    //  mapPanel.id = 'map-panel';
    //  mapPanel.innerHTML = '<h4>Mini Map</h4><p>Map data here</p><button class="close-btn">X</button>';
    //  document.querySelector('main').appendChild(mapPanel);
    //  mapPanel.querySelector('.close-btn').addEventListener('click', () => mapPanel.remove());
    //  break;
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

// Scroll to section using scrollIntoView
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Dynamic Date for About Terminal
const aboutTerminal = document.querySelector('.about-terminal');
function updateTerminalDate() {
  const now = new Date();
  const dateString = now.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/,/, ''); // Formats as MM-DD-YYYY HH:MM:SS
  aboutTerminal.setAttribute('data-time', `[${dateString}] pix3l_p33p3r@UM6P-1337`);
}
updateTerminalDate(); // Set initial date
setInterval(updateTerminalDate, 1000); // Update every second

const mainText = "I'm pix3l_p33p3r, a student at UM6P/1337, passionate about tech, coding, and building things. My journey includes exploring various programming languages, tools, and technologies, from low-level assembly to high-level scripting. I enjoy tinkering with hardware and software alike, always looking for new challenges to solve.";
const warningTextContent = "WARNING: OPEN FOR HIRING!";
const ghostText = document.getElementById('ghost-text');
const warningText = document.getElementById('warning-text');
let mainIndex = 0;
let warningIndex = 0;

function typeMainText() {
  if (mainIndex < mainText.length) {
    ghostText.textContent += mainText[mainIndex];
    mainIndex++;
    setTimeout(typeMainText, 30); // Fast typing for main text
  } else {
    // After main text finishes, start typing warning
    setTimeout(typeWarningText, 500); // Small delay before warning starts
  }
}

function typeWarningText() {
  if (warningIndex === 0) {
    warningText.style.opacity = 1; // Make warning visible
  }
  if (warningIndex < warningTextContent.length) {
    warningText.textContent += warningTextContent[warningIndex];
    warningIndex++;
    setTimeout(typeWarningText, 37); // Slightly slower typing for warning
  } else {
    // Reset everything after a pause
    setTimeout(() => {
      ghostText.textContent = '';
      warningText.textContent = '';
      warningText.style.opacity = 0;
      mainIndex = 0;
      warningIndex = 0;
      typeMainText();
    }, 5000); // 5-second pause before restarting
  }
}

// Start typing the main text
typeMainText();