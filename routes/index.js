const router = require('express').Router();
const videos = require('./videos');

router.use('/videos', videos);

module.exports = router;