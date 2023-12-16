/*
 * Data validation in sequelize.
 * In this example we'll be doing 3 types of validation on the User model.
 * 1. Using the built in validators.
 * 2. Using custom validators.
 * 3. Using model level validation.
 * 
 * How to run this example:
 * Where <options> is one of:
 * `--create` :: Create the tables in the database.
 * `--drop`   :: Drop the tables from the database. Helps with cleanup between runs.
 * `--fail-built-in` :: Run the example where the built in validators fail.
 * `--fail-custom`   :: Run the example where the custom validators fail.
 * `--fail-model`    :: Run the example where the model level validators fail.
 * `--success`       :: Run the example where all validators pass.
 */

// Imports
import Sequelize from 'sequelize';
import assert from 'assert';

// Make the connection to the database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define the User model.
const User = sequelize.define('User', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,             // Don't allow empty strings
            len: [2, 50]                // Only allow values with length between 2 and 50
        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,             // Don't allow empty strings
            len: [2, 50],               // Only allow values with length between 2 and 50

            // custom validator
            isPalindrome(value) {
                if (value !== value.split('').reverse().join('')) {
                    throw new Error('Only palindromes are allowed!');
                }
            }
        },


    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true               // Only allow valid emails
        }
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,                // Only allow integers
            min: 18,                    // Only allow values >= 18
            max: 100                    // Only allow values <= 100
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // This is bit absurd but it's just an example.
    confirmPassword: {
        type: Sequelize.STRING,
        allowNull: false,

    }
}, {
    validate: {
        isConfirmPasswordSame() {
            if (this.password !== this.confirmPassword) {
                throw new Error("Passwords do not match.");
            }
        }
    }
});

async function failBuiltIn() {

    // Create a user with invalid data.
    let user = await User.create({
        firstName: 'J',
        lastName: 'D',
        email: 'falseid',
        age: 10,
    });

    // Try to save the user to the database.
    try {
        await user.save();
    } catch (err) {
        // you'll see a whole bunch of errors here.
        console.log("Error saving user:", err.message);
    }
}

// All builtin validators pass. The custom validator isPalindrom fails.
async function failCustom() {

    // Create user with valid data.
    let user = await User.create({
        firstName: 'John',
        lastName: 'Doe',                // The only problem is here. 'Doe' is not a palindrome.
        email: 'john.doe@example.com',
        age: 20,
        password: 'password123!',
        confirmPassword: 'password123!'
    });

    // Try to save the user to the database.
    try {
        await user.save();
    } catch (err) {
        console.log("Error saving user:", err.message);
    }
}

// Fail only the model level validation.
async function failModel() {

    // Create user with valid data.
    let user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 20,
        password: 'password123!',
        confirmPassword: 'wrong',
    });

    // Try to save the user to the database.
    try {
        await user.save();
    } catch (err) {
        console.log("Error saving user:", err.message);
    }
}

// The model saves successfully.
async function success() {

    // Create user with valid data.
    let user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 20,
        password: 'password123!',
        confirmPassword: 'password123!'
    });

    // Try to save the user to the database.
    try {
        await user.save();
        console.log("User saved successfully.");
    } catch (err) {
        // Never reaches here.
        console.log("Error saving user:", err.message);
    }
}

// Boiler plage code to run the examples.
if (process.argv.includes('--create')) {
    sequelize.sync({ force: true })
        .then(() => {
            console.log("Database & tables created!");
        });
} else if (process.argv.includes('--drop')) {
    sequelize.drop()
        .then(() => {
            console.log("Database & tables dropped!");
        });
} else if (process.argv.includes('--fail-built-in')) {
    console.log("This time the built in validators will fail.");
    await failBuiltIn();

} else if (process.argv.includes('--fail-custom')) {
    console.log("This time the custom validators will fail.");
    await failCustom();

} else if (process.argv.includes('--fail-model')) {
    console.log("This time the model level validators will fail.");
    await failModel();

} else if (process.argv.includes('--success')) {
    console.log("This time all validators will pass.");

} else {
    console.log("No options were passed. Try one of:");
    console.log(" --create");
    console.log(" --drop");
    console.log(" --fail-built-in");
    console.log(" --fail-custom");
    console.log(" --fail-model");
    console.log(" --success");
}