'use strict';


const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });



// var wss = require('ws').Server;
var s=wss;
var arr = [];

function updateUser(w){
    w.forEach(function e(client){
        client.send(JSON.stringify({
            type: "user",
            user: arr
        }));
        console.log(arr);
        });
    }


s.on('connection', function(ws)
{
    
     ws.on('message',function(message){

        message= JSON.parse(message);

        if(message.type == "name"){
            ws.personName = message.data;
            arr.push(ws.personName);
            updateUser(s.clients);
            return;
        }
        
        console.log("Received: "+message);
        
        s.clients.forEach(function e(client){
            if(client!=ws){
                client.send(JSON.stringify({
                    type: "msg",
                    name: ws.personName,
                    data: message.data
                }));
            }
        });



        //if(message== "hello")
            // ws.send(" from the form server aash:"+message);    

     });
        
     ws.on('close',function(){
        arr.splice(arr.indexOf(ws.personName),1);
        updateUser(s.clients);
        console.log("I lost a client");
     });


     
    
     

});
