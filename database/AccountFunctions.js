const pool = require('./config');

async function insertUser(user) {
    const query = 'INSERT INTO users(username, hash) VALUES($1, $2)';

    try {
        return await pool.query(query, [user.username, user.hash])
        .catch(err => {
            console.log(`Inserting user had an error of ${err}`);
        });
    }
    catch {
        console.log('Error inserting new user into users table.');
    }
}

async function getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
        await pool.query(query, [username])
        .then(response => {
            return response;
        })
        .catch( error => {
            return error;
        });
    }
    catch {
        console.log('Error getting user by username from users table.');
    }
}

module.exports = {
    insertUser,
    getUserByUsername,
};