const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());
var available;

var session = require("express-session"); // Add this line to import express-session

// Configure the express-session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    
  })
);


app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

app.get("/accountCreation", function (req, res) {
  res.sendFile(__dirname + "/accountCreation.html");
});

app.post('/accountCreation', function(req, res){
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  console.log(" im called")
  console.log(name, username, password);

  profile = {
    name,
    username,
    password
  }

  fs.readFile('data.json', 'utf-8', (err, data)=>{
    if(err)
    {
      console.log("Error while reading user file")
    }
    
    const users = JSON.parse(data);

    const available = users.find(u => u.username === username);
    if (available) {
      return res.status(409).send('User with the same username already exists.');
    }

    users.push({name, username, password })

    fs.writeFile('data.json', JSON.stringify(users), (err)=>{
      if(err){
          res.send(profile);
      }

      res.redirect('/');
    })

  })

  

 
})

app.get("/styles.css", function (req, res) {
  res.sendFile(__dirname + "/styles.css");
});

app.get("/", function (req, res) {
    debugger
    if(!req.session.isLoggedIn)
    {
        debugger;
        res.redirect('/login');
        return;
    }

    res.sendFile(__dirname + '/landingPage.html')
  
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username, password);

  fs.readFile('data.json', 'utf-8', function(err, data){
    if(err)
    {
      console.log(err)
      return;
    }

    const users = JSON.parse(data);
    const user = users.find(u=> u.username ===username && u.password === password);

    if (user) {
      
      res.cookie('username', user.username);
      req.session.isLoggedIn = true;
      return res.redirect('/');
    } else {
      return res.redirect('/login');
    }


  })

  // if (username == "t" && password == "t") {

  //   req.session.isLoggedIn = true;
  //   req.session.username = username;
  //   debugger;
  //   res.redirect("/");
  //   return;
  // }

  // res.status(401).send("error");
});


function addUserName(){

}


// function isUserNameAvailable(username){
//     fs.readFile('data.json', 'utf-8', function(err, data){
//         if(err){
//             console.log(err)
//             return;
//         }

//         const users = JSON.parse(`[${data.replace(/}{/g, '},{')}]`);
//         console.log(users);
//         // return true;

//         for (const user of users) {
//             if (user.username === username) {
//               available =  false; // Username already taken
//             }
//           }

//           available =  true;

//     })
// }

app.get('/logout', (req, res) => {
  res.isLoggedIn = false;
  res.clearCookie('username');
  return res.redirect('/');
});