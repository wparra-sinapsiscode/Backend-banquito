const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log('Root route working!');
  res.json({ message: 'Working!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.listen(3003, () => {
  console.log('Minimal server running on port 3003');
  console.log('Test: http://localhost:3003/');
});