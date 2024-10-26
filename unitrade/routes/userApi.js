/*
    putting an item into your cart will respond to this API by...
        - GET api/marketplace/1/items/itemID (the API getting the itemID from marketplace1)
        - SQL query (these queries insert into cart, decrement stock from marketplace, and sets a timer on the item within someone's cart): 

            SELECT stock FROM marketplace WHERE item_id = itemID; (we will grab the stock of the item by using itemID)

            UPDATE marketplace SET stock = stock - 1 WHERE item_id = itemID AND stock > 0; (this query will decrement the stock of the selected item by 1)

            INSERT INTO cart_items (user_id, item_id, marketplace_id, CURRENT_TIMESTAMP) SELECT user_id, item_id, marketplace_id FROM marketplace WHERE item_id = itemID
            (the cart_items table will hold items currently within people's carts with a timer)

*/
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const express = require('express');

const app = express();

// PORT
//to declare ports on windows, command 'export PORT=<insert port number>'
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

//initializing sql pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'database_development'
})

//testing connection to user database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
    connection.release();
})

//middleware to obtain json data and parse body data
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*
    Registration Endpoint
    - Verifies user credentials are correct and will add a user to the sql table as 
    long as the input has a unique username and email. 
    - Username, password, and email must also be at least 8 char long.
*/

app.post('/api/register', async (req, res) =>{
    //place request body into a const for readability
    const user = { 
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    //variables to test user input
    let password_length_ok = false;
    let username_length_ok = false;
    let email_validator_ok = false;
    let user_is_valid = false;

    //username testing
    if (req.body.username.length < 8) { 
        res.status(400).send('Username is too short. Make sure your username is at least 8 characters long.');
    }
    else{
        username_length_ok = true;
    }

    //password testing
    if (req.body.password.length < 8) {
        res.status(400).send('Password is too short. Make sure your password is at least 8 characters long');
    }
    else{
        password_length_ok = true;
    }

    //email testing
    if(validator.isEmail(user.email) == false){
        res.status(400).send('Email is invalid. Make sure it follows basic email conventions (e.g. johndoe@gmail.com)');
    }
    else{
        email_validator_ok = true;
    }

    //if all credentials pass, then a connection is opened and adds a new user to the sql pool
    if(password_length_ok && username_length_ok && email_validator_ok){
        user_is_valid = true;
    }

    if(user_is_valid){
        pool.getConnection(async (err, connection) => {
            try{
                //create query to find existing user
                const existing_user_name = await getUserByName(user.username, connection);
                const existing_user_email = await getUserByEmail(user.email, connection);

                //if the email already exists, then the user needs to change their email
                if(typeof existing_user_email != 'undefined' && user_is_valid){
                    if(existing_user_email.length > 0 && existing_user_email[0].email.toLowerCase()  === user.email.toLowerCase() ){
                        console.log('email', existing_user_email);
                        res.send(`It seems this email is already being user for another account. Please use a different email.`);
                        user_is_valid = false;
                    }
                }

                //if the username already exists, then the needs to change their name
                if(typeof existing_user_name != 'undefined' && user_is_valid){
                    if(existing_user_name.length > 0 && existing_user_name[0].name.toLowerCase() === user.username.toLowerCase()){
                        console.log('name', existing_user_name);
                        res.send(`It seems this username is already being user for another account. Please use a different username.`);
                        user_is_valid = false;
                    }
                }

                if(user_is_valid){
                    await registerNewUser(user.username, user.password, user.email, connection);
                    res.send(`Hi, ${user.username}! Your account has been successfully created!`);
                }
            }
            catch (error){
                console.error('Error during user registration:', error);
                return res.status(500).send('Internal Server Error');
            }
            finally{
                connection.release();
            }
        });
    }
});

/*
    Login Endpoint
    - Verifies username and password are correct and returns the sql column with the user's information. 
*/

app.post('/api/login', async (req, res) =>{

    //place request body into a const
    const login_credentials = { 
        username: req.body.username,
        password: req.body.password,
    };

    //create connection with sql table
    pool.getConnection(async (err, connection) => {

        //try grabbing user information
        try{

            //this function will grab user information and return a list with the user information
            const user_login_result = await loginUser(login_credentials.username, login_credentials.password, connection);
            console.log('USER LOGIN ', user_login_result);
            //validating if the user exists and has the right password
            if(user_login_result.length > 0){
                const isValid = await bcrypt.compare(login_credentials.password, user_login_result[0].password);
                console.log('VALID PASSWORD ',isValid);
                //if user was found, send a respond saying login was successful
                if(user_login_result.length > 0 && isValid){
                    res.send('Login successful!');
                }
                else{
                    res.send('Your username or password is incorrect.');
                }
            }
            else{
                res.send('Your username or password is incorrect!');
            }

            //release connection
            connection.release();
        }
        catch (err){
            console.error('Error fetching user information: ', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

/*==============================

    user management functions

==============================*/
async function registerNewUser(name, password, email, connection){
    try {
        //Generate random bytes
        const length = 32;
        const bytes = crypto.randomBytes(length);
        const id = bytes.toString('hex').slice(0, length);
        
        //hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(password, salt);

        //Create query
        const query = 'INSERT INTO user (id, name, password, email) VALUES (?, ?, ?, ?)';
        const values = [id, name, hash, email];
    
        //execute query and insert values
        await connection.execute(query, values);
        console.log('User inserted with ID: ', id);
    }
    catch (err){
        console.error('Error inserting user: ', err);
    }
}

async function loginUser(name, password, connection){
    return new Promise((resolve, reject) => {

        //create query
        const query = 'SELECT * FROM user WHERE name = ?';
        const values = [name]

        //try grabbing the user credentials with the query
        try {
            connection.execute(query, values, (error, results) =>{
                if(error){
                    console.error('Database error: ', error);
                    //return error if something goes wrong
                    return reject(err);
                }
                else{
                    //return user body credentials
                    resolve(results);
                }
            });
        }
        catch (err){
            console.error('Error within function loginUser: ', err);
        }
    });
}

async function getAllUserInfo(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user', (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return reject(err)
            } else {
                resolve(results);
            }
        });
    });
}

async function getUserByName(name, connection){
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM user WHERE LOWER(name) = LOWER(?)';
        const values = [name];
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return reject(err)
            } else {
                resolve(results);
            }
        });
    });
}

async function getUserByEmail(email, connection){
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM user WHERE LOWER(email) = LOWER(?) ';
        const values = [email];
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return reject(err)
            } else {
                resolve(results);
            }
        });
    });
}
