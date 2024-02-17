CREATE DATABASE IF NOT EXISTS mercadoqr_db;

show databases;

use mercadoqr_db;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id BINARY(16) DEFAULT(UUID_TO_BIN(UUID())),
    user_name VARCHAR(50) NOT NULL,
    user_lastname VARCHAR(50) NOT NULL,
    user_email VARCHAR(70) NOT NULL UNIQUE,
    user_passwordHash TEXT NOT NULL,
    user_balance INT NOT NULL DEFAULT 0,
    user_subscriptions INT NOT NULL DEFAULT 0,
    user_places INT NOT NULL DEFAULT 0,
    user_qrs INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    PRIMARY KEY(user_id)
);

DROP TABLE IF EXISTS places;
CREATE TABLE places(
    place_id INT AUTO_INCREMENT,
    place_name VARCHAR(20) NOT NULL UNIQUE,
    place_location VARCHAR(50),
    place_description VARCHAR(100),
    place_img VARCHAR(100),
    place_social VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    user_id BINARY(16) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY(place_id)
);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT,
    place_id INT NOT NULL,
    category_name VARCHAR(30) NOT NULL,
    FOREIGN KEY(place_id) REFERENCES places(place_id),
    PRIMARY KEY(category_id)
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id INT AUTO_INCREMENT,
    category_id INT NOT NULL,
    place_id INT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    product_price INT UNSIGNED NOT NULL,
    product_img VARCHAR(100) NOT NULL,
    FOREIGN KEY(place_id) REFERENCES places(place_id),
    FOREIGN KEY(category_id) REFERENCES categories(category_id),
    PRIMARY KEY(product_id)
);

DROP TABLE IF EXISTS qrs;
CREATE TABLE qrs (
    qr_id INT AUTO_INCREMENT,
    user_id BINARY(16) NOT NULL,
    place_id INT NOT NULL,
    product_id INT NOT NULL,
    qr_code VARCHAR(6) NOT NULL,
    expiration  INT NOT NULL DEFAULT 7,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    FOREIGN KEY(place_id) REFERENCES places(place_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(product_id) REFERENCES products(product_id),
    PRIMARY KEY(qr_id)
);

DROP TABLE IF EXISTS subscriptions;
CREATE TABLE subscriptions (
    user_id BINARY(16) NOT NULL,
    place_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(place_id) REFERENCES places(place_id),
    PRIMARY KEY(user_id, place_id)
);

DROP TABLE IF EXISTS rolls;
CREATE TABLE rolls (
    roll_id INT AUTO_INCREMENT,
    place_id INT NOT NULL,
    roll_name VARCHAR(20) NOT NULL,
    roll_color VARCHAR(20) NOT NULL,
    FOREIGN KEY(place_id) REFERENCES places(place_id),
    PRIMARY KEY(roll_id)
);

