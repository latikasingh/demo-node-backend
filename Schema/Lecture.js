var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var LectureSchema=new Schema({
    lectureTitle:{
        type:String,
        required:true,
        trim:true
    },
    video:{
        type:String
    },
    duration:{
        type:Number
    },
    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section'
    }
},{
    collection:'Lecture',
    timestamps:true
});

module.exports=mongoose.model('Lecture',LectureSchema);