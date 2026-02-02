const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 15;
let snake = [{ x: 5 * box, y: 5 * box }];
let food = randomFood();
let direction = "right";
let score = 0;

const buttons = document.querySelectorAll(".controls button");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    direction = btn.dataset.dir;
  });
});

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "#ff4d6d" : "#ff99ac";
    ctx.fillRect(part.x, part.y, box, box);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (direction === "left") head.x -= box;
  if (direction === "right") head.x += box;
  if (direction === "up") head.y -= box;
  if (direction === "down") head.y += box;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
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

function endGame() {
  clearInterval(gameLoop);
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("valentine").style.display = "block";
}

// Valentine logic
document.getElementById("yesBtn").onclick = () => {
  alert("YAY!! 💖🥰 You made my heart glitch.");
};

document.getElementById("noBtn").onmouseover = () => {
  const btn = document.getElementById("noBtn");
  btn.style.left = Math.random() * 120 - 60 + "px";
  btn.style.top = Math.random() * 120 - 60 + "px";
};

let gameLoop = setInterval(draw, 200);
