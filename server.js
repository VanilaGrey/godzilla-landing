// server.js
import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3000;

const API_KEY = '342a95271c71ec52b56a67ee03b42b61'; // твой ключ
const CITY = 'Almaty'; // город можно изменить

// Разрешаем фронту обращаться к серверу
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/weather', async (req, res) => {
  try {
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${CITY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.json({ error: 'Температура недоступна' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
