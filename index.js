import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "autorack.proxy.rlwy.net",
    database: "railways",
    password: "KFtmdTNBHJsLftNwkiqyHXtfhDkTUXRX",
    port: 34780
})

db.connect();

let title = '';
let note = '';
let id = 0;
let alertStatus = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM  books")
        const data = result.rows
        // console.log(data);
        res.render('index.ejs',
            {
                data: data,
                alertStatus: alertStatus
            });
        alertStatus = 0;
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
    if (title !== '' && note !== '') {
        try {
            await db.query("INSERT INTO books(title,note) VALUES($1,$2)", [title, note]);
        }
        catch (err) {
            console.log(err);
        }
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
    if (newTitle !== '' && newNote !== '') {
        try {
            await db.query("UPDATE books SET title=$1,note=$2 WHERE id=$3", [newTitle, newNote, id]);
        }
        catch (err) {
            console.log(err);
        }
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

app.post('/search', async (req, res) => {
    const searchTerm = `%${req.body.search}%`;
    try {
        const result = await db.query("SELECT title,note FROM books WHERE title ILIKE $1 OR note ILIKE $1", [searchTerm]);
        console.log("search-------->", result);
        const data = result.rows;
        const title = data[0].title;
        const note = data[0].note;
        res.render('edit.ejs',
            {
                title: title,
                note: note
            });
    }
    catch (err) {
        console.log(err);
        alertStatus = 1;
        res.redirect('/');
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

