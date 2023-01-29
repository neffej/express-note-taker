const express = require('express');
const path = require ('path');
const db = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/notes', (req,res) => res.json(db));

app.listen(PORT, ()=> {
    console.log(`App listening at http://localhost:${PORT}`);
});