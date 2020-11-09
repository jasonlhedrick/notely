const dbSetup = require('./database/setup');
const pool = require('./database/config');

dbSetup.dropTable('users')
.then(response => {
    console.log(response);
});

dbSetup.createUsersTable()
.then(response => {
    console.log(response);
});

pool.query('SELECT * FROM users')
.then(response => {
    console.log(response);
})
.catch(error => {
    console.log(error);
});