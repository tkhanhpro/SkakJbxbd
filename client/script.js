async function downloadMedia() {
  const url = document.getElementById('mediaUrl').value;
  const resultDiv = document.getElementById('result');
  const jsonBox = document.getElementById('jsonBox');
  const loader = document.getElementById('loader');
  const toast = document.getElementById('toast');

  if (!url) {
    showToast('Hey, drop a link to vibe with! 🌟');
    return;
  }

  resultDiv.innerHTML = '';
  jsonBox.innerHTML = '';
  loader.style.display = 'block';

  try {
    const response = await fetch(`/down?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    loader.style.display = 'none';

    // Hiển thị JSON response
    jsonBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

    if (!data.success) {
      showToast(data.error || 'Oops, something broke! 😿');
      return;
    }

    let html = '';
    if (data.medias && Array.isArray(data.medias)) {
      html += '<ul>';
      data.medias.forEach(media => {
        html += `<li><a href="${media.url}" target="_blank">${media.quality || 'Tải'}</a></li>`;
      });
      html += '</ul>';
    } else {
      html = '<p>No media to snag! 😕</p>';
    }

    resultDiv.innerHTML = html;
  } catch (error) {
    loader.style.display = 'none';
    showToast(`Yikes: ${error.message}`);
    jsonBox.innerHTML = `<pre>Error: ${error.message}</pre>`;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}
