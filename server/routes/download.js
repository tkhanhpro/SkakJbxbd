const express = require('express');
const router = express.Router();
const getVideoData = require('../utils/getVideoData');

router.get('/down', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const data = await getVideoData(url);
    if (!data || data.error) {
      return res.status(400).json({ error: data?.error || 'Failed to fetch media data' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;
