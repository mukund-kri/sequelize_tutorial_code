/*
 * Manged transactions in sequelize. 
 * This example is exaclty the same as `10_unmanaged_transactions.js` except that
 * the manged transaction API is used.
 * 
 * To run this example, use:
 * > node 11_managed_transactions.js <options>
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
    sequelize.transaction(async (transaction) => {
        // Define and save "Bart Simpson"
        let bart = await Character.create({
            firstName: 'Bart',
            lastName: 'Simpson'
        }, { transaction });

        // Define and save "Lisa Simpson" with an error. This will rollback the
        // transaction because of `transaction.rollback()` in the catch block.
        let lisa = await Character.create({
            firstName: 'Lisa',
        }, { transaction });

        // Define relationship between Bart and Lisa
        await bart.setSibling(lisa, { transaction });
    })
        .then(() => {
            console.log("Transaction succeeded.");
        })
        .catch((err) => {
            console.log("A error occurred while creating the transaction:", err);
            console.log("Rolling back the transaction.");
        })

}

// Example of a transaction that succeeds.
async function transactionSuccess() {
    sequelize.transaction(async (transaction) => {
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
    })
        .then(() => {
            console.log("Transaction succeeded.");
        })
        .catch((err) => {
            console.log("A error occurred while creating the transaction:", err);
            console.log("Rolling back the transaction.");
        })
}

// Boilerplate to run the examples
if (process.argv.includes('--create')) {
    sequelize.sync({ force: true })
        .then(() => {
            console.log("Database & tables created!");
        });
} else if (process.argv.includes('--delete')) {
    sequelize.drop()
        .then(() => {
            console.log("Database & tables deleted!");
        });
} else if (process.argv.includes('--fail')) {
    console.log("Running transaction that fails.");
    transactionFail();
} else if (process.argv.includes('--success')) {
    console.log("Running transaction that succeeds.");
    transactionSuccess();
} else {
    console.log("No action specified.");
}