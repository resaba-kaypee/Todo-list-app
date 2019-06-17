let bodyParser = require('body-parser');
let mongoose = require('mongoose');

// Connect to the database

mongoose.connect('mongodb+srv://test:test@cluster0-lfprl.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, err => {
  if (err) {
    console.log('error: ' + err);
  } else {
    console.log('connected to db')
  }
})

// Create a schema - blueprint
let todoSchema = new mongoose.Schema({
  item: String
});

let Todo = mongoose.model('Todo', todoSchema);

let urlencodedParser = bodyParser.urlencoded( {extended: false} )

module.exports = function(app) {

  app.get('/todo', function (req, res) {
    // get data from db and pass to the view
    Todo.find({}, (err, data) => {
      if (err) throw err;
      res.render('todo', {todos: data});
    })
  })

  app.post('/todo', urlencodedParser, function (req, res) {
    // get data from view then add to db
    let newTodo = Todo(req.body).save((err, data) => {
      if (err) throw err;
      res.json(data);
    })
  })

  app.delete('/todo/:item', function (req, res) {
    // delete the requested item from db
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne((err, data) => {
      if (err) throw err;
      res.json(data);
    })
  });
}