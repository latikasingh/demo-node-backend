var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var CoursesSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number
    },
    image:{
        type:String
    },
    instructorName:{
        type:String,
        trim:true
    },
    headline:{
        type:String,
        trim:true
    },
    description:{
        type:Array,
    },
    SubCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory'
    }
},{
    collection:'Courses',
    timestamps:true
});

module.exports=mongoose.model('Courses',CoursesSchema);