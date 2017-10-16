const env = 'development';
const config = require('./module.js')[env];
const knex = require('knex')(config);
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 8000;
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.get('/users', function(req, res) {
  knex('members').then((result) => {
      let membersArr = result
      res.render('index', {result: membersArr})
    })
    .catch((err) => {
      console.error(err)
    });
});


app.get('/user/:id', function(req, res) {
  knex('members')
    .where('id', req.params.id)
    .then((result) => {
      let membersArr = result
      res.render('profile', {result: membersArr[0]})
    })
    .catch((err) => {
      console.error(err);
    })

});

app.post('/users', function(req, res) {
  knex('members')
    .insert({
      first: req.body.first,
      last: req.body.last,
      email: req.body.email,
      age: req.body.age
    }, '*')
    .then((result) => {

      res.redirect("/users")
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/delete/:id', function(req, res) {
  knex('members')
    .del()
    .where('id', req.params.id)
    .then(() => {
      res.redirect('/users')
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/edit/:id', function(req, res){
  knex('members')
    .where('id', req.params.id)
    .then((result)=>{
      let membersArr = result
      res.render('edit', {result: membersArr[0]})
    })
    .catch((err) => {
      console.error(err)
    });
});

app.post('/update/:id', function(req, res){
  knex('members')
    .update(req.body)
    .where('id', req.params.id)
    .then(()=>{

      res.redirect('/user/'+req.params.id);
    })
    .catch((err) => {
      console.error(err)
    });
})

app.listen(port, function() {
  console.log('Listening on', port);
});
