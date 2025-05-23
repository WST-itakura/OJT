let imageDataURL = '';
let isMoving = false;
let mario = document.getElementById('mario');

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
  location.reload(); // 画面をリセット
}

function spawnGoomba() {
  const container = document.getElementById("goomba-container");
  const goomba = document.createElement("div");
  goomba.classList.add("goomba");
  goomba.style.bottom = "100px"; // 地面と同じ高さ
  container.appendChild(goomba);

  // アニメーション終了後に削除
  setTimeout(() => {
    goomba.remove();
  }, 10000);
}

// ⏱️ 一定間隔でGoomba出現
setInterval(spawnGoomba, 2000);

// ✅ マリオをクリックすると移動開始
mario.addEventListener("click", () => {
  if (!isMoving) {
    isMoving = true;
    moveMario();
  }
});

function moveMario() {
  const interval = setInterval(() => {
    const currentLeft = parseInt(getComputedStyle(mario).left, 10);
    mario.style.left = (currentLeft + 5) + 'px';

    // 接触判定
    document.querySelectorAll('.goomba').forEach(goomba => {
      const marioRect = mario.getBoundingClientRect();
      const goombaRect = goomba.getBoundingClientRect();

      if (
        marioRect.left < goombaRect.right &&
        marioRect.right > goombaRect.left &&
        marioRect.bottom > goombaRect.top &&
        marioRect.top < goombaRect.bottom
      ) {
        // どこから当たったかで処理分岐（上から踏んだら削除、それ以外はリセット）
        if (marioRect.bottom - 5 < goombaRect.top) {
          goomba.remove(); // クリボーを踏みつぶす
        } else {
          clearInterval(interval);
          alert("ゲームオーバー！リセットします");
          location.reload(); // 全リセット
        }
      }
    });
  }, 50);
}
