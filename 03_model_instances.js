/*
 * Here we explore how to `read` and `write` data to the database.
 * We will use the `Question` model we created in the previous snippet.
 */

// Imports
const Sequelize = require('sequelize');

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
question.save()
    .then(() => console.log('Question saved successfully'))
    .catch(err => console.log('Error saving question:', err));

// The .create method is a shortcut for the above two steps
Question.create({
    title: 'Capital of Italy',
    body: 'What is the capital of Italy?',
    answer: 'Rome'
})
    .then((q2) => {
        console.log('Question saved successfully');
        console.log(q2);
    })
    .catch(err => console.log('Error saving question:', err));


// Updating a row ----------------------------------------------------------------------
question.answer = 'Pariz';
// At this point, the question is not updated in the database yet.
question.save()
    .then(() => console.log('Question updated successfully'))
    .catch(err => console.log('Error updating question:', err));

// Deleting a row ----------------------------------------------------------------------
question.destroy()
    .then(() => console.log('Question deleted successfully'))
    .catch(err => console.log('Error deleting question:', err));
