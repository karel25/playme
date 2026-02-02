const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 15;
let snake = [{ x: 5, y: 5 }];
let food = randomFood();
let dir = { x: 1, y: 0 };
let score = 0;

const buttons = document.querySelectorAll(".controls button");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const d = btn.dataset.dir;
    if (d === "left" && dir.x !== 1) dir = { x: -1, y: 0 };
    if (d === "right" && dir.x !== -1) dir = { x: 1, y: 0 };
    if (d === "up" && dir.y !== 1) dir = { x: 0, y: -1 };
    if (d === "down" && dir.y !== -1) dir = { x: 0, y: 1 };
  });
});

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / grid)),
    y: Math.floor(Math.random() * (canvas.height / grid))
  };
}

function drawSnake() {
  // Body
  ctx.strokeStyle = "#ff6b81";
  ctx.lineWidth = grid;
  ctx.lineCap = "round";
  ctx.beginPath();

  snake.forEach((p, i) => {
    const px = p.x * grid + grid / 2;
    const py = p.y * grid + grid / 2;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });

  ctx.stroke();

  // Head
  const head = snake[0];
  const hx = head.x * grid + grid / 2;
  const hy = head.y * grid + grid / 2;

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

  // Tongue
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hx, hy + 5);
  ctx.lineTo(hx, hy + 10);
  ctx.stroke();
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * grid + grid / 2,
    food.y * grid + grid / 2,
    grid / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function update() {
  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  if (
    head.x < 0 || head.y < 0 ||
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
  drawFood();
  drawSnake();
  update();
}

function endGame() {
  clearInterval(loop);
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("valentine").style.display = "block";
}

// Valentine logic
document.getElementById("yesBtn").onclick = () => {
  alert("YAY 🐍💖 We slithered into love.");
};

document.getElementById("noBtn").onmouseover = () => {
  const btn = document.getElementById("noBtn");
  btn.style.left = Math.random() * 120 - 60 + "px";
  btn.style.top = Math.random() * 120 - 60 + "px";
};

let loop = setInterval(draw, 180);
