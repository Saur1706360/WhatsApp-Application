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

app.get("/svr/test",function(req,res){
   res.send("Hello Saurabh");
});

app.post("/svr/getData",async function(req,res){
    let url = req.body.url;
    console.log(url);
    let response = await axios.get(url);
    let responseData = JSON.stringify(response.data);
    res.send(responseData);
});