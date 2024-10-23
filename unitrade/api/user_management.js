/*
    putting an item into your cart will respond to this API by...
        - GET api/marketplace/1/items/itemID (the API getting the itemID from marketplace1)
        - SQL query (these queries insert into cart, decrement stock from marketplace, and sets a timer on the item within someone's cart): 

            SELECT stock FROM marketplace WHERE item_id = itemID; (we will grab the stock of the item by using itemID)

            UPDATE marketplace SET stock = stock - 1 WHERE item_id = itemID AND stock > 0; (this query will decrement the stock of the selected item by 1)

            INSERT INTO cart_items (user_id, item_id, marketplace_id, CURRENT_TIMESTAMP) SELECT user_id, item_id, marketplace_id FROM marketplace WHERE item_id = itemID
            (the cart_items table will hold items currently within people's carts with a timer)

*/
const { register } = require('module');
const mysql = require('mysql2');
const crypto = require('crypto');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validator = require('validator');

//initializing sql connection attributes
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'database_development'
});

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'database_development'
})
//connecting to user database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) =>{
    res.send('hello world!!');
});

app.post('/api/register', (req, res) =>{
    //console.log("Request Body:", req.body); // Log the whole body

    const user = { //place request body into a const for readability
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    let password_length_ok = false;
    let username_length_ok = false;
    let email_validator_ok = false;

    if (req.body.username.length < 8) { 
        res.status(400).send('Username is too short');
    }
    else{
        username_length_ok = true;
    }

    if (req.body.password.length < 8) {
        res.status(400).send('Password is too short');
    }
    else{
        password_length_ok = true;
    }

    if(validator.isEmail(user.email) == false){
        res.status(400).send('Email is invalid');
    }
    else{
        email_validator_ok = true;
    }

    if(password_length_ok && username_length_ok && email_validator_ok){
        pool.getConnection((err, connection) => {
            registerNewUser(user.username, user.password, user.email, connection);
            connection.release();
        })
        res.send(`Hi, ${user.username}! Your account has been successfully created!`);
    }
});

// PORT
//to declare ports on windows, command 'export PORT=<insert port number>'
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

//user management functions
async function getAllUserInfo(){
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Users', (err, results) => {
            if (err) {
                console.error('Query error:', err);
                return reject(err)
            } else {
                resolve(results);
            }
        });
    });
}

async function registerNewUser(name, password, email, connection){
    //Generate random bytes
    const length = 32;
    const bytes = crypto.randomBytes(length);
    const id = bytes.toString('hex').slice(0, length);

    //Create query
    const query = 'INSERT INTO user (id, name, password, email) VALUES (?, ?, ?, ?)';
    const values = [id, name, password, email];
    
    try {
        connection.execute(query, values);
        console.log('User inserted with ID: ', id);
    }
    catch (err){
        console.error('Error inserting user: ', err);
    }
}

//example of declaring a variable that holds a mysql table values

/*
(async () => {
    try{
        const a = await registerNewUser('testUser', '1234', 'test1@test.com');
        const b = await getAllUserInfo();
        console.log(b);
    }
    catch (err){
        console.error('Error fetching user information: ', err)
    }
})();
*/

