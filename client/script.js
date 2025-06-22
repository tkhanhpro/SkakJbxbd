// Particle Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 50;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.002;
    if (this.opacity <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 128, 171, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Download Media
async function downloadMedia() {
  const url = document.getElementById('mediaUrl').value;
  const resultDiv = document.getElementById('result');
  const jsonBox = document.getElementById('jsonBox');
  const loader = document.getElementById('loader');
  const toast = document.getElementById('toast');

  if (!url) {
    showToast('Hey, drop a link to vibe with! 🌟');
    return;
  }

  resultDiv.innerHTML = '';
  jsonBox.innerHTML = '';
  loader.style.display = 'block';

  try {
    const response = await fetch(`/down?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    loader.style.display = 'none';

    // Hiển thị JSON response
    jsonBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

    if (!data.success) {
      showToast(data.error || 'Oops, something broke! 😿');
      return;
    }

    let html = '';
    if (data.medias && Array.isArray(data.medias)) {
      html += '<ul>';
      data.medias.forEach(media => {
        html += `<li><a href="${media.url}" target="_blank">${media.quality || 'Tải'}</a></li>`;
      });
      html += '</ul>';
    } else {
      html = '<p>No media to snag! 😕</p>';
    }

    resultDiv.innerHTML = html;
  } catch (error) {
    loader.style.display = 'none';
    showToast(`Yikes: ${error.message}`);
    jsonBox.innerHTML = `<pre>Error: ${error.message}</pre>`;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}
