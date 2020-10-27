const express = require('express');
const router = express.Router();

// Define home route (http://localhost:5000)
router.get('/', (req, res) => {
  res.send('Inside the music home route');
});

module.exports = router;
