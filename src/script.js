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
