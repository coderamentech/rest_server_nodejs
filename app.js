var express    = require('express');
var app        = express();

var crypto = require('crypto');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get reference to express router
var router = express.Router();

var users;

//-- Loading and saving data --

var fs = require('fs');

function saveData() {
  console.log(users);
  fs.writeFileSync('data_users.json', JSON.stringify(users));
}

function loadData() {
  var contents = fs.readFileSync('data_users.json', 'utf8');
  users = JSON.parse(contents);
  console.log(users);
}

//-- Routes --

router.get('/', function(req, res) {
    res.json({ message: '/' });
});

router.post('/sessions', function(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    pass = crypto.createHash('md5').update(pass).digest('hex');

    var code = 401;
    for (index in users) {
      var user = users[index];
      if (user.email == email && user.password == pass) {
        code = 200;
        break;
      }
    }
    res.status(code).send();
});

router.get('/users', function(req, res) {
    res.json(users);
});


process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  saveData();
  process.exit( );
})

// Register routes and indicate that they
// will start with prefix ''
app.use('/', router);

loadData();

app.listen(8002);
