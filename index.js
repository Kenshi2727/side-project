import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

//obfuscated code---------------->
// const _0xbf863 = _0x20cf; function _0x20cf(_0x546157, _0x446220) { const _0x52b84b = _0x52b8(); return _0x20cf = function (_0x20cf32, _0x401d07) { _0x20cf32 = _0x20cf32 - 0xeb; let _0x1924b3 = _0x52b84b[_0x20cf32]; return _0x1924b3; }, _0x20cf(_0x546157, _0x446220); } (function (_0x1003ab, _0x51dceb) { const _0x5168fc = _0x20cf, _0x53172e = _0x1003ab(); while (!![]) { try { const _0x25599b = parseInt(_0x5168fc(0xf0)) / 0x1 + parseInt(_0x5168fc(0xf1)) / 0x2 * (parseInt(_0x5168fc(0xf5)) / 0x3) + -parseInt(_0x5168fc(0xf7)) / 0x4 + -parseInt(_0x5168fc(0xeb)) / 0x5 * (parseInt(_0x5168fc(0xed)) / 0x6) + parseInt(_0x5168fc(0xf4)) / 0x7 + -parseInt(_0x5168fc(0xec)) / 0x8 + parseInt(_0x5168fc(0xef)) / 0x9; if (_0x25599b === _0x51dceb) break; else _0x53172e['push'](_0x53172e['shift']()); } catch (_0x246605) { _0x53172e['push'](_0x53172e['shift']()); } } }(_0x52b8, 0x70814)); function _0x52b8() { const _0x4e08a2 = ['postgres', '4218534OxZEsL', '659633RzlfnF', '8lwkrCq', 'KFtmdTNBHJsLftNwkiqyHXtfhDkTUXRX', 'autorack.proxy.rlwy.net', '1401344dvlZsM', '218793FLqrVz', 'Client', '2553532MRgIuy', '1068270muFrsz', '750112YHwUsq', '12BIUboA']; _0x52b8 = function () { return _0x4e08a2; }; return _0x52b8(); } const db = new pg[(_0xbf863(0xf6))]({ 'user': _0xbf863(0xee), 'host': _0xbf863(0xf3), 'database': 'railway', 'password': _0xbf863(0xf2), 'port': 0x87dc });

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

