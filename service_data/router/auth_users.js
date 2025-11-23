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

    // Check if username or password is missing
    if (!username || ! password) {
        return res.status(480).json({message: "Error: invalid credentials"});
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
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
    const number = req.params.isbn;
    const username = req.body.username;
    const review = req.body.review;

    if (books[number]) {
        let bookReviews = books[number].reviews;
        for (let note in bookReviews) {
            if (bookReviews[note].user === username) {
                // user review has been found
                bookReviews[note].message = review;
                return res.status(200).json({message: "Successfully updated review for book " +
                                             number.toString() + "and user" + username});
            }
        }
        // user review has not been found
        const newReview = {"user": username, "message":review};
        bookReviews[bookReviews.length + 1] = newReview;
        return res.status(200).json({message: "Successfully add a new review for book " +
                                     number.toString() + "and user" + username});
    } else {
        return res.status(410).json({message: "Error: No book found for given isbn"});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const number = req.params.isbn;
    const username = req.body.username;

    if (books[number]) {
        let bookReviews = books[number].reviews;
        let note = 0;
        for (note in bookReviews) {
            if (bookReviews[note].user === username) {
                // user review has been found
                delete bookReviews[note];
            }
        }
        // shift all indexes after note
        for (let indiex in bookReviews) {
            if (index > note) {
                // user review has been found
                index = index - 1;
            }
        }
        return res.status(200).json({message: "Successfully deleted user review for book " +
                                     number.toString() + "and user" + username});
    } else {
        return res.status(410).json({message: "Error: No book found for given isbn"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
