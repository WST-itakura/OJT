let imageDataURL = '';

document.getElementById('imageInput').addEventListener('change', previewImage);

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    imageDataURL = reader.result;
    document.getElementById('preview-box').innerHTML =
      '<img src="' + imageDataURL + '" />';
  };
  reader.readAsDataURL(event.target.files[0]);
}

function showResults() {
  if (!imageDataURL) {
    alert("画像を選択してください。");
    return;
  }
  document.getElementById('selectedImage').src = imageDataURL;
  document.getElementById('initial-screen').style.display = 'none';
  document.getElementById('results-screen').style.display = 'block';
}

function goBack() {
  document.getElementById('results-screen').style.display = 'none';
  document.getElementById('initial-screen').style.display = 'block';
}

const mario = document.getElementById('mario');
const goombaContainer = document.getElementById('goomba-container');
const fireballContainer = document.getElementById('fireball-container');

let marioPosX = 50; // マリオの横位置(px)
let marioPosY = 0; // ジャンプ時の高さ(px)
const moveStep = 10;
const jumpHeight = 150;
const jumpDuration = 600;
const fireballSpeed = 10;

let isJumping = false;
let isDead = false;
let isGameOver = false;

let defeatedGoombaCount = 0;
let deathCount = 0;

// マリオ初期設定
mario.style.position = 'absolute';
mario.style.bottom = '100px';
mario.style.left = marioPosX + 'px';

// 倒したクリボー数カウンター表示
const counterDisplay = document.createElement('div');
counterDisplay.style.position = 'fixed';
counterDisplay.style.top = '10px';
counterDisplay.style.left = '10px';
counterDisplay.style.color = 'white';
counterDisplay.style.fontSize = '20px';
counterDisplay.style.fontWeight = 'bold';
counterDisplay.style.zIndex = '1000';
counterDisplay.textContent = '倒したクリボー: 0';
document.body.appendChild(counterDisplay);

// クリボー出現処理（ランダム間隔で）
function spawnGoomba() {
  if (isGameOver) return;

  const goomba = document.createElement('div');
  goomba.classList.add('goomba');
  goombaContainer.appendChild(goomba);

  setTimeout(() => {
    if (goombaContainer.contains(goomba)) {
      goombaContainer.removeChild(goomba);
    }
  }, 10000);

  const nextSpawn = Math.random() * 2000 + 1000; // 1〜3秒
  setTimeout(spawnGoomba, nextSpawn);
}


spawnGoomba();

// ジャンプ処理（直線ジャンプ、滞空時間長め）
function jumpMario() {
  if (isJumping || isDead || isGameOver) return;

  isJumping = true;
  const jumpPeak = 150; // ジャンプ高さ(px)
  const hangTime = 400; // 滞空時間(ms)

  // 上昇
  mario.style.transition = 'bottom 0.5s ease-out';
  mario.style.bottom = (100 + jumpPeak) + 'px';

  // 滞空後に落下
  setTimeout(() => {
    mario.style.transition = 'bottom 0.5s ease-in';
    mario.style.bottom = '100px';

    setTimeout(() => {
      isJumping = false;
    }, 500); // 落下時間
  }, hangTime);
}
// 残機数（ライフ）表示
const lifeDisplay = document.createElement('div');
lifeDisplay.style.position = 'fixed';
lifeDisplay.style.top = '40px';
lifeDisplay.style.left = '10px';
lifeDisplay.style.color = 'white';
lifeDisplay.style.fontSize = '20px';
lifeDisplay.style.fontWeight = 'bold';
lifeDisplay.style.zIndex = '1000';
lifeDisplay.textContent = '残機: 3';
document.body.appendChild(lifeDisplay);

function handleDeath() {
  if (isDead || isGameOver) return;
  isDead = true;
  deathCount++;

  mario.style.opacity = '0.5';
  console.log(`マリオ死亡！${deathCount}回目`);

  // 残機表示を更新
  lifeDisplay.textContent = `残機: ${3 - deathCount}`;

  if (deathCount >= 3) {
    isGameOver = true;
    alert('ゲームオーバー！リロードして再挑戦してください。');
    return;
  }

  setTimeout(() => {
    isDead = false;
    mario.style.opacity = '1';
    marioPosX = 50;
    mario.style.left = marioPosX + 'px';
    mario.style.bottom = '100px';
  }, 5000);
}



// 炎の球生成・移動処理
function createFireball() {
  if (isDead || isGameOver) return;

  const fireball = document.createElement('div');
  fireball.classList.add('fireball');

  fireball.style.position = 'absolute';
  fireball.style.bottom = mario.style.bottom;
  fireball.style.left = (marioPosX + 40) + 'px';
  fireballContainer.appendChild(fireball);

  function move() {
    if (!fireball.parentNode) return;

    let currentLeft = parseInt(fireball.style.left, 10);
    currentLeft += fireballSpeed;
    fireball.style.left = currentLeft + 'px';

    if (currentLeft > window.innerWidth) {
      fireballContainer.removeChild(fireball);
      return;
    }

    const fireballRect = fireball.getBoundingClientRect();
    const goombas = goombaContainer.getElementsByClassName('goomba');
    for (let goomba of goombas) {
      const goombaRect = goomba.getBoundingClientRect();
      if (
        fireballRect.left < goombaRect.right &&
        fireballRect.right > goombaRect.left &&
        fireballRect.top < goombaRect.bottom &&
        fireballRect.bottom > goombaRect.top
      ) {
        goomba.remove();
        fireball.remove();
        defeatedGoombaCount++;
        counterDisplay.textContent = `倒したクリボー: ${defeatedGoombaCount}`;
        return;
      }
    }

    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}

// キーボード操作
document.addEventListener('keydown', (e) => {
  if (isDead || isGameOver) return;

  switch (e.key) {
    case 'ArrowRight':
      marioPosX += moveStep;
      if (marioPosX > window.innerWidth - 50) marioPosX = window.innerWidth - 50;
      mario.style.left = marioPosX + 'px';
      mario.style.transform = 'scaleX(1)';
      break;
    case 'ArrowLeft':
      marioPosX -= moveStep;
      if (marioPosX < 0) marioPosX = 0;
      mario.style.left = marioPosX + 'px';
      mario.style.transform = 'scaleX(-1)';
      break;
    case 'Space':
      jumpMario();
      break;
    case 'ArrowUp':
      createFireball();
      break;
  }
});

document.addEventListener('keydown', (e) => {
  if (isDead || isGameOver) return;

  if (e.key === 'ArrowRight') {
    marioPosX += moveStep;
    if (marioPosX > window.innerWidth - 50) marioPosX = window.innerWidth - 50;
    mario.style.left = marioPosX + 'px';
    mario.style.transform = 'scaleX(1)';
  } else if (e.key === 'ArrowLeft') {
    marioPosX -= moveStep;
    if (marioPosX < 0) marioPosX = 0;
    mario.style.left = marioPosX + 'px';
    mario.style.transform = 'scaleX(-1)';
  } else if (e.code === 'Space') {
    jumpMario(); // スペースキーのみでジャンプ
  } else if (e.key === 'ArrowUp') {
    createFireball();
  }
});


// 当たり判定チェック
function checkCollision() {
  if (isDead || isGameOver) return;

  const marioRect = mario.getBoundingClientRect();
  const goombas = goombaContainer.getElementsByClassName('goomba');

  for (let goomba of goombas) {
    const goombaRect = goomba.getBoundingClientRect();

    if (
      marioRect.left < goombaRect.right &&
      marioRect.right > goombaRect.left &&
      marioRect.top < goombaRect.bottom &&
      marioRect.bottom > goombaRect.top
    ) {
      handleDeath();
      break;
    }
  }
}

// ゲームループ
function gameLoop() {
  checkCollision();
  requestAnimationFrame(gameLoop);
}
gameLoop();
