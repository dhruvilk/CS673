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
const crypto = require('crypto');
const { register } = require('module');

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


