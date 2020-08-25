var express=require('express');
var cors=require('cors');

var mongoose=require("mongoose");

var app=express();
app.use(cors());
app.use(express.json());

const router=express.Router();

mongoose.connect("mongodb://localhost:27017/Course_udemy",{});
mongoose.connection.on('error',function(error){
   console.log("an error occured while making db connection",error);
    process.exit(1);
}).once('open',function(){
    console.log("mongoose connection succesfully");
});

app.use('/Upload',express.static("Upload"));
app.use('/Lectures',express.static("Lectures"));
var Course_udemy=require('./Course_udemy');
app.use('/Course_udemy',Course_udemy);

app.use(router);

app.listen(3000,function(error){
    if(error)
        console.log("An error occured while during executaion",error);
    console.log("node application successfully started on http://localhost:3000");
});
