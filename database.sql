CREATE DATABASE auracare_db;
USE auracare_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
select * from users;
INSERT INTO users (username, email, password) 
VALUES ('sri', 'sridevi@rasa.com', 'password');


