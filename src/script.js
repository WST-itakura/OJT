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
function spawnGoomba() {
  const container = document.getElementById("goomba-container");
  const goomba = document.createElement("div");
  goomba.classList.add("goomba");

  // ランダムな上下位置を指定して自然な出現感を出す場合（任意）
  const randomBottom = 48 + Math.floor(Math.random() * 30);
  goomba.style.bottom = `${randomBottom}px`;

  container.appendChild(goomba);

  // 一定時間後に削除（アニメ終了後）
  setTimeout(() => {
    container.removeChild(goomba);
  }, 10000); // アニメーションと同じ時間（10秒）
}

// 一定間隔で出現（例：2秒おき）
setInterval(spawnGoomba, 2000);
