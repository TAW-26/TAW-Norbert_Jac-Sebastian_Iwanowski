import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Backend działa poprawnie! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serwer wystartował na http://localhost:${PORT}`);
});