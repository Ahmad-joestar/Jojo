const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const floatingParticles = [];
const texts = [
  { text: "GDG", size: 150 },
  { text: "Github Session", size: 80 },
];

class Particle {
  constructor(targetX, targetY, size) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.targetX = targetX;
    this.targetY = targetY;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.size = size;
    this.arrived = false;
    this.delay = Math.random() * 10;
    this.elapsedTime = 0;
  }

  update() {
    if (!this.arrived) {
      this.elapsedTime += 0.01;
      if (this.elapsedTime > this.delay) {
        this.dx = (this.targetX - this.x) * 0.05 + (Math.random() - 0.5) * 2;
        this.dy = (this.targetY - this.y) * 0.05 + (Math.random() - 0.5) * 2;

        this.x += this.dx;
        this.y += this.dy;

        if (
          Math.abs(this.targetX - this.x) < 0.5 &&
          Math.abs(this.targetY - this.y) < 0.5
        ) {
          this.arrived = true;
          this.x = this.targetX;
          this.y = this.targetY;
        }
      }
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class FloatingParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = (Math.random() - 0.5) * 1;
    this.dy = (Math.random() - 0.5) * 1;
    this.size = Math.random() * 2;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initText(textObj, posX, posY) {
  ctx.font = `bold ${textObj.size}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(textObj.text, posX, posY);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      if (pixels[index] > 128) {
        particles.push(new Particle(x, y, Math.random() * 2));
      }
    }
  }
}

function createFloatingParticles(count) {
  for (let i = 0; i < count; i++) {
    floatingParticles.push(new FloatingParticle());
  }
}

function animate() {
  ctx.fillStyle = "rgba(18, 18, 18, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  floatingParticles.forEach((fp) => {
    fp.update();
    fp.draw();
  });

  requestAnimationFrame(animate);
}

function distributeText() {
  particles.length = 0;

  let positions = [
    { x: canvas.width / 2, y: canvas.height / 3 },
    { x: canvas.width / 2, y: canvas.height / 2 },
  ];

  texts.forEach((textObj, index) => {
    initText(textObj, positions[index].x, positions[index].y);
  });
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles.length = 0;
  floatingParticles.length = 0;
  distributeText();
  createFloatingParticles(100);
});

distributeText();
createFloatingParticles(100);
animate();
