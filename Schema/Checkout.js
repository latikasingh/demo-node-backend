var mongoose=require("mongoose");
var Schema=mongoose.Schema;

//structure of schema
var CheckoutSchema=new Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    token_id:{
        type:String,
        trim:true
    },
    payment_type:{
        type:String,
        trim:true
    },
    card_brand:{
        type:String,
        trim:true
    },
    country:{
        type:String,
        trim:true
    },
    address:{
        type:String,
        trim:true
    },
    state:{
        type:String,
        trim:true
    },
    city:{
        type:String,
        trim:true
    },
    zip:{
        type:String,
        trim:true
    },
    Buy_Course:{
        type:Array
    },
    tot_price:{
        type:Number
    },
    orderdate:{
        type:Date,
        default:Date()
    },
    loginuserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    collection:'Checkout',
    timestamps:true
});

module.exports=mongoose.model('Checkout',CheckoutSchema);