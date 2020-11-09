const pool = require('./config');

async function dropTable(table) {
    // Unsafe query for administrative use only!
    // Unescaped and unchecked use of a variable within an SQL query
    const query = `DROP TABLE ${table}`;
    await pool.query(query)
    .then(response => {
        console.log('Then in drop table');
        console.log(response);
        return response;
    })
    .catch(error => {
        return error;
    });
}

async function createUsersTable() {
    const query = 'CREATE TABLE users(user_id INTEGER PRIMARY KEY, username TEXT, hash TEXT)';
    try {
        pool.query(query)
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(error => {
            return error;
        });
    }
    catch {
        console.log('Failed to create a new users table.');
    }
}

module.exports = {
    dropTable,
    createUsersTable,
};