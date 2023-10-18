/*
 * Now we start exploring the model. We will start with the basics.
 * We will create a model and see how the model mirrors the database table.
 * 
 * How to run this example:
 * > node 02_model_basics.js <options>
 * Where <options> is one of:
 * `create` :: Create the table in the database.
 * `drop`   :: Drop the table from the database. Helps with cleanup between runs.
 */

// Imports
const Sequelize = require('sequelize');

// Connect to a sqlite database.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define a model. This will represent a quiz question in our application.
// The following is the syntax for defining a model:
// - we use the `sequelize.define` method to define a model
// - the first argument is the name of the model
// - it has 3 fields (which corresponds to the columns in the table) title, body, answer
// - the type of each field also HAS to be specified
// - the fields also allow for column options, such as `allowNull` and `defaultValue`
const Question = sequelize.define('Question', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    answer: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    // Other model options go here. We have none at the moment
});


// Code to manage the actual table in the database

if (process.argv.length != 3) {
    console.log('Usage: node 02_model_basics.js [create|drop]');
    process.exit(1);
}

let command = process.argv[2];

if (command == 'create') {
    // Create the table in the database
    Question.sync({ force: true })
        .then(() => console.log('Table created successfully'))
        .catch(err => console.log('Error creating table:', err));
} else if (command == 'drop') {
    // Drop the table from the database
    Question.drop()
        .then(() => console.log('Table dropped successfully'))
        .catch(err => console.log('Error dropping table:', err));
} else {
    console.log('Unknown command:', command);
    process.exit(1);
}