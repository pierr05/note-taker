const express = require('express'); 
const path = require('path');
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '/public/assets/index.html'));
})

app.get('/notes', (req, res) => {
res.sendFile(path.join(__dirname, '/public/assets/notes.html'));
}) 

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    res.json(JSON.parse(data));
  })
})

app.post('/api/notes', (req, res) => {

  const {title, text} = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
      id: uuid()
    }; 
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err)

      } else {
        const parsedNotes = JSON.parse(data)

        parsedNotes.push(newNotes)

        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 5), (writeErr) => {
          if (writeErr) {
            console.log(writeErr)

          } else {
            console.log("Note successfully added")
            res.json(newNotes)
          }
        })
      }
    }) 
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteNoteId = req.params.id;
  fs.readFile('./db/db.json', (err, data) => {
    const arrNotes = data;

    for(let i = 0; i < arrNotes.length; i++) {
      const currentNote = arrNotes[i];
      
      if (deleteNoteId === currentNote.id) {
        arrNotes.splice(currentNote.id, 1);
      }
    }
  })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);