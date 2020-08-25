var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var UserSchema=new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    userrole:{
        type:String,
        enum:['Admin','User'],
        trim:true,
        default:'User'
    }
},{
    collection:'User',
    timestamps:true
});

module.exports=mongoose.model('User',UserSchema);