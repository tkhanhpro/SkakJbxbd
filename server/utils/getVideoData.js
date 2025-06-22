const axios = require('axios');
const qs = require('qs');

async function getVideoData(videoUrl, token = '', retries = 3) {
  const endpoint = 'https://getfvid.online/wp-json/aio-dl/video-data/';
  const headers = {
    'authority': 'getfvid.online',
    'accept': '*/*',
    'accept-language': 'vi-VN,vi;q=0.9',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://getfvid.online',
    'referer': 'https://getfvid.online/',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
  };

  const payload = qs.stringify({
    url: videoUrl,
    token: token || '292e8b8832c594c3fe843b9eb9d9dd16699901dd4d8c998301514542682b7346',
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axios.post(endpoint, payload, { headers });
      return res.data || null;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt === retries) {
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Delay before retry
    }
  }
}

module.exports = getVideoData;
