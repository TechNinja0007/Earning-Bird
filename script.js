const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const birdImg = new Image();
birdImg.src = 'assets/bird.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'assets/pipe-top.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'assets/pipe-bottom.png';

const groundImg = new Image();
groundImg.src = 'assets/ground.png';

const flapSound = new Audio('assets/flap.wav');
const hitSound = new Audio('assets/hit.wav');

let bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 24,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let pipeGap = 120;
let pipeWidth = 52;
let pipeSpeed = 2;
let score = 0;
let frameCount = 0;
let gameOver = false;

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  pipeSpeed = 2;
  frameCount = 0;
  gameOver = false;
  document.getElementById('gameOverScreen').style.display = 'none';
  loop();
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeTopImg, pipe.x, pipe.y, pipeWidth, pipe.height);
    ctx.drawImage(pipeBottomImg, pipe.x, pipe.y + pipe.height + pipeGap, pipeWidth, canvas.height - pipe.y - pipe.height - pipeGap);
  });
}

function updatePipes() {
  if (frameCount % 100 === 0) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({ x: canvas.width, y: 0, height: pipeHeight });
  }

  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });

  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
    if (score % 5 === 0) {
      pipeSpeed += 0.5;
    }
  }
}

function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.y + pipe.height || bird.y + bird.height > pipe.y + pipe.height + pipeGap)
    ) {
      return true;
    }
  }
  if (bird.y + bird.height >= canvas.height - groundImg.height) {
    return true;
  }
  return false;
}

function drawGround() {
  ctx.drawImage(groundImg, 0, canvas.height - groundImg.height);
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();
  drawPipes();
  drawGround();
  drawScore();

  updatePipes();

  if (checkCollision()) {
    hitSound.play();
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    return;
  }

  frameCount++;
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    bird.velocity = bird.lift;
    flapSound.play();
  }
});

document.getElementById('restartBtn').addEventListener('click', resetGame);

resetGame();
