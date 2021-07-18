const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


const port = 80;
const width = 1200;
// http://smad.jmu.edu/shen/webtype/lineheight.html#:~:text=In%20CSS%2C%20the%20line%2Dheight,height%20is%20about%2016.8px.
const lineHeightFontSizeRatio = 1.4;
const height = 825 - 24;

const formatBody = (title, author, body) => {
  // Title should occupy 10% of height or 2/3 of width, whichever is smaller
  const titleSize = Math.min(width * 2 / 3 / title.length, height * 0.1 / lineHeightFontSizeRatio);
  // Author should be 80% of title size or 50% of width, whichever is smaller
  const authorSize = Math.min(width / 2 / author.length, titleSize * 0.8);
  // Body should take 80% of height or 90% of the width, whichever is smaller
  const bodySize = Math.min(width * 0.9 / Math.max.apply(null, body.map(b => b.length)), height * 0.8 / lineHeightFontSizeRatio / body.length);
  return `<html>
    <body>
        <h1 align="center" style="margin: 0; font-size: ${titleSize}px">${title}</h1>
        <h2 align="center" style="margin: 0; font-size: ${authorSize}px">${author}</h2>
        <p>
            ${body.map(line => `<div align="center" style="margin: 0;font-size: ${bodySize}px">${line}</div>`).join('\n')}
        </p>
      </body>
</html>`};

app.get('/', (req, res) => res.send("Please use /tangshi for 唐诗，/songci for 宋词, /shijing for 诗经，/yuanqu for 元曲, /caocao for 曹操"));

app.get('/tangshi', (req, res) => {
  const file = path.join(__dirname, 'json', '唐诗三百首.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  res.send(formatBody(poetry.title, poetry.author, poetry.paragraphs));
});

app.get('/songci', (req, res) => {
  const file = path.join(__dirname, 'ci', '宋词三百首.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  res.send(formatBody(poetry.rhythmic, poetry.author, poetry.paragraphs));
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
