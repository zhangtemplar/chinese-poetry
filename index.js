const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


const port = 3000;

const formatBody = (title, author, body) => {
  const titleSize = Math.min(50 / title.length, 10);
  const authorSize = Math.min(50 / author.length, titleSize / 1.4);
  const bodySize = Math.min(80 / Math.max.apply(null, body.map(b => b.length)), 100 / body.length, 8);
  return `<html>
    <body>
        <h1 align="center" style="font-size: ${titleSize}vw">${title}</h1>
        <h2 align="center" style="font-size: ${authorSize}vw">${author}</h2>
        <p>
            ${body.map(line => `<div align="center" style="font-size: ${bodySize}vw">${line}</div>`).join('\n')}
        </p>
      </body>
</html>`};

app.get('/', (req, res) => res.send("Please use /tangshi for 唐诗，/songci for 宋词, /shijing for 诗经"));

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
