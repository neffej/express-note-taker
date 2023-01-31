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

app.get('/api/notes', (req,res) => 
    fs.readFile('./db/db.json', 'utf-8',(err, data) => {
    if (err) {
        console.error(err);
    }else{
        const parsedData = JSON.parse(data);
    res.json(parsedData);
    }}
    ));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request receieved to add a note`)

    const { title, text } = req.body;
    const id = Math.floor(Math.random()*99)+1

    if(title && text){
        const newNote = {title, text, id};

    fs.readFile('./db/db.json', 'utf-8',(err, data) =>{
        if (err) {
            console.error(err);
        }else{
            // Convert string
            const parsedNotes = JSON.parse(data);

            // Add note
            parsedNotes.push(newNote)

            // Rewrite file
            fs.writeFile('./db/db.json',
            JSON.stringify(parsedNotes, null, 4), 
            (writeErr) =>
            writeErr
            ? console.error(writeErr)
            : console.log('Successfully updated reviews!')
            );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };
    
    res.status(201).json(response);
    }else{
        res.status(500).json('Error in saving note');
    }
});



app.listen(PORT, ()=> {
    console.log(`App listening at http://localhost:${PORT}`);
});