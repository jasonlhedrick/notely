const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dbSetup = require('./database/setup');

/* PG Config */
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

function verifyJWT(token) {
    return jwt.verify(token, process.env.JWTSECRET);
}

function signJWT(id) {
    return jwt.sign({id: id}, process.env.JWTSECRET, {expiresIn: '30d'} );
}

async function insertUser(user) {
    const query = 'INSERT INTO users(username, hash) VALUES($1, $2)';
    try {
        return pool.query(query, [user.username, user.hash])
        .catch(err => {
            console.log(err);
        });
    }
    catch {
        console.log('error inserting user');
    }
}

function getUserByID(id) {
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, results) => {
        if(err) {
            throw err;
        }
        else {
            console.log(results.rows[0]);
            return results.rows[0];
        }
    });
}

async function getUserByUsername(username) {
    try {
        return await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    }
    catch {
        console.log('error');
    }
}

async function postNote(note) {
    const user_id = 1;
    const query = 'INSERT INTO notes(user_id, title, body) VALUES($1, $2, $3)';
    try {
        return await pool.query(query, [user_id, note[0], note[1]]);
    }
    catch {
        console.log('error posting note.');
    }
} 

async function getNote(noteID, userID) {
    const query = 'SELECT * FROM notes WHERE note_id = $1 AND user_id = $2';
    try {
        return await pool.query(query, [noteID, userID]);
    }
    catch {
        console.log('error getting note');
    }
}

async function getNotesByUserID(userID) {
    const query = 'SELECT * FROM notes WHERE user_id = $1';
    try {
        return await pool.query(query, [userID]);
    }
    catch {
        console.log('error getting all notes by user_id');
    }
}

async function addUser(user, req, res) {
    const newUser = {username: user.username, hash: ''};
    bcrypt.hash(user.password, 12)
    .then(res => {
        newUser.hash = res;
        return insertUser(newUser);
    })
    .catch(err => {
        console.log(err);
    });
}

/* Testing */

/* To drop and then re-create a table for testing purposes. */

/*
dbSetup.dropTable('users')
.then(response => {
    dbSetup.createUsersTable()
    .then(response => {
        console.log('Users table created.');
    });
});
*/

/* End Testing */

/* Express Config */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Temporarily allow all CORS connections.
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Server is listening.'});
});

app.post('/notes', (req, res) => {
    const {noteTitle, noteBody} = req.body;
    postNote([noteTitle, noteBody])
    .then(response => {
        res.status(200).json({'message': response});
    })
    .catch(error => {
        res.status(501).json({'error': error});
    });  
});


app.listen(process.env.PORT, () => {
    console.log(`App listening on port: ${process.env.PORT}`);
});
