/*
 * Finders, other than `findAll`.
 * Here we will see how to use `findByPk`, `findOne`, `findOrCreate` finders which are
 * lesser used alternatives to `findAll`.
 * 
 * How to run this example:
 * > node 05_finders.js
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

// Bulk add questions to the database --------------------------------------------------
let questions = await Question.bulkCreate([{
    title: 'Capital of France',
    body: 'What is the capital of France?',
    answer: 'Paris'
}, {
    title: 'Capital of Italy',
    body: 'What is the capital of Italy?',
    answer: 'Rome'
}, {
    title: 'Capital of Spain',
    body: 'What is the capital of Spain?',
    answer: 'Madrid'
}, {
    title: 'Capital of Portugal',
    body: 'What is the capital of Portugal?',
    answer: 'Lisbon'
}, {
    title: 'Capital of Germany',
    body: 'What is the capital of Germany?',
    answer: 'Berlin'
}]);

// `findAll` ---------------------------------------------------------------------------
// Get all the rows from the database
let allQuestions = await Question.findAll();
console.log('All questions:', JSON.stringify(allQuestions, null, 4));

// `findByPk` --------------------------------------------------------------------------
// Get a question by its primary key
let questionById = await Question.findByPk(1);
if (questionById) {
    console.log('Question with id 1:', JSON.stringify(questionById, null, 4));
} else {
    console.log('Question with id 1 not found');
}

// `findOne` ---------------------------------------------------------------------------
// Get a question by some other attribute
let questionByTitle = await Question.findOne({
    where: {
        title: 'Capital of France'
    }
});
if (questionByTitle) {
    console.log('Question with title "Capital of France":', JSON.stringify(questionByTitle, null, 4));
} else {
    console.log('Question with title "Capital of France" not found');
};

// `findOrCreate` ----------------------------------------------------------------------
// Get a question by some other attribute, or create it if it doesn't exist
let [question, created] = await Question.findOrCreate({
    where: {
        title: 'Capital of Poland'
    },
    defaults: {
        body: 'What is the capital of Poland?',
        answer: 'Warsaw'
    }
});
if (created) {
    console.log('Question created:', JSON.stringify(question, null, 4));
} else {
    console.log('Question found:', JSON.stringify(question, null, 4));
};


// Delete all the rows from the database for cleanup
await Question.destroy({
    where: {}
});