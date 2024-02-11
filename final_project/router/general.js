const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookList = JSON.stringify(books, null, 4);
    let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(bookList)
    },1000)
})
    bookPromise.then((bookList) => {
        res.send(bookList);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let bookByISBN = books[isbn];
    let isbnPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(bookByISBN)
        },1000)
    })

    isbnPromise.then((bookByISBN)=> {
        res.send(bookByISBN);
  })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let requested_author = Object.values(books).filter((book) => book.author === author);
  let authorPromise = new Promise((resolve, reject) => {
    setTimeout(() =>{
        resolve(requested_author)
    },1000)
  })

    authorPromise.then((requested_author) => {
        res.send(requested_author);
    })
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let requested_title = Object.values(books).filter((book) => book.title === title);
  let titlePromise = new Promise((resolve, reject) =>{
        setTimeout(() =>{
            resolve(requested_title)
        },1000)
    })

  titlePromise.then((requested_title) => {
    res.send(requested_title);
  })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  let requested_reviews = JSON.stringify(books[isbn].reviews, null, 4);

  res.send(requested_reviews);

  
});

module.exports.general = public_users;
