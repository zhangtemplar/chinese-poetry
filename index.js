const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


const port = 3000;

const formatBody = (title, author, body) => `<html>
    <body>
        <h1 align="center">${title}</h1>
        <h2 align="center">${author}</h2>
        ${body}
      </body>
</html>`;

app.get('/', (req, res) => res.send("Please use /tangshi for 唐诗，/songci for 宋词, /shijing for 诗经"));

app.get('/tangshi', (req, res) => {
  const directoryName = path.join(__dirname, 'json');
  fs.readdir(directoryName, (err, files) => {
    if (err) {
      res.status(500).end();
      return;
    }
    // randomly choose a file
    const file = files.filter(f => f.startsWith("poet."))[
        Math.floor(Math.random() * files.length)];
    const poetries = JSON.parse(fs.readFileSync(path.join(directoryName, file)));
    const poetry = poetries[Math.floor(Math.random() * poetries.length)];
    // Render the poetry
    const content = poetry.paragraphs.map(line => `<p align="center">${line}</p>`).join('\n');
    res.send(formatBody(poetry.title, poetry.author, content));
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
    const file = files.filter(f => f.startsWith("ci.song"))[
        Math.floor(Math.random() * files.length)];
    const poetries = JSON.parse(fs.readFileSync(path.join(directoryName, file)));
    const poetry = poetries[Math.floor(Math.random() * poetries.length)];
    // Render the poetry
    const content = poetry.paragraphs.map(line => `<p align="center">${line}</p>`).join('\n');
    res.send(formatBody(poetry.rhythmic, poetry.author, content));
  });
});

app.get('/shijing', (req, res) => {
  const file = path.join(__dirname, 'shijing', 'shijing.json');
  const poetries = JSON.parse(fs.readFileSync(file));
  const poetry = poetries[Math.floor(Math.random() * poetries.length)];
  // Render the poetry
  const content = poetry.content.map(line => `<p align="center">${line}</p>`).join('\n');
  res.send(formatBody(poetry.title, `${poetry.chapter}-${poetry.section}`, content));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
