const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function(req, res){
   const firstName =  req.body.firstname;
   const lastName = req.body.lastname;
   const email = req.body.email;

   const data = {
    members: [
        {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
   }


   const jsonData = JSON.stringify(data);
   const url = 'https://us8.api.mailchimp.com/3.0/lists/f5111711f8'
   const option = {
    method: 'POST',
    auth: process.env.AUTH
   }

   const request  = https.request(url, option, function(response){
        response.on('data', function(data){
           if(response.statusCode === 200){
            console.log(response.statusCode)
            res.sendFile(__dirname + '/success.html')
           }else{
            res.sendFile(__dirname + '/failure.html')
           }
            // console.log(JSON.parse(data));
        })
   })
   request.write(jsonData);
   request.end();

//    console.log('Your request was stored your details are: ' + firstName + lastName + email )
})
app.post('/success', function(req, res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
    console.log('server running on port 3000.')
})

