const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    for (currentUser of users) {
        if (currentUser.username === username) {
            return true;
        }
    }
    return false;
}

const authenticatedUser = (username,password)=>{
    for (currentUser of users) {
        if (currentUser.username === username && currentUser.password === password) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || ! password) {
        return res.status(480).json({message: "Error: invalid credentials"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).json({message: "User successfully logged in."});
    } else {
        return res.status(208).json({message: "Invalid login. Check username and password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
