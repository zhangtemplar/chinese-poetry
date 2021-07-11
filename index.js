const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


const port = 8000;
const width = 1200;
const height = 825;

const formatBody = (title, author, body) => {
  // Title should occupy 10% of height or 2/3 of width, whichever is smaller
  const titleSize = Math.min(width * 2 / 3 / title.length, height / 10);
  // Author should be 80% of title size or 50% of width, whichever is smaller
  const authorSize = Math.min(width / 2 / author.length, titleSize * 0.8);
  // Body should take 80% of height or 90% of the width, whichever is smaller
  const bodySize = Math.min(width * 9 / 10 / Math.max.apply(null, body.map(b => b.length)), height * 8/ 10 / body.length);
  return `<html>
    <body>
        <h1 align="center" style="font-size: ${titleSize}px">${title}</h1>
        <h2 align="center" style="font-size: ${authorSize}px">${author}</h2>
        <p>
            ${body.map(line => `<div align="center" style="font-size: ${bodySize}px">${line}</div>`).join('\n')}
        </p>
      </body>
</html>`};

app.get('/', (req, res) => res.send("Please use /tangshi for 唐诗，/songci for 宋词, /shijing for 诗经，/yuanqu for 元曲, /caocao for 曹操"));

app.get('/tangshi', (req, res) => {
  const directoryName = path.join(__dirname, 'json');
  fs.readdir(directoryName, (err, files) => {
    if (err) {
      res.status(500).end();
      return;
    }
    // randomly choose a file
    files = files.filter(f => f.startsWith("poet."));
    const file = files[Math.floor(Math.random() * files.length)];
    const poetries = JSON.parse(fs.readFileSync(path.join(directoryName, file)));
    const poetry = poetries[Math.floor(Math.random() * poetries.length)];
    // Render the poetry
    res.send(formatBody(poetry.title, poetry.author, poetry.paragraphs));
  });
});

app.get('/songci', (req, res) => {
  const directoryName = path.join(__dirname, 'ci');
  fs.readdir(directoryName, (err, files) => {
    if (err) {
      res.status(500).end();
      return;
    }
    // randomly choose a file
    files = files.filter(f => f.startsWith("ci.song"));
    const file = files[Math.floor(Math.random() * files.length)];
    const poetries = JSON.parse(fs.readFileSync(path.join(directoryName, file)));
    const poetry = poetries[Math.floor(Math.random() * poetries.length)];
    // Render the poetry
    res.send(formatBody(poetry.rhythmic, poetry.author, poetry.paragraphs));
  });
});

app.get('/shijing', (req, res) => {
  const file = path.join(__dirname, 'shijing', 'shijing.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  res.send(formatBody(poetry.title, `${poetry.chapter}-${poetry.section}`, poetry.content));
});

app.get('/caocao', (req, res) => {
  const file = path.join(__dirname, 'caocaoshiji', 'caocao.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  res.send(formatBody(poetry.title, '曹操', poetry.paragraphs));
});

app.get('yuanqu', (req, res) => {
  const file = path.join(__dirname, 'yuanqu', 'yuanqu.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  res.send(formatBody(poetry.title, poetry.author, poetry.paragraphs));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
