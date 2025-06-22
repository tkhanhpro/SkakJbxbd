async function downloadMedia() {
  const url = document.getElementById('mediaUrl').value;
  const resultDiv = document.getElementById('result');

  if (!url) {
    resultDiv.innerHTML = '<p style="color: red;">Please enter a valid URL</p>';
    return;
  }

  resultDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`/api/down?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
      return;
    }

    let html = '<h3>Download Links:</h3>';
    if (data.medias && Array.isArray(data.medias)) {
      html += '<ul>';
      data.medias.forEach(media => {
        html += `<li><a href="${media.url}" target="_blank">${media.quality || 'Download'}</a></li>`;
      });
      html += '</ul>';
    } else {
      html = '<p>No downloadable media found.</p>';
    }

    resultDiv.innerHTML = html;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}
