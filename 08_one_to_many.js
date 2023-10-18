/*
 * Let's explore the most common type of relationship between two models: a one-to-many
 * relationship.
 * 
 * How to run this code:
 * > node 08_one_to_many.js <options>
 *   Where <options> is one of:
 *   `--create` :: Create the tables in the database.
 *   `--drop`   :: Drop the tables from the database. Helps with cleanup between runs.
 *   `--add`    :: Add some data to the tables. Also demo how instances are created.
 *   `--query`  :: Demo how instances are queried.
 */

// Import Sequelize
import Sequelize from 'sequelize';

// Make the connection to the database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define the Question model.
// A question has a title, body and answer.
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
}, {});

// Define the Option model.
// An option has a title and is correct or incorrect.
const Option = sequelize.define('Option', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, {});

// Define the relationship between Question and Option. A question has many options. An
// option belongs to a question. Hence, we say that the relationship is one-to-many.
Question.hasMany(Option);
Option.belongsTo(Question);

// Add some data to the tables
async function addData() {
    // Create a question
    let question = await Question.create({
        title: 'Capital of France',
        body: 'What is the capital of France?',
        answer: 'Paris'
    });

    // Create some options
    let options = await Option.bulkCreate([{
        title: 'London',
        correct: false
    }, {
        title: 'Paris',
        correct: true
    }, {
        title: 'New York',
        correct: false
    }, {
        title: 'San Francisco',
        correct: false
    }]);

    // Associate the options with the question
    await question.setOptions(options);
}


// Querying - Lazy loading
async function query() {
    let question = await Question.findOne({
        where: {
            title: 'Capital of France'
        }
    });

    // print the question
    console.log('Question:', JSON.stringify(question, null, 4));

    // Note the associated options are not retrieved by default. We need to explicitly
    // ask for them.
    let options = await question.getOptions();
    console.log('Options:', JSON.stringify(options, null, 4));

    // We can also traverse the relationship in the other direction.
    let option = await Option.findOne({
        where: {
            title: 'Paris'
        }
    });
    // Now let's get the question associated with the option
    let question2 = await option.getQuestion();
    console.log('Question associated with Paris:', JSON.stringify(question2, null, 4));

};

// Querying - Eager loading
async function eager() {
    let question = await Question.findOne({
        where: {
            title: 'Capital of France'
        },
        include: [Option]
    });

    // print the question
    console.log('Question:', JSON.stringify(question, null, 4));

    // Traverse the relationship in the other direction.
    let option = await Option.findOne({
        where: {
            title: 'Paris'
        },
        include: [Question]
    });
    console.log('Option:', JSON.stringify(option, null, 4));
}

// command line options to ease running the code
if (process.argv.includes('--create')) {
    await sequelize.sync({
        force: true,
        logging: console.log,
    });
} else if (process.argv.includes('--drop')) {
    await sequelize.drop();
} else if (process.argv.includes('--add')) {
    await addData();
} else if (process.argv.includes('--query')) {
    await query();
} else if (process.argv.includes('--eager')) {
    await eager();
}