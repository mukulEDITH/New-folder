const express = require('express');
const methodOverride = require('method-override');
const app = express();

// Importing required models and libraries
const User = require('./Models/Schema');
const Blog = require('./Models/blogSchema');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Connecting to the database
const db = process.env.DATABASE;
mongoose.connect(db).then(() => {
  console.log('Connected to the database');
});

// Configuring the app
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Handling the root route
app.get("/", (req, res) => {
  res.render("index");
});

// Handling the form submission
app.post('/', async (req, res) => {
  const data = new Blog(req.body);
  await data.save();
  res.send("Data Saved");
});

// Displaying the data
app.get("/show", async (req, res) => {
  const items = await Blog.find({});
  res.render('show', { items: items });
});

// Editing the data
app.get("/show/:id/edit", async (req, res) => {
  const { id } = req.params;
  const items = await Blog.findById(id);
  res.render('edit', { items });
});

// Updating the data
app.put("/show/:id", async (req, res) => {
  const { id } = req.params;
  const items = await Blog.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect("/");
});

// Deleting the data
app.delete('/show/:id', async (req, res) => {
  const { id } = req.params;
  const deleteItem = await Blog.findByIdAndDelete(id);
  res.redirect("/show");
});

// Adding data to the document by ID
app.get('/addData', (req, res) => {
  res.render('addData.ejs');
});

app.post('/addData', (req, res) => {
  const newData = req.body.newData; // Get the new data from the request body

  // Find the document by ID and add new data
  Blog.findById('64a679485f7d3aead81e9ae7')
    .then(document => {
      // Add the new data to the document
      document.Comment = newData; // Assuming Comment is the field you want to add

      // Save the updated document
      return document.save();
    })
    .then(updatedDocument => {
      console.log('Data added successfully:', updatedDocument);
      res.redirect('/'); // Redirect back to the home page or any other page
    })
    .catch(error => {
      console.error('Error:', error);
      res.redirect('/'); // Redirect back to the home page or any other page
    });
});

// Starting the server
app.listen(7001, () => {
  console.log(`Server running on port 7001`);
});
