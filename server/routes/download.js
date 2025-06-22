const express = require('express');
const router = express.Router();
const getVideoData = require('../utils/getVideoData');

router.get('/down', async (req, res) => {
  const { url } = req.query;

  // Kiểm tra URL
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL is required',
      medias: null,
      metadata: null
    });
  }

  // Kiểm tra định dạng URL
  const validUrlPattern = /^(https?:\/\/)(www\.)?(facebook\.com|instagram\.com|youtube\.com|tiktok\.com)\/.+$/;
  if (!validUrlPattern.test(url)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL. Only Facebook, Instagram, YouTube, and TikTok are supported.',
      medias: null,
      metadata: null
    });
  }

  try {
    const data = await getVideoData(url);
    if (!data || data.error) {
      return res.status(400).json({
        success: false,
        error: data?.error || 'Failed to fetch media',
        medias: null,
        metadata: null
      });
    }

    // Định dạng data gọn gàng
    const response = {
      success: true,
      error: null,
      medias: data.medias ? data.medias.map(media => ({
        url: media.url,
        quality: media.quality || 'Default'
      })) : [],
      metadata: {
        title: data.title || null,
        duration: data.duration || null,
        thumbnail: data.thumbnail || null
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching media:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
      medias: null,
      metadata: null
    });
  }
});

module.exports = router;
