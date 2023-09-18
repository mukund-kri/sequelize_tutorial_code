/*
 * Let's explore the simplest type of relationship between two models: a one-to-one
 * relationship.
 */

// Import Sequelize
import Sequelize from 'sequelize';

// Make the connection to the database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'basics.sqlite'
});

// Define the user model. 
// A user only has two fields in this example: name and email.
const User = sequelize.define('User', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {});

// Define the profile model.
// A profile only has one field in this example: bio.
const Profile = sequelize.define('Profile', {
    bio: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {});

// Define the relationship between User and Profile. A user has one profile. A profile
// belongs to a user. Hence, we say that the relationship is one-to-one.
User.hasOne(Profile);
Profile.belongsTo(User);

// Creating instances
// Create a user instance
async function run() {
    let user = await User.create({
        name: 'John Doe',
        email: 'john.doe#example.com'
    });

    // Create a profile instance
    let profile = await Profile.create({
        bio: 'I am a new user'
    });

    // Associate the profile with the user
    await user.setProfile(profile);

    // Save the user and profile to the database
    await user.save();
}

// Querying
async function query() {
    // Get a user
    let user = await User.findOne({
        where: {
            name: 'John Doe'
        }
    });
    console.log('User profile:', JSON.stringify(user, null, 4));
    // Note the profile is not retrieved by default. We need to explicitly ask for it.

    // Get profile
    let profile = await user.getProfile();
    console.log('User profile:', JSON.stringify(profile, null, 4));
}

// Eager loading
async function eagerLoading() {
    // Get a user, with Profile included
    let user = await User.findOne({
        where: {
            name: 'John Doe'
        },
        include: [Profile]
    });
    console.log('User + profile:', JSON.stringify(user, null, 4));
}

// Sync the models to the database, then run the example.
if (process.argv.includes('--create')) {
    await sequelize.sync({
        logging: console.log
    });
} else if (process.argv.includes('--delete')) {
    await sequelize.drop({
        logging: console.log
    });
} else if (process.argv.includes('--run')) {
    await run();
} else if (process.argv.includes('--query')) {
    await query();
} else if (process.argv.includes('--eager')) {
    await eagerLoading();
}