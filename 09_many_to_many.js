/*
 * And finally the many to many relationship. In this case model A has many model B and
 * model B has many model A.
 * 
 * In our example a Question has many Tags and a Tag has many Questions.
 * 
 * How to run this example:
 * > node 09_many_to_many.js <options>
 * Where <options> is one of:
 * `--create` :: Create the tables in the database.
 * `--drop`   :: Drop the tables from the database. Helps with cleanup between runs.
 * `--add`    :: Add some data to the tables. Also demo how instances are created.
 * `--query`  :: Demo how instances are queried.
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

// Define the Tag model.
// A tag has a tagName field that's all.
const Tag = sequelize.define('Tag', {
    tagName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,                 // Unique constraint
    }
}, {});

// Define the relationship between Question and Tag. 
// 1. A question has many tags.
// 2. A tag has many questions.

// Note: the association table `QuestionTab` is created automatically.
Question.belongsToMany(Tag, { through: 'QuestionTag' });
Tag.belongsToMany(Question, { through: 'QuestionTag' });

// Add some data to the tables
async function addData() {
    // Create a question
    let question = await Question.create({
        title: 'Capital of France',
        body: 'What is the capital of France?',
        answer: 'Paris'
    });

    // Create some tags
    let tag1 = await Tag.create({ tagName: 'Geography' });
    let tag2 = await Tag.create({ tagName: 'History' });

    // Associate the tags with the question
    await question.addTag(tag1);
    await question.addTag(tag2);

    // Save the question and tags to the database
    await question.save();
}

// Querying
async function query() {

    // Get a question
    let question = await Question.findOne({
        where: {
            title: 'Capital of France'
        }
    });
    console.log('Question:', JSON.stringify(question, null, 4));

    // Get tags associated with the question
    let tags = await question.getTags();
    console.log('Tags:', JSON.stringify(tags, null, 4));
}

// Querying - Eager loading
async function eager() {

    // Get a question
    let question = await Question.findOne({
        where: {
            title: 'Capital of France'
        },
        include: [Tag]
    });
    console.log('Question:', JSON.stringify(question, null, 4));

}

// Run the program
if (process.argv.includes('--create')) {
    await sequelize.sync({
        force: true,
        logging: console.log,
    });
} else if (process.argv.includes('--drop')) {
    await sequelize.drop({
        logging: console.log,
    });
} else if (process.argv.includes('--add')) {
    console.log('Adding data to the tables...');
    await addData();
} else if (process.argv.includes('--query')) {
    console.log('Querying the tables...');
    await query();
} else if (process.argv.includes('--eager')) {
    console.log('Eager loading the tables...');
    await eager();
} else {
    console.log('No options or wrong options were specified. Exiting.');
    process.exit(0);
}
