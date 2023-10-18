/*
 * Here we explore how to `read` and `write` data to the database.
 * We will use the `Question` model we created in the previous snippet.
 * 
 * How to run this example:
 * > node 03_model_instances.js
 */

// Imports
import Sequelize from 'sequelize';

// Connect to a sqlite database.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define a model. This will represent a quiz question in our application.
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

// Add a question row to the database --------------------------------------------------
let question = Question.build({
    title: 'Capital of France',
    body: 'What is the capital of France?',
    answer: 'Paris'
});
// At this point, the question is not saved to the database yet.
console.log(question);

// Save the question to the database
await question.save();

// The .create method is a shortcut for the above two steps
let question2 = await Question.create({
    title: 'Capital of Italy',
    body: 'What is the capital of Italy?',
    answer: 'Rome'
})

// Get all the rows from the database --------------------------------------------------
Question.findAll()
    .then(questions => {
        console.log('All questions:', JSON.stringify(questions, null, 4));
    })
    .catch(err => console.log('Error getting questions:', err));

// Updating a row ----------------------------------------------------------------------
question.answer = 'Pariz';
// At this point, the question is not updated in the database yet.
await question.save();

// The .update method is a shortcut for the above two steps
await question2.update({
    answer: 'Roma'
});

// Deleting a row ----------------------------------------------------------------------
await question.destroy();
await question2.destroy();