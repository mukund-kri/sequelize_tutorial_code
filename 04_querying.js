/*
 * Let's explore querying with Sequelize a little more.
 * 
 * How to run this code:
 * > node 04_querying.js <options>
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

// Get all the rows from the database --------------------------------------------------
let allQuestions = await Question.findAll();
console.log('All questions:', JSON.stringify(allQuestions, null, 4));

// ATTRIBUTES --------------------------------------------------------------------------
// Get only the title and body of the questions
let questionsWithAttributes = await Question.findAll({
    attributes: ['title', 'body']
});
console.log('Questions with attributes:', JSON.stringify(questionsWithAttributes, null, 4));

// Attributes with aliases
// Here we rename the body attribute to question. This done with nested arrays.
let questionsWithAliases = await Question.findAll({
    attributes: ['title', ['body', 'question']]
});
console.log('Questions with aliases:', JSON.stringify(questionsWithAliases, null, 4));

// Attributes with functions
// Here we use the sequelize.fn function to call the upper function on the title attribute.
let questionsWithFunctions = await Question.findAll({
    attributes: ['title', [sequelize.fn('upper', sequelize.col('title')), 'upperTitle']]
});
console.log('Questions with functions:', JSON.stringify(questionsWithFunctions, null, 4));

// WHERE CLAUSE ------------------------------------------------------------------------

// The most common case :: get by id
let questionById = await Question.findAll({
    where: {
        id: 1
    }
});
console.log('Question by id:', JSON.stringify(questionById, null, 4));

// Get only the questions with the title 'Capital of France'
let questionsWithWhere = await Question.findAll({
    where: {
        title: 'Capital of France'
    }
});
console.log('Questions with where:', JSON.stringify(questionsWithWhere, null, 4));

// If specify multiple where clauses, they are implicitly combined with AND
let questionsWithMultipleWhere = await Question.findAll({
    where: {
        title: 'Capital of France',
        answer: 'Paris'
    }
});
console.log('Questions with multiple where:', JSON.stringify(questionsWithMultipleWhere, null, 4));


// OPERATORS ---------------------------------------------------------------------------
// Operators are used to specify more complex where clauses.
// And is is used to specify multiple where clauses.
let questionsWithAnd = await Question.findAll({
    where: {
        [Sequelize.Op.and]: [
            { title: 'Capital of France' },
            { answer: 'Paris' }
        ]
    }
});
console.log('Questions with and:', JSON.stringify(questionsWithAnd, null, 4));

// Or is used to specify multiple where clauses.
let questionsWithOr = await Question.findAll({
    where: {
        [Sequelize.Op.or]: [
            { title: 'Capital of France' },
            { answer: 'Paris' }
        ]
    }
});
console.log('Questions with or:', JSON.stringify(questionsWithOr, null, 4));

// One more example with like
let questionsWithLike = await Question.findAll({
    where: {
        title: {
            [Sequelize.Op.like]: '%France%'
        }
    }
});
console.log('Questions with like:', JSON.stringify(questionsWithLike, null, 4));


// Delete all the rows from the database for cleanup
await Question.destroy({
    where: {}
});