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


//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
];

app.get('/', (req, res) =>{
    res.send('hello world!!');
});

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});

app.post('/api/register', (req, res) =>{
    console.log("Request Body:", req.body); // Log the whole body

    const user = { //place request body into a const for readability
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    if (!req.body.username || !req.body.password || !req.body.email) { //return a status if any of the credentials are undefined
        return res.status(400).send('Missing fields');
    }
    else{
        registerNewUser(user.username, user.password, user.email);
        res.send(user.username);
        console.log("log ",user.username);
    }
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('Course with given ID not found');
    res.send(course);
});

// PORT
//to declare ports on windows, command 'export PORT=<insert port number>'
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

//initializing sql connection attributes
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'userdatabase'
});

//connecting to user database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});


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

/*
    Register 

*/

async function registerNewUser(username, password, email){
    //Generate random bytes
    const length = 16;
    const bytes = crypto.randomBytes(length);
    const userID = bytes.toString('hex').slice(0, length);

    //Create query
    const query = 'INSERT INTO Users (userID, username, password, email) VALUES (?, ?, ?, ?)';
    const values = [userID, username, password, email];
    
    try {
        connection.execute(query, values);
        console.log('User inserted with ID: ', userID);
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

