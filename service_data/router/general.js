const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const number = req.params.isbn;
  if (books[number]) {
    return res.status(200).send(books[number]);
  } else {
    return res.status(410).json({message: "Error: No book found for given isbn"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const selectedAuthor = req.params.author;
  let foundBooks = [];

  const keys = Object.keys(books);
  for (element in keys) {
    if (books[element].author === selectedAuthor) {
        foundBooks.push(books[element]);
    }
  }
  return res.status(200).json(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const selectedTitle = req.params.title;
  let foundBooks = [];

  const keys = Object.keys(books);
  for (element in keys) {
    if (books[element].title === selectedTitle) {
        foundBooks.push(books[element]);
    }
  }
  return res.status(200).json(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
