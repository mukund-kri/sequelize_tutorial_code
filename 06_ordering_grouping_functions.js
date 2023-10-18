/*
 * This file contains examples of basic ordering, grouping and functions in Sequelize.
 * 
 * How to run this example:
 * > node 06_ordering_grouping_functions.js
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
    title: "Which continent does the country 'Algeria' belong to?",
    body: null,
    answer: 'Africa'
}, {
    title: "Which continent does the country 'Angola' belong to?",
    body: null,
    answer: 'Africa'
}, {
    title: "Which continent does the country 'Botswana' belong to?",
    body: null,
    answer: 'Africa'
}, {
    title: "Which continent does the country 'India' belong to?",
    body: null,
    answer: 'Asia'
}, {
    title: "Which continent does the country 'Japan' belong to?",
    body: null,
    answer: 'Asia'
}]);

// Simple ordering ---------------------------------------------------------------------
// Get all the rows from the database, ordered by answer
let allQuestionsOrdered = await Question.findAll({
    order: [
        ['answer', 'ASC']
    ]
});
console.log('All questions ordered by answer:', JSON.stringify(allQuestionsOrdered, null, 4));

// Count
// Get the number of questions in the database
let questionCount = await Question.count();

// count with where clause
// Get the number of questions in the database that have the word 'capital' in the title
let questionCountWithWhere = await Question.count({
    where: {
        title: {
            [Sequelize.Op.like]: '%capital%'
        }
    }
});
console.log('Number of questions with the word "capital" in the title:', questionCountWithWhere);

// Find the question with the longest body
let questionWithLongestBody = await Question.findOne({
    order: [
        [sequelize.fn('length', sequelize.col('body')), 'DESC']
    ]
});
console.log('Question with the longest body:', JSON.stringify(questionWithLongestBody, null, 4));

// GROUPING ----------------------------------------------------------------------------
// Counts grouped by answer
let countsGroupedByAnswer = await Question.findAll({
    attributes: ['answer', [sequelize.fn('COUNT', sequelize.col('answer')), 'count']],
    group: ['answer']
});
console.log('Counts grouped by answer:', JSON.stringify(countsGroupedByAnswer, null, 4));

// Delete all the rows from the database for cleanup
await Question.destroy({
    where: {}
});