var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var SectionSchema=new Schema({
    sectionTitle:{
        type:String,
        required:true,
        trim:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Courses'
    }
},{
    collection:'Section',
    timestamps:true
});

module.exports=mongoose.model('Section',SectionSchema);