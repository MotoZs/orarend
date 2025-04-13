const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = 'adatok.json';

function readData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/orarend', (req, res) => {
  const data = readData();
  res.json(data.orarend);
});

app.post('/orarend', (req, res) => {
  const { nap, ora, tantargy } = req.body;
  if (!nap || !ora || !tantargy) return res.status(400).send('Hiányzó adat');
  const data = readData();
  data.orarend.push({ nap, ora, tantargy });
  writeData(data);
  res.status(201).send('Hozzáadva');
});

app.delete('/orarend', (req, res) => {
  const { nap, ora } = req.body;
  if (!nap || !ora) return res.status(400).send('Hiányzó nap vagy óra');
  let data = readData();
  data.orarend = data.orarend.filter(o => !(o.nap === nap && o.ora === ora));
  writeData(data);
  res.send('Törölve');
});

app.put('/orarend', (req, res) => {
  const { nap, ora, tantargy } = req.body;
  if (!nap || !ora || !tantargy) return res.status(400).send('Hiányzó adat');
  const data = readData();
  const index = data.orarend.findIndex(o => o.nap === nap && o.ora === ora);
  if (index === -1) return res.status(404).send('Nem található az adott óra');
  data.orarend[index].tantargy = tantargy;
  writeData(data);
  res.send('Módosítva');
});

app.listen(3000, () => {
  console.log(`API fut: http://localhost:3000`);
});
