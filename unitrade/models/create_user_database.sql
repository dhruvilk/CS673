CREATE DATABASE database_development;

USE database_development;

CREATE TABLE User (
    id VARCHAR(32) NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE BankAccount (
    id VARCHAR(32) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    swift VARCHAR(11) NOT NULL,
    bank_name VARCHAR(32) NOT NULL,
    account_holder VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPON UPDATE CURRENT_TIMESTAMP,
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
    price DECIMAL NOT NULL,
    status ENUM('pending', 'exectued', 'canceled', 'failed', 'settled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEy (user_id) REFERENCES User(id),
    FOREIGN KEY (porfolio_id) REFERENCES Portfolio(id),
);

CREATE TABLE Portfolio (
    id VARCHAR(32) NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    asset_type VARCHAR(16) NOT NULL,
    quantity DECIMAL NOT NULL,
    current_price DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMPON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE TransactionHistory (
    id VARCHAR(32) NOT NULL,
    trade_id VARCHAR(32) NOT NULL,
    status_change ENUM('pending', 'exectued', 'canceled', 'failed', 'settled') NOT NULL,
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (trade_id) REFERENCES Trade(id)
);

CREATE TABLE Settlement (
    id VARCHAR(32) NOT NULL,
    trade_id VARCHAR(32) NOT NULL,
    settlement_date TIMESTAMP,
    settlement_amount DECIMAL NOT NULL,
    settlement_currency VARCHAR(32) NOT NULL,
    bank_account_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (trade_id) REFERENCES Trade(id),
    FOREIGN KEY (bank_account_id) REFERENCES BankAccount(id)
);

CREATE TABLE Sessions (
    sid VARCHAR(36) NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire DATETIME NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);