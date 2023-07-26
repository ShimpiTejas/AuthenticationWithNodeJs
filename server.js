const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json())


app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});



app.get('/accountCreation', function(req,res){
    res.sendFile(__dirname + '/accountCreation.html')
})

app.get('/styles.css', function(req, res){
    res.sendFile(__dirname  + "/styles.css")
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/landingPage.html')
})

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.post('/login', function(req, res){

    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password)


    if(username == 't' && password == 't')
    {
        res.redirect('/')
        return;
    }

    res.status(401).send("error");


})

