const { default: axios } = require("axios");
let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods","GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port = process.env.PORT || 2410;
app.listen(port, ()=> console.log(`node app listening on port ${port}!`));

let {contactList} = require("./userData.js");
let {messagesList} = require("./userData.js");

const getTime = ()=>{
    let d = new Date();
    let str = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
    return str;
  }

app.get("/svr/test",function(req,res){
   res.send("Hello Saurabh");
});

app.get("/svr/contactlist",function(req,res){
  res.send(contactList);
});

app.get("/svr/messagelist",function(req,res){
    res.send(messagesList);
});

app.post("/svr/postMessage",async function(req,res){
    let body = req.body;
    messagesList.push(body);
    if(body.id === 5){
       try{
        let response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${body.text}?unitGroup=metric&include=current&key=DHQ8X23YQARDENJ3M6V89PQRJ&contentType=json`);
        let {data} = response;
        let {address,currentConditions} = data;
        let {humidity="",temp="",windspeed="",conditions=""} = currentConditions;
        let str = `Location : ${address} , Temperature : ${temp} , Humidity : ${humidity} , WindSpeed : ${windspeed} , Conditions : ${conditions}`
        console.log(str);
        const newTime = getTime();
        let MyResponseData = {
            id: body.id,
            messageType: "TEXT",
            text:str,
            senderID: 1,
            addedOn: newTime,
          }
        messagesList.push(MyResponseData);
        res.send(messagesList);
       }
       catch(error)
       {
        let {response} = error;
        let {data} = response;
        const newTime = getTime();
        let MyErrorData = {
            id: body.id,
            messageType: "TEXT",
            text:data,
            senderID: 1,
            addedOn: newTime,
          }
        messagesList.push(MyErrorData);
        res.send(messagesList);
       }
    }
    else{
        res.send(messagesList);
    }
    
});