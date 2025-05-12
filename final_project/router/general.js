const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")

// Check if a user with the given username already exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const booksMap = new Map(Object.entries(books));
  const book = booksMap.get(req.params.isbn);
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const booksInfo = Object.values(books);
  const filteredBooks = booksInfo.filter((book) => book.author === req.params.author);
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const booksInfo = Object.values(books);
  const filteredBooks = booksInfo.filter((book) => book.title === req.params.title);
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const booksMap = new Map(Object.entries(books));
  const book = booksMap.get(req.params.isbn);
  return res.status(200).json(book.reviews);
});

// Get the book list available in the shop with axios
public_users.get('/allBooks', async function (req, res) {
  const response = await axios.get("http://127.0.0.1:5000/")
  return res.status(response.status).send(response.data)
});

// Get book details based on ISBN with axios
public_users.get('/asyncIsbn/:isbn', async function (req, res) {
  const response = await axios.get(`http://127.0.0.1:5000/isbn/${req.params.isbn}`)
  return res.status(response.status).send(response.data)
});

// Get book details based on author with axios
public_users.get('/asyncAuthor/:author', async function (req, res) {
  const response = await axios.get(`http://127.0.0.1:5000/author/${req.params.author}`)
  return res.status(response.status).send(response.data)
});

// Get all books based on title with axios
public_users.get('/asyncTitle/:title', async function (req, res) {
  const response = await axios.get(`http://127.0.0.1:5000/title/${req.params.title}`)
  return res.status(response.status).send(response.data)
});

module.exports.general = public_users;
