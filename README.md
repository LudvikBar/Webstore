# Webstore
<br>

⚠️ As this project is mainly for learning and will not be actully used, the auth information normaly stored in a .env file **is NOT in a .env file** and it is therefor viewable for everyone with access to the code. ⚠️

<br>

### In this project I will create a webstore, with auth, and the normal webstore features.


The project will utilize express and express-session + bcrypt and MySQL/MariaDB.

<br>
<br>

# Setup guide - In 3 steps


1. Clone the repo in the desiered location with the terminal
    > git clone https://github.com/LudvikBar/Webstore.git


2. Make sure you have node.js installed. 

3. Go into the repo folder

3. Run the following:

    > npm install

    **To run the project:**
    >npm start
    







## Mariadb
The code bellow is for setup of the database, tables and user. Feel free to change the names and passwords and note that changing it will result in changes needed in other areas. Three placeholder products are also included.

```
CREATE DATABASE auth_app;
USE auth_app;


CREATE TABLE Users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  image       VARCHAR(255),
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, image) VALUES
('Product 1', 'This is product 1', 9.99,  'product1.jpg'),
('Product 2', 'This is product 2', 19.99, 'product2.jpg'),
('Product 3', 'This is product 3', 29.99, 'product3.jpg');

CREATE USER 'auth_user'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON auth_app.* TO 'auth_user'@'localhost';
FLUSH PRIVILEGES;

```
