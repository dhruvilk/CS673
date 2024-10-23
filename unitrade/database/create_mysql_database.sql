CREATE DATABASE database_development;

USE database_development;

CREATE TABLE User (
    id VARCHAR(32) NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE BankAccount (
    id VARCHAR(32) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    swift VARCHAR(11) NOT NULL,
    bank_name VARCHAR(32) NOT NULL,
    account_holder VARCHAR(32) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Trade (
    id VARCHAR(32) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    porfolio_id VARCHAR(16) NOT NULL,
    transaction_id VARCHAR(16) NOT NULL,
    asset_type VARCHAR(16) NOT NULL,
    trade_type ENUM('buy', 'sell'),
    price FLOAT NOT NULL,
    status ENUM('pending', 'exectued', 'canceled', 'failed', 'settled'),
    PRIMARY KEY (id),
    FOREIGN KEy (user_id) REFERENCES User(id),
    FOREIGN KEY (porfolio_id) REFERENCES Portfolio(id),
);

CREATE TABLE Portfolio (
    id VARCHAR(32) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    asset_type VARCHAR(16) NOT NULL,
    quantity FLOAT NOT NULL,
    current_price FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);