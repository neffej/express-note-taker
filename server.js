const express = require('express');
const fs = require('fs');
const path = require ('path');
const db = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req,res) => res.json(db));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request receieved to add a note`)

    const { title, text } = req.body;
    const id = Math.floor(Math.random()*99)+1

    if(title && text){
        const newNote = {
            title,
            text,
            id,
        };

        const noteString = JSON.stringify(newNote);
        const noteHolder = fs.readFileSync('./db/db.json')

        console.log(db.length)

        if (db.length === 0){
            fs.writeFileSync('./db/db.json', noteString)
        }else {
            const json = JSON.parse(noteHolder.toString())

            json.push(newNote);
            const newJSON = JSON.stringify(json)

            fs.writeFileSync('./db/db.json', newJSON)
        }

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log (response);
        res.status(201).json(response);
    }else{
        res.status(500).json('Error - please include text and a title in your note');
    }
});

app.listen(PORT, ()=> {
    console.log(`App listening at http://localhost:${PORT}`);
});