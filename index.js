import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book-notes",
    password: "spiralhelix27",
    port: 5432
})

db.connect();

let title = '';
let note = '';
let id = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM  books")
        const data = result.rows
        console.log(data);
        res.render('index.ejs', { data: data });
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

app.get('/add', (req, res) => {
    res.render('add.ejs');
});

app.post('/add', async (req, res) => {
    title = req.body['new-title'];
    note = req.body['new-note'];
    console.log(title);
    console.log(note);

    try {
        await db.query("INSERT INTO books(title,note) VALUES($1,$2)", [title, note]);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/');
});

app.post('/edit', (req, res) => {
    if (req.body['data-title'] && req.body['data-note']) {
        console.log(req.body['data-title']);
        console.log(req.body['data-note']);
        id = req.body['data-id'];
        res.render('edit.ejs',
            {
                title: req.body['data-title'],
                note: req.body['data-note']
            });
    }
    else {
        res.redirect('/');
    }
})

app.post('/edit-note', async (req, res) => {
    const newTitle = req.body['new-title'];
    const newNote = req.body['new-note'];
    try {
        await db.query("UPDATE books SET title=$1,note=$2 WHERE id=$3", [newTitle, newNote, id]);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/');
});

app.post('/delete', async (req, res) => {
    try {
        await db.query("DELETE FROM books WHERE id=$1", [req.body['delete-id']]);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/');
})
app.listen(port, () => console.log(`Server is running on port ${port}`));

