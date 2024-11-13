/*
    putting an item into your cart will respond to this API by...
        - GET api/marketplace/1/items/itemID (the API getting the itemID from marketplace1)
        - SQL query (these queries insert into cart, decrement stock from marketplace, and sets a timer on the item within someone's cart): 

            SELECT stock FROM marketplace WHERE item_id = itemID; (we will grab the stock of the item by using itemID)

            UPDATE marketplace SET stock = stock - 1 WHERE item_id = itemID AND stock > 0; (this query will decrement the stock of the selected item by 1)

            INSERT INTO cart_items (user_id, item_id, marketplace_id, CURRENT_TIMESTAMP) SELECT user_id, item_id, marketplace_id FROM marketplace WHERE item_id = itemID
            (the cart_items table will hold items currently within people's carts with a timer)

*/
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const express = require('express');
const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');


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
});

/*============
    Middleware
============*/
app.use('/public', express.static(path.join(__dirname, 'static')))
app.set('view engine', 'ejs');
app.use(express.json());

//creating session
app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: true,
}));

//using flash messenger
app.use(flash());

// Middleware to make flash messages available in templates
app.use((req, res, next) => {
    res.locals.messages = req.flash('error');
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));


/*============
    Registration Endpoint
    - Verifies user credentials are correct and will add a user to the sql table as 
    long as the input has a unique username and email. 
    - Username, password, and email must also be at least 8 char long.
============*/

app.get('/', (req, res) => {
    //BRING USER TO LANDING PAGE
});

app.get('/api/register', async (req, res) =>{
    const username = req.session.username || ''; // Retrieve from session
    const email = req.session.email || ''; // Retrieve from session
    const messages = req.flash('error'); // Retrieve flash messages

    return res.render('register', {username, email, messages});
});

app.post('/api/register', async (req, res) => {
    const { username, password, email, confirmPassword } = req.body;
    const messages = [];

    // Basic validation
    if (username.length < 8) messages.push('Username must be at least 8 characters long.');
    if (password.length < 8) messages.push('Password must be at least 8 characters long.');
    if (password !== confirmPassword) messages.push('The confirmed password does not match.');
    if (!validator.isEmail(email)) messages.push('Email is invalid.');

    if (messages.length > 0) {
        messages.forEach(msg => req.flash('error', msg));
        return res.render('register', {username, email});
    }

    // Check for existing user by username or email
    const connection = await pool.getConnection();

    try {
        const [existingUserByName] = await connection.execute('SELECT * FROM user WHERE LOWER(name) = LOWER(?)', [username]);
        const [existingUserByEmail] = await connection.execute('SELECT * FROM user WHERE LOWER(email) = LOWER(?)', [email]);

        if (existingUserByEmail.length > 0) messages.push('This email is already in use.');
        if (existingUserByName.length > 0) messages.push('This username is already in use.');

        if (messages.length > 0) {
            messages.forEach(msg => req.flash('error', msg));
            return res.render('register', { username, email});
        }

        // Hash password and insert new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = crypto.randomBytes(16).toString('hex');

        await connection.execute(
            'INSERT INTO user (id, name, password, email) VALUES (?, ?, ?, ?)',
            [userId, username, hashedPassword, email]
        );

        res.send(`Hi, ${username}! Your account has been successfully created!`);
    } 
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        connection.release();
    }
});


/*============
    Login Endpoint
    - Verifies username and password are correct and returns the sql column with the user's information. 
============*/

app.get('/api/login', async (req, res) =>{
    const username = req.session.username || ''; // Retrieve from session
    const messages = req.flash('error'); // Retrieve flash messages

    return res.render('login', {username, messages});
});

app.post('/api/login', async (req, res) => {
    
    const messages = [];
    const {username, password} = req.body;

    try {
        // Create a connection to the database
        const connection = await pool.getConnection();
        // Attempt to retrieve user data based on the provided username
        console.log("grabbing user login result by name");
        const user_login_result = await getUserByName(username, connection);

        
        console.log(user_login_result.length);
        if (user_login_result.length > 0) {
            // Validate the password using bcrypt
            const isValid = await bcrypt.compare(password, user_login_result[0].password);
            console.log('VALID PASSWORD ', isValid);
            if (isValid) {
                messages.push('Login successful!');
            } 
            else {
                messages.push('Your username or password is incorrect.');
            }
        } 
        else {
            messages.push('Your username or password is incorrect.');
        }

        if (messages.length > 0) {
            messages.forEach(msg => req.flash('error', msg));
            return res.render('login', {username});
        }

        // Release the connection
        connection.release();
    } catch (err) {
        console.error('Error during login process: ', err);
        res.status(500).send('Internal Server Error');
    }
});

/*==============================

    user management functions

==============================*/

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

async function getUserByName(name, connection) {
   // Create the database connection
    try {
        // Define the query
        const query = 'SELECT * FROM user WHERE LOWER(name) = LOWER(?)';
        
        // Execute the query
        const [rows] = await connection.execute(query, [name]);
        
        // Check if any user is found
        if (rows.length > 0) {
            //console.log('User found:', rows[0]);
            return rows;
        } else {
            console.log('No user found with that name.');
            return null;
        }
    } catch (error) {
        console.error('Error finding user:', error);
        throw error; // rethrow error after logging it
    } 
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
