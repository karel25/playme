const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 15;
let snake = [{ x: 5, y: 5 }];
let food = randomFood();
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let score = 0;

/* ================= CONTROLS ================= */
document.querySelectorAll(".controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    const d = btn.dataset.dir;
    if (d === "left" && dir.x !== 1) nextDir = { x: -1, y: 0 };
    if (d === "right" && dir.x !== -1) nextDir = { x: 1, y: 0 };
    if (d === "up" && dir.y !== 1) nextDir = { x: 0, y: -1 };
    if (d === "down" && dir.y !== -1) nextDir = { x: 0, y: 1 };
  });
});

/* ================= FOOD ================= */
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / grid)),
    y: Math.floor(Math.random() * (canvas.height / grid))
  };
}

function drawHeart(x, y, size) {
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x - size,
    y - size,
    x - size * 2,
    y + size / 2,
    x,
    y + size * 2
  );
  ctx.bezierCurveTo(
    x + size * 2,
    y + size / 2,
    x + size,
    y - size,
    x,
    y
  );
  ctx.fill();
}

/* ================= SNAKE ================= */
function drawSnake() {
  ctx.lineWidth = grid;
  ctx.lineCap = "round";

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#ff4d6d");
  gradient.addColorStop(1, "#ff9aa2");

  ctx.strokeStyle = gradient;
  ctx.beginPath();

  snake.forEach((p, i) => {
    const px = p.x * grid + grid / 2;
    const py = p.y * grid + grid / 2;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });

  ctx.stroke();

  // Head
  const h = snake[0];
  const hx = h.x * grid + grid / 2;
  const hy = h.y * grid + grid / 2;

  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.arc(hx, hy, grid / 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(hx - 3, hy - 3, 2, 0, Math.PI * 2);
  ctx.arc(hx + 3, hy - 3, 2, 0, Math.PI * 2);
  ctx.fill();
}

/* ================= GAME LOOP ================= */
function update() {
  dir = nextDir;

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / grid ||
    head.y >= canvas.height / grid ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
    if (score === 5) endGame();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawHeart(
    food.x * grid + grid / 2,
    food.y * grid + grid / 2,
    grid / 3
  );

  drawSnake();
  update();
}

function endGame() {
  clearInterval(loop);
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("valentine").style.display = "block";
}

/* ================= CONFETTI ================= */
function launchConfetti() {
  const confetti = document.createElement("canvas");
  confetti.id = "confetti";
  document.body.appendChild(confetti);

  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;

  const cctx = confetti.getContext("2d");

  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * confetti.width,
    y: Math.random() * confetti.height - confetti.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 6 + 3,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`
  }));

  function animate() {
    cctx.clearRect(0, 0, confetti.width, confetti.height);
    pieces.forEach(p => {
      cctx.fillStyle = p.color;
      cctx.beginPath();
      cctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cctx.fill();
      p.y += p.d;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================= VALENTINE ================= */
document.getElementById("yesBtn").onclick = () => {
  launchConfetti();
  document.getElementById("valentine").innerHTML = `
    <h2>YEEEY! thank you baby!! hehehe 💖🐍</h2>
  `;
};

document.getElementById("noBtn").onmouseover = () => {
  const btn = document.getElementById("noBtn");
  btn.style.left = Math.random() * 140 - 70 + "px";
  btn.style.top = Math.random() * 100 - 50 + "px";
};

let loop = setInterval(draw, 160);
