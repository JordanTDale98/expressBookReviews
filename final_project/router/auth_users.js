const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
let userswithsamename = users.filter((user) => {
    return user.username === username
});

    if (userswithsamename.length > 0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password){
    return res.status(404).json({message: "Cannot login."});
  }
  if (authenticatedUser(username, password)) {
    let accesstoken = jwt.sign({

        data: password

    },'access', {expiresIn: 60 * 60});

    req.session.authorization = {accesstoken, username}

    return res.status(200).send({message: "Successfully logged in."});
    }
    else{
        return res.status(208).json({message: "Trouble logging in. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let newreview = req.query.review;
  let requested_book_review = books[isbn].reviews;

  if (requested_book_review != newreview){
    requested_book_review = newreview;

    return res.status(200).json({message: "Review successfully added"});
  }
  else{
    return res.status(208).json({message: "You have already written this review."})
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
