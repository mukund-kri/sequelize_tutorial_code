/*
 * Basics of transactions in sequelize.
 * Starting of with unmanaged transactions. Here the commit and rollback is done
 * manually by the programmer.
 * 
 * This example is adapted from the official sequelize documentation.
 * 
 * How to run this example:
 * > node 10_unmanaged_transactions.js <options>
 * Where <options> is one of:
 * `--create`  :: Create the tables in the database.
 * `--delete`  :: Drop the tables from the database. Helps with cleanup between runs.
 * `--fail`    :: Run the example where the transaction fails.
 * `--success` :: Run the example where the transaction succeeds.
 */


// Imports
import Sequelize from 'sequelize';
import assert from 'assert';

// Make the connection to the database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define the Character model.
const Character = sequelize.define('Character', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {});

// Define a self referencing relationship on the Character model.
// A character can have a sibling.
// Assuming that a character can have only one sibling. Makes no sense in the real world
// but makes the example simpler.
Character.belongsTo(Character, { as: 'sibling' });

// Example of a transaction that fails. The character is created but the transaction is
// rolled back when adding the sibling errors out.
async function transactionFail() {

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Define and save "Bart Simpson"
        let bart = await Character.create({
            firstName: 'Bart',
            lastName: 'Simpson'
        }, { transaction });    // get save to db (in transaction)

        // Define and save "Lisa Simpson" with an error. This will rollback the\
        // transaction because of `transaction.rollback()` in the catch block.
        let lisa = await Character.create({
            firstName: 'Lisa',
        }, { transaction });    // fails. lastName is required

        // Define relationship between Bart and Lisa
        bart.setSibling(lisa, { transaction });

        // if all is well up to this point, commit the transaction
        await transaction.commit();
    } catch (err) {

        console.log(err);
        // if there are any errors, rollback the transaction
        // all db operations the try block are undone
        await transaction.rollback();
    }

    // Assert that Bart and Lisa are not in the database
    let bart = await Character.findOne({
        where: {
            firstName: 'Bart'
        }
    });
    assert(bart == null, 'Bart should not be in the database');
}


// Example of a transaction that succeeds. The character is created and the transaction
// is committed.
async function transactionSuccess() {
    // start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Define and save "Bart Simpson"
        let bart = await Character.create({
            firstName: 'Bart',
            lastName: 'Simpson'
        }, { transaction });

        // Define and save "Lisa Simpson"
        let lisa = await Character.create({
            firstName: 'Lisa',
            lastName: 'Simpson'
        }, { transaction });

        // Define relationship between Bart and Lisa
        await bart.setSibling(lisa, { transaction });

        // if all is well up to this point, commit the transaction
        await transaction.commit();
    } catch (err) {

        console.log(err);
        // if there are any errors, rollback the transaction
        await transaction.rollback();
    }

    // Assert that Bart and Lisa are in the database
    let bart = await Character.findOne({
        where: {
            firstName: 'Bart'
        }
    });
    assert(bart != null, 'Bart should be in the database');

    let lisa = await Character.findOne({
        where: {
            firstName: 'Lisa'
        }
    });
    assert(lisa != null, 'Lisa should be in the database');
}



// Code to run the example.
if (process.argv.includes('--create')) {
    await sequelize.sync({
        force: true,
        logging: console.log
    });
} else if (process.argv.includes('--delete')) {
    await sequelize.drop({
        logging: console.log
    });
} else if (process.argv.includes('--fail')) {
    console.log('Adding data to the tables');
    transactionFail();
} else if (process.argv.includes('--success')) {
    console.log('This time the transaction will succeed');
    transactionSuccess();
} else {
    console.log('Please specify an option');
}


