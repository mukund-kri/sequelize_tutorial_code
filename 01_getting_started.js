/*
 * The hello world of sequelize. Here we connect to the database and validate the
 * connection by logging the result to the console.
 * That's it! in subsequent examples we will see how to create tables, insert data,
 * and query data.
 * 
 * How to run this example:
 * > node 01_getting_started.js
 */

// Imports
const Sequelize = require('sequelize');

// Connect to a sqlite database. 
// The database is created in the file `database.sqlite` in the current folder.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Test the connection by logging the result
sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
