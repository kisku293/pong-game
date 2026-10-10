const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const playerPaddle = document.getElementById('playerPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');

const game = {
  width: gameArea.clientWidth,
  height: gameArea.clientHeight,
  paddleHeight: 100,
  paddleWidth: 14,
  ballSize: 16,
  playerY: 160,
  computerY: 160,
  ballX: 352,
  ballY: 202,
  ballSpeedX: 5,
  ballSpeedY: 4,
  playerScore: 0,
  computerScore: 0,
  keys: {
    ArrowUp: false,
    ArrowDown: false,
  },
  mouseY: 160,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updatePaddlePositions() {
  playerPaddle.style.top = `${game.playerY}px`;
  computerPaddle.style.top = `${game.computerY}px`;
}

function updateBallPosition() {
  ball.style.left = `${game.ballX}px`;
  ball.style.top = `${game.ballY}px`;
}

function resetBall(direction) {
  game.ballX = game.width / 2 - game.ballSize / 2;
  game.ballY = game.height / 2 - game.ballSize / 2;
  const angle = (Math.random() * 1.2 - 0.6); // between -0.6 and 0.6 radians
  const speed = 5;

  game.ballSpeedX = direction * speed * (1 + Math.random() * 0.35);
  game.ballSpeedY = Math.sin(angle) * speed * 1.5;

  updateBallPosition();
}

function scorePoint(playerWon) {
  if (playerWon) {
    game.playerScore += 1;
    playerScoreEl.textContent = game.playerScore;
  } else {
    game.computerScore += 1;
    computerScoreEl.textContent = game.computerScore;
  }

  resetBall(playerWon ? 1 : -1);
}

function handleWallCollision() {
  if (game.ballY <= 0) {
    game.ballY = 0;
    game.ballSpeedY *= -1;
  }

  if (game.ballY + game.ballSize >= game.height) {
    game.ballY = game.height - game.ballSize;
    game.ballSpeedY *= -1;
  }
}

function handlePaddleCollision() {
  const playerLeft = 20;
  const playerRight = playerLeft + game.paddleWidth;
  const playerTop = game.playerY;
  const playerBottom = playerTop + game.paddleHeight;

  const computerLeft = game.width - 20 - game.paddleWidth;
  const computerRight = computerLeft + game.paddleWidth;
  const computerTop = game.computerY;
  const computerBottom = computerTop + game.paddleHeight;

  if (
    game.ballX <= playerRight &&
    game.ballX + game.ballSize >= playerLeft &&
    game.ballY + game.ballSize >= playerTop &&
    game.ballY <= playerBottom &&
    game.ballSpeedX < 0
  ) {
    game.ballX = playerRight;
    const impact = (game.ballY + game.ballSize / 2 - (playerTop + game.paddleHeight / 2)) / (game.paddleHeight / 2);
    game.ballSpeedX *= -1.06;
    game.ballSpeedY = impact * 6;
  }

  if (
    game.ballX + game.ballSize >= computerLeft &&
    game.ballX <= computerRight &&
    game.ballY + game.ballSize >= computerTop &&
    game.ballY <= computerBottom &&
    game.ballSpeedX > 0
  ) {
    game.ballX = computerLeft - game.ballSize;
    const impact = (game.ballY + game.ballSize / 2 - (computerTop + game.paddleHeight / 2)) / (game.paddleHeight / 2);
    game.ballSpeedX *= -1.06;
    game.ballSpeedY = impact * 6;
  }
}

function handleScoring() {
  if (game.ballX < 0) {
    scorePoint(false);
  }

  if (game.ballX + game.ballSize > game.width) {
    scorePoint(true);
  }
}

function updatePlayerMovement() {
  if (game.keys.ArrowUp) {
    game.playerY -= 8;
  }

  if (game.keys.ArrowDown) {
    game.playerY += 8;
  }

  game.playerY = clamp(game.playerY, 0, game.height - game.paddleHeight);
}

function updateComputerMovement() {
  const paddleCenter = game.computerY + game.paddleHeight / 2;
  const target = game.ballY + game.ballSize / 2;

  if (target > paddleCenter) {
    game.computerY += 5;
  } else if (target < paddleCenter) {
    game.computerY -= 5;
  }

  game.computerY = clamp(game.computerY, 0, game.height - game.paddleHeight);
}

function animate() {
  updatePlayerMovement();
  updateComputerMovement();

  game.ballX += game.ballSpeedX;
  game.ballY += game.ballSpeedY;

  handleWallCollision();
  handlePaddleCollision();
  handleScoring();

  updatePaddlePositions();
  updateBallPosition();

  requestAnimationFrame(animate);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    game.keys[event.key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    game.keys[event.key] = false;
  }
});

gameArea.addEventListener('mousemove', (event) => {
  const rect = gameArea.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  game.playerY = clamp(mouseY - game.paddleHeight / 2, 0, game.height - game.paddleHeight);
});

updatePaddlePositions();
updateBallPosition();
resetBall(1);
requestAnimationFrame(animate);
