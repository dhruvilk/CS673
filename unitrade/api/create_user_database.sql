CREATE DATABASE UserDatabase;

USE UserDatabase;

CREATE TABLE Users (
    userID VARCHAR(16) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);