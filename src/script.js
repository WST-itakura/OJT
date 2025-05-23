let isRunning = false;
let mario = document.getElementById("mario");

function startMario() {
  if (isRunning) return;

  isRunning = true;
  mario.style.transition = "left 10s linear";
  mario.style.left = "90%";

  spawnGoombasRepeatedly();

  // 10秒後にリセット
  setTimeout(() => {
    resetGame();
  }, 10000);
}

function resetGame() {
  isRunning = false;
  mario.style.transition = "none";
  mario.style.left = "50px";

  // クリボー削除
  const goombas = document.querySelectorAll(".goomba");
  goombas.forEach(g => g.remove());
}

// クリボー連続出現
function spawnGoombasRepeatedly() {
  const interval = setInterval(() => {
    if (!isRunning) {
      clearInterval(interval);
      return;
    }
    spawnGoomba();
  }, 1500);
}

// クリボー生成と当たり判定
function spawnGoomba() {
  const goomba = document.createElement("div");
  goomba.classList.add("goomba");
  document.getElementById("goomba-container").appendChild(goomba);

  goomba.addEventListener("animationiteration", () => {
    goomba.remove();
  });

  // 当たり判定（簡易）
  const checkCollision = setInterval(() => {
    if (!isRunning) return;

    const marioRect = mario.getBoundingClientRect();
    const goombaRect = goomba.getBoundingClientRect();

    const isHit =
      marioRect.left < goombaRect.right &&
      marioRect.right > goombaRect.left &&
      marioRect.top < goombaRect.bottom &&
      marioRect.bottom > goombaRect.top;

    if (isHit) {
      clearInterval(checkCollision);
      resetGame();
    }
  }, 50);
}
